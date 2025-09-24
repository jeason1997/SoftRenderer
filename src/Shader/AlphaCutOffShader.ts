import { Shader } from "./Shader";
import { Texture } from "../Resources/Texture";
import { Vector4 } from "../Math/Vector4";
import { ShaderPass } from "./Shader";
import { VertexAttributes } from "../Renderer/RendererDefine";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";

export class AlphaCutOffShader extends Shader {
    public mainTexture: Texture | null = null;
    public mainTextureST: Vector4 = new Vector4(1, 1, 0, 0);
    public cutOffThreshold: number = 0.3;

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
        }
    ];

    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        return {
            vertexOut: this.mvpMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1)),
            attrOut: {
                uv: inAttr.uv,
            },
        };
    }

    public fragmentShader(v2fAttr: VertexAttributes): Color | null {
        if (!this.mainTexture) return Color.MAGENTA;

        const uv = v2fAttr.uv as Vector2;
        const surfaceColor = this.mainTexture.Sample(uv.u, uv.v);
        if (surfaceColor.a < this.cutOffThreshold) return null;
        return surfaceColor;
    }
}