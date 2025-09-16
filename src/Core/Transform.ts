import { GameObject } from "./GameObject";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";

export class Transform {
    public readonly gameObject: GameObject;
    public readonly children: Array<Transform>;

    private _parent: Transform | null = null;
    private _tempPos: Vector3;
    private _tempRot: Quaternion;
    private _tempScale: Vector3;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.children = new Array<Transform>();
        this._parent = null;
        this._tempPos = Vector3.ZERO;
        this._tempRot = Quaternion.identity;
        this._tempScale = Vector3.ONE;
    }

    public get selfMatrix(): Matrix4x4 {
        return Matrix4x4.getTRSMatrix(this._tempPos, this._tempRot, this._tempScale);
    }

    public get localToWorldMatrix(): Matrix4x4 {
        var p = this.parent != null ? this.parent.localToWorldMatrix : Matrix4x4.identity;
        return p.multiply(this.selfMatrix);
    }

    public get worldToLocalMatrix(): Matrix4x4 {
        var p = this.parent != null ? this.parent.worldToLocalMatrix : Matrix4x4.identity;
        return this.selfMatrix.invert().multiply(p);
    }

    public get x(): number {
        return this.position.x;
    }

    public set x(x: number) {
        var pos = this.position;
        pos.x = x;
        this.position = pos;
    }

    public get y(): number {
        return this.position.y;
    }

    public set y(y: number) {
        var pos = this.position;
        pos.y = y;
        this.position = pos;
    }

    public get z(): number {
        return this.position.z;
    }

    public set z(z: number) {
        var pos = this.position;
        pos.z = z;
        this.position = pos;
    }

    public get forward(): Vector3 {
        //我们要得到的是一个方向，因此不需要位置信息，将齐次坐标的w设置为0，抛弃掉坐标信息
        return this.convertToWorldSpace(Vector3.FORWARD, 0);
    }

    public get up(): Vector3 {
        return this.convertToWorldSpace(Vector3.UP, 0);
    }

    public get right(): Vector3 {
        return this.convertToWorldSpace(Vector3.RIGHT, 0);
    }

    public get position(): Vector3 {
        return this._tempPos.clone();
    }

    public set position(pos: Vector3) {
        this._tempPos = pos;
    }

    public get worldPosition(): Vector3 {
        return this.localToWorldMatrix.getTranslate();
    }

    public get rotation(): Quaternion {
        return this._tempRot.clone();
    }

    public set rotation(q: Quaternion) {
        this._tempRot = q;
    }

    public get worldRotation(): Quaternion {
        return this.localToWorldMatrix.getRotate();
    }

    public get scale(): Vector3 {
        return this._tempScale.clone();
    }

    public set scale(s: Vector3) {
        this._tempScale = s;
    }

    public get worldScale(): Vector3 {
        return this.localToWorldMatrix.getScale();
    }

    public get parent(): Transform | null {
        return this._parent;
    }

    public setParent(parent: Transform, worldPositionStays: boolean = true) {
        if (parent != null && parent != this && parent != this.parent) {
            //防止出现：父节点是当前节点的子节点，将子节的设置为自己的父节点，会死循环
            if (parent.hasParent(this)) {
                console.error("Failed to set parent, this node is the parent node's parent.");
                return;
            }

            //如果当前节点有父节点，要先移除旧的
            if (this.parent != null) {
                this.parent.removeChild(this, worldPositionStays);
            }

            parent.addChild(this, worldPositionStays);
        }
        else if (parent == null && this.parent != null) {
            this.parent.removeChild(this, worldPositionStays);
        }
    }

    //节点p是否是当前节点的上级
    public hasParent(p: Transform): boolean {
        if (this.parent == null)
            return false;
        else if (this.parent == p)
            return true;
        else
            return this.parent.hasParent(p);
    }

    private addChild(child: Transform, worldPositionStays: boolean = true): boolean {
        if (child != null && child != this && !this.children.includes(child)) {
            //防止出现：child节点是当前节点的父节点，将父节的设置为自己的子节点，会死循环
            if (this.hasParent(child)) {
                console.error("Failed to add child, this node is the child node's child.");
                return false;
            }

            //如果子节点有旧的父节点，要先移除
            if (child.parent != null) {
                child.parent.removeChild(child, worldPositionStays);
            }

            this.children.push(child);
            child._parent = this;

            if (worldPositionStays) {
                //保留原世界坐标位置，先朝父节点的变换的反方向移动，然后再添加进去，就能保持世界坐标不变
                //即变换到父节点的逆矩阵里
                var m = this.worldToLocalMatrix.multiply(child.selfMatrix);
                child._tempPos = m.getTranslate();
                child._tempRot = m.getRotate();
                child._tempScale = m.getScale();
            }

            return true;
        }
        return false;
    }

    private removeChild(child: Transform, worldPositionStays: boolean = true): boolean {
        var index = this.children.indexOf(child, 0);

        if (index > -1) {

            if (worldPositionStays) {
                //保留世界坐标，直接将本地坐标等同于当前世界坐标即可
                var m = this.localToWorldMatrix.multiply(child.selfMatrix);
                child._tempPos = m.getTranslate();
                child._tempRot = m.getRotate();
                child._tempScale = m.getScale();
            }

            this.children.splice(index, 1);
            child._parent = null;
            return true;
        }
        return false;
    }

    public convertToNodeSpace(v: Vector3, w: number = 1): Vector3 {
        /*
         *将某个坐标转到自己的局部空间，例如当前的局部坐标原点在世界坐标的（1，1）处
         *点p在世界坐标（2，1）处，那么将点p相对于当前局部坐标系的位置就是（2，1）-（1，1）= （1， 0）
         *即将点p反向变换当前的矩阵 
         */
        return this.worldToLocalMatrix.multiplyVector4(new Vector4(v, w)).vector3;
    }

    public convertToWorldSpace(v: Vector3, w: number = 1): Vector3 {
        return this.localToWorldMatrix.multiplyVector4(new Vector4(v, w)).vector3;
    }

    public destroy(destroyChildren: boolean = true) {
        if (destroyChildren) {
            this.children.forEach(child => {
                child.destroy(destroyChildren);
            });
        }
        else {
            this.children.forEach(child => {
                this.removeChild(child);
            });
        }
    }
}