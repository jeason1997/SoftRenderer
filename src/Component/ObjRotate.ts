import { Input, InputAxis } from "../Input";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Component } from "./Component";

export class ObjRotate extends Component {
    private angleX = 0;
    private angleY = 0;

    public update(): void {
        // 键盘输入
        const horizontalInput = Input.GetAxis(InputAxis.Horizontal);
        const verticalInput = Input.GetAxis(InputAxis.Vertical);
        this.angleX += verticalInput;
        this.angleY += horizontalInput;
        this.transform.rotation = new Quaternion(new Vector3(this.angleX, this.angleY, 0));

        // 鼠标滚轮
        if (Input.mouseScrollDelta.y !== 0) {
            // 缩放
            const zoomFactor = Input.mouseScrollDelta.y > 0 ? 0.9 : 1.1;
            const sacle = this.transform.scale;
            sacle.multiply(zoomFactor);
            this.transform.scale = sacle;
        }
    }
}