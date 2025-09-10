import { Logger } from "./Logger";

/**
 * FPS 计数器工具类：计算并记录实时帧率
 */
export class FPSCounter {
    private frameTimes: number[]; // 存储最近N帧的时间戳，用于平滑计算FPS
    private maxFrameSamples: number; // 最大采样帧数（采样越多，FPS越平滑，默认30帧）
    private lastFrameTime: number; // 上一帧的时间戳（毫秒）
    public currentFPS: number; // 当前实时FPS

    constructor(maxFrameSamples: number = 30) {
        this.maxFrameSamples = maxFrameSamples;
        this.frameTimes = [];
        this.lastFrameTime = performance.now(); // 初始化时间戳（使用高精度性能计时器）
        this.currentFPS = 0; // 初始FPS为0
    }

    /**
     * 每帧更新：记录当前帧时间，计算FPS
     */
    public update() {
        const now = performance.now();
        const frameDelta = now - this.lastFrameTime; // 当前帧与上一帧的时间间隔（毫秒）
        this.lastFrameTime = now;

        // 1. 存储当前帧的时间间隔（用于平滑计算）
        this.frameTimes.push(frameDelta);
        // 2. 限制采样数量（超过最大采样数时，移除最早的帧）
        if (this.frameTimes.length > this.maxFrameSamples) {
            this.frameTimes.shift();
        }

        // 3. 计算平均帧间隔（毫秒）
        const averageFrameDelta = this.frameTimes.reduce((sum, delta) => sum + delta, 0) / this.frameTimes.length;
        // 4. 计算FPS（FPS = 1000ms / 平均帧间隔）
        this.currentFPS = averageFrameDelta > 0 ? Math.round(1000 / averageFrameDelta) : 0;

        Logger.log(this.getFPSString());
    }

    /**
     * 获取FPS文本（带格式，便于日志输出）
     */
    public getFPSString(): string {
        return `FPS: ${this.currentFPS}`;
    }
}