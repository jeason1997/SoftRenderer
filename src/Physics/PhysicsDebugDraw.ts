import * as CANNON from 'cannon';
import { Color } from '../Utils/Color';
import { Camera } from '../Component/Camera';
import { Vector4 } from '../Math/Vector4';
import { EngineConfig } from '../Core/Engine';

export class PhysicsDebugDraw {
    // 存储绘图函数的引用
    private static drawLineFunc: Function;

    private static setColor(body: CANNON.Body) {
        let color: Color = Color.FromUint32(Color.GRAY);

        // 根据物体类型设置基础颜色
        if (body.type === CANNON.Body.DYNAMIC) {
            // 动态物体 - 红色系
            color = Color.FromUint32(Color.RED);
        } else if (body.type === CANNON.Body.STATIC) {
            // 静态物体 - 绿色系
            color = Color.FromUint32(Color.GREEN);
        } else if (body.type === CANNON.Body.KINEMATIC) {
            // 运动学物体 - 蓝色系
            color = Color.FromUint32(Color.BLUE);
        }

        // 根据睡眠状态调整颜色
        if (body.sleepState === CANNON.Body.AWAKE) {
            // 清醒状态 - 原色
        } else if (body.sleepState === CANNON.Body.SLEEPY) {
            // 困倦状态 - 半暗淡
            color.r *= 0.7;
            color.g *= 0.7;
            color.b *= 0.7;
        } else if (body.sleepState === CANNON.Body.SLEEPING) {
            // 睡眠状态 - 全暗淡
            color.r *= 0.4;
            color.g *= 0.4;
            color.b *= 0.4;
        }

        return color.ToUint32();
    }

    // 绘制单个刚体的所有碰撞形状
    private static drawRigidBody(body: CANNON.Body) {
        const color = this.setColor(body);

        body.shapes.forEach((shape, i) => {
            const offset = body.shapeOffsets[i];
            const orientation = body.shapeOrientations[i];

            // 根据形状类型绘制不同的调试线框
            if (shape instanceof CANNON.Box) {
                this.drawBox(body, shape, offset, orientation, color);
            } else if (shape instanceof CANNON.Sphere) {
                this.drawSphere(body, shape, offset, orientation, color);
            } else if (shape instanceof CANNON.Plane) {
                this.drawPlane(body, shape, offset, orientation, color);
            }
        });
    }

    // 绘制盒子形状
    private static drawBox(body: CANNON.Body, shape: CANNON.Box, offset: CANNON.Vec3, orientation: CANNON.Quaternion, color: number) {
        // 计算盒子的8个顶点
        const halfExtents = shape.halfExtents;
        const vertices = [
            new CANNON.Vec3(-halfExtents.x, -halfExtents.y, -halfExtents.z),
            new CANNON.Vec3(halfExtents.x, -halfExtents.y, -halfExtents.z),
            new CANNON.Vec3(halfExtents.x, halfExtents.y, -halfExtents.z),
            new CANNON.Vec3(-halfExtents.x, halfExtents.y, -halfExtents.z),
            new CANNON.Vec3(-halfExtents.x, -halfExtents.y, halfExtents.z),
            new CANNON.Vec3(halfExtents.x, -halfExtents.y, halfExtents.z),
            new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z),
            new CANNON.Vec3(-halfExtents.x, halfExtents.y, halfExtents.z),
        ];

        // 应用偏移和旋转，并转换到屏幕空间
        const screenVertices = vertices.map(v => {
            // 应用形状自身的旋转
            const rotated = this.rotateVector(v, orientation);
            // 应用形状偏移
            const offsetApplied = new CANNON.Vec3(
                rotated.x + offset.x,
                rotated.y + offset.y,
                rotated.z + offset.z
            );
            // 应用刚体旋转
            const bodyRotated = this.rotateVector(offsetApplied, body.quaternion);
            // 应用刚体位置
            const worldPos = new CANNON.Vec3(
                bodyRotated.x + body.position.x,
                bodyRotated.y + body.position.y,
                bodyRotated.z + body.position.z
            );
            // 转换到屏幕坐标
            return this.ObjectToScreenPos(worldPos);
        });

