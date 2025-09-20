import { UObject } from "../Core/UObject";
import { Color } from "../Math/Color";

export enum FilterMode {
    Point,
    Bilinear,
    Trilinear
}

export enum TextureWrapMode {
    Repeat,
    Clamp
}

export enum TextureFormat {
    Alpha8 = 1,
    ARGB4444 = 2,
    RGB24 = 3,
    RGBA32 = 4,
    ARGB32 = 5,
    RGB565 = 7,
    DXT1 = 10,
    DXT5 = 12,
    RGBA4444 = 13,
    PVRTC_RGB2 = 30,
    PVRTC_RGBA2 = 31,
    PVRTC_RGB4 = 32,
    PVRTC_RGBA4 = 33,
    ETC_RGB4 = 34,
    ATC_RGB4 = 35,
    ATC_RGBA8 = 36,
    BGRA32 = 37,
    ATF_RGB_DXT1 = 38,
    ATF_RGBA_JPG = 39,
    ATF_RGB_JPG = 40
}

interface MipmapLevel {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

export class Texture extends UObject {
    public width: number;
    public height: number;
    public mipMapBias: number = 0;
    public mipmapCount: number = 5;
    public data: Uint8ClampedArray;
    public filterMode: FilterMode = FilterMode.Point;
    public wrapMode: TextureWrapMode = TextureWrapMode.Repeat;
    public format: TextureFormat = TextureFormat.RGBA32;
    public alphaIsTransparency: boolean;
    private mipmapLevels: MipmapLevel[];


    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }

    LoadImage(data: Uint8ClampedArray) {
        this.data = data;
        this.generateMipmaps();
    }

    SetPixel(x: number, y: number, color: number) {
        const index = (y * this.width + x) * 4;
        this.data[index] = color & 0xff;
        this.data[index + 1] = (color >> 8) & 0xff;
        this.data[index + 2] = (color >> 16) & 0xff;
        this.data[index + 3] = (color >> 24) & 0xff;
    }

    // SetPixels(colors: Color[]){
    //     for(let i = 0; i < colors.length; i++){
    //         const color = colors[i];
    //         const x = i % this.width;
    //         const y = Math.floor(i / this.width);
    //         this.SetPixel(x, y, color);
    //     }
    // }

    // SetPixels2(x: number, y: number, blockWidth: number, blockHeight: number, colors: Color[]){
    //     throw new Error('LoadImage not implemented');
    // }

    GetPixel(x: number, y: number): number {
        const index = (y * this.width + x) * 4;
        return this.data[index] | (this.data[index + 1] << 8) | (this.data[index + 2] << 16) | (this.data[index + 3] << 24);
    }

    // GetPixels(x: number, y: number, blockWidth: number, blockHeight: number): number[]{
    //     const colors = new Array<number>(blockWidth * blockHeight);
    //     for(let i = 0; i < blockWidth * blockHeight; i++){
    //         const x0 = x + i % blockWidth;
    //         const y0 = y + Math.floor(i / blockWidth);
    //         colors[i] = this.GetPixel(x0, y0);
    //     }
    //     return colors;
    // }

    // GetPixelBilinear(u: number, v: number): Color{
    //     const x = u * this.width;
    //     const y = v * this.height;
    //     const x0 = Math.floor(x);
    //     const y0 = Math.floor(y);
    //     const x1 = x0 + 1;
    //     const y1 = y0 + 1;
    //     const u0 = x - x0;
    //     const v0 = y - y0;
    //     const u1 = 1 - u0;
    //     const v1 = 1 - v0;
    //     const c00 = this.GetPixel(x0, y0);
    //     const c01 = this.GetPixel(x0, y1);
    //     const c10 = this.GetPixel(x1, y0);
    //     const c11 = this.GetPixel(x1, y1);
    //     return new Color(
    //         c00.r * u1 * v1 + c01.r * u1 * v0 + c10.r * u0 * v1 + c11.r * u0 * v0,  
    //         c00.g * u1 * v1 + c01.g * u1 * v0 + c10.g * u0 * v1 + c11.g * u0 * v0,  
    //         c00.b * u1 * v1 + c01.b * u1 * v0 + c10.b * u0 * v1 + c11.b * u0 * v0,  
    //         c00.a * u1 * v1 + c01.a * u1 * v0 + c10.a * u0 * v1 + c11.a * u0 * v0,  
    //     );
    // }

    // Resize(width: number, height: number){
    //     throw new Error('LoadImage not implemented');
    // }

