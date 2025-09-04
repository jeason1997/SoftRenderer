import { Color } from "./Color";
import { Config } from "./Config";
import { GameObject } from "./GameObject";
import { Vector4 } from "./Math/Vector4";

export enum CameraClearFlags {
    NONE = 0,
    ALL = 16384 | 256,
    Color = 16384,  //gl.COLOR_BUFFER_BIT
    Depth = 256,    //gl.DEPTH_BUFFER_BIT
}

export class Camera extends GameObject {
    public static mainCamera: Camera;
    private static cameras: Array<Camera> = new Array<Camera>();

    public backGroundColor: Color = new Color(0.27, 0.27, 0.27, 1.0);
    public fogColor: Color = new Color(0.27, 0.27, 0.27, 1.0);
    public clearFlags: CameraClearFlags = CameraClearFlags.Color | CameraClearFlags.Depth;
    public nearClip: number = 1;
    public farClip: number = 128;
    public fov: number = 60;
    public depth: number = 0;
    public viewPort: Vector4 = new Vector4(0, 0, 1, 1);

    public get aspect(): number {
        var v = this.viewPort;
        return (v.z * Config.canvasWidth) / (v.w * Config.canvasHeight);
    }

    constructor(name: string) {
        super(name);
        if (Camera.mainCamera == null) {
            Camera.mainCamera = this;
        }
        Camera.cameras.push(this);
    }

    // public destroy() {
    //     var index = Camera.cameras.indexOf(this, 0);
    //     if (index > -1) {
    //         Camera.cameras.splice(index, 1);
    //     }

    //     if (Camera.mainCamera == this) {
    //         if (Camera.cameras.length > 0)
    //             Camera.mainCamera = Camera.cameras[0];
    //         else
    //             Camera.mainCamera = null;
    //     }
    // }
}