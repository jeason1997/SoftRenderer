import { Color } from "../Math/Color";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { CullMode, StencilCompareFunction, StencilOp, StencilPresets, VertexAttributes } from "../Renderer/RendererDefine";
import { Texture } from "../Resources/Texture";
import { Shader, ShaderPass } from "./Shader";

export class StencilOutlineShader extends Shader {

    public baseColor: Color = Color.WHITE;
    public mainTexture: Texture | null = null;
    public mainTextureST: Vector4 = new Vector4(1, 1, 0, 0);

    // 基础着色参数
    public shadowThreshold: number = 0.3;
    public midtoneThreshold: number = 0.7;
    public highlightIntensity: number = 1.2;

    // 描边参数
    public outlineColor: Color = Color.BLACK;          // 描边颜色
    public outlineThickness: number = 0.05;            // 描边厚度
    public outlineStencilRef: number = 1;              // 模板测试参考值

    public passes: ShaderPass[] = [
        // 第一遍：正常渲染物体并标记模板缓冲区
        {
            name: "RenderObjectAndMarkStencil",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
            renderState: {
                cullMode: CullMode.Back,
                // 模板测试配置：标记物体区域
                stencil: {
                    ref: this.outlineStencilRef,
                    comparisonOperation: StencilCompareFunction.Always,
                    passOperation: StencilOp.Replace,    // 通过时替换为参考值
                    failOperation: StencilOp.Keep,      // 失败时保持原值
                    zFailOperation: StencilOp.Keep      // 深度失败时保持原值
                }
            }
        },
        // 第二遍：渲染外扩的模型作为描边，只在未被标记的区域绘制
        {
            name: "RenderOutline",
            vert: this.outlineVertexShader.bind(this),
            frag: this.outlineFragmentShader.bind(this),
            renderState: {
                cullMode: CullMode.Back,
                // 模板测试配置：只在非物体区域绘制描边
                stencil: StencilPresets.outline(this.outlineStencilRef),
            }
        }
    ];

    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        const normalOut = TransformTools.ModelToWorldNormal(inAttr.normal as Vector3, this.modelMatrix);
        const outAttr: VertexAttributes = {
            uv: inAttr.uv,
            normal: normalOut,
        };
        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1)),
            attrOut: outAttr,
        };
    }

    public fragmentShader(v2fAttr: VertexAttributes): Color | null {
        const uv = v2fAttr.uv as Vector2;
        const normal = v2fAttr.normal as Vector3;

        // 采样基础颜色
        const surfaceColor = this.mainTexture?.Sample(
            uv.u * this.mainTextureST.x + this.mainTextureST.z,
            uv.v * this.mainTextureST.y + this.mainTextureST.w
        ) || Color.WHITE;
        surfaceColor.multiply(this.baseColor);

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

        // 合并所有光照贡献（漫反射 + 高光）
        const totalR = diffR + specularR;
        const totalG = diffG + specularG;
        const totalB = diffB + specularB;

        // 确保颜色值在0-1范围内
        const clampedR = Math.min(1, Math.max(0, totalR));
        const clampedG = Math.min(1, Math.max(0, totalG));
        const clampedB = Math.min(1, Math.max(0, totalB));

        // 组合成32位颜色值（保留原始Alpha）
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
