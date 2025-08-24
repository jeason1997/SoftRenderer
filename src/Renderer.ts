export class Renderer {
    private canvasWidth: number;
    private canvasHeight: number;
    private uint32View: Uint32Array;

    constructor(uint32View: Uint32Array, canvasWidth: number, canvasHeight: number) {
        this.uint32View = uint32View;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    public Render() {
        for (let x = 0; x < this.canvasWidth; x++) {
            // 每列一种随机颜色
            const color = Math.random() * 0xFFFFFFFF;
            for (let y = 0; y < this.canvasHeight; y++) {
                this.SetPixel(x, y, color);
            }
        }
    }

    public SetPixel(x: number, y: number, color: number) {
        this.uint32View[y * this.canvasWidth + x] = color;
    }
}