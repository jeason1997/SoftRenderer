import { Vector2 } from "./Vector2";
import { Color } from "./Color";

export class Renderer {
    private canvasWidth: number;
    private canvasHeight: number;
    private uint32View: Uint32Array;

    constructor(uint32View: Uint32Array, canvasWidth: number, canvasHeight: number) {
        this.uint32View = uint32View;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    angle: number = 0;
    public Render() {
        // for (let x = 0; x < this.canvasWidth; x++) {
        //     // 每列一种随机颜色
        //     const color = Math.random() * 0xFFFFFFFF;
        //     for (let y = 0; y < this.canvasHeight; y++) {
        //         this.SetPixel(x, y, color);
        //     }
        // }
        this.Clear(Color.GRAY);
        // 圆心
        // const centerX = this.canvasWidth / 2;
        // const centerY = this.canvasHeight / 2;
        // // 半径
        // const radius = 100;
        // // 绘制圆心到半径的线（绕一圈）
        // const x = centerX + radius * Math.cos(this.angle * Math.PI / 180);
        // const y = centerY + radius * Math.sin(this.angle * Math.PI / 180);
        // this.DrawLine(centerX, centerY, x, y, Color.WHITE);
        // this.angle++;

        this.DrawLine(200, 200, 200, 0, Color.WHITE);
        this.DrawLine(200, 200, 300, 0, Color.RED);
        this.DrawLine(200, 200, 300, 200, Color.GREEN);
        this.DrawLine(200, 200, 300, 400, Color.BLUE);
        this.DrawLine(200, 200, 200, 300, Color.BLACK);
        this.DrawLine(200, 200, 100, 300, Color.YELLOW);
        this.DrawLine(200, 200, 100, 100, Color.ORANGE);
    }

    public Clear(color: number) {
        // 使用 fill 方法替代循环，性能更好
        this.uint32View.fill(color);
        // 或者使用循环，但性能较差
        // for (let x = 0; x < this.canvasWidth; x++) {
        //     for (let y = 0; y < this.canvasHeight; y++) {
        //         this.SetPixel(x, y, color);
        //     }
        // }
    }

    public SetPixel(x: number, y: number, color: number) {
        this.uint32View[y * this.canvasWidth + x] = color;
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        // 为何要区分斜率是否偏水平还是垂直呢？因为如果不区分，例如当斜率大于1时，会导致直线绘制不连续，因为y会跳变，而不是连续的增加。
        // 只有斜率刚好为1时，x跟y才是连续同步自增的，x+1，则y也+1
        // 所以，当斜率大于1时，我们需要使用y作为循环变量，而当斜率小于1时，我们需要使用x作为循环变量。
        // 举个极端例子，当斜率为0时，直线就是一条垂直直线，如果这时候还用x作为循环变量，则会导致这条直线上所有y点都对应一个x，也就是说这条线变成一个点了。

        // 斜率小于1，直线偏水平情况，使用x作为循环变量
        if (Math.abs(dx) > Math.abs(dy)) {
            // 下面的循环绘制函数是从左往右的，这里要确保结束点在开始点的右边
            if (x2 < x1) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            // 斜率
            const a = dy / dx;
            // 截距（y=ax+b，b=y-ax）
            // const b = y1 - a * x1;
            let y = y1;
            // 绘制直线
            for (let x = x1; x <= x2; x++) {
                this.SetPixel(x, y, color);
                // 直线公式y=ax+b，这里不必计算这个公式，因为当x加1自增时，y也会加a，所以可以直接用y+a代替ax+b，算是一个性能优化点
                // y = a * x + b;
                y = y + a;
            }
        }
        // 斜率大于1，直线偏垂直情况，使用y作为循环变量
        else {
            if (y2 < y1) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            const a = dx / dy;
            let x = x1;
            for (let y = y1; y <= y2; y++) {
                this.SetPixel(x, y, color);
                x = x + a;
            }
        }
    }
}