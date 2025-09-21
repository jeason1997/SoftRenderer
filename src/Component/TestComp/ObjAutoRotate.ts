import { DisallowComponent } from "../../Core/Decorators";
import { Input } from "../../Core/Input";
import { Quaternion } from "../../Math/Quaternion";
import { Vector3 } from "../../Math/Vector3";
import { Debug } from "../../Utils/Debug";
import { Component } from "../Component";
import { Rigidbody } from "../RigidBody";

@DisallowComponent(Rigidbody)
export class ObjAutoRotate extends Component {
    private angleX = 0;
    private angleY = 0;

    public onStart(): void {
        this.angleX = this.transform.rotation.eulerAngles.x;
        this.angleY = this.transform.rotation.eulerAngles.y;
    }

    public onUpdate(): void {
        this.angleY += 1;
        this.transform.rotation = new Quaternion(new Vector3(this.angleX, this.angleY, 0));
    }
}