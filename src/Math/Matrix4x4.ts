import { Vector4 } from "./Vector4";
import { Vector3 } from "./Vector3";
import { Quaternion } from "./Quaternion";

export class Matrix4x4 {

    public matrix: Array<Array<number>> = new Array<Array<number>>();

    public constructor();
    public constructor(column0: Vector4, column1: Vector4, column2: Vector4, column3: Vector4);
    public constructor() {
        if (arguments.length == 4) {
            for (let i = 0; i < 4; i++) {
                let v = arguments[i] as Vector4;
                this.matrix[i] = new Array<number>(v.x, v.y, v.z, v.w);
            }
        }
        else {
            for (let i = 0; i < 4; i++) {
                this.matrix[i] = new Array<number>(0, 0, 0, 0);
            }
        }
    }

    /**
     * 
     * @param index 行
     */
    public getRow(index: number): Vector4 {
        var c = this.matrix[index];
        return new Vector4(c[0], c[1], c[2], c[3]);
    }

    /**
     * 
     * @param index 列
     */
    public getColumn(index: number): Vector4 {
        return new Vector4(this.matrix[0][index], this.matrix[1][index], this.matrix[2][index], this.matrix[3][index]);
    }

    public SetRow(index: number, row: Vector4) {
        this.matrix[index][0] = row.x;
        this.matrix[index][1] = row.y;
        this.matrix[index][2] = row.z;
        this.matrix[index][3] = row.w;
    }

    public SetColumn(index: number, column: Vector4) {
        this.matrix[0][index] = column.x;
        this.matrix[1][index] = column.y;
        this.matrix[2][index] = column.z;
        this.matrix[3][index] = column.w;
    }

