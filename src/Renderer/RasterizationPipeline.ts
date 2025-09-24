import { Color } from "../Math/Color";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Transform } from "../Core/Transform";
import { Renderer } from "../Component/Renderer";
import { MeshRenderer } from "../Component/MeshRenderer";
import { Camera, CameraClearFlags } from "../Component/Camera";
import { Engine } from "../Core/Engine";
import { EngineConfig, RenderSettings } from "../Core/Setting";
import { Mesh } from "../Resources/Mesh";
import { BarycentricTriangleRasterizer } from "./BarycentricTriangleRasterizer"
import { TransformTools } from "../Math/TransformTools";
import { Debug } from "../Utils/Debug";
import { BlendOp, CullMode, depthTest, StencilOp, Stencil, stencilTest, StencilCompareFunction, ZTest, ColorMask, applyColorMask, RenderType, applyStencilOperation } from "./RendererDefine";
import { GameObject } from "../Core/GameObject";
import { Gizmo } from "../Utils/Gizmo";

enum DrawMode {
    Wireframe = 1,
    Point = 2,
    Shader = 4,
}

export class RasterizationPipeline {
    public drawMode: DrawMode = DrawMode.Shader;

    // 缓冲区
    private frameBuffer: Uint32Array;
    private depthBuffer: Float32Array;
    private stencilBuffer: Uint8Array;
    private overdrawBuffer: Uint32Array;

    // 上下文内容
    private currentCamera: Camera;
    private currentRendererObjs: MeshRenderer[];

    constructor(frameBuffer: Uint32Array) {
        this.frameBuffer = frameBuffer;
        this.depthBuffer = new Float32Array(EngineConfig.canvasWidth * EngineConfig.canvasHeight);
        this.stencilBuffer = new Uint8Array(EngineConfig.canvasWidth * EngineConfig.canvasHeight);
        this.overdrawBuffer = new Uint32Array(EngineConfig.canvasWidth * EngineConfig.canvasHeight);
    }

