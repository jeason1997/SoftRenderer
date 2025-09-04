import { Color } from "./Color";
import { Vector2 } from "./Math/Vector2";
import { Vector3 } from "./Math/Vector3";
import { Camera } from "./Compoment/Camera";
import { Config } from "./Config";
import { Vector4 } from "./Math/Vector4";
import { GameObject } from "./GameObject";
import { Transform } from "./Transfrom";
import { Renderer } from "./Compoment/Renderer";

enum DrawMode {
    Wireframe,
    Point,
    Shader
}

export class RasterizationPipeline {
    public drawMode: DrawMode = DrawMode.Wireframe;
    private uint32View: Uint32Array;

    constructor(uint32View: Uint32Array) {
        this.uint32View = uint32View;
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

        if (x < 0 || x >= Config.canvasWidth || y < 0 || y >= Config.canvasHeight) {
            return;
        }

        this.uint32View[y * Config.canvasWidth + x] = color;
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number) {
        // 取整
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;

        const dx = x2 - x1;
        const dy = y2 - y1;

        // 为何要区分斜率是否偏水平还是垂直呢？因为如果不区分，例如当斜率大于1时，会导致直线绘制不连续，因为y会跳变，而不是连续的增加。
        // 只有斜率刚好为1时，x跟y才是连续同步自增的，x+1，则y也+1
        // 所以，当斜率大于1时，我们需要使用y作为循环变量，而当斜率小于1时，我们需要使用x作为循环变量。
        // 举个极端例子，当斜率为0时，直线就是一条垂直直线，如果这时候还用x作为循环变量，则会导致这条直线上所有y点都对应一个x，也就是说这条线变成一个点了。

        // 斜率小于1，直线偏水平情况，使用x作为循环变量
        if (Math.abs(dx) > Math.abs(dy)) {
            // 下面的循环绘制函数是从左往右的，这里要确保结束点在开始点的右边
            if (x2 < x1) [x1, y1, x2, y2] = [x2, y2, x1, y1];

            // 斜率
            const a = dy / dx;
            // 截距（y=ax+b，b=y-ax）
            // const b = y1 - a * x1;
            let y = y1;
            // 绘制直线
            for (let x = x1; x <= x2; x++) {
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
            if (y2 < y1) [x1, y1, x2, y2] = [x2, y2, x1, y1];

            const a = dx / dy;
            let x = x1;
            for (let y = y1; y <= y2; y++) {
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
        const viewportHeight = 1 / Config.aspectRatio;

        // 将投影坐标映射到Canvas像素坐标
        // X坐标：从 [-viewportWidth/2, viewportWidth/2] 映射到 [0, canvasWidth]
        // Y坐标：从 [-viewportHeight/2, viewportHeight/2] 映射到 [0, canvasHeight] (注意Y轴方向)
        const canvasX = ((point.x + viewportWidth / 2) / viewportWidth) * Config.canvasWidth;
        const canvasY = Config.canvasHeight - (((point.y + viewportHeight / 2) / viewportHeight) * Config.canvasHeight); // Canvas的Y轴通常是向下的
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

    /*
     * 顶点处理阶段：模型空间 →（模型矩阵阵）→ 世界空间 →（视图矩阵）→ 观察空间 →（投影矩阵）→ 裁剪空间 →（透视除法）→ NDC 空间 →（视口变换）→ 屏幕空间 → 光栅化渲染
     */
    public VertexProcessingStage(obj: GameObject) {
        const model = obj.model;
        const vertices = model.vertices;
        const clipSpaceVertices = new Array(vertices.length);

        // 构建MVP矩阵
        const modelMatrix = obj.transform.localToWorldMatrix;
        const camera = Camera.mainCamera;
        const cameraForward = camera.transform.forward;
        const cameraUp = camera.transform.up;
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        const modelViewMatrix = modelMatrix.clone().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        const mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);

        // 1. MVP变换到裁剪空间
        // 模型空间 -> 世界空间 -> 观察空间 -> 裁剪空间
        for (let i = 0; i < vertices.length; i += 1) {
            let vertice = vertices[i].clone();
            let v = mvpMatrix.multiplyVector4(new Vector4(vertice, 1));
            clipSpaceVertices[i] = v;
        }

        // 2. 透视除法：将裁剪空间坐标转换为标准设备坐标（NDC）
        // 裁剪空间 -> 标准化设备坐标（NDC 空间）
        for (let i = 0; i < clipSpaceVertices.length; i++) {
            const v = clipSpaceVertices[i];
            // w分量是透视投影产生的，用于透视除法
            const w = v.w; // 假设你的Vector4/Vector3实现中，齐次坐标w存储在w属性中。如果没有，需要确保MVP变换时处理了齐次坐标。
            // 如果没有显式的w分量，且mvpMatrix.multiplyVector3返回的是Vector3，那么通常认为w=1（正交投影）或者需要从变换矩阵中考虑透视

            // 进行透视除法：xyz分别除以w
            // 注意：如果你的矩阵乘法没有处理齐次坐标（即返回的vertice是三维向量），那么很可能你的变换没有包含透视投影产生的w分量。
            // 假设你的mvpMatrix.multiplyVector3确实返回了包含齐次坐标的Vector4，或者有一个返回Vector4的方法。
            // 这里假设 projectedVertices 中存储的是 Vector4，或者至少有 x, y, z, w 属性。

            // 如果您的实现中，经过透视投影矩阵变换后，顶点已经是一个齐次坐标（x, y, z, w），则需要以下除法：
            v.x = v.x / w;
            v.y = v.y / w;
            v.z = v.z / w; // 对于深度信息，可能还需要进一步处理，但屏幕映射通常主要关注x,y
            // 经过透视除法后，坐标位于标准设备坐标（NDC）空间，通常x, y, z范围在[-1, 1]（OpenGL风格）或[0, 1]（DirectX风格）之间。
            // 假设我们的NDC是[-1, 1]范围。
        }

        // 3. 视口变换：将NDC坐标映射到屏幕坐标
        // 标准化设备坐标（NDC 空间） -> 屏幕空间
        // 获取画布（或视口）的宽度和高度
        const screenVertices = new Array(clipSpaceVertices.length);
        for (let i = 0; i < clipSpaceVertices.length; i++) {
            const ndc = clipSpaceVertices[i]; // 此时ndc应该是经过透视除法后的NDC坐标

            // 将NDC的x从[-1, 1]映射到[0, screenWidth]
            const screenX = ((ndc.x + 1) / 2) * Config.canvasWidth;
            // 将NDC的y从[-1, 1]映射到[0, screenHeight]。注意屏幕坐标通常y向下为正，而NDC的y向上为正，所以需要翻转
            const screenY = Config.canvasHeight - (((ndc.y + 1) / 2) * Config.canvasHeight);
            // z分量通常用于深度测试，这里我们只关心屏幕x,y
            // 如果你的NDCz范围是[-1,1]且需要映射到[0,1]（例如WebGPU某些情况），可以类似处理：const screenZ = (ndc.z + 1) / 2;

            screenVertices[i] = { x: screenX, y: screenY }; // 存储屏幕坐标
        }

        return screenVertices;
    }

    /*
     * 简单变换阶段：没有通过矩阵计算，而是简单的相似三角形原理，三角函数算出MVP变换跟屏幕映射，理解起来比较简单，但每个顶点都经过从头到尾的计算，比较耗性能
     */
    public EasyVertexProcessingStage(obj: GameObject) {
        const model = obj.model;
        const vertices = model.vertices;
        const clipSpaceVertices = new Array(vertices.length);

        // 简单变换
        for (let i = 0; i < vertices.length; i += 1) {
            let vertice = vertices[i].clone();
            // 先变换，必须严格按照先缩放，再旋转，再平移
            this.ScaleVertex(vertice, obj.transform);
            this.RotateVertex(vertice, obj.transform);
            this.TranslateVertex(vertice, obj.transform);
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
    public BackfaceCulling() {

    }

    // 遮挡剔除
    public OcclusionCulling() {

    }

    public ClipTriangle(triangle: Vector3[]) {
        // 1.计算三角形的中心
        const center = new Vector3(
            (triangle[0].x + triangle[1].x + triangle[2].x) / 3,
            (triangle[0].y + triangle[1].y + triangle[2].y) / 3,
            (triangle[0].z + triangle[1].z + triangle[2].z) / 3
        );
    }

    //#endregion

    //#region 绘制物体

    public DrawObject(renderer: Renderer) {
        const model = renderer.model;
        const indices = model.faces.flatMap(face => face.vertexIndices);

        // 1.剔除
        this.FrustumCulling();
        this.BackfaceCulling();
        this.OcclusionCulling();

        // 2.变换
        // MVP变换
        const screenVertices = this.VertexProcessingStage(renderer);
        // 简单MVP变换
        // const screenVertices = this.EasyVertexProcessingStage(obj);

        // 3.裁剪

        // 4.光栅化与像素绘画
        // 最后绘制三角形到屏幕上
        for (let i = 0; i < indices.length; i += 3) {
            const p1 = screenVertices[indices[i]];
            const p2 = screenVertices[indices[i + 1]];
            const p3 = screenVertices[indices[i + 2]];

            // 线框模式，暂不支持顶点色
            if (this.drawMode === DrawMode.Wireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color.WHITE);
            }
            else if (this.drawMode === DrawMode.Point) {
                this.DrawPixel(p1.x, p1.y, Color.WHITE);
                this.DrawPixel(p2.x, p2.y, Color.WHITE);
                this.DrawPixel(p3.x, p3.y, Color.WHITE);
            }
            else if (this.drawMode === DrawMode.Shader) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color.WHITE);
            }
        }
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

    //#endregion
}