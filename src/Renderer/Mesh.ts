import { Bounds } from "../Math/Bounds";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";

export class Mesh {
    bounds: Bounds[];                       // 包围盒
    material: string[];                     // 材质
    triangles: number[];                    // 三角形
    vertices: Vector3[];                    // 顶点
    uv: Vector2[];                          // UV
    normals: Vector3[];                     // 法线
    tangents: Vector4[];                    // 切线，可从模型中获取或通过法线计算得到
    subMeshes: SubMesh[];                   // 子网格

    // 检查网格是否有效
    public checkValid(): Boolean {
        // 检查定点数、uv数、法线数量是否不为零并且相等，同时三角形数量应该是三的倍数
        return this.vertices.length !== 0
            && this.vertices.length === this.uv.length
            && this.vertices.length === this.normals.length
            && this.triangles.length !== 0
            && this.triangles.length % 3 === 0;
    }

    // 重新计算包围盒
    public recalculateBounds() {
        //TODO
    }
}

export class SubMesh {
    vertexCount: number;
    firstVertex: number;
    indexCount: number;
    indexStart: number;
    bounds: Bounds;
    material: string;
}