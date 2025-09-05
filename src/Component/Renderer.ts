import { Component } from "./Component";
import { Material } from "../Material";

// Renderer是所有渲染组件的基类
export abstract class Renderer extends Component {
    private _material: Material | null = null;
    private _sortingLayerID: number = 0;
    private _sortingOrder: number = 0;
    
    // 材质属性
    public get material(): Material | null {
        return this._material;
    }
    
    public set material(value: Material | null) {
        this._material = value;
    }
    
    // 排序层ID
    public get sortingLayerID(): number {
        return this._sortingLayerID;
    }
    
    public set sortingLayerID(value: number) {
        this._sortingLayerID = value;
    }
    
    // 排序顺序
    public get sortingOrder(): number {
        return this._sortingOrder;
    }
    
    public set sortingOrder(value: number) {
        this._sortingOrder = value;
    }
    
    // 是否应该被渲染
    public get shouldRender(): boolean {
        return this.enabled && this.gameObject.active;
    }
    
    // 渲染方法，子类需要实现
    public abstract render(): void;
}