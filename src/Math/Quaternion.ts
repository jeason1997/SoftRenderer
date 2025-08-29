import { Vector3 } from "./Vector3";
import { Matrix4x4 } from "./Matrix4x4";

export class Quaternion {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public constructor();
    public constructor(x: number, y: number, z: number, w: number);
    public constructor(angle: number, axis: Vector3);
    public constructor(euler: Vector3);
    public constructor() {
        if (arguments.length == 4) {
            this.x = arguments[0];
            this.y = arguments[1];
            this.z = arguments[2];
            this.w = arguments[3];
        }
        else if (arguments.length == 2) {
            this.rotateAround(arguments[0], arguments[1]);
        }
        else if (arguments.length == 1) {
            this.eulerAngles = arguments[0];
        }
        else {
            this.x = this.y = this.z = 0;
            this.w = 1;
        }
    }

    public get eulerAngles(): Vector3 {
        return Matrix4x4.getRotateMatrixByQuaternion(this).getEulerAngles();
    }

    public set eulerAngles(e: Vector3) {
        var q = Matrix4x4.getRotateMatrixByEulerAngles(e).getRotate();
        this.w = q.w;
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
    }

    public rotateAround(angle: number, axis: Vector3): Quaternion {
        let q = Quaternion.angleAxis(angle, axis);
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;
    }

    /**
    * @zh 向量四元数乘法
    */
    public transformQuat(a: Vector3): Vector3 {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations

        let out = new Vector3();
        let q = this;

        // calculate quat * vec
        const ix = q.w * a.x + q.y * a.z - q.z * a.y;
        const iy = q.w * a.y + q.z * a.x - q.x * a.z;
        const iz = q.w * a.z + q.x * a.y - q.y * a.x;
        const iw = -q.x * a.x - q.y * a.y - q.z * a.z;

        // calculate result * inverse quat
        out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        return out;
    }

    public copy(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    /**
     * @zh 四元数球面插值
     */
    public static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations

        let out = new Quaternion();

        let scale0 = 0;
        let scale1 = 0;

        // calc cosine
        let cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            b.x = -b.x;
            b.y = -b.y;
            b.z = -b.z;
            b.w = -b.w;
        }
        // calculate coefficients
        if ((1.0 - cosom) > 0.000001) {
            // standard case (slerp)
            const omega = Math.acos(cosom);
            const sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out.x = scale0 * a.x + scale1 * b.x;
        out.y = scale0 * a.y + scale1 * b.y;
        out.z = scale0 * a.z + scale1 * b.z;
        out.w = scale0 * a.w + scale1 * b.w;

        return out;
    }

    public static dot(a: Quaternion, b: Quaternion): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    public static angleAxis(angle: number, axis: Vector3): Quaternion {
        let res = new Quaternion();

        angle = Math.PI * angle / 180;
        angle *= 0.5;
        const sin = Math.sin(angle);

        res.x = axis.x * sin;
        res.y = axis.y * sin;
        res.z = axis.z * sin;
        res.w = Math.cos(angle);

        return res;
    }

    public static get identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
    }
}