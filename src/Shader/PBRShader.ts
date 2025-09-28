import { Color } from "../Math/Color";
import { Matrix3x3 } from "../Math/Matrix3x3";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { ShaderPass, VertexAttributes } from "../Renderer/RendererDefine";
import { Texture } from "../Resources/Texture";
import { Shader } from "./Shader";

function saturate(v: number) {
    return Math.max(0, Math.min(1, v));
}

export class PBRShader extends Shader {

    public normalTexture: Texture | null = null;
    public specularColor: Color = Color.WHITE;
    public gloss: number = 50;
    public bumpScale: number = 1;

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
        }
    ];

    public vertexShader(input: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        const vertex = input.vertex as Vector3;
        const normal = input.normal as Vector3;
        const tangent = input.tangent as Vector4;
        const tangentXYZ = new Vector3(tangent);

        const uv = input.uv as Vector2;
        const u = uv.u * this.mainTextureST.x + this.mainTextureST.z
        const v = uv.v * this.mainTextureST.y + this.mainTextureST.w

        // 计算副切线
        const binormal = Vector3.cross(Vector3.normalize(normal), Vector3.normalize(tangentXYZ)).multiplyScalar(tangent.w);
        // 计算模型空间变换到切线空间的矩阵
        const rotation = new Matrix3x3(tangentXYZ, binormal, normal);

        // 模型空间下的光照方向
        const lightDir = rotation.multiplyVector3(TransformTools.ObjSpaceLightDir(vertex, this.light, this.transform));
        // 模型空间下的视角方向
        const viewDir = rotation.multiplyVector3(TransformTools.ObjSpaceViewDir(vertex, this.camera, this.transform));

        const outAttr: VertexAttributes = {
            uv: new Vector2(u, v),
            lightDir: lightDir,
            viewDir: viewDir,
        };
        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(input.vertex as Vector3, 1)),
            attrOut: outAttr,
        };
    }

    public fragmentShader(input: VertexAttributes): Color | null {
        if (!this.mainTexture) { return Color.MAGENTA; }

        const uv = input.uv as Vector2;
        const normal = input.normal as Vector3;

        const tangentLightDir = (input.lightDir as Vector3).normalize();
        const tangentViewDir = (input.viewDir as Vector3).normalize();

        // 采样法线
        const packedNormal = this.normalTexture?.Sample(uv.u, uv.v);
        const tangentNormal = packedNormal ? new Vector3(
            (packedNormal.r * 2 - 1) * this.bumpScale,
            (packedNormal.g * 2 - 1) * this.bumpScale,
            0,
        ) : Vector3.ONE;
        const tangentNormalXY = new Vector2(tangentNormal);
        tangentNormal.z = Math.sqrt(1 - saturate(Vector2.dot(tangentNormalXY, tangentNormalXY)));

        // 采样基础颜色
        const albedo = this.mainTexture.Sample(uv.u, uv.v).multiply(this.baseColor);

        // 环境光
        const ambient = Color.multiply(this.ambientLight, albedo);

        // 漫反射
        const diffuse = Color.multiply(this.lightColor, albedo).multiplyScalar(Math.max(0, Vector3.dot(tangentNormal, tangentLightDir)));

        // 半角向量
        const halfDir = Vector3.add(tangentLightDir, tangentViewDir).normalize();

        // 高光
        const specular = Color.multiply(this.lightColor, this.specularColor).multiplyScalar(Math.pow(Math.max(0, Vector3.dot(tangentNormal, halfDir)), this.gloss));

        return Color.add(ambient, diffuse).add(specular);
    }
}