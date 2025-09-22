import { UObject } from "../Core/UObject";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Shader } from "../Shader/Shader";
import { Texture } from "./Texture";

export class Material extends UObject {
    public name: string;
    public shader: Shader | null = null;
    public color: Color = Color.WHITE;
    public mainTexture: Texture | null = null;
    public textureOffset: Vector2 = Vector2.ZERO;
    public textureScale: Vector2 = Vector2.ONE;
    
    // 渲染模式
    public wireframe: boolean = false;
    public transparent: boolean = false;
    
    constructor(name: string) {
        super();
        this.name = name;
    }
    
    // 克隆材质
    public clone(): Material {
        const material = new Material(this.name + "_Clone");
        material.color = this.color;
        material.mainTexture = this.mainTexture;
        material.textureOffset = this.textureOffset.clone();
        material.textureScale = this.textureScale.clone();
        material.wireframe = this.wireframe;
        material.transparent = this.transparent;
        return material;
    }

    public onDestroy(): void {
        throw new Error("Method not implemented.");
    }
}