import { Engine } from "../Core/Engine";
import { Vector3 } from "../Math/Vector3";
import { Collider } from "./Collider";
import { MeshRenderer } from "./MeshRenderer";

export interface BoxColliderData {
    size: Vector3;
}

export class BoxCollider extends Collider {
    private _size: Vector3;

    public get size(): Vector3 {
        return this._size?.clone();
    }

    public set size(newSize: Vector3) {
        if (this._size !== newSize) {
            this._size = newSize;
            // 通常需要重新初始化碰撞体
            Engine.physics.RebuildColliders(this);
        }
    }

    public getColliderData(): BoxColliderData {
        if (this.center == null || this.size == null) {
            this.updateSizeFromMeshBounds();
        }

        const size = this.size.multiply(this.transform.worldScale);

        // 不允许为0的尺寸，否则无法正常碰撞，例如高度为0的平面，高度设置成一个极低的数值
        if (size.x <= 0) size.x = 0.01;
        if (size.y <= 0) size.y = 0.01;
        if (size.z <= 0) size.z = 0.01;

        return {
            size: size,
        };
    }

    private updateSizeFromMeshBounds() {
        // 获取MeshRenderer组件
        const meshRenderer = this.gameObject.getComponent(MeshRenderer);
        // 获取网格包围盒
        const bounds = meshRenderer?.mesh?.bounds[0];

        if (bounds) {
            // 如果有包围盒数据，使用包围盒的尺寸和中心点
            const x = bounds.halfExtents.x * 2;
            const y = bounds.halfExtents.y * 2;
            const z = bounds.halfExtents.z * 2;
            this.size = new Vector3(x, y, z);
            this.center = bounds.center;
        } else {
            // 如果没有包围盒数据，使用默认值
            this.size = Vector3.ONE;
            this.center = Vector3.ZERO;
        }
    }
}