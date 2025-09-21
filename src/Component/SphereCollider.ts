import { Engine } from "../Core/Engine";
import { Collider } from "./Collider";

export interface SphereColliderData {
    radius: number;
}

export class SphereCollider extends Collider {
    public _radius: number = 0.5;

    public get radius(): number {
        return this._radius;
    }

    public set radius(newRadius: number) {
        if (this._radius !== newRadius) {
            this._radius = newRadius;
            // 通常需要重新初始化碰撞体
            Engine.physics.RebuildColliders(this);
        }
    }

    public getColliderData(): SphereColliderData {
        return {
            radius: this._radius * this.transform.worldScale.x,
        }
    }

    /**
     * 返回球的体积（用于计算质量等）
     */
    public getVolume(): number {
        return (4.0 / 3.0) * Math.PI * Math.pow(this.radius, 3);
    }
}