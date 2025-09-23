import { Vector3 } from "../Math/Vector3";
import { Color } from "../Math/Color";
import { Texture } from "./Texture";
import { UObject } from "../Core/UObject";

export class CubeMap extends UObject {
    private POSITIVE_X: Texture;
    private NEGATIVE_X: Texture;
    private POSITIVE_Y: Texture;
    private NEGATIVE_Y: Texture;
    private POSITIVE_Z: Texture;
    private NEGATIVE_Z: Texture;

    /**
     * 构造立方体纹理
     * @param positiveX 正X方向纹理
     * @param negativeX 负X方向纹理
     * @param positiveY 正Y方向纹理
     * @param negativeY 负Y方向纹理
     * @param positiveZ 正Z方向纹理
     * @param negativeZ 负Z方向纹理
     */
    constructor(
        positiveX: Texture,
        negativeX: Texture,
        positiveY: Texture,
        negativeY: Texture,
        positiveZ: Texture,
        negativeZ: Texture
    ) {
        super();
        this.POSITIVE_X = positiveX;
        this.NEGATIVE_X = negativeX;
        this.POSITIVE_Y = positiveY;
        this.NEGATIVE_Y = negativeY;
        this.POSITIVE_Z = positiveZ;
        this.NEGATIVE_Z = negativeZ;
    }

    /**
     * 根据方向向量采样立方体贴图
     * @param direction 归一化的方向向量
     * @returns 采样得到的颜色
     */
    public SampleCube(direction: Vector3): Color {
        // 确保方向向量已归一化
        const dir = direction.normalize();
        const x = dir.x;
        const y = dir.y;
        const z = dir.z;

        // 找到绝对值最大的分量，确定要采样的面
        const absX = Math.abs(x);
        const absY = Math.abs(y);
        const absZ = Math.abs(z);

        // 计算各面的UV坐标并采样
        if (absX >= absY && absX >= absZ) {
            // X方向为主方向（左右面）
            const u = 0.5 - z / (2 * absX);
            const v = 0.5 - y / (2 * absX);
            return x > 0 ? this.POSITIVE_X.Sample(u, v) : this.NEGATIVE_X.Sample(1 - u, v);
        } else if (absY >= absX && absY >= absZ) {
            // Y方向为主方向（上下底面）
            const u = 0.5 + x / (2 * absY);
            const v = 0.5 + z / (2 * absY);
            return y > 0 ? this.POSITIVE_Y.Sample(u, v) : this.NEGATIVE_Y.Sample(1 - u, v);
        } else {
            // Z方向为主方向（前后两面）
            const u = 0.5 + x / (2 * absZ);
            const v = 0.5 - y / (2 * absZ);
            return z > 0 ? this.POSITIVE_Z.Sample(u, v) : this.NEGATIVE_Z.Sample(1 -u, v);
        }
    }

    /**
     * 销毁立方体贴图资源
     */
    public onDestroy(): void {
        UObject.Destroy(this.POSITIVE_X);
        UObject.Destroy(this.NEGATIVE_X);
        UObject.Destroy(this.POSITIVE_Y);
        UObject.Destroy(this.NEGATIVE_Y);
        UObject.Destroy(this.POSITIVE_Z);
        UObject.Destroy(this.NEGATIVE_Z);
    }
}
