export class Config {
    public static canvasWidth: number = 400;
    public static canvasHeight: number = 400;
    public static halfCanvasWidth: number = Config.canvasWidth >> 1;
    public static halfCanvasHeight: number = Config.canvasHeight >> 1;
    public static aspectRatio: number = Config.canvasWidth / Config.canvasHeight;
}