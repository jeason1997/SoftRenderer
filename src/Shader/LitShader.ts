import { Color } from "../Math/Color";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { VertexAttributes } from "../Renderer/TriangleRasterizer";
import { Shader } from "./Shader";

export class LitShader extends Shader {

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

    public fragmentShader(v2fAttr: VertexAttributes): number {
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
        const specularR = Math.round(this.lightColor.r * specularIntensity * specularFactor);
        const specularG = Math.round(this.lightColor.g * specularIntensity * specularFactor);
        const specularB = Math.round(this.lightColor.b * specularIntensity * specularFactor);

        // 提取表面颜色的RGBA通道
        const rgba = Color.FromUint32(surfaceColor);

        // 计算漫反射颜色
        const diffR = Math.round(rgba.r * (this.lightColor.r / 255) * this.lightIntensity * dotProduct);
        const diffG = Math.round(rgba.g * (this.lightColor.g / 255) * this.lightIntensity * dotProduct);
        const diffB = Math.round(rgba.b * (this.lightColor.b / 255) * this.lightIntensity * dotProduct);

        // 合并所有光照贡献（环境光 + 漫反射 + 高光）
        const totalR = this.ambientLight.r + diffR + specularR;
        const totalG = this.ambientLight.g + diffG + specularG;
        const totalB = this.ambientLight.b + diffB + specularB;

        // 确保颜色值在0-255范围内
        const clampedR = Math.min(255, Math.max(0, totalR));
        const clampedG = Math.min(255, Math.max(0, totalG));
        const clampedB = Math.min(255, Math.max(0, totalB));

        // 组合成32位颜色值（保留原始Alpha）
        return (rgba.a << 24) | (clampedB << 16) | (clampedG << 8) | clampedR;
    }
}