import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";
import { Quaternion } from "./Quaternion";
import { Matrix4x4 } from "./Matrix4x4";

export class Matrix3x3 {

    public matrix: Array<Array<number>> = new Array<Array<number>>();

    public constructor();
    public constructor(column0: Vector3, column1: Vector3, column2: Vector3);
    public constructor() {
        if (arguments.length == 3) {
            for (let i = 0; i < 3; i++) {
                let v = arguments[i] as Vector3;
                this.matrix[i] = new Array<number>(v.x, v.y, v.z);
            }
        }
        else {
            for (let i = 0; i < 3; i++) {
                this.matrix[i] = new Array<number>(0, 0, 0);
            }
        }
    }

    /**
     * 获取指定行
     * @param index 行索引
     */
    public getRow(index: number): Vector3 {
        var c = this.matrix[index];
        return new Vector3(c[0], c[1], c[2]);
    }

    /**
     * 获取指定列
     * @param index 列索引
     */
    public getColumn(index: number): Vector3 {
        return new Vector3(this.matrix[0][index], this.matrix[1][index], this.matrix[2][index]);
    }

    public SetRow(index: number, row: Vector3) {
        this.matrix[index][0] = row.x;
        this.matrix[index][1] = row.y;
        this.matrix[index][2] = row.z;
    }

    public SetColumn(index: number, column: Vector3) {
        this.matrix[0][index] = column.x;
        this.matrix[1][index] = column.y;
        this.matrix[2][index] = column.z;
    }

    public multiply(m: Matrix3x3): Matrix3x3 {
        let lhs = this.matrix;
        let rhs = m.matrix;
        let matrix = new Matrix3x3().matrix;

        matrix[0][0] = lhs[0][0] * rhs[0][0] + lhs[0][1] * rhs[1][0] + lhs[0][2] * rhs[2][0];
        matrix[0][1] = lhs[0][0] * rhs[0][1] + lhs[0][1] * rhs[1][1] + lhs[0][2] * rhs[2][1];
        matrix[0][2] = lhs[0][0] * rhs[0][2] + lhs[0][1] * rhs[1][2] + lhs[0][2] * rhs[2][2];
        matrix[1][0] = lhs[1][0] * rhs[0][0] + lhs[1][1] * rhs[1][0] + lhs[1][2] * rhs[2][0];
        matrix[1][1] = lhs[1][0] * rhs[0][1] + lhs[1][1] * rhs[1][1] + lhs[1][2] * rhs[2][1];
        matrix[1][2] = lhs[1][0] * rhs[0][2] + lhs[1][1] * rhs[1][2] + lhs[1][2] * rhs[2][2];
        matrix[2][0] = lhs[2][0] * rhs[0][0] + lhs[2][1] * rhs[1][0] + lhs[2][2] * rhs[2][0];
        matrix[2][1] = lhs[2][0] * rhs[0][1] + lhs[2][1] * rhs[1][1] + lhs[2][2] * rhs[2][1];
        matrix[2][2] = lhs[2][0] * rhs[0][2] + lhs[2][1] * rhs[1][2] + lhs[2][2] * rhs[2][2];

        this.matrix = matrix;
        return this;
    }

    public multiplyVector3(v: Vector3): Vector3 {
        let res = new Vector3();
        let m = this.matrix;

        res.x = m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z;
        res.y = m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z;
        res.z = m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z;

        return res;
    }

    public multiplyVector4(v: Vector4): Vector4 {
        let res = new Vector4();
        let m = this.matrix;

        res.x = m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z;
        res.y = m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z;
        res.z = m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z;
        res.w = v.w; // 保持w分量不变

        return res;
    }

    // 转置矩阵
    public transpose(): Matrix3x3 {
        let m1 = this.matrix;
        var m2 = new Matrix3x3().matrix;

        m2[0][0] = m1[0][0]; m2[0][1] = m1[1][0]; m2[0][2] = m1[2][0];
        m2[1][0] = m1[0][1]; m2[1][1] = m1[1][1]; m2[1][2] = m1[2][1];
        m2[2][0] = m1[0][2]; m2[2][1] = m1[1][2]; m2[2][2] = m1[2][2];

        this.matrix = m2;
        return this;
    }

