import { Color } from "./Color";
import { Input } from "./Input";
import { Instance, Model, Transform } from "./Model";
import { Renderer } from "./Renderer";
import { Vector3 } from "./Vector3";

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
    const model = new Model();
    model.name = "立方体";
    model.vertices = [
        new Vector3(-0.5, -0.5, -0.5), // Original (-2, -0.5, 5) -> (-2+1.5, -0.5+0, 5-5.5)
        new Vector3(-0.5, 0.5, -0.5), // Original (-2,  0.5, 5) -> (-2+1.5, 0.5+0, 5-5.5)
        new Vector3(0.5, 0.5, -0.5), // Original (-1,  0.5, 5) -> (-1+1.5, 0.5+0, 5-5.5)
        new Vector3(0.5, -0.5, -0.5), // Original (-1, -0.5, 5) -> (-1+1.5, -0.5+0, 5-5.5)
        new Vector3(-0.5, -0.5, 0.5), // Original (-2, -0.5, 6) -> (-2+1.5, -0.5+0, 6-5.5)
        new Vector3(-0.5, 0.5, 0.5), // Original (-2,  0.5, 6) -> (-2+1.5, 0.5+0, 6-5.5)
        new Vector3(0.5, 0.5, 0.5), // Original (-1,  0.5, 6) -> (-1+1.5, 0.5+0, 6-5.5)
        new Vector3(0.5, -0.5, 0.5)  // Original (-1, -0.5, 6) -> (-1+1.5, -0.5+0, 6-5.5)
    ];
    model.vertexColors = [
        Color.RED,
        Color.GREEN,
        Color.BLUE,
        Color.YELLOW,
        Color.MAGENTA,
        Color.CYAN,
        Color.WHITE,
        Color.ORANGE,
    ];
    model.triangles = [
        [0, 1, 2],
        [0, 2, 3],
        [4, 5, 6],
        [4, 6, 7],
        [0, 4, 7],
        [0, 7, 3],
        [1, 5, 6],
        [1, 6, 2],
        [0, 4, 5],
        [0, 5, 1],
        [2, 6, 7],
        [2, 7, 3],
    ];

    const cubeInstance = new Instance();
    cubeInstance.model = model;
    cubeInstance.transform = new Transform();
    cubeInstance.transform.position = new Vector3(0, 0, 3);
    cubeInstance.transform.rotation = new Vector3(350, 50, 0);
    cubeInstance.transform.scale = new Vector3(1, 1, 1);
    cubeInstance.shader = true;
    instances.push(cubeInstance);

    const cubeInstance2 = new Instance();
    cubeInstance2.model = model;
    cubeInstance2.transform = new Transform();
    cubeInstance2.transform.position = new Vector3(1, 1, 3);
    cubeInstance2.transform.rotation = new Vector3(0, 0, 0);
    cubeInstance2.transform.scale = new Vector3(0.5, 0.5, 0.5);
    cubeInstance2.shader = false;
    instances.push(cubeInstance2);
}

function Update() {
    for (const instance of instances) {
        // 让物体在所有轴上旋转
        instance.transform.rotation.x += 0.01;
        instance.transform.rotation.y += 0.02;
        instance.transform.rotation.z += 0.015;

        // 使用sin函数实现缩放在0.9到1.1之间循环
        // const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 1;
        // instance.transform.scale.x = scaleOffset;
        // instance.transform.scale.y = scaleOffset;
        // instance.transform.scale.z = scaleOffset;
    }
}

function Render(renderer: Renderer) {
    renderer.Clear(Color.BLACK);

    for (const instance of instances) {
        renderer.DrawObject(instance, !instance.shader);
    }

    // 画三角形
    // renderer.DrawTriangleFilledWithVertexColor(0, 0, 100, 100, Input.mouseX, Input.mouseY, Color.RED, Color.GREEN, Color.BLUE);
}