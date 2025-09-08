import { Input } from "./Input";
import { RasterizationPipeline } from "./RasterizationPipeline";
import { MainScene } from "./Scene/MainScene";
import { SceneManager } from "./Scene/SceneManager";

export class Engine {
    public static sceneManager: SceneManager = new SceneManager();
    public static canvas: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;
    public static deltaTime: number = 1 / 60;
    public static pipeline: RasterizationPipeline;
    public static imageData: ImageData;

    public static Init() {
        // 获取canvas元素和2D渲染上下文
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        // 设置canvas尺寸
        this.canvas.width = EngineConfig.canvasWidth;
        this.canvas.height = EngineConfig.canvasHeight;
        // 设置文本样式
        this.context.font = 'Arial';
        this.context.textAlign = 'left';

        // 创建图像数据对象
        this.imageData = Engine.context.createImageData(EngineConfig.canvasWidth, EngineConfig.canvasHeight);
        // 创建32位无符号整型数组视图，用于直接操作像素数据
        const uint32View = new Uint32Array(this.imageData.data.buffer);
        // 创建渲染器实例
        this.pipeline = new RasterizationPipeline(uint32View);

        // 初始化场景
        this.sceneManager.loadScene(MainScene);
        // 初始化输入系统
        Input.initialize();
    }

    public static Update() {
        // 使用场景的update方法更新所有游戏对象
        this.sceneManager.getActiveScene()?.update();
        // 更新输入状态(注：输入已经由WEB引擎在每帧开始之前获取了，这里是更新输入的上一帧状态)
        Input.update();
    }

    public static Render() {
        this.pipeline.Render();
        // 将图像数据绘制到canvas上
        this.context.putImageData(this.imageData, 0, 0);
    }
}

export class EngineConfig {
    public static canvasWidth: number = 400;
    public static canvasHeight: number = 400;
    public static halfCanvasWidth: number = EngineConfig.canvasWidth >> 1;
    public static halfCanvasHeight: number = EngineConfig.canvasHeight >> 1;
    public static aspectRatio: number = EngineConfig.canvasWidth / EngineConfig.canvasHeight;
}