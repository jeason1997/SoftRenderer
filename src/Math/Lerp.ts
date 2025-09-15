import { Color } from "./Color";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";
import { Matrix4x4 } from "./Matrix4x4";

// 支持的属性类型
type AttributeType = number | Color | Vector2 | Vector3 | Vector4 | Matrix4x4;

// 顶点属性集合，键为属性名称，值为任意支持的类型
interface VertexAttributes {
    [key: string]: AttributeType;
}

// 片段数据接口，包含像素位置和插值后的属性
interface Fragment {
    x: number;
    y: number;
    attributes: VertexAttributes;
}

/**
 * 计算点 p 在三角形 (v0, v1, v2) 中的重心坐标。
 * @param p 目标点（2D 坐标）
 * @param v0 三角形顶点0（2D 坐标）
 * @param v1 三角形顶点1（2D 坐标）
 * @param v2 三角形顶点2（2D 坐标）
 * @returns 重心坐标 [alpha, beta, gamma]
 */
function computeBarycentricCoords(
    p: [number, number],
    v0: Vector2,
    v1: Vector2,
    v2: Vector2
): [number, number, number] {
    const [x, y] = p;

    // 计算整个三角形的面积（的两倍，有符号）
    const areaABC = (v1.x - v0.x) * (v2.y - v0.y) - (v2.x - v0.x) * (v1.y - v0.y);

    // 计算子三角形 PBC 的面积（的两倍，有符号）
    const areaPBC = (v1.x - x) * (v2.y - y) - (v2.x - x) * (v1.y - y);
    const alpha = areaPBC / areaABC;

    // 计算子三角形 PCA 的面积（的两倍，有签名）
    const areaPCA = (v2.x - x) * (v0.y - y) - (v0.x - x) * (v2.y - y);
    const beta = areaPCA / areaABC;

    // 计算子三角形 PAB 的面积（的两倍，有签名）
    const areaPAB = (v0.x - x) * (v1.y - y) - (v1.x - x) * (v0.y - y);
    const gamma = areaPAB / areaABC;
    // 或者 gamma = 1 - alpha - beta;

    return [alpha, beta, gamma];
}

/**
 * 对三角形进行栅格化并插值顶点属性
 * @param v0 第一个顶点的屏幕坐标
 * @param v1 第二个顶点的屏幕坐标
 * @param v2 第三个顶点的屏幕坐标
 * @param attrs0 第一个顶点的所有属性
 * @param attrs1 第二个顶点的所有属性
 * @param attrs2 第三个顶点的所有属性
 * @returns 所有像素及其插值后的属性
 */
export function interpolateOverTriangle(
    v0: Vector2,
    v1: Vector2,
    v2: Vector2,
    attrs0: VertexAttributes,
    attrs1: VertexAttributes,
    attrs2: VertexAttributes
): Fragment[] {
    const fragments: Fragment[] = [];

    // 1. 计算三角形的包围盒
    const minX = Math.floor(Math.min(v0.x, v1.x, v2.x));
    const maxX = Math.ceil(Math.max(v0.x, v1.x, v2.x));
    const minY = Math.floor(Math.min(v0.y, v1.y, v2.y));
    const maxY = Math.ceil(Math.max(v0.y, v1.y, v2.y));

    // 2. 遍历边界框内的每一个像素点
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const pixel: [number, number] = [x, y];

            // 3. 计算当前像素点的重心坐标
            const [alpha, beta, gamma] = computeBarycentricCoords(pixel, v0, v1, v2);

            // 4. 判断点是否在三角形内部（重心坐标均非负，且近似和为1）
            const tolerance = 1e-5; // 浮点数精度容差
            if (
                alpha >= -tolerance &&
                beta >= -tolerance &&
                gamma >= -tolerance &&
                Math.abs(alpha + beta + gamma - 1) < tolerance
            ) {
                // 5. 使用重心坐标作为权重对属性进行插值
                // 例如，如果 T 是 number: interpolatedValue = alpha * v0.attr + beta * v1.attr + gamma * v2.attr;
                // 如果 T 是数组，需要每个分量分别计算。
                const interpolatedAttrs = interpolateAttributes(
                    attrs0, attrs1, attrs2, alpha, beta, gamma
                );

                // 添加到片段列表
                fragments.push({
                    x, y,
                    attributes: interpolatedAttrs
                });
            }
        }
    }

    return fragments;
}

/**
 * 基于 barycentric 坐标插值顶点属性，支持多种类型
 */
