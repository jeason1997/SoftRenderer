import { Vector2 } from "./Math/Vector2";
import { Vector3 } from "./Math/Vector3";

/**
 * OBJ模型解析结果接口
 */
export interface OBJModel {
    vertices: Vector3[];
    textureCoords: Vector2[];
    vertexNormals: Vector3[];
    faces: Face[];
    materials: Record<string, Material>;
}

/**
 * 面接口，支持三角形和多边形
 */
export interface Face {
    vertexIndices: number[];
    textureIndices?: number[];
    normalIndices?: number[];
    materialName?: string;
}

/**
 * 材质信息接口
 */
export interface Material {
    name: string;
    // 可根据需要扩展材质属性
}