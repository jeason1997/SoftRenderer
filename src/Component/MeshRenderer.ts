import { Renderer } from "./Renderer";
import { Mesh } from "../Mesh";

export class MeshRenderer extends Renderer {
    private _mesh: Mesh | null = null;

    // 网格属性
    public get mesh(): Mesh | null {
        return this._mesh;
    }

    public set mesh(value: Mesh | null) {
        this._mesh = value;
    }
    
    // 实现渲染方法
    public render(): void {
        // 渲染逻辑将由RasterizationPipeline调用
    }

    public onDestroy(): void {
        // 清理资源
        this._mesh = null;
        super.material = null;
    }
}