import { Vector3 } from "./Vector3";

/*
    平面方程推导：
    平面方程 ax + by + cz + d = 0 的推导可以通过 “法向量与平面垂直” 的核心性质来完成，步骤如下：

    1. 设定已知条件
    - 设平面上任意一点为 P(x, y, z)
    - 设平面的法向量为 n = (a, b, c)（垂直于平面的向量）
    - 设平面上一个固定点为 P₀(x₀, y₀, z₀)

    2. 利用向量垂直的性质
    平面上的向量 P₀P = (x - x₀, y - y₀, z - z₀) 与法向量 n 垂直，因此它们的点积为 0：n · P₀P = 0

    3. 展开点积并整理
    代入点积公式：a(x - x₀) + b(y - y₀) + c(z - z₀) = 0

    展开后：ax + by + cz - (ax₀ + by₀ + cz₀) = 0

    4. 定义常数 d
    令 d = - (ax₀ + by₀ + cz₀)（因 P₀ 是平面上的固定点，故 d 为常数），代入上式即得平面方程：ax + by + cz + d = 0


    平面到原点距离推导：
    要推导平面到原点的距离，可结合 d = -(ax₀ + by₀ + cz₀) 和向量投影的原理，步骤如下：

    1. 明确已知关系
    平面方程：ax + by + cz + d = 0
    平面上固定点 P₀(x₀, y₀, z₀) 满足：ax₀ + by₀ + cz₀ + d = 0，即 d = -(ax₀ + by₀ + cz₀)
    原点 O(0,0,0) 到平面的距离，等于向量 OP₀（从原点到平面上点 P₀ 的向量）在法向量 n = (a,b,c) 上的投影长度

    2. 计算向量投影长度
    向量 OP₀ = (x₀, y₀, z₀)，它在法向量 n 上的投影长度公式为：
    投影长度 = |OP₀ · n| / |n|
    分子：向量点积的绝对值 |OP₀ · n| = |ax₀ + by₀ + cz₀|
    分母：法向量的模长 |n| = √(a² + b² + c²)

    3. 代入 d 的表达式
    由 d = -(ax₀ + by₀ + cz₀)，可得 |ax₀ + by₀ + cz₀| = |-d| = |d|，代入投影长度公式：
    平面到原点的距离 = |d| / √(a² + b² + c²)
 */
export class Plane {
    /**
     * 平面方程：ax + by + cz + d = 0
     * 平面任意点：(x, y, z)
     * 平面法向量：(a, b, c)
     * 到原点的距离 = |d| ÷ √(a² + b² + c²)
     * @param a 平面法向量X分量
     * @param b 平面法向量Y分量
     * @param c 平面法向量Z分量
     * @param d 决定平面与 “坐标原点的距离”，d 的 正负 表示平面在 “法向量方向” 上相对于原点的位置
     */
    constructor(
        public a: number,
        public b: number,
        public c: number,
        public d: number
    ) { }

    /**
     * 归一化平面（确保法向量长度为1，保证距离计算精度）
     */
    public normalize(): void {
        const normalLength = Math.sqrt(this.a ** 2 + this.b ** 2 + this.c ** 2);
        if (normalLength < Number.EPSILON) return; // 避免除以0

        this.a /= normalLength;
        this.b /= normalLength;
        this.c /= normalLength;
        this.d /= normalLength;
    }

    /**
     * 计算点到平面的距离（用于视锥体剔除检测）
     * @param point 世界空间中的点
     * @returns 距离（正数：点在平面正面；负数：点在平面反面；0：点在平面上）
     */
    public distanceToPoint(point: Vector3): number {
        /*
            要推导空间中任意点到平面的距离公式，可基于 “向量投影” 的几何原理，结合平面方程的性质进行推导，步骤如下：

            已知条件
            平面方程：ax + by + cz + d = 0（法向量为 n = (a, b, c)）
            平面上任意一点：P₀(x₀, y₀, z₀)（满足平面方程：ax₀ + by₀ + cz₀ + d = 0）
            空间中任意一点：P(x, y, z)（求该点到平面的距离）

            推导核心：距离 = 向量在法向量上的投影长度
            任意点 P 到平面的距离，等于向量 P₀P 在平面法向量 n 上的投影长度（因法向量垂直于平面，此投影长度即为点到平面的最短距离）。

            向量 P₀P 的坐标：
            P₀P = (x - x₀, y - y₀, z - z₀)

            投影长度公式：
            向量在法向量上的投影长度 = |P₀P · n| / |n|
            （分子为向量点积的绝对值，分母为法向量的模长）

            代入计算并化简
            计算分子（点积的绝对值）：
            P₀P · n = a(x - x₀) + b(y - y₀) + c(z - z₀)
            展开后：
            = ax + by + cz - (ax₀ + by₀ + cz₀)
            由平面方程可知 ax₀ + by₀ + cz₀ = -d，代入得：
            P₀P · n = ax + by + cz + d
            取绝对值：|P₀P · n| = |ax + by + cz + d|

            计算分母（法向量的模长）：
            |n| = √(a² + b² + c²)

            合并得距离公式：
            点到平面的距离 = |ax + by + cz + d| / √(a² + b² + c²)
         */
        return this.a * point.x + this.b * point.y + this.c * point.z + this.d;
    }
}