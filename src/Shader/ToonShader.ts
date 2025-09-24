import { Color } from "../Math/Color";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { CullMode, VertexAttributes } from "../Renderer/RendererDefine";
import { Texture } from "../Resources/Texture";
import { Shader, ShaderPass } from "./Shader";

export class ToonShader extends Shader {

    public mainTexture: Texture | null = null;
    public mainTextureST: Vector4 = new Vector4(0, 0, 1, 1);

    // 卡通着色特有的参数
    public shadowThreshold: number = 0.3;               // 阴影阈值
    public midtoneThreshold: number = 0.7;              // 中间调阈值
    public highlightIntensity: number = 1.2;            // 高光强度
    public outlineColor: Color = new Color(0, 0, 0, 1); // 轮廓颜色
    public outlineThickness: number = 0.05;             // 轮廓厚度

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
            renderState: {
                cullMode: CullMode.Back,
            }
        },
        {
            name: "Outline",
            vert: this.outlineVertexShader.bind(this),
            frag: this.outlineFragmentShader.bind(this),
            renderState: {
                cullMode: CullMode.Front,
            }
        }
    ];

    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        const normalOut = TransformTools.ModelToWorldNormal(inAttr.normal as Vector3, this.modelMatrix);
        const outAttr: VertexAttributes = {
            uv: inAttr.uv,
            normal: normalOut,
            // 传递原始顶点用于轮廓计算
            vertex: inAttr.vertex
        };
        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1)),
            attrOut: outAttr,
        };
    }

    public fragmentShader(v2fAttr: VertexAttributes): Color | null {
        if (!this.mainTexture) { return Color.MAGENTA; }

        const uv = v2fAttr.uv as Vector2;
        const normal = v2fAttr.normal as Vector3;

        // 采样纹理颜色
        const surfaceColor = this.mainTexture.Sample(uv.u, uv.v);

        // 确保法向量归一化
        const normalizedNormal = normal.normalize();

        // 计算法向量与光源方向的点积
        const dotProduct = Vector3.dot(normalizedNormal, this.lightDirection);

        // 卡通着色的核心：将光照分为几个离散的层次
        let lightIntensity = 0;
        if (dotProduct > this.midtoneThreshold) {
            // 高光区域
            lightIntensity = this.highlightIntensity;
        } else if (dotProduct > this.shadowThreshold) {
            // 中间调区域
            lightIntensity = 0.7;
        } else {
            // 阴影区域
            lightIntensity = 0.3;
        }

        // 计算漫反射颜色（卡通风格通常不使用复杂的光照公式）
        const diffR = surfaceColor.r * this.lightColor.r * this.lightIntensity * lightIntensity;
        const diffG = surfaceColor.g * this.lightColor.g * this.lightIntensity * lightIntensity;
        const diffB = surfaceColor.b * this.lightColor.b * this.lightIntensity * lightIntensity;

        // 添加环境光
        const totalR = this.ambientLight.r + diffR;
        const totalG = this.ambientLight.g + diffG;
        const totalB = this.ambientLight.b + diffB;

        // 确保颜色值在0-1范围内
        const clampedR = Math.min(1, Math.max(0, totalR));
        const clampedG = Math.min(1, Math.max(0, totalG));
        const clampedB = Math.min(1, Math.max(0, totalB));

        // 返回最终颜色，保留原始Alpha
        return new Color(clampedR, clampedG, clampedB, surfaceColor.a);
    }

    // 轮廓线顶点着色器
    public outlineVertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        // 沿法线方向外推顶点来创建轮廓
        const normal = inAttr.normal as Vector3;
        const offsetVertex = (inAttr.vertex as Vector3).clone()
            .add(normal.clone().multiplyScalar(this.outlineThickness));

        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(offsetVertex, 1)),
            attrOut: {}
        };
    }

    // 轮廓线片段着色器
    public outlineFragmentShader(): Color | null {
        return this.outlineColor;
    }
}