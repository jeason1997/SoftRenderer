import { Color } from "../Math/Color";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { BlendMode, CullMode, VertexAttributes, ZTest } from "../Renderer/RendererDefine";
import { Shader, ShaderPass } from "./Shader";
import { CubeMap } from "../Resources/CubeMap";

export class SkyboxShader extends Shader {
    // 天空盒使用的立方体贴图
    public cubeMap: CubeMap | null = null;

    // 天空盒颜色强度
    public intensity: number = 1.0;

    // 天空盒的渲染通道配置
    public passes: ShaderPass[] = [
        {
            name: "Skybox",
            vert: this.vertexShader.bind(this),
            frag: this.fragmentShader.bind(this),
            blendMode: BlendMode.Opaque,
            cullMode: CullMode.Front,  // 反转剔除，因为天空盒通常是内部可见
            zTest: ZTest.LessEqual,
            zWrite: false,  // 天空盒不写入深度缓冲
        }
    ];

    /**
     * 顶点着色器 - 修正版
     * 移除平移分量，使天空盒不受相机位置影响
     */
    public vertexShader(inAttr: VertexAttributes): { vertexOut: Vector4; attrOut: VertexAttributes } {
        // 获取原始顶点位置
        const vertex = inAttr.vertex as Vector3;
        const vertexOut = new Vector4(vertex.x * 1.9, vertex.y * 1.9, vertex.z, 1.0);
        const dir = new Vector4(vertex.x, vertex.y, vertex.z, 0);
        const outAttr: VertexAttributes = {
            vertex: dir
        };

        return {
            vertexOut: vertexOut,
            attrOut: outAttr
        };
    }

    /**
     * 片段着色器
     */
    public fragmentShader(v2fAttr: VertexAttributes): Color {
        if (!this.cubeMap) {
            return new Color(0.1, 0.2, 0.4, 1.0);
        }

        const direction = this.mvpMatrix.multiplyVector4(v2fAttr.vertex as Vector4);
        const skyColor = this.cubeMap.SampleCube(new Vector3(direction.x, direction.y, direction.z));

        return new Color(
            skyColor.r * this.intensity,
            skyColor.g * this.intensity,
            skyColor.b * this.intensity,
            1.0
        );
    }
}
    