import { Color } from "./Color";
import { Input } from "./Input";
import { Vector3 } from "./Math/Vector3";
import { Instance } from "./Model";
import { Renderer } from "./Renderer";
import { AssetLoader } from "./Utils/AssetLoader";

// 画布尺寸
const canvasWidth = 400;
const canvasHeight = 600;

// 对象列表
const instances: Instance[] = [];

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取canvas元素和2D渲染上下文
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 设置canvas尺寸
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 创建图像数据对象
    const imageData = ctx.createImageData(canvasWidth, canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    const uint32View = new Uint32Array(imageData.data.buffer);

    // 创建渲染器实例
    const renderer = new Renderer(uint32View, canvasWidth, canvasHeight);

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
    // 加载模型
    AssetLoader.loadInstanceFromModel('Model', 'resources/assets/meshes/lee.obj').then((instance) => {
        instance.transform.position = new Vector3(0, 0, 2);
        instances.push(instance);
    });
}

function Update() {
    for (const instance of instances) {
        // 让物体在所有轴上旋转
        instance.transform.rotation.x += 0.01;
        instance.transform.rotation.y += 0.02;
        instance.transform.rotation.z += 0.015;

        // 使用sin函数实现缩放在0.9到1.1之间循环
        const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 1;
        instance.transform.scale.x = scaleOffset;
        instance.transform.scale.y = scaleOffset;
        instance.transform.scale.z = scaleOffset;
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