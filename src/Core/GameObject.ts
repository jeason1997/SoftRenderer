import { Transform } from "./Transform";
import { Component } from "../Component/Component";
import { Vector3 } from "../Math/Vector3";
import { Quaternion } from "../Math/Quaternion";
import { UObject } from "./UObject";
import { DISALLOW_COMPONENTS_KEY, DISALLOW_MULTIPLE_COMPONENT_KEY } from "./Decorators";

export class GameObject extends UObject {
    public name: string;
    public transform: Transform;
    public tag: string = "Untagged"; // 添加标签属性
    public layer: number = 0; // 默认层

    private components: Component[] = [];
    private startedComponents: Set<Component> = new Set<Component>();

    constructor(name: string) {
        super();
        this.name = name;
        this.transform = new Transform(this);
    }

    private _active: boolean = true;
    // 设置游戏对象的激活状态
    public set active(value: boolean) {
        if (this._active !== value) {
            this._active = value;

            // 处理组件的启用/禁用
            for (const component of this.components) {
                if (value) {
                    component.onEnable();
                } else {
                    component.onDisable();
                }
            }
        }
    }
    // 检查游戏对象是否处于活动状态（考虑父对象）
    public get active(): boolean {
        if (!this._active) return false;

        // 检查父对象的激活状态
        let parent = this.transform.parent;
        while (parent) {
            const parentGameObject = parent.gameObject;
            if (parentGameObject && !parentGameObject.active) {
                return false;
            }
            parent = parent.parent;
        }

        return true;
    }

    // 调用所有组件的Start方法（如果尚未调用）
    public startComponents(): void {
        if (!this.active) return;

        for (const component of this.components) {
            if (!this.startedComponents.has(component) && component.enabled) {
                component.start();
                component.onEnable();
                this.startedComponents.add(component);
            }
        }

        // 递归调用子对象的startComponents
        for (const child of this.transform.children) {
            if (child.gameObject) {
                child.gameObject.startComponents();
            }
        }
    }

    // 更新所有组件
    public updateComponents(): void {
        if (!this.active) return;

        for (const component of this.components) {
            if (component.enabled) {
                component.update();
            }
        }

        // 递归调用子对象的updateComponents
        for (const child of this.transform.children) {
            if (child.gameObject) {
                child.gameObject.updateComponents();
            }
        }
    }

    /**
     * 添加组件到游戏对象
     * @param componentType 组件类型
     * @returns 添加的组件实例
     */
    public addComponent<T extends Component>(componentType: new (gameObject: GameObject) => T): T | null {
        // 1.检查是否已经存在该类型的组件
        const existingComponent = this.getComponent(componentType);
        if (existingComponent) {
            if (!existingComponent.checkComponentUniqueness()) {
                // 不允许添加多个相同的组件，返回已经存在的
                return existingComponent;
            }
        }

        // 2.判断是否有与该组件排斥的组件
        for (const existingComponent of this.components) {
            const existingDisallowed: Function[] | undefined =
                Reflect.getMetadata(DISALLOW_COMPONENTS_KEY, existingComponent.constructor);

            if (existingDisallowed && existingDisallowed.includes(componentType)) {
                console.error(
                    `Cannot add ${componentType.name}: existing ${existingComponent.constructor.name} ` +
                    `forbids this component type`
                );
                return null;
            }
        }

        // 创建新组件实例
        const comp = new componentType(this);

        // 3.判断是否有依赖组件，有的话添加
        if (comp.checkRequiredComponents()) {
            this.components.push(comp);
            // 4.检查是否有冲突的组件，有的话移除它们
            comp.checkComponentCompatibility();
            return comp;
        }
        else {
            // 添加失败，则该组件也销毁，避免出现逻辑问题
            comp.Destroy();
            return null;
        }
    }

    public getAllComponents(): Component[] {
        return this.components;
    }

    // 获取指定类型的组件
    public getComponent<T extends Component>(componentType: Function & { prototype: T }): T | null {
        for (const component of this.components) {
            if (component instanceof componentType) {
                return component as T;
            }
        }
        return null;
    }

