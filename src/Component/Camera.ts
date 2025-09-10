import { Color } from "../Utils/Color";
import { EngineConfig } from "../Core/Engine";
import { Vector4 } from "../Math/Vector4";
import { Component } from "./Component";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector3 } from "../Math/Vector3";
import { Logger } from "../Utils/Logger";

export enum CameraClearFlags {
    NONE = 0,
    ALL = 16384 | 256,
    Color = 16384,  //gl.COLOR_BUFFER_BIT
    Depth = 256,    //gl.DEPTH_BUFFER_BIT
}

export class Camera extends Component {
    public static mainCamera: Camera;
    private static cameras: Array<Camera> = new Array<Camera>();

    public backGroundColor: Color = new Color(0.27, 0.27, 0.27, 1.0);
    public fogColor: Color = new Color(0.27, 0.27, 0.27, 1.0);
    public clearFlags: CameraClearFlags = CameraClearFlags.Color | CameraClearFlags.Depth;
    public nearClip: number = 1;
    public farClip: number = 128;
    public fov: number = 60;
    public depth: number = 0;
    public viewPort: Vector4 = new Vector4(0, 0, 1, 1);

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
    
    public update(): void {
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
        return Matrix4x4.perspective(this.fov, this.aspect, this.nearClip, this.farClip);
    }
}