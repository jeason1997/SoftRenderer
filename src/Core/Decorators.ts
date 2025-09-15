import 'reflect-metadata';

export const REQUIRED_COMPONENTS_KEY = Symbol('requiredComponents');
export const DISALLOW_MULTIPLE_COMPONENT_KEY = Symbol('DisallowMultipleComponent');
export const DISALLOW_COMPONENTS_KEY = Symbol('DisallowedComponents');

/**
 * 装饰器：标记当前组件需要依赖的其他组件类型
 * @param componentTypes 需要依赖的组件类型数组
 */
export function RequireComponent(...componentTypes: Function[]) {
    return function (target: Function) {
        // 将依赖的组件类型元数据存储在目标组件上
        Reflect.defineMetadata(REQUIRED_COMPONENTS_KEY, componentTypes, target);
    };
}

/**
 * 装饰器：标记当前组件不允许与指定类型的组件共存于同一个GameObject上
 * @param disallowedComponentTypes 不允许共存的组件类型数组
 */
export function DisallowComponent(...disallowedComponentTypes: Function[]) {
    return function (target: Function) {
        // 存储被禁止的组件类型数组到元数据中
        Reflect.defineMetadata(DISALLOW_COMPONENTS_KEY, disallowedComponentTypes, target);
    };
}

/**
 * 用于标记一个组件在一个GameObject上只能存在一个实例
 * 使用反射元数据存储该标记
 */
export function DisallowMultipleComponent(target: Function) {
    // 设置元数据，标记这个类不允许重复添加
    Reflect.defineMetadata(DISALLOW_MULTIPLE_COMPONENT_KEY, true, target);
}