import { Color } from "../Math/Color";
import { Vector4 } from "../Math/Vector4";
import { Component } from "./Component";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Time } from "../Core/Time";
import { DisallowMultipleComponent } from "../Core/Decorators";
import { EngineConfig } from "../Core/Setting";

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

    public targetTexture: null;
    public backGroundColor: number = Color.GRAY;
    public clearFlags: CameraClearFlags = CameraClearFlags.Color;
    public nearClip: number = 1;
    public farClip: number = 128;
    public fov: number = 60;
    public depth: number = -1;
    public viewPort: Vector4 = new Vector4(0, 0, 1, 1);
    public projection: Projection = Projection.Perspective;
    public orthographicSize: number = 5;
    public renderingPath: RenderingPath = RenderingPath.Forward;
    public occlusionCulling: boolean = false;

    public get aspect(): number {
        var v = this.viewPort;
        return (v.z * EngineConfig.canvasWidth) / (v.w * EngineConfig.canvasHeight);
    }

    public awake(): void {
        if (Camera.mainCamera == null) {
            Camera.mainCamera = this;
        }
        Camera.cameras.push(this);
        this.transform.forward;
    }

    private timer: number = 0;
    public counter: number = 0;
    public update(): void {
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
        // 1. 获取相机的世界变换矩阵
        const worldMatrix = this.transform.localToWorldMatrix;
        // 2. 计算逆矩阵（世界空间 → 视图空间）
        const viewMatrix = worldMatrix.clone().invert();
        return viewMatrix;
    }

    public getProjectionMatrix(): Matrix4x4 {
        if (this.projection == Projection.Orthographic) {
            return Matrix4x4.orthographic(-this.orthographicSize, this.orthographicSize, -this.orthographicSize, this.orthographicSize, this.nearClip, this.farClip);
        }
        else {
            return Matrix4x4.perspective(this.fov, this.aspect, this.nearClip, this.farClip);
        }
    }
}