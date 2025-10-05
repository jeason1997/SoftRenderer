import { Color } from "../Math/Color";
import { Vector4 } from "../Math/Vector4";
import { Vector3 } from "../Math/Vector3";
import { Component } from "./Component";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Time } from "../Core/Time";
import { DisallowMultipleComponent } from "../Core/Decorators";
import { EngineConfig } from "../Core/Setting";
import { Texture } from "../Resources/Texture";
import { Plane } from "../Math/Panel";

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
    public backGroundColor: Color = Color.GRAY;
    public clearFlags: CameraClearFlags = CameraClearFlags.Skybox;
    private _nearClip: number = 1;
    private _farClip: number = 128;
    private _fov: number = 60;
    public depth: number = -1;
    private _viewPort: Vector4 = new Vector4(0, 0, 1, 1);
    private _projection: Projection = Projection.Perspective;
    private _orthographicSize: number = 5;
    public renderingPath: RenderingPath = RenderingPath.Forward;
    public occlusionCulling: boolean = false;

    // 缓存矩阵和视锥体平面
    private _viewMatrix: Matrix4x4 | null = null;
    private _projectionMatrix: Matrix4x4 | null = null;
    private _frustumPlanes: Plane[] | null = null;

    // 脏标记
    private _viewMatrixDirty: boolean = true;
    private _projectionMatrixDirty: boolean = true;
    private _frustumPlanesDirty: boolean = true;

    public get aspect(): number {
        const v = this.viewPort;
        return (v.z * EngineConfig.canvasWidth) / (v.w * EngineConfig.canvasHeight);
    }

    public get nearClip(): number {
        return this._nearClip;
    }

    public set nearClip(value: number) {
        if (this._nearClip !== value) {
            this._nearClip = value;
            this._projectionMatrixDirty = true;
            this._frustumPlanesDirty = true;
        }
    }

    public get farClip(): number {
        return this._farClip;
    }

    public set farClip(value: number) {
        if (this._farClip !== value) {
            this._farClip = value;
            this._projectionMatrixDirty = true;
            this._frustumPlanesDirty = true;
        }
    }

    public get fov(): number {
        return this._fov;
    }

    public set fov(value: number) {
        if (this._fov !== value) {
            this._fov = value;
            this._projectionMatrixDirty = true;
            this._frustumPlanesDirty = true;
        }
    }

    public get viewPort(): Vector4 {
        return this._viewPort;
    }

    public set viewPort(value: Vector4) {
        if (!this._viewPort.equals(value)) {
            this._viewPort = value;
            this._projectionMatrixDirty = true;
            this._frustumPlanesDirty = true;
        }
    }

    public get projection(): Projection {
        return this._projection;
    }

    public set projection(value: Projection) {
        if (this._projection !== value) {
            this._projection = value;
            this._projectionMatrixDirty = true;
            this._frustumPlanesDirty = true;
        }
    }

    public get orthographicSize(): number {
        return this._orthographicSize;
    }

    public set orthographicSize(value: number) {
        if (this._orthographicSize !== value) {
            this._orthographicSize = value;
            this._projectionMatrixDirty = true;
            this._frustumPlanesDirty = true;
        }
    }

    public onAwake(): void {
        if (Camera.mainCamera == null) {
            Camera.mainCamera = this;
        }
        Camera.cameras.push(this);
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
        const index = Camera.cameras.indexOf(this, 0);
        if (index > -1) {
            Camera.cameras.splice(index, 1);
        }

        if (Camera.mainCamera === this) {
            Camera.mainCamera = Camera.cameras.length > 0 ? Camera.cameras[0] : (undefined as unknown as Camera);
        }
    }

    public getViewMatrix(): Matrix4x4 {
        if (this._viewMatrixDirty || !this._viewMatrix) {
            // 1. 获取相机的世界变换矩阵
            const worldMatrix = this.transform.localToWorldMatrix;
            // 2. 计算逆矩阵（世界空间 → 视图空间）
            this._viewMatrix = worldMatrix.invert();
            this._viewMatrixDirty = false;
        }
        // 返回矩阵的副本，防止外部修改
        return this._viewMatrix!.clone();
    }

    public getProjectionMatrix(): Matrix4x4 {
        if (this._projectionMatrixDirty || !this._projectionMatrix) {
            if (this.projection === Projection.Orthographic) {
                this._projectionMatrix = Matrix4x4.orthographic(
                    -this.orthographicSize,
                    this.orthographicSize,
                    -this.orthographicSize * (this.aspect ? 1 / this.aspect : 1), // 修复正交投影宽高比
                    this.orthographicSize * (this.aspect ? 1 / this.aspect : 1),
                    this.nearClip,
                    this.farClip
                );
            } else {
                this._projectionMatrix = Matrix4x4.perspective(
                    this.fov,
                    this.aspect,
                    this.nearClip,
                    this.farClip
                );
            }
            this._projectionMatrixDirty = false;
        }
        // 返回矩阵的副本，防止外部修改
        return this._projectionMatrix.clone();
    }

    // 当Transform发生变化时，需要更新视图矩阵
    public onTransformChanged(): void {
        this._viewMatrixDirty = true;
        this._frustumPlanesDirty = true;
    }

    /**
     * 获取视锥体的6个平面（左、右、下、上、近、远）
     * @returns 归一化后的平面数组，顺序为 [左平面, 右平面, 下平面, 上平面, 近平面, 远平面]
     */
    public getFrustumPlanes(): Plane[] {
        // 若平面未过期且已缓存，直接返回副本（避免外部修改）
        if (!this._frustumPlanesDirty && this._frustumPlanes) {
            return this._frustumPlanes;
        }

        // 1. 获取视图矩阵和投影矩阵，计算复合矩阵（投影 × 视图）
        const viewMatrix = this.getViewMatrix();
        const projMatrix = this.getProjectionMatrix();
        const viewProjMatrix = projMatrix.multiply(viewMatrix); // 复合矩阵：世界空间 → 裁剪空间
        const m = viewProjMatrix.matrix;

        // 2. 推导6个视锥体平面（公式来自图形学标准，适配列主序矩阵）
        const planes: Plane[] = [
            // 左平面
            new Plane(m[3][0] + m[0][0], m[3][1] + m[0][1], m[3][2] + m[0][2], m[3][3] + m[0][3]),
            // 右平面
            new Plane(m[3][0] - m[0][0], m[3][1] - m[0][1], m[3][2] - m[0][2], m[3][3] - m[0][3]),
            // 下平面
            new Plane(m[3][0] + m[1][0], m[3][1] + m[1][1], m[3][2] + m[1][2], m[3][3] + m[1][3]),
            // 上平面
            new Plane(m[3][0] - m[1][0], m[3][1] - m[1][1], m[3][2] - m[1][2], m[3][3] - m[1][3]),
            // 近平面
            new Plane(m[3][0] + m[2][0], m[3][1] + m[2][1], m[3][2] + m[2][2], m[3][3] + m[2][3]),
            // 远平面
            new Plane(m[3][0] - m[2][0], m[3][1] - m[2][1], m[3][2] - m[2][2], m[3][3] - m[2][3])
        ];

        // 3. 归一化所有平面（确保法向量长度为1，保证后续距离计算精度）
        planes.forEach(plane => plane.normalize());

        // 4. 缓存平面并标记为未过期
        this._frustumPlanes = planes;
        this._frustumPlanesDirty = false;

        // 5. 返回平面副本（避免外部修改缓存的内部数据）
        return planes;
    }

    /**
     * 判断世界空间中的点是否在视锥体内
     * @param worldPoint 待判断的世界空间点
     * @returns true：点在视锥体内；false：点在视锥体外
     */
    public isPointInFrustum(worldPoint: Vector3): boolean {
        // 1. 获取视锥体6个平面（若未缓存则自动计算，已处理归一化）
        const frustumPlanes = this.getFrustumPlanes();

        // 2. 遍历所有平面，判断点是否在平面外侧
        for (const plane of frustumPlanes) {
            // 计算点到平面的距离（平面已归一化，距离公式简化为 Ax+By+Cz+D）
            // 视锥体平面的法线方向遵循 “指向视锥体内部”，若点到平面的距离 > 0，则点在平面内侧（视锥体内部）
            const distance = plane.distanceToPoint(worldPoint);

            // 若点到任意平面的距离 < 0（严格外侧，考虑浮点误差用-1e-6容差），则点在视锥体外
            if (distance < -1e-6) {
                return false;
            }
        }

        // 3. 点到所有平面的距离 ≥ -1e-6，判定在视锥体内
        return true;
    }
}