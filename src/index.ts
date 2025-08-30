import { Camera } from "./Camera";
import { Color } from "./Color";
import { Config } from "./Config";
import { Input } from "./Input";
import { Quaternion } from "./Math/Quaternion";
import { Vector3 } from "./Math/Vector3";
import { Instance } from "./Model";
import { Renderer } from "./Renderer";
import { AssetLoader } from "./Utils/AssetLoader";

// 对象列表
const instances: Instance[] = [];

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取canvas元素和2D渲染上下文
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 设置canvas尺寸
    canvas.width = Config.canvasWidth;
    canvas.height = Config.canvasHeight;

    // 创建图像数据对象
    const imageData = ctx.createImageData(Config.canvasWidth, Config.canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    const uint32View = new Uint32Array(imageData.data.buffer);

    // 创建渲染器实例
    const renderer = new Renderer(uint32View);

    Init();

    // 渲染函数
    function mainLoop() {
        // 处理逻辑
        Update();
        // 渲染
        Render(renderer);
        // 将图像数据绘制到canvas上
        ctx.putImageData(imageData, 0, 0);
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
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

function Init() {
    let lee: Instance;

    // 相机
    const camera = new Camera("camera");
    //camera.transform.position = new Vector3(0, 0, -10);

    // 加载模型
    AssetLoader.loadInstanceFromModel('lee', 'resources/assets/meshes/lee.obj').then((instance) => {
        lee = instance;
        instance.transform.position = new Vector3(0, 0, 2);
        instances.push(instance);
    });

    AssetLoader.loadInstanceFromModel('cube', 'resources/cube.obj').then((instance) => {
        instance.transform.position = new Vector3(1, 0, 0);
        instance.transform.scale = new Vector3(0.1, 0.1, 0.1);
        //instance.transform.rotation = new Quaternion(new Vector3(0, 45, 0));
        instance.transform.setParent(lee.transform, false);
        instances.push(instance);
    });
}

let angle = 0;
function Update() {
    for (const instance of instances) {
        if (instance.name == "cube") {
            // 使用sin函数实现缩放在0.9到1.1之间循环
            const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
            const scale = instance.transform.scale;
            scale.x = scaleOffset;
            scale.y = scaleOffset;
            scale.z = scaleOffset;
            instance.transform.scale = scale;

            instance.transform.rotation = Quaternion.angleAxis(angle, Vector3.FORWARD);
            angle += 1;
            continue;
        }

        // 让物体在所有轴上旋转
        instance.transform.rotation = Quaternion.angleAxis(angle, Vector3.UP);
        // angle += 1;
    }
}

function Render(renderer: Renderer) {
    renderer.Clear(Color.BLACK);

    for (const instance of instances) {
        renderer.DrawObject(instance);
    }

    // 画三角形
    // renderer.DrawTriangleFilledWithVertexColor(0, 0, 100, 100, Input.mouseX, Input.mouseY, Color.RED, Color.GREEN, Color.BLUE);
}