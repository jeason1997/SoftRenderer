import { Engine } from "./Core/Engine";

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化引擎
    await Engine.Init();
    // 主循环
    function mainLoop(time: number) {
        Engine.Loop(time);
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});


declare const Float32x4: any; // 声明 SIMD 类型（实际需环境支持）
const supportsSIMD = typeof Float32x4 !== "undefined";
console.log("SIMD 支持:", supportsSIMD);