        // 定义盒子的边
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // 前面
            [4, 5], [5, 6], [6, 7], [7, 4], // 后面
            [0, 4], [1, 5], [2, 6], [3, 7]  // 连接前后
        ];

        // 绘制所有边
        edges.forEach(([i1, i2]) => {
            const v1 = screenVertices[i1];
            const v2 = screenVertices[i2];
            // 确保转换后的顶点有效
            if (v1 && v2 && !isNaN(v1.x) && !isNaN(v1.y) && !isNaN(v2.x) && !isNaN(v2.y)) {
                this.drawLineFunc(v1.x, v1.y, v2.x, v2.y, color);
            }
        });
    }

    // 绘制球体形状
    private static drawSphere(body: CANNON.Body, shape: CANNON.Sphere, offset: CANNON.Vec3, orientation: CANNON.Quaternion, color: number) {
        const radius = shape.radius;
        const segments = 16; // 球体分段数

        // 计算球体中心在世界空间中的位置
        const center = new CANNON.Vec3(offset.x, offset.y, offset.z);
        const rotatedCenter = this.rotateVector(center, body.quaternion);
        const worldCenter = new CANNON.Vec3(
            rotatedCenter.x + body.position.x,
            rotatedCenter.y + body.position.y,
            rotatedCenter.z + body.position.z
        );
        const screenCenter = this.ObjectToScreenPos(worldCenter);

        if (!screenCenter) return;

        // 绘制球体的赤道圆
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * Math.PI * 2;
            const angle2 = ((i + 1) / segments) * Math.PI * 2;

            // 计算圆上两点
            const p1 = new CANNON.Vec3(
                Math.cos(angle1) * radius,
                0,
                Math.sin(angle1) * radius
            );
            const p2 = new CANNON.Vec3(
                Math.cos(angle2) * radius,
                0,
                Math.sin(angle2) * radius
            );

            // 应用旋转和位置
            const rotatedP1 = this.rotateVector(p1, orientation);
            const rotatedP2 = this.rotateVector(p2, orientation);

            const offsetP1 = new CANNON.Vec3(
                rotatedP1.x + offset.x,
                rotatedP1.y + offset.y,
                rotatedP1.z + offset.z
            );
            const offsetP2 = new CANNON.Vec3(
                rotatedP2.x + offset.x,
                rotatedP2.y + offset.y,
                rotatedP2.z + offset.z
            );

            const bodyP1 = this.rotateVector(offsetP1, body.quaternion);
            const bodyP2 = this.rotateVector(offsetP2, body.quaternion);

            const worldP1 = new CANNON.Vec3(
                bodyP1.x + body.position.x,
                bodyP1.y + body.position.y,
                bodyP1.z + body.position.z
            );
            const worldP2 = new CANNON.Vec3(
                bodyP2.x + body.position.x,
                bodyP2.y + body.position.y,
                bodyP2.z + body.position.z
            );

            // 转换到屏幕坐标
            const screenP1 = this.ObjectToScreenPos(worldP1);
            const screenP2 = this.ObjectToScreenPos(worldP2);

            if (screenP1 && screenP2) {
                this.drawLineFunc(screenP1.x, screenP1.y, screenP2.x, screenP2.y, color);
            }
        }

        // 绘制球体的子午线（垂直方向）
        for (let i = 0; i < segments / 2; i++) {
            const angle1 = (i / (segments / 2)) * Math.PI;
            const angle2 = ((i + 1) / (segments / 2)) * Math.PI;

            const p1 = new CANNON.Vec3(
                0,
                Math.cos(angle1) * radius,
                Math.sin(angle1) * radius
            );
            const p2 = new CANNON.Vec3(
                0,
                Math.cos(angle2) * radius,
                Math.sin(angle2) * radius
            );

            // 应用旋转和位置（与赤道圆处理相同）
            const rotatedP1 = this.rotateVector(p1, orientation);
            const rotatedP2 = this.rotateVector(p2, orientation);

            const offsetP1 = new CANNON.Vec3(
                rotatedP1.x + offset.x,
                rotatedP1.y + offset.y,
                rotatedP1.z + offset.z
            );
            const offsetP2 = new CANNON.Vec3(
                rotatedP2.x + offset.x,
                rotatedP2.y + offset.y,
                rotatedP2.z + offset.z
            );

            const bodyP1 = this.rotateVector(offsetP1, body.quaternion);
            const bodyP2 = this.rotateVector(offsetP2, body.quaternion);

            const worldP1 = new CANNON.Vec3(
                bodyP1.x + body.position.x,
                bodyP1.y + body.position.y,
                bodyP1.z + body.position.z
            );
            const worldP2 = new CANNON.Vec3(
                bodyP2.x + body.position.x,
                bodyP2.y + body.position.y,
                bodyP2.z + body.position.z
            );

            const screenP1 = this.ObjectToScreenPos(worldP1);
            const screenP2 = this.ObjectToScreenPos(worldP2);

            if (screenP1 && screenP2) {
                this.drawLineFunc(screenP1.x, screenP1.y, screenP2.x, screenP2.y, color);
            }
        }
    }

    // 绘制平面形状
    private static drawPlane(body: CANNON.Body, shape: CANNON.Plane, offset: CANNON.Vec3, orientation: CANNON.Quaternion, color: number) {
        const size = 5; // 平面可视大小
        const vertices = [
            new CANNON.Vec3(-size, 0, -size),
            new CANNON.Vec3(size, 0, -size),
            new CANNON.Vec3(size, 0, size),
            new CANNON.Vec3(-size, 0, size),
        ];

        // 应用变换并转换到屏幕坐标
        const screenVertices = vertices.map(v => {
            const rotated = this.rotateVector(v, orientation);
            const offsetApplied = new CANNON.Vec3(
                rotated.x + offset.x,
                rotated.y + offset.y,
                rotated.z + offset.z
            );
            const bodyRotated = this.rotateVector(offsetApplied, body.quaternion);
            const worldPos = new CANNON.Vec3(
                bodyRotated.x + body.position.x,
                bodyRotated.y + body.position.y,
                bodyRotated.z + body.position.z
            );
            return this.ObjectToScreenPos(worldPos);
        });

        // 定义平面的边和对角线
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // 四边形边框
            [0, 2], [1, 3]                   // 对角线
        ];

        // 绘制所有边
        edges.forEach(([i1, i2]) => {
            const v1 = screenVertices[i1];
            const v2 = screenVertices[i2];
            if (v1 && v2) {
                this.drawLineFunc(v1.x, v1.y, v2.x, v2.y, color);
            }
        });
    }

    // 将3D世界坐标转换为2D屏幕坐标
    private static ObjectToScreenPos(pos: CANNON.Vec3): { x: number, y: number } | null {
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

    // 用四元数旋转向量（不依赖内置方法）
    private static rotateVector(v: CANNON.Vec3, q: CANNON.Quaternion): CANNON.Vec3 {
        // 四元数旋转公式: v' = q * v * q⁻¹
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
        const x = v.x, y = v.y, z = v.z;

        // 计算 q * v
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // 计算 (q * v) * q⁻¹ (q⁻¹ 是 q的共轭)
        const rx = ix * qw + iw * (-qx) + iy * (-qz) - iz * (-qy);
        const ry = iy * qw + iw * (-qy) + iz * (-qx) - ix * (-qz);
        const rz = iz * qw + iw * (-qz) + ix * (-qy) - iy * (-qx);

        return new CANNON.Vec3(rx, ry, rz);
    }

    // 完善的物理调试绘制入口
    public static DrawPhysicsDebug(world: CANNON.World, DrawLine: Function) {
        this.drawLineFunc = DrawLine;
        // 遍历所有刚体并绘制
        world.bodies.forEach(body => {
            this.drawRigidBody(body);
        });
    }
}
