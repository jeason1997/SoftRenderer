import { Vector3 } from '../Math/Vector3';
import { Vector2 } from '../Math/Vector2';
import { Face, OBJModel } from '../Model';

/**
 * OBJ文件解析器类
 */
export class OBJParser {
    /**
     * 解析OBJ文件
     * @param fileContent OBJ文件内容
     * @returns 解析后的OBJ模型数据
     */
    public static parseOBJ(fileContent: string): OBJModel {
        const lines = fileContent.split('\n');

        const result: OBJModel = {
            vertices: [],
            textureCoords: [],
            vertexNormals: [],
            faces: [],
            materials: {},
        };

        let currentMaterial = '';

        for (const line of lines) {
            const trimmedLine = line.trim();

            // 跳过空行和注释
            if (!trimmedLine || trimmedLine.startsWith('#')) continue;

            const lineParts = trimmedLine.split(/\s+/);
            const keyword = lineParts[0];

            switch (keyword) {
                case 'v': // 顶点坐标
                    if (lineParts.length >= 4) {
                        const vertex = new Vector3(
                            parseFloat(lineParts[1]),
                            parseFloat(lineParts[2]),
                            parseFloat(lineParts[3])
                        );
                        result.vertices.push(vertex);
                    }
                    break;

                case 'vt': // 纹理坐标
                    if (lineParts.length >= 2) {
                        const texCoord = new Vector2(
                            parseFloat(lineParts[1]),
                            parseFloat(lineParts[2])
                        );
                        result.textureCoords.push(texCoord);
                    }
                    break;

                case 'vn': // 顶点法线
                    if (lineParts.length >= 4) {
                        const normal = new Vector3(
                            parseFloat(lineParts[1]),
                            parseFloat(lineParts[2]),
                            parseFloat(lineParts[3])
                        );
                        result.vertexNormals.push(normal);
                    }
                    break;

                case 'f': // 面定义
                    if (lineParts.length >= 4) {
                        const face: Face = {
                            vertexIndices: [],
                            textureIndices: [],
                            normalIndices: []
                        };

                        // 解析面的每个顶点定义
                        for (let i = 1; i < lineParts.length; i++) {
                            const vertexDef = lineParts[i];

                            // 支持v、v/vt、v//vn、v/vt/vn等多种格式
                            const vertexParts = vertexDef.split('/');

                            // 顶点索引（OBJ索引从1开始，需要转换为从0开始）
                            if (vertexParts[0]) {
                                face.vertexIndices.push(parseInt(vertexParts[0]) - 1);
                            }

                            // 纹理坐标索引（可选）
                            if (vertexParts[1] && vertexParts[1] !== '') {
                                face.textureIndices!.push(parseInt(vertexParts[1]) - 1);
                            }

                            // 法线索引（可选）
                            if (vertexParts[2] && vertexParts[2] !== '') {
                                face.normalIndices!.push(parseInt(vertexParts[2]) - 1);
                            }
                        }

                        // 如果没有纹理或法线索引，清空数组以保持数据整洁
                        if (face.textureIndices!.length === 0) {
                                delete face.textureIndices;
                        }
                        if (face.normalIndices!.length === 0) {
                                delete face.normalIndices;
                        }

                        // 添加材质信息（如果有）
                        if (currentMaterial) {
                            face.materialName = currentMaterial;
                        }

                        result.faces.push(face);
                    }
                    break;

                case 'mtllib': // 材质库引用
                    if (lineParts.length >= 2) {
                        const materialLibName = lineParts[1];
                        // 实际应用中需要加载并解析对应的.mtl文件
                        console.log(`发现材质库引用: ${materialLibName}`);
                    }
                    break;

                case 'usemtl': // 使用材质
                    if (lineParts.length >= 2) {
                        currentMaterial = lineParts[1];
                        // 初始化材质记录（实际使用时需要从.mtl文件加载完整信息）
                        if (!result.materials[currentMaterial]) {
                                result.materials[currentMaterial] = { name: currentMaterial };
                        }
                    }
                    break;

                // 可以添加更多OBJ格式关键字的处理
                default:
                    // 忽略不支持的关键字
                    break;
            }
        }

        return result;
    }

    /**
     * 将解析后的模型数据转换为JSON字符串
     * @param model OBJ模型数据
     * @returns JSON字符串
     */
    public static toJSON(model: OBJModel): string {
        return JSON.stringify(model, null, 2);
    }

    /**
     * 获取模型统计信息
     * @param model OBJ模型数据
     * @returns 统计信息
     */
    public static getModelStats(model: OBJModel): string {
        const textureCount = model.textureCoords.length;
        const normalCount = model.vertexNormals.length;
        const facesWithTextures = model.faces.filter(face => face.textureIndices).length;
        const facesWithNormals = model.faces.filter(face => face.normalIndices).length;

        return `
模型统计信息:
- 顶点数: ${model.vertices.length}
- 纹理坐标数: ${textureCount}
- 法线向量数: ${normalCount}
- 面数: ${model.faces.length}
- 带纹理的面: ${facesWithTextures}
- 带法线的面: ${facesWithNormals}
- 材质数: ${Object.keys(model.materials).length}
        `.trim();
    }

    /**
     * 验证解析数据的完整性
     * @param model OBJ模型数据
     * @returns 验证结果消息
     */
    public static validateModel(model: OBJModel): string {
        const errors: string[] = [];

        // 检查面索引是否越界
        for (const face of model.faces) {
            for (const vertexIndex of face.vertexIndices) {
                if (vertexIndex < 0 || vertexIndex >= model.vertices.length) {
                    errors.push(`顶点索引越界: ${vertexIndex} (最大: ${model.vertices.length - 1})`);
                }
            }

            if (face.textureIndices) {
                for (const texIndex of face.textureIndices) {
                    if (texIndex < 0 || texIndex >= model.textureCoords.length) {
                        errors.push(`纹理坐标索引越界: ${texIndex} (最大: ${model.textureCoords.length - 1})`);
                    }
                }
            }

            if (face.normalIndices) {
                for (const normalIndex of face.normalIndices) {
                    if (normalIndex < 0 || normalIndex >= model.vertexNormals.length) {
                        errors.push(`法线索引越界: ${normalIndex} (最大: ${model.vertexNormals.length - 1})`);
                    }
                }
            }
        }

        return errors.length > 0 
            ? `发现 ${errors.length} 个错误:\n${errors.join('\n')}`
            : '模型数据验证通过';
    }
}