import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Component } from "./Component";

const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    Q: 'Q'.charCodeAt(0),
    E: 'E'.charCodeAt(0),
    SHIFT: 16,
};

export class CameraController extends Component {

    public moveSpeed = 0.5;
    public moveSpeedShiftScale = 2.5;
    public damp = 0.2;
    public rotateSpeed = 1;

    private _euler = new Vector3();
    private _velocity = new Vector3();
    private _position = new Vector3();
    private _speedScale = 1;


    start() {
        this._euler = this.transform.rotation.eulerAngles;
        this._position = this.transform.position;
    }

    onKeyDown(e: KeyboardEvent) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = this.moveSpeedShiftScale; }
        else if (e.keyCode === KEYCODE.W) { if (v.z === 0) { v.z = -1; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z === 0) { v.z = 1; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x === 0) { v.x = -1; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x === 0) { v.x = 1; } }
        else if (e.keyCode === KEYCODE.Q) { if (v.y === 0) { v.y = -1; } }
        else if (e.keyCode === KEYCODE.E) { if (v.y === 0) { v.y = 1; } }
    }

    onKeyUp(e: KeyboardEvent) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = 1; }
        else if (e.keyCode === KEYCODE.W) { if (v.z < 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z > 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x < 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x > 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.Q) { if (v.y < 0) { v.y = 0; } }
        else if (e.keyCode === KEYCODE.E) { if (v.y > 0) { v.y = 0; } }
    }

    onWheel(e: WheelEvent) {
        const delta = e.deltaY * this.moveSpeed * 0.1;
        var pos = this.transform.rotation.transformQuat(Vector3.FORWARD);
        this._position = this.scaleAndAdd(this.transform.position, pos, delta);
    }

    onTouchStart(e: TouchEvent) {
        Engine.canvas.requestPointerLock();
    }

    onTouchMove(e: TouchEvent) {
        var startPos = e.startPosition;

        // rotation
        //if (startPos.x > Engine.screenSize.width * 0.5) 
        {
            var delta = e.delta;
            this._euler.y -= delta.x * this.rotateSpeed * 0.1;
            this._euler.x -= delta.y * this.rotateSpeed * 0.1;
        }
        // position 
        // else {
        //     var pos = e.position;
        //     pos.subtract(startPos);
        //     this._velocity.x = pos.x * 0.01;
        //     this._velocity.z = pos.y * 0.01;
        // }
    }

    onTouchEnd(e: TouchEvent) {
        if (document.exitPointerLock) document.exitPointerLock();

        var startPos = e.startPosition;
        // position
        // if (startPos.x < Engine.screenSize.width * 0.5) {
        //     this._velocity.x = 0;
        //     this._velocity.z = 0;
        // }
    }

    update() {
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