import { Camera } from "../Component/Camera";
import { EngineConfig } from "../Core/Engine";
import { Transform } from "../Core/Transform";
import { Quaternion } from "./Quaternion";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class TransformTools {

    // 世界坐标转为屏幕坐标
    public static WorldToScreenPos(pos: Vector3): { x: number, y: number, z: number } {
        const camera = Camera.mainCamera;
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const clipPos = vpMatrix.multiplyVector4(new Vector4(pos, 1));

        const w = clipPos.w;
        const ndcX = clipPos.x / w;
        const ndcY = clipPos.y / w;
        const ndcZ = clipPos.z / w;

        const screenX = ((ndcX + 1) / 2) * EngineConfig.canvasWidth;
        const screenY = ((1 - ndcY) / 2) * EngineConfig.canvasHeight;
        const screenZ = (ndcZ + 1) / 2;

        return { x: screenX, y: screenY, z: screenZ };
    }

    // 模型坐标转为裁剪坐标
    public static ModelToClipPos(vertex: Vector3, transform: Transform): Vector4 {
        // 对顶点应用 MVP 矩阵（Model→View→Projection 矩阵的组合），计算过程为：
        // 裁剪空间坐标 = projectionMatrix × viewMatrix × modelMatrix × 模型空间顶点
        const modelMatrix = transform.localToWorldMatrix;
        const camera = Camera.mainCamera;
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const mvpMatrix = projectionMatrix.multiply(viewMatrix).multiply(modelMatrix);
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        // const cameraForward = camera.transform.forward;
        // const cameraUp = camera.transform.up;
        // const modelViewMatrix = modelMatrix.clone().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        // const mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);

        // 要把Vec3转为齐次坐标点，即w=1
        return mvpMatrix.multiplyVector4(new Vector4(vertex, 1));
    }

    // 裁剪坐标转为屏幕坐标
    public static ClipToScreenPos(vertex: Vector4): Vector3 {
        // 执行透视除法：(x/w, y/w, z/w)，得到归一化设备坐标（NDC，范围 [-1, 1]）。
        const w = vertex.w;
        const ndcX = vertex.x / w;
        const ndcY = vertex.y / w;
        const ndcZ = vertex.z / w;

        // 经过透视除法后，坐标位于标准设备坐标（NDC）空间，通常x, y, z范围在[-1, 1]（OpenGL风格）或[0, 1]（DirectX风格）之间。
        // 将 NDC 转换为屏幕像素坐标：
        // X 轴：screenX = (xNDC + 1) * 屏幕宽度 / 2
        // Y 轴：screenY = (1 - yNDC) * 屏幕高度 / 2（注意 Y 轴翻转，因屏幕坐标系 Y 向下）

        // 将NDC的x从[-1, 1]映射到[0, screenWidth]
        const screenX = ((ndcX + 1) / 2) * EngineConfig.canvasWidth;
        // 将NDC的y从[-1, 1]映射到[0, screenHeight]。注意屏幕坐标通常y向下为正，而NDC的y向上为正，所以需要翻转
        const screenY = ((1 - ndcY) / 2) * EngineConfig.canvasHeight;

        // 方法1: 保留透视校正的深度（原逻辑）
        const screenZ = (ndcZ + 1) / 2;

        // 方法2: 转换为线性深度（与实际距离成正比）
        /*
            在透视投影中，NDC 的 z 值与实际深度（到相机的距离）是非线性关系：
            近处物体的 z 值变化非常快（精度高）
            远处物体的 z 值变化缓慢（精度低，容易出现深度冲突）
            这是因为透视投影矩阵会将深度值进行非线性压缩，导致远处的深度精度不足。
        */
        // const linearDepth = (2 * near * far) / (far + near - ndcZ * (far - near));
        // const screenZ = linearDepth / far; // 归一化到 [0, 1]

        return new Vector3(screenX, screenY, screenZ);
    }

    // 模型坐标转为屏幕坐标
    public static ModelToScreenPos(vertex: Vector3, transform: Transform): Vector3 {
        const clipPos = this.ModelToClipPos(vertex, transform);
        return this.ClipToScreenPos(clipPos);
    }

    // 模型法线转为世界法线
    public static ModelToWorldNormal(normal: Vector3, transform: Transform): Vector3 {
        // 获取模型矩阵（局部到世界空间的变换矩阵）
        const modelMatrix = transform.localToWorldMatrix;

        // 计算模型矩阵的逆转置矩阵
        // 逆转置矩阵可以确保法线在非均匀缩放时仍然保持与表面垂直
        const inverseTransposeModel = modelMatrix.clone().invert().transpose();

        // 使用逆转置矩阵变换法线向量（忽略平移分量，只应用旋转和缩放的逆变换）
        const worldNormal = inverseTransposeModel.multiplyVector3(normal);

        // 归一化结果，确保法线保持单位长度
        return worldNormal.normalize();
    }

    public static ApplyScaleToVertex(vertex: Vector3, transform: Transform) {
        vertex.x *= transform.scale.x;
        vertex.y *= transform.scale.y;
        vertex.z *= transform.scale.z;
    }

    public static ApplyRotationToVertex(vertex: Vector3, quaternion: Quaternion) {
        // 四元数旋转公式: v' = q * v * q⁻¹
        const qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;
        const x = vertex.x, y = vertex.y, z = vertex.z;

        // 计算 q * v
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // 计算 (q * v) * q⁻¹ (q⁻¹ 是 q的共轭)
        const rx = ix * qw + iw * (-qx) + iy * (-qz) - iz * (-qy);
        const ry = iy * qw + iw * (-qy) + iz * (-qx) - ix * (-qz);
        const rz = iz * qw + iw * (-qz) + ix * (-qy) - iy * (-qx);

        vertex.x = rx;
        vertex.y = ry;
        vertex.z = rz;
    }

    public static ApplyTranslationToVertex(vertex: Vector3, transform: Transform) {
        vertex.x += transform.position.x;
        vertex.y += transform.position.y;
        vertex.z += transform.position.z;
    }
}