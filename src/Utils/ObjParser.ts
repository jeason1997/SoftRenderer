import { Mesh } from "../Renderer/Mesh";
import { SubMesh } from "../Renderer/Mesh";
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

            // 计算子网格包围盒
            const subVertices = mesh.vertices.slice(
                subMesh.firstVertex,
                subMesh.firstVertex + subMesh.vertexCount
            );
            subMesh.bounds = Bounds.fromPoints(subVertices);
        });

        // 收集所有材质到mesh.material数组
        mesh.material = Array.from(materialSet);

        // 计算切线向量
        this.calculateTangents(mesh);

        // 计算整体包围盒
        mesh.bounds = mesh.subMeshes.map(sm => sm.bounds);

        // 计算三角面的法向量
        this.calculateFaceNormals(mesh);

        if (!mesh.checkValid()) {
            console.error("Mesh check valid faild.");
        }

        return mesh;
    }

    private static calculateFaceNormals(mesh: Mesh) {
        if (mesh.vertices.length === 0 || mesh.triangles.length === 0) return;

        mesh.faceNormals = [];
        mesh.faceCenters = [];

        for (let i = 0; i < mesh.triangles.length; i += 3) {
            const i0 = mesh.triangles[i];
            const i1 = mesh.triangles[i + 1];
            const i2 = mesh.triangles[i + 2];

            const v0 = mesh.vertices[i0];
            const v1 = mesh.vertices[i1];
            const v2 = mesh.vertices[i2];

            const e1 = Vector3.subtract(v1, v0);
            const e2 = Vector3.subtract(v2, v0);
            const faceNormal = Vector3.cross(e1, e2).normalize();
            mesh.faceNormals.push(faceNormal);

            const center = Vector3.add(v0, v1).add(v2).divide(3);
            mesh.faceCenters.push(center);
        }
    }

    /**
     * 计算网格的切线向量
     * 基于顶点位置、UV和三角形索引计算
     */
    private static calculateTangents(mesh: Mesh) {
        if (mesh.vertices.length === 0 || mesh.triangles.length === 0) return;

        // 临时数组存储每个顶点的切线计算数据
        const tan1 = new Array(mesh.vertices.length).fill(0).map(() => new Vector3(0, 0, 0));
        const tan2 = new Array(mesh.vertices.length).fill(0).map(() => new Vector3(0, 0, 0));

        // 遍历所有三角形
        for (let i = 0; i < mesh.triangles.length; i += 3) {
            const i0 = mesh.triangles[i];
            const i1 = mesh.triangles[i + 1];
            const i2 = mesh.triangles[i + 2];

            // 获取三角形的三个顶点
            const v0 = mesh.vertices[i0];
            const v1 = mesh.vertices[i1];
            const v2 = mesh.vertices[i2];

            // 获取对应的UV坐标
            const w0 = mesh.uv[i0];
            const w1 = mesh.uv[i1];
            const w2 = mesh.uv[i2];

            // 计算边向量
            const x1 = v1.x - v0.x;
            const y1 = v1.y - v0.y;
            const z1 = v1.z - v0.z;

            const x2 = v2.x - v0.x;
            const y2 = v2.y - v0.y;
            const z2 = v2.z - v0.z;

            // 计算UV差值
            const s1 = w1.x - w0.x;
            const t1 = w1.y - w0.y;
            const s2 = w2.x - w0.x;
            const t2 = w2.y - w0.y;

            // 计算切线向量
            const r = 1.0 / (s1 * t2 - s2 * t1);
            const tx = (t2 * x1 - t1 * x2) * r;
            const ty = (t2 * y1 - t1 * y2) * r;
            const tz = (t2 * z1 - t1 * z2) * r;

            // 累加切线数据
            tan1[i0].x += tx;
            tan1[i0].y += ty;
            tan1[i0].z += tz;

            tan1[i1].x += tx;
            tan1[i1].y += ty;
            tan1[i1].z += tz;

            tan1[i2].x += tx;
            tan1[i2].y += ty;
            tan1[i2].z += tz;

            // 计算副切线向量
            const bx = (s1 * x2 - s2 * x1) * r;
            const by = (s1 * y2 - s2 * y1) * r;
            const bz = (s1 * z2 - s2 * z1) * r;

            tan2[i0].x += bx;
            tan2[i0].y += by;
            tan2[i0].z += bz;

            tan2[i1].x += bx;
            tan2[i1].y += by;
            tan2[i1].z += bz;

            tan2[i2].x += bx;
            tan2[i2].y += by;
            tan2[i2].z += bz;
        }

        // 计算最终切线并规范化
        for (let i = 0; i < mesh.vertices.length; i++) {
            const n = mesh.normals[i];
            const t = tan1[i];

            // 正交化切线（Gram-Schmidt过程）
            const tangent = Vector3.subtract(t, Vector3.multiply(n, Vector3.dot(n, t))).normalize();

            // 计算切线方向（ handedness ）
            const handedness = Vector3.dot(Vector3.cross(n, t), tan2[i]) < 0.0 ? -1 : 1;

            // 存储切线（w分量表示方向）
            mesh.tangents[i] = new Vector4(tangent.x, tangent.y, tangent.z, handedness);
        }
    }
}