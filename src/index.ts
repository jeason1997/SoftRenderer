import { Camera } from "./Compoment/Camera";
import { Color } from "./Color";
import { Config } from "./Config";
import { Input } from "./Input";
import { Vector3 } from "./Math/Vector3";
import { GameObject } from "./GameObject";
import { RasterizationPipeline } from "./RasterizationPipeline";
import { AssetLoader } from "./Utils/AssetLoader";
import { Logger } from "./Logger";
import { SceneManager } from "./Scene/SceneManager";
import { Renderer } from "./Compoment/Renderer";

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
    // ctx.textBaseline = 'middle';

    // 创建图像数据对象
    const imageData = ctx.createImageData(Config.canvasWidth, Config.canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    const uint32View = new Uint32Array(imageData.data.buffer);

    // 创建渲染器实例
    const pipeline = new RasterizationPipeline(uint32View);

    Init();

    // 渲染函数
    function mainLoop() {
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

// 获取鼠标事件
document.addEventListener('mousemove', (event) => {
    // 获取鼠标相对于canvas的坐标
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    Input.mouseX = mouseX;
    Input.mouseY = mouseY;
});

document.addEventListener('wheel', function (event) {
    Input.deltaY = event.deltaY;
    console.log(event.deltaY);
});

document.addEventListener('scrollend', function (event) {
    Input.deltaY = 0;
});

function Init() {
    // 初始化场景
    const mainScene = SceneManager.instance.createScene("MainScene");
    SceneManager.instance.setActiveScene(mainScene);

    // 相机
    const camera = new GameObject("camera");
    mainScene.addGameObject(camera);
    camera.addComponent(Camera);

    let lee: GameObject;
    // 加载模型
    AssetLoader.loadInstanceFromModel('lee', 'resources/assets/meshes/lee.obj').then((instance) => {
        lee = instance;
        instance.transform.position = new Vector3(0, 0, 2);
        mainScene.addGameObject(lee);

    });

    AssetLoader.loadInstanceFromModel('cube', 'resources/cube.obj').then((instance) => {
        instance.transform.position = new Vector3(2, 0, 0);
        instance.transform.scale = new Vector3(0.1, 0.1, 0.1);
        instance.transform.setParent(lee.transform, false);
        mainScene.addGameObject(instance);
    });
}

let angle = 0;
function Update() {
    // 使用场景的update方法更新所有游戏对象
    SceneManager.instance.getActiveScene()?.update();

    // 其他特定的更新逻辑
    // for (const instance of instances) {
    //     if (instance.name == "cube") {
    //         // 使用sin函数实现缩放在0.9到1.1之间循环
    //         const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
    //         const scale = instance.transform.scale;
    //         scale.x = scaleOffset;
    //         scale.y = scaleOffset;
    //         scale.z = scaleOffset;
    //         instance.transform.scale = scale;

    //         instance.transform.rotation = Quaternion.angleAxis(angle, Vector3.FORWARD);
    //         angle += 1;
    //         continue;
    //     }

    //     // 让物体在所有轴上旋转
    //     instance.transform.rotation = Quaternion.angleAxis(angle, Vector3.UP);
    // }
}

function Render(renderer: RasterizationPipeline) {
    renderer.Clear(Color.BLACK);

    // 获取场景中的所有根游戏对象并渲染
    const rootObjects = SceneManager.instance.getActiveScene()?.getRootGameObjects();
    if (rootObjects) {
        for (const gameObject of rootObjects) {
            // 检查游戏对象是否有renderer组件
            if (gameObject.getComponent(Renderer)) {
                renderer.DrawObject(gameObject);
            }
        }
    }
}