    /**
     * 通过UV坐标和纹理坐标导数获取像素颜色（考虑Mipmap）
     * @param u 纹理U坐标（0-1）
     * @param v 纹理V坐标（0-1）
     * @param du_dx U坐标在屏幕空间X方向的导数
     * @param dv_dx V坐标在屏幕空间X方向的导数
     * @param du_dy U坐标在屏幕空间Y方向的导数
     * @param dv_dy V坐标在屏幕空间Y方向的导数
     * @returns 颜色值（ARGB格式的32位整数）
     */
    public SampleMip(u: number, v: number, du_dx: number = 0.001, dv_dx: number = 0.001, du_dy: number = 0.001, dv_dy: number = 0.001): number {
        /* 
        在 3D 渲染中，为了让 Mipmap 层级计算更准确（避免纹理在远处出现锯齿或近处过度模糊），需要传递纹理坐标在屏幕空间的导数。这些导数描述了 UV 坐标在屏幕上每移动 1 像素时的变化率，计算方式如下：
        // 假设当前片段的UV坐标
        const currentU = uv.u;
        const currentV = uv.v;

        // 右侧相邻像素的UV（x方向+1）
        const rightU = neighborRight.attributes.uv.u;
        const rightV = neighborRight.attributes.uv.v;

        // 下方相邻像素的UV（y方向+1）
        const bottomU = neighborBottom.attributes.uv.u;
        const bottomV = neighborBottom.attributes.uv.v;

        // 计算导数（UV在屏幕空间的变化率）
        const du_dx = rightU - currentU; // U在X方向的导数
        const dv_dx = rightV - currentV; // V在X方向的导数
        const du_dy = bottomU - currentU; // U在Y方向的导数
        const dv_dy = bottomV - currentV; // V在Y方向的导数
         */

        // 计算Mipmap层级
        const mipLevel = this.calculateMipLevel(du_dx, dv_dx, du_dy, dv_dy);
        return this.Sample(u, v, mipLevel);
    }

    /**
     * 通过UV坐标获取像素颜色（根据纹理设置自动处理）
     * @param u 纹理U坐标（0-1）
     * @param v 纹理V坐标（0-1）
     * @returns 颜色值（ARGB格式的32位整数）
     */
    public Sample(u: number, v: number, mipLevel: number = 0): number {
        // 根据环绕模式处理UV坐标
        const [clampedU, clampedV] = this.handleWrapMode(u, v);

        // 根据过滤模式采样像素
        switch (this.filterMode) {
            case FilterMode.Point:
                return this.samplePoint(clampedU, clampedV, mipLevel);
            case FilterMode.Bilinear:
                return this.sampleBilinear(clampedU, clampedV, mipLevel);
            case FilterMode.Trilinear:
                return this.sampleTrilinear(clampedU, clampedV, mipLevel);
            default:
                return this.samplePoint(clampedU, clampedV, mipLevel);
        }
    }

    /**
     * 处理UV坐标的环绕模式
     * @param u 原始U坐标
     * @param v 原始V坐标
     * @returns 处理后的UV坐标
     */
    private handleWrapMode(u: number, v: number): [number, number] {
        let handledU = u;
        let handledV = v;

        switch (this.wrapMode) {
            case TextureWrapMode.Repeat:
                // 重复模式：取小数部分实现平铺
                handledU = handledU - Math.floor(handledU);
                handledV = handledV - Math.floor(handledV);
                break;
            case TextureWrapMode.Clamp:
                // 拉伸模式：限制在0-1范围内
                handledU = Math.max(0, Math.min(1, handledU));
                handledV = Math.max(0, Math.min(1, handledV));
                break;
        }

        return [handledU, handledV];
    }

    /**
     * 点过滤采样（最近邻）
     * @param u 处理后的U坐标（0-1）
     * @param v 处理后的V坐标（0-1）
     * @returns 颜色值
     */
    private samplePoint(u: number, v: number, mipLevel: number = 0): number {
        // 选择最接近的Mipmap层级
        const level = Math.round(mipLevel);
        const mip = this.getMipmapLevel(level);

        // 将UV坐标转换为像素坐标
        const x = Math.floor(u * mip.width);
        const y = Math.floor(v * mip.height);

        // 确保坐标在有效范围内
        const clampedX = Math.max(0, Math.min(mip.width - 1, x));
        const clampedY = Math.max(0, Math.min(mip.height - 1, y));

        // 获取像素颜色
        const index = (clampedY * mip.width + clampedX) * 4;
        return this.packColor(
            mip.data[index],
            mip.data[index + 1],
            mip.data[index + 2],
            mip.data[index + 3]
        );
    }

