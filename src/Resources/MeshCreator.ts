import { Mesh } from "./Mesh";
import { SubMesh } from "./Mesh";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";

export class MeshCreator {
    /**
     * 创建四边形网格（平面）
     * @param width 宽度
     * @param height 高度
     * @returns 四边形网格实例
     */
    public static createQuad(width: number = 1, height: number = 1): Mesh {
        const mesh = new Mesh();

        // 顶点坐标（逆时针排列）
        const halfW = width / 2;
        const halfH = height / 2;
        mesh.vertices = [
            new Vector3(-halfW, 0, halfH), // 左下 
            new Vector3(halfW, 0, halfH),  // 右下
            new Vector3(halfW, 0, -halfH), // 右上
            new Vector3(-halfW, 0, -halfH) // 左上
        ];

        // UV坐标
        mesh.uv = [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(1, 1),
            new Vector2(0, 1)
        ];

        // 法线（朝上）
        const normal = new Vector3(0, 1, 0);
        mesh.normals = [normal.clone(), normal.clone(), normal.clone(), normal.clone()];

        // 三角形索引
        mesh.triangles = [0, 1, 2, 0, 2, 3];

        // 创建子网格
        const subMesh = new SubMesh();
        subMesh.vertexCount = 4;
        subMesh.firstVertex = 0;
        subMesh.indexCount = 6;
        subMesh.indexStart = 0;
        mesh.subMeshes.push(subMesh);

        // 计算切线和包围盒
        mesh.calculateMeshData();
        return mesh;
    }

