import { DISALLOW_COMPONENTS_KEY, DISALLOW_MULTIPLE_COMPONENT_KEY, REQUIRED_COMPONENTS_KEY } from "../Core/Decorators";
import { GameObject } from "../Core/GameObject";
import { Transform } from "../Core/Transform";
import { UObject } from "../Core/UObject";

export abstract class Component extends UObject {
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
        super();
        this.gameObject = gameObject;
        this.checkRequiredComponents();
        this.checkComponentUniqueness();
        this.checkComponentCompatibility();
        this.onAwake();
    }

    // 生命周期方法
    // 当组件被创建时调用
    public onAwake(): void { }

    // 在启用组件的第一帧调用
    public onStart(): void { }

    // 每帧更新前调用
    public onUpdate(): void { }

    // 每帧更新后调用
    //public lateUpdate(): void {}

    // 当组件被启用时调用
    public onEnable(): void { }

    // 当组件被禁用时调用
    public onDisable(): void { }

    // 当组件被销毁时调用
    public onDestroy(): void { }

    /**
     * 检查通过@RequireComponent装饰器声明的依赖组件是否存在
     */
    public checkRequiredComponents(): Boolean {
        // 1. 获取通过装饰器声明的依赖组件类型数组
        const requiredComponents: (new (gameObject: GameObject) => Component)[] | undefined =
            Reflect.getMetadata(REQUIRED_COMPONENTS_KEY, this.constructor);

        // 如果没有声明任何依赖，则直接返回
        if (!requiredComponents || requiredComponents.length === 0) {
            return true;
        }

        // 2. 遍历所有必需的组件类型
        for (const compType of requiredComponents) {
            // 跳过未定义的组件类型
            if (compType == null) {
                continue;
            }

            // 3. 检查该GameObject上是否已挂载所需的组件类型
            const existingComponent = this.gameObject.getComponent(compType);
            if (existingComponent == null) {
                // 4. 如果依赖组件不存在，输出错误信息
                console.error(`Component ${this.constructor.name} requires a ${compType.name} on the same GameObject.`);

                // 5. 自动添加缺失的组件（使用类型断言确保类型安全）
                try {
                    this.gameObject.addComponent(compType as new (gameObject: GameObject) => Component);
                    console.log(`Auto-added missing component: ${compType.name}`);
                } catch (error) {
                    console.error(`Failed to auto-add component ${compType.name}:`, error);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 检查是否存在多个不允许同时存在的组件
     */
    public checkComponentUniqueness(): Boolean {
        const componentType = this.constructor;
        const isDisallowed = Reflect.getMetadata(DISALLOW_MULTIPLE_COMPONENT_KEY, componentType);

        if (isDisallowed) {
            // 查找同类型组件
            const sameTypeComponents = this.gameObject.getAllComponents().filter(
                comp => comp instanceof componentType && comp !== this
            );

            if (sameTypeComponents.length > 0) {
                console.error(`Component ${componentType.name} is marked with @DisallowMultipleComponent, but multiple instances were found. This may cause unexpected behavior.`);
                return false;
            }
        }

        return true;
    }

    /**
     * 检查组件共存限制
     */
    public checkComponentCompatibility(): Boolean {
        // 获取当前组件类上通过@DisallowComponent声明的禁止共存组件类型
        const disallowedComponents: Function[] | undefined =
            Reflect.getMetadata(DISALLOW_COMPONENTS_KEY, this.constructor);

        if (!disallowedComponents || disallowedComponents.length === 0) {
            return true; // 如果没有声明任何禁止共存的组件，直接返回
        }

        // 检查所有被禁止的组件类型
        for (const disallowedType of disallowedComponents) {
            if (disallowedType == null) continue;

            // 检查是否存在被禁止的组件
            const foundComponent = this.gameObject.getComponent(disallowedType);
            if (foundComponent) {
                // 如果找到被禁止的组件，抛出错误或警告
                console.error(
                    `Component ${this.constructor.name} cannot coexist with ${disallowedType.name} ` +
                    `on the same GameObject. Please remove one of them.`
                );

                // 自动移除冲突组件
                this.gameObject.removeComponent(disallowedType);

                // 或者抛出异常阻止游戏运行
                // throw new Error(`Component compatibility error: ${this.constructor.name} vs ${disallowedType.name}`);

                return false;
            }
        }

        return true;
    }
}