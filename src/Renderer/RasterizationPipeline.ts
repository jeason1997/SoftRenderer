import { BlendMode, Color } from "../Math/Color";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Transform } from "../Core/Transform";
import { Renderer } from "../Component/Renderer";
import { MeshRenderer } from "../Component/MeshRenderer";
import { Camera, CameraClearFlags } from "../Component/Camera";
import { Engine } from "../Core/Engine";
import { EngineConfig } from "../Core/Setting";
import { Mesh } from "../Resources/Mesh";
import { Bounds } from "../Math/Bounds";
import { PhysicsDebugDraw } from "../Physics/PhysicsDebugDraw";
import { interpolateOverTriangle } from "../Math/Lerp"
import { TransformTools } from "../Math/TransformTools";
import { Debug } from "../Utils/Debug";
import { Vector2 } from "../Math/Vector2";
import { Light } from "../Component/Light";

enum DrawMode {
    Wireframe = 1,
    Point = 2,
    Shader = 4,
}

export class RasterizationPipeline {
    public drawMode: DrawMode = DrawMode.Shader;
    private frameBuffer: Uint32Array;
    private depthBuffer: Float32Array;
    private currentCamera: Camera;
    private overdrawBuffer: Uint32Array;

    constructor(frameBuffer: Uint32Array) {
        this.frameBuffer = frameBuffer;
        this.depthBuffer = new Float32Array(EngineConfig.canvasWidth * EngineConfig.canvasHeight);
        this.overdrawBuffer = new Uint32Array(EngineConfig.canvasWidth * EngineConfig.canvasHeight);
    }

    public Render() {
        const rootObject = Engine.sceneManager.getActiveScene()?.getRootGameObject();
        if (rootObject) {
            const cameras = Camera.cameras;
            // depth越低越早渲染
            cameras.sort((a, b) => a.depth - b.depth);
            // 每个相机渲染一遍
            for (let i = 0, len = cameras.length; i < len; i++) {
                this.currentCamera = cameras[i];
                this.Clear(this.currentCamera);
                const renders = rootObject.getComponentsInChildren(Renderer);
                // 渲染管线1.排序场景物体，按照相机空间进行Z轴排序，先绘制近的
                // 渲染管线2.视锥体剔除
                for (const render of renders) {
                    this.DrawObject(render);
                    Debug.Log(render.gameObject.name);
                }
            }
            // 调试信息
            this.DebugDraw();
        }
    }

    //#region 基础绘制接口

    public Clear(camera: Camera): void {

        const clearFlags = camera.clearFlags;
        const viewport = camera.viewPort;
        const backgroundColor = camera.backGroundColor;

        // 1. 计算视口在屏幕缓冲区中的像素范围
        const viewportPixelX = Math.floor(viewport.x * EngineConfig.canvasWidth);
        const viewportPixelY = Math.floor(viewport.y * EngineConfig.canvasHeight);
        const viewportPixelWidth = Math.floor(viewport.z * EngineConfig.canvasWidth);
        const viewportPixelHeight = Math.floor(viewport.w * EngineConfig.canvasHeight);

        // 2. 根据清除标志，清除视口对应的区域
        if (camera.clearFlags == CameraClearFlags.Skybox) {
            // 绘制天空盒
        }
        else if (clearFlags == CameraClearFlags.Color) {
            this.clearViewportRegion(this.frameBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, backgroundColor);
        }

        if (clearFlags != CameraClearFlags.None) {
            this.clearViewportRegion(this.depthBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, 1);
        }

        this.clearViewportRegion(this.overdrawBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, 0);
    }

    /**
     * 清除缓冲区中指定矩形区域的辅助方法
     * @param buffer 目标缓冲区 (Uint32Array 或 Float32Array 等)
     * @param x 区域起始X坐标 (像素)
     * @param y 区域起始Y坐标 (像素)
     * @param width 区域宽度 (像素)
     * @param height 区域高度 (像素)
     * @param value 要填充的值
     */
    private clearViewportRegion(buffer: Uint32Array | Float32Array, x: number, y: number, width: number, height: number, value: number): void {
        // 如果是满屏幕，则快速填充
        if (x == 0 && y == 0 && width == EngineConfig.canvasWidth && height == EngineConfig.canvasHeight) {
            buffer.fill(value);
            return;
        }

        const canvasWidth = EngineConfig.canvasWidth;
        for (let row = y; row < y + height; row++) {
            const startIndex = row * canvasWidth + x;
            const endIndex = startIndex + width;
            // 使用 subarray 和 fill 来填充一行中的连续区域，比逐个像素设置更快
            buffer.subarray(startIndex, endIndex).fill(value);
        }
    }

