import { Color } from "../Math/Color";
import { Vector3 } from "../Math/Vector3";
import { LayerMask } from "./LayerMask";

export enum FogMode {
    Linear = 0,
    Exponential = 1,
    Exp2 = 2,
}

export const Layers: string[] = [
    "Default",
    "TransparentFX",
    "Ignore Raycast",
    "Water",
]

export class EngineConfig {
    public static canvasWidth: number = 320;
    public static canvasHeight: number = 240;
    public static halfCanvasWidth: number = EngineConfig.canvasWidth >> 1;
    public static halfCanvasHeight: number = EngineConfig.canvasHeight >> 1;
    public static aspectRatio: number = EngineConfig.canvasWidth / EngineConfig.canvasHeight;
}

export class TimeSettings {
}

export class PhysicsSettings {
    public static gravity: Vector3 = new Vector3(0, -9.8, 0);
    public static layerCollisionMatrix: LayerMask[][] = [];
}

export class RenderSettings {
    public static fog: boolean = false;
    public static fogColor: Color;
    public static fogMode: FogMode = FogMode.Exp2;
    public static fogDensity: number = 0.01;
    public static linearFogStart: number = 0;
    public static linearFogEnd: number = 300;
    public static ambientLight: Color = Color.FromUint32(Color.BLACK);
    public static skyboxMaterial;
}