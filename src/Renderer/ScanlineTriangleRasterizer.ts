import { Vector3 } from "../Math/Vector3";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector4 } from "../Math/Vector4";
import { Fragment, TriangleRasterizer } from "./TriangleRasterizer";
import { AttributeType, VertexAttributes } from "./RendererDefine";

/**
 * 表示三角形的边，用于扫描线算法
 */
interface Edge {
    x: number;      // 当前扫描线与边的交点x坐标
    z: number;      // 当前交点的z值
    oneOverM: number; // 边的斜率倒数(1/m)
    attributes: { [key: string]: { value: AttributeType, step: AttributeType } }; // 属性及其步进值
}

export class ScanlineTriangleRasterizer extends TriangleRasterizer {
    /**
     * 静态实现基类的rasterizeTriangle方法
     */
    public static rasterizeTriangle(v0: Vector3, v1: Vector3, v2: Vector3, attrs0: VertexAttributes, attrs1: VertexAttributes, attrs2: VertexAttributes): Fragment[] {
        // 确保参数命名与实现一致
        return this.drawTriangleFilled(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y, attrs0, attrs1, attrs2);
    }
    
    /**
     * 扫描线算法填充三角形
     */
    private static drawTriangleFilled(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, attrs1: VertexAttributes, attrs2: VertexAttributes, attrs3: VertexAttributes): Fragment[] {
        const fragments: Fragment[] = [];
        
        // 按y坐标排序顶点
        let p1 = { x: Math.round(x1), y: Math.round(y1) };
        let p2 = { x: Math.round(x2), y: Math.round(y2) };
        let p3 = { x: Math.round(x3), y: Math.round(y3) };
        
        // 排序顶点，确保p1.y <= p2.y <= p3.y
        if (p1.y > p2.y) { [p1, p2] = [p2, p1]; }
        if (p1.y > p3.y) { [p1, p3] = [p3, p1]; }
        if (p2.y > p3.y) { [p2, p3] = [p3, p2]; }
        
        // 计算三角形的高度
        const totalHeight = p3.y - p1.y;
        
        if (totalHeight === 0) {
            return fragments; // 三角形高度为0，无法绘制
        }
        
        // 创建所有属性的键集合
        const allAttributeKeys = new Set<string>();
        Object.keys(attrs1).forEach(key => allAttributeKeys.add(key));
        Object.keys(attrs2).forEach(key => allAttributeKeys.add(key));
        Object.keys(attrs3).forEach(key => allAttributeKeys.add(key));
        
        // 对每条扫描线进行处理
        for (let y = p1.y; y <= p3.y; y++) {
            // 计算当前扫描线在整个三角形中的相对位置
            const segmentHeight = y - p1.y + 1;
            
            // 确定左右边界
            let xLeft: number, xRight: number;
            let zLeft: number, zRight: number;
            
            // 确定当前扫描线属于上半部分还是下半部分
            if (y <= p2.y) {
                // 上半部分：使用边p1-p2和p1-p3
                xLeft = this.calculateXOnEdge(p1.x, p1.y, p2.x, p2.y, y);
                xRight = this.calculateXOnEdge(p1.x, p1.y, p3.x, p3.y, y);
            } else {
                // 下半部分：使用边p2-p3和p1-p3
                xLeft = this.calculateXOnEdge(p2.x, p2.y, p3.x, p3.y, y);
                xRight = this.calculateXOnEdge(p1.x, p1.y, p3.x, p3.y, y);
            }
            
            // 确保xLeft <= xRight
            if (xLeft > xRight) {
                [xLeft, xRight] = [xRight, xLeft];
            }
            
            // 计算z值（简化版，实际应该使用透视校正插值）
            zLeft = this.calculateZValue(p1, p2, p3, xLeft, y);
            zRight = this.calculateZValue(p1, p2, p3, xRight, y);
            
            // 对当前扫描线上的每个像素进行处理
            for (let x = Math.round(xLeft); x <= Math.round(xRight); x++) {
                // 计算当前点的z值（线性插值）
                const t = xRight === xLeft ? 0 : (x - xLeft) / (xRight - xLeft);
                const z = zLeft + t * (zRight - zLeft);
                
                // 创建当前片段的属性集合
                const fragmentAttributes: VertexAttributes = {};
                
                // 对每个属性进行插值
                allAttributeKeys.forEach(key => {
                    // 获取三个顶点的属性值
                    const val1 = attrs1[key];
                    const val2 = attrs2[key];
                    const val3 = attrs3[key];
                    
                    // 确保三个顶点都有该属性
                    if (val1 !== undefined && val2 !== undefined && val3 !== undefined) {
                        // 根据属性类型进行不同的插值处理
                        fragmentAttributes[key] = this.interpolateAttribute(val1, val2, val3, p1, p2, p3, x, y);
                    }
                });
                
                // 添加片段到结果数组
                fragments.push({
                    x: x,
                    y: y,
                    z: z,
                    attributes: fragmentAttributes
                });
            }
        }
        
        return fragments;
    }
    
