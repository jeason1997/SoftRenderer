import { Color } from "../Math/Color";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { CubeMap } from "../Resources/CubeMap";
import { Texture } from "../Resources/Texture";

// 支持的属性类型
export type AttributeType = number | Color | Vector2 | Vector3 | Vector4 | Matrix4x4 | Texture | CubeMap | string;

// 顶点属性集合，键为属性名称，值为任意支持的类型
export interface VertexAttributes {
    [key: string]: AttributeType;
}

export interface ShaderRenderState {
    colorMask?: ColorMask;           // 颜色写入通道掩码，默认值为 All
    cullMode?: CullMode;             // 剔除模式，默认值 Back
    zTest?: ZTest;                   // 早期深度测试函数，默认值 LEqual
    zWrite?: boolean;                // 深度写入，默认值为 true
    blend?: Blend;                   // 混合状态
    stencil?: Stencil;               // 模板测试状态
}

export interface Blend {
    state: boolean;         // 是否开启混合，默认值为 false
    op: BlendOp;            // 混合操作，默认值为 Add
    src: BlendFactor;
    dst: BlendFactor;
    // Unity支持RGB跟A分开计算混合，这里简单实现暂时屏蔽
    // srcRGB?: BlendFactor;
    // dstRGB?: BlendFactor;
    // srcAlpha?: BlendFactor;
    // dstAlpha?: BlendFactor;
}

export interface Stencil {
    /*
    Ref:GPU 使用在 compareOperation 中定义的操作将模板缓冲区的当前内容与此值进行比较。
    此值使用 readMask 或 writeMask 进行遮罩，具体取决于进行的是读取操作还是写入操作。
    如果 Pass、Fail 或 ZFail 的值为 Replace，则 GPU 也可以将此值写入模板缓冲区。
    */
    ref?: number;             // 参考值，0 到 255。默认值为 0
    readMask?: number;        // GPU 在执行模板测试时使用此值作为遮罩。0 到 255。默认值为 255
    writeMask?: number;       // GPU 在写入模板缓冲区时使用此值作为遮罩。0 到 255。默认值为 255
    comparisonOperation?: StencilCompareFunction;   // GPU 为所有像素的模板测试执行的操作。默认值为 Always
    passOperation?: StencilOp;      // 当像素通过模板测试和深度测试时，GPU 对模板缓冲区执行的操作。默认值为 Keep
    failOperation?: StencilOp;      // 当像素未通过模板测试时，GPU 对模板缓冲区执行的操作。默认值为 Keep
    zFailOperation?: StencilOp;     // 当像素通过模板测试但未通过深度测试时，GPU 对模板缓冲区执行的操作。默认值为 Keep
}

export enum BlendFactor {
    One,            // 此输入的值是 one。该值用于使用源或目标的颜色的值。
    Zero,           // 此输入的值是 zero。该值用于删除源或目标值。
    SrcColor,       // GPU 将此输入的值乘以源颜色值。
    SrcAlpha,       // GPU 将此输入的值乘以源 Alpha 值。
    DstColor,       // GPU 将此输入的值乘以帧缓冲区的源颜色值。
    DstAlpha,       // GPU 将此输入的值乘以帧缓冲区的源 Alpha 值。
    OneMinusSrcColor,       // GPU 将此输入的值乘以（1 - 源颜色）。
    OneMinusSrcAlpha,       // GPU 将此输入的值乘以（1 - 源 Alpha）。
    OneMinusDstColor,       // GPU 将此输入的值乘以（1 - 目标颜色）。
    OneMinusDstAlpha,       // GPU 将此输入的值乘以（1 - 目标 Alpha）。
}

export enum BlendOp {
    Add,    // 将源和目标相加。
    Sub,    // 从源减去目标。
    RevSub, // 从目标减去源。
    Min,    // 使用源和目标中的较小者。
    Max,    // 使用源和目标中的较大者。
}

export enum RenderType {
    Opaque,
    Transparent
}

export enum ColorMask {
    None = 0,
    Red = 1,
    Green = 2,
    Blue = 4,
    Alpha = 8,
    All = Red | Green | Blue | Alpha
}

