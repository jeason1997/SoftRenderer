import { Camera } from "../Component/Camera";
import { Light } from "../Component/Light";
import { RenderSettings } from "../Core/Setting";
import { Transform } from "../Core/Transform";
import { UObject } from "../Core/UObject";
import { Color } from "../Math/Color";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { RenderType, ShaderPass, VertexAttributes } from "../Renderer/RendererDefine";
import { Texture } from "../Resources/Texture";

export abstract class Shader extends UObject {
    public renderType: RenderType = RenderType.Opaque;
    public renderQueue: number = 0;

    // 一些全局参数，CPU传给GPU
    protected transform: Transform;
    protected camera: Camera;
    protected viewDir: Vector3;
    protected modelMatrix: Matrix4x4;
    protected viewMatrix: Matrix4x4;
    protected projectionMatrix: Matrix4x4;
    protected mvpMatrix: Matrix4x4;
    protected normalMatrix: Matrix4x4;
    protected light: Light;
    protected lightColor: Color;
    protected lightDirection: Vector3;
    protected lightIntensity: number;
    protected ambientLight: Color;

    public passes: ShaderPass[] = [];

    public init(transform: Transform, camera: Camera): void {
        this.transform = transform;
        this.camera = camera;
        this.viewDir = camera.transform.forward.negate().normalize();

        this.modelMatrix = this.transform.localToWorldMatrix;
        this.viewMatrix = this.camera.getViewMatrix();
        this.projectionMatrix = this.camera.getProjectionMatrix();
        this.mvpMatrix = this.projectionMatrix.clone().multiply(this.viewMatrix).multiply(this.modelMatrix);

        this.normalMatrix = this.transform.localToWorldNormalMatrix;

        this.light = Light.sunLight;
        this.ambientLight = RenderSettings.ambientLight;
        this.lightColor = this.light.color;
        this.lightDirection = this.light.transform.forward.normalize();
        this.lightIntensity = this.light.intensity;
    }

    public onDestroy(): void {
        throw new Error("Method not implemented.");
    }

    //#region 着色器通用模板
    public baseColor: Color = Color.WHITE;
    public mainTexture: Texture | null = null;
    public mainTextureST: Vector4 = new Vector4(1, 1, 0, 0);

    // 通用顶点函数，将顶点坐标以及法线变换到裁剪空间
    protected vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1)),
            attrOut: {
                uv: inAttr.uv,
                normal: this.normalMatrix.multiplyVector3(inAttr.normal as Vector3),
            }
        };
    }

    // 通用着色器函数，采样纹理与基础颜色相乘
    protected fragmentShader(v2fAttr: VertexAttributes): Color | null {
        if (!this.mainTexture) return Color.MAGENTA;
        const uv = v2fAttr.uv as Vector2;
        const sampledColor = this.mainTexture.Sample(
            uv.u * this.mainTextureST.x + this.mainTextureST.z,
            uv.v * this.mainTextureST.y + this.mainTextureST.w
        );
        return Color.multiply(sampledColor, this.baseColor);
    }
    //#endregion
}