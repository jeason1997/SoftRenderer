import { Engine } from "../Core/Engine";
import { Bounds } from "../Math/Bounds";
import { PhysicMaterial } from "../Physics/PhysicMaterial";
import { Component } from "./Component";
import { Rigidbody } from "./RigidBody";
import { Collider as Rapier_Collider, RigidBody as Rapier_RigidBody } from "@dimforge/rapier3d";

export abstract class Collider extends Component {
    public attachedRigidbody: Rigidbody;
    public bounds: Bounds;
    public isTrigger: Boolean;
    public physicMaterial: PhysicMaterial;

    protected collider: Rapier_Collider;

    public abstract createCollider(rigidbody?: Rigidbody);

    public onEnable(): void {
        if (this.attachedRigidbody == null && this.collider == null) {
            this.collider = this.createCollider();
        }
    }

    public destroyCollider(): void {
        if (this.collider != null) {
            Engine.physicsEngine.world.removeCollider(this.collider, true);
        }
    }

    public onDestroy(): void {
        this.destroyCollider();
    }
}