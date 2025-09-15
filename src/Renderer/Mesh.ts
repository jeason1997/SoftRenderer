import { Bounds } from "../Math/Bounds";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";

export class Mesh {
    public bounds: Bounds[];                       // 包围盒
    public material: string[];                     // 材质
    public triangles: number[];                    // 三角形
    public faceNormals: Vector3[];                 // 面法线
    public faceCenters: Vector3[];                 // 面中心
    public vertices: Vector3[];                    // 顶点
    public uv: Vector2[];                          // UV
    public normals: Vector3[];                     // 法线
    public tangents: Vector4[];                    // 切线，可从模型中获取或通过法线计算得到
    public subMeshes: SubMesh[];                   // 子网格

    public constructor() {
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
        // 检查定点数、uv数、法线数量是否不为零并且相等，同时三角形数量应该是三的倍数
        return this.vertices.length !== 0
            && this.vertices.length === this.uv.length
            && this.vertices.length === this.normals.length
            && this.triangles.length !== 0
            && this.triangles.length % 3 === 0
            && this.faceNormals.length === this.faceCenters.length
            && this.faceNormals.length * 3 === this.triangles.length;
    }

    // 重新计算包围盒
    public recalculateBounds() {
        //TODO
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

export class Line {
    public start: Vector3;
    public end: Vector3;

    public constructor(start: Vector3, end: Vector3) {
        this.start = start;
        this.end = end;
    }
}