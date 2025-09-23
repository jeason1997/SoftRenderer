import { Vector2 } from "./Vector2";
import { Vector4 } from "./Vector4";

export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    public constructor();
    public constructor(x: number, y: number, z: number);
    public constructor(v: Vector2);
    public constructor(v: Vector4);
    public constructor() {
        if (arguments[0] instanceof Vector2) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.z = 0;
        }
        else if (arguments[0] instanceof Vector4) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.z = arguments[0].z;
        }
        else if (arguments.length == 3) {
            this.x = arguments[0];
            this.y = arguments[1];
            this.z = arguments[2];
        }
        else {
            this.x = this.y = this.z = 0;
        }
    }

    /*
     OPERATIONS ON VECTOR
     */

    public add(v: Vector3): Vector3 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    public subtract(v: Vector3): Vector3 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    public multiply(v: Vector3): Vector3 {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    public divide(d: number): Vector3 {
        this.x /= d;
        this.y /= d;
        this.z /= d;
        return this;
    }

    public multiplyScalar(s: number): Vector3 {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    public negate(): Vector3 {
        return this.multiplyScalar(-1);
    }

    public normalize(): Vector3 {
        var length = this.magnitude;
        if (length === 0)
            return new Vector3();
        return this.divide(length);
    }

    public dot(v: Vector3): number {
        return Vector3.dot(this, v);
    }

    public cross(v: Vector3): Vector3 {
        return Vector3.cross(this, v);
    }

    public get magnitude(): number {
        return Math.sqrt(Vector3.dot(this, this));
    }

    public get sqrMagnitude(): number {
        return Vector3.dot(this, this);
    }

    /**
     * 获取向量的指定分量
     * @param index 分量索引 (0=x, 1=y, 2=z)
     * @returns 对应分量的值
     */
    public getComponent(index: number): number {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            default:
                throw new Error(`Invalid component index: ${index}. Must be 0, 1, or 2.`);
        }
    }

    /**
     * 设置向量的指定分量
     * @param index 分量索引 (0=x, 1=y, 2=z)
     * @param value 要设置的值
     */
    public setComponent(index: number, value: number): void {
        switch (index) {
            case 0: this.x = value; break;
            case 1: this.y = value; break;
            case 2: this.z = value; break;
            default:
                throw new Error(`Invalid component index: ${index}. Must be 0, 1, or 2.`);
        }
    }

    /*
     ADDITIONAL FUNCTIONS
     */

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public equals(v: Vector3): boolean {
        return v.x == this.x && v.y == this.y && v.z == this.z;
    }

    public toString(): string {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }

    /*
     STATIC FUNCTIONS
     */

    public static add(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    public static subtract(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static multiply(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    public static divide(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }

    public static multiplyScalar(v1: Vector3, s: number): Vector3 {
        return new Vector3(v1.x * s, v1.y * s, v1.z * s);
    }

    public static lerp(v1: Vector3, v2: Vector3, t: number): Vector3 {
        var v = new Vector3();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);
        return v;
    }

    public static reflect(v: Vector3, n: Vector3): Vector3 {
        return Vector3.subtract(v, Vector3.multiplyScalar(n, 2 * Vector3.dot(v, n)));
    }

    public static dot(v1: Vector3, v2: Vector3): number {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
    }

    public static cross(v1: Vector3, v2: Vector3): Vector3 {
        var x = v1.y * v2.z - v1.z * v2.y;
        var y = v1.z * v2.x - v1.x * v2.z;
        var z = v1.x * v2.y - v1.y * v2.x;
        return new Vector3(x, y, z);
    }

    public static distance(v1: Vector3, v2: Vector3): number {
        var x = v2.x - v1.x;
        var y = v2.y - v1.y;
        var z = v2.z - v1.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    public static difference(v1: Vector3, v2: Vector3): Vector3 {
        var dest = new Vector3();

        dest.x = v1.x - v2.x
        dest.y = v1.y - v2.y
        dest.z = v1.z - v2.z

        return dest
    }

    public static angle(v1: Vector3, v2: Vector3): number {
        return Math.acos(Vector3.dot(v1, v2) / (v1.magnitude * v2.magnitude));
    }

    public static normalize(v: Vector3): Vector3 {
        var length = v.magnitude;
        if (length === 0)
            return new Vector3();
        return Vector3.multiplyScalar(v, 1 / length);
    }

    /**
     * 返回两个向量中每对分量的较小值组成的新向量[1,2](@ref)
     * @param a 第一个向量
     * @param b 第二个向量
     * @returns 由各分量较小值组成的新向量
     */
    public static min(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            Math.min(a.x, b.x),
            Math.min(a.y, b.y),
            Math.min(a.z, b.z)
        );
    }

    /**
     * 返回两个向量中每对分量的较大值组成的新向量[3,4](@ref)
     * @param a 第一个向量
     * @param b 第二个向量
     * @returns 由各分量较大值组成的新向量
     */
    public static max(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            Math.max(a.x, b.x),
            Math.max(a.y, b.y),
            Math.max(a.z, b.z)
        );
    }

    /*
     STATIC VARIABLES
     */

    public static get ZERO() {
        return new Vector3(0, 0, 0);
    }

    public static get ONE() {
        return new Vector3(1, 1, 1);
    }

    public static get RIGHT() {
        return new Vector3(1, 0, 0);
    }

    public static get LEFT() {
        return new Vector3(-1, 0, 0);
    }

    public static get UP() {
        return new Vector3(0, 1, 0);
    }

    public static get DOWN() {
        return new Vector3(0, -1, 0);
    }

    public static get FORWARD() {
        return new Vector3(0, 0, 1);
    }

    public static get BACK() {
        return new Vector3(0, 0, -1);
    }
}