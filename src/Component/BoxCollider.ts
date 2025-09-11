import { ColliderDesc } from "@dimforge/rapier3d";
import { Engine } from "../Core/Engine";
import { Vector3 } from "../Math/Vector3";
import { Collider } from "./Collider";
import { Rigidbody } from "./RigidBody";
import { MeshRenderer } from "./MeshRenderer";

export class BoxCollider extends Collider {

    public center: Vector3;
    public size: Vector3;

    public createCollider(rigidbody?: Rigidbody) {
        if (this.center == null || this.size == null) {
            this.updateSizeFromMeshBounds();
        }

        if (rigidbody) {
            this.attachedRigidbody = rigidbody;
        }

        // 先移除旧的
        this.destroyCollider();

        // 1. 创建碰撞体描述符，并指定其半尺寸 (half-extents)
        const desc = ColliderDesc.cuboid(this.size.x / 2, this.size.y / 2, this.size.z / 2);

        // 2. 应用中心偏移（平移变换）
        desc.setTranslation(this.center.x, this.center.y, this.center.z);

        // 3. 创建碰撞体
        this.collider = Engine.physicsEngine.world.createCollider(desc, rigidbody?.rapierRigidBody);
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