    /**
     * 计算给定y坐标时，边上的x坐标
     */
    private static calculateXOnEdge(x1: number, y1: number, x2: number, y2: number, y: number): number {
        if (y1 === y2) {
            return x1; // 水平边，x不变
        }
        
        return x1 + (x2 - x1) * (y - y1) / (y2 - y1);
    }
    
    /**
     * 计算给定点的z值（使用重心坐标插值）
     */
    private static calculateZValue(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, x: number, y: number): number {
        // 简化版：假设三角形在z轴方向上是平坦的
        // 实际应该使用透视校正插值和三角形的深度信息
        return 1.0; // 这里返回默认值，实际应用中需要根据顶点的z值进行插值
    }
    
    /**
     * 根据属性类型进行不同的插值处理
     */
    private static interpolateAttribute(val1: AttributeType, val2: AttributeType, val3: AttributeType, 
                                      p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, 
                                      x: number, y: number): AttributeType {
        // 计算重心坐标
        const barycentric = this.calculateBarycentric(p1, p2, p3, x, y);
        const { u, v, w } = barycentric;
        
        // 根据属性类型进行不同的插值处理
        if (typeof val1 === 'number' && typeof val2 === 'number' && typeof val3 === 'number') {
            // 数值类型插值
            return val1 * u + val2 * v + val3 * w;
        } else if (val1 instanceof Color && val2 instanceof Color && val3 instanceof Color) {
            // 颜色类型插值
            const r = Math.floor(val1.r * u + val2.r * v + val3.r * w);
            const g = Math.floor(val1.g * u + val2.g * v + val3.g * w);
            const b = Math.floor(val1.b * u + val2.b * v + val3.b * w);
            const a = Math.floor(val1.a * u + val2.a * v + val3.a * w);
            return new Color(r, g, b, a);
        } else if (val1 instanceof Vector2 && val2 instanceof Vector2 && val3 instanceof Vector2) {
            // Vector2类型插值
            const x = val1.x * u + val2.x * v + val3.x * w;
            const y = val1.y * u + val2.y * v + val3.y * w;
            return new Vector2(x, y);
        } else if (val1 instanceof Vector3 && val2 instanceof Vector3 && val3 instanceof Vector3) {
            // Vector3类型插值
            const x = val1.x * u + val2.x * v + val3.x * w;
            const y = val1.y * u + val2.y * v + val3.y * w;
            const z = val1.z * u + val2.z * v + val3.z * w;
            return new Vector3(x, y, z);
        } else if (val1 instanceof Vector4 && val2 instanceof Vector4 && val3 instanceof Vector4) {
            // Vector4类型插值
            const x = val1.x * u + val2.x * v + val3.x * w;
            const y = val1.y * u + val2.y * v + val3.y * w;
            const z = val1.z * u + val2.z * v + val3.z * w;
            const wComp = val1.w * u + val2.w * v + val3.w * w;
            return new Vector4(x, y, z, wComp);
        }
        
        // 默认情况下返回第一个值
        return val1;
    }
    
    /**
     * 计算重心坐标
     */
    private static calculateBarycentric(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, x: number, y: number): {u: number, v: number, w: number} {
        // 计算向量
        const v0 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const v1 = { x: p3.x - p1.x, y: p3.y - p1.y };
        const v2 = { x: x - p1.x, y: y - p1.y };
        
        // 计算点积
        const dot00 = v0.x * v0.x + v0.y * v0.y;
        const dot01 = v0.x * v1.x + v0.y * v1.y;
        const dot02 = v0.x * v2.x + v0.y * v2.y;
        const dot11 = v1.x * v1.x + v1.y * v1.y;
        const dot12 = v1.x * v2.x + v1.y * v2.y;
        
        // 计算分母
        const denom = dot00 * dot11 - dot01 * dot01;
        
        if (denom === 0) {
            return { u: 0, v: 0, w: 1 };
        }
        
        // 计算重心坐标
        const u = (dot11 * dot02 - dot01 * dot12) / denom;
        const v = (dot00 * dot12 - dot01 * dot02) / denom;
        const w = 1.0 - u - v;
        
        return { u, v, w };
    }
}