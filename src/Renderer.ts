import { Color } from "./Color";
import { Input } from "./Input";

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

        // // 画线
        // this.DrawLine(200, 200, 200, 0, Color.WHITE);
        // this.DrawLine(200, 200, 300, 0, Color.RED);
        // this.DrawLine(200, 200, 300, 200, Color.GREEN);
        // this.DrawLine(200, 200, 300, 400, Color.BLUE);
        // this.DrawLine(200, 200, 200, 300, Color.BLACK);
        // this.DrawLine(200, 200, 100, 300, Color.YELLOW);
        // this.DrawLine(200, 200, 100, 100, Color.ORANGE);

        // 画三角形
        //console.log(Input.mouseX, Input.mouseY);
        this.DrawTriangleFilled(200, 200, 300, 100, Input.mouseX, Input.mouseY, Color.RED);
        this.DrawTriangle(200, 200, 300, 100, Input.mouseX, Input.mouseY, Color.YELLOW);
        this.DrawLine(200, 200, Input.mouseX, Input.mouseY, Color.WHITE);
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

    public DrawPixel(x: number, y: number, color: number) {
        this.uint32View[Math.floor(y) * this.canvasWidth + Math.floor(x)] = color;
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
            if (x2 < x1) [x1, y1, x2, y2] = [x2, y2, x1, y1];

            // // 斜率
            // const a = dy / dx;
            // // 截距（y=ax+b，b=y-ax）
            // // const b = y1 - a * x1;
            // let y = y1;
            // // 绘制直线
            // for (let x = x1; x <= x2; x++) {
            //     this.SetPixel(x, y, color);
            //     // 直线公式y=ax+b，这里不必计算这个公式，因为当x加1自增时，y也会加a，所以可以直接用y+a代替ax+b，算是一个性能优化点
            //     // y = a * x + b;
            //     y = y + a;
            // }

            // 或
            const ys = this.Interpolate(x1, y1, x2, y2);
            for (let x = x1; x <= x2; x++) {
                this.DrawPixel(x, ys[x - x1], color);
            }
        }
        // 斜率大于1，直线偏垂直情况，使用y作为循环变量
        else {
            if (y2 < y1) [x1, y1, x2, y2] = [x2, y2, x1, y1];

            // const a = dx / dy;
            // let x = x1;
            // for (let y = y1; y <= y2; y++) {
            //     this.SetPixel(x, y, color);
            //     x = x + a;
            // }

            // 或
            const xs = this.Interpolate(y1, x1, y2, x2);
            for (let y = y1; y <= y2; y++) {
                this.DrawPixel(xs[y - y1], y, color);
            }
        }
    }

    public DrawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: number) {
        this.DrawLine(x1, y1, x2, y2, color);
        this.DrawLine(x2, y2, x3, y3, color);
        this.DrawLine(x3, y3, x1, y1, color);
    }

    public DrawTriangleFilled(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: number) {
        // 注：以下提到的长边，特指y轴跨度最长的边，而不是实际上的边长

        // 对点进行排序，使得y1<=y2<=y3，即可确定三角形的长边为L13，L12和L23则是另外两条短边
        if (y1 > y2) [x1, y1, x2, y2] = [x2, y2, x1, y1];
        if (y1 > y3) [x1, y1, x3, y3] = [x3, y3, x1, y1];
        if (y2 > y3) [x2, y2, x3, y3] = [x3, y3, x2, y2];

        // 获取3条边的点坐标合集
        const p12 = this.Interpolate(y1, x1, y2, x2);
        const p23 = this.Interpolate(y2, x2, y3, x3);
        const p13 = this.Interpolate(y1, x1, y3, x3);

        // 拼合两条短边为一条长边（先移除第一条边的最后一个数据，避免重复）
        // 现在变成2条长边，L13和L123
        p12.pop();
        const p123 = p12.concat(p23);

        // 判断L13和L123哪条长边是左哪条是右，都取数组中间的点，判断谁左谁右即可。
        const m = Math.floor(p123.length / 2);
        let pLeft = p123;
        let pRight = p13;
        if (p13[m] < p123[m]) {
            pLeft = p13;
            pRight = p123;
        }

        // 绘制水平线段
        for (let y = y1; y <= y3; y++) {
            for (let x = pLeft[y - y1]; x <= pRight[y - y1]; x++) {
                this.DrawPixel(x, y, color);
            }
        }
    }

    /// <summary>
    /// 线性插值
    /// 传入2个点，返回它们组成线段的插值。
    /// 要求：
    /// 1. 要先算出直线偏水平还是垂直，如果是偏水平（斜率小于1），则以x为循环，传入顺序是(x1,y1,x2,y2)，反之如果直线偏垂直，则是(y1,x1,y2,x2)
    /// 2. 同时要确保线段点的方向是从左往右或从上往下，例如线段是偏水平的话，要确保x2>x1，如果是偏垂直的话，要确保y2>y1
    /// 举个例子：
    /// 点(0, 0)和(2,1)，传入的参数是(0, 0, 2, 1)，返回的是((2-0)+1=3)个值，这些值是从(0-1)中间插值的，即(0, 0.5, 1)
    /// </summary>
    private Interpolate(a1: number, b1: number, a2: number, b2: number): number[] {
        // 预分配数组大小以避免动态扩容
        const dx = Math.abs(Math.floor(a2 - a1));
        const value = new Array(dx + 1);
        const a = (b2 - b1) / (a2 - a1);
        let d = b1;

        for (let i = 0; i <= dx; i++) {
            value[i] = d;
            d += a;
        }
        return value;
    }
}