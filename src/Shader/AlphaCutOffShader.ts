import { Shader } from "./Shader";
import { ShaderPass, VertexAttributes } from "../Renderer/RendererDefine";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";

export class AlphaCutOffShader extends Shader {

    public cutOffThreshold: number = 0.3;

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
        }
    ];

    public fragmentShader(v2fAttr: VertexAttributes): Color | null {
        if (!this.mainTexture) return Color.MAGENTA;

        const uv = v2fAttr.uv as Vector2;
        const surfaceColor = this.mainTexture.Sample(uv.u, uv.v);
        if (surfaceColor.a < this.cutOffThreshold) return null;
        return surfaceColor;
    }
}