export enum CullMode {
    None,
    Front,
    Back
}

export enum StencilCompareFunction {
    Never = 1,	    // 从不渲染像素。
    Less = 2,	    // 在参考值小于模板缓冲区中的当前值时渲染像素。
    Equal = 3,	    // 在参考值等于模板缓冲区中的当前值时渲染像素。
    LEqual = 4,	    // 在参考值小于或等于模板缓冲区中的当前值时渲染像素。
    Greater = 5,	// 在参考值大于模板缓冲区中的当前值时渲染像素。
    NotEqual = 6,	// 在参考值与模板缓冲区中的当前值不同时渲染像素。
    GEqual = 7,	    // 在参考值大于或等于模板缓冲区中的当前值时渲染像素。
    Always = 8,	    // 始终渲染像素。
}

export enum StencilOp {
    Keep = 0,	    // 保持模板缓冲区的当前内容。
    Zero = 1,	    // 将 0 写入模板缓冲区。
    Replace = 2,	// 将参考值写入缓冲区。
    IncrSat = 3,	// 递增缓冲区中的当前值。如果该值已经是 255，则保持为 255。
    DecrSat = 4,	// 递减缓冲区中的当前值。如果该值已经是 0，则保持为 0。
    Invert = 5,	    // 将缓冲区中当前值的所有位求反。
    IncrWrap = 7,	// 递增缓冲区中的当前值。如果该值已经是 255，则变为 0。
    DecrWrap = 8,	// 递减缓冲区中的当前值。如果该值已经是 0，则变为 255。
}

export enum ZTest {
    Less,	    // 绘制位于现有几何体前面的几何体。不绘制位于现有几何体相同距离或后面的几何体。
    LEqual,	    // 绘制位于现有几何体前面或相同距离的几何体。不绘制位于现有几何体后面的几何体。
    Equal,	    // 绘制位于现有几何体相同距离的几何体。不绘制位于现有几何体前面的或后面的几何体。
    GEqual,	    // 绘制位于现有几何体后面或相同距离的几何体。不绘制位于现有几何体前面的几何体。
    Greater,	// 绘制位于现有几何体后面的几何体。不绘制位于现有几何体相同距离或前面的几何体。
    NotEqual,	// 绘制不位于现有几何体相同距离的几何体。不绘制位于现有几何体相同距离的几何体。
    Always,	    // 不进行深度测试。绘制所有几何体，无论距离如何。
}

// 模板测试常用配置预设
export const StencilPresets = {
    // 只渲染前面的物体，遮挡后面的物体
    frontOnly(ref: number): Partial<Stencil> {
        return {
            comparisonOperation: StencilCompareFunction.Equal,
            ref: ref,
            passOperation: StencilOp.Keep,
            failOperation: StencilOp.Zero,
            zFailOperation: StencilOp.Keep
        }
    },

    // 只渲染被标记物体的轮廓
    outline(ref: number): Partial<Stencil> {
        return {
            comparisonOperation: StencilCompareFunction.NotEqual,
            ref: ref,
            passOperation: StencilOp.Keep,
            failOperation: StencilOp.Keep,
            zFailOperation: StencilOp.Keep
        }
    },

    // 累积渲染（如渲染透明物体）
    accumulate(ref: number): Partial<Stencil> {
        return {
            comparisonOperation: StencilCompareFunction.Always,
            ref: ref,
            passOperation: StencilOp.IncrSat,
            failOperation: StencilOp.Keep,
            zFailOperation: StencilOp.Keep
        }
    },
};

/**
 * 执行深度测试
 * @param z 当前片元的深度值
 * @param currentDepth 深度缓冲区中对应位置的深度值
 * @param zTestFunc 深度测试函数（ZTest 枚举值）
 * @returns 是否通过深度测试
 */
