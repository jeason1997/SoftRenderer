import { Camera } from "../Component/Camera";
import { Light } from "../Component/Light";
import { RenderSettings } from "../Core/Setting";
import { Transform } from "../Core/Transform";
import { UObject } from "../Core/UObject";
import { Color } from "../Math/Color";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { BlendMode, CullMode, RenderType, VertexAttributes, ZTest } from "../Renderer/RendererDefine";

// 着色器Pass接口
export interface ShaderPass {
    name?: string;
    // 顶点着色器：带默认实现
    vert: (input: VertexAttributes) => { vertexOut: Vector4; attrOut: VertexAttributes; };
    // 片段着色器：默认返回洋红色
    frag: (input: VertexAttributes) => Color;
    // 渲染状态
    blendMode: BlendMode;
    cullMode: CullMode;
    zTest: ZTest;
    zWrite: boolean;
}

export abstract class Shader extends UObject {
    public renderType: RenderType = RenderType.Opaque;
    public renderQueue: number = 0;

    protected transform: Transform;
    protected camera: Camera;
    protected viewDir: Vector3;
    protected modelMatrix: Matrix4x4;
    protected viewMatrix: Matrix4x4;
    protected projectionMatrix: Matrix4x4;
    protected mvpMatrix: Matrix4x4;
    protected lightDirection: Vector3;
    protected ambientLight: Color;
    protected lightColor: Color;
    protected lightIntensity: number;

    public passes: ShaderPass[] = [];

    public init(transform: Transform, camera: Camera): void {
        this.transform = transform;
        this.camera = camera;
        this.viewDir = camera.transform.forward.negate().normalize();

        this.modelMatrix = this.transform.localToWorldMatrix;
        this.viewMatrix = this.camera.getViewMatrix();
        this.projectionMatrix = this.camera.getProjectionMatrix();
        this.mvpMatrix = this.projectionMatrix.multiply(this.viewMatrix).multiply(this.modelMatrix);

        const light = Light.sunLight;
        this.ambientLight = RenderSettings.ambientLight;
        this.lightColor = light.color;
        this.lightDirection = light.transform.forward.normalize();
        this.lightIntensity = light.intensity;
    }

    public onDestroy(): void {
        throw new Error("Method not implemented.");
    }
}

export { VertexAttributes, CullMode, ZTest };