    public Render() {
        const rootObject = Engine.sceneManager.getActiveScene()?.getRootGameObject();
        if (rootObject) {
            const cameras = Camera.cameras;
            // 相机depth越低越早渲染
            cameras.sort((a, b) => a.depth - b.depth);
            // 每个相机渲染一遍
            for (let i = 0, len = cameras.length; i < len; i++) {
                this.currentCamera = cameras[i];
                this.Clear(this.currentCamera);
                this.currentRendererObjs = rootObject.getComponentsInChildren(MeshRenderer);
                // 渲染管线1.视锥体剔除
                //TODO

                // 渲染管线2.按照先不透明再天空盒再透明的顺序绘画
                // 渲染不透明物体：排序场景物体，按照相机空间进行Z轴排序，先绘制近的，降低overdraw
                for (const render of this.currentRendererObjs) {
                    this.DrawObject(render);
                    // Debug.Log(render.gameObject.name);
                }
                // 绘制天空盒
                this.DrawSkybox(this.currentCamera);
                // 绘制透明物体：排序场景物体，按照相机空间进行Z轴排序，先绘制远的，颜色混合才能正确
                //TOOD
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
            this.clearViewportRegion(this.frameBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, 0);
        }
        else if (clearFlags == CameraClearFlags.Color) {
            this.clearViewportRegion(this.frameBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, backgroundColor.ToUint32());
        }

        if (clearFlags != CameraClearFlags.None) {
            this.clearViewportRegion(this.depthBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, 1);
            this.clearViewportRegion(this.stencilBuffer, viewportPixelX, viewportPixelY, viewportPixelWidth, viewportPixelHeight, 0);
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
    private clearViewportRegion(buffer: Uint32Array | Float32Array | Uint8Array, x: number, y: number, width: number, height: number, value: number): void {
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

    private DrawSkybox(camera: Camera): void {
        if (camera.clearFlags !== CameraClearFlags.Skybox) return;
        if (!RenderSettings.skybox) return;

        // 获取相机的视图和投影矩阵
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        // 计算逆视图投影矩阵，用于将屏幕坐标转换为世界方向
        const invViewProj = projectionMatrix.multiply(viewMatrix).invert();

        // 视口像素范围计算
        const viewport = camera.viewPort;
        const viewportPixelX = Math.floor(viewport.x * EngineConfig.canvasWidth);
        const viewportPixelY = Math.floor(viewport.y * EngineConfig.canvasHeight);
        const viewportPixelWidth = Math.floor(viewport.z * EngineConfig.canvasWidth);
        const viewportPixelHeight = Math.floor(viewport.w * EngineConfig.canvasHeight);

        // 遍历视口内的像素
        for (let y = viewportPixelY; y < viewportPixelY + viewportPixelHeight; y++) {
            for (let x = viewportPixelX; x < viewportPixelX + viewportPixelWidth; x++) {
                // 检查深度缓冲，如果该像素已有物体则跳过
                const depth = this.depthBuffer[y * EngineConfig.canvasWidth + x];
                if (depth < 0.999) continue; // 使用接近1的值避免精度问题

                // 将屏幕坐标转换为标准化设备坐标(NDC)
                const ndcX = (x / EngineConfig.canvasWidth) * 2 - 1;
                const ndcY = 1 - (y / EngineConfig.canvasHeight) * 2; // 翻转Y轴，因为屏幕坐标Y向下为正

                // 创建NDC空间中的点（远平面）
                const ndcPos = new Vector4(ndcX, ndcY, 1.0, 1.0);

                // 将NDC坐标转换为世界空间方向
                const worldDir = invViewProj.multiplyVector4(ndcPos);
                const direction = new Vector3(worldDir.x, worldDir.y, worldDir.z).normalize();

                // 采样天空盒并绘制像素
                const skyColor = RenderSettings.skybox.SampleCube(direction);
                this.DrawPixel(x, y, skyColor);
            }
        }
    }

    public DrawPixel(x: number, y: number, color: Color, countOverdraw: boolean = false) {
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
        this.frameBuffer[index] = color.ToUint32();
        // Overdraw计数
        if (countOverdraw) this.overdrawBuffer[index]++
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color1: Color, color2?: Color) {
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

    public DrawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: Color) {
        this.DrawLine(x1, y1, x2, y2, color);
        this.DrawLine(x2, y2, x3, y3, color);
        this.DrawLine(x3, y3, x1, y1, color);
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
            const out = TransformTools.ModelToScreenPos(vertices[i], transform.localToWorldMatrix, this.currentCamera);
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
    public FaceCulling(triangles: number[], mesh: Mesh, renderer: Renderer, cullMode: CullMode) {
        if (cullMode === CullMode.None) return triangles;

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
            if ((cullMode === CullMode.Back && dot > 0) || (cullMode === CullMode.Front && dot < 0)) {
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

    public DrawObject(renderer: MeshRenderer) {
        const mesh = renderer.mesh;
        if (!mesh) return;

        const shader = renderer.material.shader;
        if (!shader) return;
        shader.init(renderer.transform, this.currentCamera);

        // 渲染所有通道
        shader.passes.forEach(pass => {
            const renderType = shader.renderType;
            const renderState = pass.renderState || {};
            const colorMask = renderState.colorMask || ColorMask.All;
            const cullMode = renderState.cullMode || CullMode.Back;
            const zTest = renderState.zTest || ZTest.Less;
            const zWrite = pass.renderState?.zWrite ?? true;
            const blendState = pass.renderState?.blend?.state;
            const stencil = pass.renderState?.stencil;

            let triangles = mesh.triangles;

            // 渲染管线3.背面剔除
            triangles = this.FaceCulling(triangles, mesh, renderer, cullMode);
            // 渲染管线4.遮挡剔除
            this.OcclusionCulling();

            for (let i = 0; i < triangles.length; i += 3) {
                // 渲染管线5.顶点着色器
                const { vertexOut: v1, attrOut: v1Attr } = pass.vert({
                    vertex: mesh.vertices[triangles[i]],
                    uv: mesh.uv[triangles[i]],
                    normal: mesh.normals[triangles[i]],
                    tangent: mesh.tangents[triangles[i]],
                });
                const { vertexOut: v2, attrOut: v2Attr } = pass.vert({
                    vertex: mesh.vertices[triangles[i + 1]],
                    uv: mesh.uv[triangles[i + 1]],
                    normal: mesh.normals[triangles[i + 1]],
                    tangent: mesh.tangents[triangles[i + 1]],
                });
                const { vertexOut: v3, attrOut: v3Attr } = pass.vert({
                    vertex: mesh.vertices[triangles[i + 2]],
                    uv: mesh.uv[triangles[i + 2]],
                    normal: mesh.normals[triangles[i + 2]],
                    tangent: mesh.tangents[triangles[i + 2]],
                });

                // 渲染管线6.屏幕映射
                const p1 = TransformTools.ClipToScreenPos(v1, this.currentCamera);
                const p2 = TransformTools.ClipToScreenPos(v2, this.currentCamera);
                const p3 = TransformTools.ClipToScreenPos(v3, this.currentCamera);

                // 渲染管线7.裁剪
                // 画三角形前要进行边检查，确保三角形的三个点都在屏幕内，如果有点超出屏幕范围，则裁剪，并生成新的三角形
                // 简单粗暴的裁剪，有点在屏幕外直接抛弃
                const w = EngineConfig.canvasWidth;
                const h = EngineConfig.canvasHeight;
                if (((p1.x | p1.y) < 0) || (p1.x >= w) || (p1.y >= h) || ((p2.x | p2.y) < 0) || (p2.x >= w) || (p2.y >= h) || ((p3.x | p3.y) < 0) || (p3.x >= w) || (p3.y >= h)) {
                    continue;
                }

                if (this.drawMode & DrawMode.Wireframe) {
                    this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color.WHITE);
                }
                if (this.drawMode & DrawMode.Point) {
                    this.DrawPixel(p1.x, p1.y, Color.WHITE);
                    this.DrawPixel(p2.x, p2.y, Color.WHITE);
                    this.DrawPixel(p3.x, p3.y, Color.WHITE);
                }
                if (this.drawMode & DrawMode.Shader) {
                    // 渲染管线8.光栅化
                    const fragments = BarycentricTriangleRasterizer.rasterizeTriangle(p1, p2, p3, v1Attr, v2Attr, v3Attr);

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

                        // 获取当前缓冲区里的值
                        const index = y * EngineConfig.canvasWidth + x;
                        const currentBufferColor = Color.FromUint32(this.frameBuffer[index]);
                        const currentBufferDepth = this.depthBuffer[index];
                        const currentBufferStencil = this.stencilBuffer[index];

                        // 渲染管线9.早期深度测试
                        const depthTestResult = depthTest(z, currentBufferDepth, zTest);
                        if (!depthTestResult) continue;

                        // 渲染管线10.模板测试
                        if (stencil) {
                            const stencilTestResult = stencilTest(currentBufferStencil, stencil.ref, stencil.comparisonOperation, stencil.readMask);
                            // 执行模板操作（根据测试结果和深度测试结果）
                            let operation: StencilOp | undefined;
                            if (stencilTestResult) { operation = depthTestResult ? stencil.passOperation : stencil.zFailOperation; }
                            else { operation = stencil.failOperation; }
                            // 应用操作更新模板值
                            const newValue = applyStencilOperation(currentBufferStencil, stencil.ref, operation, stencil.writeMask);
                            // 更新模板缓冲区
                            this.stencilBuffer[index] = newValue;
                            // 模板测试失败跳过像素
                            if (!stencilTestResult) continue;
                        }

                        // 渲染管线11.像素着色器
                        const pixelColor = pass.frag(fragment.attributes);
                        // 像素被丢弃，可能是Alpha测试失败
                        if (!pixelColor) continue;

                        // 渲染管线12.根据 zWrite 标志决定是否写入深度缓冲区
                        // 如果没设置zWrite，则默认允许写入，否则就判断zWrite值
                        if (zWrite) {
                            this.depthBuffer[index] = z;
                        }

                        // 渲染管线13.颜色混合
                        if (blendState) {
                            // const existingColor = Color.FromUint32(this.frameBuffer[index]);
                            // const blendedColor = Color.blendColors(existingColor, color, blendMode);
                            // this.frameBuffer[index] = blendedColor.ToUint32();
                        }

                        // 渲染管线13.绘制像素到帧缓冲
                        // 根据颜色掩码决定最终写入的分量（未启用的通道保留原有值）
                        applyColorMask(pixelColor, currentBufferColor, colorMask);
                        // 如果是不透明着色，alpha通道强行输出1
                        if (renderType === RenderType.Opaque) pixelColor.a = 1;
                        this.DrawPixel(x, y, pixelColor, true);
                    }
                }
            }
        });
    }

    //#endregion

    //#region 工具函数

    private DebugDraw(): void {
        // 绘制包围盒
        // this.DrawBounds();

        // 绘制法线跟切线
        // this.DrawNormal();

        // 绘制深度纹理
        // this.DrawDepthBuffer();

        // 绘制Overdarw
        // this.DrawOverdraw();

        // 绘制物理调试信息
        // PhysicsDebugDraw.DrawPhysicsDebug(this.DrawLine.bind(this));

        // 绘制Gizmo
        this.DrawGizmo(Engine.sceneManager.getActiveScene()?.getRootGameObject() || null);

        // 绘制调试线
        const lines = Debug.GetDebugLines();
        lines.forEach(line => {
            this.DrawLine(line.start.x, line.start.y, line.end.x, line.end.y, line.color);
        });
    }

    private DrawGizmo(obj: GameObject | null): void {
        if (!obj) return;
        const components = obj.getAllComponents();
        for (const component of components) {
            if (typeof (component as any).onDrawGizmos === 'function') {
                (component as any).onDrawGizmos();
                Gizmo.Reset();
            }
        }
        // 绘制子物体
        for (const child of obj.transform.children) {
            this.DrawGizmo(child.gameObject);
        }
    }

    private DrawNormal(): void {
        for (const renderer of this.currentRendererObjs) {
            const mesh = renderer.mesh;
            if (!mesh) return;
            const modelMatrix = renderer.transform.localToWorldMatrix;

            // 面法线
            // for (let i = 0; i < mesh.faceNormals.length; i++) {
            //     const normal = mesh.faceNormals[i];
            //     const center = mesh.faceCenters[i];
            //     const start = TransformTools.ModelToScreenPos(center, renderer.transform, this.currentCamera).screen;
            //     const end = TransformTools.ModelToScreenPos(Vector3.add(center, Vector3.multiplyScalar(normal, 0.1)), renderer.transform, this.currentCamera).screen;
            //     this.DrawLine(start.x, start.y, end.x, end.y, Color.RED, Color.GREEN);
            // }

            // 顶点法线、切线、副切线
            for (let i = 0; i < mesh.vertices.length; i++) {
                const vertex = mesh.vertices[i];
                const normal = mesh.normals[i];
                const tangent = mesh.tangents[i];

                // 确保我们有必要的数据
                if (!normal || !tangent) continue;
                // 从切线向量提取w分量（用于计算副切线方向）
                const tangentW = tangent.w;
                // 从切线向量获取xyz分量作为切线方向
                const tangentDir = new Vector3(tangent.x, tangent.y, tangent.z).normalize();
                // 计算副切线 (Bitangent) = 法线 × 切线 × w分量
                const bitangentDir = Vector3.cross(normal, tangentDir).multiplyScalar(tangentW).normalize();
                // 将顶点位置转换到屏幕空间
                const vertexScreenPos = TransformTools.ModelToScreenPos(vertex, modelMatrix, this.currentCamera).screen;
                // 定义线的长度
                const lineLength = 0.1;

                // 1. 绘制法线 - 红色
                const normalEnd = Vector3.add(vertex, Vector3.multiplyScalar(normal, lineLength));
                const normalScreenEnd = TransformTools.ModelToScreenPos(normalEnd, modelMatrix, this.currentCamera).screen;
                this.DrawLine(vertexScreenPos.x, vertexScreenPos.y, normalScreenEnd.x, normalScreenEnd.y, Color.RED);

                // 2. 绘制切线 - 绿色
                const tangentEnd = Vector3.add(vertex, Vector3.multiplyScalar(tangentDir, lineLength));
                const tangentScreenEnd = TransformTools.ModelToScreenPos(tangentEnd, modelMatrix, this.currentCamera).screen;
                this.DrawLine(vertexScreenPos.x, vertexScreenPos.y, tangentScreenEnd.x, tangentScreenEnd.y, Color.GREEN);

                // 3. 绘制副切线 - 黄色
                const bitangentEnd = Vector3.add(vertex, Vector3.multiplyScalar(bitangentDir, lineLength));
                const bitangentScreenEnd = TransformTools.ModelToScreenPos(bitangentEnd, modelMatrix, this.currentCamera).screen;
                this.DrawLine(vertexScreenPos.x, vertexScreenPos.y, bitangentScreenEnd.x, bitangentScreenEnd.y, Color.YELLOW);
            }
        }
    }

    private DrawDepthBuffer(): void {
        for (let x = 0; x < EngineConfig.canvasWidth; x++) {
            for (let y = 0; y < EngineConfig.canvasHeight; y++) {
                const index = y * EngineConfig.canvasWidth + x;
                const currentDepth = this.depthBuffer[index];
                // 创建灰度颜色对象
                const depthColor = new Color(currentDepth, currentDepth, currentDepth);
                this.DrawPixel(x, y, depthColor);
            }
        }
    }

    private DrawOverdraw(): void {
        this.frameBuffer.fill(0);
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
                    const alpha = normalizedCount;
                    // 组合颜色（ARGB格式）
                    const color = Color.ORANGE;
                    color.a = alpha;
                    this.DrawPixel(x, y, color);
                }
            }
        }
    }

    private DrawBounds() {
        for (const renderer of this.currentRendererObjs) {
            const mesh = renderer.mesh;
            if (!mesh) return;
            const modelMatrix = renderer.transform.localToWorldMatrix;

            const transform = renderer.transform;
            const bounds = mesh.bounds;
            const color = Color.WHITE;

            const bound = bounds[0];

            // 将所有顶点转换到屏幕空间
            const screenVertices = bound.vertices.map(v =>
                TransformTools.ModelToScreenPos(new Vector3(v.x, v.y, v.z), modelMatrix, this.currentCamera).screen
            );

            // 绘制所有边
            bound.edges.forEach(([i1, i2]) => {
                const v1 = screenVertices[i1];
                const v2 = screenVertices[i2];
                // 确保转换后的顶点有效
                if (v1 && v2 && !isNaN(v1.x) && !isNaN(v1.y) && !isNaN(v2.x) && !isNaN(v2.y)) {
                    this.DrawLine(v1.x, v1.y, v2.x, v2.y, color);
                }
            });

            // 绘制中心点
            const center = bound.center;
            const screenCenter = TransformTools.ModelToScreenPos(center, modelMatrix, this.currentCamera).screen;
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
    }

    /**
     * 颜色插值辅助函数
     * @param color1 起始颜色 (32位整数，格式为0xAARRGGBB)
     * @param color2 结束颜色 (32位整数，格式为0xAARRGGBB)
     * @param t 插值因子 (0 到 1)
     * @returns 插值后的颜色
     */
    private interpolateColor(color1: Color, color2: Color, t: number): Color {
        // 提取ARGB分量
        const a1 = color1.a;
        const r1 = color1.r;
        const g1 = color1.g;
        const b1 = color1.b;

        const a2 = color2.a;
        const r2 = color2.r;
        const g2 = color2.g;
        const b2 = color2.b;

        // 线性插值每个分量
        const a = Math.round(a1 + (a2 - a1) * t);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return new Color(r, g, b, a);
    }

    //#endregion
}