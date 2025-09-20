import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";

export class Vector4 {

    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public get r(): number { return this.x; }
    public get g(): number { return this.y; }
    public get b(): number { return this.z; }
    public get a(): number { return this.w; }

    public get vector3(): Vector3 { return new Vector3(this); }

    public constructor();
    public constructor(x: number, y: number, z: number, w: number);
    public constructor(v: Vector2);
    public constructor(v: Vector3);
    public constructor(v: Vector3, w: number);
    public constructor() {
        if (arguments[0] instanceof Vector2) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.z = this.w = 0;
        }
        else if (arguments[0] instanceof Vector3) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.z = arguments[0].z;
            this.w = arguments.length == 2 ? arguments[1] : 0;
        }
        else if (arguments.length == 4) {
            this.x = arguments[0];
            this.y = arguments[1];
            this.z = arguments[2];
            this.w = arguments[3];
        }
        else {
            this.x = this.y = this.z = this.w = 0;
        }
    }

    /*
     OPERATIONS ON VECTOR
     */

    public add(v: Vector4): Vector4 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    }

    public subtract(v: Vector4): Vector4 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    }

    public multiply(v: Vector4): Vector4 {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
        return this;
    }

    public divide(d: number): Vector4 {
        this.x /= d;
        this.y /= d;
        this.z /= d;
        this.w /= d;
        return this;
    }

    public multiplyScalar(d: number): Vector4 {
        this.x *= d;
        this.y *= d;
        this.z *= d;
        this.w *= d;
        return this;
    }

    public negate(): Vector4 {
        return this.multiplyScalar(-1);
    }

    public normalize(): Vector4 {
        var length = this.magnitude;

        if (length === 0)
            return new Vector4();

        return this.divide(length);
    }

    public get magnitude(): number {
        return Math.sqrt(Vector4.dot(this, this));
    }

    public get sqrMagnitude(): number {
        return Vector4.dot(this, this);
    }

    /*
     ADDITIONAL FUNCTIONS
     */

    public clone(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    public equals(v: Vector4): boolean {
        return v.x == this.x && v.y == this.y && v.z == this.z && v.w == this.w;
    }

    public toString(): string {
        return "[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]";
    }

    /*
     STATIC FUNCTIONS
     */

    public static add(v1: Vector4, v2: Vector4): Vector4 {
        return new Vector4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    }

    public static subtract(v1: Vector4, v2: Vector4): Vector4 {
        return new Vector4(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
    }

    public static multiply(v1: Vector4, v2: Vector4): Vector4 {
        return new Vector4(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z, v1.w * v2.w);
    }

    public static divide(v1: Vector4, scalar: number): Vector4 {
        return new Vector4(v1.x / scalar, v1.y / scalar, v1.z / scalar, v1.w / scalar);
    }

    public static multiplyScalar(v1: Vector4, scalar: number): Vector4 {
        return new Vector4(v1.x * scalar, v1.y * scalar, v1.z * scalar, v1.w * scalar);
    }

    public static lerp(v1: Vector4, v2: Vector4, t: number): Vector4 {
        var v = new Vector4();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);
        v.w = v1.w + t * (v2.w - v1.w);
        return v;
    }

    public static dot(v1: Vector4, v2: Vector4): number {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w);
    }

    public static distance(v1: Vector4, v2: Vector4): number {
        return Math.sqrt(Vector4.dot(v1, v2));
    }

    /*
     STATIC VARIABLES
     */

    public static get ZERO() {
        return new Vector4(0, 0, 0, 0);
    }

    public static get ONE() {
        return new Vector4(1, 1, 1, 1);
    }
}