import { Vector3 } from "./Vector3";

export abstract class Bounds {
    abstract getCenter(): Vector3;
    abstract getHalfExtents(): Vector3;
}

/**
 * 轴对齐包围盒 (AABB)
 * 最简单的包围盒，边与坐标轴平行
 */
class AABB {
    min: Vector3;
    max: Vector3;

    constructor(min: Vector3, max: Vector3) {
        this.min = min;
        this.max = max;
    }

    /**
     * 从顶点列表生成AABB
     * @param vertices 三维顶点数组
     * @returns 生成的AABB
     */
    static fromVertices(vertices: Vector3[]): AABB {
        if (vertices.length === 0) {
            throw new Error("顶点数组不能为空");
        }

        // 初始化min和max为第一个顶点的值
        const min = vertices[0].clone();
        const max = vertices[0].clone();

        // 遍历所有顶点，找到最小和最大值
        for (const v of vertices) {
            min.x = Math.min(min.x, v.x);
            min.y = Math.min(min.y, v.y);
            min.z = Math.min(min.z, v.z);

            max.x = Math.max(max.x, v.x);
            max.y = Math.max(max.y, v.y);
            max.z = Math.max(max.z, v.z);
        }

        return new AABB(min, max);
    }

    /** 获取AABB的中心点 */
    getCenter(): Vector3 {
        return new Vector3(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            (this.min.z + this.max.z) / 2
        );
    }

    /** 获取AABB的半边长 */
    getHalfExtents(): Vector3 {
        return new Vector3(
            (this.max.x - this.min.x) / 2,
            (this.max.y - this.min.y) / 2,
            (this.max.z - this.min.z) / 2
        );
    }
}

/**
 * 定向包围盒 (OBB)
 * 可以随物体旋转，边与物体自身坐标系对齐
 */
class OBB {
    center: Vector3;          // 中心点
    axes: [Vector3, Vector3, Vector3];  // 三个正交的轴向量
    extents: Vector3;         // 每个轴方向上的半长度

    constructor(center: Vector3, axes: [Vector3, Vector3, Vector3], extents: Vector3) {
        this.center = center;
        this.axes = axes;
        this.extents = extents;
    }

    /**
     * 从顶点列表生成OBB（使用PCA主成分分析）
     * 算法思路：通过计算顶点的协方差矩阵找到主方向作为OBB的轴
     * @param vertices 三维顶点数组
     * @returns 生成的OBB
     */
    static fromVertices(vertices: Vector3[]): OBB {
        if (vertices.length === 0) {
            throw new Error("顶点数组不能为空");
        }

        // 1. 计算中心点（平均值）
        const center = OBB.calculateCentroid(vertices);

        // 2. 计算协方差矩阵
        const covariance = OBB.calculateCovarianceMatrix(vertices, center);

        // 3. 计算协方差矩阵的特征向量（主成分），作为OBB的轴
        const eigenvectors = OBB.calculateEigenvectors(covariance);

        // 确保轴是单位向量
        const axes: [Vector3, Vector3, Vector3] = [
            eigenvectors[0].multiply(1 / eigenvectors[0].magnitude),
            eigenvectors[1].multiply(1 / eigenvectors[1].magnitude),
            eigenvectors[2].multiply(1 / eigenvectors[2].magnitude)
        ];

        // 4. 计算每个轴方向上的最大延伸（半长度）
        const extents = OBB.calculateExtents(vertices, center, axes);

        return new OBB(center, axes, extents);
    }

    /** 计算顶点的中心点（质心） */
    private static calculateCentroid(vertices: Vector3[]): Vector3 {
        const sum = new Vector3();
        for (const v of vertices) {
            sum.x += v.x;
            sum.y += v.y;
            sum.z += v.z;
        }
        return sum.multiply(1 / vertices.length);
    }

