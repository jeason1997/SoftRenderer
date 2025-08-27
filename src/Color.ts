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

    public r: number;
    public g: number;
    public b: number;
    public a: number;

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
}