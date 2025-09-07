export class Engine {
    public static canvas: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;
    public static deltaTime: number = 1 / 60;
}

export class EngineConfig {
    public static canvasWidth: number = 400;
    public static canvasHeight: number = 400;
    public static halfCanvasWidth: number = EngineConfig.canvasWidth >> 1;
    public static halfCanvasHeight: number = EngineConfig.canvasHeight >> 1;
    public static aspectRatio: number = EngineConfig.canvasWidth / EngineConfig.canvasHeight;
}