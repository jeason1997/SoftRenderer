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

    // 缓存矩阵以提高性能
    private _selfMatrix: Matrix4x4 | null = null;
    private _localToWorldNormalMatrix: Matrix4x4 | null = null;
    private _localToWorldMatrix: Matrix4x4 | null = null;
    private _worldToLocalMatrix: Matrix4x4 | null = null;

    // 脏标记，用于跟踪变换是否已更改
    private _isDirty: boolean = true;

    // 方向向量缓存
    private _forward: Vector3 | null = null;
    private _up: Vector3 | null = null;
    private _right: Vector3 | null = null;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.children = new Array<Transform>();
        this._parent = null;
        this._tempPos = Vector3.ZERO;
        this._tempRot = Quaternion.identity;
        this._tempScale = Vector3.ONE;
    }

    /**
     * 标记当前变换为脏，需要重新计算矩阵
     * 同时标记所有子节点为脏
     */
    private setDirty(): void {
        this._isDirty = true;
        this._selfMatrix = null;
        this._localToWorldMatrix = null;
        this._worldToLocalMatrix = null;
        this._localToWorldNormalMatrix = null;

        // 通知所有组件变换发生了变化
        const components = this.gameObject.getAllComponents();
        for (const component of components) {
            if (typeof (component as any).onTransformChanged === 'function') {
                (component as any).onTransformChanged();
            }
        }

        // 递归标记所有子节点为脏
        for (const child of this.children) {
            child.setDirty();
        }
    }

    public get selfMatrix(): Matrix4x4 {
        if (this._selfMatrix === null || this._isDirty) {
            this._selfMatrix = Matrix4x4.getTRSMatrix(this._tempPos, this._tempRot, this._tempScale);
            // selfMatrix是最基础的矩阵，当它更新后，所有矩阵都应该被认为是干净的
            // 注意：localToWorldMatrix和worldToLocalMatrix的计算会自动处理
            this._isDirty = false;
        }
        return this._selfMatrix.clone();
    }

    public get localToWorldNormalMatrix(): Matrix4x4 {
        if (this._localToWorldNormalMatrix === null || this._isDirty) {
            this._localToWorldNormalMatrix = this.localToWorldMatrix.invert().transpose();
        }
        return this._localToWorldNormalMatrix.clone();
    }

    public get localToWorldMatrix(): Matrix4x4 {
        if (this._localToWorldMatrix === null || this._isDirty) {
            const p = this.parent != null ? this.parent.localToWorldMatrix : Matrix4x4.identity;
            this._localToWorldMatrix = p.multiply(this.selfMatrix);
            // 当selfMatrix被访问时，_isDirty已经被设置为false
        }
        return this._localToWorldMatrix.clone();
    }

    public get worldToLocalMatrix(): Matrix4x4 {
        if (this._worldToLocalMatrix === null || this._isDirty) {
            const p = this.parent != null ? this.parent.worldToLocalMatrix : Matrix4x4.identity;
            this._worldToLocalMatrix = this.selfMatrix.invert().multiply(p);
            // 当selfMatrix被访问时，_isDirty已经被设置为false
        }
        return this._worldToLocalMatrix.clone();
    }

    public get forward(): Vector3 {
        // 使用缓存优化，避免重复计算和创建临时对象
        if (this._isDirty || !this._forward) {
            this._forward = this.convertToWorldSpace(Vector3.FORWARD, 0);
        }
        return this._forward.clone();
    }

    public get up(): Vector3 {
        // 使用缓存优化，避免重复计算和创建临时对象
        if (this._isDirty || !this._up) {
            this._up = this.convertToWorldSpace(Vector3.UP, 0);
        }
        return this._up.clone();
    }

    public get right(): Vector3 {
        // 使用缓存优化，避免重复计算和创建临时对象
        if (this._isDirty || !this._right) {
            this._right = this.convertToWorldSpace(Vector3.RIGHT, 0);
        }
        return this._right.clone();
    }

    public get position(): Vector3 {
        return this._tempPos.clone();
    }

    public set position(pos: Vector3) {
        this._tempPos = pos;
        this.setDirty();
    }

    public get worldPosition(): Vector3 {
        return this.localToWorldMatrix.getTranslate();
    }

    public get rotation(): Quaternion {
        return this._tempRot.clone();
    }

    public set rotation(q: Quaternion) {
        this._tempRot = q;
        this.setDirty();
    }

    public get worldRotation(): Quaternion {
        return this.localToWorldMatrix.getRotate();
    }

    public get scale(): Vector3 {
        return this._tempScale.clone();
    }

    public set scale(s: Vector3) {
        this._tempScale = s;
        this.setDirty();
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

        // 设置脏标记，因为父节点关系改变会影响变换矩阵
        this.setDirty();
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

            // 设置脏标记，因为父节点关系改变会影响变换矩阵
            child.setDirty();

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
            // 设置脏标记，因为父节点关系改变会影响变换矩阵
            child.setDirty();
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