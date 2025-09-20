import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Matrix4x4 } from "../Math/Matrix4x4";

// 支持的属性类型
export type AttributeType = number | Color | Vector2 | Vector3 | Vector4 | Matrix4x4;

// 顶点属性集合，键为属性名称，值为任意支持的类型
export interface VertexAttributes {
    [key: string]: AttributeType;
}

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