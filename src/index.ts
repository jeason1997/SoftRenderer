import { Engine } from "./Core/Engine";

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 主循环
    function mainLoop(time: number) {
        Engine.Loop(time);
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});