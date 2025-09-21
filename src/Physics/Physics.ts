import * as CANNON from 'cannon';
import { Time } from '../Core/Time';
import { RaycastHit } from './RaycastHit';
import { Ray } from '../Math/Ray';
import { Vector3 } from '../Math/Vector3';
import { Collider } from '../Component/Collider';
import { Rigidbody } from '../Component/RigidBody';
import { Quaternion } from '../Math/Quaternion';
import { BoxCollider, BoxColliderData } from '../Component/BoxCollider';
import { SphereCollider, SphereColliderData } from '../Component/SphereCollider';

export class Physics {
    private world: CANNON.World;
    private rigidbodies: Map<Rigidbody, CANNON.Body> = new Map();       // 刚体和物理体的映射
    private colliders: Map<Collider, CANNON.Shape> = new Map();         // 碰撞体和物理形状的映射
    private shapes: Map<CANNON.Shape, CANNON.Body> = new Map();         // 物理形状和物理体的映射
    private shapeIdToColliderMap: Map<number, Collider> = new Map();    // 形状ID和碰撞体的映射

    // 重力
    public get gravity(): Vector3 {
        return new Vector3(this.world.gravity.x, this.world.gravity.y, this.world.gravity.z);
    }
    public set gravity(value: Vector3) {
        this.world.gravity.set(value.x, value.y, value.z);
    }

    // 物理参数
    public minPenetrationForPenalty: number = 0.05;
    public bounceThreshold: number = 0.5;
    public sleepVelocity: number = 0.14;
    public sleepAngularVelocity: number = 0.14;
    public maxAngularVelocity: number = 7;
    public solverIterationCount: number = 6;

    public init(): void {
        // 创建物理世界
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        // @ts-ignore
        this.world.broadphase = new CANNON.NaiveBroadphase();      // 碰撞检测算法
        // @ts-ignore
        this.world.solver.iterations = 10;                         // 约束求解迭代次数，影响精度
        this.world.allowSleep = true;                              // 允许物体进入睡眠状态 
    }

    public update(): void {
        if (!this.world) return;
        // 更新物理世界
        this.world.step(Time.fixedDeltaTime);
        // 更新刚体位置和旋转
        for (const [rigidbody, body] of this.rigidbodies) {
            const pos = body.position;
            const rot = body.quaternion;
            rigidbody.transform.position = new Vector3(pos.x, pos.y, pos.z);
            rigidbody.transform.rotation = new Quaternion(rot.x, rot.y, rot.z, rot.w);
        }
    }

    public onDestroy(): void {
    }

    public CreateRigidbody(rigidbody: Rigidbody): void {
        if (this.rigidbodies.has(rigidbody)) {
            console.warn('Rigidbody already added:', rigidbody);
            return;
        }

        const body = new CANNON.Body({
            mass: rigidbody.isKinematic ? 0 : rigidbody.mass,
            position: new CANNON.Vec3(rigidbody.transform.position.x, rigidbody.transform.position.y, rigidbody.transform.position.z),
            quaternion: new CANNON.Quaternion(rigidbody.transform.rotation.x, rigidbody.transform.rotation.y, rigidbody.transform.rotation.z, rigidbody.transform.rotation.w),
        })

        if (body) {
            this.world.addBody(body);
            this.rigidbodies.set(rigidbody, body);
        }
    }

    public RemoveRigidbody(rigidbody: Rigidbody): void {
        const body = this.rigidbodies.get(rigidbody);
        if (body) {
            this.world.remove(body);
            this.rigidbodies.delete(rigidbody);
        }
    }

