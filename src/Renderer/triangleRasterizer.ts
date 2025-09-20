import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Matrix4x4 } from "../Math/Matrix4x4";

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
    z: number;
    attributes: VertexAttributes;
}

// 边的信息结构，用于计算扫描线与边的交点
interface Edge {
    yMin: number;    // 边的最小y坐标
    yMax: number;    // 边的最大y坐标
    xStart: number;  // 边在yMin处的x坐标
    dx: number;      // 每增加1单位y对应的x变化量 (Δx/Δy)
    attrs: {         // 边的属性插值参数
        [key: string]: { start: AttributeType, step: AttributeType }
    };
}

/**
 * 使用边缘行走算法对三角形进行栅格化并插值顶点属性
 * @param v0 第一个顶点的屏幕坐标
 * @param v1 第二个顶点的屏幕坐标
 * @param v2 第三个顶点的屏幕坐标
 * @param attrs0 第一个顶点的所有属性
 * @param attrs1 第二个顶点的所有属性
 * @param attrs2 第三个顶点的所有属性
 * @returns 所有像素及其插值后的属性
 */
export function interpolateOverTriangle(
    v0: Vector3,
    v1: Vector3,
    v2: Vector3,
    attrs0: VertexAttributes,
    attrs1: VertexAttributes,
    attrs2: VertexAttributes
): Fragment[] {
    const fragments: Fragment[] = [];

    // 1. 排序顶点按y坐标从小到大
    const vertices = [v0, v1, v2].sort((a, b) => a.y - b.y);
    const [vMin, vMid, vMax] = vertices;

    // 获取对应的属性
    const getAttrsForVertex = (v: Vector3) => {
        if (v === v0) return attrs0;
        if (v === v1) return attrs1;
        return attrs2;
    };
    const attrsMin = getAttrsForVertex(vMin);
    const attrsMid = getAttrsForVertex(vMid);
    const attrsMax = getAttrsForVertex(vMax);

    // 2. 计算三条边
    const edges = [
        createEdge(vMin, vMax, attrsMin, attrsMax),
        createEdge(vMin, vMid, attrsMin, attrsMid),
        createEdge(vMid, vMax, attrsMid, attrsMax)
    ];

    // 3. 区分主边和两条子边
    const mainEdge = edges[0]; // 从最低到最高顶点的边
    const leftEdge = edges[1].xStart < edges[2].xStart ? edges[1] : edges[2];
    const rightEdge = edges[1].xStart >= edges[2].xStart ? edges[1] : edges[2];

    // 4. 初始化当前扫描线的属性插值器
    let currentY = Math.floor(vMin.y);
    const maxY = Math.floor(vMax.y);

    // 左侧和右侧边的当前x值及属性
    let leftX = leftEdge.xStart;
    let rightX = rightEdge.xStart;
    let leftAttrs = { ...leftEdge.attrs };
    let rightAttrs = { ...rightEdge.attrs };

    // 5. 遍历每条扫描线
    while (currentY <= maxY) {
        // 确定当前扫描线是否在当前边的范围内
        const isInLeftEdge = currentY >= leftEdge.yMin && currentY <= leftEdge.yMax;
        const isInRightEdge = currentY >= rightEdge.yMin && currentY <= rightEdge.yMax;
        const isInMainEdge = currentY >= mainEdge.yMin && currentY <= mainEdge.yMax;

        // 只处理在三角形范围内的扫描线
        if (isInLeftEdge && isInRightEdge && isInMainEdge) {
            // 计算当前行的左右x边界（取整）
            const xMin = Math.floor(leftX);
            const xMax = Math.floor(rightX);

            // 计算属性沿x轴的步长
            const xStep = 1 / (xMax - xMin + 1);
            const xAttrsStep = calculateXAttrsStep(leftAttrs, rightAttrs, xMax - xMin + 1);

            // 6. 填充当前扫描线上的像素
            for (let x = xMin; x <= xMax; x++) {
                const t = x === xMin ? 0 : (x - xMin) * xStep;
                const interpolatedAttrs = interpolateBetweenEdges(
                    leftAttrs, rightAttrs, xAttrsStep, t
                );

                // 插值深度值
                const z = interpolateZ(
                    leftAttrs.z.start as number,
                    rightAttrs.z.start as number,
                    t
                );

                fragments.push({
                    x,
                    y: currentY,
                    z,
                    attributes: interpolatedAttrs
                });
            }
        }

        // 7. 更新下一行的x值和属性
        if (isInLeftEdge) {
            leftX += leftEdge.dx;
            updateEdgeAttributes(leftAttrs);
        }
        if (isInRightEdge) {
            rightX += rightEdge.dx;
            updateEdgeAttributes(rightAttrs);
        }

        currentY++;
    }

    return fragments;
}

