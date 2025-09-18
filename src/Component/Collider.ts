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

    protected connonShape: CANNON.Shape | null;

    public abstract createCollider(rigidbody: Rigidbody);

    public onEnable(): void {
        // if (this.attachedRigidbody == null || this.connonShape == null) {
        //     this.attachedRigidbody = this.gameObject.getComponetInParent(Rigidbody);
        //     if (this.attachedRigidbody == null) return;
        //     this.connonShape = this.createCollider(this.attachedRigidbody);
        // }
    }

    protected destroyCollider(): void {
        if (this.connonShape != null) {
            Engine.physics.RemoveCollider(this.connonShape);
            this.connonShape = null;
        }
    }

    public onDestroy(): void {
        this.destroyCollider();
    }
}