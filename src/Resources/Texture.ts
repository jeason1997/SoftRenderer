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

export class Texture extends UObject {
    public width: number;
    public height: number;
    public mipMapBias: number;
    public mipmapCount: number;
    public data: Uint8ClampedArray;
    public filterMode: FilterMode;
    public wrapMode: TextureWrapMode;
    public format: TextureFormat;
    public alphaIsTransparency: boolean;

    // LoadImage(data: Uint8ClampedArray){
    //     throw new Error('LoadImage not implemented');
    // }

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
     * 通过UV坐标获取像素颜色（根据纹理设置自动处理）
     * @param u 纹理U坐标（0-1）
     * @param v 纹理V坐标（0-1）
     * @returns 颜色值（ARGB格式的32位整数）
     */
    public Sample(u: number, v: number): number {
        // 根据环绕模式处理UV坐标
        const [clampedU, clampedV] = this.handleWrapMode(u, v);

        // 根据过滤模式采样像素
        switch (this.filterMode) {
            case FilterMode.Point:
                return this.samplePoint(clampedU, clampedV);
            case FilterMode.Bilinear:
                return this.sampleBilinear(clampedU, clampedV);
            case FilterMode.Trilinear:
                // 三线性过滤需要Mipmap支持，这里简化处理
                console.warn("Trilinear filter not fully implemented, falling back to bilinear");
                return this.sampleBilinear(clampedU, clampedV);
            default:
                return this.samplePoint(clampedU, clampedV);
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
    private samplePoint(u: number, v: number): number {
        // 将UV坐标转换为像素坐标（注意V坐标通常需要翻转，因为纹理原点可能在左下角）
        const x = Math.floor(u * this.width);
        const y = Math.floor(v * this.height); // 翻转V坐标，符合常见纹理坐标系

        // 确保坐标在有效范围内
        const clampedX = Math.max(0, Math.min(this.width - 1, x));
        const clampedY = Math.max(0, Math.min(this.height - 1, y));

        return this.GetPixel(clampedX, clampedY);
    }

    /**
     * 双线性过滤采样
     * @param u 处理后的U坐标（0-1）
     * @param v 处理后的V坐标（0-1）
     * @returns 插值后的颜色值
     */
    private sampleBilinear(u: number, v: number): number {
        // 转换为像素坐标（带小数部分）
        const x = u * this.width;
        const y = (1 - v) * this.height; // 翻转V坐标

        // 计算周围四个像素的坐标
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const x1 = x0 + 1;
        const y1 = y0 + 1;

        // 计算插值权重
        const uWeight = x - x0; // U方向权重（0-1）
        const vWeight = y - y0; // V方向权重（0-1）

        // 获取四个角落的像素颜色
        const c00 = this.getClampedPixel(x0, y0);
        const c01 = this.getClampedPixel(x0, y1);
        const c10 = this.getClampedPixel(x1, y0);
        const c11 = this.getClampedPixel(x1, y1);

        // 双线性插值计算
        const color0 = this.lerpColor(c00, c10, uWeight); // 第一行插值
        const color1 = this.lerpColor(c01, c11, uWeight); // 第二行插值
        const finalColor = this.lerpColor(color0, color1, vWeight); // 垂直方向插值

        return finalColor;
    }

    /**
     * 获取范围内的像素（防止越界）
     * @param x 像素X坐标
     * @param y 像素Y坐标
     * @returns 颜色值
     */
    private getClampedPixel(x: number, y: number): number {
        const clampedX = Math.max(0, Math.min(this.width - 1, x));
        const clampedY = Math.max(0, Math.min(this.height - 1, y));
        return this.GetPixel(clampedX, clampedY);
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

    public onDestroy(): void {
        throw new Error("Method not implemented.");
    }
}