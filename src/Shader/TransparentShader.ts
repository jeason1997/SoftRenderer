import { BlendFactor, CullMode, RenderType, ShaderPass } from "../Renderer/RendererDefine";
import { Shader } from "./Shader";

export class TransparentShader extends Shader {

    public renderType: RenderType = RenderType.Transparent;
    
    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
            renderState: {
                cullMode: CullMode.Back,
                zWrite: false,
                blend: {
                    src: BlendFactor.SrcAlpha,
                    dst: BlendFactor.OneMinusSrcAlpha,
                },
            },
        }
    ];
}