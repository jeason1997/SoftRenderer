import { Mesh } from "../Resources/Mesh";
import { SubMesh } from "../Resources/Mesh";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Bounds } from "../Math/Bounds";

export class OBJParser {
    /**
     * 解析OBJ文件内容并生成Mesh对象
     * @param content OBJ文件的文本内容
     * @param scale 模型缩放比例，默认1.0
     * @returns 解析后的Mesh对象
     */
    static parse(content: string, scale: number = 1): Mesh {
        const mesh = new Mesh();
        mesh.vertices = [];
        mesh.uv = [];
        mesh.normals = [];
        mesh.tangents = [];
        mesh.triangles = [];
        mesh.bounds = [];
        mesh.subMeshes = [];
        mesh.material = []; // 初始化材质数组

        // 临时存储OBJ文件中的原始数据（索引从1开始）
        const tempVertices: Vector3[] = [];
        const tempUvs: Vector2[] = [];
        const tempNormals: Vector3[] = [];

        // 顶点索引映射表：用于去重 (格式: "vIndex/vtIndex/vnIndex" => 合并后的索引)
        const vertexMap = new Map<string, number>();

        // 材质相关变量
        let currentMaterial = ""; // 当前使用的材质名称
        const materialSet = new Set<string>(); // 用于收集所有唯一材质

        // 按行分割内容并处理
        const lines = content.split(/\r?\n/);
        let currentSubMesh: SubMesh | null = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue; // 跳过空行和注释
            }

            const parts = trimmedLine.split(/\s+/);
            const type = parts[0];
            const data = parts.slice(1);

            switch (type) {
                case 'v': // 顶点坐标 (x, y, z) - 应用缩放
                    if (data.length >= 3) {
                        tempVertices.push(new Vector3(
                            parseFloat(data[0]) * scale,
                            parseFloat(data[1]) * scale,
                            parseFloat(data[2]) * scale
                        ));
                    }
                    break;

                case 'vt': // 纹理坐标 (u, v)
                    if (data.length >= 2) {
                        tempUvs.push(new Vector2(
                            parseFloat(data[0]),
                            1 - parseFloat(data[1]) // 翻转V轴
                        ));
                    }
                    break;

                case 'vn': // 法线 (x, y, z)
                    if (data.length >= 3) {
                        tempNormals.push(new Vector3(
                            parseFloat(data[0]),
                            parseFloat(data[1]),
                            parseFloat(data[2])
                        ));
                    }
                    break;

                case 'mtllib': // 材质库引用（暂存材质库文件名，实际加载需额外实现）
                    // 这里可以记录材质库文件路径，用于后续加载材质
                    // 示例: const mtlPath = data.join(' ');
                    break;

                case 'usemtl': // 使用材质
                    if (data.length > 0) {
                        currentMaterial = data.join(' '); // 支持带空格的材质名
                        materialSet.add(currentMaterial);

                        if (currentSubMesh) {
                            currentSubMesh.material = currentMaterial; // 关联材质
                        }
                    }
                    break;

                case 'g': // 处理组指令，创建新的子网格
                    // 结算当前子网格
                    if (currentSubMesh) {
                        currentSubMesh.vertexCount = mesh.vertices.length - currentSubMesh.firstVertex;
                        currentSubMesh.indexCount = mesh.triangles.length - currentSubMesh.indexStart;
                    }
                    // 创建新子网格并继承当前材质
                    currentSubMesh = new SubMesh();
                    currentSubMesh.firstVertex = mesh.vertices.length;
                    currentSubMesh.indexStart = mesh.triangles.length;
                    currentSubMesh.vertexCount = 0;
                    currentSubMesh.indexCount = 0;
                    currentSubMesh.bounds = new Bounds();
                    currentSubMesh.material = currentMaterial; // 继承当前材质
                    mesh.subMeshes.push(currentSubMesh);
                    break;

                case 'f': // 面
                    if (data.length < 3) break;

                    // 初始化当前子网格（如果没有）
                    if (!currentSubMesh) {
                        currentSubMesh = new SubMesh();
                        currentSubMesh.firstVertex = mesh.vertices.length;
                        currentSubMesh.indexStart = mesh.triangles.length;
                        currentSubMesh.vertexCount = 0;
                        currentSubMesh.indexCount = 0;
                        currentSubMesh.bounds = new Bounds();
                        currentSubMesh.material = currentMaterial; // 使用当前材质
                        mesh.subMeshes.push(currentSubMesh);
                    }

                    // 处理面的顶点数据
                    const faceVertices = data.map(vertexStr => {
                        const indices = vertexStr.split('/').map(idx => parseInt(idx) || 0);
                        return {
                            v: indices[0] - 1, // 转换为0基索引
                            vt: indices[1] - 1,
                            vn: indices[2] - 1
                        };
                    });

                    // 处理三角形化和顶点去重
                    for (let i = 2; i < faceVertices.length; i++) {
                        [0, i - 1, i].forEach(idx => {
                            const { v, vt, vn } = faceVertices[idx];

                            // 创建唯一标识键 (处理可能的负数索引和默认值)
                            const key = `${v >= 0 ? v : -1}/${vt >= 0 ? vt : -1}/${vn >= 0 ? vn : -1}`;

                            if (vertexMap.has(key)) {
                                // 复用已存在的顶点索引
                                mesh.triangles.push(vertexMap.get(key)!);
                            } else {
                                // 添加新顶点数据
                                const newIndex = mesh.vertices.length;
                                vertexMap.set(key, newIndex);

                                // 顶点数据
                                mesh.vertices.push(v >= 0 && v < tempVertices.length ? tempVertices[v] : new Vector3(0, 0, 0));

                                // UV数据
                                mesh.uv.push(vt >= 0 && vt < tempUvs.length ? tempUvs[vt] : new Vector2(0, 0));

                                // 法线数据
                                mesh.normals.push(vn >= 0 && vn < tempNormals.length ? tempNormals[vn] : new Vector3(0, 0, 1));

                                // 先初始化切线为零向量，后续会计算
                                mesh.tangents.push(new Vector4(0, 0, 0, 1));

                                // 添加索引
                                mesh.triangles.push(newIndex);
                            }
                        });
                    }
                    break;
            }
        }

        // 更新子网格信息
        mesh.subMeshes.forEach(subMesh => {
            subMesh.vertexCount = mesh.vertices.length - subMesh.firstVertex;
            subMesh.indexCount = mesh.triangles.length - subMesh.indexStart;
        });

        // 收集所有材质到mesh.material数组
        mesh.material = Array.from(materialSet);

        mesh.calculateMeshData();

        if (!mesh.checkValid()) {
            console.error("Mesh check valid faild.");
        }

        return mesh;
    }
}