export function depthTest(z: number, currentDepth: number, zTestFunc: ZTest = ZTest.LEqual): boolean {
    switch (zTestFunc) {
        case ZTest.Less:
            return z < currentDepth; // 小于当前深度则通过
        case ZTest.Equal:
            return Math.abs(z - currentDepth) < 1e-6; // 等于当前深度则通过（需考虑浮点精度）
        case ZTest.LEqual:
            return z <= currentDepth; // 小于或等于当前深度则通过
        case ZTest.Greater:
            return z > currentDepth; // 大于当前深度则通过
        case ZTest.NotEqual:
            return Math.abs(z - currentDepth) >= 1e-6; // 不等于当前深度则通过
        case ZTest.GEqual:
            return z >= currentDepth; // 大于或等于当前深度则通过
        case ZTest.Always:
            return true; // 总是通过
        default:
            console.warn("Unknown ZTest function, using Less as default.");
            return z < currentDepth;
    }
}

/**
 * 执行带掩码的模板比较操作
 * @param currentValue 当前模板值
 * @param refValue 参考值
 * @param func 比较函数
 * @param readMask 读取掩码，用于过滤需要比较的位
 * @returns 比较结果（是否通过）
 */
export function stencilTest(
    currentValue: number,
    refValue: number = 0,
    func: StencilCompareFunction = StencilCompareFunction.Always,
    readMask: number = 0xFF
): boolean {
    // 应用读取掩码，只保留需要比较的位
    const maskedCurrent = currentValue & readMask;
    const maskedRef = refValue & readMask;

    switch (func) {
        case StencilCompareFunction.Never:
            return false;
        case StencilCompareFunction.Less:
            return maskedCurrent < maskedRef;
        case StencilCompareFunction.Equal:
            return maskedCurrent === maskedRef;
        case StencilCompareFunction.LEqual:
            return maskedCurrent <= maskedRef;
        case StencilCompareFunction.Greater:
            return maskedCurrent > maskedRef;
        case StencilCompareFunction.NotEqual:
            return maskedCurrent !== maskedRef;
        case StencilCompareFunction.GEqual:
            return maskedCurrent >= maskedRef;
        case StencilCompareFunction.Always:
            return true;
        default:
            return false;
    }
}

/**
 * 应用模板操作
 * @param currentValue 当前模板值
 * @param refValue 参考值
 * @param op 要执行的操作
 * @param writeMask 写入掩码
 * @returns 新的模板值
 */
export function applyStencilOperation(
    currentValue: number,
    refValue: number = 0,
    op: StencilOp = StencilOp.Keep,
    writeMask: number = 0xFF
): number {
    let newValue = currentValue;

    switch (op) {
        case StencilOp.Keep:
            // 保持当前值
            newValue = currentValue;
            break;
        case StencilOp.Zero:
            // 设置为0
            newValue = 0;
            break;
        case StencilOp.Replace:
            // 替换为参考值
            newValue = refValue;
            break;
        case StencilOp.IncrSat:
            // 递增并饱和（不超过255）
            newValue = Math.min(currentValue + 1, 255);
            break;
        case StencilOp.DecrSat:
            // 递减并饱和（不低于0）
            newValue = Math.max(currentValue - 1, 0);
            break;
        case StencilOp.Invert:
            // 反转当前值（仅低8位）
            newValue = (~currentValue) & 0xFF;
            break;
        case StencilOp.IncrWrap:
            // 递增并循环（超过255则回到0）
            newValue = (currentValue + 1) % 256;
            break;
        case StencilOp.DecrWrap:
            // 递减并循环（低于0则回到255）
            newValue = (currentValue - 1 + 256) % 256;
            break;
    }

    // 应用写入掩码：只修改掩码允许的位
    return (newValue & writeMask) | (currentValue & ~writeMask);
}

export function applyColorMask(color: Color, bufferColor: Color, mask: ColorMask) {
    color.r = (mask & ColorMask.Red) ? color.r : bufferColor.r;
    color.g = (mask & ColorMask.Green) ? color.g : bufferColor.g;
    color.b = (mask & ColorMask.Blue) ? color.b : bufferColor.b;
    color.a = (mask & ColorMask.Alpha) ? color.a : bufferColor.a;
}