import { Renderer } from "./Renderer";
import { Mesh } from "../Renderer/Mesh";

export class MeshRenderer extends Renderer {
    public mesh: Mesh | null = null;

    public render(): void {
    }

    public onDestroy(): void {
        super.onDestroy();
        // 清理资源
        this.mesh = null;
    }
}