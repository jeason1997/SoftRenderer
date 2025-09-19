import { Vector3 } from "../Math/Vector3";
import { Collider } from "./Collider";

export interface SphereColliderData {
    radius: number;
}

export class SphereCollider extends Collider {
    public radius: number = 0.5;

    public getColliderData(): SphereColliderData {
        return {
            radius: this.radius,
        }
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
        // 重新初始化
    }

    /**
     * 返回球的体积（用于计算质量等）
     */
    public getVolume(): number {
        return (4.0 / 3.0) * Math.PI * Math.pow(this.radius, 3);
    }
}