    // 获取所有指定类型的组件
    public getComponents<T extends Component>(componentType: Function & { prototype: T }): T[] {
        const result: T[] = [];
        for (const component of this.components) {
            if (component instanceof componentType) {
                result.push(component as T);
            }
        }
        return result;
    }

    public getComponetInParent<T extends Component>(componentType: Function & { prototype: T }): T | null {
        // 先检查自身
        const comp = this.getComponent(componentType);
        if (comp != null) {
            return comp;
        }

        let parent = this.transform.parent;
        while (parent) {
            const parentGameObject = parent.gameObject;
            if (parentGameObject) {
                const component = parentGameObject.getComponent(componentType);
                if (component) {
                    return component;
                }
            }
            parent = parent.parent;
        }
        return null;
    }

    // 获取子节点上的组件
    public getComponentInChildren<T extends Component>(componentType: Function & { prototype: T }): T | null {
        // 先检查自身
        const comp = this.getComponent(componentType);
        if (comp != null) {
            return comp;
        }

        // 遍历所有子节点
        for (const child of this.transform.children) {
            const childGameObject = child.gameObject;
            if (childGameObject) {
                const childComp = childGameObject.getComponent(componentType);
                if (childComp != null) {
                    return childComp;
                }

                // 递归检查子节点的子节点
                const deepChildComp = childGameObject.getComponentInChildren(componentType);
                if (deepChildComp != null) {
                    return deepChildComp;
                }
            }
        }

        return null;
    }

    // 获取子节点上的所有组件
    public getComponentsInChildren<T extends Component>(componentType: Function & { prototype: T }): T[] {
        const result: T[] = [];

        // 添加自身的组件
        result.push(...this.getComponents(componentType));

        // 遍历所有子节点
        for (const child of this.transform.children) {
            // 假设每个Transform都有对应的GameObject
            const childGameObject = child.gameObject;
            if (childGameObject) {
                // 递归获取子节点的所有组件
                result.push(...childGameObject.getComponentsInChildren(componentType));
            }
        }

        return result;
    }

    // 移除组件
    public removeComponent<T extends Component>(componentType: Function & { prototype: T }): boolean {
        const index = this.components.findIndex(component => component instanceof componentType);
        if (index !== -1) {
            const component = this.components[index];
            component.onDestroy();
            this.components.splice(index, 1);
            return true;
        }
        return false;
    }

    // 静态方法：通过名称查找GameObject
    public static find(name: string): GameObject | null {
        // 实现查找逻辑
        // 这需要一个全局的GameObject注册表
        return null;
    }

    // 静态方法：通过标签查找第一个GameObject
    public static findWithTag(tag: string): GameObject | null {
        // 实现查找逻辑
        // 这需要一个标签系统
        return null;
    }

    // 静态方法：通过标签查找所有GameObject
    public static findGameObjectsWithTag(tag: string): GameObject[] {
        // 实现查找逻辑
        return [];
    }

    // 静态方法：查找特定类型的第一个组件
    public static findObjectOfType<T extends Component>(type: new (...args: any[]) => T): T | null {
        // 实现查找逻辑
        return null;
    }

    // 静态方法：查找特定类型的所有组件
    public static findObjectsOfType<T extends Component>(type: new (...args: any[]) => T): T[] {
        // 实现查找逻辑
        return [];
    }

    // 静态方法：实例化游戏对象
    public static instantiate(original: GameObject, position?: Vector3, rotation?: Quaternion): GameObject {
        // 创建新的游戏对象
        const clone = new GameObject(original.name);

        // 复制属性
        clone.tag = original.tag;
        clone.layer = original.layer;
        clone.active = original.active;

        // 设置位置和旋转（如果提供）
        if (position) {
            clone.transform.position = position;
        }

        if (rotation) {
            clone.transform.rotation = rotation;
        }

        // 复制组件（这需要一个深度复制机制）

        return clone;
    }

    // 销毁游戏对象
    public onDestroy(): void {
        // 调用所有组件的onDestroy方法
        for (const component of this.components) {
            component.onDestroy();
        }
        // 这里可以添加从场景中移除游戏对象的逻辑
    }
}