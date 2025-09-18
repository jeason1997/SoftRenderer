import * as CANNON from 'cannon';
import { Time } from '../Core/Time';
import { RaycastHit } from './RaycastHit';
import { Ray } from '../Math/Ray';
import { Vector3 } from '../Math/Vector3';
import { Collider } from '../Component/Collider';
import { Rigidbody } from '../Component/RigidBody';

export class Physics {
    private world: CANNON.World;
    private bodies: Map<Rigidbody, CANNON.Body> = new Map();
    private shapes: Map<CANNON.Shape, CANNON.Body> = new Map();
    private colliders: Map<CANNON.Shape, Collider> = new Map();

    // 重力
    public get gravity(): Vector3 {
        return new Vector3(this.world.gravity);
    }
    public set gravity(value: Vector3) {
        this.world.gravity = value.toVec3();
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
        this.world.broadphase = new CANNON.NaiveBroadphase();      // 碰撞检测算法
        this.world.solver.iterations = 10;                         // 约束求解迭代次数，影响精度
        this.world.allowSleep = true;                              // 允许物体进入睡眠状态
    }

    public update(): void {
        if (!this.world) return;
        // 更新物理世界
        this.world.step(Time.fixedDeltaTime);
    }

    public onDestroy(): void {
    }

    public AddRigidbody(rigidbody: Rigidbody, body: CANNON.Body): void {
        if (this.bodies.has(rigidbody)) {
            console.error('Rigidbody already added:', rigidbody);
            return;
        }
        this.world.addBody(body);
        this.bodies.set(rigidbody, body);
    }

    public RemoveRigidbody(rigidbody: Rigidbody): void {
        const body = this.bodies.get(rigidbody);
        if (body) {
            this.world.remove(body);
            this.bodies.delete(rigidbody);
        }
    }

    public AddCollider(collider: Collider, shape: CANNON.Shape): void {
        const rigidbody = collider.attachedRigidbody;
        if (!rigidbody) {
            console.error('Collider not attached to a Rigidbody:', collider);
            return;
        }

        const body = this.bodies.get(rigidbody);
        if (body) {
            body.addShape(shape);
            this.shapes.set(shape, body);
            this.colliders.set(shape, collider);
        }
        else {
            console.error('Rigidbody not found:', rigidbody);
        }
    }

    public RemoveCollider(shape: CANNON.Shape): void {
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
            //body.updateInertiaFromShapes();
        }

        // 4. 强制更新碰撞检测信息
        body.aabbNeedsUpdate = true;

        this.shapes.delete(shape);
        this.colliders.delete(shape);
    }

    public Raycast(
        ray: Ray,
        hitInfo: (hit: RaycastHit) => void,
        distance: number = 10,
        layerMask?: number,
    ): boolean {
        const result = new CANNON.RaycastResult();
        this.world.rayTest(ray.origin.toVec3(), ray.at(distance).toVec3(), result);

        if (result.hasHit) {
            const collider = this.colliders.get(result.shape);
            if (!collider) {
                console.error('Collider not found for shape:', result.shape);
                return false;
            }
            const hit = RaycastHit.create(
                new Vector3(result.hitPointWorld.x, result.hitPointWorld.y, result.hitPointWorld.z),
                new Vector3(result.hitNormalWorld.x, result.hitNormalWorld.y, result.hitNormalWorld.z),
                result.distance,
                collider,
            );
            hitInfo(hit);
            return true;
        }
        return false;
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