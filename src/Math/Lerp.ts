import { Color } from "./Color";

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
    v0: [number, number],
    v1: [number, number],
    v2: [number, number]
): [number, number, number] {
    const [x, y] = p;
    const [x0, y0] = v0;
    const [x1, y1] = v1;
    const [x2, y2] = v2;

    // 计算整个三角形的面积（的两倍，有符号）
    const areaABC = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);

    // 计算子三角形 PBC 的面积（的两倍，有符号）
    const areaPBC = (x1 - x) * (y2 - y) - (x2 - x) * (y1 - y);
    const alpha = areaPBC / areaABC;

    // 计算子三角形 PCA 的面积（的两倍，有签名）
    const areaPCA = (x2 - x) * (y0 - y) - (x0 - x) * (y2 - y);
    const beta = areaPCA / areaABC;

    // 计算子三角形 PAB 的面积（的两倍，有签名）
    const areaPAB = (x0 - x) * (y1 - y) - (x1 - x) * (y0 - y);
    const gamma = areaPAB / areaABC;
    // 或者 gamma = 1 - alpha - beta;

    return [alpha, beta, gamma];
}

/**
 * 线性插值函数
 * @param a 起始值
 * @param b 结束值
 * @param t 插值权重 (0.0 返回 a, 1.0 返回 b)
 * @returns 插值结果
 */
function lerp<T>(a: T, b: T, t: number): T {
    if (typeof a === 'number' && typeof b === 'number') {
        return (a + (b - a) * t) as T;
    } else if (Array.isArray(a) && Array.isArray(b)) {
        // 假设是数字数组（如 vec2, vec3, vec4, color[R,G,B]）
        if (a.length !== b.length) {
            throw new Error('Arrays must have the same length for interpolation');
        }
        return a.map((val, idx) => lerp(val, b[idx], t)) as T;
    }
    // 可以扩展支持其他类型，如自定义的 Vector2/3/4 类
    // 例如，如果 T 有 lerp 方法： return a.lerp(b, t);
    else {
        throw new Error(`Unsupported type for interpolation: ${typeof a}`);
    }
}

/**
 * 对三角形内的像素点进行属性插值（屏幕坐标）
 * @param v0 顶点0信息 { pos: [x, y], attr: T }
 * @param v1 顶点1信息 { pos: [x, y], attr: T }
 * @param v2 顶点2信息 { pos: [x, y], attr: T }
 * @returns 一个数组，包含三角形内每个像素点的坐标 [x, y] 及其插值后的属性值
 */
function interpolateOverTriangle<T>(
    v0: { pos: [number, number]; attr: T },
    v1: { pos: [number, number]; attr: T },
    v2: { pos: [number, number]; attr: T }
): { pixel: [number, number]; value: T }[] {
    const results: { pixel: [number, number]; value: T }[] = [];

    // 1. 确定三角形的边界框（Bounding Box）以提高效率
    const allX = [v0.pos[0], v1.pos[0], v2.pos[0]];
    const allY = [v0.pos[1], v1.pos[1], v2.pos[1]];
    const minX = Math.floor(Math.min(...allX));
    const maxX = Math.ceil(Math.max(...allX));
    const minY = Math.floor(Math.min(...allY));
    const maxY = Math.ceil(Math.max(...allY));

    // 2. 遍历边界框内的每一个像素点
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const pixel: [number, number] = [x, y];

            // 3. 计算当前像素点的重心坐标
            const [alpha, beta, gamma] = computeBarycentricCoords(pixel, v0.pos, v1.pos, v2.pos);

            // 4. 判断点是否在三角形内部（重心坐标均非负，且近似和为1）
            const tolerance = 1e-5; // 浮点数精度容差
            if (
                alpha >= -tolerance &&
                beta >= -tolerance &&
                gamma >= -tolerance &&
                Math.abs(alpha + beta + gamma - 1) < tolerance
            ) {
                // 5. 使用重心坐标作为权重对属性进行插值
                // f(p) = α * f(v0) + β * f(v1) + γ * f(v2)
                const interpolatedValue = lerp(
                    lerp(v0.attr, v1.attr, beta / (alpha + beta + gamma)), // 可先两两插值，再与第三个插值
                    v2.attr,
                    gamma / (alpha + beta + gamma)
                );
                // 或者直接加权求和（要求属性类型支持数乘和加法）
                // 例如，如果 T 是 number: interpolatedValue = alpha * v0.attr + beta * v1.attr + gamma * v2.attr;
                // 如果 T 是数组，需要每个分量分别计算。

                results.push({ pixel, value: interpolatedValue });
            }
        }
    }

    return results;
}

export function test(DrawPixel: Function) {
    // 定义三个顶点（假设已在屏幕空间）
    const vertex0 = { pos: [100, 100] as [number, number], attr: [255, 0, 0] }; // 红色
    const vertex1 = { pos: [200, 150] as [number, number], attr: [0, 255, 0] }; // 绿色
    const vertex2 = { pos: [150, 200] as [number, number], attr: [0, 0, 255] }; // 蓝色

    // 执行插值
    const interpolatedPixels = interpolateOverTriangle(vertex0, vertex1, vertex2);

    // 输出部分结果
    console.log(`共计算了 ${interpolatedPixels.length} 个像素点的插值颜色。`);
    for(let i = 0; i < interpolatedPixels.length; i++){
        const pixel = interpolatedPixels[i].pixel;
        const value = interpolatedPixels[i].value;
        DrawPixel(pixel[0], pixel[1], new Color(value[0], value[1], value[2]).ToUint32());
    }
}