/**
 * 创建边的信息，包括y范围、x变化率和属性插值参数
 */
function createEdge(
    v1: Vector3,
    v2: Vector3,
    attrs1: VertexAttributes,
    attrs2: VertexAttributes
): Edge {
    // 确保v1是y较小的顶点
    const [start, end] = v1.y < v2.y ? [v1, v2] : [v2, v1];
    const [startAttrs, endAttrs] = v1.y < v2.y ? [attrs1, attrs2] : [attrs2, attrs1];

    const yMin = Math.floor(start.y);
    const yMax = Math.floor(end.y);
    const dy = end.y - start.y;

    // 计算x的变化率 (Δx/Δy)，避免除以0
    const dx = dy === 0 ? 0 : (end.x - start.x) / dy;

    // 计算x在yMin处的起始值
    const xStart = start.x + (yMin - start.y) * dx;

    // 计算属性的起始值和每步变化量
    const attrs: Edge['attrs'] = {};
    const attributeNames = Object.keys(startAttrs);

    // 添加z属性（深度）
    attrs.z = {
        start: start.z,
        step: dy === 0 ? 0 : (end.z - start.z) / dy
    };

    // 处理其他属性
    for (const name of attributeNames) {
        const startVal = startAttrs[name];
        const endVal = endAttrs[name];

        attrs[name] = {
            start: startVal,
            step: calculateAttributeStep(startVal, endVal, dy)
        };
    }

    return { yMin, yMax, xStart, dx, attrs };
}

/**
 * 计算属性的每步变化量
 */
function calculateAttributeStep(
    start: AttributeType,
    end: AttributeType,
    dy: number
): AttributeType {
    if (dy === 0) {
        // 水平边，属性不变
        if (typeof start === 'number') return 0;
        if (start instanceof Color) return new Color(0, 0, 0, 0);
        if (start instanceof Vector2) return new Vector2(0, 0);
        if (start instanceof Vector3) return new Vector3(0, 0, 0);
        if (start instanceof Vector4) return new Vector4(0, 0, 0, 0);
        if (start instanceof Matrix4x4) return new Matrix4x4();
    }

    const t = 1 / dy;

    if (typeof start === 'number') {
        return (end as number - start) * t;
    }
    if (start instanceof Color) {
        return new Color(
            (end as Color).r - start.r * t,
            (end as Color).g - start.g * t,
            (end as Color).b - start.b * t,
            (end as Color).a - start.a * t
        );
    }
    if (start instanceof Vector2) {
        return new Vector2(
            ((end as Vector2).x - start.x) * t,
            ((end as Vector2).y - start.y) * t
        );
    }
    if (start instanceof Vector3) {
        return new Vector3(
            ((end as Vector3).x - start.x) * t,
            ((end as Vector3).y - start.y) * t,
            ((end as Vector3).z - start.z) * t
        );
    }
    if (start instanceof Vector4) {
        return new Vector4(
            ((end as Vector4).x - start.x) * t,
            ((end as Vector4).y - start.y) * t,
            ((end as Vector4).z - start.z) * t,
            ((end as Vector4).w - start.w) * t
        );
    }
    if (start instanceof Matrix4x4) {
        const result = new Matrix4x4();
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                result.matrix[row][col] =
                    ((end as Matrix4x4).matrix[row][col] - start.matrix[row][col]) * t;
            }
        }
        return result;
    }

    throw new Error(`不支持的属性类型: ${typeof start}`);
}

