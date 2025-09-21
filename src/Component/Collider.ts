import { Engine } from "../Core/Engine";
import { Bounds } from "../Math/Bounds";
import { Vector3 } from "../Math/Vector3";
import { PhysicMaterial } from "../Physics/PhysicMaterial";
import { Component } from "./Component";
import { Rigidbody } from "./RigidBody";

export abstract class Collider extends Component {
    public attachedRigidbody: Rigidbody | null;
    public bounds: Bounds;
    public isTrigger: Boolean;
    public physicMaterial: PhysicMaterial;

    private _center: Vector3 = Vector3.ZERO;

    public get center(): Vector3 {
        return this._center.clone();
    }

    public set center(newCenter: Vector3) {
        if (!this._center.equals(newCenter)) {
            this._center = newCenter.clone();
            // 通常需要重新初始化碰撞体
            Engine.physics.RebuildColliders(this);
        }
    }

    private _lastScale: Vector3 = Vector3.ZERO;

    public abstract getColliderData(): any;

    public onEnable(): void {
        // if (this.attachedRigidbody == null || this.connonShape == null) {
        //     this.attachedRigidbody = this.gameObject.getComponetInParent(Rigidbody);
        //     if (this.attachedRigidbody == null) return;
        //     this.connonShape = this.createCollider(this.attachedRigidbody);
        // }
    }

    public onTransformChanged(): void {
        if (this.transform.scale.equals(this._lastScale)) return;
        this._lastScale = this.transform.scale;
        Engine.physics.RebuildColliders(this);
    }

    public onDestroy(): void {
        Engine.physics.RemoveCollider(this);
    }
}