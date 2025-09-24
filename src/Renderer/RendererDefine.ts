import { Color } from "../Math/Color";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { CubeMap } from "../Resources/CubeMap";
import { Texture } from "../Resources/Texture";

export enum BlendMode {
    Opaque,
    AlphaBlend,
    Additive,
    Multiply
}

// 支持的属性类型
export type AttributeType = number | Color | Vector2 | Vector3 | Vector4 | Matrix4x4 | Texture | CubeMap | string;

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

/**
 * 执行深度测试
 * @param z 当前片元的深度值
 * @param currentDepth 深度缓冲区中对应位置的深度值
 * @param zTestFunc 深度测试函数（ZTest 枚举值）
 * @returns 是否通过深度测试
 */
export function depthTest(z: number, currentDepth: number, zTestFunc: ZTest): boolean {
    switch (zTestFunc) {
        case ZTest.Never:
            return false; // 从不通过
        case ZTest.Less:
            return z < currentDepth; // 小于当前深度则通过（默认）
        case ZTest.Equal:
            return Math.abs(z - currentDepth) < 1e-6; // 等于当前深度则通过（需考虑浮点精度）
        case ZTest.LessEqual:
            return z <= currentDepth; // 小于或等于当前深度则通过
        case ZTest.Greater:
            return z > currentDepth; // 大于当前深度则通过
        case ZTest.NotEqual:
            return Math.abs(z - currentDepth) >= 1e-6; // 不等于当前深度则通过
        case ZTest.GreaterEqual:
            return z >= currentDepth; // 大于或等于当前深度则通过
        case ZTest.Always:
            return true; // 总是通过
        default:
            console.warn("Unknown ZTest function, using Less as default.");
            return z < currentDepth;
    }
}