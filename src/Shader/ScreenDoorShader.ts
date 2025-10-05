import { Shader } from "./Shader";
import { Vector4 } from "../Math/Vector4";
import { ShaderPass, VertexAttributes } from "../Renderer/RendererDefine";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";

export class ScreenDoorShader extends Shader {

    public screenDoorDensity: number = 64;
    public distanceScale: number = 10.0;    // 距离缩放因子，控制随距离变化的速率

    public passes: ShaderPass[] = [
        {
            name: "Forward",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
        }
    ];

    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        const modelPos = this.modelMatrix.multiplyVector4(new Vector4(inAttr.vertex as Vector3, 1));
        const viewPos = this.viewMatrix.multiplyVector4(modelPos);
        const clipPos = this.projectionMatrix.multiplyVector4(viewPos);

        const ndxX = clipPos.x / clipPos.w;     // NDC X: [-1, 1]
        const ndxY = clipPos.y / clipPos.w;     // NDC Y: [-1, 1]
        const screenX = (ndxX + 1.0) * 0.5;     // [0, 1)
        const screenY = (1.0 - ndxY) * 0.5;     // [0, 1)（Y轴翻转）
        
        // 计算顶点到摄像机的距离（在视图空间中的Z值）
        const distanceToCamera = Math.abs(viewPos.z); // 取绝对值作为距离

        // 根据物体到摄像机的距离调整网格密度
        // 距离越远，密度越大（格子越小）
        const adjustedDensity = this.screenDoorDensity * (1 + (distanceToCamera / this.distanceScale));

        return {
            vertexOut: clipPos,
            attrOut: {
                uv: inAttr.uv,
                screenPos: new Vector2(screenX, screenY),
                adjustedDensity: adjustedDensity
            },
        };
    }

    public fragmentShader(v2fAttr: VertexAttributes): Color | null {
        const screenPos = v2fAttr.screenPos as Vector2;
        const adjustedDensity = v2fAttr.adjustedDensity as number;
        
        // 判断是否被棋盘纱窗过滤掉
        const gridX = screenPos.x * adjustedDensity;
        const gridY = screenPos.y * adjustedDensity;
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