    public DrawPixel(x: number, y: number, color: number, countOverdraw: boolean = false, blendMode: BlendMode = BlendMode.replace) {
        // 绘制到屏幕上的像素应该是整数的
        // 优化: 使用位运算代替Math.floor，提升性能
        x = (x | 0);
        y = (y | 0);
        // x = Math.floor(x);
        // y = Math.floor(y);

        if (x < 0 || x >= EngineConfig.canvasWidth || y < 0 || y >= EngineConfig.canvasHeight) {
            return;
        }

        const index = y * EngineConfig.canvasWidth + x;

        // 颜色混合处理
        if (blendMode !== BlendMode.replace) {
            const existingColor = this.frameBuffer[index];
            const blendedColor = Color.blendColors(existingColor, color, blendMode);
            this.frameBuffer[index] = blendedColor;
        } else {
            // 直接替换模式
            this.frameBuffer[index] = color;
        }

        // Overdraw计数
        if (countOverdraw) this.overdrawBuffer[index]++
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

    //#region 变换

    /*
     * 顶点处理阶段：模型空间 →（模型矩阵）→ 世界空间 →（视图矩阵）→ 观察空间 →（投影矩阵）→ 裁剪空间 →（透视除法）→ NDC 空间 →（视口变换）→ 屏幕空间 → 光栅化渲染
     */
    public VertexProcessingStage(vertices: Vector3[], transform: Transform): Vector3[] {
        const outVertices = new Array(vertices.length);

        // 1. MVP变换到裁剪空间
        // 模型空间 -> 世界空间 -> 观察空间 -> 裁剪空间
        // 2. 透视除法：将裁剪空间坐标转换为标准设备坐标（NDC）
        // 裁剪空间 -> 标准化设备坐标（NDC 空间）
        // 3. 视口变换：将NDC坐标映射到屏幕坐标
        // 标准化设备坐标（NDC 空间） -> 屏幕空间
        for (let i = 0; i < vertices.length; i += 1) {
            const out = TransformTools.ModelToScreenPos(vertices[i], transform, this.currentCamera);
            outVertices[i] = new Vector3(out.screen.x, out.screen.y, out.depth);
        }

        return outVertices;
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
        const faceCenters = mesh.faceCenters;
        const cameraPosition = this.currentCamera.transform.position;

        // 获取模型矩阵（模型本地空间到世界空间的变换矩阵）
        const modelMatrix = renderer.transform.localToWorldMatrix;
        // 计算法线矩阵：模型矩阵的逆矩阵的转置
        const normalMatrix = modelMatrix.clone().invert().transpose();

        for (let i = 0; i < faceNormals.length; i++) {
            // 要把Vec3转为齐次坐标点，即w=1
            const world_center = new Vector3(modelMatrix.multiplyVector4(new Vector4(faceCenters[i], 1)));
            // 要把Vec3转为齐次坐向量，即w=0
            const world_normal = new Vector3(normalMatrix.multiplyVector4(new Vector4(faceNormals[i], 0)));

            // 2.获取面的中心到摄像机的向量
            const centerToCamera = Vector3.subtract(cameraPosition, world_center);

            // 3.计算这2个向量的夹角
            const dot = world_normal.dot(centerToCamera);

            // 4.判断夹角是否大于等于0°小于90°
            if (dot > 0) {
                visibleTriangles.push(
                    triangles[i * 3 + 0],
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

        // 渲染管线3.背面剔除
        triangles = this.BackfaceCulling(triangles, mesh, renderer);
        // 渲染管线4.遮挡剔除
        this.OcclusionCulling();

        // 渲染管线5.MVP变换
        const screenVertices = this.VertexProcessingStage(mesh.vertices, renderer.transform);

        // 渲染管线6.裁剪

        for (let i = 0; i < triangles.length; i += 3) {
            const p1 = screenVertices[triangles[i]];
            const p2 = screenVertices[triangles[i + 1]];
            const p3 = screenVertices[triangles[i + 2]];

            const p1_uv = mesh.uv[triangles[i]];
            const p2_uv = mesh.uv[triangles[i + 1]];
            const p3_uv = mesh.uv[triangles[i + 2]];

            const p1_normal = TransformTools.ModelToWorldNormal(mesh.normals[triangles[i]], renderer.transform);
            const p2_normal = TransformTools.ModelToWorldNormal(mesh.normals[triangles[i + 1]], renderer.transform);
            const p3_normal = TransformTools.ModelToWorldNormal(mesh.normals[triangles[i + 2]], renderer.transform);

            const attrs1 = {
                uv: p1_uv,
                normal: p1_normal,
            };

            const attrs2 = {
                uv: p2_uv,
                normal: p2_normal,
            };

            const attrs3 = {
                uv: p3_uv,
                normal: p3_normal,
            };

            if (this.drawMode & DrawMode.Wireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color.WHITE);
            }
            if (this.drawMode & DrawMode.Point) {
                this.DrawPixel(p1.x, p1.y, Color.WHITE);
                this.DrawPixel(p2.x, p2.y, Color.WHITE);
                this.DrawPixel(p3.x, p3.y, Color.WHITE);
            }
            if (this.drawMode & DrawMode.Shader) {
                // 渲染管线7.光栅化
                const fragments = interpolateOverTriangle(p1, p2, p3, attrs1, attrs2, attrs3);

                for (let i = 0; i < fragments.length; i++) {
                    const fragment = fragments[i];
                    const x = fragment.x;
                    const y = fragment.y;
                    const z = fragment.z;

                    // 检查坐标是否在屏幕范围内
                    if (x < 0 || x >= EngineConfig.canvasWidth ||
                        y < 0 || y >= EngineConfig.canvasHeight) {
                        return;
                    }

                    // 计算深度缓冲区索引
                    const index = y * EngineConfig.canvasWidth + x;
                    const currentDepth = this.depthBuffer[index];

                    // 渲染管线8.早期深度测试
                    // 深度测试：只有当前像素更近（z值更小）时才绘制
                    if (z < currentDepth) {
                        this.depthBuffer[index] = z;

                        // uv
                        // const uv = fragment.attributes.uv as Vector2;
                        // const color = new Color(Math.floor(uv.u * 255), Math.floor(uv.v * 255), 0).ToUint32();

                        // nroaml
                        // const normal = fragment.attributes.normal as Vector3;
                        // const color = new Color(Math.floor((normal.x + 1) * 0.5 * 255), Math.floor((normal.y + 1) * 0.5 * 255), Math.floor((normal.z + 1) * 0.5 * 255)).ToUint32();

                        // 渲染管线9.绘制像素到帧缓冲
                        if (renderer.material && renderer.material.mainTexture) {
                            const texture = renderer.material.mainTexture;
                            const uv = fragment.attributes.uv as Vector2;
                            const color = texture.Sample(uv.u, uv.v);
                            this.DrawPixel(x, y, this.calculateLambertLighting(color, fragment.attributes.normal as Vector3), true);
                        }
                    }
                }
            }
        }
    }

    // 兰伯特光照计算
    private calculateLambertLighting(
        surfaceColor: number, 
        normal: Vector3, 
    ): number {
        const light = Light.sunLight;

        // 确保法向量归一化
        const normalizedNormal = normal.normalize();
        
        // 计算法向量与光源方向的点积（兰伯特色度）
        // 结果范围为[-1, 1]，我们只关心正面光照（>0的值）
        const dotProduct = Math.max(0, normalizedNormal.dot(light.transform.forward));
        
        // 提取表面颜色的RGBA通道
        const r = (surfaceColor >> 16) & 0xff;
        const g = (surfaceColor >> 8) & 0xff;
        const b = surfaceColor & 0xff;
        const a = (surfaceColor >> 24) & 0xff;
        
        // 计算光照后的颜色（漫反射公式）
        // 表面颜色 * 光源颜色 * 光照强度 * 兰伯特色度
        const litR = Math.round(r * (light.color.r / 255) * light.intensity * dotProduct);
        const litG = Math.round(g * (light.color.g / 255) * light.intensity * dotProduct);
        const litB = Math.round(b * (light.color.b / 255) * light.intensity * dotProduct);
        
        // 确保颜色值在0-255范围内
        const clampedR = Math.min(255, Math.max(0, litR));
        const clampedG = Math.min(255, Math.max(0, litG));
        const clampedB = Math.min(255, Math.max(0, litB));
        
        // 组合成32位颜色值（保留原始Alpha）
        return (a << 24) | (clampedR << 16) | (clampedG << 8) | clampedB;
    }

    //#endregion

    //#region 工具函数

    private DebugDraw(): void {
        // 绘制包围盒
        // this.DrawBounds(mesh, renderer);

        // 调试：绘制面法线
        // this.DrawFaceNormal(mesh, renderer);

        // 绘制深度纹理
        // this.DrawDepthBuffer();

        // 绘制Overdarw
        // this.DrawOverdraw();

        // 绘制物理调试信息
        // PhysicsDebugDraw.DrawPhysicsDebug(this.DrawLine.bind(this));

        // 绘制调试线
        const lines = Debug.GetDebugLines();
        lines.forEach(line => {
            this.DrawLine(line.start.x, line.start.y, line.end.x, line.end.y, line.color);
        });
    }

    private DrawFaceNormal(mesh: Mesh, renderer: Renderer): void {
        for (let i = 0; i < mesh.faceNormals.length; i++) {
            const normal = mesh.faceNormals[i];
            const center = mesh.faceCenters[i];
            const start = TransformTools.ModelToScreenPos(center, renderer.transform, this.currentCamera).screen;
            const end = TransformTools.ModelToScreenPos(Vector3.add(center, normal), renderer.transform, this.currentCamera).screen;
            this.DrawLine(start.x, start.y, end.x, end.y, Color.RED, Color.GREEN);
        }
    }

    private DrawDepthBuffer(): void {
        for (let x = 0; x < EngineConfig.canvasWidth; x++) {
            for (let y = 0; y < EngineConfig.canvasHeight; y++) {
                const index = y * EngineConfig.canvasWidth + x;
                const currentDepth = this.depthBuffer[index];
                // 将深度值(0-1)转换为灰度值(0-255)
                const grayValue = Math.floor(currentDepth * 255);
                // 创建灰度颜色对象
                const depthColor = new Color(grayValue, grayValue, grayValue);
                this.DrawPixel(x, y, depthColor.ToUint32());
            }
        }
    }

    private DrawOverdraw(): void {
        this.frameBuffer.fill(Color.BLACK);
        // 使用预设的最大可视化范围来归一化 Overdraw 计数
        const MAX_VISUALIZATION_RANGE = 8;
        for (let x = 0; x < EngineConfig.canvasWidth; x++) {
            for (let y = 0; y < EngineConfig.canvasHeight; y++) {
                const index = y * EngineConfig.canvasWidth + x;
                const overdrawCount = this.overdrawBuffer[index];
                if (overdrawCount > 0) {
                    // 将 Overdraw 计数限制在可视化范围内并归一化
                    const normalizedCount = Math.min(overdrawCount, MAX_VISUALIZATION_RANGE) / MAX_VISUALIZATION_RANGE;
                    // 计算透明度：Overdraw 越多，越不透明
                    const alpha = Math.floor(normalizedCount * 255);
                    // 组合颜色（ARGB格式）
                    const color = Color.FromUint32(Color.ORANGE);
                    color.a = alpha;
                    this.DrawPixel(x, y, color.ToUint32(), false);
                }
            }
        }
    }

    private DrawBound(bounds: Bounds, transform: Transform, color: number) {
        // 将所有顶点转换到屏幕空间
        const screenVertices = bounds.vertices.map(v =>
            TransformTools.ModelToScreenPos(new Vector3(v.x, v.y, v.z), transform, this.currentCamera).screen
        );

        // 绘制所有边
        bounds.edges.forEach(([i1, i2]) => {
            const v1 = screenVertices[i1];
            const v2 = screenVertices[i2];
            // 确保转换后的顶点有效
            if (v1 && v2 && !isNaN(v1.x) && !isNaN(v1.y) && !isNaN(v2.x) && !isNaN(v2.y)) {
                this.DrawLine(v1.x, v1.y, v2.x, v2.y, color);
            }
        });

        // 绘制中心点
        const center = bounds.center;
        const screenCenter = TransformTools.ModelToScreenPos(center, transform, this.currentCamera).screen;
        if (screenCenter) {
            // 绘制一个小十字作为中心点标记
            const size = 5;
            this.DrawLine(
                screenCenter.x - size, screenCenter.y,
                screenCenter.x + size, screenCenter.y,
                Color.RED
            );
            this.DrawLine(
                screenCenter.x, screenCenter.y - size,
                screenCenter.x, screenCenter.y + size,
                Color.RED
            );
        }
    }

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