import { Vector3 } from "../Math/Vector3";
import { Collider } from "./Collider";
import { Rigidbody } from "./RigidBody";
import { MeshRenderer } from "./MeshRenderer";
import * as CANNON from 'cannon';

export class BoxCollider extends Collider {

    public center: Vector3;
    public size: Vector3;

    public createCollider(rigidbody: Rigidbody) {
        this.attachedRigidbody = rigidbody;

        if (this.center == null || this.size == null) {
            this.updateSizeFromMeshBounds();
        }

        // 不允许为0的尺寸，否则无法正常碰撞，例如高度为0的平面，高度设置成一个极低的数值
        if (this.size.x <= 0) this.size.x = 0.01;
        if (this.size.y <= 0) this.size.y = 0.01;
        if (this.size.z <= 0) this.size.z = 0.01;

        // 先移除旧的
        this.destroyCollider();
        this.collider = new CANNON.Box(new CANNON.Vec3(this.size.x / 2, this.size.y / 2, this.size.z / 2));

        const body = this.attachedRigidbody.connonBody;
        if (body) {
            body.addShape(this.collider);
        }
    }

    private updateSizeFromMeshBounds() {
        // 获取MeshRenderer组件
        const meshRenderer = this.gameObject.getComponent(MeshRenderer);
        // 获取网格包围盒
        const bounds = meshRenderer?.mesh?.bounds[0];

        if (bounds) {
            // 如果有包围盒数据，使用包围盒的尺寸和中心点
            const x = bounds.halfExtents.x * 2 * this.gameObject.transform.scale.x;
            const y = bounds.halfExtents.y * 2 * this.gameObject.transform.scale.y;
            const z = bounds.halfExtents.z * 2 * this.gameObject.transform.scale.z;
            this.size = new Vector3(x, y, z);
            this.center = bounds.center;
        } else {
            // 如果没有包围盒数据，使用默认值
            this.size = Vector3.ONE;
            this.center = Vector3.ZERO;
        }
    }
}