function interpolateAttributes(
    a: VertexAttributes,
    b: VertexAttributes,
    c: VertexAttributes,
    w: number,  // 顶点a的权重
    u: number, // 顶点b的权重
    v: number // 顶点c的权重
): VertexAttributes {
    const result: VertexAttributes = {};

    // 获取所有属性名称并验证
    const attributeNames = Object.keys(a);
    validateAttributes(attributeNames, b, c);

    // 对每个属性进行插值
    for (const name of attributeNames) {
        const valA = a[name];
        const valB = b[name];
        const valC = c[name];

        // 根据属性类型执行相应的插值
        if (typeof valA === 'number') {
            // 标量插值
            result[name] = interpolateNumber(
                valA as number,
                valB as number,
                valC as number,
                w, u, v
            );
        }
        else if (valA instanceof Color) {
            // Color插值
            result[name] = interpolateColor(
                valA,
                valB as Color,
                valC as Color,
                w, u, v
            );
        }
        else if (valA instanceof Vector2) {
            // Vector2插值
            result[name] = interpolateVector2(
                valA,
                valB as Vector2,
                valC as Vector2,
                w, u, v
            );
        }
        else if (valA instanceof Vector3) {
            // Vector3插值
            result[name] = interpolateVector3(
                valA,
                valB as Vector3,
                valC as Vector3,
                w, u, v
            );
        }
        else if (valA instanceof Vector4) {
            // Vector4插值
            result[name] = interpolateVector4(
                valA,
                valB as Vector4,
                valC as Vector4,
                w, u, v
            );
        }
        else if (valA instanceof Matrix4x4) {
            // 矩阵插值 - 对矩阵的每个元素分别插值
            result[name] = interpolateMatrix4x4(
                valA,
                valB as Matrix4x4,
                valC as Matrix4x4,
                w, u, v
            );
        }
        else {
            throw new Error(`不支持的属性类型: ${typeof valA} 用于属性 ${name}`);
        }
    }

    return result;
}

/**
 * 验证所有顶点是否具有相同的属性
 */
function validateAttributes(attributeNames: string[], ...otherAttrs: VertexAttributes[]) {
    for (const attrs of otherAttrs) {
        for (const name of attributeNames) {
            if (!(name in attrs)) {
                throw new Error(`顶点属性不匹配: 缺少属性 ${name}`);
            }
        }

        for (const name of Object.keys(attrs)) {
            if (!attributeNames.includes(name)) {
                throw new Error(`顶点属性不匹配: 存在额外属性 ${name}`);
            }
        }
    }
}

/**
 * 插值标量
 */
function interpolateNumber(a: number, b: number, c: number, w: number, u: number, v: number): number {
    return a * w + b * u + c * v;
}

/**
 * 插值Color
 */
function interpolateColor(a: Color, b: Color, c: Color, w: number, u: number, v: number): Color {
    return new Color(
        a.r * w + b.r * u + c.r * v,
        a.g * w + b.g * u + c.g * v,
        a.b * w + b.b * u + c.b * v,
        a.a * w + b.a * u + c.a * v
    );
}

/**
 * 插值Vector2
 */
function interpolateVector2(a: Vector2, b: Vector2, c: Vector2, w: number, u: number, v: number): Vector2 {
    return new Vector2(
        a.x * w + b.x * u + c.x * v,
        a.y * w + b.y * u + c.y * v
    );
}

/**
 * 插值Vector3
 */
function interpolateVector3(a: Vector3, b: Vector3, c: Vector3, w: number, u: number, v: number): Vector3 {
    return new Vector3(
        a.x * w + b.x * u + c.x * v,
        a.y * w + b.y * u + c.y * v,
        a.z * w + b.z * u + c.z * v
    );
}

/**
 * 插值Vector4
 */
function interpolateVector4(a: Vector4, b: Vector4, c: Vector4, w: number, u: number, v: number): Vector4 {
    return new Vector4(
        a.x * w + b.x * u + c.x * v,
        a.y * w + b.y * u + c.y * v,
        a.z * w + b.z * u + c.z * v,
        a.w * w + b.w * u + c.w * v
    );
}

/**
 * 插值4x4矩阵 - 对矩阵的每个元素分别进行插值
 */
function interpolateMatrix4x4(a: Matrix4x4, b: Matrix4x4, c: Matrix4x4, w: number, u: number, v: number): Matrix4x4 {
    const result = new Matrix4x4();
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            result.matrix[row][col] = a.matrix[row][col] * w + b.matrix[row][col] * u + c.matrix[row][col] * v;
        }
    }
    return result;
}

export function test(DrawPixel: Function) {
    // 定义三个顶点的屏幕坐标
    const v0 = new Vector2(100, 100);
    const v1 = new Vector2(200, 150);
    const v2 = new Vector2(150, 200);

    // 每个顶点可以有多个不同类型的属性
    const attrs0 = {
        color: new Color(255, 0, 0),
        texCoord: new Vector2(0, 0),
        intensity: 1.0,
        transform: Matrix4x4.identity
    };

    const attrs1 = {
        color: new Color(0, 255, 0),
        texCoord: new Vector2(1, 0),
        intensity: 0.5,
        transform: new Matrix4x4().translate(new Vector3(1, 0, 0))
    };

    const attrs2 = {
        color: new Color(0, 0, 255),
        texCoord: new Vector2(0, 1),
        intensity: 0.0,
        transform: new Matrix4x4().translate(new Vector3(0, 1, 0))
    };

    // 栅格化三角形
    const fragments = interpolateOverTriangle(v0, v1, v2, attrs0, attrs1, attrs2);

    // 输出部分结果
    console.log(`共计算了 ${fragments.length} 个像素点的插值颜色。`);
    for (let i = 0; i < fragments.length; i++) {
        const pixel = [fragments[i].x, fragments[i].y];
        const color = fragments[i].attributes.color as Color;
        color.r *= fragments[i].attributes.intensity as number;
        color.g *= fragments[i].attributes.intensity as number;
        color.b *= fragments[i].attributes.intensity as number;
        DrawPixel(pixel[0], pixel[1], color.ToUint32());
    }
}