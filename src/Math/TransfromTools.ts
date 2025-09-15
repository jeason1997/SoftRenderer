import { Camera } from "../Component/Camera";
import { EngineConfig } from "../Core/Engine";
import { Transform } from "../Core/Transform";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class TransfromTools {

    public static WorldToScreenPos(pos: Vector3): { x: number, y: number } {
        const camera = Camera.mainCamera;
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const clipPos = vpMatrix.multiplyVector4(new Vector4(pos.x, pos.y, pos.z, 1));

        const w = clipPos.w;
        const ndcX = clipPos.x / w;
        const ndcY = clipPos.y / w;

        const screenX = ((ndcX + 1) / 2) * EngineConfig.canvasWidth;
        const screenY = ((1 - ndcY) / 2) * EngineConfig.canvasHeight;

        return { x: screenX, y: screenY };
    }

    public static LocalToScreenPos(pos: Vector3, transform: Transform): { x: number, y: number } {
        const modelMatrix = transform.localToWorldMatrix;
        const camera = Camera.mainCamera;
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const mvpMatrix = projectionMatrix.multiply(viewMatrix).multiply(modelMatrix);
        const clipPos = mvpMatrix.multiplyVector4(new Vector4(pos.x, pos.y, pos.z, 1));

        const w = clipPos.w;
        const ndcX = clipPos.x / w;
        const ndcY = clipPos.y / w;

        const screenX = ((ndcX + 1) / 2) * EngineConfig.canvasWidth;
        const screenY = ((1 - ndcY) / 2) * EngineConfig.canvasHeight;

        return { x: screenX, y: screenY };
    }

    // 将视口上的内容映射到实际屏幕上
    public static ViewportToCanvas(point: Vector2) {
        // 假设视口宽度为1个单位
        // 因为aspectRatio = canvasWidth / canvasHeight，
        // 所以视口高度 = 1 / aspectRatio = canvasHeight / canvasWidth
        const viewportWidth = 1;
        const viewportHeight = 1 / EngineConfig.aspectRatio;

        // 将投影坐标映射到Canvas像素坐标
        // X坐标：从 [-viewportWidth/2, viewportWidth/2] 映射到 [0, canvasWidth]
        // Y坐标：从 [-viewportHeight/2, viewportHeight/2] 映射到 [0, canvasHeight] (注意Y轴方向)
        const canvasX = ((point.x + viewportWidth / 2) / viewportWidth) * EngineConfig.canvasWidth;
        const canvasY = EngineConfig.canvasHeight - (((point.y + viewportHeight / 2) / viewportHeight) * EngineConfig.canvasHeight); // Canvas的Y轴通常是向下的
        point.x = canvasX;
        point.y = canvasY;
    }

    // 透视投影，将3D场景的坐标转换为2D屏幕坐标，投射到视口上
    public static ProjectVertex(vertex: Vector3): Vector2 {
        // 假设视点到近裁面（视口）的距离是d，视口的宽是1
        // 根据三角函数有：tan(fov/2) = (0.5 / d)
        // 所以：d = 0.5 / tan(fov/2)
        const fovDegrees = 60;
        const fovRadians = fovDegrees * (Math.PI / 180); // 将角度转换为弧度
        const d = 0.5 / Math.tan(fovRadians / 2);

        // 透视公式，假设视点位置(0,0)，视点到视口距离为d，场景里的点为P(x,y,z)，投射到视口上的点为P'(x,y)
        // 则根据相似三角形有：z / d = x / x' = y / y'，可得到：
        // x' = (d * x) / z
        // y' = (d * y) / z
        const projectionX = (d * vertex.x) / vertex.z;
        const projectionY = (d * vertex.y) / vertex.z;

        return new Vector2(projectionX, projectionY);
    }

    // 将模型空间坐标转换为裁剪空间坐标（Clip Space）
    public static ObjectToClipPos(vertex: Vector3, transform: Transform): Vector4 {
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
        return mvpMatrix.multiplyVector4(new Vector4(vertex, 1));
    }

    // 将裁剪空间坐标最终转换为屏幕空间坐标（Screen Space）
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

        // z分量通常用于深度测试
        const screenZ = (ndcZ + 1) / 2;

        return new Vector3(screenX, screenY, screenZ);
    }

    public static ObjectToScreenPos(vertex: Vector3, transform: Transform): Vector3 {
        const clipPos = this.ObjectToClipPos(vertex, transform);
        return this.ClipToScreenPos(clipPos);
    }

    public static ObjectToWorldNormal(normal: Vector3, transform: Transform): Vector3 {
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
}