    /**
     * 创建带格子的平面
     * @param width 宽度
     * @param height 高度
     * @param widthSegments 宽度方向格子数
     * @param heightSegments 高度方向格子数
     * @returns 带格子的平面网格
     */
    public static createPanel(
        width: number = 5,
        height: number = 5,
        widthSegments: number = 10,
        heightSegments: number = 10
    ): Mesh {
        const mesh = new Mesh();
        const halfW = width / 2;
        const halfH = height / 2;
        const segmentW = width / widthSegments;
        const segmentH = height / heightSegments;

        // 生成顶点、UV和法线
        for (let z = 0; z <= heightSegments; z++) {
            for (let x = 0; x <= widthSegments; x++) {
                // 顶点坐标
                const px = -halfW + x * segmentW;
                const pz = -halfH + z * segmentH;
                mesh.vertices.push(new Vector3(px, 0, pz));

                // UV坐标
                const u = x / widthSegments;
                const v = z / heightSegments;
                mesh.uv.push(new Vector2(u, v));

                // 法线
                mesh.normals.push(new Vector3(0, 1, 0));
            }
        }

        // 生成三角形索引
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                const a = x + y * (widthSegments + 1);
                const b = x + (y + 1) * (widthSegments + 1);
                const c = (x + 1) + (y + 1) * (widthSegments + 1);
                const d = (x + 1) + y * (widthSegments + 1);

                // 两个三角形组成一个格子
                mesh.triangles.push(a, b, c);
                mesh.triangles.push(a, c, d);
            }
        }

        // 创建子网格
        const subMesh = new SubMesh();
        subMesh.vertexCount = (widthSegments + 1) * (heightSegments + 1);
        subMesh.firstVertex = 0;
        subMesh.indexCount = mesh.triangles.length;
        subMesh.indexStart = 0;
        mesh.subMeshes.push(subMesh);

        // 计算切线和包围盒
        mesh.calculateMeshData();
        return mesh;
    }

    /**
     * 创建球体
     * @param radius 半径
     * @param widthSegments 经度方向分段数
     * @param heightSegments 纬度方向分段数
     * @returns 球体网格
     */
    public static createSphere(
        radius: number = 0.5,
        widthSegments: number = 16,
        heightSegments: number = 8
    ): Mesh {
        const mesh = new Mesh();

        // 生成顶点、UV和法线
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const theta = v * Math.PI;

            for (let x = 0; x <= widthSegments; x++) {
                const u = x / widthSegments;
                const phi = u * 2 * Math.PI;

                // 球面坐标转笛卡尔坐标
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const xPos = cosPhi * sinTheta;
                const yPos = cosTheta;
                const zPos = sinPhi * sinTheta;

                // 顶点坐标（乘以半径）
                mesh.vertices.push(new Vector3(xPos, yPos, zPos).multiplyScalar(radius));

                // UV坐标 - 修正：直接使用u和v，不再用1减
                mesh.uv.push(new Vector2(u, v));

                // 法线（单位向量，与顶点坐标方向一致）
                mesh.normals.push(new Vector3(xPos, yPos, zPos).normalize());
            }
        }

        // 生成三角形索引
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                const a = x + y * (widthSegments + 1);
                const b = x + (y + 1) * (widthSegments + 1);
                const c = (x + 1) + (y + 1) * (widthSegments + 1);
                const d = (x + 1) + y * (widthSegments + 1);

                // 构成两个三角形，并确保其缠绕顺序正确（通常是逆时针为正面）
                // 上下半球三角形处理
                if (y !== 0) {
                    mesh.triangles.push(a, c, b);
                }
                if (y !== heightSegments - 1) {
                    mesh.triangles.push(a, d, c);
                }
            }
        }

        // 创建子网格
        const subMesh = new SubMesh();
        subMesh.vertexCount = (widthSegments + 1) * (heightSegments + 1);
        subMesh.firstVertex = 0;
        subMesh.indexCount = mesh.triangles.length;
        subMesh.indexStart = 0;
        mesh.subMeshes.push(subMesh);

        // 计算切线和包围盒
        mesh.calculateMeshData();
        return mesh;
    }

    /**
     * 创建立方体
     * @param size 立方体大小（边长）
     * @returns 立方体网格
     */
    public static createCube(size: number = 1): Mesh {
        const mesh = new Mesh();
        const half = size / 2;

        // 立方体6个面的顶点数据（前、后、左、右、上、下）
        const faces = [
            // 前面 (z+)
            {
                normal: new Vector3(0, 0, 1),
                vertices: [
                    new Vector3(-half, -half, half),
                    new Vector3(half, -half, half),
                    new Vector3(half, half, half),
                    new Vector3(-half, half, half)
                ],
                uvs: [
                    new Vector2(0, 0), new Vector2(1, 0),
                    new Vector2(1, 1), new Vector2(0, 1)
                ]
            },
            // 后面 (z-)
            {
                normal: new Vector3(0, 0, -1),
                vertices: [
                    new Vector3(half, -half, -half),
                    new Vector3(-half, -half, -half),
                    new Vector3(-half, half, -half),
                    new Vector3(half, half, -half)
                ],
                uvs: [
                    new Vector2(0, 0), new Vector2(1, 0),
                    new Vector2(1, 1), new Vector2(0, 1)
                ]
            },
            // 左面 (x-)
            {
                normal: new Vector3(-1, 0, 0),
                vertices: [
                    new Vector3(-half, -half, -half),
                    new Vector3(-half, -half, half),
                    new Vector3(-half, half, half),
                    new Vector3(-half, half, -half)
                ],
                uvs: [
                    new Vector2(0, 0), new Vector2(1, 0),
                    new Vector2(1, 1), new Vector2(0, 1)
                ]
            },
            // 右面 (x+)
            {
                normal: new Vector3(1, 0, 0),
                vertices: [
                    new Vector3(half, -half, half),
                    new Vector3(half, -half, -half),
                    new Vector3(half, half, -half),
                    new Vector3(half, half, half)
                ],
                uvs: [
                    new Vector2(0, 0), new Vector2(1, 0),
                    new Vector2(1, 1), new Vector2(0, 1)
                ]
            },
            // 上面 (y+)
            {
                normal: new Vector3(0, 1, 0),
                vertices: [
                    new Vector3(-half, half, half),
                    new Vector3(half, half, half),
                    new Vector3(half, half, -half),
                    new Vector3(-half, half, -half)
                ],
                uvs: [
                    new Vector2(0, 0), new Vector2(1, 0),
                    new Vector2(1, 1), new Vector2(0, 1)
                ]
            },
            // 下面 (y-)
            {
                normal: new Vector3(0, -1, 0),
                vertices: [
                    new Vector3(-half, -half, -half),
                    new Vector3(half, -half, -half),
                    new Vector3(half, -half, half),
                    new Vector3(-half, -half, half)
                ],
                uvs: [
                    new Vector2(0, 0), new Vector2(1, 0),
                    new Vector2(1, 1), new Vector2(0, 1)
                ]
            }
        ];

        // 添加所有面的顶点数据
        faces.forEach(face => {
            const baseIndex = mesh.vertices.length;
            mesh.vertices.push(...face.vertices);
            mesh.uv.push(...face.uvs);
            mesh.normals.push(
                face.normal.clone(),
                face.normal.clone(),
                face.normal.clone(),
                face.normal.clone()
            );

            // 添加三角形索引
            mesh.triangles.push(
                baseIndex, baseIndex + 1, baseIndex + 2,
                baseIndex, baseIndex + 2, baseIndex + 3
            );
        });

        // 创建子网格
        const subMesh = new SubMesh();
        subMesh.vertexCount = 24; // 6面 × 4顶点
        subMesh.firstVertex = 0;
        subMesh.indexCount = 36; // 6面 × 2三角形 × 3索引
        subMesh.indexStart = 0;
        mesh.subMeshes.push(subMesh);

        // 计算切线和包围盒
        mesh.calculateMeshData();
        return mesh;
    }

    /**
     * 创建圆柱体
     * @param radius 半径
     * @param height 高度
     * @param radialSegments 径向分段数
     * @param heightSegments 高度分段数
     * @returns 圆柱体网格
     */
    public static createCylinder(
        radius: number = 0.5,
        height: number = 1,
        radialSegments: number = 16,
        heightSegments: number = 1
    ): Mesh {
        const mesh = new Mesh();
        const halfHeight = height / 2;
        const heightStep = height / heightSegments;

        // 生成侧面顶点
        for (let y = 0; y <= heightSegments; y++) {
            const yPos = -halfHeight + y * heightStep;

            for (let x = 0; x <= radialSegments; x++) {
                const angle = (x / radialSegments) * 2 * Math.PI;
                const xPos = Math.cos(angle) * radius;
                const zPos = Math.sin(angle) * radius;

                // 顶点坐标
                mesh.vertices.push(new Vector3(xPos, yPos, zPos));

                // UV坐标
                mesh.uv.push(new Vector2(x / radialSegments, y / heightSegments));

                // 法线（径向向外）
                mesh.normals.push(new Vector3(xPos, 0, zPos).normalize());
            }
        }

        // 生成侧面三角形索引
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = x + y * (radialSegments + 1);
                const b = x + (y + 1) * (radialSegments + 1);
                const c = (x + 1) + (y + 1) * (radialSegments + 1);
                const d = (x + 1) + y * (radialSegments + 1);

                mesh.triangles.push(a, b, c);
                mesh.triangles.push(a, c, d);
            }
        }

        // 添加顶部和底部盖子
        const addCap = (isTop: boolean) => {
            const centerIndex = mesh.vertices.length;
            const yPos = isTop ? halfHeight : -halfHeight;
            const normal = isTop ? new Vector3(0, 1, 0) : new Vector3(0, -1, 0);

            // 中心顶点
            mesh.vertices.push(new Vector3(0, yPos, 0));
            mesh.uv.push(new Vector2(0.5, 0.5));
            mesh.normals.push(normal.clone());

            // 边缘顶点
            for (let x = 0; x <= radialSegments; x++) {
                const angle = (x / radialSegments) * 2 * Math.PI;
                const xPos = Math.cos(angle) * radius;
                const zPos = Math.sin(angle) * radius;

                mesh.vertices.push(new Vector3(xPos, yPos, zPos));
                mesh.uv.push(new Vector2(
                    0.5 + Math.cos(angle) * 0.5,
                    0.5 + Math.sin(angle) * 0.5
                ));
                mesh.normals.push(normal.clone());
            }

            // 盖子三角形索引
            for (let x = 0; x < radialSegments; x++) {
                const a = centerIndex;
                const b = centerIndex + 1 + x;
                const c = centerIndex + 1 + x + 1;

                if (isTop) {
                    mesh.triangles.push(a, c, b); // 底部需要反转 winding order
                } else {
                    mesh.triangles.push(a, b, c);
                }
            }
        };

        // 添加顶部和底部
        addCap(true);
        addCap(false);

        // 创建子网格
        const subMesh = new SubMesh();
        subMesh.vertexCount = mesh.vertices.length;
        subMesh.firstVertex = 0;
        subMesh.indexCount = mesh.triangles.length;
        subMesh.indexStart = 0;
        mesh.subMeshes.push(subMesh);

        // 计算切线和包围盒
        mesh.calculateMeshData();
        return mesh;
    }

    /**
     * 创建胶囊体
     * @param radius 半径
     * @param height 高度（不含两端半球）
     * @param radialSegments 径向分段数
     * @param heightSegments 高度分段数
     * @param capSegments 半球分段数
     * @returns 胶囊体网格
     */
    public static createCapsule(
        radius: number = 0.5,
        height: number = 1,
        radialSegments: number = 32,
        capSegments: number = 16,
        heightSegments: number = 16
    ): Mesh {
        const mesh = new Mesh();
        const cylinderHeight = height;
        const totalHeight = cylinderHeight + radius * 2;
        const halfTotalHeight = totalHeight / 2;

        // 生成圆柱体部分
        const cylinderYStart = -halfTotalHeight + radius;
        const cylinderYEnd = halfTotalHeight - radius;
        const heightStep = (cylinderYEnd - cylinderYStart) / heightSegments;

        for (let y = 0; y <= heightSegments; y++) {
            const yPos = cylinderYStart + y * heightStep;

            for (let x = 0; x <= radialSegments; x++) {
                const angle = (x / radialSegments) * 2 * Math.PI;
                const xPos = Math.cos(angle) * radius;
                const zPos = Math.sin(angle) * radius;

                mesh.vertices.push(new Vector3(xPos, yPos, zPos));
                mesh.uv.push(new Vector2(x / radialSegments, y / heightSegments));
                mesh.normals.push(new Vector3(xPos, 0, zPos).normalize());
            }
        }

        // 圆柱体三角形索引
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = x + y * (radialSegments + 1);
                const b = x + (y + 1) * (radialSegments + 1);
                const c = (x + 1) + (y + 1) * (radialSegments + 1);
                const d = (x + 1) + y * (radialSegments + 1);

                mesh.triangles.push(a, b, c);
                mesh.triangles.push(a, c, d);
            }
        }

        // 生成上下半球（胶囊两端）
        const addHemisphere = (isTop: boolean) => {
            const baseIndex = mesh.vertices.length;
            const centerY = isTop ? halfTotalHeight / 2 : -halfTotalHeight / 2;

            for (let y = 0; y <= capSegments; y++) {
                const v = y / capSegments;
                const theta = v * Math.PI / 2; // 0到90度
                const ringRadius = radius * Math.sin(theta);
                const yOffset = isTop
                    ? centerY + radius * Math.cos(theta)
                    : centerY - radius * Math.cos(theta);

                for (let x = 0; x <= radialSegments; x++) {
                    const angle = (x / radialSegments) * 2 * Math.PI;
                    const xPos = Math.cos(angle) * ringRadius;
                    const zPos = Math.sin(angle) * ringRadius;

                    // 顶点坐标
                    mesh.vertices.push(new Vector3(xPos, yOffset, zPos));

                    // UV坐标
                    mesh.uv.push(new Vector2(x / radialSegments, isTop ? 1 - v : v));

                    // 法线（从球心指向外）
                    const normal = new Vector3(
                        xPos,
                        yOffset - centerY,
                        zPos
                    ).normalize();
                    mesh.normals.push(normal);
                }
            }

            // 半球三角形索引
            const startRing = 0;
            const endRing = capSegments;
            const verticesPerRing = radialSegments + 1;

            for (let y = startRing; y < endRing; y++) {
                for (let x = 0; x < radialSegments; x++) {
                    const a = baseIndex + x + y * verticesPerRing;
                    const b = baseIndex + x + (y + 1) * verticesPerRing;
                    const c = baseIndex + (x + 1) + (y + 1) * verticesPerRing;
                    const d = baseIndex + (x + 1) + y * verticesPerRing;

                    if (isTop) {
                        mesh.triangles.push(a, c, b);
                        mesh.triangles.push(a, d, c);
                    } else {
                        mesh.triangles.push(a, b, c);
                        mesh.triangles.push(a, c, d);
                    }
                }
            }
        };

        // 添加上下半球
        addHemisphere(true);  // 顶部半球
        addHemisphere(false); // 底部半球

        // 创建子网格
        const subMesh = new SubMesh();
        subMesh.vertexCount = mesh.vertices.length;
        subMesh.firstVertex = 0;
        subMesh.indexCount = mesh.triangles.length;
        subMesh.indexStart = 0;
        mesh.subMeshes.push(subMesh);

        // 计算切线和包围盒
        mesh.calculateMeshData();
        return mesh;
    }
}