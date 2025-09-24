import { UObject } from "../Core/UObject";
import { Color } from "../Math/Color";
import { Matrix4x4 } from "../Math/Matrix4x4";
import { Vector4 } from "../Math/Vector4";
import { VertexAttributes } from "../Renderer/RendererDefine";
import { Shader } from "../Shader/Shader";
import { Texture } from "./Texture";

export class Material extends UObject {
    public shader: Shader | null = null;
    private currentPass: number = -1;

    public onDestroy(): void {
        throw new Error("Method not implemented.");
    }

    /**
    * 激活指定索引的Pass，默认-1，表示所有的PASS都会执行，激活后只执行激活的那个PASS
    * @param passIndex Pass的索引，从0开始
    * @returns 是否激活成功
    */
    public setPass(passIndex: number): boolean {
        if (!this.shader) {
            console.warn("未指定着色器，无法激活Pass");
            return false;
        }

        // 检查Pass索引是否有效（假设Shader有passCount属性）
        if (passIndex < 0 || passIndex >= (this.shader as any).passCount) {
            console.warn(`Pass索引 ${passIndex} 无效`);
            return false;
        }

        // 调用Shader的激活Pass方法（假设Shader有activatePass方法）
        if (typeof (this.shader as any).activatePass === 'function') {
            (this.shader as any).activatePass(passIndex);
            this.currentPass = passIndex;
            return true;
        }

        console.warn("着色器不支持Pass激活操作");
        return false;
    }

    /**
     * 批量设置多个属性
     * @param properties 包含多个属性键值对的对象
     */
    public setProperties(properties: VertexAttributes): void {
        if (!this.shader) {
            console.warn("未指定着色器，无法批量设置属性");
            return;
        }

        // 遍历所有属性并设置
        for (const [propertyName, value] of Object.entries(properties)) {
            this.setValue(propertyName, value);
        }
    }

    /**
     * 给着色器中的颜色属性设置值
     * @param propertyName 属性名称
     * @param color 颜色值
     */
    public setColor(propertyName: string, color: Color): void {
        this.setValue(propertyName, color);
    }

    /**
     * 给着色器中的数字属性设置值
     * @param propertyName 属性名称
     * @param value 数字值
     */
    public setNumber(propertyName: string, value: number): void {
        this.setValue(propertyName, value);
    }

    /**
     * 给着色器中的矩阵属性设置值
     * @param propertyName 属性名称
     * @param matrix 矩阵值
     */
    public setMatrix4x4(propertyName: string, matrix: Matrix4x4): void {
        this.setValue(propertyName, matrix);
    }

    /**
     * 给着色器中的纹理属性设置值
     * @param propertyName 属性名称
     * @param texture 纹理对象
     */
    public setTexture(propertyName: string, texture: Texture): void {
        this.setValue(propertyName, texture);
    }

    /**
     * 给着色器中的Vector4属性设置值
     * @param propertyName 属性名称
     * @param vector 向量值
     */
    public setVector4(propertyName: string, vector: Vector4): void {
        this.setValue(propertyName, vector);
    }

    /**
     * 通用的属性设置方法，用于实际执行设置操作
     * @param propertyName 属性名称
     * @param value 要设置的值
     */
    private setValue(propertyName: string, value: any): void {
        if (!this.shader) {
            console.warn(`未指定着色器，无法设置属性 ${propertyName}`);
            return;
        }

        // 检查着色器是否有该属性
        if (!(propertyName in this.shader)) {
            console.warn(`着色器中不存在属性 ${propertyName}`);
            return;
        }

        // 尝试直接设置着色器的属性值
        try {
            (this.shader as any)[propertyName] = value;
        } catch (error) {
            console.error(`设置属性 ${propertyName} 失败:`, error);
        }
    }

    /**
     * 获取着色器中属性的当前值
     * @param propertyName 属性名称
     * @returns 属性值或null
     */
    public getPropertyValue(propertyName: string): any {
        if (!this.shader || !(propertyName in this.shader)) {
            return null;
        }

        return (this.shader as any)[propertyName];
    }
}