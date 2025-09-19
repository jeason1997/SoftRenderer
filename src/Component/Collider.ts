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
    public center: Vector3 = Vector3.ZERO;

    public abstract getColliderData(): any;

    public onEnable(): void {
        // if (this.attachedRigidbody == null || this.connonShape == null) {
        //     this.attachedRigidbody = this.gameObject.getComponetInParent(Rigidbody);
        //     if (this.attachedRigidbody == null) return;
        //     this.connonShape = this.createCollider(this.attachedRigidbody);
        // }
    }

    public onDestroy(): void {
        Engine.physics.RemoveCollider(this);
    }
}