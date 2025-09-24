import { Color } from '../Math/Color';
import { Vector3 } from '../Math/Vector3';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { TransformTools } from '../Math/TransformTools';
import { Camera } from '../Component/Camera';
import { Engine } from '../Core/Engine';

/**
 * Gizmo工具类，用于绘制各种调试图形
 * 参考Unity的Gizmo系统实现
 */
export class Gizmo {
    // 当前绘制颜色
    private static _color: Color = Color.WHITE;

    // 当前矩阵变换
    private static _matrix: Matrix4x4 = Matrix4x4.identity;

    /**
     * 设置当前绘制颜色
     */
    public static set color(color: Color) {
        this._color = color;
    }

    /**
     * 获取当前绘制颜色
     */
    public static get color(): Color {
        return this._color;
    }

    /**
     * 设置当前变换矩阵
     */
    public static set matrix(matrix: Matrix4x4) {
        this._matrix = matrix;
    }

    /**
     * 获取当前变换矩阵
     */
    public static get matrix(): Matrix4x4 {
        return this._matrix;
    }

    public static Reset(): void {
        this._color = Color.WHITE;
        this._matrix = Matrix4x4.identity;
    }

    /**
     * 绘制一条从start到end的线
     */
    public static DrawLine(start: Vector3, end: Vector3): void {
        const a = TransformTools.ModelToScreenPos(start, this._matrix, Camera.mainCamera).screen;
        const b = TransformTools.ModelToScreenPos(end, this._matrix, Camera.mainCamera).screen;
        Engine.pipeline.DrawLine(a.x, a.y, b.x, b.y, this._color);
    }

    /**
     * 绘制一条从position开始，沿direction方向的射线
     */
    public static DrawRay(position: Vector3, direction: Vector3): void {
        const end = Vector3.add(position, direction);
        this.DrawLine(position, end);
    }

    /**
     * 绘制一个立方体线框
     */
    public static DrawCube(center: Vector3, size: Vector3): void {
        // 计算立方体的8个顶点
        const halfSize = Vector3.multiplyScalar(size, 0.5);
        const vertices = [
            new Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
            new Vector3(halfSize.x, -halfSize.y, -halfSize.z),
            new Vector3(halfSize.x, halfSize.y, -halfSize.z),
            new Vector3(-halfSize.x, halfSize.y, -halfSize.z),
            new Vector3(-halfSize.x, -halfSize.y, halfSize.z),
            new Vector3(halfSize.x, -halfSize.y, halfSize.z),
            new Vector3(halfSize.x, halfSize.y, halfSize.z),
            new Vector3(-halfSize.x, halfSize.y, halfSize.z)
        ];

        // 定义立方体的12条边
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],  // 前面
            [4, 5], [5, 6], [6, 7], [7, 4],  // 后面
            [0, 4], [1, 5], [2, 6], [3, 7]   // 连接线
        ];

        // 应用变换并绘制所有边
        for (const [i1, i2] of edges) {
            const p1 = Vector3.add(center, vertices[i1]);
            const p2 = Vector3.add(center, vertices[i2]);
            this.DrawLine(p1, p2);
        }
    }

    /**
     * 绘制一个坐标轴
     */
    public static DrawAxis(position: Vector3, size: number = 1.0): void {
        // X轴 (红色)
        const originalColor = this._color;
        this._color = Color.RED;
        const xEnd = Vector3.add(position, new Vector3(size, 0, 0));
        this.DrawLine(position, xEnd);

        // Y轴 (绿色)
        this._color = Color.GREEN;
        const yEnd = Vector3.add(position, new Vector3(0, size, 0));
        this.DrawLine(position, yEnd);

        // Z轴 (蓝色)
        this._color = Color.BLUE;
        const zEnd = Vector3.add(position, new Vector3(0, 0, size));
        this.DrawLine(position, zEnd);

        // 恢复原始颜色
        this._color = originalColor;
    }
}