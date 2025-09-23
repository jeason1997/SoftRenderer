import { Camera } from "../Component/Camera";
import { Light, LightType } from "../Component/Light";
import { EngineConfig } from "../Core/Setting";
import { Transform } from "../Core/Transform";
import { Quaternion } from "./Quaternion";
import { Ray } from "./Ray";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class TransformTools {

    /**
     * 将裁剪空间坐标转换为标准化设备坐标(NDC)
     * @param clipPos 裁剪空间坐标，包含x, y, z, w四个分量
     * @returns 标准化设备坐标(NDC)，三个分量范围均为[-1, 1]
     */
    public static ClipToNdcPos(clipPos: Vector4): Vector3 {
        // 获取裁剪坐标的w分量，用于透视除法
        const w = clipPos.w;

        // 避免除以0（理论上w=0的点在无穷远处，实际中通常返回原点）
        if (w === 0) {
            return Vector3.ZERO;
        }

        // 执行透视除法：裁剪空间坐标各分量除以w分量，得到NDC
        // 透视投影中，w分量与深度相关，除法会产生近大远小的透视效果
        const ndcX = clipPos.x / w;
        const ndcY = clipPos.y / w;
        const ndcZ = clipPos.z / w;

        // 返回NDC坐标，三个分量均应落在[-1, 1]范围内（超出此范围的点会被裁剪）
        return new Vector3(ndcX, ndcY, ndcZ);
    }

    /**
     * 将NDC坐标转换为视口坐标
     * @param ndcPos 标准化设备坐标(NDC)，范围为X:[-1,1], Y:[-1,1], Z:[-1,1]
     * @param viewport 视口参数，格式为[x, y, width, height]，其中(x,y)是视口左上角在屏幕上的坐标
     * @returns 视口空间中的二维坐标
     */
    public static NdcToViewportPos(ndcPos: Vector3, viewport: Vector4): Vector2 {
        const startX = viewport.x;    // 视口左上角X坐标
        const startY = viewport.y;    // 视口左上角Y坐标
        const width = viewport.z;     // 视口宽度
        const height = viewport.w;    // 视口高度

        // NDC坐标范围是[-1,1]，先转换为[0,1]范围的相对坐标
        // 公式：[0,1] = (NDC + 1) / 2
        const normalizedX = (ndcPos.x + 1) * 0.5;
        const normalizedY = (ndcPos.y + 1) * 0.5;

        // 转换为视口坐标：
        // X轴：视口起始X + 相对X * 视口宽度
        // Y轴：由于屏幕坐标系Y轴向下（与NDC的Y轴方向相反），需要用1减去相对Y值后再计算
        const viewPortX = startX + normalizedX * width;
        const viewPortY = startY + (1 - normalizedY) * height;

        return new Vector2(viewPortX, viewPortY);
    }

    public static ViewportToScreenPos(vp: Vector2): Vector2 {
        const screenX = vp.x * EngineConfig.canvasWidth;
        const screenY = vp.y * EngineConfig.canvasHeight;
        return new Vector2(screenX, screenY);
    }

    public static WorldToClipPos(pos: Vector3, camera: Camera): Vector4 {
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const clipPos = vpMatrix.multiplyVector4(new Vector4(pos, 1));
        return clipPos;
    }

    // 世界坐标转为屏幕坐标
    public static WorldToScreenPos(pos: Vector3, camera: Camera): { screen: Vector2; depth: number } {
        const clipPos = this.WorldToClipPos(pos, camera);
        const ndc = this.ClipToNdcPos(clipPos);
        const vp = this.NdcToViewportPos(ndc, camera.viewPort);
        const screen = this.ViewportToScreenPos(vp);

        // 深度值：将NDC的z从[-1, 1]映射到[0, 1]的范围，常用于深度缓冲
        const depth = (ndc.z + 1) / 2;

        return { screen, depth };
    }

    // 世界坐标到视口坐标
    public static WorldToViewportPos(worldPos: Vector3, camera: Camera): Vector2 {
        const clipPos = this.WorldToClipPos(worldPos, camera);
        const ndc = this.ClipToNdcPos(clipPos);
        const vp = this.NdcToViewportPos(ndc, camera.viewPort);
        return vp;
    }

    // 视口坐标转换
    public static ScreenToViewportPos(screenPos: Vector2): Vector2 {
        return new Vector2(
            screenPos.x / EngineConfig.canvasWidth,
            screenPos.y / EngineConfig.canvasHeight
        );
    }

    // 屏幕坐标转为世界坐标
    public static ScreenToWorldPos(screenPos: Vector2, camera: Camera, depth: number = 1.0): Vector3 {
        // 1. 将屏幕坐标转换为NDC坐标（-1到1范围）
        const ndcX = (screenPos.x / EngineConfig.canvasWidth) * 2 - 1;
        const ndcY = 1 - (screenPos.y / EngineConfig.canvasHeight) * 2; // Y轴需要翻转

        // 2. 创建齐次裁剪空间坐标
        const clipPos = new Vector4(ndcX, ndcY, depth, 1.0);

        // 3. 获取视图投影矩阵的逆矩阵
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const inverseVPMatrix = vpMatrix.invert();

        // 4. 将裁剪空间坐标转换到世界空间
        const worldPos = inverseVPMatrix.multiplyVector4(clipPos);

        // 5. 进行透视除法（齐次坐标归一化）
        const w = worldPos.w;
        if (w !== 0) {
            return new Vector3(
                worldPos.x / w,
                worldPos.y / w,
                worldPos.z / w
            );
        }

        return new Vector3(worldPos.x, worldPos.y, worldPos.z);
    }

    // 使用射线法进行精确的屏幕到世界坐标转换（推荐用于3D拾取）
    public static ScreenToWorldPosRaycast(screenPos: Vector2, camera: Camera): Ray {
        // 1. 将屏幕坐标转换为NDC坐标
        const ndcX = (screenPos.x / EngineConfig.canvasWidth) * 2 - 1;
        const ndcY = 1 - (screenPos.y / EngineConfig.canvasHeight) * 2;

        // 2. 创建近平面和远平面的点
        const nearPoint = new Vector4(ndcX, ndcY, -1, 1);
        const farPoint = new Vector4(ndcX, ndcY, 1, 1);

        // 3. 获取视图投影矩阵的逆矩阵
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const inverseVPMatrix = vpMatrix.invert();

        // 4. 转换到世界空间
        const worldNear = inverseVPMatrix.multiplyVector4(nearPoint);
        const worldFar = inverseVPMatrix.multiplyVector4(farPoint);

        // 5. 进行透视除法
        const nearWorld = new Vector3(
            worldNear.x / worldNear.w,
            worldNear.y / worldNear.w,
            worldNear.z / worldNear.w
        );

        const farWorld = new Vector3(
            worldFar.x / worldFar.w,
            worldFar.y / worldFar.w,
            worldFar.z / worldFar.w
        );

        // 6. 创建射线
        const rayDirection = farWorld.subtract(nearWorld).normalize();
        const rayOrigin = nearWorld;

        return new Ray(rayOrigin, rayDirection);
    }

    // 模型坐标转为裁剪坐标
    public static ModelToClipPos(vertex: Vector3, transform: Transform, camera: Camera): Vector4 {
        // 对顶点应用 MVP 矩阵（Model→View→Projection 矩阵的组合），计算过程为：
        // 裁剪空间坐标 = projectionMatrix × viewMatrix × modelMatrix × 模型空间顶点
        const modelMatrix = transform.localToWorldMatrix;
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const mvpMatrix = projectionMatrix.multiply(viewMatrix).multiply(modelMatrix);

        // 另一种构建mv矩阵的方式
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        // const cameraForward = camera.transform.forward;
        // const cameraUp = camera.transform.up;
        // const modelViewMatrix = modelMatrix.clone().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        // const mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);

        // 要把Vec3转为齐次坐标点，即w=1
        return mvpMatrix.multiplyVector4(new Vector4(vertex, 1));
    }

    // 模型坐标转为屏幕坐标
    public static ModelToScreenPos(vertex: Vector3, transform: Transform, camera: Camera): { screen: Vector2; depth: number } {
        const clipPos = this.ModelToClipPos(vertex, transform, camera);
        const ndc = this.ClipToNdcPos(clipPos);
        const vp = this.NdcToViewportPos(ndc, camera.viewPort);
        const screen = this.ViewportToScreenPos(vp);
        const depth = (ndc.z + 1) / 2;
        return { screen, depth };
    }

    public static ClipToScreenPos(clipPos: Vector4, camera: Camera): Vector3 {
        const ndc = this.ClipToNdcPos(clipPos);
        const vp = this.NdcToViewportPos(ndc, camera.viewPort);
        const screen = this.ViewportToScreenPos(vp);
        const depth = (ndc.z + 1) / 2;
        return new Vector3(screen.x, screen.y, depth);
    }

    // 模型法线转为世界法线
    public static ModelToWorldNormal(normal: Vector3, transform: Transform): Vector3 {
        // 获取模型矩阵（局部到世界空间的变换矩阵）
        const modelMatrix = transform.localToWorldMatrix;

        // 计算模型矩阵的逆转置矩阵
        // 逆转置矩阵可以确保法线在非均匀缩放时仍然保持与表面垂直
        const inverseTransposeModel = modelMatrix.invert().transpose();

        // 使用逆转置矩阵变换法线向量（忽略平移分量，只应用旋转和缩放的逆变换）
        const worldNormal = inverseTransposeModel.multiplyVector3(normal);

        // 归一化结果，确保法线保持单位长度
        return worldNormal.normalize();
    }

    /**
     * 计算模型空间中从顶点指向光源的方向向量
     * @param v 模型空间中的顶点坐标
     * @returns 归一化的方向向量（模型空间）
     */
    public static ObjSpaceLightDir(v: Vector3, light: Light, transform: Transform): Vector3 {
        let lightDir: Vector3;

        if (light.type === LightType.Directional) {
            // 方向光：直接将世界空间的光线方向转换到模型空间（方向向量用矩阵乘法，忽略平移）
            lightDir = transform.worldToLocalMatrix.multiplyVector3(light.transform.forward);
        } else {
            // 点光源/聚光灯：计算顶点到光源的向量（模型空间）
            // 1. 将世界空间的光源位置转换到模型空间
            const lightPosObj = transform.worldToLocalMatrix.multiplyVector4(new Vector4(light.transform.worldPosition, 1));
            // 2. 模型空间中，从顶点指向光源的向量 = 光源位置 - 顶点位置
            lightDir = (new Vector3(lightPosObj)).subtract(v);
        }

        // 归一化并返回
        return lightDir.normalize();
    }

    /**
     * 计算模型空间中从顶点指向摄像机的方向向量
     * @param v 模型空间中的顶点坐标
     * @returns 归一化的方向向量（模型空间）
     */
    public static ObjSpaceViewDir(v: Vector3, camera: Camera, transform: Transform): Vector3 {
        // 1. 将世界空间的摄像机位置转换到模型空间
        const cameraPosObj = transform.worldToLocalMatrix.multiplyVector4(new Vector4(camera.transform.worldPosition, 1));

        // 2. 模型空间中，从顶点指向摄像机的向量 = 摄像机位置 - 顶点位置
        const viewDir = (new Vector3(cameraPosObj)).subtract(v);

        // 归一化并返回
        return viewDir.normalize();
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