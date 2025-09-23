import { UObject } from "../Core/UObject";
import { Bounds } from "../Math/Bounds";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";

export class Mesh extends UObject {
    public bounds: Bounds[];                       // 包围盒
    public material: string[];                     // 材质
    public triangles: number[];                    // 三角形
    public faceNormals: Vector3[];                 // 面法线
    public faceCenters: Vector3[];                 // 面中心
    public vertices: Vector3[];                    // 顶点
    public uv: Vector2[];                          // UV
    public normals: Vector3[];                     // 法线
    public tangents: Vector4[];                    // 切线
    public subMeshes: SubMesh[];                   // 子网格

    public constructor() {
        super();
        this.bounds = [];
        this.material = [];
        this.triangles = [];
        this.faceNormals = [];
        this.vertices = [];
        this.uv = [];
        this.normals = [];
        this.tangents = [];
        this.subMeshes = [];
    }

    // 检查网格是否有效
    public checkValid(): Boolean {
        return this.vertices.length !== 0
            && this.vertices.length === this.uv.length
            && this.vertices.length === this.normals.length
            && this.triangles.length !== 0
            && this.triangles.length % 3 === 0
            && this.faceNormals.length === this.faceCenters.length
            && this.faceNormals.length * 3 === this.triangles.length;
    }

    /**
     * 均匀缩放网格（以原点为基准）
     * @param scale 缩放倍数
     */
    public scale(scale: number): void {
        if (scale === 1) return; // 缩放倍数为1时无需处理

        // 缩放所有顶点（直接以原点为基准）
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = this.vertices[i].clone().multiplyScalar(scale);
        }

        // 缩放面中心
        for (let i = 0; i < this.faceCenters.length; i++) {
            this.faceCenters[i] = this.faceCenters[i].clone().multiplyScalar(scale);
        }

        // 均匀缩放只需归一化法线（方向不变但长度会受缩放影响）
        for (let i = 0; i < this.normals.length; i++) {
            this.normals[i] = this.normals[i].normalize();
        }
        for (let i = 0; i < this.faceNormals.length; i++) {
            this.faceNormals[i] = this.faceNormals[i].normalize();
        }

        // 重新计算包围盒
        this.calculateBounds();
    }

    // 重新计算包围盒和切线等数据
    public calculateMeshData() {
        // 计算切线向量
        this.calculateTangents();
        // 计算整体包围盒
        this.calculateBounds();
        // 计算三角面的法向量
        this.calculateFaceNormals();
    }

    public onDestroy(): void {
        // 清理所有数组引用
        this.vertices.length = 0;
        this.uv.length = 0;
        this.normals.length = 0;
        this.tangents.length = 0;
        this.triangles.length = 0;
        this.faceNormals.length = 0;
        this.faceCenters.length = 0;
        this.subMeshes.length = 0;
        this.bounds.length = 0;
        this.material.length = 0;
    }

    /**
     * 重新计算所有包围盒
     */
    private calculateBounds(): void {
        // 更新子网格信息
        this.subMeshes.forEach(subMesh => {
            // 计算子网格包围盒
            const subVertices = this.vertices.slice(
                subMesh.firstVertex,
                subMesh.firstVertex + subMesh.vertexCount
            );
            subMesh.bounds = Bounds.fromPoints(subVertices);
        });

        // 更新整体包围盒
        this.bounds = this.subMeshes.map(sm => sm.bounds);
    }

    private calculateFaceNormals() {
        if (this.vertices.length === 0 || this.triangles.length === 0) return;

        this.faceNormals = [];
        this.faceCenters = [];

        for (let i = 0; i < this.triangles.length; i += 3) {
            const i0 = this.triangles[i];
            const i1 = this.triangles[i + 1];
            const i2 = this.triangles[i + 2];

            const v0 = this.vertices[i0];
            const v1 = this.vertices[i1];
            const v2 = this.vertices[i2];

            const e1 = Vector3.subtract(v1, v0);
            const e2 = Vector3.subtract(v2, v0);
            const faceNormal = Vector3.cross(e1, e2).normalize();
            this.faceNormals.push(faceNormal);

            const center = Vector3.add(v0, v1).add(v2).divide(3);
            this.faceCenters.push(center);
        }
    }

    /**
     * 计算网格的切线向量
     */
    private calculateTangents() {
        if (this.vertices.length === 0 || this.triangles.length === 0) return;

        const tan1 = new Array(this.vertices.length).fill(0).map(() => new Vector3(0, 0, 0));
        const tan2 = new Array(this.vertices.length).fill(0).map(() => new Vector3(0, 0, 0));

        for (let i = 0; i < this.triangles.length; i += 3) {
            const i0 = this.triangles[i];
            const i1 = this.triangles[i + 1];
            const i2 = this.triangles[i + 2];

            const v0 = this.vertices[i0];
            const v1 = this.vertices[i1];
            const v2 = this.vertices[i2];

            const w0 = this.uv[i0];
            const w1 = this.uv[i1];
            const w2 = this.uv[i2];

            const x1 = v1.x - v0.x;
            const y1 = v1.y - v0.y;
            const z1 = v1.z - v0.z;

            const x2 = v2.x - v0.x;
            const y2 = v2.y - v0.y;
            const z2 = v2.z - v0.z;

            const s1 = w1.x - w0.x;
            const t1 = w1.y - w0.y;
            const s2 = w2.x - w0.x;
            const t2 = w2.y - w0.y;

            const r = 1.0 / (s1 * t2 - s2 * t1);
            const tx = (t2 * x1 - t1 * x2) * r;
            const ty = (t2 * y1 - t1 * y2) * r;
            const tz = (t2 * z1 - t1 * z2) * r;

            tan1[i0].x += tx;
            tan1[i0].y += ty;
            tan1[i0].z += tz;

            tan1[i1].x += tx;
            tan1[i1].y += ty;
            tan1[i1].z += tz;

            tan1[i2].x += tx;
            tan1[i2].y += ty;
            tan1[i2].z += tz;

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

        for (let i = 0; i < this.vertices.length; i++) {
            const n = this.normals[i];
            const t = tan1[i];

            const tangent = Vector3.subtract(t, Vector3.multiplyScalar(n, Vector3.dot(n, t))).normalize();
            const handedness = Vector3.dot(Vector3.cross(n, t), tan2[i]) < 0.0 ? -1 : 1;

            this.tangents[i] = new Vector4(tangent.x, tangent.y, tangent.z, handedness);
        }
    }
}

export class SubMesh {
    public vertexCount: number;
    public firstVertex: number;
    public indexCount: number;
    public indexStart: number;
    public bounds: Bounds;
    public material: string;

    public constructor() {
        this.vertexCount = 0;
        this.firstVertex = 0;
        this.indexCount = 0;
        this.indexStart = 0;
        this.bounds = new Bounds();
        this.material = "";
    }
}
