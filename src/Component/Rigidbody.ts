import { Engine } from "../Core/Engine";
import { LayerMask } from "../Core/LayerMask";
import { Time } from "../Core/Time";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { RaycastHit } from "../Physics/RaycastHit";
import { Collider } from "./Collider";
import { Component } from "./Component";
import { RigidBody as Rapier_RigidBody, RigidBodyDesc } from "@dimforge/rapier3d";

export enum ForceMode {
    Force,
    Acceleration,
    Impulse,
    VelocityChange
}

export enum RigidbodyInterpolation {
    None,
    Interpolate,
    Extrapolate
}

export enum CollisionDetectionMode {
    Discrete,
    Continuous,
    ContinuousDynamic,
    ContinuousSpeculative
}

export enum RigidbodyConstraints {
    None = 0,
    FreezePositionX = 1,
    FreezePositionY = 2,
    FreezePositionZ = 4,
    FreezeRotationX = 8,
    FreezeRotationY = 16,
    FreezeRotationZ = 32,
    FreezePosition = FreezePositionX | FreezePositionY | FreezePositionZ,
    FreezeRotation = FreezeRotationX | FreezeRotationY | FreezeRotationZ,
    FreezeAll = FreezePosition | FreezeRotation
}

export enum QueryTriggerInteraction {
    UseGlobal,
    Ignore,
    Collide
}

export class Rigidbody extends Component {
    public velocity: Vector3;
    public angularVelocity: Vector3;
    public drag: number;
    public angularDrag: number;
    public mass: number;
    public useGravity: boolean;
    public maxDepenetrationVelocity: number;
    public isKinematic: boolean;
    public freezeRotation: boolean;
    public constraints: RigidbodyConstraints;
    public collisionDetectionMode: CollisionDetectionMode;
    public automaticCenterOfMass: boolean;
    public centerOfMass: Vector3;
    public automaticInertiaTensor: boolean;
    public inertiaTensorRotation: Quaternion;
    public inertiaTensor: Vector3;
    public detectCollisions: boolean;
    public position: Vector3;
    public rotation: Quaternion;
    public interpolation: RigidbodyInterpolation;
    public solverIterations: number;
    public sleepThreshold: number;
    public maxAngularVelocity: number;
    public maxLinearVelocity: number;
    public solverVelocityIterations: number;
    public excludeLayers: LayerMask;
    public includeLayers: LayerMask;

    private _rapierRigidBody: Rapier_RigidBody;
    public get rapierRigidBody(): Rapier_RigidBody {
        return this._rapierRigidBody;
    }

    public start(): void {
        const desc = this.isKinematic ? RigidBodyDesc.fixed() : RigidBodyDesc.dynamic();
        this._rapierRigidBody = Engine.physicsEngine.world.createRigidBody(desc);
        this._rapierRigidBody.setTranslation(this.transform.position, true);
        this._rapierRigidBody.setRotation(this.transform.rotation, true);

        // const childRigidbodies = this.gameObject.getComponentsInChildren(Rigidbody);
        // for (const childRigidbody of childRigidbodies) {
        //     console.warn("一个节点层级只能拥有一个Rigidbody组件");
        //     UObject.Destroy(childRigidbody);
        // }

        const colliders = this.gameObject.getComponentsInChildren(Collider);
        for (const collider of colliders) {
            collider.createCollider(this);
        }
    }

    public update(): void {
        const pos = this.rapierRigidBody.translation();
        const rot = this.rapierRigidBody.rotation();
        this.transform.position = new Vector3(pos.x, pos.y, pos.z);
        this.transform.rotation = new Quaternion(rot.x, rot.y, rot.z, rot.w);
    }

    public onDestroy(): void {
        Engine.physicsEngine.world.removeRigidBody(this._rapierRigidBody);
    }

    // 只读属性
    public get worldCenterOfMass(): Vector3 {
        // 实现获取世界坐标系下的质心
        return new Vector3();
    }

    // 方法
    public setDensity(density: number): void {
        // 根据密度设置质量
    }

    public movePosition(position: Vector3): void {
        // 移动刚体到指定位置
    }

    public moveRotation(rotation: Quaternion): void {
        // 旋转刚体到指定方向
    }

    public move(position: Vector3, rotation: Quaternion): void {
        // 同时移动和旋转刚体
    }

    public sleep(): void {
        // 让刚体进入睡眠状态
    }

    public isSleeping(): boolean {
        // 检查刚体是否在睡眠状态
        return false;
    }

    public wakeUp(): void {
        // 唤醒刚体
    }

    public resetCenterOfMass(): void {
        // 重置质心
    }

    public resetInertiaTensor(): void {
        // 重置惯性张量
    }

    public getRelativePointVelocity(relativePoint: Vector3): Vector3 {
        // 获取相对点的速度
        return new Vector3();
    }

    public getPointVelocity(worldPoint: Vector3): Vector3 {
        // 获取世界点的速度
        return new Vector3();
    }

    public getAccumulatedForce(step: number = Time.fixedDeltaTime): Vector3 {
        // 获取累积的力
        return new Vector3();
    }

    public getAccumulatedTorque(step: number = Time.fixedDeltaTime): Vector3 {
        // 获取累积的扭矩
        return new Vector3();
    }

    // 力的添加方法
    public addForce(force: Vector3, mode: ForceMode): void;
    public addForce(x: number, y: number, z: number, mode: ForceMode): void;
    public addForce(forceOrX: Vector3 | number, modeOrY?: ForceMode | number, z?: number, mode?: ForceMode): void {
    }

    public addRelativeForce(force: Vector3, mode: ForceMode): void;
    public addRelativeForce(x: number, y: number, z: number, mode: ForceMode): void;
    public addRelativeForce(forceOrX: Vector3 | number, modeOrY?: ForceMode | number, z?: number, mode?: ForceMode): void {
        // 实现添加相对力的重载
    }

    public addTorque(torque: Vector3, mode: ForceMode): void;
    public addTorque(x: number, y: number, z: number, mode: ForceMode): void;
    public addTorque(torqueOrX: Vector3 | number, modeOrY?: ForceMode | number, z?: number, mode?: ForceMode): void {
        // 实现添加扭矩的重载
    }

    public addRelativeTorque(torque: Vector3, mode: ForceMode): void;
    public addRelativeTorque(x: number, y: number, z: number, mode: ForceMode): void;
    public addRelativeTorque(torqueOrX: Vector3 | number, modeOrY?: ForceMode | number, z?: number, mode?: ForceMode): void {
        // 实现添加相对扭矩的重载
    }

    public addForceAtPosition(force: Vector3, position: Vector3, mode: ForceMode = ForceMode.Force): void {
        // 在指定位置添加力
    }

    public addExplosionForce(explosionForce: number, explosionPosition: Vector3, explosionRadius: number, upwardsModifier: number = 0, mode: ForceMode = ForceMode.Force): void {
        // 添加爆炸力
    }

    public closestPointOnBounds(position: Vector3): Vector3 {
        // 获取边界上最近的点
        return new Vector3();
    }

    public sweepTest(direction: Vector3, hitInfo: RaycastHit, maxDistance: number = Number.POSITIVE_INFINITY, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.UseGlobal): boolean {
        // 扫描测试
        return false;
    }

    public sweepTestAll(direction: Vector3, maxDistance: number = Number.POSITIVE_INFINITY, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.UseGlobal): RaycastHit[] {
        // 扫描测试所有碰撞
        return [];
    }

    // 已废弃的方法（保持兼容性）
    public setMaxAngularVelocity(a: number): void {
        this.maxAngularVelocity = a;
    }
}