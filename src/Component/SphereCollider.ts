import { Engine } from "../Core/Engine";
import { Vector3 } from "../Math/Vector3";
import { Collider } from "./Collider";
import { Rigidbody } from "./RigidBody";
import * as CANNON from 'cannon';

export class SphereCollider extends Collider {
    public center: Vector3 = Vector3.ZERO;
    public radius: number = 0.5;

    public createCollider(rigidbody: Rigidbody) {
        this.attachedRigidbody = rigidbody;

        // 先移除旧的
        this.destroyCollider();
        this.connonShape = new CANNON.Sphere(this.radius);

        Engine.physics.AddCollider(this, this.connonShape);
    }

    /**
     * 可选：在运行时更新球体半径（注意：Rapier 可能不支持直接修改现有碰撞体的形状参数，
     * 通常需要销毁后重新创建，此方法仅供参考）
     */
    public setRadius(newRadius: number): void {
        if (this.radius !== newRadius) {
            this.radius = newRadius;
            // 通常需要重新初始化碰撞体
            // this.recreateCollider();
        }
    }

    /**
     * 可选：在运行时更新中心偏移
     */
    public setCenter(newCenter: Vector3): void {
        if (!this.center.equals(newCenter)) {
            this.center = newCenter.clone();
            // 通常需要重新初始化碰撞体
            // this.recreateCollider();
        }
    }

    /**
     * 销毁并重新创建碰撞体（用于更新形状或位置）
     * 注意：需要确保在物理世界的正确生命周期内操作，并处理可能的父刚体关联
     */
    private recreateCollider(): void {
        if (this.connonShape) {
            // 需要根据你的引擎架构实现销毁逻辑，例如：
            // Engine.physicsEngine.getWorld().removeCollider(this.collider);
        }
        // 重新初始化
    }

    /**
     * 返回球的体积（用于计算质量等）
     */
    public getVolume(): number {
        return (4.0 / 3.0) * Math.PI * Math.pow(this.radius, 3);
    }
}