import { Vector3 } from "../Math/Vector3";
import { Vector2 } from "../Math/Vector2";
import { Collider } from "../Component/Collider";
import { Transform } from "../Core/Transform";
import { Rigidbody } from "../Component/RigidBody";
import { Renderer } from "../Component/Renderer";

/**
 * Structure used to get information back from a raycast.
 */
export class RaycastHit {
    private m_Point: Vector3 = Vector3.ZERO;
    private m_Normal: Vector3 = Vector3.ZERO;
    private m_FaceID: number = 0;
    private m_Distance: number = 0;
    private m_UV: Vector2 = Vector2.ZERO;
    private m_Collider: number = 0;

    /**
     * The Collider that was hit.
     */
    public get collider(): Collider | null {
        throw new Error("Not implemented");
        //return Object.findObjectFromInstanceID(this.m_Collider) as Collider;
    }

    /**
     * Instance ID of the Collider that was hit.
     */
    public get colliderInstanceID(): number {
        return this.m_Collider;
    }

    /**
     * The impact point in world space where the ray hit the collider.
     */
    public get point(): Vector3 {
        return this.m_Point;
    }

    public set point(value: Vector3) {
        this.m_Point = value;
    }

    /**
     * The normal of the surface the ray hit.
     */
    public get normal(): Vector3 {
        return this.m_Normal;
    }

    public set normal(value: Vector3) {
        this.m_Normal = value;
    }

    /**
     * The barycentric coordinate of the triangle we hit.
     */
    public get barycentricCoordinate(): Vector3 {
        return new Vector3(1 - (this.m_UV.y + this.m_UV.x), this.m_UV.x, this.m_UV.y);
    }

    public set barycentricCoordinate(value: Vector3) {
        this.m_UV = new Vector2(value.y, value.z);
    }

    /**
     * The distance from the ray's origin to the impact point.
     */
    public get distance(): number {
        return this.m_Distance;
    }

    public set distance(value: number) {
        this.m_Distance = value;
    }

    /**
     * The index of the triangle that was hit.
     */
    public get triangleIndex(): number {
        return this.m_FaceID;
    }

    /**
     * The uv texture coordinate at the collision location.
     */
    public get textureCoord(): Vector2 {
        return RaycastHit.calculateRaycastTexCoord(this.m_Collider, this.m_UV, this.m_Point, this.m_FaceID, 0);
    }

    /**
     * The secondary uv texture coordinate at the impact point.
     */
    public get textureCoord2(): Vector2 {
        return RaycastHit.calculateRaycastTexCoord(this.m_Collider, this.m_UV, this.m_Point, this.m_FaceID, 1);
    }

    /**
     * The Transform of the rigidbody or collider that was hit.
     */
    public get transform(): Transform | null {
        const rb = this.rigidbody;
        if (rb !== null) {
            return rb.transform;
        }

        const col = this.collider;
        if (col !== null) {
            return col.transform;
        }

        return null;
    }

    /**
     * The Rigidbody of the collider that was hit. If the collider is not attached to
     * a rigidbody then it is null.
     */
    public get rigidbody(): Rigidbody | null {
        const col = this.collider;
        return col !== null ? col.attachedRigidbody : null;
    }

    /**
     * The ArticulationBody of the collider that was hit. If the collider is not attached
     * to an articulation body then it is null.
     */
    // public get articulationBody(): ArticulationBody | null {
    //     const col = this.collider;
    //     return col !== null ? col.attachedArticulationBody : null;
    // }

    /**
     * The uv lightmap coordinate at the impact point.
     */
    // public get lightmapCoord(): Vector2 {
    //     let result = RaycastHit.calculateRaycastTexCoord(this.m_Collider, this.m_UV, this.m_Point, this.m_FaceID, 1);
        
    //     const col = this.collider;
    //     if (col !== null) {
    //         const renderer = col.gameObject.getComponent(Renderer);
    //         if (renderer !== null) {
    //             const lightmapScaleOffset = renderer.lightmapScaleOffset;
    //             result.x = result.x * lightmapScaleOffset.x + lightmapScaleOffset.z;
    //             result.y = result.y * lightmapScaleOffset.y + lightmapScaleOffset.w;
    //         }
    //     }

    //     return result;
    // }

    /**
     * @deprecated Use textureCoord2 instead.
     */
    public get textureCoord1(): Vector2 {
        return this.textureCoord2;
    }

    /**
     * Calculates the raycast texture coordinate.
     * @param colliderInstanceID The instance ID of the collider
     * @param uv The UV coordinates
     * @param pos The position
     * @param face The face ID
     * @param textcoord The texture coordinate index
     * @returns The calculated texture coordinate
     */
    private static calculateRaycastTexCoord(
        colliderInstanceID: number,
        uv: Vector2,
        pos: Vector3,
        face: number,
        textcoord: number
    ): Vector2 {
        return RaycastHit.calculateRaycastTexCoord_Injected(colliderInstanceID, uv, pos, face, textcoord);
    }

    /**
     * Internal implementation for calculating raycast texture coordinates.
     */
    private static calculateRaycastTexCoord_Injected(
        colliderInstanceID: number,
        uv: Vector2,
        pos: Vector3,
        face: number,
        textcoord: number
    ): Vector2 {
        // 这里需要实现实际的纹理坐标计算逻辑
        // 在实际项目中，这通常需要与物理引擎或渲染系统集成
        return uv.clone();
    }

    /**
     * Creates a new RaycastHit with default values.
     */
    public constructor() {}

    /**
     * Creates a new RaycastHit with the specified values.
     * @param point The impact point
     * @param normal The surface normal
     * @param distance The distance from origin
     * @param colliderInstanceID The collider instance ID
     */
    public static create(
        point: Vector3,
        normal: Vector3,
        distance: number,
        colliderInstanceID: number
    ): RaycastHit {
        const hit = new RaycastHit();
        hit.m_Point = point;
        hit.m_Normal = normal;
        hit.m_Distance = distance;
        hit.m_Collider = colliderInstanceID;
        return hit;
    }

    /**
     * Resets the RaycastHit to default values.
     */
    public reset(): void {
        this.m_Point = Vector3.ZERO;
        this.m_Normal = Vector3.ZERO;
        this.m_FaceID = 0;
        this.m_Distance = 0;
        this.m_UV = Vector2.ZERO;
        this.m_Collider = 0;
    }

    /**
     * Returns a string representation of the RaycastHit.
     */
    public toString(): string {
        return `RaycastHit(point: ${this.point}, normal: ${this.normal}, distance: ${this.distance}, collider: ${this.colliderInstanceID})`;
    }
}

// 使用示例
// const hit = new RaycastHit();
// hit.point = new Vector3(1, 2, 3);
// hit.normal = Vector3.up;
// hit.distance = 5.5;
// console.log(hit.toString());