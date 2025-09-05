import { Input } from "../Input";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Component } from "./Component";

export class ObjRotate extends Component {
    private angle = 0;

    public update(): void {
        // 键盘输入
        if (Input.GetKey(Input.KeyCode.W)) {
            // 向前移动
            this.transform.position.z += 0.1;
        }

        if (Input.GetKeyDown(Input.KeyCode.Space)) {
            // 空格键被按下，执行跳跃
            console.log("跳跃!");
        }

        // 鼠标输入
        if (Input.GetMouseButtonDown(0)) {
            // 鼠标左键被按下，执行射击
            console.log("射击!");
        }

        // 鼠标位置
        //console.log(`鼠标位置: (${Input.mouseX}, ${Input.mouseY})`);

        // 鼠标滚轮
        if (Input.deltaY !== 0) {
            // 缩放
            const zoomFactor = Input.deltaY > 0 ? 0.9 : 1.1;
            this.transform.scale.multiply(zoomFactor);
        }

        // 触摸输入
        if (Input.touchCount > 0) {
            const touch = Input.GetTouch(0);
            if (touch) {
                console.log(`触摸位置: (${touch.position.x}, ${touch.position.y})`);
            }
        }
        // if (this.gameObject.name == "cube") {
        //     // 使用sin函数实现缩放在0.9到1.1之间循环
        //     const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
        //     const scale = this.transform.scale;
        //     scale.x = scaleOffset;
        //     scale.y = scaleOffset;
        //     scale.z = scaleOffset;
        //     this.transform.scale = scale;

        //     this.transform.rotation = Quaternion.angleAxis(this.angle, Vector3.FORWARD);
        //     this.angle += 1;
        //     return;
        // }

        // // 让物体在所有轴上旋转
        // this.transform.rotation = Quaternion.angleAxis(this.angle, Vector3.UP);
        // this.angle += 1;
    }
}