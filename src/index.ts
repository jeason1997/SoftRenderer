import { Config } from "./Config";
import { Logger } from "./Logger";
import { SceneManager } from "./Scene/SceneManager";
import { RasterizationPipeline } from "./RasterizationPipeline";
import { Input } from "./Input";
import { AssetLoader } from "./Utils/AssetLoader";
import { GameObject } from "./GameObject";
import { Vector3 } from "./Math/Vector3";
import { Camera } from "./Component/Camera";
import { Renderer } from "./Component/Renderer";
import { MeshRenderer } from "./Component/MeshRenderer";
import { ObjRotate } from "./Component/ObjRotate";
import { Color } from "./Color";
import { CameraController } from "./Component/CameraController";

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取canvas元素和2D渲染上下文
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 设置canvas尺寸
    canvas.width = Config.canvasWidth;
    canvas.height = Config.canvasHeight;

    // 设置文本样式
    ctx.font = 'Arial';
    ctx.textAlign = 'left';

    // 创建图像数据对象
    const imageData = ctx.createImageData(Config.canvasWidth, Config.canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    const uint32View = new Uint32Array(imageData.data.buffer);

    // 创建渲染器实例
    const pipeline = new RasterizationPipeline(uint32View);

    // 初始化输入系统
    Input.initialize();
    
    InitScene();
    
    // 渲染函数
    function mainLoop() {
        // 更新输入状态
        Input.update();
        // 处理逻辑
        Update();
        // 渲染
        Render(pipeline);
        // 将图像数据绘制到canvas上
        ctx.putImageData(imageData, 0, 0);
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
        // 屏幕输出日志
        Logger.printLogs(ctx);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});

function InitScene() {
    // 初始化场景
    const mainScene = SceneManager.instance.createScene("MainScene");
    SceneManager.instance.setActiveScene(mainScene);

    // 相机
    const camera = new GameObject("camera");
    mainScene.addGameObject(camera);
    camera.addComponent(Camera);
    //camera.addComponent(CameraController);

    let lee: GameObject;
    // 加载模型
    AssetLoader.loadModel('lee', 'resources/assets/meshes/lee.obj').then((model) => {
        lee = new GameObject("lee");
        lee.transform.position = new Vector3(0, 0, 2);
        const renderer = lee.addComponent(MeshRenderer);
        renderer.mesh = model;
        lee.addComponent(ObjRotate);
        mainScene.addGameObject(lee);
    });

    AssetLoader.loadModel('cube', 'resources/cube.obj').then((model) => {
        const cube = new GameObject("cube");
        cube.transform.position = new Vector3(2, 0, 0);
        cube.transform.scale = new Vector3(0.1, 0.1, 0.1);
        const renderer = cube.addComponent(MeshRenderer);
        renderer.mesh = model;
        cube.addComponent(ObjRotate);
        cube.transform.setParent(lee.transform, false);
    });
}

function Update() {
    // 使用场景的update方法更新所有游戏对象
    SceneManager.instance.getActiveScene()?.update();
}

function Render(pipeline: RasterizationPipeline) {
    pipeline.Clear(Color.BLACK);

    // 获取场景中的所有根游戏对象并渲染
    const rootObjects = SceneManager.instance.getActiveScene()?.getRootGameObjects();
    if (rootObjects) {
        for (const gameObject of rootObjects) {
            // 显式指定类型参数
            const renders = gameObject.getComponentsInChildren(Renderer);
            for (const render of renders) {
                pipeline.DrawObject(render);
                Logger.log(render.gameObject.name);
            }
        }
    }
}