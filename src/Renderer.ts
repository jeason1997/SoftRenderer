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
        this.Clear(Color.GRAY);
        // 圆心
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        // 半径
        const radius = 100;
        // 绘制圆心到半径的线（绕一圈）
        const x = centerX + radius * Math.cos(this.angle * Math.PI / 180);
        const y = centerY + radius * Math.sin(this.angle * Math.PI / 180);
        this.DrawLine(centerX, centerY, x, y, Color.WHITE);
        this.angle++;

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
        this.DrawTriangleFilledWithVertexColor(200, 200, 300, 100, Input.mouseX, Input.mouseY, Color.RED, Color.GREEN, Color.BLUE);
        //this.DrawTriangleFilled(200, 200, 300, 100, Input.mouseX, Input.mouseY, Color.RED);
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

            // 斜率
            const a = dy / dx;
            // 截距（y=ax+b，b=y-ax）
            // const b = y1 - a * x1;
            let y = y1;
            // 绘制直线
            for (let x = x1; x <= x2; x++) {
                this.DrawPixel(x, y, color);
                // 直线公式y=ax+b，这里不必计算这个公式，因为当x加1自增时，y也会加a，所以可以直接用y+a代替ax+b，算是一个性能优化点
                // y = a * x + b;
                y = y + a;
            }

            // 或
            // const ys = this.Interpolate(x1, y1, x2, y2);
            // for (let x = x1; x <= x2; x++) {
            //     this.DrawPixel(x, ys[x - x1], color);
            // }
        }
        // 斜率大于1，直线偏垂直情况，使用y作为循环变量
        else {
            if (y2 < y1) [x1, y1, x2, y2] = [x2, y2, x1, y1];

            const a = dx / dy;
            let x = x1;
            for (let y = y1; y <= y2; y++) {
                this.DrawPixel(x, y, color);
                x = x + a;
            }

            // 或
            // const xs = this.Interpolate(y1, x1, y2, x2);
            // for (let y = y1; y <= y2; y++) {
            //     this.DrawPixel(xs[y - y1], y, color);
            // }
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

    public DrawTriangleFilledWithVertexColor(
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        color1: number, color2: number, color3: number
    ) {
        // 对点按Y坐标排序，确保y1 <= y2 <= y3
        if (y1 > y2) [x1, y1, x2, y2, color1, color2] = [x2, y2, x1, y1, color2, color1];
        if (y1 > y3) [x1, y1, x3, y3, color1, color3] = [x3, y3, x1, y1, color3, color1];
        if (y2 > y3) [x2, y2, x3, y3, color2, color3] = [x3, y3, x2, y2, color3, color2];

        // 提取RGB分量
        const c1 = Color.FromUint32(color1);
        const c2 = Color.FromUint32(color2);
        const c3 = Color.FromUint32(color3);

        // 插值函数，颜色1与颜色2在d1-d2的范围内均匀插值
        const interpolateColor = (d1: number, r1: number, g1: number, b1: number, a1: number,
            d2: number, r2: number, g2: number, b2: number, a2: number) => {
            // 预分配数组大小
            const dx = Math.abs(Math.floor(d2 - d1));
            const result = new Array(dx + 1);
            
            // 计算步长
            const invDelta = 1 / (d2 - d1);
            const rStep = (r2 - r1) * invDelta;
            const gStep = (g2 - g1) * invDelta;
            const bStep = (b2 - b1) * invDelta;
            const aStep = (a2 - a1) * invDelta;

            let r = r1, g = g1, b = b1, a = a1;
            for (let i = 0; i <= dx; i++) {
                result[i] = { r, g, b, a };
                r += rStep;
                g += gStep;
                b += bStep;
                a += aStep;
            }
            return result;
        };

        // 插值三条边的坐标和颜色
        const p12 = this.Interpolate(y1, x1, y2, x2);
        const p12Colors = interpolateColor(y1, c1.r, c1.g, c1.b, c1.a, y2, c2.r, c2.g, c2.b, c2.a);

        const p23 = this.Interpolate(y2, x2, y3, x3);
        const p23Colors = interpolateColor(y2, c2.r, c2.g, c2.b, c2.a, y3, c3.r, c3.g, c3.b, c3.a);

        const p13 = this.Interpolate(y1, x1, y3, x3);
        const p13Colors = interpolateColor(y1, c1.r, c1.g, c1.b, c1.a, y3, c3.r, c3.g, c3.b, c3.a);

        // 合并两条短边
        p12.pop();
        const p123 = p12.concat(p23);
        const p123Colors = p12Colors.concat(p23Colors);

        // 确定左右边界
        const m = Math.floor(p123.length / 2);
        let leftPoints = p123;
        let rightPoints = p13;
        let leftColors = p123Colors;
        let rightColors = p13Colors;

        if (p13[m] < p123[m]) {
            leftPoints = p13;
            rightPoints = p123;
            leftColors = p13Colors;
            rightColors = p123Colors;
        }

        // 绘制水平线段，并进行颜色插值
        for (let y = y1; y <= y3; y++) {
            const idx = y - y1;
            const xStart = leftPoints[idx];
            const xEnd = rightPoints[idx];

            const leftColor = leftColors[idx];
            const rightColor = rightColors[idx];

            // 预计算颜色差值
            const rDiff = rightColor.r - leftColor.r;
            const gDiff = rightColor.g - leftColor.g; 
            const bDiff = rightColor.b - leftColor.b;
            const aDiff = rightColor.a - leftColor.a;

            // 步长和颜色增量
            const invLength = 1 / ((xEnd - xStart) + 1);
            const rStep = rDiff * invLength;
            const gStep = gDiff * invLength;
            const bStep = bDiff * invLength;
            const aStep = aDiff * invLength;

            // 初始颜色值
            let r = leftColor.r;
            let g = leftColor.g;
            let b = leftColor.b;
            let a = leftColor.a;

            // 水平方向颜色插值
            for (let x = xStart; x <= xEnd; x++) {
                const finalColor = ((a|0) << 24) | ((b|0) << 16) | ((g|0) << 8) | (r|0);
                this.DrawPixel(x, y, finalColor);
                
                // 累加颜色值
                r += rStep;
                g += gStep;
                b += bStep;
                a += aStep;
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