import { RequireComponent } from "../../Core/Decorators";
import { Time } from "../../Core/Time";
import { Vector4 } from "../../Math/Vector4";
import { Material } from "../../Resources/Material";
import { Component } from "../Component";
import { MeshRenderer } from "../MeshRenderer";

@RequireComponent(MeshRenderer)
export class ScrollTexture extends Component {
    public scrollSpeed: number = 0.2;
    public textureST: Vector4 = new Vector4(2, 2, 0, 0);

    private mat: Material | null = null;

    public onStart(): void {
        const meshRenderer = this.gameObject.getComponent(MeshRenderer);
        if (meshRenderer) this.mat = meshRenderer.material;
    }

    public onUpdate(): void {
        if (this.mat) {
            this.textureST.z += this.scrollSpeed * Time.deltaTime;
            this.textureST.w += this.scrollSpeed * Time.deltaTime;
            this.mat.setVector4('mainTextureST', this.textureST);
        }
    }
}