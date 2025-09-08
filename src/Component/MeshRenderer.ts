import { Renderer } from "./Renderer";
import { OBJModel } from "../Model";

export class MeshRenderer extends Renderer {
    private _mesh: OBJModel | null = null;

    // 网格属性
    public get mesh(): OBJModel | null {
        return this._mesh;
    }

    public set mesh(value: OBJModel | null) {
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