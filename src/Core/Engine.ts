import { Input } from "./Input";
import { RasterizationPipeline } from "../Renderer/RasterizationPipeline";
import { MainScene } from "../Scene/MainScene";
import { SceneManager } from "../Scene/SceneManager";
import { Logger } from "../Utils/Logger";
import { Time } from "./Time";
import { TweenManager } from "./TweenManager";
import { PhysicsEngine } from "../Physics/PhysicsEngine";

export class Engine {
    public static sceneManager: SceneManager = new SceneManager();
    public static physicsEngine: PhysicsEngine = new PhysicsEngine();
    public static canvas: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;
    public static pipeline: RasterizationPipeline;
    public static imageData: ImageData;
    private static isInit: boolean = false;

    private static Init() {
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

        // 初始化物理引擎
        this.physicsEngine.init();
        // 初始化场景
        this.sceneManager.loadScene(MainScene);
        // 初始化输入系统
        Input.initialize();

        this.isInit = true;
    }

    public static Loop(time: number) {
        if (!this.isInit) {
            this.Init();
        }
        
        Logger.log(Math.floor(1 / Time.deltaTime).toString());

        // 1. 更新时间数据：判断当前帧是否需要执行（受 maxFps 影响）
        const shouldExecuteFrame = Time.updateFrame();
        // if (!shouldExecuteFrame) {
        //     return;
        // }

        // 2. 固定更新（对应 Unity FixedUpdate，例如物理引擎、AI逻辑）
        Time.updateFixedTime(() => {
            Engine.FixedUpdate(); // 你的固定逻辑更新（如物理碰撞、技能CD）
        });

        // 3. 普通逻辑更新（对应 Unity Update，受 deltaTime 影响）
        Engine.Update(); // 例如：角色移动（速度 * Time.deltaTime 确保帧率无关）

        // 4. 更新输入状态(注：输入已经由WEB引擎在每帧开始之前获取了，这里是更新输入的上一帧状态)
        Input.update();

        // 5. 渲染
        Engine.Render();

        // 6. 屏幕输出日志
        Logger.printLogs();
    }

    private static Update() {
        // 使用场景的update方法更新所有游戏对象
        this.sceneManager.getActiveScene()?.update();
        // 更新动画
        TweenManager.update();
    }

    private static FixedUpdate() {
        this.physicsEngine.update();
    }

    private static Render() {
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