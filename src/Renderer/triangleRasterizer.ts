import { Vector3 } from "../Math/Vector3";
import { VertexAttributes } from "./RendererDefine";

// 片段数据接口，包含像素位置和插值后的属性
export interface Fragment {
    x: number;
    y: number;
    z: number;
    attributes: VertexAttributes;
}

export abstract class TriangleRasterizer {
    public static rasterizeTriangle(v0: Vector3, v1: Vector3, v2: Vector3, attrs0: VertexAttributes, attrs1: VertexAttributes, attrs2: VertexAttributes): Fragment[] {
        return [];
    }
}