    public CreateCollider(collider: Collider): void {
        const rigidbody = collider.attachedRigidbody;
        if (!rigidbody) {
            console.error('Collider not attached to a Rigidbody:', collider);
            return;
        }

        // 如果已经存在，则先销毁旧的再新建
        if (this.colliders.has(collider)) {
            this.RemoveCollider(collider);
        }

        const body = this.rigidbodies.get(rigidbody);
        if (body) {
            let shape: CANNON.Shape | null = null;
            const colliderData = collider.getColliderData();
            if (collider instanceof BoxCollider) {
                const boxData = colliderData as BoxColliderData;
                shape = new CANNON.Box(new CANNON.Vec3(boxData.size.x / 2, boxData.size.y / 2, boxData.size.z / 2));
            } else if (collider instanceof SphereCollider) {
                const sphereData = colliderData as SphereColliderData;
                shape = new CANNON.Sphere(sphereData.radius);
            }
            if (shape != null) {
                const offset = new CANNON.Vec3(collider.center.x, collider.center.y, collider.center.z);
                body.addShape(shape, offset);
                this.shapes.set(shape, body);
                this.colliders.set(collider, shape);
                // 这里需要特别注意，碰撞或射线检测的形状，并不一定是现在添加的Shape，例如Box，会有一个凸多边形代理，射线检测是以它为目标计算的
                if (shape instanceof CANNON.Box) {
                    this.shapeIdToColliderMap.set((shape as CANNON.Box).convexPolyhedronRepresentation.id, collider);
                }
                else {
                    this.shapeIdToColliderMap.set(shape.id, collider);
                }
            }
        }
        else {
            console.error('Rigidbody not found:', rigidbody);
        }
    }

    public RebuildColliders(collider: Collider): void {
        const shape = this.colliders.get(collider);
        if (shape == null) return;

        this.RemoveCollider(collider);
        this.CreateCollider(collider);
        // 强制更新碰撞检测信息
        //TODO:移除形状后，与它相邻的物体不会被激活，这不符合常理，暂时不知道怎么解决，这里手动唤醒下全部的物体
        this.world.bodies.forEach(body => {
            body.wakeUp();
        });
    }

    public RemoveCollider(collider: Collider): void {
        const shape = this.colliders.get(collider);
        if (shape == null) return;
        const body = this.shapes.get(shape);
        if (body == null) return;

        // 1. 找到目标形状的索引
        const index = body.shapes.indexOf(shape);
        if (index === -1) return; // 形状不存在则退出

        // 2. 移除形状及对应的偏移和旋转信息
        body.shapes.splice(index, 1);
        body.shapeOffsets.splice(index, 1); // 移除对应的偏移
        body.shapeOrientations.splice(index, 1); // 移除对应的旋转

        // 3. 如果是动态刚体，重新计算惯性
        if (body.mass > 0) {
        }

        // 4. 强制更新碰撞检测信息
        // body.aabbNeedsUpdate = true;
        //TODO:移除形状后，与它相邻的物体不会被激活，这不符合常理，暂时不知道怎么解决，这里手动唤醒下全部的物体
        this.world.bodies.forEach(body => {
            body.wakeUp();
        });

        this.shapes.delete(shape);
        this.colliders.delete(collider);
    }

    public Raycast(
        ray: Ray,
        distance: number = 10,
        layerMask?: number,
    ): RaycastHit | null {
        const result = new CANNON.RaycastResult();
        const from = new CANNON.Vec3(ray.origin.x, ray.origin.y, ray.origin.z);
        const to = new CANNON.Vec3(ray.at(distance).x, ray.at(distance).y, ray.at(distance).z);
        this.world.rayTest(from, to, result);

        // this.world.raycastAll(from, to, {
        // }, (r) => {
        //     const re = r as CANNON.RaycastResult;
        //     console.log(re.shape?.id);
        // });

        if (result.hasHit && result.shape) {
            // 注意，result.shape并不一定会是原来添加的Shape，例如Box，会有一个凸多边形代理，先前创建Box的时候已经在shapeIdToColliderMap里缓冲这个代理的ID了
            const collider = this.shapeIdToColliderMap.get(result.shape.id);
            if (!collider) {
                console.error('Collider not found for shape:', result.shape);
                return null;
            }
            const hit = RaycastHit.create(
                new Vector3(result.hitPointWorld.x, result.hitPointWorld.y, result.hitPointWorld.z),
                new Vector3(result.hitNormalWorld.x, result.hitNormalWorld.y, result.hitNormalWorld.z),
                result.distance,
                collider,
            );
            return hit;
        }
        return null;
    }

    // 通过 Ray 对象检测所有射线碰撞
    public RaycastAll(
        ray: Ray,
        distance: number = Infinity,
        layerMask: number
    ): RaycastHit[] {
        return [];
    }
}