/**
 * 更新边上的属性值（沿y轴步进）
 */
function updateEdgeAttributes(attrs: Edge['attrs']) {
    for (const name in attrs) {
        const attr = attrs[name];
        attr.start = addAttribute(attr.start, attr.step);
    }
}

/**
 * 计算属性在x轴方向的步长
 */
function calculateXAttrsStep(
    left: Edge['attrs'],
    right: Edge['attrs'],
    pixelCount: number
): { [key: string]: AttributeType } {
    const step: { [key: string]: AttributeType } = {};
    const t = 1 / pixelCount;

    for (const name in left) {
        step[name] = multiplyAttribute(
            subtractAttribute(right[name].start, left[name].start),
            t
        );
    }

    return step;
}

/**
 * 在左右边之间插值属性（沿x轴）
 */
function interpolateBetweenEdges(
    left: Edge['attrs'],
    right: Edge['attrs'],
    step: { [key: string]: AttributeType },
    t: number
): VertexAttributes {
    const result: VertexAttributes = {};

    for (const name in left) {
        result[name] = addAttribute(
            left[name].start,
            multiplyAttribute(step[name], t)
        );
    }

    return result;
}

/**
 * 插值深度值
 */
function interpolateZ(zLeft: number, zRight: number, t: number): number {
    return zLeft + (zRight - zLeft) * t;
}

// 辅助函数：属性加法
function addAttribute(a: AttributeType, b: AttributeType): AttributeType {
    if (typeof a === 'number' && typeof b === 'number') return a + b;
    if (a instanceof Color && b instanceof Color) return Color.add(a, b);
    if (a instanceof Vector2 && b instanceof Vector2) return Vector2.add(a, b);
    if (a instanceof Vector3 && b instanceof Vector3) return Vector3.add(a, b);
    if (a instanceof Vector4 && b instanceof Vector4) return Vector4.add(a, b);
    if (a instanceof Matrix4x4 && b instanceof Matrix4x4) return Matrix4x4.add(a, b);
    throw new Error(`属性加法不支持的类型组合: ${typeof a} 和 ${typeof b}`);
}

// 辅助函数：属性减法
function subtractAttribute(a: AttributeType, b: AttributeType): AttributeType {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    if (a instanceof Color && b instanceof Color) return Color.subtract(a, b);
    if (a instanceof Vector2 && b instanceof Vector2) return Vector2.subtract(a, b);
    if (a instanceof Vector3 && b instanceof Vector3) return Vector3.subtract(a, b);
    if (a instanceof Vector4 && b instanceof Vector4) return Vector4.subtract(a, b);
    if (a instanceof Matrix4x4 && b instanceof Matrix4x4) return Matrix4x4.subtract(a, b);
    throw new Error(`属性减法不支持的类型组合: ${typeof a} 和 ${typeof b}`);
}

// 辅助函数：属性乘以标量
function multiplyAttribute(a: AttributeType, scalar: number): AttributeType {
    if (typeof a === 'number') return a * scalar;
    if (a instanceof Color) return Color.multiplyScalar(a, scalar);
    if (a instanceof Vector2) return Vector2.multiplyScalar(a, scalar);
    if (a instanceof Vector3) return Vector3.multiplyScalar(a, scalar);
    if (a instanceof Vector4) return Vector4.multiplyScalar(a, scalar);
    if (a instanceof Matrix4x4) return Matrix4x4.multiplyScalar(a, scalar);
    throw new Error(`属性乘法不支持的类型: ${typeof a}`);
}