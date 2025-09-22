export enum BlendMode {
    alpha,
    additive,
    multiply,
    replace
}

export class Color {
    // public static readonly WHITE = Object.freeze(new Color(1, 1, 1, 1)) as Readonly<Color>;
    public static get WHITE() { return new Color(1, 1, 1, 1); }
    public static get BLACK() { return new Color(0, 0, 0, 1); }
    public static get GRAY() { return new Color(0.5, 0.5, 0.5, 1); }
    public static get RED() { return new Color(1, 0, 0, 1); }
    public static get GREEN() { return new Color(0, 1, 0, 1); }
    public static get BLUE() { return new Color(0, 0, 1, 1); }
    public static get YELLOW() { return new Color(1, 1, 0, 1); }
    public static get CYAN() { return new Color(0, 1, 1, 1); }
    public static get MAGENTA() { return new Color(1, 0, 1, 1); }
    public static get ORANGE() { return new Color(1, 0.647, 0, 1); }
    public static get PURPLE() { return new Color(0.502, 0, 0.502, 1); }
    public static get BROWN() { return new Color(0.647, 0.165, 0, 1); }
    public static get MAROON() { return new Color(0.5, 0, 0, 1); }
    public static get CLEAR() { return new Color(0, 0, 0, 0); }

    public r: number;
    public g: number;
    public b: number;
    public a: number;


    constructor(r: number, g: number, b: number, a: number = 1) {
        this.r = Color.clamp01(r);
        this.g = Color.clamp01(g);
        this.b = Color.clamp01(b);
        this.a = Color.clamp01(a);
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public add(c: Color): Color {
        this.r = Math.min(1, this.r + c.r);
        this.g = Math.min(1, this.g + c.g);
        this.b = Math.min(1, this.b + c.b);
        this.a = Math.min(1, this.a + c.a);
        return this;
    }

    public subtract(c: Color): Color {
        this.r = Math.max(0, this.r - c.r);
        this.g = Math.max(0, this.g - c.g);
        this.b = Math.max(0, this.b - c.b);
        this.a = Math.max(0, this.a - c.a);
        return this;
    }

    public multiply(c: Color): Color {
        this.r = Math.min(1, this.r * c.r);
        this.g = Math.min(1, this.g * c.g);
        this.b = Math.min(1, this.b * c.b);
        this.a = Math.min(1, this.a * c.a);
        return this;
    }

    public multiplyScalar(scalar: number): Color {
        this.r = Math.min(1, this.r * scalar);
        this.g = Math.min(1, this.g * scalar);
        this.b = Math.min(1, this.b * scalar);
        this.a = Math.min(1, this.a * scalar);
        return this;
    }

    public ToUint32() {
        return ((this.a * 255) << 24) | ((this.b * 255) << 16) | ((this.g * 255) << 8) | (this.r * 255);
    }

    public static FromUint32(uint32: number) {
        return new Color(
            (uint32 & 0xFF) / 255,
            ((uint32 >> 8) & 0xFF) / 255,
            ((uint32 >> 16) & 0xFF) / 255,
            ((uint32 >> 24) & 0xFF) / 255
        );
    }

    public static add(c1: Color, c2: Color): Color {
        return new Color(
            Math.min(1, c1.r + c2.r),
            Math.min(1, c1.g + c2.g),
            Math.min(1, c1.b + c2.b),
            Math.min(1, c1.a + c2.a)
        );
    }

    public static subtract(c1: Color, c2: Color): Color {
        return new Color(
            Math.max(0, c1.r - c2.r),
            Math.max(0, c1.g - c2.g),
            Math.max(0, c1.b - c2.b),
            Math.max(0, c1.a - c2.a)
        );
    }

    public static multiply(c1: Color, c2: Color): Color {
        return new Color(
            Math.min(1, c1.r * c2.r),
            Math.min(1, c1.g * c2.g),
            Math.min(1, c1.b * c2.b),
            Math.min(1, c1.a * c2.a)
        );
    }

    public static multiplyScalar(c: Color, scalar: number): Color {
        return new Color(
            Math.min(1, c.r * scalar),
            Math.min(1, c.g * scalar),
            Math.min(1, c.b * scalar),
            Math.min(1, c.a * scalar)
        );
    }

    public static lerp(c1: Color, c2: Color, t: number): Color {
        t = Color.clamp01(t);
        return new Color(
            Color.clamp01(c1.r + (c2.r - c1.r) * t),
            Color.clamp01(c1.g + (c2.g - c1.g) * t),
            Color.clamp01(c1.b + (c2.b - c1.b) * t),
            Color.clamp01(c1.a + (c2.a - c1.a) * t)
        );
    }

    /**
     * 颜色混合方法
     * 支持多种混合模式
     */
    public static blendColors(dest: Color, src: Color, mode: BlendMode): Color {
        // 提取目标颜色分量 (ARGB格式)
        const destA = dest.a;
        const destR = dest.r;
        const destG = dest.g;
        const destB = dest.b;

        // 提取源颜色分量 (ARGB格式)
        const srcA = src.a;
        const srcR = src.r;
        const srcG = src.g;
        const srcB = src.b;

        let resultA, resultR, resultG, resultB;

        switch (mode) {
            case BlendMode.alpha:
                // Alpha 混合 (最常用的混合模式)
                const alpha = srcA;
                const invAlpha = 1 - alpha;

                resultA = Math.min(1, destA + srcA - (destA * srcA));
                resultR = srcR * alpha + destR * invAlpha;
                resultG = srcG * alpha + destG * invAlpha;
                resultB = srcB * alpha + destB * invAlpha;
                break;

            case BlendMode.additive:
                // 加法混合 (颜色叠加)
                resultA = Math.min(1, destA + srcA);
                resultR = Math.min(1, destR + srcR);
                resultG = Math.min(1, destG + srcG);
                resultB = Math.min(1, destB + srcB);
                break;

            case BlendMode.multiply:
                // 乘法混合 (颜色相乘)
                resultA = Math.min(1, destA);
                resultR = destR * srcR;
                resultG = destG * srcG;
                resultB = destB * srcB;
                break;

            case BlendMode.replace:
            default:
                // 直接替换
                return src.clone();
        }

        // 组合颜色分量
        return new Color(resultR, resultG, resultB, resultA);
    }

    private static clamp01(value: number): number {
        return Math.max(0, Math.min(1, value));
    }
}