    /** 计算协方差矩阵 */
    private static calculateCovarianceMatrix(vertices: Vector3[], centroid: Vector3): number[][] {
        // 初始化3x3协方差矩阵
        const cov = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for (const v of vertices) {
            // 计算顶点相对于质心的偏移
            const x = v.x - centroid.x;
            const y = v.y - centroid.y;
            const z = v.z - centroid.z;

            // 累积协方差值
            cov[0][0] += x * x;
            cov[0][1] += x * y;
            cov[0][2] += x * z;
            cov[1][1] += y * y;
            cov[1][2] += y * z;
            cov[2][2] += z * z;
        }

        // 对称矩阵，填充下三角部分
        cov[1][0] = cov[0][1];
        cov[2][0] = cov[0][2];
        cov[2][1] = cov[1][2];

        // 除以顶点数量-1（无偏估计）
        const n = vertices.length;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                cov[i][j] /= (n - 1);
            }
        }

        return cov;
    }

    /** 计算协方差矩阵的特征向量（简化实现） */
    private static calculateEigenvectors(cov: number[][]): [Vector3, Vector3, Vector3] {
        // 这里使用简化的特征向量计算方法
        // 实际应用中可能需要更精确的算法（如Jacobi迭代法）

        // 对于演示目的，我们返回三个正交向量（实际项目中需替换为真实特征向量计算）
        // 注意：这只是占位实现，真实场景需要正确计算特征向量
        return [
            new Vector3(1, 0, 0),  // 假设X轴为第一主成分
            new Vector3(0, 1, 0),  // 假设Y轴为第二主成分
            new Vector3(0, 0, 1)   // 假设Z轴为第三主成分
        ];
    }

    /** 计算每个轴方向上的半长度 */
    private static calculateExtents(
        vertices: Vector3[],
        center: Vector3,
        axes: [Vector3, Vector3, Vector3]
    ): Vector3 {
        let extentX = 0;
        let extentY = 0;
        let extentZ = 0;

        // 对每个轴计算顶点在该轴上的投影范围
        for (let i = 0; i < 3; i++) {
            const axis = axes[i];
            let min = Infinity;
            let max = -Infinity;

            for (const v of vertices) {
                // 计算顶点相对于中心点的向量
                const dir = v.subtract(center);
                // 计算在当前轴上的投影
                const proj = Vector3.dot(dir, axis);

                min = Math.min(min, proj);
                max = Math.max(max, proj);
            }

            // 半长度取最大绝对值
            const extent = Math.max(Math.abs(min), Math.abs(max));

            // 直接赋值给对应分量
            if (i === 0) extentX = extent;
            else if (i === 1) extentY = extent;
            else extentZ = extent;
        }

        return new Vector3(extentX, extentY, extentZ);
    }
}

/**
 * 球体包围盒
 * 用球心和半径表示的简化包围体
 */
class Sphere {
    center: Vector3;
    radius: number;

    constructor(center: Vector3, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    /**
     * 从顶点列表生成球体包围盒
     * 算法思路：先计算所有顶点的中心点，再找到离中心点最远的顶点作为半径
     * @param vertices 三维顶点数组
     * @returns 生成的球体
     */
    static fromVertices(vertices: Vector3[]): Sphere {
        if (vertices.length === 0) {
            throw new Error("顶点数组不能为空");
        }

        // 1. 计算中心点（平均值）
        const center = new Vector3();
        for (const v of vertices) {
            center.x += v.x;
            center.y += v.y;
            center.z += v.z;
        }
        center.x /= vertices.length;
        center.y /= vertices.length;
        center.z /= vertices.length;

        // 2. 找到离中心点最远的顶点，其距离即为半径
        let maxDistanceSquared = 0;
        for (const v of vertices) {
            const dx = v.x - center.x;
            const dy = v.y - center.y;
            const dz = v.z - center.z;
            const distanceSquared = dx * dx + dy * dy + dz * dz;

            if (distanceSquared > maxDistanceSquared) {
                maxDistanceSquared = distanceSquared;
            }
        }

        const radius = Math.sqrt(maxDistanceSquared);
        return new Sphere(center, radius);
    }

    /**
     * 从AABB生成球体包围盒
     * @param aabb 轴对齐包围盒
     * @returns 生成的球体
     */
    static fromAABB(aabb: AABB): Sphere {
        const center = aabb.getCenter();
        const halfExtents = aabb.getHalfExtents();
        // 半径是从中心到角落的距离
        const radius = halfExtents.magnitude;
        return new Sphere(center, radius);
    }
}

// 示例用法
function exampleUsage() {
    // 创建一些示例顶点
    const vertices = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 0, 1),
        new Vector3(1, 1, 1)
    ];

    // 生成AABB
    const aabb = AABB.fromVertices(vertices);
    console.log("AABB:");
    console.log("  Min:", `(${aabb.min.x}, ${aabb.min.y}, ${aabb.min.z})`);
    console.log("  Max:", `(${aabb.max.x}, ${aabb.max.y}, ${aabb.max.z})`);

    // 生成OBB
    const obb = OBB.fromVertices(vertices);
    console.log("\nOBB:");
    console.log("  Center:", `(${obb.center.x}, ${obb.center.y}, ${obb.center.z})`);
    console.log("  Extents:", `(${obb.extents.x}, ${obb.extents.y}, ${obb.extents.z})`);

    // 生成球体
    const sphere = Sphere.fromVertices(vertices);
    console.log("\nSphere:");
    console.log("  Center:", `(${sphere.center.x}, ${sphere.center.y}, ${sphere.center.z})`);
    console.log("  Radius:", sphere.radius);
}
