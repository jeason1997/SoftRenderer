import { Vector2 } from "./Vector2";
import { Vector4 } from "./Vector4";

export class Vector3 {

    public x: number;
    public y: number;
    public z: number;

    public constructor();
    public constructor(x: number, y: number, z: number);
    public constructor(v: Vector2);
    public constructor(v: Vector4)
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

    public add(v: Vector3): Vector3;
    public add(x: number, y: number, z: number): Vector3;
    add() {
        if (arguments[0] instanceof Vector3) {
            this.x += arguments[0].x;
            this.y += arguments[0].y;
            this.z += arguments[0].z;
        } else {
            this.x += arguments[0];
            this.y += arguments[1];
            this.z += arguments[2];
        }
        return this;
    }

    public subtract(v: Vector3): Vector3;
    public subtract(x: number, y: number, z: number): Vector3;
    subtract() {
        if (arguments[0] instanceof Vector3) {
            this.x -= arguments[0].x;
            this.y -= arguments[0].y;
            this.z -= arguments[0].z;
        } else {
            this.x -= arguments[0];
            this.y -= arguments[1];
            this.z -= arguments[2];
        }
        return this;
    }

    public multiply(d: number): Vector3 {
        this.x *= d;
        this.y *= d;
        this.z *= d;
        return this;
    }

    public divide(d: number): Vector3 {
        this.x /= d;
        this.y /= d;
        this.z /= d;
        return this;
    }

    public scale(v: Vector3): Vector3 {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    public negate(): Vector3 {
        return this.multiply(-1);
    }

    public normalize(): Vector3 {
        var length = this.magnitude;

        if (length === 0)
            return new Vector3();

        return this.divide(length);
    }

    public get magnitude(): number {
        return Math.sqrt(Vector3.dot(this, this));
    }

    public get sqrMagnitude(): number {
        return Vector3.dot(this, this);
    }

    /*
     ADDITIONAL FUNCTIONS
     */

    public copy(): Vector3 {
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

    public static lerp(v1: Vector3, v2: Vector3, t: number): Vector3 {
        var v = new Vector3();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);
        return v;
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