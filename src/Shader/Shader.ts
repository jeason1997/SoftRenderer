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
import { VertexAttributes } from "../Renderer/TriangleRasterizer";
import { Texture } from "../Resources/Texture";

export abstract class Shader extends UObject {
    public mainTexture: Texture;

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

    public abstract vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4, attrOut: VertexAttributes };
    public abstract fragmentShader(v2fAttr: VertexAttributes): Color;

    constructor(transform: Transform) {
        super();
        this.transform = transform;
    }

    public init(camera: Camera): void {
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