import { Color } from "../Utils/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Transform } from "../Core/Transform";
import { Renderer } from "../Component/Renderer";
import { MeshRenderer } from "../Component/MeshRenderer";
import { Camera } from "../Component/Camera";
import { Engine, EngineConfig } from "../Core/Engine";
import { Logger } from "../Utils/Logger";
import { Mesh } from "./Mesh";
import { Time } from "../Core/Time";

enum DrawMode {
    Wireframe = 1,
    Point = 2,
    UV = 4,
    Normal = 8,
    Shader = 16
}

export class RasterizationPipeline {
    public drawMode: DrawMode = DrawMode.Wireframe;
    private uint32View: Uint32Array;

    constructor(uint32View: Uint32Array) {
        this.uint32View = uint32View;
    }

    public Render() {
        this.Clear(Color.BLACK);

        // 获取场景中的所有根游戏对象并渲染
        const rootObjects = Engine.sceneManager.getActiveScene()?.getRootGameObjects();
        if (rootObjects) {
            for (const gameObject of rootObjects) {
                // 显式指定类型参数
                const renders = gameObject.getComponentsInChildren(Renderer);
                for (const render of renders) {
                    this.DrawObject(render);
                    Logger.log(render.gameObject.name);
                }
            }
        }
    }

    //#region 基础绘制接口

    public Clear(color: number) {
        // 使用 fill 方法替代循环，性能更好
        this.uint32View.fill(color);
        // 或者使用循环，但性能较差
        // for (let x = 0; x < this.canvasWidth; x++) {
        //     for (let y = 0; y < this.canvasHeight; y++) {
        //         this.SetPixel(x, y, color);
        //     }
        // }
    }

    public DrawPixel(x: number, y: number, color: number) {
        // 绘制到屏幕上的像素应该是整数的
        // 优化: 使用位运算代替Math.floor，提升性能
        x = (x | 0);
        y = (y | 0);
        // x = Math.floor(x);
        // y = Math.floor(y);

        if (x < 0 || x >= EngineConfig.canvasWidth || y < 0 || y >= EngineConfig.canvasHeight) {
            return;
        }

        this.uint32View[y * EngineConfig.canvasWidth + x] = color;
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color1: number, color2?: number) {
        // 使用位运算优化边界检查
        // 画线前要进行边检查，确保线的两端点都在屏幕内，如果线的范围很长并且不在屏幕范围内，都进行计算会造成浪费大量的资源，裁剪掉超出的部分
        const w = EngineConfig.canvasWidth;
        const h = EngineConfig.canvasHeight;
        if (((x1 | y1) < 0) || (x1 >= w) || (y1 >= h) || ((x2 | y2) < 0) || (x2 >= w) || (y2 >= h)) {
            //TODO:裁剪掉超出屏幕的部分
            return;
        }

        // 取整
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.max(Math.abs(dx), Math.abs(dy));

        // 为何要区分斜率是否偏水平还是垂直呢？因为如果不区分，例如当斜率大于1时，会导致直线绘制不连续，因为y会跳变，而不是连续的增加。
        // 只有斜率刚好为1时，x跟y才是连续同步自增的，x+1，则y也+1
        // 所以，当斜率大于1时，我们需要使用y作为循环变量，而当斜率小于1时，我们需要使用x作为循环变量。
        // 举个极端例子，当斜率为0时，直线就是一条垂直直线，如果这时候还用x作为循环变量，则会导致这条直线上所有y点都对应一个x，也就是说这条线变成一个点了。

        // 斜率小于1，直线偏水平情况，使用x作为循环变量
        if (Math.abs(dx) > Math.abs(dy)) {
            // 下面的循环绘制函数是从左往右的，这里要确保结束点在开始点的右边
            if (x2 < x1) {
                [x1, y1, x2, y2] = [x2, y2, x1, y1];
                // 同时交换颜色
                if (color2 !== undefined) [color1, color2] = [color2, color1];
            }

            // 斜率
            const a = dy / dx;
            // 截距（y=ax+b，b=y-ax）
            // const b = y1 - a * x1;
            let y = y1;
            // 绘制直线
            for (let x = x1; x <= x2; x++) {
                // 计算插值因子 (0 到 1)
                const t = length > 0 ? (x - x1) / length : 0;
                // 根据是否有第二个颜色决定使用单一颜色还是插值
                const color = color2 !== undefined ? this.interpolateColor(color1, color2, t) : color1;

                this.DrawPixel(x, y, color);
                // 直线公式y=ax+b，这里不必计算这个公式，因为当x加1自增时，y也会加a，所以可以直接用y+a代替ax+b，算是一个性能优化点
                // y = a * x + b;
                y = y + a;
            }

            // 或
            // const ys = this.Interpolate(x1, y1, x2, y2);
            // for (let x = x1; x <= x2; x++) {
            //     this.DrawPixel(x, ys[x - x1], color);
            // }
        }
        // 斜率大于1，直线偏垂直情况，使用y作为循环变量
        else {
            if (y2 < y1) {
                [x1, y1, x2, y2] = [x2, y2, x1, y1];
                // 同时交换颜色
                if (color2 !== undefined) [color1, color2] = [color2, color1];
            }

            const a = dx / dy;
            let x = x1;
            for (let y = y1; y <= y2; y++) {
                // 计算插值因子 (0 到 1)
                const t = length > 0 ? (y - y1) / length : 0;
                // 根据是否有第二个颜色决定使用单一颜色还是插值
                const color = color2 !== undefined ? this.interpolateColor(color1, color2, t) : color1;

                this.DrawPixel(x, y, color);
                x = x + a;
            }

            // 或
            // const xs = this.Interpolate(y1, x1, y2, x2);
            // for (let y = y1; y <= y2; y++) {
            //     this.DrawPixel(xs[y - y1], y, color);
            // }
        }
    }

