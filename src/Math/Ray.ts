import { Vector3 } from "./Vector3"; // 假设的向量类

export class Ray {
    public origin: Vector3;
    public direction: Vector3;

    /**
     * 构造一条射线
     * @param origin 射线起点
     * @param direction 射线方向（通常应是归一化的单位向量）
     */
    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin.clone(); // 使用克隆避免引用问题
        this.direction = direction.clone().normalize(); // 确保方向是单位向量
    }

    /**
     * 获取射线上某一点的位置
     * @param t 沿射线方向的参数距离
     * @returns 射线上对应点的Vector3坐标
     */
    public at(t: number): Vector3 {
        // 公式: point = origin + t * direction
        return Vector3.add(this.origin, Vector3.multiplyScalar(this.direction, t));
    }

    /**
     * 克隆当前射线
     * @returns 一条新的Ray实例
     */
    public clone(): Ray {
        return new Ray(this.origin.clone(), this.direction.clone());
    }
}