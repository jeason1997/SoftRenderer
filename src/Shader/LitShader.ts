import { Color } from "../Math/Color";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { BlendMode, CullMode, VertexAttributes, ZTest } from "../Renderer/RendererDefine";
import { Texture } from "../Resources/Texture";
import { Shader, ShaderPass } from "./Shader";

export class LitShader extends Shader {

    public mainTexture: Texture | null = null;
    public mainTextureST: Vector4 = new Vector4(0, 0, 1, 1);

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
            blendMode: BlendMode.Opaque,
            cullMode: CullMode.Back,
            zTest: ZTest.LessEqual,
            zWrite: true,
        }
    ];

    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        const normalOut = TransformTools.ModelToWorldNormal(inAttr.normal as Vector3, this.transform);
        const outAttr: VertexAttributes = {
            uv: inAttr.uv,
            normal: normalOut,
        };
        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1)),
            attrOut: outAttr,
        };
    }

    public fragmentShader(v2fAttr: VertexAttributes): Color {
        if (!this.mainTexture) { return Color.MAGENTA; }

        const uv = v2fAttr.uv as Vector2;
        const normal = v2fAttr.normal as Vector3;

        const surfaceColor = this.mainTexture.Sample(uv.u, uv.v);

        // 高光系数，值越大高光越集中
        const shininess: number = 100

        // 确保法向量归一化
        const normalizedNormal = normal.normalize();

        // 计算漫反射（半兰伯特）部分
        const dotProduct = Math.max(0, Vector3.dot(normalizedNormal, this.lightDirection)) * 0.5 + 0.5;

        // 计算高光（Phong）部分
        // 1. 计算反射光方向 = 2*(法向量·光源方向)*法向量 - 光源方向
        const reflectDir = normalizedNormal.clone()
            .multiplyScalar(2 * Vector3.dot(normalizedNormal, this.lightDirection))
            .subtract(this.lightDirection)
            .normalize();

        // 2. 计算反射方向与视角方向的点积
        const specDot = Math.max(0, Vector3.dot(reflectDir, this.viewDir));

        // 3. 计算高光因子（使用高光系数控制高光范围）
        const specularFactor = Math.pow(specDot, shininess);

        // 4. 计算高光颜色（通常使用光源颜色，可添加高光强度参数）
        const specularIntensity = 0.5; // 高光强度
        const specularR = this.lightColor.r * specularIntensity * specularFactor;
        const specularG = this.lightColor.g * specularIntensity * specularFactor;
        const specularB = this.lightColor.b * specularIntensity * specularFactor;

        // 计算漫反射颜色
        const diffR = surfaceColor.r * this.lightColor.r * this.lightIntensity * dotProduct;
        const diffG = surfaceColor.g * this.lightColor.g * this.lightIntensity * dotProduct;
        const diffB = surfaceColor.b * this.lightColor.b * this.lightIntensity * dotProduct;

        // 合并所有光照贡献（环境光 + 漫反射 + 高光）
        const totalR = this.ambientLight.r + diffR + specularR;
        const totalG = this.ambientLight.g + diffG + specularG;
        const totalB = this.ambientLight.b + diffB + specularB;

        // 确保颜色值在0-1范围内
        const clampedR = Math.min(1, Math.max(0, totalR));
        const clampedG = Math.min(1, Math.max(0, totalG));
        const clampedB = Math.min(1, Math.max(0, totalB));

        // 组合成32位颜色值（保留原始Alpha）
        return new Color(clampedR, clampedG, clampedB, surfaceColor.a);
    }
}