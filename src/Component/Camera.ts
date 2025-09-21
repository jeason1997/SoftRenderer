import { Color } from "../Math/Color";
import { Vector4 } from "../Math/Vector4";
import { Component } from "./Component";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Time } from "../Core/Time";
import { DisallowMultipleComponent } from "../Core/Decorators";
import { EngineConfig } from "../Core/Setting";
import { Texture } from "../Resources/Texture";

export enum CameraClearFlags {
    None = 0,
    Skybox = 1,
    Color = 2,
    DepthOnly = 3,
}

export enum Projection {
    Perspective = 0,
    Orthographic = 1,
}

export enum RenderingPath {
    VertexLit = 0,
    Forward = 1,
    Deferred = 2,
}

@DisallowMultipleComponent
export class Camera extends Component {
    public static mainCamera: Camera;
    public static cameras: Array<Camera> = new Array<Camera>();

    public targetTexture: Texture;
    public backGroundColor: number = Color.GRAY;
    public clearFlags: CameraClearFlags = CameraClearFlags.Color;
    private _nearClip: number = 1;
    private _farClip: number = 128;
    private _fov: number = 60;
    public depth: number = -1;
    private _viewPort: Vector4 = new Vector4(0, 0, 1, 1);
    private _projection: Projection = Projection.Perspective;
    private _orthographicSize: number = 5;
    public renderingPath: RenderingPath = RenderingPath.Forward;
    public occlusionCulling: boolean = false;

    // 缓存矩阵
    private _viewMatrix: Matrix4x4 | null = null;
    private _projectionMatrix: Matrix4x4 | null = null;
    
    // 脏标记
    private _viewMatrixDirty: boolean = true;
    private _projectionMatrixDirty: boolean = true;

    public get aspect(): number {
        var v = this.viewPort;
        return (v.z * EngineConfig.canvasWidth) / (v.w * EngineConfig.canvasHeight);
    }
    
    public get nearClip(): number {
        return this._nearClip;
    }
    
    public set nearClip(value: number) {
        if (this._nearClip !== value) {
            this._nearClip = value;
            this._projectionMatrixDirty = true;
        }
    }
    
    public get farClip(): number {
        return this._farClip;
    }
    
    public set farClip(value: number) {
        if (this._farClip !== value) {
            this._farClip = value;
            this._projectionMatrixDirty = true;
        }
    }
    
    public get fov(): number {
        return this._fov;
    }
    
    public set fov(value: number) {
        if (this._fov !== value) {
            this._fov = value;
            this._projectionMatrixDirty = true;
        }
    }
    
    public get viewPort(): Vector4 {
        return this._viewPort;
    }
    
    public set viewPort(value: Vector4) {
        if (!this._viewPort.equals(value)) {
            this._viewPort = value;
            this._projectionMatrixDirty = true;
        }
    }
    
    public get projection(): Projection {
        return this._projection;
    }
    
    public set projection(value: Projection) {
        if (this._projection !== value) {
            this._projection = value;
            this._projectionMatrixDirty = true;
        }
    }
    
    public get orthographicSize(): number {
        return this._orthographicSize;
    }
    
    public set orthographicSize(value: number) {
        if (this._orthographicSize !== value) {
            this._orthographicSize = value;
            this._projectionMatrixDirty = true;
        }
    }

    public onAwake(): void {
        if (Camera.mainCamera == null) {
            Camera.mainCamera = this;
        }
        Camera.cameras.push(this);
        this.transform.forward;
    }

    private timer: number = 0;
    public counter: number = 0;
    public onUpdate(): void {
        if (Time.time - this.timer >= 1) {
            this.timer = Time.time;
            this.counter++;
        }
    }

    public onDestroy() {
        var index = Camera.cameras.indexOf(this, 0);
        if (index > -1) {
            Camera.cameras.splice(index, 1);
        }

        if (Camera.mainCamera == this) {
            if (Camera.cameras.length > 0)
                Camera.mainCamera = Camera.cameras[0];
            else
                Camera.mainCamera = undefined as unknown as Camera;
        }
    }

    public getViewMatrix(): Matrix4x4 {
        if (this._viewMatrixDirty || !this._viewMatrix) {
            // 1. 获取相机的世界变换矩阵
            const worldMatrix = this.transform.localToWorldMatrix;
            // 2. 计算逆矩阵（世界空间 → 视图空间）
            this._viewMatrix = worldMatrix.clone().invert();
            this._viewMatrixDirty = false;
        }
        // 返回矩阵的副本，防止外部修改
        return this._viewMatrix!.clone();
    }

    public getProjectionMatrix(): Matrix4x4 {
        if (this._projectionMatrixDirty || !this._projectionMatrix) {
            if (this.projection == Projection.Orthographic) {
                this._projectionMatrix = Matrix4x4.orthographic(-this.orthographicSize, this.orthographicSize, -this.orthographicSize, this.orthographicSize, this.nearClip, this.farClip);
            }
            else {
                this._projectionMatrix = Matrix4x4.perspective(this.fov, this.aspect, this.nearClip, this.farClip);
            }
            this._projectionMatrixDirty = false;
        }
        // 返回矩阵的副本，防止外部修改
        return this._projectionMatrix.clone();
    }

    // 当Transform发生变化时，需要更新视图矩阵
    public onTransformChanged(): void {
        this._viewMatrixDirty = true;
    }
}