    // 计算矩阵的行列式
    public determinant(): number {
        let m = this.matrix;
        let a = m[0][0], b = m[0][1], c = m[0][2];
        let d = m[1][0], e = m[1][1], f = m[1][2];
        let g = m[2][0], h = m[2][1], i = m[2][2];

        return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

    // 计算逆矩阵
    public invert(): Matrix3x3 {
        let mat = this.matrix;
        let det = this.determinant();

        if (!det) {
            console.error("Matrix3x3 inverse failed, determinant is 0");
            return this;
        }

        let invDet = 1.0 / det;
        let m00 = mat[0][0], m01 = mat[0][1], m02 = mat[0][2];
        let m10 = mat[1][0], m11 = mat[1][1], m12 = mat[1][2];
        let m20 = mat[2][0], m21 = mat[2][1], m22 = mat[2][2];

        // 计算伴随矩阵
        mat[0][0] = (m11 * m22 - m12 * m21) * invDet;
        mat[0][1] = (m02 * m21 - m01 * m22) * invDet;
        mat[0][2] = (m01 * m12 - m02 * m11) * invDet;
        mat[1][0] = (m12 * m20 - m10 * m22) * invDet;
        mat[1][1] = (m00 * m22 - m02 * m20) * invDet;
        mat[1][2] = (m02 * m10 - m00 * m12) * invDet;
        mat[2][0] = (m10 * m21 - m11 * m20) * invDet;
        mat[2][1] = (m01 * m20 - m00 * m21) * invDet;
        mat[2][2] = (m00 * m11 - m01 * m10) * invDet;

        return this;
    }

    public toFloat32List(): Float32Array {
        let m = this.matrix;
        //由于OpenGL是列序存储，所以需要转置一下矩阵
        return new Float32Array([
            m[0][0], m[1][0], m[2][0],
            m[0][1], m[1][1], m[2][1],
            m[0][2], m[1][2], m[2][2]
        ]);
    }

    public clone(): Matrix3x3 {
        return new Matrix3x3(
            this.getRow(0),
            this.getRow(1),
            this.getRow(2)
        );
    }

    /*
     STATIC FUNCTIONS
     */

    public static get identity(): Matrix3x3 {
        let m = new Matrix3x3();
        m.matrix[0][0] = 1;
        m.matrix[1][1] = 1;
        m.matrix[2][2] = 1;
        return m;
    }

    public static add(m1: Matrix3x3, m2: Matrix3x3): Matrix3x3 {
        let result = new Matrix3x3();
        let m = result.matrix;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                m[i][j] = m1.matrix[i][j] + m2.matrix[i][j];
            }
        }
        return result;
    }

    public static subtract(m1: Matrix3x3, m2: Matrix3x3): Matrix3x3 {
        let result = new Matrix3x3();
        let m = result.matrix;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                m[i][j] = m1.matrix[i][j] - m2.matrix[i][j];
            }
        }
        return result;
    }

    public static multiplyScalar(m: Matrix3x3, scalar: number): Matrix3x3 {
        let result = new Matrix3x3();
        let resultMatrix = result.matrix;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                resultMatrix[i][j] = m.matrix[i][j] * scalar;
            }
        }
        return result;
    }

    public static lerp(m1: Matrix3x3, m2: Matrix3x3, t: number): Matrix3x3 {
        let result = new Matrix3x3();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = m1.matrix[i][j] + (m2.matrix[i][j] - m1.matrix[i][j]) * t;
            }
        }
        return result;
    }

    // 从Quaternion获取旋转矩阵
    public static getRotateMatrixByQuaternion(q: Quaternion): Matrix3x3 {
        let result = new Matrix3x3();
        let m = result.matrix;

        let num = q.x * 2;
        let num2 = q.y * 2;
        let num3 = q.z * 2;
        let num4 = q.x * num;
        let num5 = q.y * num2;
        let num6 = q.z * num3;
        let num7 = q.x * num2;
        let num8 = q.x * num3;
        let num9 = q.y * num3;
        let num10 = q.w * num;
        let num11 = q.w * num2;
        let num12 = q.w * num3;

        m[0][0] = 1 - (num5 + num6);
        m[1][0] = num7 + num12;
        m[2][0] = num8 - num11;
        m[0][1] = num7 - num12;
        m[1][1] = 1 - (num4 + num6);
        m[2][1] = num9 + num10;
        m[0][2] = num8 + num11;
        m[1][2] = num9 - num10;
        m[2][2] = 1 - (num4 + num5);

        return result;
    }

    // 通过欧拉角获取旋转矩阵
    public static getRotateMatrixByEulerAngles(e: Vector3, order: string = "XYZ"): Matrix3x3 {
        var x = Matrix3x3.getRotateMatrixByAxis(e.x, Vector3.RIGHT);
        var y = Matrix3x3.getRotateMatrixByAxis(e.y, Vector3.UP);
        var z = Matrix3x3.getRotateMatrixByAxis(e.z, Vector3.FORWARD);

        switch (order) {
            case "XYZ":
                return z.multiply(y.multiply(x));
            case "XZY":
                return y.multiply(z.multiply(x));
            case "YXZ":
                return z.multiply(x.multiply(y));
            case "YZX":
                return x.multiply(z.multiply(y));
            case "ZXY":
                return y.multiply(x.multiply(z));
            case "ZYX":
                return x.multiply(y.multiply(z));
            default:
                console.error("Rotation order error, must be similar to 'XYZ'");
                return z.multiply(y.multiply(x));
        }
    }

    // 通过轴和角度获取旋转矩阵
    public static getRotateMatrixByAxis(angle: number, axis: Vector3): Matrix3x3 {
        var out = new Matrix3x3();
        var m = out.matrix;
        var x = axis.x, y = axis.y, z = axis.z;
        var len = Math.sqrt(x * x + y * y + z * z);
        var s = 0, c = 0, t = 0;

        angle = Math.PI * angle / 180;
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        s = Math.sin(angle);
        c = Math.cos(angle);
        t = 1 - c;
        m[0][0] = x * x * t + c;
        m[1][0] = y * x * t + z * s;
        m[2][0] = z * x * t - y * s;
        m[0][1] = x * y * t - z * s;
        m[1][1] = y * y * t + c;
        m[2][1] = z * y * t + x * s;
        m[0][2] = x * z * t + y * s;
        m[1][2] = y * z * t - x * s;
        m[2][2] = z * z * t + c;
        return out;
    }

    // 获取缩放矩阵
    public static getScaleMatrix(s: Vector3): Matrix3x3 {
        let result = new Matrix3x3();
        let m = result.matrix;

        m[0][0] = s.x; m[0][1] = 0; m[0][2] = 0;
        m[1][0] = 0; m[1][1] = s.y; m[1][2] = 0;
        m[2][0] = 0; m[2][1] = 0; m[2][2] = s.z;

        return result;
    }

    // 从4x4矩阵提取3x3旋转矩阵
    public static extractRotationMatrix(matrix4x4: Matrix4x4): Matrix3x3 {
        let result = new Matrix3x3();
        let m4 = matrix4x4.matrix;
        let m3 = result.matrix;

        m3[0][0] = m4[0][0]; m3[0][1] = m4[0][1]; m3[0][2] = m4[0][2];
        m3[1][0] = m4[1][0]; m3[1][1] = m4[1][1]; m3[1][2] = m4[1][2];
        m3[2][0] = m4[2][0]; m3[2][1] = m4[2][1]; m3[2][2] = m4[2][2];

        return result;
    }
}