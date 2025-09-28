import { Shader } from "./Shader";
import { Vector4 } from "../Math/Vector4";
import { ShaderPass, VertexAttributes } from "../Renderer/RendererDefine";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";

export class ScreenDoorShader extends Shader {

    public screenDoorDensity: number = 64;

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
        }
    ];

    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        const clipPos = this.mvpMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1));
        const ndxX = clipPos.x / clipPos.w;     // NDC X: [-1, 1]
        const ndxY = clipPos.y / clipPos.w;     // NDC Y: [-1, 1]
        const screenX = (ndxX + 1.0) * 0.5;     // [0, 1)
        const screenY = (1.0 - ndxY) * 0.5;     // [0, 1)（Y轴翻转）

        return {
            vertexOut: clipPos,
            attrOut: {
                uv: inAttr.uv,
                screenPos: new Vector2(screenX, screenY)
            },
        };
    }

    public fragmentShader(v2fAttr: VertexAttributes): Color | null {
        const screenPos = v2fAttr.screenPos as Vector2;

        //TODO:实际上现在这样做效果其实不是很好，纱窗方格是固定尺寸的，应该根据物体的Z轴的距离调整尺寸，否则会看远处的物体很小，但方格依旧保持很大，看着不好看

        // 判断是否被棋盘纱窗过滤掉
        const gridX = screenPos.x * this.screenDoorDensity;
        const gridY = screenPos.y * this.screenDoorDensity;
        const shouldDiscard = ((gridX % 2) < 1.0) === ((gridY % 2) < 1.0);
        if (shouldDiscard) return null;

        if (!this.mainTexture) return Color.MAGENTA;
        const uv = v2fAttr.uv as Vector2;
        const sampledColor = this.mainTexture.Sample(
            uv.u * this.mainTextureST.x + this.mainTextureST.z,
            uv.v * this.mainTextureST.y + this.mainTextureST.w
        );
        return Color.multiply(sampledColor, this.baseColor);
    }
}