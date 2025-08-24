import { Renderer } from "./Renderer";

// 画布尺寸
const canvasWidth = 400;
const canvasHeight = 400;

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

    // 渲染函数
    function render() {
        // 渲染
        renderer.Render();
        // 将图像数据绘制到canvas上
        ctx.putImageData(imageData, 0, 0);
        // 请求下一帧动画
        requestAnimationFrame(render);
    }
    // 开始动画循环
    requestAnimationFrame(render);
});
