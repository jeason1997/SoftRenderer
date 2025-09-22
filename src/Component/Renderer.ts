import { Component } from "./Component";
import { Material } from "../Resources/Material";
import { Bounds } from "../Math/Bounds";
import { DisallowMultipleComponent } from "../Core/Decorators";

@DisallowMultipleComponent
export abstract class Renderer extends Component {
    private _bounds: Bounds = new Bounds();
    private _material: Material = new Material();
    private _sortingLayerID: number = 0;
    private _sortingOrder: number = 0;
    private _castShadows: boolean = true;
    private _receiveShadows: boolean = true;

    // 材质属性
    public get material(): Material {
        return this._material;
    }

    public set material(value: Material) {
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

    // 是否应该被渲染
    public get shouldRender(): boolean {
        return this.enabled && this.gameObject.active;
    }

    // 渲染方法，子类需要实现
    public abstract render(): void;

    public onDestroy(): void {
    }
}