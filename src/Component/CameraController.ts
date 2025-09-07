import { Engine } from "../Engine";
import { Input, InputAxis } from "../Input";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Component } from "./Component";

export class CameraController extends Component {
    public moveSpeed = 0.5;
    public moveSpeedShiftScale = 2.5;
    public damp = 0.2;
    public rotateSpeed = 1;

    private _euler = new Vector3();
    private _velocity = new Vector3();
    private _position = new Vector3();
    private _speedScale = 1;
    private _rotateCamera = false;

    start() {
        this._euler = this.transform.rotation.eulerAngles;
        this._position = this.transform.position;
    }

    updateInput() {
        // 相机移动以及加速
        const v = this._velocity;
        v.x = -Input.GetAxis(InputAxis.Horizontal);
        v.z = Input.GetAxis(InputAxis.Vertical);
        v.y = Input.GetKey(Input.KeyCode.Q) ? -1 : Input.GetKey(Input.KeyCode.E) ? 1 : 0;
        this._speedScale = Input.GetKey(Input.KeyCode.Shift) ? this.moveSpeedShiftScale : 1;

        // 相机缩放
        const scrollDelta = -Input.mouseScrollDelta.y * this.moveSpeed * 0.1;
        var pos = this.transform.rotation.transformQuat(Vector3.FORWARD);
        this._position = this.scaleAndAdd(this.transform.position, pos, scrollDelta);

        if (Input.GetMouseButtonDown(0)) {
            Engine.canvas.requestPointerLock();
            this._rotateCamera = true;
        }
        if (Input.GetMouseButtonUp(0)) {
            if (document.exitPointerLock) document.exitPointerLock();
            this._rotateCamera = false;
        }
        if (this._rotateCamera) {
            const moveDelta = Input.mouseDelta;
            this._euler.y -= moveDelta.x * this.rotateSpeed * 0.1;
            this._euler.x += moveDelta.y * this.rotateSpeed * 0.1;
        }
    }

    update() {
        this.updateInput();

        // position
        var v = this.transform.rotation.transformQuat(this._velocity);
        this._position = this.scaleAndAdd(this._position, v, this.moveSpeed * this._speedScale);
        v = Vector3.lerp(this.transform.position, this._position, Engine.deltaTime / this.damp);
        this.transform.position = v;

        // rotation
        var q = new Quaternion(new Vector3(this._euler.x, this._euler.y, this._euler.z));
        q = Quaternion.slerp(this.transform.rotation, q, Engine.deltaTime / this.damp);
        this.transform.rotation = q;
    }

    scaleAndAdd(a: Vector3, b: Vector3, scale: number): Vector3 {
        var out = new Vector3();
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }
}