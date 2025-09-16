export enum BlendMode {
    alpha,
    additive,
    multiply,
    screen,
    overlay,
    replace
}

export class Color {
    public static readonly WHITE = new Color(255, 255, 255).ToUint32();
    public static readonly BLACK = new Color(0, 0, 0).ToUint32();
    public static readonly GRAY = new Color(128, 128, 128).ToUint32();
    public static readonly RED = new Color(255, 0, 0).ToUint32();
    public static readonly GREEN = new Color(0, 255, 0).ToUint32();
    public static readonly BLUE = new Color(0, 0, 255).ToUint32();
    public static readonly YELLOW = new Color(255, 255, 0).ToUint32();
    public static readonly CYAN = new Color(0, 255, 255).ToUint32();
    public static readonly MAGENTA = new Color(255, 0, 255).ToUint32();
    public static readonly ORANGE = new Color(255, 165, 0).ToUint32();
    public static readonly PURPLE = new Color(128, 0, 128).ToUint32();
    public static readonly BROWN = new Color(165, 42, 0).ToUint32();
    public static readonly MAROON = new Color(128, 0, 0).ToUint32();
    
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    // 颜色混合查找表
    private static blendLUT: Uint32Array[] = [];

    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public ToUint32() {
        return (this.a << 24) | (this.b << 16) | (this.g << 8) | this.r;
    }

    public static FromUint32(uint32: number) {
        return new Color(
            uint32 & 0xFF,
            (uint32 >> 8) & 0xFF,
            (uint32 >> 16) & 0xFF,
            (uint32 >> 24) & 0xFF
        );
    }

    /**
     * 颜色混合方法
     * 支持多种混合模式
     */
    public static blendColors(dest: number, src: number, mode: BlendMode): number {
        // 提取目标颜色分量 (ARGB格式)
        const destA = (dest >> 24) & 0xFF;
        const destR = (dest >> 16) & 0xFF;
        const destG = (dest >> 8) & 0xFF;
        const destB = dest & 0xFF;

        // 提取源颜色分量 (ARGB格式)
        const srcA = (src >> 24) & 0xFF;
        const srcR = (src >> 16) & 0xFF;
        const srcG = (src >> 8) & 0xFF;
        const srcB = src & 0xFF;

        let resultA, resultR, resultG, resultB;

        switch (mode) {
            case BlendMode.alpha:
                // Alpha 混合 (最常用的混合模式)
                const alpha = srcA / 255;
                const invAlpha = 1 - alpha;

                resultA = Math.min(255, destA + srcA - (destA * srcA) / 255);
                resultR = Math.floor(srcR * alpha + destR * invAlpha);
                resultG = Math.floor(srcG * alpha + destG * invAlpha);
                resultB = Math.floor(srcB * alpha + destB * invAlpha);
                break;

            case BlendMode.additive:
                // 加法混合 (颜色叠加)
                resultA = Math.min(255, destA + srcA);
                resultR = Math.min(255, destR + srcR);
                resultG = Math.min(255, destG + srcG);
                resultB = Math.min(255, destB + srcB);
                break;

            case BlendMode.multiply:
                // 乘法混合 (颜色相乘)
                resultA = Math.min(255, destA);
                resultR = Math.floor((destR * srcR) / 255);
                resultG = Math.floor((destG * srcG) / 255);
                resultB = Math.floor((destB * srcB) / 255);
                break;

            case BlendMode.screen:
                // 屏幕混合 (颜色反相相乘后再反相)
                resultA = Math.min(255, destA);
                resultR = 255 - Math.floor(((255 - destR) * (255 - srcR)) / 255);
                resultG = 255 - Math.floor(((255 - destG) * (255 - srcG)) / 255);
                resultB = 255 - Math.floor(((255 - destB) * (255 - srcB)) / 255);
                break;

            case BlendMode.overlay:
                // 叠加混合 (根据底色决定乘或屏)
                resultA = Math.min(255, destA);
                resultR = this.overlayBlend(destR, srcR);
                resultG = this.overlayBlend(destG, srcG);
                resultB = this.overlayBlend(destB, srcB);
                break;

            case BlendMode.replace:
            default:
                // 直接替换
                return src;
        }

        // 组合颜色分量
        return (resultA << 24) | (resultR << 16) | (resultG << 8) | resultB;
    }

    /**
     * 叠加混合的辅助函数
     */
    private static overlayBlend(dest: number, src: number): number {
        if (dest < 128) {
            return Math.floor((2 * dest * src) / 255);
        } else {
            return 255 - Math.floor((2 * (255 - dest) * (255 - src)) / 255);
        }
    }
}