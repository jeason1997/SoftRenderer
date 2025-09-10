/**
 * 模仿 Unity Time 类：提供时间管理、帧率控制、时间缩放等核心功能
 * 核心特性：
 * 1. deltaTime：上一帧到当前帧的时间间隔（受 timeScale 影响）
 * 2. unscaledDeltaTime：不受 timeScale 影响的原始帧间隔
 * 3. time：游戏启动到现在的总时间（受 timeScale 影响）
 * 4. fixedTime：固定时间步长的累计时间（用于物理/固定逻辑更新）
 * 5. timeScale：时间缩放系数（0=暂停，1=正常，>1=加速，<1=减速）
 */
export class Time {
    // ========================== 静态属性（对应 Unity Time 静态接口）==========================
    /** 上一帧到当前帧的时间间隔（秒），受 timeScale 影响（暂停时为 0） */
    public static deltaTime: number = 0;

    /** 上一帧到当前帧的原始时间间隔（秒），不受 timeScale 影响（暂停时仍为真实时间间隔） */
    public static unscaledDeltaTime: number = 0;

    /** 游戏启动到现在的总时间（秒），受 timeScale 影响（暂停时不增加） */
    public static time: number = 0;

    /** 游戏启动到现在的原始总时间（秒），不受 timeScale 影响（暂停时仍增加） */
    public static unscaledTime: number = 0;

    /** 固定时间步长（秒），用于物理更新/固定逻辑更新（默认 0.02 秒 = 50 次/秒，对应 Unity fixedDeltaTime） */
    public static fixedDeltaTime: number = 0.02;

    /** 固定时间步长的累计时间（秒），用于触发固定更新（对应 Unity fixedTime） */
    public static fixedTime: number = 0;

    /** 时间缩放系数（0 = 暂停，1 = 正常速度，2 = 2倍速，0.5 = 0.5倍速） */
    public static timeScale: number = 1;

    /** 帧率限制（默认无限制，设为 30/60 可固定帧率） */
    public static maxFps: number | null = null;

    // ========================== 私有成员（内部计时逻辑）==========================
    /** 上一帧的时间戳（毫秒，用于计算帧间隔） */
    private static lastFrameTime: number = performance.now();

    /** 固定时间步长的累计余数（避免固定更新丢失精度） */
    private static fixedTimeRemainder: number = 0;

    /** 是否已初始化（确保仅启动一次计时） */
    private static isInitialized: boolean = false;


    // ========================== 核心方法（需集成到渲染循环）==========================
    /**
     * 每帧更新时间数据（必须在主循环中调用，对应 Unity 帧生命周期）
     * @returns 该帧是否需要执行（用于帧率限制）
     */
    public static updateFrame(): boolean {
        // 初始化：记录第一帧时间
        if (!this.isInitialized) {
            this.lastFrameTime = performance.now();
            this.isInitialized = true;
            return true;
        }

        // 1. 计算当前帧的原始时间间隔（毫秒转秒）
        const currentTime = performance.now();
        const rawDeltaMs = currentTime - this.lastFrameTime;
        this.unscaledDeltaTime = rawDeltaMs / 1000; // 原始帧间隔（不受 timeScale 影响）

        // 2. 帧率限制逻辑：若设置 maxFps，判断是否达到目标帧间隔
        if (this.maxFps !== null) {
            const targetFrameMs = 1000 / this.maxFps; // 目标帧间隔（毫秒）
            if (rawDeltaMs < targetFrameMs) {
                return false; // 未达到目标间隔，不执行当前帧
            }
        }

        // 3. 更新受 timeScale 影响的时间属性
        this.deltaTime = this.unscaledDeltaTime * this.timeScale; // 受缩放的帧间隔
        this.time += this.deltaTime; // 总时间（受缩放）
        this.unscaledTime += this.unscaledDeltaTime; // 原始总时间（不受缩放）

        // 4. 更新固定时间步长累计（用于物理/固定更新）
        this.updateFixedTime();

        // 5. 记录当前时间，为下一帧做准备
        this.lastFrameTime = currentTime;
        return true; // 允许执行当前帧逻辑
    }

    /**
     * 固定时间步长更新（用于物理引擎、固定频率逻辑，对应 Unity FixedUpdate）
     * @param fixedUpdateCallback 固定更新回调（每累计一个 fixedDeltaTime 执行一次）
     */
    public static updateFixedTime(fixedUpdateCallback?: () => void): void {
        // 累计原始时间（不受 timeScale 影响，确保物理更新稳定）
        const totalFixedDelta = this.unscaledDeltaTime + this.fixedTimeRemainder;
        const fixedStep = this.fixedDeltaTime;

        // 计算需要执行多少次固定更新（例如：累计 0.05 秒，固定步长 0.02 秒 → 执行 2 次，余数 0.01 秒）
        const fixedUpdateCount = Math.floor(totalFixedDelta / fixedStep);
        this.fixedTimeRemainder = totalFixedDelta % fixedStep;

        // 执行固定更新回调
        for (let i = 0; i < fixedUpdateCount; i++) {
            this.fixedTime += fixedStep; // 更新固定时间累计
            fixedUpdateCallback?.();
        }
    }

    /**
     * 重置时间状态（用于游戏重启、场景切换）
     */
    public static reset(): void {
        this.deltaTime = 0;
        this.unscaledDeltaTime = 0;
        this.time = 0;
        this.unscaledTime = 0;
        this.fixedTime = 0;
        this.fixedTimeRemainder = 0;
        this.lastFrameTime = performance.now();
    }

    /**
     * 暂停游戏（等价于设置 timeScale = 0）
     */
    public static pause(): void {
        this.timeScale = 0;
    }

    /**
     * 恢复游戏正常速度（等价于设置 timeScale = 1）
     */
    public static resume(): void {
        this.timeScale = 1;
    }
}