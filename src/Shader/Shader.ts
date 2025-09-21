import { Vector4 } from "../Math/Vector4";
import { VertexAttributes } from "../Renderer/TriangleRasterizer";

export abstract class Shader {
    public attr: VertexAttributes;
    public abstract vertexShader(): Vector4;
    public abstract fragmentShader(): number;
}