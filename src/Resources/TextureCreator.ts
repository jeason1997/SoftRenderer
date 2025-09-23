import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Texture } from "./Texture";

export class TextureCreator {

    /**
     * 生成棋盘纹理
     * @param tileSize 每个棋盘格的大小（像素）
     * @param color1 第一种颜色（默认白色）
     * @param color2 第二种颜色（默认黑色）
     */
    public static CheckerboardTexture(
        width: number = 64,
        height: number = 64,
        tileSize: number = 8,
        color1: Color = Color.WHITE,
        color2: Color = Color.GRAY
    ): Texture {
        const texture = new Texture(width, height);
        const data = new Uint8ClampedArray(width * height * 4);

        // 填充棋盘格
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // 计算当前位置属于哪个棋盘格
                const tileX = Math.floor(x / tileSize);
                const tileY = Math.floor(y / tileSize);

                // 交替选择颜色
                const color = (tileX + tileY) % 2 === 0 ? color1 : color2;

                // 设置像素颜色
                const index = (y * width + x) * 4;
                data[index] = color.r * 255;
                data[index + 1] = color.g * 255;
                data[index + 2] = color.b * 255;
                data[index + 3] = color.a * 255;
            }
        }

        texture.LoadImage(data);
        return texture;
    }

    /**
     * 生成噪声纹理
     * @param width 纹理宽度
     * @param height 纹理高度
     * @param type 噪声类型：'random'（随机噪声）、'perlin'（柏林噪声）、'fibrous'（纤维噪声）
     * @param scale 噪声缩放比例（值越小噪声越密集）
     * @param monochrome 是否生成单色噪声（否则为彩色）
     * @returns 生成的噪声纹理
     */
    public static NoiseTexture(
        width: number = 64,
        height: number = 64,
        type: 'random' | 'perlin' | 'fibrous' = 'perlin',
        scale: number = 4,
        monochrome: boolean = true
    ): Texture {
        // 参数验证和边界检查
        width = Math.max(1, Math.min(2048, width));
        height = Math.max(1, Math.min(2048, height));
        scale = Math.max(0.1, scale);

        const texture = new Texture(width, height);
        const data = new Uint8ClampedArray(width * height * 4);

        // 更高效的随机噪声生成函数（使用位运算优化）
        const generateRandomNoise = (x: number, y: number): number => {
            let hash = x << 12 ^ y;
            hash = (hash ^ (hash >> 16)) * 0x45d9f3b;
            hash = (hash ^ (hash >> 13)) * 0x45d9f3b;
            return (hash & 0x7fffffff) / 0x7fffffff; // 直接使用位运算代替Math.abs
        };

        // 优化的插值函数（使用缓动函数提高视觉质量）
        const fade = (t: number): number => {
            return t * t * t * (t * (t * 6 - 15) + 10); // 平滑的缓动函数
        };

        const interpolate = (a: number, b: number, t: number): number => {
            return a + fade(t) * (b - a);
        };

        // 预先计算随机偏移（避免每次生成噪声都创建新变量）
        const randomOffsetX = Math.random() * 10000;
        const randomOffsetY = Math.random() * 10000;

        // 缓存1/scale值，避免重复除法运算
        const invScale = 1 / scale;

        // 优化的柏林噪声生成（减少重复计算）
        const generatePerlinNoise = (x: number, y: number): number => {
            // 添加随机偏移，使每次生成的噪声不同
            x += randomOffsetX;
            y += randomOffsetY;

            // 使用缓存的invScale进行计算
            const xGrid = Math.floor(x * invScale);
            const yGrid = Math.floor(y * invScale);
            const xFrac = (x * invScale) - xGrid;
            const yFrac = (y * invScale) - yGrid;

            // 四个角的随机值
            const c00 = generateRandomNoise(xGrid, yGrid);
            const c10 = generateRandomNoise(xGrid + 1, yGrid);
            const c01 = generateRandomNoise(xGrid, yGrid + 1);
            const c11 = generateRandomNoise(xGrid + 1, yGrid + 1);

            // 双线性插值
            const x1 = interpolate(c00, c10, xFrac);
            const x2 = interpolate(c01, c11, xFrac);
            return interpolate(x1, x2, yFrac);
        };

        // 纤维噪声生成（使用一次柏林噪声计算结果）
        const generateFibrousNoise = (x: number, y: number): number => {
            // 减少三角函数计算，使用更简单的角度计算
            const angle = (Math.sin(x * invScale) * Math.cos(y * invScale)) * Math.PI;
            const dx = Math.cos(angle) * scale;
            const dy = Math.sin(angle) * scale;

            // 计算一次基础噪声值，避免重复调用
            const baseNoise = generatePerlinNoise(x, y);
            // 使用基础噪声值与偏移后的噪声值混合
            return generatePerlinNoise(x + dx, y + dy) * 0.7 + baseNoise * 0.3;
        };

        // 填充纹理数据的主要逻辑（优化内存访问模式）
        const generateNoiseForPixel = (x: number, y: number): number => {
            switch (type) {
                case 'random':
                    return generateRandomNoise(x, y);
                case 'fibrous':
                    return generateFibrousNoise(x, y);
                default: // perlin
                    return generatePerlinNoise(x, y);
            }
        };

        // 优化的彩色噪声生成函数（减少重复计算）
        const getRGBFromNoise = (value: number): [number, number, number] => {
            // HSV转RGB的高效实现
            const hue = (value * 360) % 360;
            const sat = 0.5 + value * 0.5;
            const val = 0.3 + value * 0.7;

            const c = val * sat;
            const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
            const m = val - c;

            let r = 0, g = 0, b = 0;

            if (hue < 60) {
                [r, g, b] = [c, x, 0];
            } else if (hue < 120) {
                [r, g, b] = [x, c, 0];
            } else if (hue < 180) {
                [r, g, b] = [0, c, x];
            } else if (hue < 240) {
                [r, g, b] = [0, x, c];
            } else if (hue < 300) {
                [r, g, b] = [x, 0, c];
            } else {
                [r, g, b] = [c, 0, x];
            }

            return [r + m, g + m, b + m];
        };

        // 主要循环：按行主序填充纹理数据，提高缓存命中率
        for (let y = 0; y < height; y++) {
            const rowOffset = y * width * 4; // 预计算行偏移量
            for (let x = 0; x < width; x++) {
                // 根据噪声类型生成值（0-1范围）
                let value = generateNoiseForPixel(x, y);

                // 确保值在0-1范围内（使用一次clamp操作）
                value = Math.max(0, Math.min(1, value));

                let r: number, g: number, b: number;

                if (monochrome) {
                    // 单色噪声（灰度）
                    r = g = b = value;
                } else {
                    // 彩色噪声（使用优化的HSV转RGB函数）
                    [r, g, b] = getRGBFromNoise(value);
                }

                // 写入纹理数据（RGBA）
                const index = rowOffset + x * 4;
                data[index] = r * 255;       // 红色通道
                data[index + 1] = g * 255;   // 绿色通道
                data[index + 2] = b * 255;   // 蓝色通道
                data[index + 3] = 255;       // alpha通道（完全不透明）
            }
        }

        texture.LoadImage(data);
        return texture;
    }

    /**
     * 生成渐变纹理
     * @param width 纹理宽度
     * @param height 纹理高度
     * @param type 渐变类型：'linear'（线性）、'radial'（径向）、'angular'（角度）
     * @param colorStops 颜色断点数组，格式如[{offset: 0, color: 0xffffff}, {offset: 1, color: 0x000000}]
     * @param start 渐变起点（线性渐变有效，相对坐标[0,1]）
     * @param end 渐变终点（线性渐变有效，相对坐标[0,1]）
     * @param center 渐变中心（径向/角度渐变有效，相对坐标[0,1]）
     * @param radius 渐变半径（径向渐变有效，相对值）
     * @returns 生成的渐变纹理
     */
    public static GradientTexture(
        width: number = 64,
        height: number = 64,
        type: 'linear' | 'radial' | 'angular' = 'linear',
        colorStops: Array<{ offset: number, color: Color }> = [
            { offset: 0, color: Color.WHITE },
            { offset: 1, color: Color.BLACK }
        ],
        start: Vector2 = new Vector2(0, 0.5),
        end: Vector2 = new Vector2(1, 0.5),
        center: Vector2 = new Vector2(0.5, 0.5),
        radius: number = 0.5
    ): Texture {
        const texture = new Texture(width, height);
        const data = new Uint8ClampedArray(width * height * 4);

        // 确保颜色断点按offset排序
        colorStops.sort((a, b) => a.offset - b.offset);

        // 提取颜色通道值
        const getColorChannels = (color: Color) => ({
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a || 1 // 默认为不透明
        });

        // 颜色插值函数
        const interpolateColor = (t: number) => {
            // 处理边界情况
            if (t <= colorStops[0].offset) {
                return getColorChannels(colorStops[0].color);
            }
            if (t >= colorStops[colorStops.length - 1].offset) {
                return getColorChannels(colorStops[colorStops.length - 1].color);
            }

            // 找到当前t所在的颜色区间
            let i = 0;
            while (colorStops[i + 1].offset < t) {
                i++;
            }

            const start = colorStops[i];
            const end = colorStops[i + 1];
            const range = end.offset - start.offset;
            const ratio = (t - start.offset) / range;

            const startColor = getColorChannels(start.color);
            const endColor = getColorChannels(end.color);

            // 线性插值每个颜色通道
            return {
                r: startColor.r + (endColor.r - startColor.r) * ratio,
                g: startColor.g + (endColor.g - startColor.g) * ratio,
                b: startColor.b + (endColor.b - startColor.b) * ratio,
                a: startColor.a + (endColor.a - startColor.a) * ratio
            };
        };

        // 填充纹理数据
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // 计算相对坐标[0,1]
                const u = x / (width - 1);
                const v = y / (height - 1);
                let t = 0;

                switch (type) {
                    case 'linear':
                        // 线性渐变：计算点到起点的投影长度与总长度的比例
                        const startToEnd = new Vector2(end.x - start.x, end.y - start.y);
                        const startToPoint = new Vector2(u - start.x, v - start.y);
                        const lengthSq = startToEnd.x * startToEnd.x + startToEnd.y * startToEnd.y;

                        if (lengthSq > 0) {
                            const dot = startToPoint.x * startToEnd.x + startToPoint.y * startToEnd.y;
                            t = Math.max(0, Math.min(1, dot / lengthSq));
                        }
                        break;

                    case 'radial':
                        // 径向渐变：计算点到中心的距离与半径的比例
                        const dx = u - center.x;
                        const dy = v - center.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        t = Math.max(0, Math.min(1, distance / radius));
                        break;

                    case 'angular':
                        // 角度渐变：计算点相对于中心的角度
                        let angle = Math.atan2(v - center.y, u - center.x) + Math.PI;
                        t = (angle / (Math.PI * 2)) % 1;
                        break;
                }

                // 获取插值颜色并写入数据
                const color = interpolateColor(t);
                const index = (y * width + x) * 4;
                data[index] = color.r * 255;
                data[index + 1] = color.g * 255;
                data[index + 2] = color.b * 255;
                data[index + 3] = color.a * 255;
            }
        }

        texture.LoadImage(data);
        return texture;
    }
}