    public multiply(m: Matrix4x4): Matrix4x4 {
        let lhs = this.matrix;
        let rhs = m.matrix;
        let matrix = new Matrix4x4().matrix;

        matrix[0][0] = lhs[0][0] * rhs[0][0] + lhs[0][1] * rhs[1][0] + lhs[0][2] * rhs[2][0] + lhs[0][3] * rhs[3][0];
        matrix[0][1] = lhs[0][0] * rhs[0][1] + lhs[0][1] * rhs[1][1] + lhs[0][2] * rhs[2][1] + lhs[0][3] * rhs[3][1];
        matrix[0][2] = lhs[0][0] * rhs[0][2] + lhs[0][1] * rhs[1][2] + lhs[0][2] * rhs[2][2] + lhs[0][3] * rhs[3][2];
        matrix[0][3] = lhs[0][0] * rhs[0][3] + lhs[0][1] * rhs[1][3] + lhs[0][2] * rhs[2][3] + lhs[0][3] * rhs[3][3];
        matrix[1][0] = lhs[1][0] * rhs[0][0] + lhs[1][1] * rhs[1][0] + lhs[1][2] * rhs[2][0] + lhs[1][3] * rhs[3][0];
        matrix[1][1] = lhs[1][0] * rhs[0][1] + lhs[1][1] * rhs[1][1] + lhs[1][2] * rhs[2][1] + lhs[1][3] * rhs[3][1];
        matrix[1][2] = lhs[1][0] * rhs[0][2] + lhs[1][1] * rhs[1][2] + lhs[1][2] * rhs[2][2] + lhs[1][3] * rhs[3][2];
        matrix[1][3] = lhs[1][0] * rhs[0][3] + lhs[1][1] * rhs[1][3] + lhs[1][2] * rhs[2][3] + lhs[1][3] * rhs[3][3];
        matrix[2][0] = lhs[2][0] * rhs[0][0] + lhs[2][1] * rhs[1][0] + lhs[2][2] * rhs[2][0] + lhs[2][3] * rhs[3][0];
        matrix[2][1] = lhs[2][0] * rhs[0][1] + lhs[2][1] * rhs[1][1] + lhs[2][2] * rhs[2][1] + lhs[2][3] * rhs[3][1];
        matrix[2][2] = lhs[2][0] * rhs[0][2] + lhs[2][1] * rhs[1][2] + lhs[2][2] * rhs[2][2] + lhs[2][3] * rhs[3][2];
        matrix[2][3] = lhs[2][0] * rhs[0][3] + lhs[2][1] * rhs[1][3] + lhs[2][2] * rhs[2][3] + lhs[2][3] * rhs[3][3];
        matrix[3][0] = lhs[3][0] * rhs[0][0] + lhs[3][1] * rhs[1][0] + lhs[3][2] * rhs[2][0] + lhs[3][3] * rhs[3][0];
        matrix[3][1] = lhs[3][0] * rhs[0][1] + lhs[3][1] * rhs[1][1] + lhs[3][2] * rhs[2][1] + lhs[3][3] * rhs[3][1];
        matrix[3][2] = lhs[3][0] * rhs[0][2] + lhs[3][1] * rhs[1][2] + lhs[3][2] * rhs[2][2] + lhs[3][3] * rhs[3][2];
        matrix[3][3] = lhs[3][0] * rhs[0][3] + lhs[3][1] * rhs[1][3] + lhs[3][2] * rhs[2][3] + lhs[3][3] * rhs[3][3];

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

        res.x = m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3] * v.w;
        res.y = m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3] * v.w;
        res.z = m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3] * v.w;
        res.w = m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3] * v.w;

        return res;
    }

    public getTranslate(): Vector3 {
        let m = this.matrix;
        return new Vector3(m[0][3], m[1][3], m[2][3]);
    }

    // public getRotate(): Vector3 {
    //     let mat = this.matrix;

    //     let x = Math.atan2(mat[1][2], mat[2][2]);
    //     let y = Math.atan2(-mat[0][2], Math.sqrt(mat[1][2] * mat[1][2] + mat[2][2] * mat[2][2]));
    //     let z = Math.atan2(mat[0][1], mat[0][0]);

    //     return new Vector3(x / Math.PI * 180, y / Math.PI * 180, z / Math.PI * 180);
    // }

    public getRotate(): Quaternion {
        //一定要获取纯净的旋转矩阵，即去除缩放倍率
        let mat = this.getRotateMatrix().matrix;
        let q = new Quaternion();

        var trace = mat[0][0] + mat[1][1] + mat[2][2]; // I removed + 1.0f; see discussion with Ethan
        var s = 0;

        if (trace > 0) {// I changed M_EPSILON to 0
            s = 0.5 / Math.sqrt(trace + 1.0);
            q.w = 0.25 / s;
            q.x = (mat[2][1] - mat[1][2]) * s;
            q.y = (mat[0][2] - mat[2][0]) * s;
            q.z = (mat[1][0] - mat[0][1]) * s;
        } else {
            if (mat[0][0] > mat[1][1] && mat[0][0] > mat[2][2]) {
                s = 2.0 * Math.sqrt(1.0 + mat[0][0] - mat[1][1] - mat[2][2]);
                q.w = (mat[2][1] - mat[1][2]) / s;
                q.x = 0.25 * s;
                q.y = (mat[0][1] + mat[1][0]) / s;
                q.z = (mat[0][2] + mat[2][0]) / s;
            } else if (mat[1][1] > mat[2][2]) {
                s = 2.0 * Math.sqrt(1.0 + mat[1][1] - mat[0][0] - mat[2][2]);
                q.w = (mat[0][2] - mat[2][0]) / s;
                q.x = (mat[0][1] + mat[1][0]) / s;
                q.y = 0.25 * s;
                q.z = (mat[1][2] + mat[2][1]) / s;
            } else {
                s = 2.0 * Math.sqrt(1.0 + mat[2][2] - mat[0][0] - mat[1][1]);
                q.w = (mat[1][0] - mat[0][1]) / s;
                q.x = (mat[0][2] + mat[2][0]) / s;
                q.y = (mat[1][2] + mat[2][1]) / s;
                q.z = 0.25 * s;
            }
        }

        return q;
    }

    public getRotateMatrix(): Matrix4x4 {
        //https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
        //因为旋转矩阵比较特殊，有时候要单独处理，所有拥有一个提取方法
        //提取方式很简单，先获取缩放值，然后利用获取缩放值的原理，逆向除去缩放值，就得到纯净的旋转矩阵
        //此方法不支持反射矩阵

        var mat = new Matrix4x4();
        var te = mat.matrix;
        var me = this.matrix;

        var scale = this.getScale();
        var scaleX = 1 / scale.x;
        var scaleY = 1 / scale.y;
        var scaleZ = 1 / scale.z;

        te[0][0] = me[0][0] * scaleX;
        te[1][0] = me[1][0] * scaleX;
        te[2][0] = me[2][0] * scaleX;
        te[3][0] = 0;

        te[0][1] = me[0][1] * scaleY;
        te[1][1] = me[1][1] * scaleY;
        te[2][1] = me[2][1] * scaleY;
        te[3][1] = 0;

        te[0][2] = me[0][2] * scaleZ;
        te[1][2] = me[1][2] * scaleZ;
        te[2][2] = me[2][2] * scaleZ;
        te[3][2] = 0;

        te[0][3] = 0;
        te[1][3] = 0;
        te[2][3] = 0;
        te[3][3] = 1;

        return mat;
    }

    public getEulerAngles(): Vector3 {
        //https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
        //从旋转矩阵里获取欧拉角
        //必须是纯净的旋转矩阵

        var angle = new Vector3();

        var te = this.getRotateMatrix().matrix;
        var m11 = te[0][0], m12 = te[0][1], m13 = te[0][2];
        var m21 = te[1][0], m22 = te[1][1], m23 = te[1][2];
        var m31 = te[2][0], m32 = te[2][1], m33 = te[2][2];

        m13 = m13 > 1 ? 1 : m13;
        m13 = m13 < -1 ? -1 : m13;
        angle.y = Math.asin(m13);

        if (Math.abs(m13) < 0.9999999) {
            angle.x = Math.atan2(-m23, m33);
            angle.z = Math.atan2(-m12, m11);
        } else {
            angle.x = Math.atan2(m32, m22);
            angle.z = 0;
        }

        return new Vector3(angle.x / Math.PI * 180, angle.y / Math.PI * 180, angle.z / Math.PI * 180);
    }

    public getScale(): Vector3 {
        let m = this.matrix;
        let v = new Vector3();

        v.x = Math.sqrt(m[0][0] * m[0][0] + m[1][0] * m[1][0] + m[2][0] * m[2][0]);
        v.y = Math.sqrt(m[0][1] * m[0][1] + m[1][1] * m[1][1] + m[2][1] * m[2][1]);
        v.z = Math.sqrt(m[0][2] * m[0][2] + m[1][2] * m[1][2] + m[2][2] * m[2][2]);

        return v;
    }

    public transpose(): Matrix4x4 {
        let m1 = this.matrix;
        var m2 = new Matrix4x4().matrix;

        m2[0][0] = m1[0][0]; m2[0][1] = m1[1][0]; m2[0][2] = m1[2][0]; m2[0][3] = m1[3][0];
        m2[1][0] = m1[0][1]; m2[1][1] = m1[1][1]; m2[1][2] = m1[2][1]; m2[1][3] = m1[3][1];
        m2[2][0] = m1[0][2]; m2[2][1] = m1[1][2]; m2[2][2] = m1[2][2]; m2[2][3] = m1[3][2];
        m2[3][0] = m1[0][3]; m2[3][1] = m1[1][3]; m2[3][2] = m1[2][3]; m2[3][3] = m1[3][3];

        this.matrix = m2;
        return this;
    }

    public translate(pos: Vector3): Matrix4x4 {
        let m = Matrix4x4.getTranslateMatrix(pos);
        this.matrix = m.multiply(this).matrix;
        return this;
    }

    public rotate(q: Quaternion): Matrix4x4;
    public rotate(eulerAngles: Vector3);
    public rotate(angle: number, axis: Vector3): Matrix4x4;
    public rotate() {
        let m = new Matrix4x4();

        if (arguments[0] instanceof Quaternion) {
            m = Matrix4x4.getRotateMatrixByQuaternion(arguments[0]);
        }
        else if (arguments[0] instanceof Vector3) {
            m = Matrix4x4.getRotateMatrixByEulerAngles(arguments[0]);
        }
        else {
            m = Matrix4x4.getRotateMatrixByAxis(arguments[0], arguments[1]);
        }

        this.matrix = m.multiply(this).matrix;
        return this;
    }

    public scale(s: Vector3): Matrix4x4 {
        let m = Matrix4x4.getScaleMatrix(s);
        this.matrix = m.multiply(this).matrix;
        return this;
    }

    public lookAt(target: Vector3): Matrix4x4 {
        // todo
        return this;
    }

    //转换到摄影机看向的矩阵里
    public transformToLookAtSpace(eye: Vector3, targetPoint: Vector3, up: Vector3 = Vector3.UP): Matrix4x4 {
        //从哪里看向哪里，也可以理解为摄影机视角，即观察空间
        //若要变换到摄影机空间，可以假设整个观察空间以摄影机位于世界坐标原点，然后将所有物体朝摄影机原先在世界空间中的位置反向移动即可
        //在纸上画下图就清晰了

        //由于默认矩阵是SRT顺序组成的变换空间，要逆向，则是TRS的顺序，即先移动后旋转
        //1.向反方向平移
        this.translate(new Vector3(-eye.x, -eye.y, -eye.z));

        //2.向反方向旋转
        //先获取摄影世界部坐标轴
        var zAxis = Vector3.difference(eye, targetPoint).normalize();
        //因为我们是右手系统，要求X，则必须z乘y
        var xAxis = Vector3.cross(up, zAxis).normalize();
        var yAxis = Vector3.cross(zAxis, xAxis).normalize();
        //构建摄影机反方向旋转矩阵
        var mat = new Matrix4x4(
            new Vector4(xAxis),
            new Vector4(yAxis),
            new Vector4(zAxis),
            new Vector4(0, 0, 0, 1));

        this.matrix = mat.multiply(this).matrix;
        return this;
    }

    public frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4x4 {
        const rl = (right - left)
        const tb = (top - bottom)
        const fn = (far - near)

        var mat = new Matrix4x4(
            new Vector4((near * 2) / rl, 0, (right + left) / rl, 0),
            new Vector4(0, (near * 2) / tb, (top + bottom) / tb, 0),
            new Vector4(0, 0, -(far + near) / fn, -(far * near * 2) / fn),
            new Vector4(0, 0, -1, 0)
        );

        this.matrix = mat.multiply(this).matrix;
        return this;
    }

    public orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4x4 {
        const rl = (right - left)
        const tb = (top - bottom)
        const fn = (far - near)

        var mat = new Matrix4x4(
            new Vector4(2 / rl, 0, 0, -(left + right) / rl),
            new Vector4(0, 2 / tb, 0, -(top + bottom) / tb),
            new Vector4(0, 0, -2 / fn, -(far + near) / fn),
            new Vector4(0, 0, 0, 1)
        );

        this.matrix = mat.multiply(this).matrix;
        return this;
    }

    public perspective(fov: number, aspect: number, near: number, far: number): Matrix4x4 {
        const hfov = fov / 180 * Math.PI / 2;
        const tan = Math.tan(hfov);

        var mat = new Matrix4x4(
            new Vector4(1 / (aspect * tan), 0, 0, 0),
            new Vector4(0, 1 / tan, 0, 0),
            new Vector4(0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near)),
            new Vector4(0, 0, -1, 0)
        );

        this.matrix = mat.multiply(this).matrix;
        return this;
    }

    public inverse(): Matrix4x4 {
        var mat = this.matrix;

        const a00 = mat[0][0];
        const a01 = mat[0][1];
        const a02 = mat[0][2];
        const a03 = mat[0][3];
        const a10 = mat[1][0];
        const a11 = mat[1][1];
        const a12 = mat[1][2];
        const a13 = mat[1][3];
        const a20 = mat[2][0];
        const a21 = mat[2][1];
        const a22 = mat[2][2];
        const a23 = mat[2][3];
        const a30 = mat[3][0];
        const a31 = mat[3][1];
        const a32 = mat[3][2];
        const a33 = mat[3][3];

        const det00 = a00 * a11 - a01 * a10
        const det01 = a00 * a12 - a02 * a10
        const det02 = a00 * a13 - a03 * a10
        const det03 = a01 * a12 - a02 * a11
        const det04 = a01 * a13 - a03 * a11
        const det05 = a02 * a13 - a03 * a12
        const det06 = a20 * a31 - a21 * a30
        const det07 = a20 * a32 - a22 * a30
        const det08 = a20 * a33 - a23 * a30
        const det09 = a21 * a32 - a22 * a31
        const det10 = a21 * a33 - a23 * a31
        const det11 = a22 * a33 - a23 * a32

        let det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);

        if (!det) {
            console.error("Matrix4x4 inverse failed, determinant is 0");
            // return null;
        }

        det = 1.0 / det;

        mat[0][0] = (a11 * det11 - a12 * det10 + a13 * det09) * det
        mat[0][1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det
        mat[0][2] = (a31 * det05 - a32 * det04 + a33 * det03) * det
        mat[0][3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det
        mat[1][0] = (-a10 * det11 + a12 * det08 - a13 * det07) * det
        mat[1][1] = (a00 * det11 - a02 * det08 + a03 * det07) * det
        mat[1][2] = (-a30 * det05 + a32 * det02 - a33 * det01) * det
        mat[1][3] = (a20 * det05 - a22 * det02 + a23 * det01) * det
        mat[2][0] = (a10 * det10 - a11 * det08 + a13 * det06) * det
        mat[2][1] = (-a00 * det10 + a01 * det08 - a03 * det06) * det
        mat[2][2] = (a30 * det04 - a31 * det02 + a33 * det00) * det
        mat[2][3] = (-a20 * det04 + a21 * det02 - a23 * det00) * det
        mat[3][0] = (-a10 * det09 + a11 * det07 - a12 * det06) * det
        mat[3][1] = (a00 * det09 - a01 * det07 + a02 * det06) * det
        mat[3][2] = (-a30 * det03 + a31 * det01 - a32 * det00) * det
        mat[3][3] = (a20 * det03 - a21 * det01 + a22 * det00) * det

        return this;
    }

    public toFloat32List(): Float32List {
        let m = this.matrix;
        //由于OpenGL是列序存储，所以需要转置一下矩阵
        return new Float32Array([
            m[0][0], m[1][0], m[2][0], m[3][0],
            m[0][1], m[1][1], m[2][1], m[3][1],
            m[0][2], m[1][2], m[2][2], m[3][2],
            m[0][3], m[1][3], m[2][3], m[3][3]
        ]);
    }

    public copy(): Matrix4x4 {
        return new Matrix4x4(
            this.getRow(0),
            this.getRow(1),
            this.getRow(2),
            this.getRow(3),
        );
    }

    /*
     STATIC FUNCTIONS
     */

    public static getTRSMatrix(pos: Vector3, quat: Quaternion, scale: Vector3): Matrix4x4 {
        let tm = Matrix4x4.getTranslateMatrix(pos);
        let rm = Matrix4x4.getRotateMatrixByQuaternion(quat);
        let sm = Matrix4x4.getScaleMatrix(scale);

        //必须严格按照先Scale，再Rotate，再Translate的顺序，否则得到的结果肯定是不满意的
        //例如有一个1X1正方形在原点，我们想要得到一个1X2，并且斜向45°，而且离坐标原点1个单位处
        //如果先旋转，再缩放的话，旋转方向是对了，但是我们是将旋转后45°的正方形的Y轴拉伸2倍，得到的是一个被拉长的菱形
        //如果先平移，再旋转的话，因为我们旋转都是绕着坐标原点的，结果自然是正方形不是自身旋转45°，而是绕着原点旋转
        return tm.multiply(rm.multiply(sm));
    }

    public static getTranslateMatrix(pos: Vector3): Matrix4x4 {
        let result = new Matrix4x4();
        let m = result.matrix;

        m[0][0] = 1; m[0][1] = 0; m[0][2] = 0; m[0][3] = pos.x;
        m[1][0] = 0; m[1][1] = 1; m[1][2] = 0; m[1][3] = pos.y;
        m[2][0] = 0; m[2][1] = 0; m[2][2] = 1; m[2][3] = pos.z;
        m[3][0] = 0; m[3][1] = 0; m[3][2] = 0; m[3][3] = 1;

        return result;
    }

    public static getRotateMatrixByQuaternion(q: Quaternion): Matrix4x4 {
        let result = new Matrix4x4();
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
        m[3][0] = 0;
        m[0][1] = num7 - num12;
        m[1][1] = 1 - (num4 + num6);
        m[2][1] = num9 + num10;
        m[3][1] = 0;
        m[0][2] = num8 + num11;
        m[1][2] = num9 - num10;
        m[2][2] = 1 - (num4 + num5);
        m[3][2] = 0;
        m[0][3] = 0;
        m[1][3] = 0;
        m[2][3] = 0;
        m[3][3] = 1;

        return result;
    }

    public static getRotateMatrixByEulerAngles(e: Vector3, order: string = "XYZ"): Matrix4x4 {
        //通过欧拉角获取旋转矩阵
        //先分别获取XYZ轴上的旋转矩阵，然后合并起来
        //注意：旋转轴的顺序先后不同，会出现不同的结果，因此必须要指定旋转顺序
        //http://planning.cs.uiuc.edu/node102.html
        //https://threejs.org/docs/#api/en/math/Euler.order
        var x = Matrix4x4.getRotateMatrixByAxis(e.x, Vector3.RIGHT);
        var y = Matrix4x4.getRotateMatrixByAxis(e.y, Vector3.UP);
        var z = Matrix4x4.getRotateMatrixByAxis(e.z, Vector3.FORWARD);

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

    public static getRotateMatrixByAxis(angle: number, axis: Vector3): Matrix4x4 {
        var out = new Matrix4x4();
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
        m[3][0] = 0;
        m[0][1] = x * y * t - z * s;
        m[1][1] = y * y * t + c;
        m[2][1] = z * y * t + x * s;
        m[3][1] = 0;
        m[0][2] = x * z * t + y * s;
        m[1][2] = y * z * t - x * s;
        m[2][2] = z * z * t + c;
        m[3][2] = 0;
        m[0][3] = 0;
        m[1][3] = 0;
        m[2][3] = 0;
        m[3][3] = 1;
        return out;
    }

    public static getScaleMatrix(s: Vector3): Matrix4x4 {
        let result = new Matrix4x4();
        let m = result.matrix;

        m[0][0] = s.x; m[0][1] = 0; m[0][2] = 0; m[0][3] = 0;
        m[1][0] = 0; m[1][1] = s.y; m[1][2] = 0; m[1][3] = 0;
        m[2][0] = 0; m[2][1] = 0; m[2][2] = s.z; m[2][3] = 0;
        m[3][0] = 0; m[3][1] = 0; m[3][2] = 0; m[3][3] = 1;

        return result;
    }

    public static get identity(): Matrix4x4 {
        let m = new Matrix4x4();
        m.matrix[0][0] = 1;
        m.matrix[1][1] = 1;
        m.matrix[2][2] = 1;
        m.matrix[3][3] = 1;
        return m;
    }
}