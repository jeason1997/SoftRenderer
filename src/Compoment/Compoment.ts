import { GameObject } from "../GameObject";
import { Transform } from "../Transfrom";

export abstract class Compoment {
    public readonly gameObject: GameObject;
    
    public get transform(): Transform {
        return this.gameObject.transform;
    }
    
    private _enabled: boolean = true;
    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        this._enabled = value;
        if (value) {
            this.onEnable();
        } else {
            this.onDisable();
        }
    }

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.awake();
    }

    // 生命周期方法
    // 当组件被创建时调用
    public awake(): void {}
    
    // 在启用组件的第一帧调用
    public start(): void {}
    
    // 每帧更新前调用
    public update(): void {}
    
    // 每帧更新后调用
    //public lateUpdate(): void {}
    
    // 用于渲染
    //public render(): void {}
    
    // 当组件被启用时调用
    public onEnable(): void {}
    
    // 当组件被禁用时调用
    public onDisable(): void {}
    
    // 当组件被销毁时调用
    public onDestroy(): void {}
}