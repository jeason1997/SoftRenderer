import { UObject } from "../Core/UObject";
import { Color } from "../Math/Color";

export enum FilterMode
{
    Point,
    Bilinear,
    Trilinear
}

export enum TextureWrapMode
{
    Repeat,
    Clamp
}

export enum TextureFormat
{
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

    SetPixel(x: number, y: number, color: number){
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

    GetPixel(x: number, y: number): number{
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

    public onDestroy(): void {
        throw new Error("Method not implemented.");
    }
}