import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";

export class Material {
    public name: string;
    public color: number = Color.WHITE;
    public mainTexture: ImageData | null = null;
    public textureOffset: Vector2 = new Vector2(0, 0);
    public textureScale: Vector2 = new Vector2(1, 1);
    
    // 渲染模式
    public wireframe: boolean = false;
    public transparent: boolean = false;
    
    constructor(name: string) {
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
}