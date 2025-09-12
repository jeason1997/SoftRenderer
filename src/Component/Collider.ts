import { Engine } from "../Core/Engine";
import { Bounds } from "../Math/Bounds";
import { PhysicMaterial } from "../Physics/PhysicMaterial";
import { Component } from "./Component";
import { Rigidbody } from "./RigidBody";
import * as CANNON from 'cannon';

export abstract class Collider extends Component {
    public attachedRigidbody: Rigidbody | null;
    public bounds: Bounds;
    public isTrigger: Boolean;
    public physicMaterial: PhysicMaterial;

    protected collider: CANNON.Shape | null;

    public abstract createCollider(rigidbody: Rigidbody);

    public onEnable(): void {
        if (this.attachedRigidbody == null || this.collider == null) {
            this.attachedRigidbody = this.gameObject.getComponetInParent(Rigidbody);
            if (this.attachedRigidbody == null) return;
            this.collider = this.createCollider(this.attachedRigidbody);
        }
    }

    // 移除刚体中指定的形状
    protected destroyCollider(): void {
        const body = this.attachedRigidbody?.connonBody;
        if (body == null || this.collider == null) return;

        // 1. 找到目标形状的索引
        const index = body.shapes.indexOf(this.collider);
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
    }

    public onDestroy(): void {
        this.destroyCollider();
    }
}