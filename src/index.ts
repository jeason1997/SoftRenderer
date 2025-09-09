import { Engine } from "./Core/Engine";
import { Logger } from "./Utils/Logger";

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化引擎
    Engine.Init();

    // 主循环
    function mainLoop() {
        // 处理逻辑
        Engine.Update();
        // 渲染
        Engine.Render();
        // 屏幕输出日志
        Logger.printLogs();
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});