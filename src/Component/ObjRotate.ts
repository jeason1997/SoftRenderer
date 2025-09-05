import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Component } from "./Component";

export class ObjRotate extends Component {
    private angle = 0;

    public override update(): void {
        if (this.gameObject.name == "cube") {
            // 使用sin函数实现缩放在0.9到1.1之间循环
            const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
            const scale = this.transform.scale;
            scale.x = scaleOffset;
            scale.y = scaleOffset;
            scale.z = scaleOffset;
            this.transform.scale = scale;

            this.transform.rotation = Quaternion.angleAxis(this.angle, Vector3.FORWARD);
            this.angle += 1;
            return;
        }

        // 让物体在所有轴上旋转
        this.transform.rotation = Quaternion.angleAxis(this.angle, Vector3.UP);
        this.angle += 1;
    }
}