    /**
     * 双线性过滤采样
     * @param u 处理后的U坐标（0-1）
     * @param v 处理后的V坐标（0-1）
     * @returns 插值后的颜色值
     */
    private sampleBilinear(u: number, v: number, mipLevel: number = 0): number {
        // 选择最接近的Mipmap层级
        const level = Math.round(mipLevel);
        const mip = this.getMipmapLevel(level);

        // 转换为像素坐标（带小数部分）
        const x = u * mip.width;
        const y = v * mip.height;

        // 计算周围四个像素的坐标
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const x1 = x0 + 1;
        const y1 = y0 + 1;

        // 计算插值权重
        const uWeight = x - x0;
        const vWeight = y - y0;

        // 获取四个角落的像素颜色
        const c00 = this.getClampedPixelFromMip(mip, x0, y0);
        const c01 = this.getClampedPixelFromMip(mip, x0, y1);
        const c10 = this.getClampedPixelFromMip(mip, x1, y0);
        const c11 = this.getClampedPixelFromMip(mip, x1, y1);

        // 双线性插值计算
        const color0 = this.lerpColor(c00, c10, uWeight);
        const color1 = this.lerpColor(c01, c11, uWeight);
        const finalColor = this.lerpColor(color0, color1, vWeight);

        return finalColor;
    }

    /**
     * 三线性过滤采样，在双线性过滤基础上，找到2个最近的Mipmap层级，根据距离插值
     */
    private sampleTrilinear(u: number, v: number, mipLevel: number = 0): number {
        // 如果Mipmap层级不足，退化为双线性过滤
        if (this.mipmapCount < 2) {
            return this.sampleBilinear(u, v, mipLevel);
        }

        // 计算上下两个Mipmap层级
        const levelFloor = Math.floor(mipLevel);
        const levelCeil = Math.min(levelFloor + 1, this.mipmapCount - 1);
        const levelWeight = mipLevel - levelFloor;

        // 在两个层级上分别进行双线性过滤
        const colorFloor = this.sampleBilinear(u, v, levelFloor);
        const colorCeil = this.sampleBilinear(u, v, levelCeil);

        // 在两个层级结果之间进行线性插值
        return this.lerpColor(colorFloor, colorCeil, levelWeight);
    }

    /**
     * 颜色插值（线性插值）
     * @param a 起始颜色
     * @param b 目标颜色
     * @param t 插值系数（0-1）
     * @returns 插值后的颜色
     */
    private lerpColor(a: number, b: number, t: number): number {
        // 提取ARGB四个通道
        const aA = (a >> 24) & 0xff;
        const aR = (a >> 16) & 0xff;
        const aG = (a >> 8) & 0xff;
        const aB = a & 0xff;

        const bA = (b >> 24) & 0xff;
        const bR = (b >> 16) & 0xff;
        const bG = (b >> 8) & 0xff;
        const bB = b & 0xff;

        // 每个通道单独插值
        const lerpA = Math.round(aA + (bA - aA) * t);
        const lerpR = Math.round(aR + (bR - aR) * t);
        const lerpG = Math.round(aG + (bG - aG) * t);
        const lerpB = Math.round(aB + (bB - aB) * t);

        // 组合成32位颜色值
        return (lerpA << 24) | (lerpR << 16) | (lerpG << 8) | lerpB;
    }

