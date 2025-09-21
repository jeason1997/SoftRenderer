import { DisallowComponent } from "../../Core/Decorators";
import { Input } from "../../Core/Input";
import { Quaternion } from "../../Math/Quaternion";
import { Vector3 } from "../../Math/Vector3";
import { Debug } from "../../Utils/Debug";
import { Component } from "../Component";
import { Rigidbody } from "../RigidBody";

@DisallowComponent(Rigidbody)
export class ObjRotate extends Component {
    private angleX = 0;
    private angleY = 0;

    public onStart(): void {
        this.angleX = this.transform.rotation.eulerAngles.x;
        this.angleY = this.transform.rotation.eulerAngles.y;
    }

    public onUpdate(): void {
        // // 键盘输入
        // const horizontalInput = Input.GetAxis(InputAxis.Horizontal);
        // const verticalInput = Input.GetAxis(InputAxis.Vertical);
        // this.angleX += verticalInput;
        // this.angleY += horizontalInput;
        // this.transform.rotation = new Quaternion(new Vector3(this.angleX, this.angleY, 0));

        // // 鼠标滚轮
        // if (Input.mouseScrollDelta.y !== 0) {
        //     // 缩放
        //     const zoomFactor = Input.mouseScrollDelta.y > 0 ? 0.9 : 1.1;
        //     const sacle = this.transform.scale;
        //     sacle.multiply(zoomFactor);
        //     this.transform.scale = sacle;
        // }
        
        if(Input.GetKey(Input.KeyCode.Numpad4)) this.angleY -= 1;
        if(Input.GetKey(Input.KeyCode.Numpad6)) this.angleY += 1;
        if(Input.GetKey(Input.KeyCode.Numpad8)) this.angleX -= 1;
        if(Input.GetKey(Input.KeyCode.Numpad2)) this.angleX += 1;
        this.transform.rotation = new Quaternion(new Vector3(this.angleX, this.angleY, 0));

        Debug.Log("X:" + Math.floor(this.angleX) + " Y:" + Math.floor(this.angleY));
    }
}