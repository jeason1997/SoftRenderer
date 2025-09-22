import { Color } from "../Math/Color";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";

export enum BlendMode {
    Opaque,
    AlphaBlend,
    Additive,
    Multiply
}

// 支持的属性类型
export type AttributeType = number | Color | Vector2 | Vector3 | Vector4 | Matrix4x4;

// 顶点属性集合，键为属性名称，值为任意支持的类型
export interface VertexAttributes {
    [key: string]: AttributeType;
}

export enum RenderType {
    Opaque,
    Transparent,
    Additive,
    Multiply
}

export enum CullMode {
    None,
    Front,
    Back
}

export enum ZTest {
    Never,
    Less,
    Equal,
    LessEqual,
    Greater,
    NotEqual,
    GreaterEqual,
    Always
}