    public DrawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: number) {
        this.DrawLine(x1, y1, x2, y2, color);
        this.DrawLine(x2, y2, x3, y3, color);
        this.DrawLine(x3, y3, x1, y1, color);
    }

    public DrawTriangleFilled(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: number) {
        // 注：以下提到的长边，特指y轴跨度最长的边，而不是实际上的边长

        // 画三角形前要进行边检查，确保三角形的三个点都在屏幕内，如果有点超出屏幕范围，则裁剪，并生成新的三角形
        const w = EngineConfig.canvasWidth;
        const h = EngineConfig.canvasHeight;
        if (((x1 | y1) < 0) || (x1 >= w) || (y1 >= h) || ((x2 | y2) < 0) || (x2 >= w) || (y2 >= h) || ((x3 | y3) < 0) || (x3 >= w) || (y3 >= h)) {
            //TODO:裁剪掉超出屏幕的部分
            return;
        }

        // 实际绘制到屏幕上的点，必须是整数，取整一下。使用位运算代替Math.floor，提升性能
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;
        x3 = x3 | 0;
        y3 = y3 | 0;

        // 对点进行排序，使得y1<=y2<=y3，即可确定三角形的长边为L13，L12和L23则是另外两条短边
        if (y1 > y2) [x1, y1, x2, y2] = [x2, y2, x1, y1];
        if (y1 > y3) [x1, y1, x3, y3] = [x3, y3, x1, y1];
        if (y2 > y3) [x2, y2, x3, y3] = [x3, y3, x2, y2];

        // 获取3条边的点坐标合集
        const p12 = this.Interpolate(y1, x1, y2, x2);
        const p23 = this.Interpolate(y2, x2, y3, x3);
        const p13 = this.Interpolate(y1, x1, y3, x3);

        // 拼合两条短边为一条长边（先移除第一条边的最后一个数据，避免重复）
        // 现在变成2条长边，L13和L123
        p12.pop();
        const p123 = p12.concat(p23);

        // 判断L13和L123哪条长边是左哪条是右，都取数组中间的点，判断谁左谁右即可。
        // 使用位运算代替Math.floor，提升性能
        // const m = Math.floor(p123.length / 2);
        const m = (p123.length >> 1) | 0;
        let pLeft = p123;
        let pRight = p13;
        if (p13[m] < p123[m]) {
            pLeft = p13;
            pRight = p123;
        }

        // 绘制水平线段
        for (let y = y1; y <= y3; y++) {
            for (let x = pLeft[y - y1]; x <= pRight[y - y1]; x++) {
                this.DrawPixel(x, y, color);
            }
        }
    }

    public DrawTriangleFilledWithVertexColor(
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        color1: number, color2: number, color3: number
    ) {
        // 画三角形前要进行边检查，确保三角形的三个点都在屏幕内，如果有点超出屏幕范围，则裁剪，并生成新的三角形
        const w = EngineConfig.canvasWidth;
        const h = EngineConfig.canvasHeight;
        if (((x1 | y1) < 0) || (x1 >= w) || (y1 >= h) || ((x2 | y2) < 0) || (x2 >= w) || (y2 >= h) || ((x3 | y3) < 0) || (x3 >= w) || (y3 >= h)) {
            //TODO:裁剪掉超出屏幕的部分
            return;
        }

        // 实际绘制到屏幕上的点，必须是整数，取整一下。使用位运算代替Math.floor，提升性能
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;
        x3 = x3 | 0;
        y3 = y3 | 0;

        // 对点按Y坐标排序，确保y1 <= y2 <= y3
        if (y1 > y2) [x1, y1, x2, y2, color1, color2] = [x2, y2, x1, y1, color2, color1];
        if (y1 > y3) [x1, y1, x3, y3, color1, color3] = [x3, y3, x1, y1, color3, color1];
        if (y2 > y3) [x2, y2, x3, y3, color2, color3] = [x3, y3, x2, y2, color3, color2];

        // 提取RGB分量
        const c1 = Color.FromUint32(color1);
        const c2 = Color.FromUint32(color2);
        const c3 = Color.FromUint32(color3);

        // 插值函数，颜色1与颜色2在d1-d2的范围内均匀插值
        const interpolateColor = (d1: number, r1: number, g1: number, b1: number, a1: number,
            d2: number, r2: number, g2: number, b2: number, a2: number) => {
            // 预分配数组大小
            // 使用位运算代替Math.floor和Math.abs，提升性能
            // const dx = Math.abs(Math.floor(d2 - d1));
            const dx = ((d2 > d1 ? d2 - d1 : d1 - d2) | 0);
            const result = new Array(dx + 1);

            // 计算步长
            const invDelta = 1 / (d2 - d1);
            const rStep = (r2 - r1) * invDelta;
            const gStep = (g2 - g1) * invDelta;
            const bStep = (b2 - b1) * invDelta;
            const aStep = (a2 - a1) * invDelta;

            let r = r1, g = g1, b = b1, a = a1;
            for (let i = 0; i <= dx; i++) {
                result[i] = { r, g, b, a };
                r += rStep;
                g += gStep;
                b += bStep;
                a += aStep;
            }
            return result;
        };

        // 插值三条边的坐标和颜色
        const p12 = this.Interpolate(y1, x1, y2, x2);
        const p12Colors = interpolateColor(y1, c1.r, c1.g, c1.b, c1.a, y2, c2.r, c2.g, c2.b, c2.a);

        const p23 = this.Interpolate(y2, x2, y3, x3);
        const p23Colors = interpolateColor(y2, c2.r, c2.g, c2.b, c2.a, y3, c3.r, c3.g, c3.b, c3.a);

        const p13 = this.Interpolate(y1, x1, y3, x3);
        const p13Colors = interpolateColor(y1, c1.r, c1.g, c1.b, c1.a, y3, c3.r, c3.g, c3.b, c3.a);

        // 合并两条短边
        p12.pop();
        const p123 = p12.concat(p23);
        const p123Colors = p12Colors.concat(p23Colors);

        // 确定左右边界
        // const m = Math.floor(p123.length / 2);
        const m = (p123.length >> 1) | 0;
        let leftPoints = p123;
        let rightPoints = p13;
        let leftColors = p123Colors;
        let rightColors = p13Colors;

        if (p13[m] < p123[m]) {
            leftPoints = p13;
            rightPoints = p123;
            leftColors = p13Colors;
            rightColors = p123Colors;
        }

        // 绘制水平线段，并进行颜色插值
        for (let y = y1; y <= y3; y++) {
            const idx = y - y1;
            const xStart = leftPoints[idx];
            const xEnd = rightPoints[idx];

            const leftColor = leftColors[idx];
            const rightColor = rightColors[idx];

            // 预计算颜色差值
            const rDiff = rightColor.r - leftColor.r;
            const gDiff = rightColor.g - leftColor.g;
            const bDiff = rightColor.b - leftColor.b;
            const aDiff = rightColor.a - leftColor.a;

            // 步长和颜色增量
            const invLength = 1 / ((xEnd - xStart) + 1);
            const rStep = rDiff * invLength;
            const gStep = gDiff * invLength;
            const bStep = bDiff * invLength;
            const aStep = aDiff * invLength;

            // 初始颜色值
            let r = leftColor.r;
            let g = leftColor.g;
            let b = leftColor.b;
            let a = leftColor.a;

            // 水平方向颜色插值
            for (let x = xStart; x <= xEnd; x++) {
                const finalColor = ((a | 0) << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0);
                this.DrawPixel(x, y, finalColor);

                // 累加颜色值
                r += rStep;
                g += gStep;
                b += bStep;
                a += aStep;
            }
        }
    }

    //#endregion

    //#region 投影相关

    // 将视口上的内容映射到实际屏幕上
    public ViewportToCanvas(point: Vector2) {
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
    public ProjectVertex(vertex: Vector3): Vector2 {
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

    //#endregion

    //#region 变换

    // 将模型空间坐标转换为裁剪空间坐标（Clip Space）
    public ObjectToClipPos(vertex: Vector3, transform: Transform): Vector4 {
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
        return mvpMatrix.multiplyVector4(new Vector4(vertex.clone(), 1));
    }

    // 将裁剪空间坐标最终转换为屏幕空间坐标（Screen Space）
    public ClipToScreenPos(vertex: Vector4): Vector2 {
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
        const screenY = EngineConfig.canvasHeight - (((ndcY + 1) / 2) * EngineConfig.canvasHeight);

        // z分量通常用于深度测试，这里我们只关心屏幕x,y
        // 如果你的NDCz范围是[-1,1]且需要映射到[0,1]（例如WebGPU某些情况），可以类似处理：const screenZ = (ndc.z + 1) / 2;

        return new Vector2(screenX, screenY);
    }

    public ObjectToScreenPos(vertex: Vector3, transform: Transform): Vector2 {
        const clipPos = this.ObjectToClipPos(vertex, transform);
        return this.ClipToScreenPos(clipPos);
    }

    public ObjectToWorldNormal(normal: Vector3, transform: Transform): Vector3 {
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

    /*
     * 顶点处理阶段：模型空间 →（模型矩阵阵）→ 世界空间 →（视图矩阵）→ 观察空间 →（投影矩阵）→ 裁剪空间 →（透视除法）→ NDC 空间 →（视口变换）→ 屏幕空间 → 光栅化渲染
     */
    public VertexProcessingStage(vertices: Vector3[], transform: Transform) {
        const outVertices = new Array(vertices.length);

        // 1. MVP变换到裁剪空间
        // 模型空间 -> 世界空间 -> 观察空间 -> 裁剪空间
        for (let i = 0; i < vertices.length; i += 1) {
            outVertices[i] = this.ObjectToClipPos(vertices[i], transform);
        }

        // 2. 透视除法：将裁剪空间坐标转换为标准设备坐标（NDC）
        // 裁剪空间 -> 标准化设备坐标（NDC 空间）
        // 3. 视口变换：将NDC坐标映射到屏幕坐标
        // 标准化设备坐标（NDC 空间） -> 屏幕空间
        for (let i = 0; i < outVertices.length; i++) {
            outVertices[i] = this.ClipToScreenPos(outVertices[i]);
        }

        return outVertices;
    }

    /*
     * 简单变换阶段：没有通过矩阵计算，而是简单的相似三角形原理，三角函数算出MVP变换跟屏幕映射，理解起来比较简单，但每个顶点都经过从头到尾的计算，比较耗性能
     */
    public EasyVertexProcessingStage(vertices: Vector3[], transform: Transform) {
        const clipSpaceVertices = new Array(vertices.length);

        // 简单变换
        for (let i = 0; i < vertices.length; i += 1) {
            let vertice = vertices[i].clone();
            // 先变换，必须严格按照先缩放，再旋转，再平移
            this.ScaleVertex(vertice, transform);
            this.RotateVertex(vertice, transform);
            this.TranslateVertex(vertice, transform);
            // 再投影
            clipSpaceVertices[i] = this.ProjectVertex(vertice);
            // 再视口映射
            this.ViewportToCanvas(clipSpaceVertices[i]);
        }

        return clipSpaceVertices;
    }

    public ScaleVertex(vertex: Vector3, transform: Transform) {
        vertex.x *= transform.scale.x;
        vertex.y *= transform.scale.y;
        vertex.z *= transform.scale.z;
    }

    public RotateVertex(vertex: Vector3, transform: Transform) {
        const eulerAngles = transform.rotation.eulerAngles;

        const cosX = Math.cos(eulerAngles.x);
        const sinX = Math.sin(eulerAngles.x);
        const cosY = Math.cos(eulerAngles.y);
        const sinY = Math.sin(eulerAngles.y);
        const cosZ = Math.cos(eulerAngles.z);
        const sinZ = Math.sin(eulerAngles.z);
        // 先绕Z轴旋转
        const x = vertex.x * cosZ - vertex.y * sinZ;
        const y = vertex.x * sinZ + vertex.y * cosZ;
        vertex.x = x;
        vertex.y = y;
        // 再绕Y轴旋转
        const z = vertex.z * cosY - vertex.x * sinY;
        const x2 = vertex.z * sinY + vertex.x * cosY;
        vertex.z = z;
        vertex.x = x2;
        // 最后绕X轴旋转
        const y2 = vertex.y * cosX - vertex.z * sinX;
        const z2 = vertex.y * sinX + vertex.z * cosX;
        vertex.y = y2;
        vertex.z = z2;
    }

    public TranslateVertex(vertex: Vector3, transform: Transform) {
        vertex.x += transform.position.x;
        vertex.y += transform.position.y;
        vertex.z += transform.position.z;
    }

    //#endregion

    //#region 剔除裁剪

    // 视锥体剔除
    public FrustumCulling() {

    }

    // 背面剔除
    public BackfaceCulling(triangles: number[], mesh: Mesh, renderer: Renderer) {
        const visibleTriangles: number[] = [];
        const faceNormals = mesh.faceNormals;
        const modelMatrix = renderer.transform.localToWorldMatrix;
        const camera = Camera.mainCamera;

        // 1. 计算模型视图矩阵（模型空间 → 视图空间）
        const viewMatrix = camera.getViewMatrix(); // 获取相机的视图矩阵（世界空间 → 视图空间）
        const modelViewMatrix = viewMatrix.multiply(modelMatrix); // 模型空间 → 世界空间 → 视图空间

        // 2. 计算法向量变换矩阵（模型视图矩阵的逆转置）
        const normalMatrix = modelViewMatrix.clone().invert().transpose();

        // 3. 视图空间中的相机观察方向（右手坐标系的话，Z轴指向观察者，即相机应该是看向Z轴负轴）
        const cameraViewDirection = Vector3.BACK;

        for (let i = 0; i < faceNormals.length; i++) {
            const n = 10;//Camera.mainCamera.counter % 12;
            //if (i !== n) continue;

            // 原始法向量（模型空间）
            const normalModel = faceNormals[i];

            // 4. 将法向量从模型空间变换到视图空间
            const normalView = normalMatrix.multiplyVector3(normalModel);

            // 5. 计算法向量与观察方向的点积
            const dot = normalView.dot(cameraViewDirection);

            // 6. 点积 > 0 表示面向相机（可见）
            if (dot > 0) {
                visibleTriangles.push(
                    triangles[i * 3],
                    triangles[i * 3 + 1],
                    triangles[i * 3 + 2]
                );
            }
        }

        return visibleTriangles;
    }

    // 遮挡剔除
    public OcclusionCulling() {

    }

    public ClipTriangle(triangle: Vector3[]) {

    }

    //#endregion

    //#region 绘制物体

    public DrawObject(renderer: Renderer) {
        const mesh = (renderer as MeshRenderer).mesh;
        if (!mesh) {
            return;
        }

        let triangles = mesh.triangles;

        // 1.剔除
        this.FrustumCulling();
        triangles = this.BackfaceCulling(triangles, mesh, renderer);
        this.OcclusionCulling();

        // 2.变换
        // MVP变换
        const screenVertices = this.VertexProcessingStage(mesh.vertices, renderer.transform);
        // 简单MVP变换
        // const screenVertices = this.EasyVertexProcessingStage(obj);

        // 3.裁剪

        // 4.光栅化与像素绘画
        // 最后绘制三角形到屏幕上
        for (let i = 0; i < triangles.length; i += 3) {
            const p1 = screenVertices[triangles[i]];
            const p2 = screenVertices[triangles[i + 1]];
            const p3 = screenVertices[triangles[i + 2]];

            if (this.drawMode & DrawMode.Wireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color.WHITE);
            }
            if (this.drawMode & DrawMode.Point) {
                this.DrawPixel(p1.x, p1.y, Color.WHITE);
                this.DrawPixel(p2.x, p2.y, Color.WHITE);
                this.DrawPixel(p3.x, p3.y, Color.WHITE);
            }
            if (this.drawMode & DrawMode.UV) {
                const p1_uv = mesh.uv[triangles[i]];
                const p2_uv = mesh.uv[triangles[i + 1]];
                const p3_uv = mesh.uv[triangles[i + 2]];
                const p1_color = new Color(p1_uv.x * 255, p1_uv.y * 255, 0).ToUint32();
                const p2_color = new Color(p2_uv.x * 255, p2_uv.y * 255, 0).ToUint32();
                const p3_color = new Color(p3_uv.x * 255, p3_uv.y * 255, 0).ToUint32();
                this.DrawTriangleFilledWithVertexColor(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p1_color, p2_color, p3_color);
            }
            if (this.drawMode & DrawMode.Normal) {
                const p1_normal = this.ObjectToWorldNormal(mesh.normals[triangles[i]], renderer.transform);
                const p2_normal = this.ObjectToWorldNormal(mesh.normals[triangles[i + 1]], renderer.transform);
                const p3_normal = this.ObjectToWorldNormal(mesh.normals[triangles[i + 2]], renderer.transform);
                // 将法线分量从 [-1, 1] 映射到 [0, 255]
                let r = Math.floor((p1_normal.x + 1) * 0.5 * 255);
                let g = Math.floor((p1_normal.y + 1) * 0.5 * 255);
                let b = Math.floor((p1_normal.z + 1) * 0.5 * 255);
                const p1_color = new Color(r, g, b).ToUint32();
                r = Math.floor((p2_normal.x + 1) * 0.5 * 255);
                g = Math.floor((p2_normal.y + 1) * 0.5 * 255);
                b = Math.floor((p2_normal.z + 1) * 0.5 * 255);
                const p2_color = new Color(r, g, b).ToUint32();
                r = Math.floor((p3_normal.x + 1) * 0.5 * 255);
                g = Math.floor((p3_normal.y + 1) * 0.5 * 255);
                b = Math.floor((p3_normal.z + 1) * 0.5 * 255);
                const p3_color = new Color(r, g, b).ToUint32();
                this.DrawTriangleFilledWithVertexColor(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p1_color, p2_color, p3_color);
            }
            if (this.drawMode & DrawMode.Shader) {
                this.DrawTriangleFilled(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color.WHITE);
            }
        }

        // 调试：绘制面法线
        // for (let i = 0; i < mesh._debug_faceNormalLine.length; i++) {
        //     const normal = mesh._debug_faceNormalLine[i];
        //     const start = this.ObjectToScreenPos(normal.start, renderer.transform);
        //     const end = this.ObjectToScreenPos(normal.end, renderer.transform);
        //     this.DrawLine(start.x, start.y, end.x, end.y, Color.RED, Color.GREEN);
        // }
    }

    //#endregion

    //#region 工具函数

    /// <summary>
    /// 线性插值
    /// 传入2个点，返回它们组成线段的插值。
    /// 要求：
    /// 1. 要先算出直线偏水平还是垂直，如果是偏水平（斜率小于1），则以x为循环，传入顺序是(x1,y1,x2,y2)，反之如果直线偏垂直，则是(y1,x1,y2,x2)
    /// 2. 同时要确保线段点的方向是从左往右或从上往下，例如线段是偏水平的话，要确保x2>x1，如果是偏垂直的话，要确保y2>y1
    /// 举个例子：
    /// 点(0, 0)和(2,1)，传入的参数是(0, 0, 2, 1)，返回的是((2-0)+1=3)个值，这些值是从(0-1)中间插值的，即(0, 0.5, 1)
    /// </summary>
    private Interpolate(a1: number, b1: number, a2: number, b2: number): number[] {
        // 预分配数组大小以避免动态扩容
        // const dx = Math.abs(Math.floor(a2 - a1));
        const dx = ((a2 > a1 ? a2 - a1 : a1 - a2) | 0);
        const value = new Array(dx + 1);
        const a = (b2 - b1) / (a2 - a1);
        let d = b1;

        for (let i = 0; i <= dx; i++) {
            value[i] = d;
            d += a;
        }
        return value;
    }

    /**
     * 颜色插值辅助函数
     * @param color1 起始颜色 (32位整数，格式为0xAARRGGBB)
     * @param color2 结束颜色 (32位整数，格式为0xAARRGGBB)
     * @param t 插值因子 (0 到 1)
     * @returns 插值后的颜色
     */
    private interpolateColor(color1: number, color2: number, t: number): number {
        // 提取ARGB分量
        const a1 = (color1 >> 24) & 0xFF;
        const r1 = (color1 >> 16) & 0xFF;
        const g1 = (color1 >> 8) & 0xFF;
        const b1 = color1 & 0xFF;

        const a2 = (color2 >> 24) & 0xFF;
        const r2 = (color2 >> 16) & 0xFF;
        const g2 = (color2 >> 8) & 0xFF;
        const b2 = color2 & 0xFF;

        // 线性插值每个分量
        const a = Math.round(a1 + (a2 - a1) * t);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        // 组合成32位颜色值
        return (a << 24) | (r << 16) | (g << 8) | b;
    }

    //#endregion
}