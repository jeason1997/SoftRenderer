import { Renderer } from "./Renderer";
import { OBJModel } from "../Model";

export class MeshRenderer extends Renderer {
    private _mesh: OBJModel | null = null;
    private _castShadows: boolean = true;
    private _receiveShadows: boolean = true;

    // 网格属性
    public get mesh(): OBJModel | null {
        return this._mesh;
    }

    public set mesh(value: OBJModel | null) {
        this._mesh = value;
    }

    // 是否投射阴影
    public get castShadows(): boolean {
        return this._castShadows;
    }

    public set castShadows(value: boolean) {
        this._castShadows = value;
    }

    // 是否接收阴影
    public get receiveShadows(): boolean {
        return this._receiveShadows;
    }

    public set receiveShadows(value: boolean) {
        this._receiveShadows = value;
    }
    
    // 实现渲染方法
    public override render(): void {
        // 渲染逻辑将由RasterizationPipeline调用
    }

    public override onDestroy(): void {
        // 清理资源
        this._mesh = null;
        super.material = null;
    }
}