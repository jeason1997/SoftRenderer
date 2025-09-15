import { RequireComponent } from "../Core/Decorators";
import { Engine } from "../Core/Engine";
import { Input, InputAxis } from "../Core/Input";
import { Time } from "../Core/Time";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Camera } from "./Camera";
import { Component } from "./Component";

@RequireComponent(Camera)
export class CameraController extends Component {
    public moveSpeed = 0.5;
    public moveSpeedShiftScale = 2.5;
    public dragSpeed = 0.3;
    public damp = 0.2;
    public rotateSpeed = 1;

    private _camera: Camera | null;
    private _euler = new Vector3();
    private _velocity = new Vector3();
    private _position = new Vector3();
    private _speedScale = 1;
    private _rotateCamera = false;
    private _rotateCenter = new Vector3();

    public start(): void {
        this._camera = this.gameObject.getComponent(Camera);
        this._euler = this.transform.rotation.eulerAngles;
        this._position = this.transform.position;
    }

    private updateInput(): void {
        // WSADQE+SHIFT相机移动以及加速
        this._velocity.x = -Input.GetAxis(InputAxis.Horizontal);
        this._velocity.z = Input.GetAxis(InputAxis.Vertical);
        this._velocity.y = Input.GetKey(Input.KeyCode.Q) ? -1 : Input.GetKey(Input.KeyCode.E) ? 1 : 0;
        this._speedScale = Input.GetKey(Input.KeyCode.Shift) ? this.moveSpeedShiftScale : 1;

        // 鼠标中键相机拖动
        if (Input.GetMouseButton(1)) {
            const moveDelta = Input.mouseDelta;
            //TODO:这里应该是托多少就移动多少，而不是乘一个系数
            this._velocity.x += moveDelta.x * this.dragSpeed;
            this._velocity.y += moveDelta.y * this.dragSpeed;
        }

        // 鼠标滚轮相机缩放
        const scrollDelta = Input.mouseScrollDelta.y * this.moveSpeed;
        if (this._camera?.orthographic) {
            this._camera.orthographicSize += scrollDelta * 0.01;
        }
        else {
            var pos = this.transform.rotation.transformQuat(Vector3.BACK);
            this._position = this.scaleAndAdd(this.transform.position, pos, scrollDelta * 0.1);
        }

        // 鼠标右键相机旋转
        if (Input.GetMouseButtonDown(2)) {
            Engine.canvas.requestPointerLock();
            this._rotateCamera = true;
        }
        if (Input.GetMouseButtonUp(2)) {
            if (document.exitPointerLock) document.exitPointerLock();
            this._rotateCamera = false;
        }
        if (this._rotateCamera) {
            const moveDelta = Input.mouseDelta;
            this._euler.y += moveDelta.x * this.rotateSpeed * 0.1;
            this._euler.x += moveDelta.y * this.rotateSpeed * 0.1;
        }

        // ALT+鼠标左键相机绕中心点旋转
        if (Input.GetKey(Input.KeyCode.Alt) && Input.GetMouseButton(0)) {
            const moveDelta = Input.mouseDelta;
            this._euler.y -= moveDelta.x * this.rotateSpeed * 0.1;
            this._euler.x += moveDelta.y * this.rotateSpeed * 0.1;
        }
    }

    private scaleAndAdd(a: Vector3, b: Vector3, scale: number): Vector3 {
        var out = new Vector3();
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }

    public update(): void {
        this.updateInput();

        // position
        var v = this.transform.rotation.transformQuat(this._velocity);
        this._position = this.scaleAndAdd(this._position, v, this.moveSpeed * this._speedScale);
        v = Vector3.lerp(this.transform.position, this._position, Time.deltaTime / this.damp);
        this.transform.position = v;

        // rotation
        var q = new Quaternion(new Vector3(this._euler.x, this._euler.y, this._euler.z));
        q = Quaternion.slerp(this.transform.rotation, q, Time.deltaTime / this.damp);
        this.transform.rotation = q;
    }
}