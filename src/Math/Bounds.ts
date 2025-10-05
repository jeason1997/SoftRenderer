import { Vector3 } from "./Vector3";

/**
 * 轴对齐包围盒 (AABB)
 * 最简单的包围盒，边与坐标轴平行
 */
export class Bounds {
    public readonly min: Vector3;
    public readonly max: Vector3;
    public readonly center: Vector3;
    public readonly halfExtents: Vector3;
    // 定义8个顶点
    public readonly vertices: Vector3[];
    // 定义12条边的顶点索引对 (每个面4条边，共6个面，但共享边只画一次)
    public readonly edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // 后面
        [4, 5], [5, 6], [6, 7], [7, 4], // 前面
        [0, 4], [1, 5], [2, 6], [3, 7]  // 连接前后的边
    ];

    constructor(min: Vector3 = Vector3.ZERO, max: Vector3 = Vector3.ZERO) {
        this.min = min;
        this.max = max;

        // 计算中心点
        this.center = new Vector3();
        this.center.x = (this.min.x + this.max.x) / 2;
        this.center.y = (this.min.y + this.max.y) / 2;
        this.center.z = (this.min.z + this.max.z) / 2;

        // 计算半长（从中心到各边的距离）
        this.halfExtents = new Vector3();
        this.halfExtents.x = (this.max.x - this.min.x) / 2;
        this.halfExtents.y = (this.max.y - this.min.y) / 2;
        this.halfExtents.z = (this.max.z - this.min.z) / 2;

        // 计算8个顶点
        this.vertices = new Array<Vector3>(8);
        this.vertices[0] = new Vector3(this.min.x, this.min.y, this.min.z); // 左下后
        this.vertices[1] = new Vector3(this.max.x, this.min.y, this.min.z); // 右下后
        this.vertices[2] = new Vector3(this.max.x, this.max.y, this.min.z); // 右上后
        this.vertices[3] = new Vector3(this.min.x, this.max.y, this.min.z); // 左上后
        this.vertices[4] = new Vector3(this.min.x, this.min.y, this.max.z); // 左下前
        this.vertices[5] = new Vector3(this.max.x, this.min.y, this.max.z); // 右下前
        this.vertices[6] = new Vector3(this.max.x, this.max.y, this.max.z); // 右上前
        this.vertices[7] = new Vector3(this.min.x, this.max.y, this.max.z); // 左上前
    }

    /**
     * 射线与包围盒相交检测
     */
    public intersectsRay(rayOrigin: Vector3, rayDirection: Vector3, maxDistance: number): boolean {
        // 使用slab方法进行射线与AABB相交检测
        let tmin = 0;
        let tmax = maxDistance;

        for (let i = 0; i < 3; i++) {
            const invD = 1.0 / rayDirection.getComponent(i);
            let t0 = (this.min.getComponent(i) - rayOrigin.getComponent(i)) * invD;
            let t1 = (this.max.getComponent(i) - rayOrigin.getComponent(i)) * invD;

            if (invD < 0) {
                [t0, t1] = [t1, t0];
            }

            tmin = Math.max(tmin, t0);
            tmax = Math.min(tmax, t1);

            if (tmax <= tmin) {
                return false;
            }
        }

        return true;
    }

    /**
     * 计算射线与包围盒的相交距离
     */
    public rayIntersectDistance(rayOrigin: Vector3, rayDirection: Vector3): number {
        // 简化的相交距离计算
        const center = this.center;
        const toCenter = center.subtract(rayOrigin);
        return toCenter.dot(rayDirection);
    }

    // /**
    //  * 获取包围盒在指定方向上的极值顶点
    //  * @param bounds 包围盒
    //  * @param direction 方向向量
    //  * @param positive 是否获取正方向的极值顶点
    //  * @returns 极值顶点
    //  */
    // public getExtremeVertex(direction: Vector3, positive: boolean): Vector3 {
    //     // 创建一个新的顶点用于计算
    //     const vertex = new Vector3();
        
    //     // 对于每个轴，根据方向向量的分量符号选择min或max
    //     vertex.x = direction.x > 0 === positive ? this.max.x : this.min.x;
    //     vertex.y = direction.y > 0 === positive ? this.max.y : this.min.y;
    //     vertex.z = direction.z > 0 === positive ? this.max.z : this.min.z;
        
    //     return vertex;
    // }

    public static fromPoints(points: Vector3[]): Bounds {
        if (points.length === 0) return new Bounds();

        let min = new Vector3(points[0].x, points[0].y, points[0].z);
        let max = new Vector3(points[0].x, points[0].y, points[0].z);

        for (const p of points) {
            min.x = Math.min(min.x, p.x);
            min.y = Math.min(min.y, p.y);
            min.z = Math.min(min.z, p.z);

            max.x = Math.max(max.x, p.x);
            max.y = Math.max(max.y, p.y);
            max.z = Math.max(max.z, p.z);
        }

        // 假设Bounds有min和max属性
        const bounds = new Bounds(min, max);
        return bounds;
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
    static fromAABB(aabb: Bounds): Sphere {
        const center = aabb.center;
        const halfExtents = aabb.halfExtents;
        // 半径是从中心到角落的距离
        const radius = halfExtents.magnitude;
        return new Sphere(center, radius);
    }
}