    /**
     * 生成Mipmap层级
     * 从原始纹理开始，逐级缩小为1/2尺寸并进行模糊处理
     */
    private generateMipmaps() {
        // 清空现有Mipmap层级
        this.mipmapLevels = [];

        // 添加原始纹理作为第0级Mipmap
        this.mipmapLevels.push({
            width: this.width,
            height: this.height,
            data: new Uint8ClampedArray(this.data)
        });

        let currentWidth = this.width;
        let currentHeight = this.height;
        let currentLevel = 0;

        // 生成后续Mipmap层级，直到1x1像素
        while (currentWidth > 1 || currentHeight > 1) {
            currentLevel++;
            const newWidth = Math.max(1, Math.floor(currentWidth / 2));
            const newHeight = Math.max(1, Math.floor(currentHeight / 2));

            // 创建新层级数据
            const newData = new Uint8ClampedArray(newWidth * newHeight * 4);
            const sourceLevel = this.mipmapLevels[currentLevel - 1];

            // 缩小并模糊处理（简单的2x2区域平均）
            for (let y = 0; y < newHeight; y++) {
                for (let x = 0; x < newWidth; x++) {
                    // 计算源纹理中的对应区域
                    const srcX = Math.min(x * 2, sourceLevel.width - 1);
                    const srcY = Math.min(y * 2, sourceLevel.height - 1);

                    // 取2x2区域的四个像素
                    const pixels = [
                        this.getPixelFromLevel(sourceLevel, srcX, srcY),
                        this.getPixelFromLevel(sourceLevel, Math.min(srcX + 1, sourceLevel.width - 1), srcY),
                        this.getPixelFromLevel(sourceLevel, srcX, Math.min(srcY + 1, sourceLevel.height - 1)),
                        this.getPixelFromLevel(sourceLevel, Math.min(srcX + 1, sourceLevel.width - 1), Math.min(srcY + 1, sourceLevel.height - 1))
                    ];

                    // 计算四个像素的平均值
                    let r = 0, g = 0, b = 0, a = 0;
                    for (const p of pixels) {
                        r += p.r;
                        g += p.g;
                        b += p.b;
                        a += p.a;
                    }

                    r = Math.round(r / 4);
                    g = Math.round(g / 4);
                    b = Math.round(b / 4);
                    a = Math.round(a / 4);

                    // 写入新Mipmap层级
                    const index = (y * newWidth + x) * 4;
                    newData[index] = r;
                    newData[index + 1] = g;
                    newData[index + 2] = b;
                    newData[index + 3] = a;
                }
            }

            // 添加新层级
            this.mipmapLevels.push({
                width: newWidth,
                height: newHeight,
                data: newData
            });

            currentWidth = newWidth;
            currentHeight = newHeight;
        }

        this.mipmapCount = this.mipmapLevels.length;
    }

    /**
     * 从指定Mipmap层级获取像素颜色（RGBA分量）
     */
    private getPixelFromLevel(level: MipmapLevel, x: number, y: number): { r: number, g: number, b: number, a: number } {
        const index = (y * level.width + x) * 4;
        return {
            r: level.data[index],
            g: level.data[index + 1],
            b: level.data[index + 2],
            a: level.data[index + 3]
        };
    }

    /**
     * 计算所需的Mipmap层级
     * 基于纹理坐标在屏幕空间的变化率（导数）
     */
    private calculateMipLevel(du_dx: number, dv_dx: number, du_dy: number, dv_dy: number): number {
        // 如果没有Mipmap，直接返回0级
        if (this.mipmapCount <= 1) return 0;

        // 计算纹理空间的偏导数
        const dx = du_dx * this.width;
        const dy = dv_dx * this.height;
        const dz = du_dy * this.width;
        const dw = dv_dy * this.height;

        // 计算纹理坐标变化的幅度
        const lenSq = dx * dx + dy * dy + dz * dz + dw * dw;
        let level = 0.5 * Math.log2(lenSq);

        // 应用Mipmap偏差
        level += this.mipMapBias;

        // 限制在有效层级范围内
        return Math.max(0, Math.min(this.mipmapCount - 1, level));
    }

    /**
     * 获取指定Mipmap层级（确保有效）
     */
    private getMipmapLevel(level: number): MipmapLevel {
        const clampedLevel = Math.max(0, Math.min(this.mipmapCount - 1, level));
        return this.mipmapLevels[clampedLevel] || this.mipmapLevels[0];
    }

    /**
     * 从Mipmap层级获取范围内的像素（防止越界）
     */
    private getClampedPixelFromMip(mip: MipmapLevel, x: number, y: number): number {
        const clampedX = Math.max(0, Math.min(mip.width - 1, x));
        const clampedY = Math.max(0, Math.min(mip.height - 1, y));
        const index = (clampedY * mip.width + clampedX) * 4;

        return this.packColor(
            mip.data[index],
            mip.data[index + 1],
            mip.data[index + 2],
            mip.data[index + 3]
        );
    }

    /**
     * 将RGBA分量打包为32位整数
     */
    private packColor(r: number, g: number, b: number, a: number): number {
        return r | (g << 8) | (b << 16) | (a << 24);
    }

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
        color1: number = Color.WHITE,
        color2: number = Color.GRAY): Texture {

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
                data[index] = (color >> 0) & 0xff;
                data[index + 1] = (color >> 8) & 0xff;
                data[index + 2] = (color >> 16) & 0xff;
                data[index + 3] = (color >> 24) & 0xff;
            }
        }

        texture.LoadImage(data);
        return texture;
    }

    public onDestroy(): void {
        // 清理Mipmap数据
        this.mipmapLevels = [];
    }
}