import { Color } from "../Math/Color";
import { Vector4 } from "../Math/Vector4";
import { CullMode, StencilCompareFunction, StencilOp, StencilPresets } from "../Renderer/RendererDefine";
import { Texture } from "../Resources/Texture";
import { Shader, ShaderPass } from "./Shader";
import { ToonShader } from "./ToonShader";

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
            vert: ToonShader.prototype.vertexShader.bind(this),
            frag: ToonShader.prototype.fragmentShader.bind(this),
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
            vert: ToonShader.prototype.outlineVertexShader.bind(this),
            frag: ToonShader.prototype.outlineFragmentShader.bind(this),
            renderState: {
                cullMode: CullMode.Back,
                // 模板测试配置：只在非物体区域绘制描边
                stencil: StencilPresets.outline(this.outlineStencilRef),
            }
        }
    ];
}
