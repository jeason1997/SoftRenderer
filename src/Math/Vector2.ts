import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class Vector2 {

    public x: number;
    public y: number;

    public get width(): number { return this.x; }
    public get height(): number { return this.y; }

    public constructor();
    public constructor(x: number, y: number);
    public constructor(v: Vector3);
    public constructor(v: Vector4)
    public constructor() {
        if (arguments[0] instanceof Vector3) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        }
        else if (arguments[0] instanceof Vector4) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        }
        else if (arguments.length == 2) {
            this.x = arguments[0];
            this.y = arguments[1];
        }
        else {
            this.x = this.y = 0;
        }
    }

    /*
        OPERATIONS ON VECTOR
     */

    public add(v: Vector2): Vector2;
    public add(x: number, y: number): Vector2;
    add() {
        if (arguments[0] instanceof Vector2) {
            this.x += arguments[0].x;
            this.y += arguments[0].y;
        } else {
            this.x += arguments[0];
            this.y += arguments[1];
        }
        return this;
    }

    public subtract(v: Vector2): Vector2;
    public subtract(x: number, y: number): Vector2;
    subtract() {
        if (arguments[0] instanceof Vector2) {
            this.x -= arguments[0].x;
            this.y -= arguments[0].y;
        } else {
            this.x -= arguments[0];
            this.y -= arguments[1];
        }
        return this;
    }

    public multiply(d: number): Vector2 {
        this.x *= d;
        this.y *= d;
        return this;
    }

    public divide(d: number): Vector2 {
        this.x /= d;
        this.y /= d;
        return this;
    }

    public scale(v: Vector2): Vector2 {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    public dot(v: Vector2): number {
        return (this.x * v.x + this.y * v.y);
    }

    public negate(): Vector2 {
        return this.multiply(-1);
    }

    public normalize(): Vector2 {
        var length = this.magnitude;

        if (length === 0)
            return new Vector2();

        return this.divide(length);
    }

    public get magnitude(): number {
        return Math.sqrt(Vector2.dot(this, this));
    }

    public get sqrMagnitude(): number {
        return Vector2.dot(this, this);
    }

    /*
        ADDITIONAL FUNCTIONS
     */

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public equals(v: Vector2): boolean {
        return v.x == this.x && v.y == this.y;
    }

    public toString(): string {
        return "[" + this.x + ", " + this.y + "]";
    }

    /*
        STATIC FUNCTIONS
     */

    public static lerp(v1: Vector2, v2: Vector2, t: number): Vector2 {
        var v = new Vector2();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        return v;
    }

    public static dot(v1: Vector2, v2: Vector2): number {
        return (v1.x * v2.x + v1.y * v2.y);
    }

    public static cross(v1: Vector2, v2: Vector2): number {
        return (v1.x * v2.y - v1.y * v2.x);
    }

    public static distance(v1: Vector2, v2: Vector2): number {
        var x = v2.x - v1.x;
        var y = v2.y - v1.y;
        return Math.sqrt(x * x + y * y);
    }

    public static angle(v1: Vector2, v2: Vector2): number {
        return Math.acos(Vector2.dot(v1, v2) / (v1.magnitude * v2.magnitude));
    }

    /*
        STATIC VARIABLES
     */

    public static get ZERO() {
        return new Vector2(0, 0);
    }

    public static get ONE() {
        return new Vector2(1, 1);
    }

    public static get RIGHT() {
        return new Vector2(1, 0);
    }

    public static get LEFT() {
        return new Vector2(-1, 0);
    }

    public static get UP() {
        return new Vector2(0, 1);
    }

    public static get DOWN() {
        return new Vector2(0, -1);
    }
}