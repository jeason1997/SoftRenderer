import { Vector3 } from "../Math/Vector3";
import { Collider } from "../Component/Collider";
import { Transform } from "../Core/Transform";
import { Rigidbody } from "../Component/RigidBody";

/**
 * Structure used to get information back from a raycast.
 */
export class RaycastHit {
    private m_Point: Vector3 = Vector3.ZERO;
    private m_Normal: Vector3 = Vector3.ZERO;
    private m_Distance: number = 0;
    private m_Collider: Collider;

    /**
     * The Collider that was hit.
     */
    public get collider(): Collider | null {
        return this.m_Collider;
    }

    /**
     * The impact point in world space where the ray hit the collider.
     */
    public get point(): Vector3 {
        return this.m_Point;
    }

    /**
     * The normal of the surface the ray hit.
     */
    public get normal(): Vector3 {
        return this.m_Normal;
    }

    /**
     * The distance from the ray's origin to the impact point.
     */
    public get distance(): number {
        return this.m_Distance;
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
        return this.m_Collider?.attachedRigidbody;
    }

    /**
     * Creates a new RaycastHit with default values.
     */
    public constructor() { }

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
        collider: Collider,
    ): RaycastHit {
        const hit = new RaycastHit();
        hit.m_Point = point;
        hit.m_Normal = normal;
        hit.m_Distance = distance;
        hit.m_Collider = collider;
        return hit;
    }

    /**
     * Returns a string representation of the RaycastHit.
     */
    public toString(): string {
        return `RaycastHit(point: ${this.point}, normal: ${this.normal}, distance: ${this.distance}, collider: ${this.collider?.gameObject?.name || 'null'})`;
    }
}