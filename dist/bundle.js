(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Color = void 0;
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        if (a === void 0) { a = 255; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Color.prototype.ToUint32 = function () {
        return (this.a << 24) | (this.b << 16) | (this.g << 8) | this.r;
    };
    Color.FromUint32 = function (uint32) {
        return new Color(uint32 & 0xFF, (uint32 >> 8) & 0xFF, (uint32 >> 16) & 0xFF, (uint32 >> 24) & 0xFF);
    };
    Color.WHITE = new Color(255, 255, 255).ToUint32();
    Color.BLACK = new Color(0, 0, 0).ToUint32();
    Color.GRAY = new Color(128, 128, 128).ToUint32();
    Color.RED = new Color(255, 0, 0).ToUint32();
    Color.GREEN = new Color(0, 255, 0).ToUint32();
    Color.BLUE = new Color(0, 0, 255).ToUint32();
    Color.YELLOW = new Color(255, 255, 0).ToUint32();
    Color.CYAN = new Color(0, 255, 255).ToUint32();
    Color.MAGENTA = new Color(255, 0, 255).ToUint32();
    Color.ORANGE = new Color(255, 165, 0).ToUint32();
    Color.PURPLE = new Color(128, 0, 128).ToUint32();
    return Color;
}());
exports.Color = Color;
},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Input = void 0;
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.mouseX = 0;
    Input.mouseY = 0;
    return Input;
}());
exports.Input = Input;
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Matrix4x4 = void 0;
var Vector4_1 = require("./Vector4");
var Vector3_1 = require("./Vector3");
var Quaternion_1 = require("./Quaternion");
var Matrix4x4 = /** @class */ (function () {
    function Matrix4x4() {
        this.matrix = new Array();
        if (arguments.length == 4) {
            for (var i = 0; i < 4; i++) {
                var v = arguments[i];
                this.matrix[i] = new Array(v.x, v.y, v.z, v.w);
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.matrix[i] = new Array(0, 0, 0, 0);
            }
        }
    }
    /**
     *
     * @param index 行
     */
    Matrix4x4.prototype.getRow = function (index) {
        var c = this.matrix[index];
        return new Vector4_1.Vector4(c[0], c[1], c[2], c[3]);
    };
    /**
     *
     * @param index 列
     */
    Matrix4x4.prototype.getColumn = function (index) {
        return new Vector4_1.Vector4(this.matrix[0][index], this.matrix[1][index], this.matrix[2][index], this.matrix[3][index]);
    };
    Matrix4x4.prototype.SetRow = function (index, row) {
        this.matrix[index][0] = row.x;
        this.matrix[index][1] = row.y;
        this.matrix[index][2] = row.z;
        this.matrix[index][3] = row.w;
    };
    Matrix4x4.prototype.SetColumn = function (index, column) {
        this.matrix[0][index] = column.x;
        this.matrix[1][index] = column.y;
        this.matrix[2][index] = column.z;
        this.matrix[3][index] = column.w;
    };
    Matrix4x4.prototype.multiply = function (m) {
        var lhs = this.matrix;
        var rhs = m.matrix;
        var matrix = new Matrix4x4().matrix;
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
    };
    Matrix4x4.prototype.multiplyVector3 = function (v) {
        var res = new Vector3_1.Vector3();
        var m = this.matrix;
        res.x = m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z;
        res.y = m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z;
        res.z = m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z;
        return res;
    };
    Matrix4x4.prototype.multiplyVector4 = function (v) {
        var res = new Vector4_1.Vector4();
        var m = this.matrix;
        res.x = m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3] * v.w;
        res.y = m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3] * v.w;
        res.z = m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3] * v.w;
        res.w = m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3] * v.w;
        return res;
    };
    Matrix4x4.prototype.getTranslate = function () {
        var m = this.matrix;
        return new Vector3_1.Vector3(m[0][3], m[1][3], m[2][3]);
    };
    // public getRotate(): Vector3 {
    //     let mat = this.matrix;
    //     let x = Math.atan2(mat[1][2], mat[2][2]);
    //     let y = Math.atan2(-mat[0][2], Math.sqrt(mat[1][2] * mat[1][2] + mat[2][2] * mat[2][2]));
    //     let z = Math.atan2(mat[0][1], mat[0][0]);
    //     return new Vector3(x / Math.PI * 180, y / Math.PI * 180, z / Math.PI * 180);
    // }
    Matrix4x4.prototype.getRotate = function () {
        //一定要获取纯净的旋转矩阵，即去除缩放倍率
        var mat = this.getRotateMatrix().matrix;
        var q = new Quaternion_1.Quaternion();
        var trace = mat[0][0] + mat[1][1] + mat[2][2]; // I removed + 1.0f; see discussion with Ethan
        var s = 0;
        if (trace > 0) { // I changed M_EPSILON to 0
            s = 0.5 / Math.sqrt(trace + 1.0);
            q.w = 0.25 / s;
            q.x = (mat[2][1] - mat[1][2]) * s;
            q.y = (mat[0][2] - mat[2][0]) * s;
            q.z = (mat[1][0] - mat[0][1]) * s;
        }
        else {
            if (mat[0][0] > mat[1][1] && mat[0][0] > mat[2][2]) {
                s = 2.0 * Math.sqrt(1.0 + mat[0][0] - mat[1][1] - mat[2][2]);
                q.w = (mat[2][1] - mat[1][2]) / s;
                q.x = 0.25 * s;
                q.y = (mat[0][1] + mat[1][0]) / s;
                q.z = (mat[0][2] + mat[2][0]) / s;
            }
            else if (mat[1][1] > mat[2][2]) {
                s = 2.0 * Math.sqrt(1.0 + mat[1][1] - mat[0][0] - mat[2][2]);
                q.w = (mat[0][2] - mat[2][0]) / s;
                q.x = (mat[0][1] + mat[1][0]) / s;
                q.y = 0.25 * s;
                q.z = (mat[1][2] + mat[2][1]) / s;
            }
            else {
                s = 2.0 * Math.sqrt(1.0 + mat[2][2] - mat[0][0] - mat[1][1]);
                q.w = (mat[1][0] - mat[0][1]) / s;
                q.x = (mat[0][2] + mat[2][0]) / s;
                q.y = (mat[1][2] + mat[2][1]) / s;
                q.z = 0.25 * s;
            }
        }
        return q;
    };
    Matrix4x4.prototype.getRotateMatrix = function () {
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
    };
    Matrix4x4.prototype.getEulerAngles = function () {
        //https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
        //从旋转矩阵里获取欧拉角
        //必须是纯净的旋转矩阵
        var angle = new Vector3_1.Vector3();
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
        }
        else {
            angle.x = Math.atan2(m32, m22);
            angle.z = 0;
        }
        return new Vector3_1.Vector3(angle.x / Math.PI * 180, angle.y / Math.PI * 180, angle.z / Math.PI * 180);
    };
    Matrix4x4.prototype.getScale = function () {
        var m = this.matrix;
        var v = new Vector3_1.Vector3();
        v.x = Math.sqrt(m[0][0] * m[0][0] + m[1][0] * m[1][0] + m[2][0] * m[2][0]);
        v.y = Math.sqrt(m[0][1] * m[0][1] + m[1][1] * m[1][1] + m[2][1] * m[2][1]);
        v.z = Math.sqrt(m[0][2] * m[0][2] + m[1][2] * m[1][2] + m[2][2] * m[2][2]);
        return v;
    };
    Matrix4x4.prototype.transpose = function () {
        var m1 = this.matrix;
        var m2 = new Matrix4x4().matrix;
        m2[0][0] = m1[0][0];
        m2[0][1] = m1[1][0];
        m2[0][2] = m1[2][0];
        m2[0][3] = m1[3][0];
        m2[1][0] = m1[0][1];
        m2[1][1] = m1[1][1];
        m2[1][2] = m1[2][1];
        m2[1][3] = m1[3][1];
        m2[2][0] = m1[0][2];
        m2[2][1] = m1[1][2];
        m2[2][2] = m1[2][2];
        m2[2][3] = m1[3][2];
        m2[3][0] = m1[0][3];
        m2[3][1] = m1[1][3];
        m2[3][2] = m1[2][3];
        m2[3][3] = m1[3][3];
        this.matrix = m2;
        return this;
    };
    Matrix4x4.prototype.translate = function (pos) {
        var m = Matrix4x4.getTranslateMatrix(pos);
        this.matrix = m.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.rotate = function () {
        var m = new Matrix4x4();
        if (arguments[0] instanceof Quaternion_1.Quaternion) {
            m = Matrix4x4.getRotateMatrixByQuaternion(arguments[0]);
        }
        else if (arguments[0] instanceof Vector3_1.Vector3) {
            m = Matrix4x4.getRotateMatrixByEulerAngles(arguments[0]);
        }
        else {
            m = Matrix4x4.getRotateMatrixByAxis(arguments[0], arguments[1]);
        }
        this.matrix = m.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.scale = function (s) {
        var m = Matrix4x4.getScaleMatrix(s);
        this.matrix = m.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.lookAt = function (target) {
        // todo
        return this;
    };
    //转换到摄影机看向的矩阵里
    Matrix4x4.prototype.transformToLookAtSpace = function (eye, targetPoint, up) {
        //从哪里看向哪里，也可以理解为摄影机视角，即观察空间
        //若要变换到摄影机空间，可以假设整个观察空间以摄影机位于世界坐标原点，然后将所有物体朝摄影机原先在世界空间中的位置反向移动即可
        //在纸上画下图就清晰了
        if (up === void 0) { up = Vector3_1.Vector3.UP; }
        //由于默认矩阵是SRT顺序组成的变换空间，要逆向，则是TRS的顺序，即先移动后旋转
        //1.向反方向平移
        this.translate(new Vector3_1.Vector3(-eye.x, -eye.y, -eye.z));
        //2.向反方向旋转
        //先获取摄影世界部坐标轴
        var zAxis = Vector3_1.Vector3.difference(eye, targetPoint).normalize();
        //因为我们是右手系统，要求X，则必须z乘y
        var xAxis = Vector3_1.Vector3.cross(up, zAxis).normalize();
        var yAxis = Vector3_1.Vector3.cross(zAxis, xAxis).normalize();
        //构建摄影机反方向旋转矩阵
        var mat = new Matrix4x4(new Vector4_1.Vector4(xAxis), new Vector4_1.Vector4(yAxis), new Vector4_1.Vector4(zAxis), new Vector4_1.Vector4(0, 0, 0, 1));
        this.matrix = mat.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.frustum = function (left, right, bottom, top, near, far) {
        var rl = (right - left);
        var tb = (top - bottom);
        var fn = (far - near);
        var mat = new Matrix4x4(new Vector4_1.Vector4((near * 2) / rl, 0, (right + left) / rl, 0), new Vector4_1.Vector4(0, (near * 2) / tb, (top + bottom) / tb, 0), new Vector4_1.Vector4(0, 0, -(far + near) / fn, -(far * near * 2) / fn), new Vector4_1.Vector4(0, 0, -1, 0));
        this.matrix = mat.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.orthographic = function (left, right, bottom, top, near, far) {
        var rl = (right - left);
        var tb = (top - bottom);
        var fn = (far - near);
        var mat = new Matrix4x4(new Vector4_1.Vector4(2 / rl, 0, 0, -(left + right) / rl), new Vector4_1.Vector4(0, 2 / tb, 0, -(top + bottom) / tb), new Vector4_1.Vector4(0, 0, -2 / fn, -(far + near) / fn), new Vector4_1.Vector4(0, 0, 0, 1));
        this.matrix = mat.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.perspective = function (fov, aspect, near, far) {
        var hfov = fov / 180 * Math.PI / 2;
        var tan = Math.tan(hfov);
        var mat = new Matrix4x4(new Vector4_1.Vector4(1 / (aspect * tan), 0, 0, 0), new Vector4_1.Vector4(0, 1 / tan, 0, 0), new Vector4_1.Vector4(0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near)), new Vector4_1.Vector4(0, 0, -1, 0));
        this.matrix = mat.multiply(this).matrix;
        return this;
    };
    Matrix4x4.prototype.inverse = function () {
        var mat = this.matrix;
        var a00 = mat[0][0];
        var a01 = mat[0][1];
        var a02 = mat[0][2];
        var a03 = mat[0][3];
        var a10 = mat[1][0];
        var a11 = mat[1][1];
        var a12 = mat[1][2];
        var a13 = mat[1][3];
        var a20 = mat[2][0];
        var a21 = mat[2][1];
        var a22 = mat[2][2];
        var a23 = mat[2][3];
        var a30 = mat[3][0];
        var a31 = mat[3][1];
        var a32 = mat[3][2];
        var a33 = mat[3][3];
        var det00 = a00 * a11 - a01 * a10;
        var det01 = a00 * a12 - a02 * a10;
        var det02 = a00 * a13 - a03 * a10;
        var det03 = a01 * a12 - a02 * a11;
        var det04 = a01 * a13 - a03 * a11;
        var det05 = a02 * a13 - a03 * a12;
        var det06 = a20 * a31 - a21 * a30;
        var det07 = a20 * a32 - a22 * a30;
        var det08 = a20 * a33 - a23 * a30;
        var det09 = a21 * a32 - a22 * a31;
        var det10 = a21 * a33 - a23 * a31;
        var det11 = a22 * a33 - a23 * a32;
        var det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);
        if (!det) {
            console.error("Matrix4x4 inverse failed, determinant is 0");
            // return null;
        }
        det = 1.0 / det;
        mat[0][0] = (a11 * det11 - a12 * det10 + a13 * det09) * det;
        mat[0][1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det;
        mat[0][2] = (a31 * det05 - a32 * det04 + a33 * det03) * det;
        mat[0][3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det;
        mat[1][0] = (-a10 * det11 + a12 * det08 - a13 * det07) * det;
        mat[1][1] = (a00 * det11 - a02 * det08 + a03 * det07) * det;
        mat[1][2] = (-a30 * det05 + a32 * det02 - a33 * det01) * det;
        mat[1][3] = (a20 * det05 - a22 * det02 + a23 * det01) * det;
        mat[2][0] = (a10 * det10 - a11 * det08 + a13 * det06) * det;
        mat[2][1] = (-a00 * det10 + a01 * det08 - a03 * det06) * det;
        mat[2][2] = (a30 * det04 - a31 * det02 + a33 * det00) * det;
        mat[2][3] = (-a20 * det04 + a21 * det02 - a23 * det00) * det;
        mat[3][0] = (-a10 * det09 + a11 * det07 - a12 * det06) * det;
        mat[3][1] = (a00 * det09 - a01 * det07 + a02 * det06) * det;
        mat[3][2] = (-a30 * det03 + a31 * det01 - a32 * det00) * det;
        mat[3][3] = (a20 * det03 - a21 * det01 + a22 * det00) * det;
        return this;
    };
    Matrix4x4.prototype.toFloat32List = function () {
        var m = this.matrix;
        //由于OpenGL是列序存储，所以需要转置一下矩阵
        return new Float32Array([
            m[0][0], m[1][0], m[2][0], m[3][0],
            m[0][1], m[1][1], m[2][1], m[3][1],
            m[0][2], m[1][2], m[2][2], m[3][2],
            m[0][3], m[1][3], m[2][3], m[3][3]
        ]);
    };
    Matrix4x4.prototype.copy = function () {
        return new Matrix4x4(this.getRow(0), this.getRow(1), this.getRow(2), this.getRow(3));
    };
    /*
     STATIC FUNCTIONS
     */
    Matrix4x4.getTRSMatrix = function (pos, quat, scale) {
        var tm = Matrix4x4.getTranslateMatrix(pos);
        var rm = Matrix4x4.getRotateMatrixByQuaternion(quat);
        var sm = Matrix4x4.getScaleMatrix(scale);
        //必须严格按照先Scale，再Rotate，再Translate的顺序，否则得到的结果肯定是不满意的
        //例如有一个1X1正方形在原点，我们想要得到一个1X2，并且斜向45°，而且离坐标原点1个单位处
        //如果先旋转，再缩放的话，旋转方向是对了，但是我们是将旋转后45°的正方形的Y轴拉伸2倍，得到的是一个被拉长的菱形
        //如果先平移，再旋转的话，因为我们旋转都是绕着坐标原点的，结果自然是正方形不是自身旋转45°，而是绕着原点旋转
        return tm.multiply(rm.multiply(sm));
    };
    Matrix4x4.getTranslateMatrix = function (pos) {
        var result = new Matrix4x4();
        var m = result.matrix;
        m[0][0] = 1;
        m[0][1] = 0;
        m[0][2] = 0;
        m[0][3] = pos.x;
        m[1][0] = 0;
        m[1][1] = 1;
        m[1][2] = 0;
        m[1][3] = pos.y;
        m[2][0] = 0;
        m[2][1] = 0;
        m[2][2] = 1;
        m[2][3] = pos.z;
        m[3][0] = 0;
        m[3][1] = 0;
        m[3][2] = 0;
        m[3][3] = 1;
        return result;
    };
    Matrix4x4.getRotateMatrixByQuaternion = function (q) {
        var result = new Matrix4x4();
        var m = result.matrix;
        var num = q.x * 2;
        var num2 = q.y * 2;
        var num3 = q.z * 2;
        var num4 = q.x * num;
        var num5 = q.y * num2;
        var num6 = q.z * num3;
        var num7 = q.x * num2;
        var num8 = q.x * num3;
        var num9 = q.y * num3;
        var num10 = q.w * num;
        var num11 = q.w * num2;
        var num12 = q.w * num3;
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
    };
    Matrix4x4.getRotateMatrixByEulerAngles = function (e, order) {
        if (order === void 0) { order = "XYZ"; }
        //通过欧拉角获取旋转矩阵
        //先分别获取XYZ轴上的旋转矩阵，然后合并起来
        //注意：旋转轴的顺序先后不同，会出现不同的结果，因此必须要指定旋转顺序
        //http://planning.cs.uiuc.edu/node102.html
        //https://threejs.org/docs/#api/en/math/Euler.order
        var x = Matrix4x4.getRotateMatrixByAxis(e.x, Vector3_1.Vector3.RIGHT);
        var y = Matrix4x4.getRotateMatrixByAxis(e.y, Vector3_1.Vector3.UP);
        var z = Matrix4x4.getRotateMatrixByAxis(e.z, Vector3_1.Vector3.FORWARD);
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
    };
    Matrix4x4.getRotateMatrixByAxis = function (angle, axis) {
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
    };
    Matrix4x4.getScaleMatrix = function (s) {
        var result = new Matrix4x4();
        var m = result.matrix;
        m[0][0] = s.x;
        m[0][1] = 0;
        m[0][2] = 0;
        m[0][3] = 0;
        m[1][0] = 0;
        m[1][1] = s.y;
        m[1][2] = 0;
        m[1][3] = 0;
        m[2][0] = 0;
        m[2][1] = 0;
        m[2][2] = s.z;
        m[2][3] = 0;
        m[3][0] = 0;
        m[3][1] = 0;
        m[3][2] = 0;
        m[3][3] = 1;
        return result;
    };
    Object.defineProperty(Matrix4x4, "identity", {
        get: function () {
            var m = new Matrix4x4();
            m.matrix[0][0] = 1;
            m.matrix[1][1] = 1;
            m.matrix[2][2] = 1;
            m.matrix[3][3] = 1;
            return m;
        },
        enumerable: false,
        configurable: true
    });
    return Matrix4x4;
}());
exports.Matrix4x4 = Matrix4x4;
},{"./Quaternion":4,"./Vector3":6,"./Vector4":7}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Quaternion = void 0;
var Vector3_1 = require("./Vector3");
var Matrix4x4_1 = require("./Matrix4x4");
var Quaternion = /** @class */ (function () {
    function Quaternion() {
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
    Object.defineProperty(Quaternion.prototype, "eulerAngles", {
        get: function () {
            return Matrix4x4_1.Matrix4x4.getRotateMatrixByQuaternion(this).getEulerAngles();
        },
        set: function (e) {
            var q = Matrix4x4_1.Matrix4x4.getRotateMatrixByEulerAngles(e).getRotate();
            this.w = q.w;
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
        },
        enumerable: false,
        configurable: true
    });
    Quaternion.prototype.rotateAround = function (angle, axis) {
        var q = Quaternion.angleAxis(angle, axis);
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;
    };
    /**
    * @zh 向量四元数乘法
    */
    Quaternion.prototype.transformQuat = function (a) {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations
        var out = new Vector3_1.Vector3();
        var q = this;
        // calculate quat * vec
        var ix = q.w * a.x + q.y * a.z - q.z * a.y;
        var iy = q.w * a.y + q.z * a.x - q.x * a.z;
        var iz = q.w * a.z + q.x * a.y - q.y * a.x;
        var iw = -q.x * a.x - q.y * a.y - q.z * a.z;
        // calculate result * inverse quat
        out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        return out;
    };
    Quaternion.prototype.copy = function () {
        return new Quaternion(this.x, this.y, this.z, this.w);
    };
    /**
     * @zh 四元数球面插值
     */
    Quaternion.slerp = function (a, b, t) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations
        var out = new Quaternion();
        var scale0 = 0;
        var scale1 = 0;
        // calc cosine
        var cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
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
            var omega = Math.acos(cosom);
            var sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }
        else {
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
    };
    Quaternion.dot = function (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    };
    Quaternion.angleAxis = function (angle, axis) {
        var res = new Quaternion();
        angle = Math.PI * angle / 180;
        angle *= 0.5;
        var sin = Math.sin(angle);
        res.x = axis.x * sin;
        res.y = axis.y * sin;
        res.z = axis.z * sin;
        res.w = Math.cos(angle);
        return res;
    };
    Object.defineProperty(Quaternion, "identity", {
        get: function () {
            return new Quaternion(0, 0, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    return Quaternion;
}());
exports.Quaternion = Quaternion;
},{"./Matrix4x4":3,"./Vector3":6}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Vector2 = void 0;
var Vector3_1 = require("./Vector3");
var Vector4_1 = require("./Vector4");
var Vector2 = /** @class */ (function () {
    function Vector2() {
        if (arguments[0] instanceof Vector3_1.Vector3) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        }
        else if (arguments[0] instanceof Vector4_1.Vector4) {
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
    Object.defineProperty(Vector2.prototype, "width", {
        get: function () { return this.x; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "height", {
        get: function () { return this.y; },
        enumerable: false,
        configurable: true
    });
    Vector2.prototype.add = function () {
        if (arguments[0] instanceof Vector2) {
            this.x += arguments[0].x;
            this.y += arguments[0].y;
        }
        else {
            this.x += arguments[0];
            this.y += arguments[1];
        }
        return this;
    };
    Vector2.prototype.subtract = function () {
        if (arguments[0] instanceof Vector2) {
            this.x -= arguments[0].x;
            this.y -= arguments[0].y;
        }
        else {
            this.x -= arguments[0];
            this.y -= arguments[1];
        }
        return this;
    };
    Vector2.prototype.multiply = function (d) {
        this.x *= d;
        this.y *= d;
        return this;
    };
    Vector2.prototype.divide = function (d) {
        this.x /= d;
        this.y /= d;
        return this;
    };
    Vector2.prototype.scale = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    Vector2.prototype.negate = function () {
        return this.multiply(-1);
    };
    Vector2.prototype.normalize = function () {
        var length = this.magnitude;
        if (length === 0)
            return new Vector2();
        return this.divide(length);
    };
    Object.defineProperty(Vector2.prototype, "magnitude", {
        get: function () {
            return Math.sqrt(Vector2.dot(this, this));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "sqrMagnitude", {
        get: function () {
            return Vector2.dot(this, this);
        },
        enumerable: false,
        configurable: true
    });
    /*
        ADDITIONAL FUNCTIONS
     */
    Vector2.prototype.copy = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.equals = function (v) {
        return v.x == this.x && v.y == this.y;
    };
    Vector2.prototype.toString = function () {
        return "[" + this.x + ", " + this.y + "]";
    };
    /*
        STATIC FUNCTIONS
     */
    Vector2.lerp = function (v1, v2, t) {
        var v = new Vector2();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        return v;
    };
    Vector2.dot = function (v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    };
    Vector2.cross = function (v1, v2) {
        return (v1.x * v2.y - v1.y * v2.x);
    };
    Vector2.distance = function (v1, v2) {
        var x = v2.x - v1.x;
        var y = v2.y - v1.y;
        return Math.sqrt(x * x + y * y);
    };
    Vector2.angle = function (v1, v2) {
        return Math.acos(Vector2.dot(v1, v2) / (v1.magnitude * v2.magnitude));
    };
    Object.defineProperty(Vector2, "ZERO", {
        /*
            STATIC VARIABLES
         */
        get: function () {
            return new Vector2(0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "ONE", {
        get: function () {
            return new Vector2(1, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "RIGHT", {
        get: function () {
            return new Vector2(1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "LEFT", {
        get: function () {
            return new Vector2(-1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "UP", {
        get: function () {
            return new Vector2(0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "DOWN", {
        get: function () {
            return new Vector2(0, -1);
        },
        enumerable: false,
        configurable: true
    });
    return Vector2;
}());
exports.Vector2 = Vector2;
},{"./Vector3":6,"./Vector4":7}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Vector3 = void 0;
var Vector2_1 = require("./Vector2");
var Vector4_1 = require("./Vector4");
var Vector3 = /** @class */ (function () {
    function Vector3() {
        if (arguments[0] instanceof Vector2_1.Vector2) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.z = 0;
        }
        else if (arguments[0] instanceof Vector4_1.Vector4) {
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
    Vector3.prototype.add = function () {
        if (arguments[0] instanceof Vector3) {
            this.x += arguments[0].x;
            this.y += arguments[0].y;
            this.z += arguments[0].z;
        }
        else {
            this.x += arguments[0];
            this.y += arguments[1];
            this.z += arguments[2];
        }
        return this;
    };
    Vector3.prototype.subtract = function () {
        if (arguments[0] instanceof Vector3) {
            this.x -= arguments[0].x;
            this.y -= arguments[0].y;
            this.z -= arguments[0].z;
        }
        else {
            this.x -= arguments[0];
            this.y -= arguments[1];
            this.z -= arguments[2];
        }
        return this;
    };
    Vector3.prototype.multiply = function (d) {
        this.x *= d;
        this.y *= d;
        this.z *= d;
        return this;
    };
    Vector3.prototype.divide = function (d) {
        this.x /= d;
        this.y /= d;
        this.z /= d;
        return this;
    };
    Vector3.prototype.scale = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    };
    Vector3.prototype.negate = function () {
        return this.multiply(-1);
    };
    Vector3.prototype.normalize = function () {
        var length = this.magnitude;
        if (length === 0)
            return new Vector3();
        return this.divide(length);
    };
    Object.defineProperty(Vector3.prototype, "magnitude", {
        get: function () {
            return Math.sqrt(Vector3.dot(this, this));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "sqrMagnitude", {
        get: function () {
            return Vector3.dot(this, this);
        },
        enumerable: false,
        configurable: true
    });
    /*
     ADDITIONAL FUNCTIONS
     */
    Vector3.prototype.copy = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    Vector3.prototype.equals = function (v) {
        return v.x == this.x && v.y == this.y && v.z == this.z;
    };
    Vector3.prototype.toString = function () {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    };
    /*
     STATIC FUNCTIONS
     */
    Vector3.lerp = function (v1, v2, t) {
        var v = new Vector3();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);
        return v;
    };
    Vector3.dot = function (v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
    };
    Vector3.cross = function (v1, v2) {
        var x = v1.y * v2.z - v1.z * v2.y;
        var y = v1.z * v2.x - v1.x * v2.z;
        var z = v1.x * v2.y - v1.y * v2.x;
        return new Vector3(x, y, z);
    };
    Vector3.distance = function (v1, v2) {
        var x = v2.x - v1.x;
        var y = v2.y - v1.y;
        var z = v2.z - v1.z;
        return Math.sqrt(x * x + y * y + z * z);
    };
    Vector3.difference = function (v1, v2) {
        var dest = new Vector3();
        dest.x = v1.x - v2.x;
        dest.y = v1.y - v2.y;
        dest.z = v1.z - v2.z;
        return dest;
    };
    Vector3.angle = function (v1, v2) {
        return Math.acos(Vector3.dot(v1, v2) / (v1.magnitude * v2.magnitude));
    };
    Object.defineProperty(Vector3, "ZERO", {
        /*
         STATIC VARIABLES
         */
        get: function () {
            return new Vector3(0, 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "ONE", {
        get: function () {
            return new Vector3(1, 1, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "RIGHT", {
        get: function () {
            return new Vector3(1, 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "LEFT", {
        get: function () {
            return new Vector3(-1, 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "UP", {
        get: function () {
            return new Vector3(0, 1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "DOWN", {
        get: function () {
            return new Vector3(0, -1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "FORWARD", {
        get: function () {
            return new Vector3(0, 0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3, "BACK", {
        get: function () {
            return new Vector3(0, 0, -1);
        },
        enumerable: false,
        configurable: true
    });
    return Vector3;
}());
exports.Vector3 = Vector3;
},{"./Vector2":5,"./Vector4":7}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Vector4 = void 0;
var Vector3_1 = require("./Vector3");
var Vector2_1 = require("./Vector2");
var Vector4 = /** @class */ (function () {
    function Vector4() {
        if (arguments[0] instanceof Vector2_1.Vector2) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.z = this.w = 0;
        }
        else if (arguments[0] instanceof Vector3_1.Vector3) {
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
    Object.defineProperty(Vector4.prototype, "r", {
        get: function () { return this.x; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "g", {
        get: function () { return this.y; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "b", {
        get: function () { return this.z; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "a", {
        get: function () { return this.w; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "vector3", {
        get: function () { return new Vector3_1.Vector3(this); },
        enumerable: false,
        configurable: true
    });
    Vector4.prototype.add = function () {
        if (arguments[0] instanceof Vector4) {
            this.x += arguments[0].x;
            this.y += arguments[0].y;
            this.z += arguments[0].z;
            this.w += arguments[0].w;
        }
        else {
            this.x += arguments[0];
            this.y += arguments[1];
            this.z += arguments[2];
            this.w += arguments[3];
        }
        return this;
    };
    Vector4.prototype.subtract = function () {
        if (arguments[0] instanceof Vector4) {
            this.x -= arguments[0].x;
            this.y -= arguments[0].y;
            this.z -= arguments[0].z;
            this.w -= arguments[0].w;
        }
        else {
            this.x -= arguments[0];
            this.y -= arguments[1];
            this.z -= arguments[2];
            this.w -= arguments[3];
        }
        return this;
    };
    Vector4.prototype.multiply = function (d) {
        this.x *= d;
        this.y *= d;
        this.z *= d;
        this.w *= d;
        return this;
    };
    Vector4.prototype.divide = function (d) {
        this.x /= d;
        this.y /= d;
        this.z /= d;
        this.w /= d;
        return this;
    };
    Vector4.prototype.scale = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
        return this;
    };
    Vector4.prototype.negate = function () {
        return this.multiply(-1);
    };
    Vector4.prototype.normalize = function () {
        var length = this.magnitude;
        if (length === 0)
            return new Vector4();
        return this.divide(length);
    };
    Object.defineProperty(Vector4.prototype, "magnitude", {
        get: function () {
            return Math.sqrt(Vector4.dot(this, this));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "sqrMagnitude", {
        get: function () {
            return Vector4.dot(this, this);
        },
        enumerable: false,
        configurable: true
    });
    /*
     ADDITIONAL FUNCTIONS
     */
    Vector4.prototype.copy = function () {
        return new Vector4(this.x, this.y, this.z, this.w);
    };
    Vector4.prototype.equals = function (v) {
        return v.x == this.x && v.y == this.y && v.z == this.z && v.w == this.w;
    };
    Vector4.prototype.toString = function () {
        return "[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]";
    };
    /*
     STATIC FUNCTIONS
     */
    Vector4.lerp = function (v1, v2, t) {
        var v = new Vector4();
        v.x = v1.x + t * (v2.x - v1.x);
        v.y = v1.y + t * (v2.y - v1.y);
        v.z = v1.z + t * (v2.z - v1.z);
        v.w = v1.w + t * (v2.w - v1.w);
        return v;
    };
    Vector4.dot = function (v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w);
    };
    Vector4.distance = function (v1, v2) {
        return Math.sqrt(Vector4.dot(v1, v2));
    };
    Object.defineProperty(Vector4, "ZERO", {
        /*
         STATIC VARIABLES
         */
        get: function () {
            return new Vector4(0, 0, 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4, "ONE", {
        get: function () {
            return new Vector4(1, 1, 1, 1);
        },
        enumerable: false,
        configurable: true
    });
    return Vector4;
}());
exports.Vector4 = Vector4;
},{"./Vector2":5,"./Vector3":6}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Transform = exports.Instance = void 0;
var Matrix4x4_1 = require("./Math/Matrix4x4");
var Quaternion_1 = require("./Math/Quaternion");
var Vector3_1 = require("./Math/Vector3");
var Vector4_1 = require("./Math/Vector4");
var Instance = /** @class */ (function () {
    function Instance() {
    }
    return Instance;
}());
exports.Instance = Instance;
var Transform = /** @class */ (function () {
    function Transform(tag) {
        this._parent = null;
        this.tag = tag;
        this.children = new Array();
        this._parent = null;
        this._tempPos = Vector3_1.Vector3.ZERO;
        this._tempRot = Quaternion_1.Quaternion.identity;
        this._tempScale = Vector3_1.Vector3.ONE;
    }
    Object.defineProperty(Transform.prototype, "selfMatrix", {
        get: function () {
            return Matrix4x4_1.Matrix4x4.getTRSMatrix(this._tempPos, this._tempRot, this._tempScale);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "localToWorldMatrix", {
        get: function () {
            var p = this.parent != null ? this.parent.localToWorldMatrix : Matrix4x4_1.Matrix4x4.identity;
            return p.multiply(this.selfMatrix);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "worldToLocalMatrix", {
        get: function () {
            var p = this.parent != null ? this.parent.worldToLocalMatrix : Matrix4x4_1.Matrix4x4.identity;
            return this.selfMatrix.inverse().multiply(p);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "x", {
        get: function () {
            return this.position.x;
        },
        set: function (x) {
            var pos = this.position;
            pos.x = x;
            this.position = pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        set: function (y) {
            var pos = this.position;
            pos.y = y;
            this.position = pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "z", {
        get: function () {
            return this.position.z;
        },
        set: function (z) {
            var pos = this.position;
            pos.z = z;
            this.position = pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "forward", {
        get: function () {
            //这里需要注意，因为整个逻辑用的是右手系统，所以向前的方向（即指向屏幕内）是负轴
            //我们要得到的是一个方向，因此不需要位置信息，将齐次坐标的w设置为0，抛弃掉坐标信息
            return this.convertToWorldSpace(Vector3_1.Vector3.BACK, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "up", {
        get: function () {
            return this.convertToWorldSpace(Vector3_1.Vector3.UP, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "right", {
        get: function () {
            return this.convertToWorldSpace(Vector3_1.Vector3.RIGHT, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "position", {
        get: function () {
            return this._tempPos.copy();
        },
        set: function (pos) {
            this._tempPos = pos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "worldPosition", {
        get: function () {
            return this.localToWorldMatrix.getTranslate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "rotation", {
        get: function () {
            return this._tempRot.copy();
        },
        set: function (q) {
            this._tempRot = q;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "worldRotation", {
        get: function () {
            return this.localToWorldMatrix.getEulerAngles();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "scale", {
        get: function () {
            return this._tempScale.copy();
        },
        set: function (s) {
            this._tempScale = s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "worldScale", {
        get: function () {
            return this.localToWorldMatrix.getScale();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: false,
        configurable: true
    });
    Transform.prototype.setParent = function (parent, worldPositionStays) {
        if (worldPositionStays === void 0) { worldPositionStays = true; }
        if (parent != null && parent != this && parent != this.parent) {
            //防止出现：父节点是当前节点的子节点，将子节的设置为自己的父节点，会死循环
            if (parent.hasParent(this)) {
                console.error("Failed to set parent, this node is the parent node's parent.");
                return;
            }
            //如果当前节点有父节点，要先移除旧的
            if (this.parent != null) {
                this.parent.removeChild(this, worldPositionStays);
            }
            parent.addChild(this, worldPositionStays);
        }
        else if (parent == null && this.parent != null) {
            this.parent.removeChild(this, worldPositionStays);
        }
    };
    //节点p是否是当前节点的上级
    Transform.prototype.hasParent = function (p) {
        if (this.parent == null)
            return false;
        else if (this.parent == p)
            return true;
        else
            return this.parent.hasParent(p);
    };
    Transform.prototype.addChild = function (child, worldPositionStays) {
        if (worldPositionStays === void 0) { worldPositionStays = true; }
        if (child != null && child != this && !this.children.includes(child)) {
            //防止出现：child节点是当前节点的父节点，将父节的设置为自己的子节点，会死循环
            if (this.hasParent(child)) {
                console.error("Failed to add child, this node is the child node's child.");
                return false;
            }
            //如果子节点有旧的父节点，要先移除
            if (child.parent != null) {
                child.parent.removeChild(child, worldPositionStays);
            }
            this.children.push(child);
            child._parent = this;
            if (worldPositionStays) {
                //保留原世界坐标位置，先朝父节点的变换的反方向移动，然后再添加进去，就能保持世界坐标不变
                //即变换到父节点的逆矩阵里
                var m = this.worldToLocalMatrix.multiply(child.selfMatrix);
                child._tempPos = m.getTranslate();
                child._tempRot = m.getRotate();
                child._tempScale = m.getScale();
            }
            return true;
        }
        return false;
    };
    Transform.prototype.removeChild = function (child, worldPositionStays) {
        if (worldPositionStays === void 0) { worldPositionStays = true; }
        var index = this.children.indexOf(child, 0);
        if (index > -1) {
            if (worldPositionStays) {
                //保留世界坐标，直接将本地坐标等同于当前世界坐标即可
                var m = this.localToWorldMatrix.multiply(child.selfMatrix);
                child._tempPos = m.getTranslate();
                child._tempRot = m.getRotate();
                child._tempScale = m.getScale();
            }
            this.children.splice(index, 1);
            child._parent = null;
            return true;
        }
        return false;
    };
    Transform.prototype.getChildByTag = function (tag) {
        var nodes = this.children;
        for (var i = 0; i < nodes.length; ++i) {
            if (nodes[i].tag == tag) {
                return nodes[i];
            }
        }
        return null;
    };
    Transform.prototype.convertToNodeSpace = function (v, w) {
        if (w === void 0) { w = 1; }
        /*
         *将某个坐标转到自己的局部空间，例如当前的局部坐标原点在世界坐标的（1，1）处
         *点p在世界坐标（2，1）处，那么将点p相对于当前局部坐标系的位置就是（2，1）-（1，1）= （1， 0）
         *即将点p反向变换当前的矩阵
         */
        return this.worldToLocalMatrix.multiplyVector4(new Vector4_1.Vector4(v, w)).vector3;
    };
    Transform.prototype.convertToWorldSpace = function (v, w) {
        if (w === void 0) { w = 1; }
        return this.localToWorldMatrix.multiplyVector4(new Vector4_1.Vector4(v, w)).vector3;
    };
    Transform.prototype.destroy = function (destroyChildren) {
        var _this = this;
        if (destroyChildren === void 0) { destroyChildren = true; }
        if (destroyChildren) {
            this.children.forEach(function (child) {
                child.destroy(destroyChildren);
            });
        }
        else {
            this.children.forEach(function (child) {
                _this.removeChild(child);
            });
        }
    };
    return Transform;
}());
exports.Transform = Transform;
},{"./Math/Matrix4x4":3,"./Math/Quaternion":4,"./Math/Vector3":6,"./Math/Vector4":7}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Renderer = void 0;
var Color_1 = require("./Color");
var Vector2_1 = require("./Math/Vector2");
var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["Wireframe"] = 0] = "Wireframe";
    DrawMode[DrawMode["Point"] = 1] = "Point";
    DrawMode[DrawMode["Shader"] = 2] = "Shader";
})(DrawMode || (DrawMode = {}));
var Renderer = /** @class */ (function () {
    function Renderer(uint32View, canvasWidth, canvasHeight) {
        this.drawMode = DrawMode.Wireframe;
        this.uint32View = uint32View;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.canvasWidthHalf = canvasWidth >> 1;
        this.canvasHeightHalf = canvasHeight >> 1;
        this.aspectRatio = canvasWidth / canvasHeight;
    }
    //#region 基础绘制接口
    Renderer.prototype.Clear = function (color) {
        // 使用 fill 方法替代循环，性能更好
        this.uint32View.fill(color);
        // 或者使用循环，但性能较差
        // for (let x = 0; x < this.canvasWidth; x++) {
        //     for (let y = 0; y < this.canvasHeight; y++) {
        //         this.SetPixel(x, y, color);
        //     }
        // }
    };
    Renderer.prototype.DrawPixel = function (x, y, color) {
        // 绘制到屏幕上的像素应该是整数的
        // 优化: 使用位运算代替Math.floor，提升性能
        x = (x | 0);
        y = (y | 0);
        // x = Math.floor(x);
        // y = Math.floor(y);
        if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
            return;
        }
        this.uint32View[y * this.canvasWidth + x] = color;
    };
    Renderer.prototype.DrawLine = function (x1, y1, x2, y2, color) {
        var _a, _b;
        // 取整
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;
        var dx = x2 - x1;
        var dy = y2 - y1;
        // 为何要区分斜率是否偏水平还是垂直呢？因为如果不区分，例如当斜率大于1时，会导致直线绘制不连续，因为y会跳变，而不是连续的增加。
        // 只有斜率刚好为1时，x跟y才是连续同步自增的，x+1，则y也+1
        // 所以，当斜率大于1时，我们需要使用y作为循环变量，而当斜率小于1时，我们需要使用x作为循环变量。
        // 举个极端例子，当斜率为0时，直线就是一条垂直直线，如果这时候还用x作为循环变量，则会导致这条直线上所有y点都对应一个x，也就是说这条线变成一个点了。
        // 斜率小于1，直线偏水平情况，使用x作为循环变量
        if (Math.abs(dx) > Math.abs(dy)) {
            // 下面的循环绘制函数是从左往右的，这里要确保结束点在开始点的右边
            if (x2 < x1)
                _a = [x2, y2, x1, y1], x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
            // 斜率
            var a = dy / dx;
            // 截距（y=ax+b，b=y-ax）
            // const b = y1 - a * x1;
            var y = y1;
            // 绘制直线
            for (var x = x1; x <= x2; x++) {
                this.DrawPixel(x, y, color);
                // 直线公式y=ax+b，这里不必计算这个公式，因为当x加1自增时，y也会加a，所以可以直接用y+a代替ax+b，算是一个性能优化点
                // y = a * x + b;
                y = y + a;
            }
            // 或
            // const ys = this.Interpolate(x1, y1, x2, y2);
            // for (let x = x1; x <= x2; x++) {
            //     this.DrawPixel(x, ys[x - x1], color);
            // }
        }
        // 斜率大于1，直线偏垂直情况，使用y作为循环变量
        else {
            if (y2 < y1)
                _b = [x2, y2, x1, y1], x1 = _b[0], y1 = _b[1], x2 = _b[2], y2 = _b[3];
            var a = dx / dy;
            var x = x1;
            for (var y = y1; y <= y2; y++) {
                this.DrawPixel(x, y, color);
                x = x + a;
            }
            // 或
            // const xs = this.Interpolate(y1, x1, y2, x2);
            // for (let y = y1; y <= y2; y++) {
            //     this.DrawPixel(xs[y - y1], y, color);
            // }
        }
    };
    Renderer.prototype.DrawTriangle = function (x1, y1, x2, y2, x3, y3, color) {
        this.DrawLine(x1, y1, x2, y2, color);
        this.DrawLine(x2, y2, x3, y3, color);
        this.DrawLine(x3, y3, x1, y1, color);
    };
    Renderer.prototype.DrawTriangleFilled = function (x1, y1, x2, y2, x3, y3, color) {
        // 注：以下提到的长边，特指y轴跨度最长的边，而不是实际上的边长
        var _a, _b, _c;
        // 实际绘制到屏幕上的点，必须是整数，取整一下。使用位运算代替Math.floor，提升性能
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;
        x3 = x3 | 0;
        y3 = y3 | 0;
        // 对点进行排序，使得y1<=y2<=y3，即可确定三角形的长边为L13，L12和L23则是另外两条短边
        if (y1 > y2)
            _a = [x2, y2, x1, y1], x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
        if (y1 > y3)
            _b = [x3, y3, x1, y1], x1 = _b[0], y1 = _b[1], x3 = _b[2], y3 = _b[3];
        if (y2 > y3)
            _c = [x3, y3, x2, y2], x2 = _c[0], y2 = _c[1], x3 = _c[2], y3 = _c[3];
        // 获取3条边的点坐标合集
        var p12 = this.Interpolate(y1, x1, y2, x2);
        var p23 = this.Interpolate(y2, x2, y3, x3);
        var p13 = this.Interpolate(y1, x1, y3, x3);
        // 拼合两条短边为一条长边（先移除第一条边的最后一个数据，避免重复）
        // 现在变成2条长边，L13和L123
        p12.pop();
        var p123 = p12.concat(p23);
        // 判断L13和L123哪条长边是左哪条是右，都取数组中间的点，判断谁左谁右即可。
        // 使用位运算代替Math.floor，提升性能
        // const m = Math.floor(p123.length / 2);
        var m = (p123.length >> 1) | 0;
        var pLeft = p123;
        var pRight = p13;
        if (p13[m] < p123[m]) {
            pLeft = p13;
            pRight = p123;
        }
        // 绘制水平线段
        for (var y = y1; y <= y3; y++) {
            for (var x = pLeft[y - y1]; x <= pRight[y - y1]; x++) {
                this.DrawPixel(x, y, color);
            }
        }
    };
    Renderer.prototype.DrawTriangleFilledWithVertexColor = function (x1, y1, x2, y2, x3, y3, color1, color2, color3) {
        var _a, _b, _c;
        // 实际绘制到屏幕上的点，必须是整数，取整一下。使用位运算代替Math.floor，提升性能
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;
        x3 = x3 | 0;
        y3 = y3 | 0;
        // 对点按Y坐标排序，确保y1 <= y2 <= y3
        if (y1 > y2)
            _a = [x2, y2, x1, y1, color2, color1], x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3], color1 = _a[4], color2 = _a[5];
        if (y1 > y3)
            _b = [x3, y3, x1, y1, color3, color1], x1 = _b[0], y1 = _b[1], x3 = _b[2], y3 = _b[3], color1 = _b[4], color3 = _b[5];
        if (y2 > y3)
            _c = [x3, y3, x2, y2, color3, color2], x2 = _c[0], y2 = _c[1], x3 = _c[2], y3 = _c[3], color2 = _c[4], color3 = _c[5];
        // 提取RGB分量
        var c1 = Color_1.Color.FromUint32(color1);
        var c2 = Color_1.Color.FromUint32(color2);
        var c3 = Color_1.Color.FromUint32(color3);
        // 插值函数，颜色1与颜色2在d1-d2的范围内均匀插值
        var interpolateColor = function (d1, r1, g1, b1, a1, d2, r2, g2, b2, a2) {
            // 预分配数组大小
            // 使用位运算代替Math.floor和Math.abs，提升性能
            // const dx = Math.abs(Math.floor(d2 - d1));
            var dx = ((d2 > d1 ? d2 - d1 : d1 - d2) | 0);
            var result = new Array(dx + 1);
            // 计算步长
            var invDelta = 1 / (d2 - d1);
            var rStep = (r2 - r1) * invDelta;
            var gStep = (g2 - g1) * invDelta;
            var bStep = (b2 - b1) * invDelta;
            var aStep = (a2 - a1) * invDelta;
            var r = r1, g = g1, b = b1, a = a1;
            for (var i = 0; i <= dx; i++) {
                result[i] = { r: r, g: g, b: b, a: a };
                r += rStep;
                g += gStep;
                b += bStep;
                a += aStep;
            }
            return result;
        };
        // 插值三条边的坐标和颜色
        var p12 = this.Interpolate(y1, x1, y2, x2);
        var p12Colors = interpolateColor(y1, c1.r, c1.g, c1.b, c1.a, y2, c2.r, c2.g, c2.b, c2.a);
        var p23 = this.Interpolate(y2, x2, y3, x3);
        var p23Colors = interpolateColor(y2, c2.r, c2.g, c2.b, c2.a, y3, c3.r, c3.g, c3.b, c3.a);
        var p13 = this.Interpolate(y1, x1, y3, x3);
        var p13Colors = interpolateColor(y1, c1.r, c1.g, c1.b, c1.a, y3, c3.r, c3.g, c3.b, c3.a);
        // 合并两条短边
        p12.pop();
        var p123 = p12.concat(p23);
        var p123Colors = p12Colors.concat(p23Colors);
        // 确定左右边界
        // const m = Math.floor(p123.length / 2);
        var m = (p123.length >> 1) | 0;
        var leftPoints = p123;
        var rightPoints = p13;
        var leftColors = p123Colors;
        var rightColors = p13Colors;
        if (p13[m] < p123[m]) {
            leftPoints = p13;
            rightPoints = p123;
            leftColors = p13Colors;
            rightColors = p123Colors;
        }
        // 绘制水平线段，并进行颜色插值
        for (var y = y1; y <= y3; y++) {
            var idx = y - y1;
            var xStart = leftPoints[idx];
            var xEnd = rightPoints[idx];
            var leftColor = leftColors[idx];
            var rightColor = rightColors[idx];
            // 预计算颜色差值
            var rDiff = rightColor.r - leftColor.r;
            var gDiff = rightColor.g - leftColor.g;
            var bDiff = rightColor.b - leftColor.b;
            var aDiff = rightColor.a - leftColor.a;
            // 步长和颜色增量
            var invLength = 1 / ((xEnd - xStart) + 1);
            var rStep = rDiff * invLength;
            var gStep = gDiff * invLength;
            var bStep = bDiff * invLength;
            var aStep = aDiff * invLength;
            // 初始颜色值
            var r = leftColor.r;
            var g = leftColor.g;
            var b = leftColor.b;
            var a = leftColor.a;
            // 水平方向颜色插值
            for (var x = xStart; x <= xEnd; x++) {
                var finalColor = ((a | 0) << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0);
                this.DrawPixel(x, y, finalColor);
                // 累加颜色值
                r += rStep;
                g += gStep;
                b += bStep;
                a += aStep;
            }
        }
    };
    //#endregion
    //#region 投影相关
    // 将视口上的内容映射到实际屏幕上
    Renderer.prototype.ViewportToCanvas = function (point) {
        // 假设视口宽度为1个单位
        // 因为aspectRatio = canvasWidth / canvasHeight，
        // 所以视口高度 = 1 / aspectRatio = canvasHeight / canvasWidth
        var viewportWidth = 1;
        var viewportHeight = 1 / this.aspectRatio;
        // 将投影坐标映射到Canvas像素坐标
        // X坐标：从 [-viewportWidth/2, viewportWidth/2] 映射到 [0, canvasWidth]
        // Y坐标：从 [-viewportHeight/2, viewportHeight/2] 映射到 [0, canvasHeight] (注意Y轴方向)
        var canvasX = ((point.x + viewportWidth / 2) / viewportWidth) * this.canvasWidth;
        var canvasY = this.canvasHeight - (((point.y + viewportHeight / 2) / viewportHeight) * this.canvasHeight); // Canvas的Y轴通常是向下的
        point.x = canvasX;
        point.y = canvasY;
    };
    // 透视投影，将3D场景的坐标转换为2D屏幕坐标，投射到视口上
    Renderer.prototype.ProjectVertex = function (vertex) {
        // 假设视点到近裁面（视口）的距离是d，视口的宽是1
        // 根据三角函数有：tan(fov/2) = (0.5 / d)
        // 所以：d = 0.5 / tan(fov/2)
        var fovDegrees = 60;
        var fovRadians = fovDegrees * (Math.PI / 180); // 将角度转换为弧度
        var d = 0.5 / Math.tan(fovRadians / 2);
        // 透视公式，假设视点位置(0,0)，视点到视口距离为d，场景里的点为P(x,y,z)，投射到视口上的点为P'(x,y)
        // 则根据相似三角形有：z / d = x / x' = y / y'，可得到：
        // x' = (d * x) / z
        // y' = (d * y) / z
        var projectionX = (d * vertex.x) / vertex.z;
        var projectionY = (d * vertex.y) / vertex.z;
        return new Vector2_1.Vector2(projectionX, projectionY);
    };
    //#endregion
    //#region 变换
    Renderer.prototype.ApplyTransform = function (vertex, transform) {
        // 必须严格安装先缩放后旋转后平移的顺序
        this.ScaleVertex(vertex, transform);
        this.RotateVertex(vertex, transform);
        this.TranslateVertex(vertex, transform);
    };
    Renderer.prototype.ScaleVertex = function (vertex, transform) {
        vertex.x *= transform.scale.x;
        vertex.y *= transform.scale.y;
        vertex.z *= transform.scale.z;
    };
    Renderer.prototype.RotateVertex = function (vertex, transform) {
        var eulerAngles = transform.rotation.eulerAngles;
        var cosX = Math.cos(eulerAngles.x);
        var sinX = Math.sin(eulerAngles.x);
        var cosY = Math.cos(eulerAngles.y);
        var sinY = Math.sin(eulerAngles.y);
        var cosZ = Math.cos(eulerAngles.z);
        var sinZ = Math.sin(eulerAngles.z);
        // 先绕Z轴旋转
        var x = vertex.x * cosZ - vertex.y * sinZ;
        var y = vertex.x * sinZ + vertex.y * cosZ;
        vertex.x = x;
        vertex.y = y;
        // 再绕Y轴旋转
        var z = vertex.z * cosY - vertex.x * sinY;
        var x2 = vertex.z * sinY + vertex.x * cosY;
        vertex.z = z;
        vertex.x = x2;
        // 最后绕X轴旋转
        var y2 = vertex.y * cosX - vertex.z * sinX;
        var z2 = vertex.y * sinX + vertex.z * cosX;
        vertex.y = y2;
        vertex.z = z2;
    };
    Renderer.prototype.TranslateVertex = function (vertex, transform) {
        vertex.x += transform.position.x;
        vertex.y += transform.position.y;
        vertex.z += transform.position.z;
    };
    //#endregion
    //#region 绘制物体
    Renderer.prototype.DrawObject = function (obj) {
        var model = obj.model;
        var vertices = model.vertices;
        var indices = model.faces.flatMap(function (face) { return face.vertexIndices; });
        var projectedVertices = new Array(vertices.length);
        for (var i = 0; i < vertices.length; i += 1) {
            var vertice = vertices[i].copy();
            // 先变换
            this.ApplyTransform(vertice, obj.transform);
            // 再投影
            projectedVertices[i] = this.ProjectVertex(vertice);
            // 再视口映射
            this.ViewportToCanvas(projectedVertices[i]);
        }
        // 最后绘制三角形到屏幕上
        for (var i = 0; i < indices.length; i += 3) {
            var p1 = projectedVertices[indices[i]];
            var p2 = projectedVertices[indices[i + 1]];
            var p3 = projectedVertices[indices[i + 2]];
            // 线框模式，暂不支持顶点色
            if (this.drawMode === DrawMode.Wireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
            }
            else if (this.drawMode === DrawMode.Point) {
                this.DrawPixel(p1.x, p1.y, Color_1.Color.WHITE);
                this.DrawPixel(p2.x, p2.y, Color_1.Color.WHITE);
                this.DrawPixel(p3.x, p3.y, Color_1.Color.WHITE);
            }
            else if (this.drawMode === DrawMode.Shader) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
            }
        }
    };
    //#endregion
    //#region 工具函数
    /// <summary>
    /// 线性插值
    /// 传入2个点，返回它们组成线段的插值。
    /// 要求：
    /// 1. 要先算出直线偏水平还是垂直，如果是偏水平（斜率小于1），则以x为循环，传入顺序是(x1,y1,x2,y2)，反之如果直线偏垂直，则是(y1,x1,y2,x2)
    /// 2. 同时要确保线段点的方向是从左往右或从上往下，例如线段是偏水平的话，要确保x2>x1，如果是偏垂直的话，要确保y2>y1
    /// 举个例子：
    /// 点(0, 0)和(2,1)，传入的参数是(0, 0, 2, 1)，返回的是((2-0)+1=3)个值，这些值是从(0-1)中间插值的，即(0, 0.5, 1)
    /// </summary>
    Renderer.prototype.Interpolate = function (a1, b1, a2, b2) {
        // 预分配数组大小以避免动态扩容
        // const dx = Math.abs(Math.floor(a2 - a1));
        var dx = ((a2 > a1 ? a2 - a1 : a1 - a2) | 0);
        var value = new Array(dx + 1);
        var a = (b2 - b1) / (a2 - a1);
        var d = b1;
        for (var i = 0; i <= dx; i++) {
            value[i] = d;
            d += a;
        }
        return value;
    };
    return Renderer;
}());
exports.Renderer = Renderer;
},{"./Color":1,"./Math/Vector2":5}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AssetLoader = void 0;
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
var Model_1 = require("../Model");
var Dictionary_1 = require("./Dictionary");
var ObjParser_1 = require("./ObjParser");
var AssetLoader = /** @class */ (function () {
    function AssetLoader() {
    }
    AssetLoader.loadImageFile = function (fileName) {
        return new Promise(function (resolve) {
            if (AssetLoader.fileCache.has(fileName)) {
                resolve(AssetLoader.fileCache.get(fileName));
            }
            else {
                var image = new Image();
                if (!image) {
                    console.error('Failed to create the image object');
                    return;
                }
                // Register the event handler to be called on loading an image
                image.onload = function () {
                    AssetLoader.fileCache.set(fileName, image);
                    resolve(image);
                };
                // 跨区请求
                image.crossOrigin = "";
                // Tell the browser to load an image
                image.src = fileName;
            }
        });
    };
    AssetLoader.loadTextFile = function (fileName) {
        return new Promise(function (resolve) {
            if (AssetLoader.fileCache.has(fileName)) {
                resolve(AssetLoader.fileCache.get(fileName));
            }
            else {
                var request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            AssetLoader.fileCache.set(fileName, request.responseText);
                            resolve(request.responseText);
                        }
                        else {
                            resolve("");
                        }
                    }
                };
                //这里不要开启异步，设置为false，否则容易卡在readyState = 1，原因不明
                request.open("GET", fileName, false);
                request.send();
            }
        });
    };
    /*
    public static loadModelFile(fileName: string): Promise<OBJDoc> {
        return new Promise<OBJDoc>((resolve) => {

            if (AssetLoader.fileCache.has(fileName)) {
                resolve(AssetLoader.fileCache.get(fileName));
            }
            else {
                var request = new XMLHttpRequest();
                request.onreadystatechange = async function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            var objDoc = new OBJDoc(fileName);
                            var result = await objDoc.parse(request.responseText, 1, false);

                            if (!result) {
                                console.error("OBJ file parsing error: " + fileName);
                                return;
                            }

                            AssetLoader.fileCache.set(fileName, objDoc);
                            resolve(objDoc);
                        }
                        else {
                            resolve(null);
                        }
                    }
                };

                //这里不要开启异步，设置为false，否则容易卡在readyState = 1，原因不明
                request.open("GET", fileName, false);
                request.send();
            }
        });
    }
    */
    AssetLoader.loadInstanceFromModel = function (name, modelPath, scale, reverse) {
        if (scale === void 0) { scale = 1; }
        if (reverse === void 0) { reverse = false; }
        return __awaiter(this, void 0, void 0, function () {
            var instance, objDoc, model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new Model_1.Instance();
                        instance.name = name;
                        instance.transform = new Model_1.Transform(name);
                        instance.transform.position = Vector3_1.Vector3.ZERO;
                        instance.transform.rotation = Quaternion_1.Quaternion.identity;
                        instance.transform.scale = Vector3_1.Vector3.ONE;
                        return [4 /*yield*/, AssetLoader.loadTextFile(modelPath)];
                    case 1:
                        objDoc = _a.sent();
                        if (objDoc != null) {
                            model = ObjParser_1.OBJParser.parseOBJ(objDoc);
                            instance.model = model;
                            // 输出统计信息
                            console.log(ObjParser_1.OBJParser.getModelStats(model));
                            // var objs = objDoc.getObjs(scale, reverse);
                            // objs.forEach(async obj => {
                            //     //todo:临死写死，只加载漫反射贴图
                            //     // if (obj.material != null && obj.material.map_Kd != null) {
                            //     //     render.material.createTexture(obj.material.map_Kd);
                            //     // }
                            //     var model = new Model();
                            //     model.name = name;
                            //     model.vertices = obj.vertices;
                            //     model.indices = obj.indices;
                            //     model.uvs = obj.uvs;
                            //     model.normals = obj.normals;
                            //     instance.model.push(model);
                            // });
                        }
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    AssetLoader.fileCache = new Dictionary_1.Dictionary();
    return AssetLoader;
}());
exports.AssetLoader = AssetLoader;
},{"../Math/Quaternion":4,"../Math/Vector3":6,"../Model":8,"./Dictionary":11,"./ObjParser":12}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Dictionary = void 0;
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.items = {};
    }
    Object.defineProperty(Dictionary.prototype, "count", {
        get: function () {
            return Object.keys(this.items).length;
        },
        enumerable: false,
        configurable: true
    });
    Dictionary.prototype.has = function (key) {
        return this.items.hasOwnProperty(key);
    };
    Dictionary.prototype.set = function (key, val) {
        this.items[key] = val;
    };
    Dictionary.prototype["delete"] = function (key) {
        if (this.has(key)) {
            delete this.items[key];
        }
        return false;
    };
    Dictionary.prototype.get = function (key) {
        return this.has(key) ? this.items[key] : undefined;
    };
    Dictionary.prototype.clear = function () {
        this.items = {};
    };
    Dictionary.prototype.values = function () {
        var values = [];
        for (var k in this.items) {
            if (this.has(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    };
    Dictionary.prototype.forEach = function (fun) {
        for (var k in this.items) {
            fun(k, this.items[k]);
        }
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;
},{}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.OBJParser = void 0;
var Vector3_1 = require("../Math/Vector3");
var Vector2_1 = require("../Math/Vector2");
/**
 * OBJ文件解析器类
 */
var OBJParser = /** @class */ (function () {
    function OBJParser() {
    }
    /**
     * 解析OBJ文件
     * @param fileContent OBJ文件内容
     * @returns 解析后的OBJ模型数据
     */
    OBJParser.parseOBJ = function (fileContent) {
        var lines = fileContent.split('\n');
        var result = {
            vertices: [],
            textureCoords: [],
            vertexNormals: [],
            faces: [],
            materials: {}
        };
        var currentMaterial = '';
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var trimmedLine = line.trim();
            // 跳过空行和注释
            if (!trimmedLine || trimmedLine.startsWith('#'))
                continue;
            var lineParts = trimmedLine.split(/\s+/);
            var keyword = lineParts[0];
            switch (keyword) {
                case 'v': // 顶点坐标
                    if (lineParts.length >= 4) {
                        var vertex = new Vector3_1.Vector3(parseFloat(lineParts[1]), parseFloat(lineParts[2]), parseFloat(lineParts[3]));
                        result.vertices.push(vertex);
                    }
                    break;
                case 'vt': // 纹理坐标
                    if (lineParts.length >= 2) {
                        var texCoord = new Vector2_1.Vector2(parseFloat(lineParts[1]), parseFloat(lineParts[2]));
                        result.textureCoords.push(texCoord);
                    }
                    break;
                case 'vn': // 顶点法线
                    if (lineParts.length >= 4) {
                        var normal = new Vector3_1.Vector3(parseFloat(lineParts[1]), parseFloat(lineParts[2]), parseFloat(lineParts[3]));
                        result.vertexNormals.push(normal);
                    }
                    break;
                case 'f': // 面定义
                    if (lineParts.length >= 4) {
                        var face = {
                            vertexIndices: [],
                            textureIndices: [],
                            normalIndices: []
                        };
                        // 解析面的每个顶点定义
                        for (var i = 1; i < lineParts.length; i++) {
                            var vertexDef = lineParts[i];
                            // 支持v、v/vt、v//vn、v/vt/vn等多种格式
                            var vertexParts = vertexDef.split('/');
                            // 顶点索引（OBJ索引从1开始，需要转换为从0开始）
                            if (vertexParts[0]) {
                                face.vertexIndices.push(parseInt(vertexParts[0]) - 1);
                            }
                            // 纹理坐标索引（可选）
                            if (vertexParts[1] && vertexParts[1] !== '') {
                                face.textureIndices.push(parseInt(vertexParts[1]) - 1);
                            }
                            // 法线索引（可选）
                            if (vertexParts[2] && vertexParts[2] !== '') {
                                face.normalIndices.push(parseInt(vertexParts[2]) - 1);
                            }
                        }
                        // 如果没有纹理或法线索引，清空数组以保持数据整洁
                        if (face.textureIndices.length === 0) {
                            delete face.textureIndices;
                        }
                        if (face.normalIndices.length === 0) {
                            delete face.normalIndices;
                        }
                        // 添加材质信息（如果有）
                        if (currentMaterial) {
                            face.materialName = currentMaterial;
                        }
                        result.faces.push(face);
                    }
                    break;
                case 'mtllib': // 材质库引用
                    if (lineParts.length >= 2) {
                        var materialLibName = lineParts[1];
                        // 实际应用中需要加载并解析对应的.mtl文件
                        console.log("\u53D1\u73B0\u6750\u8D28\u5E93\u5F15\u7528: " + materialLibName);
                    }
                    break;
                case 'usemtl': // 使用材质
                    if (lineParts.length >= 2) {
                        currentMaterial = lineParts[1];
                        // 初始化材质记录（实际使用时需要从.mtl文件加载完整信息）
                        if (!result.materials[currentMaterial]) {
                            result.materials[currentMaterial] = { name: currentMaterial };
                        }
                    }
                    break;
                // 可以添加更多OBJ格式关键字的处理
                default:
                    // 忽略不支持的关键字
                    break;
            }
        }
        return result;
    };
    /**
     * 将解析后的模型数据转换为JSON字符串
     * @param model OBJ模型数据
     * @returns JSON字符串
     */
    OBJParser.toJSON = function (model) {
        return JSON.stringify(model, null, 2);
    };
    /**
     * 获取模型统计信息
     * @param model OBJ模型数据
     * @returns 统计信息
     */
    OBJParser.getModelStats = function (model) {
        var textureCount = model.textureCoords.length;
        var normalCount = model.vertexNormals.length;
        var facesWithTextures = model.faces.filter(function (face) { return face.textureIndices; }).length;
        var facesWithNormals = model.faces.filter(function (face) { return face.normalIndices; }).length;
        return ("\n\u6A21\u578B\u7EDF\u8BA1\u4FE1\u606F:\n- \u9876\u70B9\u6570: " + model.vertices.length + "\n- \u7EB9\u7406\u5750\u6807\u6570: " + textureCount + "\n- \u6CD5\u7EBF\u5411\u91CF\u6570: " + normalCount + "\n- \u9762\u6570: " + model.faces.length + "\n- \u5E26\u7EB9\u7406\u7684\u9762: " + facesWithTextures + "\n- \u5E26\u6CD5\u7EBF\u7684\u9762: " + facesWithNormals + "\n- \u6750\u8D28\u6570: " + Object.keys(model.materials).length + "\n        ").trim();
    };
    /**
     * 验证解析数据的完整性
     * @param model OBJ模型数据
     * @returns 验证结果消息
     */
    OBJParser.validateModel = function (model) {
        var errors = [];
        // 检查面索引是否越界
        for (var _i = 0, _a = model.faces; _i < _a.length; _i++) {
            var face = _a[_i];
            for (var _b = 0, _c = face.vertexIndices; _b < _c.length; _b++) {
                var vertexIndex = _c[_b];
                if (vertexIndex < 0 || vertexIndex >= model.vertices.length) {
                    errors.push("\u9876\u70B9\u7D22\u5F15\u8D8A\u754C: " + vertexIndex + " (\u6700\u5927: " + (model.vertices.length - 1) + ")");
                }
            }
            if (face.textureIndices) {
                for (var _d = 0, _e = face.textureIndices; _d < _e.length; _d++) {
                    var texIndex = _e[_d];
                    if (texIndex < 0 || texIndex >= model.textureCoords.length) {
                        errors.push("\u7EB9\u7406\u5750\u6807\u7D22\u5F15\u8D8A\u754C: " + texIndex + " (\u6700\u5927: " + (model.textureCoords.length - 1) + ")");
                    }
                }
            }
            if (face.normalIndices) {
                for (var _f = 0, _g = face.normalIndices; _f < _g.length; _f++) {
                    var normalIndex = _g[_f];
                    if (normalIndex < 0 || normalIndex >= model.vertexNormals.length) {
                        errors.push("\u6CD5\u7EBF\u7D22\u5F15\u8D8A\u754C: " + normalIndex + " (\u6700\u5927: " + (model.vertexNormals.length - 1) + ")");
                    }
                }
            }
        }
        return errors.length > 0
            ? "\u53D1\u73B0 " + errors.length + " \u4E2A\u9519\u8BEF:\n" + errors.join('\n')
            : '模型数据验证通过';
    };
    return OBJParser;
}());
exports.OBJParser = OBJParser;
},{"../Math/Vector2":5,"../Math/Vector3":6}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Color_1 = require("./Color");
var Input_1 = require("./Input");
var Quaternion_1 = require("./Math/Quaternion");
var Vector3_1 = require("./Math/Vector3");
var Renderer_1 = require("./Renderer");
var AssetLoader_1 = require("./Utils/AssetLoader");
// 画布尺寸
var canvasWidth = 400;
var canvasHeight = 600;
// 对象列表
var instances = [];
// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取canvas元素和2D渲染上下文
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // 设置canvas尺寸
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // 创建图像数据对象
    var imageData = ctx.createImageData(canvasWidth, canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    var uint32View = new Uint32Array(imageData.data.buffer);
    // 创建渲染器实例
    var renderer = new Renderer_1.Renderer(uint32View, canvasWidth, canvasHeight);
    Init();
    // 渲染函数
    function mainLoop() {
        // 处理逻辑
        Update();
        // 渲染
        Render(renderer);
        // 将图像数据绘制到canvas上
        ctx.putImageData(imageData, 0, 0);
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});
// 获取鼠标事件
document.addEventListener('mousemove', function (event) {
    // 获取鼠标相对于canvas的坐标
    var rect = event.target.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    Input_1.Input.mouseX = mouseX;
    Input_1.Input.mouseY = mouseY;
});
function Init() {
    var lee;
    // 加载模型
    AssetLoader_1.AssetLoader.loadInstanceFromModel('lee', 'resources/assets/meshes/lee.obj').then(function (instance) {
        lee = instance;
        instance.transform.position = new Vector3_1.Vector3(0, 0, 2);
        instances.push(instance);
    });
    AssetLoader_1.AssetLoader.loadInstanceFromModel('cube', 'resources/cube.obj').then(function (instance) {
        instance.transform.position = new Vector3_1.Vector3(0, 0, 5);
        instance.transform.setParent(lee.transform);
        instances.push(instance);
    });
}
function Update() {
    for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
        var instance = instances_1[_i];
        if (instance.name == "cube") {
            continue;
        }
        // 让物体在所有轴上旋转
        var eulerAngles = instance.transform.rotation.eulerAngles;
        eulerAngles.x += 0.01;
        eulerAngles.y += 0.02;
        eulerAngles.z += 0.015;
        instance.transform.rotation = new Quaternion_1.Quaternion(eulerAngles);
        // 使用sin函数实现缩放在0.9到1.1之间循环
        var scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 1;
        instance.transform.scale.x = scaleOffset;
        instance.transform.scale.y = scaleOffset;
        instance.transform.scale.z = scaleOffset;
    }
}
function Render(renderer) {
    renderer.Clear(Color_1.Color.BLACK);
    for (var _i = 0, instances_2 = instances; _i < instances_2.length; _i++) {
        var instance = instances_2[_i];
        renderer.DrawObject(instance);
    }
    // 画三角形
    // renderer.DrawTriangleFilledWithVertexColor(0, 0, 100, 100, Input.mouseX, Input.mouseY, Color.RED, Color.GREEN, Color.BLUE);
}
},{"./Color":1,"./Input":2,"./Math/Quaternion":4,"./Math/Vector3":6,"./Renderer":9,"./Utils/AssetLoader":10}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTWF0aC9NYXRyaXg0eDQudHMiLCJzcmMvTWF0aC9RdWF0ZXJuaW9uLnRzIiwic3JjL01hdGgvVmVjdG9yMi50cyIsInNyYy9NYXRoL1ZlY3RvcjMudHMiLCJzcmMvTWF0aC9WZWN0b3I0LnRzIiwic3JjL01vZGVsLnRzIiwic3JjL1JlbmRlcmVyLnRzIiwic3JjL1V0aWxzL0Fzc2V0TG9hZGVyLnRzIiwic3JjL1V0aWxzL0RpY3Rpb25hcnkudHMiLCJzcmMvVXRpbHMvT2JqUGFyc2VyLnRzIiwic3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7SUFrQkksZUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFlO1FBQWYsa0JBQUEsRUFBQSxPQUFlO1FBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVNLHdCQUFRLEdBQWY7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDbkMsT0FBTyxJQUFJLEtBQUssQ0FDWixNQUFNLEdBQUcsSUFBSSxFQUNiLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFDcEIsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUNyQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQ3hCLENBQUM7SUFDTixDQUFDO0lBbkNzQixXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QyxXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxVQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxTQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QyxVQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN2QyxZQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxVQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QyxhQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QyxZQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxZQUFN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QUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxnQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUU3QixnREFBZ0Q7SUFDaEQsZ0dBQWdHO0lBQ2hHLGdEQUFnRDtJQUVoRCxtRkFBbUY7SUFDbkYsSUFBSTtJQUVHLDZCQUFTLEdBQWhCO1FBQ0ksc0JBQXNCO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7UUFDN0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsMkJBQTJCO1lBQ3ZDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNKO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFDSSxpRUFBaUU7UUFDakUsZ0NBQWdDO1FBQ2hDLGdEQUFnRDtRQUNoRCxZQUFZO1FBRVosSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FB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QUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLGlCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVMsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMs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R0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM1RCxlQUFlO1NBQ2xCO1FBRUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMs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Q0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHFDQUEyQixHQUF6QyxVQUEwQyxDQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVosT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHNDQUE0QixHQUExQyxVQUEyQyxDQUFVLEVBQUUsS0FBcUI7UUFBckIs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QUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRWEsd0JBQWMsR0FBNUIsVUFBNkIsQ0FBVTtRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMs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LE1BQU0sQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLCtCQUFZLEdBQW5CLFVBQW9CLE1BQWUsRUFBRSxTQUFvQjtRQUNyRCxJQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUVuRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxTQUFTO1FBQ1QsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDNUMsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDNUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLFNBQVM7UUFDVCxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxJQUFNLEVBQUUsR0FB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QU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0QsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6QyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUM7S0FDNUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsUUFBa0I7SUFDOUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFNUIsS0FBdUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTLEVBQUU7UUFBN0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2YsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNqQztJQUVELE9BQU87SUFDUCw4SEFBOEg7QUFDbEksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdISVRFID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMQUNLID0gbmV3IENvbG9yKDAsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSQVkgPSBuZXcgQ29sb3IoMTI4LCAxMjgsIDEyOCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVEID0gbmV3IENvbG9yKDI1NSwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JFRU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTFVFID0gbmV3IENvbG9yKDAsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgWUVMTE9XID0gbmV3IENvbG9yKDI1NSwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDWUFOID0gbmV3IENvbG9yKDAsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQUdFTlRBID0gbmV3IENvbG9yKDI1NSwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBPUkFOR0UgPSBuZXcgQ29sb3IoMjU1LCAxNjUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBVUlBMRSA9IG5ldyBDb2xvcigxMjgsIDAsIDEyOCkuVG9VaW50MzIoKTtcclxuXHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlciA9IDI1NSkge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRvVWludDMyKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5hIDw8IDI0KSB8ICh0aGlzLmIgPDwgMTYpIHwgKHRoaXMuZyA8PCA4KSB8IHRoaXMucjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZyb21VaW50MzIodWludDMyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICB1aW50MzIgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDgpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAxNikgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDI0KSAmIDB4RkZcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIElucHV0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VYOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVk6IG51bWJlciA9IDA7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeDR4NCB7XHJcblxyXG4gICAgcHVibGljIG1hdHJpeDogQXJyYXk8QXJyYXk8bnVtYmVyPj4gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4oKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb2x1bW4wOiBWZWN0b3I0LCBjb2x1bW4xOiBWZWN0b3I0LCBjb2x1bW4yOiBWZWN0b3I0LCBjb2x1bW4zOiBWZWN0b3I0KTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGFyZ3VtZW50c1tpXSBhcyBWZWN0b3I0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPih2LngsIHYueSwgdi56LCB2LncpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPigwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGV4IOihjFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Um93KGluZGV4OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgYyA9IHRoaXMubWF0cml4W2luZGV4XTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoY1swXSwgY1sxXSwgY1syXSwgY1szXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDliJdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbHVtbihpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMubWF0cml4WzBdW2luZGV4XSwgdGhpcy5tYXRyaXhbMV1baW5kZXhdLCB0aGlzLm1hdHJpeFsyXVtpbmRleF0sIHRoaXMubWF0cml4WzNdW2luZGV4XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldFJvdyhpbmRleDogbnVtYmVyLCByb3c6IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMF0gPSByb3cueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMV0gPSByb3cueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMl0gPSByb3cuejtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bM10gPSByb3cudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0Q29sdW1uKGluZGV4OiBudW1iZXIsIGNvbHVtbjogVmVjdG9yNCkge1xyXG4gICAgICAgIHRoaXMubWF0cml4WzBdW2luZGV4XSA9IGNvbHVtbi54O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzFdW2luZGV4XSA9IGNvbHVtbi55O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzJdW2luZGV4XSA9IGNvbHVtbi56O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzNdW2luZGV4XSA9IGNvbHVtbi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShtOiBNYXRyaXg0eDQpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBsaHMgPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgcmhzID0gbS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1hdHJpeFswXVswXSA9IGxoc1swXVswXSAqIHJoc1swXVswXSArIGxoc1swXVsxXSAqIHJoc1sxXVswXSArIGxoc1swXVsyXSAqIHJoc1syXVswXSArIGxoc1swXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMF1bMV0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMF1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzBdWzJdID0gbGhzWzBdWzBdICogcmhzWzBdWzJdICsgbGhzWzBdWzFdICogcmhzWzFdWzJdICsgbGhzWzBdWzJdICogcmhzWzJdWzJdICsgbGhzWzBdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFswXVszXSA9IGxoc1swXVswXSAqIHJoc1swXVszXSArIGxoc1swXVsxXSAqIHJoc1sxXVszXSArIGxoc1swXVsyXSAqIHJoc1syXVszXSArIGxoc1swXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbMV1bMF0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMV1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzFdWzFdID0gbGhzWzFdWzBdICogcmhzWzBdWzFdICsgbGhzWzFdWzFdICogcmhzWzFdWzFdICsgbGhzWzFdWzJdICogcmhzWzJdWzFdICsgbGhzWzFdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsyXSA9IGxoc1sxXVswXSAqIHJoc1swXVsyXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsyXSArIGxoc1sxXVsyXSAqIHJoc1syXVsyXSArIGxoc1sxXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMV1bM10gPSBsaHNbMV1bMF0gKiByaHNbMF1bM10gKyBsaHNbMV1bMV0gKiByaHNbMV1bM10gKyBsaHNbMV1bMl0gKiByaHNbMl1bM10gKyBsaHNbMV1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzJdWzBdID0gbGhzWzJdWzBdICogcmhzWzBdWzBdICsgbGhzWzJdWzFdICogcmhzWzFdWzBdICsgbGhzWzJdWzJdICogcmhzWzJdWzBdICsgbGhzWzJdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsyXVsxXSA9IGxoc1syXVswXSAqIHJoc1swXVsxXSArIGxoc1syXVsxXSAqIHJoc1sxXVsxXSArIGxoc1syXVsyXSAqIHJoc1syXVsxXSArIGxoc1syXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMl1bMl0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMl1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzJdWzNdID0gbGhzWzJdWzBdICogcmhzWzBdWzNdICsgbGhzWzJdWzFdICogcmhzWzFdWzNdICsgbGhzWzJdWzJdICogcmhzWzJdWzNdICsgbGhzWzJdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFszXVswXSA9IGxoc1szXVswXSAqIHJoc1swXVswXSArIGxoc1szXVsxXSAqIHJoc1sxXVswXSArIGxoc1szXVsyXSAqIHJoc1syXVswXSArIGxoc1szXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbM11bMV0gPSBsaHNbM11bMF0gKiByaHNbMF1bMV0gKyBsaHNbM11bMV0gKiByaHNbMV1bMV0gKyBsaHNbM11bMl0gKiByaHNbMl1bMV0gKyBsaHNbM11bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzNdWzJdID0gbGhzWzNdWzBdICogcmhzWzBdWzJdICsgbGhzWzNdWzFdICogcmhzWzFdWzJdICsgbGhzWzNdWzJdICogcmhzWzJdWzJdICsgbGhzWzNdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFszXVszXSA9IGxoc1szXVswXSAqIHJoc1swXVszXSArIGxoc1szXVsxXSAqIHJoc1sxXVszXSArIGxoc1szXVsyXSAqIHJoc1syXVszXSArIGxoc1szXVszXSAqIHJoc1szXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yMyh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnkgPSBtWzFdWzBdICogdi54ICsgbVsxXVsxXSAqIHYueSArIG1bMV1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2Lno7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yNCh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2LnogKyBtWzBdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56ICsgbVsxXVszXSAqIHYudztcclxuICAgICAgICByZXMueiA9IG1bMl1bMF0gKiB2LnggKyBtWzJdWzFdICogdi55ICsgbVsyXVsyXSAqIHYueiArIG1bMl1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLncgPSBtWzNdWzBdICogdi54ICsgbVszXVsxXSAqIHYueSArIG1bM11bMl0gKiB2LnogKyBtWzNdWzNdICogdi53O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUcmFuc2xhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMobVswXVszXSwgbVsxXVszXSwgbVsyXVszXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFJvdGF0ZSgpOiBWZWN0b3IzIHtcclxuICAgIC8vICAgICBsZXQgbWF0ID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgLy8gICAgIGxldCB4ID0gTWF0aC5hdGFuMihtYXRbMV1bMl0sIG1hdFsyXVsyXSk7XHJcbiAgICAvLyAgICAgbGV0IHkgPSBNYXRoLmF0YW4yKC1tYXRbMF1bMl0sIE1hdGguc3FydChtYXRbMV1bMl0gKiBtYXRbMV1bMl0gKyBtYXRbMl1bMl0gKiBtYXRbMl1bMl0pKTtcclxuICAgIC8vICAgICBsZXQgeiA9IE1hdGguYXRhbjIobWF0WzBdWzFdLCBtYXRbMF1bMF0pO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gbmV3IFZlY3RvcjMoeCAvIE1hdGguUEkgKiAxODAsIHkgLyBNYXRoLlBJICogMTgwLCB6IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvL+S4gOWumuimgeiOt+WPlue6r+WHgOeahOaXi+i9rOefqemYte+8jOWNs+WOu+mZpOe8qeaUvuWAjeeOh1xyXG4gICAgICAgIGxldCBtYXQgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICBsZXQgcSA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIHZhciB0cmFjZSA9IG1hdFswXVswXSArIG1hdFsxXVsxXSArIG1hdFsyXVsyXTsgLy8gSSByZW1vdmVkICsgMS4wZjsgc2VlIGRpc2N1c3Npb24gd2l0aCBFdGhhblxyXG4gICAgICAgIHZhciBzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRyYWNlID4gMCkgey8vIEkgY2hhbmdlZCBNX0VQU0lMT04gdG8gMFxyXG4gICAgICAgICAgICBzID0gMC41IC8gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKTtcclxuICAgICAgICAgICAgcS53ID0gMC4yNSAvIHM7XHJcbiAgICAgICAgICAgIHEueCA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pICogcztcclxuICAgICAgICAgICAgcS55ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgKiBzO1xyXG4gICAgICAgICAgICBxLnogPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAqIHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hdFswXVswXSA+IG1hdFsxXVsxXSAmJiBtYXRbMF1bMF0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzBdWzBdIC0gbWF0WzFdWzFdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdFsxXVsxXSA+IG1hdFsyXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMV1bMV0gLSBtYXRbMF1bMF0gLSBtYXRbMl1bMl0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFsyXVsyXSAtIG1hdFswXVswXSAtIG1hdFsxXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAobWF0WzBdWzJdICsgbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAwLjI1ICogcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZU1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/lm6DkuLrml4vovaznn6npmLXmr5TovoPnibnmrorvvIzmnInml7blgJnopoHljZXni6zlpITnkIbvvIzmiYDmnInmi6XmnInkuIDkuKrmj5Dlj5bmlrnms5VcclxuICAgICAgICAvL+aPkOWPluaWueW8j+W+iOeugOWNle+8jOWFiOiOt+WPlue8qeaUvuWAvO+8jOeEtuWQjuWIqeeUqOiOt+WPlue8qeaUvuWAvOeahOWOn+eQhu+8jOmAhuWQkemZpOWOu+e8qeaUvuWAvO+8jOWwseW+l+WIsOe6r+WHgOeahOaXi+i9rOefqemYtVxyXG4gICAgICAgIC8v5q2k5pa55rOV5LiN5pSv5oyB5Y+N5bCE55+p6Zi1XHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIHRlID0gbWF0Lm1hdHJpeDtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5nZXRTY2FsZSgpO1xyXG4gICAgICAgIHZhciBzY2FsZVggPSAxIC8gc2NhbGUueDtcclxuICAgICAgICB2YXIgc2NhbGVZID0gMSAvIHNjYWxlLnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWiA9IDEgLyBzY2FsZS56O1xyXG5cclxuICAgICAgICB0ZVswXVswXSA9IG1lWzBdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzFdWzBdID0gbWVbMV1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbMl1bMF0gPSBtZVsyXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVszXVswXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzFdID0gbWVbMF1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMV1bMV0gPSBtZVsxXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVsyXVsxXSA9IG1lWzJdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzNdWzFdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bMl0gPSBtZVswXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsxXVsyXSA9IG1lWzFdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzJdWzJdID0gbWVbMl1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbM11bMl0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVszXSA9IDA7XHJcbiAgICAgICAgdGVbMV1bM10gPSAwO1xyXG4gICAgICAgIHRlWzJdWzNdID0gMDtcclxuICAgICAgICB0ZVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/ku47ml4vovaznn6npmLXph4zojrflj5bmrKfmi4nop5JcclxuICAgICAgICAvL+W/hemhu+aYr+e6r+WHgOeahOaXi+i9rOefqemYtVxyXG5cclxuICAgICAgICB2YXIgYW5nbGUgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2YXIgdGUgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICB2YXIgbTExID0gdGVbMF1bMF0sIG0xMiA9IHRlWzBdWzFdLCBtMTMgPSB0ZVswXVsyXTtcclxuICAgICAgICB2YXIgbTIxID0gdGVbMV1bMF0sIG0yMiA9IHRlWzFdWzFdLCBtMjMgPSB0ZVsxXVsyXTtcclxuICAgICAgICB2YXIgbTMxID0gdGVbMl1bMF0sIG0zMiA9IHRlWzJdWzFdLCBtMzMgPSB0ZVsyXVsyXTtcclxuXHJcbiAgICAgICAgbTEzID0gbTEzID4gMSA/IDEgOiBtMTM7XHJcbiAgICAgICAgbTEzID0gbTEzIDwgLTEgPyAtMSA6IG0xMztcclxuICAgICAgICBhbmdsZS55ID0gTWF0aC5hc2luKG0xMyk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyhtMTMpIDwgMC45OTk5OTk5KSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKC1tMjMsIG0zMyk7XHJcbiAgICAgICAgICAgIGFuZ2xlLnogPSBNYXRoLmF0YW4yKC1tMTIsIG0xMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5nbGUueCA9IE1hdGguYXRhbjIobTMyLCBtMjIpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhhbmdsZS54IC8gTWF0aC5QSSAqIDE4MCwgYW5nbGUueSAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnogLyBNYXRoLlBJICogMTgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgdiA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHYueCA9IE1hdGguc3FydChtWzBdWzBdICogbVswXVswXSArIG1bMV1bMF0gKiBtWzFdWzBdICsgbVsyXVswXSAqIG1bMl1bMF0pO1xyXG4gICAgICAgIHYueSA9IE1hdGguc3FydChtWzBdWzFdICogbVswXVsxXSArIG1bMV1bMV0gKiBtWzFdWzFdICsgbVsyXVsxXSAqIG1bMl1bMV0pO1xyXG4gICAgICAgIHYueiA9IE1hdGguc3FydChtWzBdWzJdICogbVswXVsyXSArIG1bMV1bMl0gKiBtWzFdWzJdICsgbVsyXVsyXSAqIG1bMl1bMl0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNwb3NlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0xID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0yID0gbmV3IE1hdHJpeDR4NCgpLm1hdHJpeDtcclxuXHJcbiAgICAgICAgbTJbMF1bMF0gPSBtMVswXVswXTsgbTJbMF1bMV0gPSBtMVsxXVswXTsgbTJbMF1bMl0gPSBtMVsyXVswXTsgbTJbMF1bM10gPSBtMVszXVswXTtcclxuICAgICAgICBtMlsxXVswXSA9IG0xWzBdWzFdOyBtMlsxXVsxXSA9IG0xWzFdWzFdOyBtMlsxXVsyXSA9IG0xWzJdWzFdOyBtMlsxXVszXSA9IG0xWzNdWzFdO1xyXG4gICAgICAgIG0yWzJdWzBdID0gbTFbMF1bMl07IG0yWzJdWzFdID0gbTFbMV1bMl07IG0yWzJdWzJdID0gbTFbMl1bMl07IG0yWzJdWzNdID0gbTFbM11bMl07XHJcbiAgICAgICAgbTJbM11bMF0gPSBtMVswXVszXTsgbTJbM11bMV0gPSBtMVsxXVszXTsgbTJbM11bMl0gPSBtMVsyXVszXTsgbTJbM11bM10gPSBtMVszXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtMjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlKHBvczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlKHE6IFF1YXRlcm5pb24pOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKGV1bGVyQW5nbGVzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyByb3RhdGUoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyByb3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IG0gPSBuZXcgTWF0cml4NHg0KCk7XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBRdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZShzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzKTtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb29rQXQodGFyZ2V0OiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvLyB0b2RvXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy/ovazmjaLliLDmkYTlvbHmnLrnnIvlkJHnmoTnn6npmLXph4xcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1Ub0xvb2tBdFNwYWNlKGV5ZTogVmVjdG9yMywgdGFyZ2V0UG9pbnQ6IFZlY3RvcjMsIHVwOiBWZWN0b3IzID0gVmVjdG9yMy5VUCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/ku47lk6rph4znnIvlkJHlk6rph4zvvIzkuZ/lj6/ku6XnkIbop6PkuLrmkYTlvbHmnLrop4bop5LvvIzljbPop4Llr5/nqbrpl7RcclxuICAgICAgICAvL+iLpeimgeWPmOaNouWIsOaRhOW9seacuuepuumXtO+8jOWPr+S7peWBh+iuvuaVtOS4quinguWvn+epuumXtOS7peaRhOW9seacuuS9jeS6juS4lueVjOWdkOagh+WOn+eCue+8jOeEtuWQjuWwhuaJgOacieeJqeS9k+acneaRhOW9seacuuWOn+WFiOWcqOS4lueVjOepuumXtOS4reeahOS9jee9ruWPjeWQkeenu+WKqOWNs+WPr1xyXG4gICAgICAgIC8v5Zyo57q45LiK55S75LiL5Zu+5bCx5riF5pmw5LqGXHJcblxyXG4gICAgICAgIC8v55Sx5LqO6buY6K6k55+p6Zi15pivU1JU6aG65bqP57uE5oiQ55qE5Y+Y5o2i56m66Ze077yM6KaB6YCG5ZCR77yM5YiZ5pivVFJT55qE6aG65bqP77yM5Y2z5YWI56e75Yqo5ZCO5peL6L2sXHJcbiAgICAgICAgLy8xLuWQkeWPjeaWueWQkeW5s+enu1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IzKC1leWUueCwgLWV5ZS55LCAtZXllLnopKTtcclxuXHJcbiAgICAgICAgLy8yLuWQkeWPjeaWueWQkeaXi+i9rFxyXG4gICAgICAgIC8v5YWI6I635Y+W5pGE5b2x5LiW55WM6YOo5Z2Q5qCH6L20XHJcbiAgICAgICAgdmFyIHpBeGlzID0gVmVjdG9yMy5kaWZmZXJlbmNlKGV5ZSwgdGFyZ2V0UG9pbnQpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8v5Zug5Li65oiR5Lus5piv5Y+z5omL57O757uf77yM6KaB5rGCWO+8jOWImeW/hemhu3rkuZh5XHJcbiAgICAgICAgdmFyIHhBeGlzID0gVmVjdG9yMy5jcm9zcyh1cCwgekF4aXMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHZhciB5QXhpcyA9IFZlY3RvcjMuY3Jvc3MoekF4aXMsIHhBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+aehOW7uuaRhOW9seacuuWPjeaWueWQkeaXi+i9rOefqemYtVxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh4QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHlBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoekF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJ1c3R1bShsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgcmwgPSAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGNvbnN0IHRiID0gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBjb25zdCBmbiA9IChmYXIgLSBuZWFyKVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoKG5lYXIgKiAyKSAvIHJsLCAwLCAocmlnaHQgKyBsZWZ0KSAvIHJsLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgKG5lYXIgKiAyKSAvIHRiLCAodG9wICsgYm90dG9tKSAvIHRiLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLShmYXIgKyBuZWFyKSAvIGZuLCAtKGZhciAqIG5lYXIgKiAyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcnRob2dyYXBoaWMobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDIgLyBybCwgMCwgMCwgLShsZWZ0ICsgcmlnaHQpIC8gcmwpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAyIC8gdGIsIDAsIC0odG9wICsgYm90dG9tKSAvIHRiKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTIgLyBmbiwgLShmYXIgKyBuZWFyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcnNwZWN0aXZlKGZvdjogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgaGZvdiA9IGZvdiAvIDE4MCAqIE1hdGguUEkgLyAyO1xyXG4gICAgICAgIGNvbnN0IHRhbiA9IE1hdGgudGFuKGhmb3YpO1xyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMSAvIChhc3BlY3QgKiB0YW4pLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMSAvIHRhbiwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyAoZmFyIC0gbmVhciksIC0oMiAqIGZhciAqIG5lYXIpIC8gKGZhciAtIG5lYXIpKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnZlcnNlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICBjb25zdCBhMDAgPSBtYXRbMF1bMF07XHJcbiAgICAgICAgY29uc3QgYTAxID0gbWF0WzBdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEwMiA9IG1hdFswXVsyXTtcclxuICAgICAgICBjb25zdCBhMDMgPSBtYXRbMF1bM107XHJcbiAgICAgICAgY29uc3QgYTEwID0gbWF0WzFdWzBdO1xyXG4gICAgICAgIGNvbnN0IGExMSA9IG1hdFsxXVsxXTtcclxuICAgICAgICBjb25zdCBhMTIgPSBtYXRbMV1bMl07XHJcbiAgICAgICAgY29uc3QgYTEzID0gbWF0WzFdWzNdO1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IG1hdFsyXVswXTtcclxuICAgICAgICBjb25zdCBhMjEgPSBtYXRbMl1bMV07XHJcbiAgICAgICAgY29uc3QgYTIyID0gbWF0WzJdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEyMyA9IG1hdFsyXVszXTtcclxuICAgICAgICBjb25zdCBhMzAgPSBtYXRbM11bMF07XHJcbiAgICAgICAgY29uc3QgYTMxID0gbWF0WzNdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEzMiA9IG1hdFszXVsyXTtcclxuICAgICAgICBjb25zdCBhMzMgPSBtYXRbM11bM107XHJcblxyXG4gICAgICAgIGNvbnN0IGRldDAwID0gYTAwICogYTExIC0gYTAxICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAzID0gYTAxICogYTEyIC0gYTAyICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTFcclxuICAgICAgICBjb25zdCBkZXQwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMlxyXG4gICAgICAgIGNvbnN0IGRldDA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzFcclxuICAgICAgICBjb25zdCBkZXQxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMlxyXG5cclxuICAgICAgICBsZXQgZGV0ID0gKGRldDAwICogZGV0MTEgLSBkZXQwMSAqIGRldDEwICsgZGV0MDIgKiBkZXQwOSArIGRldDAzICogZGV0MDggLSBkZXQwNCAqIGRldDA3ICsgZGV0MDUgKiBkZXQwNik7XHJcblxyXG4gICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNYXRyaXg0eDQgaW52ZXJzZSBmYWlsZWQsIGRldGVybWluYW50IGlzIDBcIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG5cclxuICAgICAgICBtYXRbMF1bMF0gPSAoYTExICogZGV0MTEgLSBhMTIgKiBkZXQxMCArIGExMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsxXSA9ICgtYTAxICogZGV0MTEgKyBhMDIgKiBkZXQxMCAtIGEwMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsyXSA9IChhMzEgKiBkZXQwNSAtIGEzMiAqIGRldDA0ICsgYTMzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzNdID0gKC1hMjEgKiBkZXQwNSArIGEyMiAqIGRldDA0IC0gYTIzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzBdID0gKC1hMTAgKiBkZXQxMSArIGExMiAqIGRldDA4IC0gYTEzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzFdID0gKGEwMCAqIGRldDExIC0gYTAyICogZGV0MDggKyBhMDMgKiBkZXQwNykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMl0gPSAoLWEzMCAqIGRldDA1ICsgYTMyICogZGV0MDIgLSBhMzMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMV1bM10gPSAoYTIwICogZGV0MDUgLSBhMjIgKiBkZXQwMiArIGEyMyAqIGRldDAxKSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVswXSA9IChhMTAgKiBkZXQxMCAtIGExMSAqIGRldDA4ICsgYTEzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzFdID0gKC1hMDAgKiBkZXQxMCArIGEwMSAqIGRldDA4IC0gYTAzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzJdID0gKGEzMCAqIGRldDA0IC0gYTMxICogZGV0MDIgKyBhMzMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bM10gPSAoLWEyMCAqIGRldDA0ICsgYTIxICogZGV0MDIgLSBhMjMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bMF0gPSAoLWExMCAqIGRldDA5ICsgYTExICogZGV0MDcgLSBhMTIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMV0gPSAoYTAwICogZGV0MDkgLSBhMDEgKiBkZXQwNyArIGEwMiAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFszXVsyXSA9ICgtYTMwICogZGV0MDMgKyBhMzEgKiBkZXQwMSAtIGEzMiAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFszXVszXSA9IChhMjAgKiBkZXQwMyAtIGEyMSAqIGRldDAxICsgYTIyICogZGV0MDApICogZGV0XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0Zsb2F0MzJMaXN0KCk6IEZsb2F0MzJMaXN0IHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIC8v55Sx5LqOT3BlbkdM5piv5YiX5bqP5a2Y5YKo77yM5omA5Lul6ZyA6KaB6L2s572u5LiA5LiL55+p6Zi1XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICBtWzBdWzBdLCBtWzFdWzBdLCBtWzJdWzBdLCBtWzNdWzBdLFxyXG4gICAgICAgICAgICBtWzBdWzFdLCBtWzFdWzFdLCBtWzJdWzFdLCBtWzNdWzFdLFxyXG4gICAgICAgICAgICBtWzBdWzJdLCBtWzFdWzJdLCBtWzJdWzJdLCBtWzNdWzJdLFxyXG4gICAgICAgICAgICBtWzBdWzNdLCBtWzFdWzNdLCBtWzJdWzNdLCBtWzNdWzNdXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvcHkoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMCksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDEpLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygyKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMyksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VFJTTWF0cml4KHBvczogVmVjdG9yMywgcXVhdDogUXVhdGVybmlvbiwgc2NhbGU6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCB0bSA9IE1hdHJpeDR4NC5nZXRUcmFuc2xhdGVNYXRyaXgocG9zKTtcclxuICAgICAgICBsZXQgcm0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHF1YXQpO1xyXG4gICAgICAgIGxldCBzbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzY2FsZSk7XHJcblxyXG4gICAgICAgIC8v5b+F6aG75Lil5qC85oyJ54Wn5YWIU2NhbGXvvIzlho1Sb3RhdGXvvIzlho1UcmFuc2xhdGXnmoTpobrluo/vvIzlkKbliJnlvpfliLDnmoTnu5Pmnpzogq/lrprmmK/kuI3mu6HmhI/nmoRcclxuICAgICAgICAvL+S+i+WmguacieS4gOS4qjFYMeato+aWueW9ouWcqOWOn+eCue+8jOaIkeS7rOaDs+imgeW+l+WIsOS4gOS4qjFYMu+8jOW5tuS4lOaWnOWQkTQ1wrDvvIzogIzkuJTnprvlnZDmoIfljp/ngrkx5Liq5Y2V5L2N5aSEXHJcbiAgICAgICAgLy/lpoLmnpzlhYjml4vovazvvIzlho3nvKnmlL7nmoTor53vvIzml4vovazmlrnlkJHmmK/lr7nkuobvvIzkvYbmmK/miJHku6zmmK/lsIbml4vovazlkI40NcKw55qE5q2j5pa55b2i55qEWei9tOaLieS8uDLlgI3vvIzlvpfliLDnmoTmmK/kuIDkuKrooqvmi4nplb/nmoToj7HlvaJcclxuICAgICAgICAvL+WmguaenOWFiOW5s+enu++8jOWGjeaXi+i9rOeahOivne+8jOWboOS4uuaIkeS7rOaXi+i9rOmDveaYr+e7leedgOWdkOagh+WOn+eCueeahO+8jOe7k+aenOiHqueEtuaYr+ato+aWueW9ouS4jeaYr+iHqui6q+aXi+i9rDQ1wrDvvIzogIzmmK/nu5XnnYDljp/ngrnml4vovaxcclxuICAgICAgICByZXR1cm4gdG0ubXVsdGlwbHkocm0ubXVsdGlwbHkoc20pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRyYW5zbGF0ZU1hdHJpeChwb3M6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMTsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gcG9zLng7XHJcbiAgICAgICAgbVsxXVswXSA9IDA7IG1bMV1bMV0gPSAxOyBtWzFdWzJdID0gMDsgbVsxXVszXSA9IHBvcy55O1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IDE7IG1bMl1bM10gPSBwb3MuejtcclxuICAgICAgICBtWzNdWzBdID0gMDsgbVszXVsxXSA9IDA7IG1bM11bMl0gPSAwOyBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxOiBRdWF0ZXJuaW9uKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbGV0IG51bSA9IHEueCAqIDI7XHJcbiAgICAgICAgbGV0IG51bTIgPSBxLnkgKiAyO1xyXG4gICAgICAgIGxldCBudW0zID0gcS56ICogMjtcclxuICAgICAgICBsZXQgbnVtNCA9IHEueCAqIG51bTtcclxuICAgICAgICBsZXQgbnVtNSA9IHEueSAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTYgPSBxLnogKiBudW0zO1xyXG4gICAgICAgIGxldCBudW03ID0gcS54ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtOCA9IHEueCAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTkgPSBxLnkgKiBudW0zO1xyXG4gICAgICAgIGxldCBudW0xMCA9IHEudyAqIG51bTtcclxuICAgICAgICBsZXQgbnVtMTEgPSBxLncgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW0xMiA9IHEudyAqIG51bTM7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSAxIC0gKG51bTUgKyBudW02KTtcclxuICAgICAgICBtWzFdWzBdID0gbnVtNyArIG51bTEyO1xyXG4gICAgICAgIG1bMl1bMF0gPSBudW04IC0gbnVtMTE7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IG51bTcgLSBudW0xMjtcclxuICAgICAgICBtWzFdWzFdID0gMSAtIChudW00ICsgbnVtNik7XHJcbiAgICAgICAgbVsyXVsxXSA9IG51bTkgKyBudW0xMDtcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0gbnVtOCArIG51bTExO1xyXG4gICAgICAgIG1bMV1bMl0gPSBudW05IC0gbnVtMTA7XHJcbiAgICAgICAgbVsyXVsyXSA9IDEgLSAobnVtNCArIG51bTUpO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhlOiBWZWN0b3IzLCBvcmRlcjogc3RyaW5nID0gXCJYWVpcIik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/pgJrov4fmrKfmi4nop5Lojrflj5bml4vovaznn6npmLVcclxuICAgICAgICAvL+WFiOWIhuWIq+iOt+WPllhZWui9tOS4iueahOaXi+i9rOefqemYte+8jOeEtuWQjuWQiOW5tui1t+adpVxyXG4gICAgICAgIC8v5rOo5oSP77ya5peL6L2s6L2055qE6aG65bqP5YWI5ZCO5LiN5ZCM77yM5Lya5Ye6546w5LiN5ZCM55qE57uT5p6c77yM5Zug5q2k5b+F6aG76KaB5oyH5a6a5peL6L2s6aG65bqPXHJcbiAgICAgICAgLy9odHRwOi8vcGxhbm5pbmcuY3MudWl1Yy5lZHUvbm9kZTEwMi5odG1sXHJcbiAgICAgICAgLy9odHRwczovL3RocmVlanMub3JnL2RvY3MvI2FwaS9lbi9tYXRoL0V1bGVyLm9yZGVyXHJcbiAgICAgICAgdmFyIHggPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueCwgVmVjdG9yMy5SSUdIVCk7XHJcbiAgICAgICAgdmFyIHkgPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueSwgVmVjdG9yMy5VUCk7XHJcbiAgICAgICAgdmFyIHogPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueiwgVmVjdG9yMy5GT1JXQVJEKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChvcmRlcikge1xyXG4gICAgICAgICAgICBjYXNlIFwiWFlaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh5Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICAgICAgY2FzZSBcIlhaWVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkubXVsdGlwbHkoei5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJZWFpcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHgubXVsdGlwbHkoeSkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVpYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh6Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIlpYWVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkubXVsdGlwbHkoeC5tdWx0aXBseSh6KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWVhcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB4Lm11bHRpcGx5KHkubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJvdGF0aW9uIG9yZGVyIGVycm9yLCBtdXN0IGJlIHNpbWlsYXIgdG8gJ1hZWidcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh5Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeUF4aXMoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG91dCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICB2YXIgbSA9IG91dC5tYXRyaXg7XHJcbiAgICAgICAgdmFyIHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XHJcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgICAgIHZhciBzID0gMCwgYyA9IDAsIHQgPSAwO1xyXG5cclxuICAgICAgICBhbmdsZSA9IE1hdGguUEkgKiBhbmdsZSAvIDE4MDtcclxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xyXG4gICAgICAgIHggKj0gbGVuO1xyXG4gICAgICAgIHkgKj0gbGVuO1xyXG4gICAgICAgIHogKj0gbGVuO1xyXG4gICAgICAgIHMgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICB0ID0gMSAtIGM7XHJcbiAgICAgICAgbVswXVswXSA9IHggKiB4ICogdCArIGM7XHJcbiAgICAgICAgbVsxXVswXSA9IHkgKiB4ICogdCArIHogKiBzO1xyXG4gICAgICAgIG1bMl1bMF0gPSB6ICogeCAqIHQgLSB5ICogcztcclxuICAgICAgICBtWzNdWzBdID0gMDtcclxuICAgICAgICBtWzBdWzFdID0geCAqIHkgKiB0IC0geiAqIHM7XHJcbiAgICAgICAgbVsxXVsxXSA9IHkgKiB5ICogdCArIGM7XHJcbiAgICAgICAgbVsyXVsxXSA9IHogKiB5ICogdCArIHggKiBzO1xyXG4gICAgICAgIG1bM11bMV0gPSAwO1xyXG4gICAgICAgIG1bMF1bMl0gPSB4ICogeiAqIHQgKyB5ICogcztcclxuICAgICAgICBtWzFdWzJdID0geSAqIHogKiB0IC0geCAqIHM7XHJcbiAgICAgICAgbVsyXVsyXSA9IHogKiB6ICogdCArIGM7XHJcbiAgICAgICAgbVszXVsyXSA9IDA7XHJcbiAgICAgICAgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNjYWxlTWF0cml4KHM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gcy54OyBtWzBdWzFdID0gMDsgbVswXVsyXSA9IDA7IG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gcy55OyBtWzFdWzJdID0gMDsgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVswXSA9IDA7IG1bMl1bMV0gPSAwOyBtWzJdWzJdID0gcy56OyBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzBdID0gMDsgbVszXVsxXSA9IDA7IG1bM11bMl0gPSAwOyBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpZGVudGl0eSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIG0ubWF0cml4WzBdWzBdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFsxXVsxXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMl1bMl0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzNdWzNdID0gMTtcclxuICAgICAgICByZXR1cm4gbTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IE1hdHJpeDR4NCB9IGZyb20gXCIuL01hdHJpeDR4NFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1YXRlcm5pb24ge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGV1bGVyOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlQXJvdW5kKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXVsZXJBbmdsZXMgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xyXG4gICAgICAgICAgICB0aGlzLncgPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHRoaXMpLmdldEV1bGVyQW5nbGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBldWxlckFuZ2xlcyhlOiBWZWN0b3IzKSB7XHJcbiAgICAgICAgdmFyIHEgPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhlKS5nZXRSb3RhdGUoKTtcclxuICAgICAgICB0aGlzLncgPSBxLnc7XHJcbiAgICAgICAgdGhpcy54ID0gcS54O1xyXG4gICAgICAgIHRoaXMueSA9IHEueTtcclxuICAgICAgICB0aGlzLnogPSBxLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZUFyb3VuZChhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgbGV0IHEgPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhhbmdsZSwgYXhpcyk7XHJcbiAgICAgICAgdGhpcy54ID0gcS54O1xyXG4gICAgICAgIHRoaXMueSA9IHEueTtcclxuICAgICAgICB0aGlzLnogPSBxLno7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAemgg5ZCR6YeP5Zub5YWD5pWw5LmY5rOVXHJcbiAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybVF1YXQoYTogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6IGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tdHJhbnNmb3JtLVZlYzMtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIGxldCBxID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHF1YXQgKiB2ZWNcclxuICAgICAgICBjb25zdCBpeCA9IHEudyAqIGEueCArIHEueSAqIGEueiAtIHEueiAqIGEueTtcclxuICAgICAgICBjb25zdCBpeSA9IHEudyAqIGEueSArIHEueiAqIGEueCAtIHEueCAqIGEuejtcclxuICAgICAgICBjb25zdCBpeiA9IHEudyAqIGEueiArIHEueCAqIGEueSAtIHEueSAqIGEueDtcclxuICAgICAgICBjb25zdCBpdyA9IC1xLnggKiBhLnggLSBxLnkgKiBhLnkgLSBxLnogKiBhLno7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcclxuICAgICAgICBvdXQueCA9IGl4ICogcS53ICsgaXcgKiAtcS54ICsgaXkgKiAtcS56IC0gaXogKiAtcS55O1xyXG4gICAgICAgIG91dC55ID0gaXkgKiBxLncgKyBpdyAqIC1xLnkgKyBpeiAqIC1xLnggLSBpeCAqIC1xLno7XHJcbiAgICAgICAgb3V0LnogPSBpeiAqIHEudyArIGl3ICogLXEueiArIGl4ICogLXEueSAtIGl5ICogLXEueDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5KCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbih0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWbm+WFg+aVsOeQg+mdouaPkuWAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNsZXJwKGE6IFF1YXRlcm5pb24sIGI6IFF1YXRlcm5pb24sIHQ6IG51bWJlcik6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6XHJcbiAgICAgICAgLy8gICAgaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi1zbGVycC1pbXBsZW1lbnRhdGlvbnNcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIGxldCBzY2FsZTAgPSAwO1xyXG4gICAgICAgIGxldCBzY2FsZTEgPSAwO1xyXG5cclxuICAgICAgICAvLyBjYWxjIGNvc2luZVxyXG4gICAgICAgIGxldCBjb3NvbSA9IGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgICAgICAvLyBhZGp1c3Qgc2lnbnMgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAgICBpZiAoY29zb20gPCAwLjApIHtcclxuICAgICAgICAgICAgY29zb20gPSAtY29zb207XHJcbiAgICAgICAgICAgIGIueCA9IC1iLng7XHJcbiAgICAgICAgICAgIGIueSA9IC1iLnk7XHJcbiAgICAgICAgICAgIGIueiA9IC1iLno7XHJcbiAgICAgICAgICAgIGIudyA9IC1iLnc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBjb2VmZmljaWVudHNcclxuICAgICAgICBpZiAoKDEuMCAtIGNvc29tKSA+IDAuMDAwMDAxKSB7XHJcbiAgICAgICAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKVxyXG4gICAgICAgICAgICBjb25zdCBvbWVnYSA9IE1hdGguYWNvcyhjb3NvbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbm9tID0gTWF0aC5zaW4ob21lZ2EpO1xyXG4gICAgICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICAgICAgc2NhbGUxID0gTWF0aC5zaW4odCAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFwiZnJvbVwiIGFuZCBcInRvXCIgcXVhdGVybmlvbnMgYXJlIHZlcnkgY2xvc2VcclxuICAgICAgICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xyXG4gICAgICAgICAgICBzY2FsZTEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXHJcbiAgICAgICAgb3V0LnggPSBzY2FsZTAgKiBhLnggKyBzY2FsZTEgKiBiLng7XHJcbiAgICAgICAgb3V0LnkgPSBzY2FsZTAgKiBhLnkgKyBzY2FsZTEgKiBiLnk7XHJcbiAgICAgICAgb3V0LnogPSBzY2FsZTAgKiBhLnogKyBzY2FsZTEgKiBiLno7XHJcbiAgICAgICAgb3V0LncgPSBzY2FsZTAgKiBhLncgKyBzY2FsZTEgKiBiLnc7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QoYTogUXVhdGVybmlvbiwgYjogUXVhdGVybmlvbik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlQXhpcyhhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIGFuZ2xlID0gTWF0aC5QSSAqIGFuZ2xlIC8gMTgwO1xyXG4gICAgICAgIGFuZ2xlICo9IDAuNTtcclxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XHJcblxyXG4gICAgICAgIHJlcy54ID0gYXhpcy54ICogc2luO1xyXG4gICAgICAgIHJlcy55ID0gYXhpcy55ICogc2luO1xyXG4gICAgICAgIHJlcy56ID0gYXhpcy56ICogc2luO1xyXG4gICAgICAgIHJlcy53ID0gTWF0aC5jb3MoYW5nbGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlkZW50aXR5KCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbigwLCAwLCAwLCAxKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yMiB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGdldCB3aWR0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy54OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjQpXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3IyKTogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWN0b3IyO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3IyKTogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjI7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3IyLmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMi5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNvcHkoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMiwgdDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLngpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhWZWN0b3IyLmRvdCh2MSwgdjIpIC8gKHYxLm1hZ25pdHVkZSAqIHYyLm1hZ25pdHVkZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBSSUdIVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgTEVGVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFVQKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBET1dOKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMyk6IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgdGhpcy56ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICB0aGlzLnogLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICB0aGlzLnogKj0gdi56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IzLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY29weSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMywgdDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgdi56ID0gdjEueiArIHQgKiAodjIueiAtIHYxLnopO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHggPSB2MS55ICogdjIueiAtIHYxLnogKiB2Mi55O1xyXG4gICAgICAgIHZhciB5ID0gdjEueiAqIHYyLnggLSB2MS54ICogdjIuejtcclxuICAgICAgICB2YXIgeiA9IHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLng7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHgsIHksIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgdmFyIHogPSB2Mi56IC0gdjEuejtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaWZmZXJlbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBkZXN0ID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgZGVzdC54ID0gdjEueCAtIHYyLnhcclxuICAgICAgICBkZXN0LnkgPSB2MS55IC0gdjIueVxyXG4gICAgICAgIGRlc3QueiA9IHYxLnogLSB2Mi56XHJcblxyXG4gICAgICAgIHJldHVybiBkZXN0XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMy5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKC0xLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEZPUldBUkQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEJBQ0soKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIC0xKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yNCB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBnKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuICAgIHB1YmxpYyBnZXQgYigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy56OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGEoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudzsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmVjdG9yMygpOiBWZWN0b3IzIHsgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMpOyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHMubGVuZ3RoID09IDIgPyBhcmd1bWVudHNbMV0gOiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjdG9yNDtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgKz0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjQpOiBWZWN0b3I0O1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgLT0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHRoaXMudyAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgdGhpcy53IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjQpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICB0aGlzLncgKj0gdi53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjQuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY29weSgpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55ICYmIHYueiA9PSB0aGlzLnogJiYgdi53ID09IHRoaXMudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIiwgXCIgKyB0aGlzLncgKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQsIHQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjQoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICB2LncgPSB2MS53ICsgdCAqICh2Mi53IC0gdjEudyk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkgKyB2MS56ICogdjIueiArIHYxLncgKiB2Mi53KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3I0LmRvdCh2MSwgdjIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoMSwgMSwgMSwgMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRoL01hdHJpeDR4NFwiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBPQkpNb2RlbCB9IGZyb20gXCIuL1V0aWxzL09ialBhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbW9kZWw6IE9CSk1vZGVsO1xyXG4gICAgcHVibGljIHRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcclxuICAgIHB1YmxpYyByZWFkb25seSB0YWc6IHN0cmluZztcclxuICAgIHB1YmxpYyByZWFkb25seSBjaGlsZHJlbjogQXJyYXk8VHJhbnNmb3JtPjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnQ6IFRyYW5zZm9ybSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFBvczogVmVjdG9yMztcclxuICAgIHByaXZhdGUgX3RlbXBSb3Q6IFF1YXRlcm5pb247XHJcbiAgICBwcml2YXRlIF90ZW1wU2NhbGU6IFZlY3RvcjM7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFnOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnRhZyA9IHRhZztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gbmV3IEFycmF5PFRyYW5zZm9ybT4oKTtcclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3RlbXBQb3MgPSBWZWN0b3IzLlpFUk87XHJcbiAgICAgICAgdGhpcy5fdGVtcFJvdCA9IFF1YXRlcm5pb24uaWRlbnRpdHk7XHJcbiAgICAgICAgdGhpcy5fdGVtcFNjYWxlID0gVmVjdG9yMy5PTkU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzZWxmTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDR4NC5nZXRUUlNNYXRyaXgodGhpcy5fdGVtcFBvcywgdGhpcy5fdGVtcFJvdCwgdGhpcy5fdGVtcFNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGxvY2FsVG9Xb3JsZE1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBwID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LmxvY2FsVG9Xb3JsZE1hdHJpeCA6IE1hdHJpeDR4NC5pZGVudGl0eTtcclxuICAgICAgICByZXR1cm4gcC5tdWx0aXBseSh0aGlzLnNlbGZNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRUb0xvY2FsTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQud29ybGRUb0xvY2FsTWF0cml4IDogTWF0cml4NHg0LmlkZW50aXR5O1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGZNYXRyaXguaW52ZXJzZSgpLm11bHRpcGx5KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgeCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB4KHg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIHBvcy54ID0geDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgeSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB5KHk6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIHBvcy55ID0geTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgeigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB6KHo6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIHBvcy56ID0gejtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZm9yd2FyZCgpOiBWZWN0b3IzIHtcclxuICAgICAgICAvL+i/memHjOmcgOimgeazqOaEj++8jOWboOS4uuaVtOS4qumAu+i+keeUqOeahOaYr+WPs+aJi+ezu+e7n++8jOaJgOS7peWQkeWJjeeahOaWueWQke+8iOWNs+aMh+WQkeWxj+W5leWGhe+8ieaYr+i0n+i9tFxyXG4gICAgICAgIC8v5oiR5Lus6KaB5b6X5Yiw55qE5piv5LiA5Liq5pa55ZCR77yM5Zug5q2k5LiN6ZyA6KaB5L2N572u5L+h5oGv77yM5bCG6b2Q5qyh5Z2Q5qCH55qEd+iuvue9ruS4ujDvvIzmipvlvIPmjonlnZDmoIfkv6Hmga9cclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuQkFDSywgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1cCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuVVAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmlnaHQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLlJJR0hULCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUG9zLmNvcHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHBvc2l0aW9uKHBvczogVmVjdG9yMykge1xyXG4gICAgICAgIHRoaXMuX3RlbXBQb3MgPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRUcmFuc2xhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUm90LmNvcHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJvdGF0aW9uKHE6IFF1YXRlcm5pb24pIHtcclxuICAgICAgICB0aGlzLl90ZW1wUm90ID0gcTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkUm90YXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4LmdldEV1bGVyQW5nbGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFNjYWxlLmNvcHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNjYWxlKHM6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBUcmFuc2Zvcm0gfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQocGFyZW50OiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAocGFyZW50ICE9IG51bGwgJiYgcGFyZW50ICE9IHRoaXMgJiYgcGFyZW50ICE9IHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77ya54i26IqC54K55piv5b2T5YmN6IqC54K555qE5a2Q6IqC54K577yM5bCG5a2Q6IqC55qE6K6+572u5Li66Ieq5bex55qE54i26IqC54K577yM5Lya5q275b6q546vXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzUGFyZW50KHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNldCBwYXJlbnQsIHRoaXMgbm9kZSBpcyB0aGUgcGFyZW50IG5vZGUncyBwYXJlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOW9k+WJjeiKgueCueacieeItuiKgueCue+8jOimgeWFiOenu+mZpOaXp+eahFxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBhcmVudCA9PSBudWxsICYmIHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/oioLngrlw5piv5ZCm5piv5b2T5YmN6IqC54K555qE5LiK57qnXHJcbiAgICBwdWJsaWMgaGFzUGFyZW50KHA6IFRyYW5zZm9ybSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgPT0gcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGFzUGFyZW50KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9IHRoaXMgJiYgIXRoaXMuY2hpbGRyZW4uaW5jbHVkZXMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77yaY2hpbGToioLngrnmmK/lvZPliY3oioLngrnnmoTniLboioLngrnvvIzlsIbniLboioLnmoTorr7nva7kuLroh6rlt7HnmoTlrZDoioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGFyZW50KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2hpbGQsIHRoaXMgbm9kZSBpcyB0aGUgY2hpbGQgbm9kZSdzIGNoaWxkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzlrZDoioLngrnmnInml6fnmoTniLboioLngrnvvIzopoHlhYjnp7vpmaRcclxuICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnljp/kuJbnlYzlnZDmoIfkvY3nva7vvIzlhYjmnJ3niLboioLngrnnmoTlj5jmjaLnmoTlj43mlrnlkJHnp7vliqjvvIznhLblkI7lho3mt7vliqDov5vljrvvvIzlsLHog73kv53mjIHkuJbnlYzlnZDmoIfkuI3lj5hcclxuICAgICAgICAgICAgICAgIC8v5Y2z5Y+Y5o2i5Yiw54i26IqC54K555qE6YCG55+p6Zi16YeMXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5KGNoaWxkLnNlbGZNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBQb3MgPSBtLmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBSb3QgPSBtLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBTY2FsZSA9IG0uZ2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUNoaWxkKGNoaWxkOiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQsIDApO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnkuJbnlYzlnZDmoIfvvIznm7TmjqXlsIbmnKzlnLDlnZDmoIfnrYnlkIzkuo7lvZPliY3kuJbnlYzlnZDmoIfljbPlj69cclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZEJ5VGFnKHRhZzogc3RyaW5nKTogVHJhbnNmb3JtIHwgbnVsbCB7XHJcblxyXG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGVzW2ldLnRhZyA9PSB0YWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2Rlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbnZlcnRUb05vZGVTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKuWwhuafkOS4quWdkOagh+i9rOWIsOiHquW3seeahOWxgOmDqOepuumXtO+8jOS+i+WmguW9k+WJjeeahOWxgOmDqOWdkOagh+WOn+eCueWcqOS4lueVjOWdkOagh+eahO+8iDHvvIwx77yJ5aSEXHJcbiAgICAgICAgICrngrlw5Zyo5LiW55WM5Z2Q5qCH77yIMu+8jDHvvInlpITvvIzpgqPkuYjlsIbngrlw55u45a+55LqO5b2T5YmN5bGA6YOo5Z2Q5qCH57O755qE5L2N572u5bCx5piv77yIMu+8jDHvvIkt77yIMe+8jDHvvIk9IO+8iDHvvIwgMO+8iVxyXG4gICAgICAgICAq5Y2z5bCG54K5cOWPjeWQkeWPmOaNouW9k+WJjeeahOefqemYtSBcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Xb3JsZFNwYWNlKHY6IFZlY3RvcjMsIHc6IG51bWJlciA9IDEpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95KGRlc3Ryb3lDaGlsZHJlbjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoZGVzdHJveUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KGRlc3Ryb3lDaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL0NvbG9yXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlLCBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9Nb2RlbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuXHJcbmVudW0gRHJhd01vZGUge1xyXG4gICAgV2lyZWZyYW1lLFxyXG4gICAgUG9pbnQsXHJcbiAgICBTaGFkZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcclxuICAgIHB1YmxpYyBkcmF3TW9kZTogRHJhd01vZGUgPSBEcmF3TW9kZS5XaXJlZnJhbWU7XHJcbiAgICBwcml2YXRlIGNhbnZhc1dpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGNhbnZhc0hlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYW52YXNXaWR0aEhhbGY6IG51bWJlcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzSGVpZ2h0SGFsZjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3BlY3RSYXRpbzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB1aW50MzJWaWV3OiBVaW50MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aW50MzJWaWV3OiBVaW50MzJBcnJheSwgY2FudmFzV2lkdGg6IG51bWJlciwgY2FudmFzSGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSB1aW50MzJWaWV3O1xyXG4gICAgICAgIHRoaXMuY2FudmFzV2lkdGggPSBjYW52YXNXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNhbnZhc0hlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhc1dpZHRoSGFsZiA9IGNhbnZhc1dpZHRoID4+IDE7XHJcbiAgICAgICAgdGhpcy5jYW52YXNIZWlnaHRIYWxmID0gY2FudmFzSGVpZ2h0ID4+IDE7XHJcbiAgICAgICAgdGhpcy5hc3BlY3RSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiDln7rnoYDnu5jliLbmjqXlj6NcclxuXHJcbiAgICBwdWJsaWMgQ2xlYXIoY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOS9v+eUqCBmaWxsIOaWueazleabv+S7o+W+queOr++8jOaAp+iDveabtOWlvVxyXG4gICAgICAgIHRoaXMudWludDMyVmlldy5maWxsKGNvbG9yKTtcclxuICAgICAgICAvLyDmiJbogIXkvb/nlKjlvqrnjq/vvIzkvYbmgKfog73ovoPlt65cclxuICAgICAgICAvLyBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2FudmFzV2lkdGg7IHgrKykge1xyXG4gICAgICAgIC8vICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuY2FudmFzSGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuU2V0UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3UGl4ZWwoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDnu5jliLbliLDlsY/luZXkuIrnmoTlg4/ntKDlupTor6XmmK/mlbTmlbDnmoRcclxuICAgICAgICAvLyDkvJjljJY6IOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4ID0gKHggfCAwKTtcclxuICAgICAgICB5ID0gKHkgfCAwKTtcclxuICAgICAgICAvLyB4ID0gTWF0aC5mbG9vcih4KTtcclxuICAgICAgICAvLyB5ID0gTWF0aC5mbG9vcih5KTtcclxuXHJcbiAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gdGhpcy5jYW52YXNXaWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWludDMyVmlld1t5ICogdGhpcy5jYW52YXNXaWR0aCArIHhdID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdMaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDlj5bmlbRcclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuXHJcbiAgICAgICAgY29uc3QgZHggPSB4MiAtIHgxO1xyXG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcclxuXHJcbiAgICAgICAgLy8g5Li65L2V6KaB5Yy65YiG5pac546H5piv5ZCm5YGP5rC05bmz6L+Y5piv5Z6C55u05ZGi77yf5Zug5Li65aaC5p6c5LiN5Yy65YiG77yM5L6L5aaC5b2T5pac546H5aSn5LqOMeaXtu+8jOS8muWvvOiHtOebtOe6v+e7mOWItuS4jei/nue7re+8jOWboOS4unnkvJrot7Plj5jvvIzogIzkuI3mmK/ov57nu63nmoTlop7liqDjgIJcclxuICAgICAgICAvLyDlj6rmnInmlpznjofliJrlpb3kuLox5pe277yMeOi3n3nmiY3mmK/ov57nu63lkIzmraXoh6rlop7nmoTvvIx4KzHvvIzliJl55LmfKzFcclxuICAgICAgICAvLyDmiYDku6XvvIzlvZPmlpznjoflpKfkuo4x5pe277yM5oiR5Lus6ZyA6KaB5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj++8jOiAjOW9k+aWnOeOh+Wwj+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh45L2c5Li65b6q546v5Y+Y6YeP44CCXHJcbiAgICAgICAgLy8g5Li+5Liq5p6B56uv5L6L5a2Q77yM5b2T5pac546H5Li6MOaXtu+8jOebtOe6v+WwseaYr+S4gOadoeWeguebtOebtOe6v++8jOWmguaenOi/meaXtuWAmei/mOeUqHjkvZzkuLrlvqrnjq/lj5jph4/vvIzliJnkvJrlr7zoh7Tov5nmnaHnm7Tnur/kuIrmiYDmnIl554K56YO95a+55bqU5LiA5LiqeO+8jOS5n+WwseaYr+ivtOi/meadoee6v+WPmOaIkOS4gOS4queCueS6huOAglxyXG5cclxuICAgICAgICAvLyDmlpznjoflsI/kuo4x77yM55u057q/5YGP5rC05bmz5oOF5Ya177yM5L2/55SoeOS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiBNYXRoLmFicyhkeSkpIHtcclxuICAgICAgICAgICAgLy8g5LiL6Z2i55qE5b6q546v57uY5Yi25Ye95pWw5piv5LuO5bem5b6A5Y+z55qE77yM6L+Z6YeM6KaB56Gu5L+d57uT5p2f54K55Zyo5byA5aeL54K555qE5Y+z6L65XHJcbiAgICAgICAgICAgIGlmICh4MiA8IHgxKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaWnOeOh1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZHkgLyBkeDtcclxuICAgICAgICAgICAgLy8g5oiq6Led77yIeT1heCti77yMYj15LWF477yJXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGIgPSB5MSAtIGEgKiB4MTtcclxuICAgICAgICAgICAgbGV0IHkgPSB5MTtcclxuICAgICAgICAgICAgLy8g57uY5Yi255u057q/XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICAvLyDnm7Tnur/lhazlvI95PWF4K2LvvIzov5nph4zkuI3lv4XorqHnrpfov5nkuKrlhazlvI/vvIzlm6DkuLrlvZN45YqgMeiHquWinuaXtu+8jHnkuZ/kvJrliqBh77yM5omA5Lul5Y+v5Lul55u05o6l55SoeSth5Luj5pu/YXgrYu+8jOeul+aYr+S4gOS4quaAp+iDveS8mOWMlueCuVxyXG4gICAgICAgICAgICAgICAgLy8geSA9IGEgKiB4ICsgYjtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHlzID0gdGhpcy5JbnRlcnBvbGF0ZSh4MSwgeTEsIHgyLCB5Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5c1t4IC0geDFdLCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5pac546H5aSn5LqOMe+8jOebtOe6v+WBj+WeguebtOaDheWGte+8jOS9v+eUqHnkvZzkuLrlvqrnjq/lj5jph49cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHkyIDwgeTEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYSA9IGR4IC8gZHk7XHJcbiAgICAgICAgICAgIGxldCB4ID0geDE7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaIllxyXG4gICAgICAgICAgICAvLyBjb25zdCB4cyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5EcmF3UGl4ZWwoeHNbeSAtIHkxXSwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgyLCB5MiwgeDMsIHkzLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MywgeTMsIHgxLCB5MSwgY29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWQoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOazqO+8muS7peS4i+aPkOWIsOeahOmVv+i+ue+8jOeJueaMh3novbTot6jluqbmnIDplb/nmoTovrnvvIzogIzkuI3mmK/lrp7pmYXkuIrnmoTovrnplb9cclxuXHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnov5vooYzmjpLluo/vvIzkvb/lvpd5MTw9eTI8PXkz77yM5Y2z5Y+v56Gu5a6a5LiJ6KeS5b2i55qE6ZW/6L655Li6TDEz77yMTDEy5ZKMTDIz5YiZ5piv5Y+m5aSW5Lik5p2h55+t6L65XHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MSA+IHkzKSBbeDEsIHkxLCB4MywgeTNdID0gW3gzLCB5MywgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzXSA9IFt4MywgeTMsIHgyLCB5Ml07XHJcblxyXG4gICAgICAgIC8vIOiOt+WPljPmnaHovrnnmoTngrnlnZDmoIflkIjpm4ZcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMTMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTMsIHgzKTtcclxuXHJcbiAgICAgICAgLy8g5ou85ZCI5Lik5p2h55+t6L655Li65LiA5p2h6ZW/6L6577yI5YWI56e76Zmk56ys5LiA5p2h6L6555qE5pyA5ZCO5LiA5Liq5pWw5o2u77yM6YG/5YWN6YeN5aSN77yJXHJcbiAgICAgICAgLy8g546w5Zyo5Y+Y5oiQMuadoemVv+i+ue+8jEwxM+WSjEwxMjNcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuXHJcbiAgICAgICAgLy8g5Yik5patTDEz5ZKMTDEyM+WTquadoemVv+i+ueaYr+W3puWTquadoeaYr+WPs++8jOmDveWPluaVsOe7hOS4remXtOeahOeCue+8jOWIpOaWreiwgeW3puiwgeWPs+WNs+WPr+OAglxyXG4gICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBwTGVmdCA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHBSaWdodCA9IHAxMztcclxuICAgICAgICBpZiAocDEzW21dIDwgcDEyM1ttXSkge1xyXG4gICAgICAgICAgICBwTGVmdCA9IHAxMztcclxuICAgICAgICAgICAgcFJpZ2h0ID0gcDEyMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuawtOW5s+e6v+autVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MzsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwTGVmdFt5IC0geTFdOyB4IDw9IHBSaWdodFt5IC0geTFdOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKFxyXG4gICAgICAgIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsXHJcbiAgICAgICAgeDI6IG51bWJlciwgeTI6IG51bWJlcixcclxuICAgICAgICB4MzogbnVtYmVyLCB5MzogbnVtYmVyLFxyXG4gICAgICAgIGNvbG9yMTogbnVtYmVyLCBjb2xvcjI6IG51bWJlciwgY29sb3IzOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIOWunumZhee7mOWItuWIsOWxj+W5leS4iueahOeCue+8jOW/hemhu+aYr+aVtOaVsO+8jOWPluaVtOS4gOS4i+OAguS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuICAgICAgICB4MyA9IHgzIHwgMDtcclxuICAgICAgICB5MyA9IHkzIHwgMDtcclxuXHJcbiAgICAgICAgLy8g5a+554K55oyJWeWdkOagh+aOkuW6j++8jOehruS/nXkxIDw9IHkyIDw9IHkzXHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5MiwgY29sb3IxLCBjb2xvcjJdID0gW3gyLCB5MiwgeDEsIHkxLCBjb2xvcjIsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5MywgY29sb3IxLCBjb2xvcjNdID0gW3gzLCB5MywgeDEsIHkxLCBjb2xvcjMsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5MywgY29sb3IyLCBjb2xvcjNdID0gW3gzLCB5MywgeDIsIHkyLCBjb2xvcjMsIGNvbG9yMl07XHJcblxyXG4gICAgICAgIC8vIOaPkOWPllJHQuWIhumHj1xyXG4gICAgICAgIGNvbnN0IGMxID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjEpO1xyXG4gICAgICAgIGNvbnN0IGMyID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjIpO1xyXG4gICAgICAgIGNvbnN0IGMzID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjMpO1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzlh73mlbDvvIzpopzoibIx5LiO6aKc6ImyMuWcqGQxLWQy55qE6IyD5Zu05YaF5Z2H5YyA5o+S5YC8XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVDb2xvciA9IChkMTogbnVtYmVyLCByMTogbnVtYmVyLCBnMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMTogbnVtYmVyLFxyXG4gICAgICAgICAgICBkMjogbnVtYmVyLCByMjogbnVtYmVyLCBnMjogbnVtYmVyLCBiMjogbnVtYmVyLCBhMjogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj1xyXG4gICAgICAgICAgICAvLyDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y5ZKMTWF0aC5hYnPvvIzmj5DljYfmgKfog71cclxuICAgICAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGQyIC0gZDEpKTtcclxuICAgICAgICAgICAgY29uc3QgZHggPSAoKGQyID4gZDEgPyBkMiAtIGQxIDogZDEgLSBkMikgfCAwKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfmraXplb9cclxuICAgICAgICAgICAgY29uc3QgaW52RGVsdGEgPSAxIC8gKGQyIC0gZDEpO1xyXG4gICAgICAgICAgICBjb25zdCByU3RlcCA9IChyMiAtIHIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBnU3RlcCA9IChnMiAtIGcxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBiU3RlcCA9IChiMiAtIGIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBhU3RlcCA9IChhMiAtIGExKSAqIGludkRlbHRhO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSByMSwgZyA9IGcxLCBiID0gYjEsIGEgPSBhMTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0geyByLCBnLCBiLCBhIH07XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85LiJ5p2h6L6555qE5Z2Q5qCH5ZKM6aKc6ImyXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDEyQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEpO1xyXG5cclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMjNDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkyLCBjMi5yLCBjMi5nLCBjMi5iLCBjMi5hLCB5MywgYzMuciwgYzMuZywgYzMuYiwgYzMuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTEsIGMxLnIsIGMxLmcsIGMxLmIsIGMxLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgLy8g5ZCI5bm25Lik5p2h55+t6L65XHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcbiAgICAgICAgY29uc3QgcDEyM0NvbG9ycyA9IHAxMkNvbG9ycy5jb25jYXQocDIzQ29sb3JzKTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5bem5Y+z6L6555WMXHJcbiAgICAgICAgLy8gY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBjb25zdCBtID0gKHAxMjMubGVuZ3RoID4+IDEpIHwgMDtcclxuICAgICAgICBsZXQgbGVmdFBvaW50cyA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHJpZ2h0UG9pbnRzID0gcDEzO1xyXG4gICAgICAgIGxldCBsZWZ0Q29sb3JzID0gcDEyM0NvbG9ycztcclxuICAgICAgICBsZXQgcmlnaHRDb2xvcnMgPSBwMTNDb2xvcnM7XHJcblxyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIGxlZnRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgICAgIHJpZ2h0UG9pbnRzID0gcDEyMztcclxuICAgICAgICAgICAgbGVmdENvbG9ycyA9IHAxM0NvbG9ycztcclxuICAgICAgICAgICAgcmlnaHRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q6177yM5bm26L+b6KGM6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0geSAtIHkxO1xyXG4gICAgICAgICAgICBjb25zdCB4U3RhcnQgPSBsZWZ0UG9pbnRzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHhFbmQgPSByaWdodFBvaW50c1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVmdENvbG9yID0gbGVmdENvbG9yc1tpZHhdO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodENvbG9yID0gcmlnaHRDb2xvcnNbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmihOiuoeeul+minOiJsuW3ruWAvFxyXG4gICAgICAgICAgICBjb25zdCByRGlmZiA9IHJpZ2h0Q29sb3IuciAtIGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBjb25zdCBnRGlmZiA9IHJpZ2h0Q29sb3IuZyAtIGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBjb25zdCBiRGlmZiA9IHJpZ2h0Q29sb3IuYiAtIGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBjb25zdCBhRGlmZiA9IHJpZ2h0Q29sb3IuYSAtIGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5q2l6ZW/5ZKM6aKc6Imy5aKe6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGludkxlbmd0aCA9IDEgLyAoKHhFbmQgLSB4U3RhcnQpICsgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gckRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gZ0RpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gYkRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gYURpZmYgKiBpbnZMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyDliJ3lp4vpopzoibLlgLxcclxuICAgICAgICAgICAgbGV0IHIgPSBsZWZ0Q29sb3IucjtcclxuICAgICAgICAgICAgbGV0IGcgPSBsZWZ0Q29sb3IuZztcclxuICAgICAgICAgICAgbGV0IGIgPSBsZWZ0Q29sb3IuYjtcclxuICAgICAgICAgICAgbGV0IGEgPSBsZWZ0Q29sb3IuYTtcclxuXHJcbiAgICAgICAgICAgIC8vIOawtOW5s+aWueWQkeminOiJsuaPkuWAvFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDw9IHhFbmQ7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmluYWxDb2xvciA9ICgoYSB8IDApIDw8IDI0KSB8ICgoYiB8IDApIDw8IDE2KSB8ICgoZyB8IDApIDw8IDgpIHwgKHIgfCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGZpbmFsQ29sb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOe0r+WKoOminOiJsuWAvFxyXG4gICAgICAgICAgICAgICAgciArPSByU3RlcDtcclxuICAgICAgICAgICAgICAgIGcgKz0gZ1N0ZXA7XHJcbiAgICAgICAgICAgICAgICBiICs9IGJTdGVwO1xyXG4gICAgICAgICAgICAgICAgYSArPSBhU3RlcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5oqV5b2x55u45YWzXHJcblxyXG4gICAgLy8g5bCG6KeG5Y+j5LiK55qE5YaF5a655pig5bCE5Yiw5a6e6ZmF5bGP5bmV5LiKXHJcbiAgICBwdWJsaWMgVmlld3BvcnRUb0NhbnZhcyhwb2ludDogVmVjdG9yMikge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhuWPo+WuveW6puS4ujHkuKrljZXkvY1cclxuICAgICAgICAvLyDlm6DkuLphc3BlY3RSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h077yMXHJcbiAgICAgICAgLy8g5omA5Lul6KeG5Y+j6auY5bqmID0gMSAvIGFzcGVjdFJhdGlvID0gY2FudmFzSGVpZ2h0IC8gY2FudmFzV2lkdGhcclxuICAgICAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gMTtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IDEgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG5cclxuICAgICAgICAvLyDlsIbmipXlvbHlnZDmoIfmmKDlsITliLBDYW52YXPlg4/ntKDlnZDmoIdcclxuICAgICAgICAvLyBY5Z2Q5qCH77ya5LuOIFstdmlld3BvcnRXaWR0aC8yLCB2aWV3cG9ydFdpZHRoLzJdIOaYoOWwhOWIsCBbMCwgY2FudmFzV2lkdGhdXHJcbiAgICAgICAgLy8gWeWdkOagh++8muS7jiBbLXZpZXdwb3J0SGVpZ2h0LzIsIHZpZXdwb3J0SGVpZ2h0LzJdIOaYoOWwhOWIsCBbMCwgY2FudmFzSGVpZ2h0XSAo5rOo5oSPWei9tOaWueWQkSlcclxuICAgICAgICBjb25zdCBjYW52YXNYID0gKChwb2ludC54ICsgdmlld3BvcnRXaWR0aCAvIDIpIC8gdmlld3BvcnRXaWR0aCkgKiB0aGlzLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSB0aGlzLmNhbnZhc0hlaWdodCAtICgoKHBvaW50LnkgKyB2aWV3cG9ydEhlaWdodCAvIDIpIC8gdmlld3BvcnRIZWlnaHQpICogdGhpcy5jYW52YXNIZWlnaHQpOyAvLyBDYW52YXPnmoRZ6L206YCa5bi45piv5ZCR5LiL55qEXHJcbiAgICAgICAgcG9pbnQueCA9IGNhbnZhc1g7XHJcbiAgICAgICAgcG9pbnQueSA9IGNhbnZhc1k7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YCP6KeG5oqV5b2x77yM5bCGM0TlnLrmma/nmoTlnZDmoIfovazmjaLkuLoyROWxj+W5leWdkOagh++8jOaKleWwhOWIsOinhuWPo+S4ilxyXG4gICAgcHVibGljIFByb2plY3RWZXJ0ZXgodmVydGV4OiBWZWN0b3IzKTogVmVjdG9yMiB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG54K55Yiw6L+R6KOB6Z2i77yI6KeG5Y+j77yJ55qE6Led56a75pivZO+8jOinhuWPo+eahOWuveaYrzFcclxuICAgICAgICAvLyDmoLnmja7kuInop5Llh73mlbDmnInvvJp0YW4oZm92LzIpID0gKDAuNSAvIGQpXHJcbiAgICAgICAgLy8g5omA5Lul77yaZCA9IDAuNSAvIHRhbihmb3YvMilcclxuICAgICAgICBjb25zdCBmb3ZEZWdyZWVzID0gNjA7XHJcbiAgICAgICAgY29uc3QgZm92UmFkaWFucyA9IGZvdkRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MCk7IC8vIOWwhuinkuW6pui9rOaNouS4uuW8p+W6plxyXG4gICAgICAgIGNvbnN0IGQgPSAwLjUgLyBNYXRoLnRhbihmb3ZSYWRpYW5zIC8gMik7XHJcblxyXG4gICAgICAgIC8vIOmAj+inhuWFrOW8j++8jOWBh+iuvuinhueCueS9jee9rigwLDAp77yM6KeG54K55Yiw6KeG5Y+j6Led56a75Li6ZO+8jOWcuuaZr+mHjOeahOeCueS4ulAoeCx5LHop77yM5oqV5bCE5Yiw6KeG5Y+j5LiK55qE54K55Li6UCcoeCx5KVxyXG4gICAgICAgIC8vIOWImeagueaNruebuOS8vOS4ieinkuW9ouacie+8mnogLyBkID0geCAvIHgnID0geSAvIHkn77yM5Y+v5b6X5Yiw77yaXHJcbiAgICAgICAgLy8geCcgPSAoZCAqIHgpIC8gelxyXG4gICAgICAgIC8vIHknID0gKGQgKiB5KSAvIHpcclxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uWCA9IChkICogdmVydGV4LngpIC8gdmVydGV4Lno7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblkgPSAoZCAqIHZlcnRleC55KSAvIHZlcnRleC56O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIocHJvamVjdGlvblgsIHByb2plY3Rpb25ZKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5Y+Y5o2iXHJcblxyXG4gICAgcHVibGljIEFwcGx5VHJhbnNmb3JtKHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICAvLyDlv4XpobvkuKXmoLzlronoo4XlhYjnvKnmlL7lkI7ml4vovazlkI7lubPnp7vnmoTpobrluo9cclxuICAgICAgICB0aGlzLlNjYWxlVmVydGV4KHZlcnRleCwgdHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLlJvdGF0ZVZlcnRleCh2ZXJ0ZXgsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5UcmFuc2xhdGVWZXJ0ZXgodmVydGV4LCB0cmFuc2Zvcm0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTY2FsZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKj0gdHJhbnNmb3JtLnNjYWxlLng7XHJcbiAgICAgICAgdmVydGV4LnkgKj0gdHJhbnNmb3JtLnNjYWxlLnk7XHJcbiAgICAgICAgdmVydGV4LnogKj0gdHJhbnNmb3JtLnNjYWxlLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJvdGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgZXVsZXJBbmdsZXMgPSB0cmFuc2Zvcm0ucm90YXRpb24uZXVsZXJBbmdsZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvc1ggPSBNYXRoLmNvcyhldWxlckFuZ2xlcy54KTtcclxuICAgICAgICBjb25zdCBzaW5YID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueCk7XHJcbiAgICAgICAgY29uc3QgY29zWSA9IE1hdGguY29zKGV1bGVyQW5nbGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IHNpblkgPSBNYXRoLnNpbihldWxlckFuZ2xlcy55KTtcclxuICAgICAgICBjb25zdCBjb3NaID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueik7XHJcbiAgICAgICAgY29uc3Qgc2luWiA9IE1hdGguc2luKGV1bGVyQW5nbGVzLnopO1xyXG4gICAgICAgIC8vIOWFiOe7lVrovbTml4vovaxcclxuICAgICAgICBjb25zdCB4ID0gdmVydGV4LnggKiBjb3NaIC0gdmVydGV4LnkgKiBzaW5aO1xyXG4gICAgICAgIGNvbnN0IHkgPSB2ZXJ0ZXgueCAqIHNpblogKyB2ZXJ0ZXgueSAqIGNvc1o7XHJcbiAgICAgICAgdmVydGV4LnggPSB4O1xyXG4gICAgICAgIHZlcnRleC55ID0geTtcclxuICAgICAgICAvLyDlho3nu5VZ6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeiA9IHZlcnRleC56ICogY29zWSAtIHZlcnRleC54ICogc2luWTtcclxuICAgICAgICBjb25zdCB4MiA9IHZlcnRleC56ICogc2luWSArIHZlcnRleC54ICogY29zWTtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHo7XHJcbiAgICAgICAgdmVydGV4LnggPSB4MjtcclxuICAgICAgICAvLyDmnIDlkI7nu5VY6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeTIgPSB2ZXJ0ZXgueSAqIGNvc1ggLSB2ZXJ0ZXgueiAqIHNpblg7XHJcbiAgICAgICAgY29uc3QgejIgPSB2ZXJ0ZXgueSAqIHNpblggKyB2ZXJ0ZXgueiAqIGNvc1g7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5MjtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHoyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUcmFuc2xhdGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZlcnRleC54ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZlcnRleC55ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZlcnRleC56ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDnu5jliLbniankvZNcclxuXHJcbiAgICBwdWJsaWMgRHJhd09iamVjdChvYmo6IEluc3RhbmNlKSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSBvYmoubW9kZWw7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBtb2RlbC52ZXJ0aWNlcztcclxuICAgICAgICBjb25zdCBpbmRpY2VzID0gbW9kZWwuZmFjZXMuZmxhdE1hcChmYWNlID0+IGZhY2UudmVydGV4SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2plY3RlZFZlcnRpY2VzID0gbmV3IEFycmF5KHZlcnRpY2VzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdmVydGljZSA9IHZlcnRpY2VzW2ldLmNvcHkoKTtcclxuICAgICAgICAgICAgLy8g5YWI5Y+Y5o2iXHJcbiAgICAgICAgICAgIHRoaXMuQXBwbHlUcmFuc2Zvcm0odmVydGljZSwgb2JqLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIC8vIOWGjeaKleW9sVxyXG4gICAgICAgICAgICBwcm9qZWN0ZWRWZXJ0aWNlc1tpXSA9IHRoaXMuUHJvamVjdFZlcnRleCh2ZXJ0aWNlKTtcclxuICAgICAgICAgICAgLy8g5YaN6KeG5Y+j5pig5bCEXHJcbiAgICAgICAgICAgIHRoaXMuVmlld3BvcnRUb0NhbnZhcyhwcm9qZWN0ZWRWZXJ0aWNlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmnIDlkI7nu5jliLbkuInop5LlvaLliLDlsY/luZXkuIpcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgcDEgPSBwcm9qZWN0ZWRWZXJ0aWNlc1tpbmRpY2VzW2ldXTtcclxuICAgICAgICAgICAgY29uc3QgcDIgPSBwcm9qZWN0ZWRWZXJ0aWNlc1tpbmRpY2VzW2kgKyAxXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAzID0gcHJvamVjdGVkVmVydGljZXNbaW5kaWNlc1tpICsgMl1dO1xyXG5cclxuICAgICAgICAgICAgLy8g57q/5qGG5qih5byP77yM5pqC5LiN5pSv5oyB6aG254K56ImyXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5XaXJlZnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1RyaWFuZ2xlKHAxLngsIHAxLnksIHAyLngsIHAyLnksIHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwocDEueCwgcDEueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwocDIueCwgcDIueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwocDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZHJhd01vZGUgPT09IERyYXdNb2RlLlNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGUocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlt6Xlhbflh73mlbBcclxuXHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8g57q/5oCn5o+S5YC8XHJcbiAgICAvLy8g5Lyg5YWlMuS4queCue+8jOi/lOWbnuWug+S7rOe7hOaIkOe6v+auteeahOaPkuWAvOOAglxyXG4gICAgLy8vIOimgeaxgu+8mlxyXG4gICAgLy8vIDEuIOimgeWFiOeul+WHuuebtOe6v+WBj+awtOW5s+i/mOaYr+WeguebtO+8jOWmguaenOaYr+WBj+awtOW5s++8iOaWnOeOh+Wwj+S6jjHvvInvvIzliJnku6V45Li65b6q546v77yM5Lyg5YWl6aG65bqP5pivKHgxLHkxLHgyLHkyKe+8jOWPjeS5i+WmguaenOebtOe6v+WBj+WeguebtO+8jOWImeaYryh5MSx4MSx5Mix4MilcclxuICAgIC8vLyAyLiDlkIzml7bopoHnoa7kv53nur/mrrXngrnnmoTmlrnlkJHmmK/ku47lt6blvoDlj7PmiJbku47kuIrlvoDkuIvvvIzkvovlpoLnur/mrrXmmK/lgY/msLTlubPnmoTor53vvIzopoHnoa7kv514Mj54Me+8jOWmguaenOaYr+WBj+WeguebtOeahOivne+8jOimgeehruS/nXkyPnkxXHJcbiAgICAvLy8g5Li+5Liq5L6L5a2Q77yaXHJcbiAgICAvLy8g54K5KDAsIDAp5ZKMKDIsMSnvvIzkvKDlhaXnmoTlj4LmlbDmmK8oMCwgMCwgMiwgMSnvvIzov5Tlm57nmoTmmK8oKDItMCkrMT0zKeS4quWAvO+8jOi/meS6m+WAvOaYr+S7jigwLTEp5Lit6Ze05o+S5YC855qE77yM5Y2zKDAsIDAuNSwgMSlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBwcml2YXRlIEludGVycG9sYXRlKGExOiBudW1iZXIsIGIxOiBudW1iZXIsIGEyOiBudW1iZXIsIGIyOiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCP5Lul6YG/5YWN5Yqo5oCB5omp5a65XHJcbiAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGEyIC0gYTEpKTtcclxuICAgICAgICBjb25zdCBkeCA9ICgoYTIgPiBhMSA/IGEyIC0gYTEgOiBhMSAtIGEyKSB8IDApO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcbiAgICAgICAgY29uc3QgYSA9IChiMiAtIGIxKSAvIChhMiAtIGExKTtcclxuICAgICAgICBsZXQgZCA9IGIxO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlW2ldID0gZDtcclxuICAgICAgICAgICAgZCArPSBhO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbn0iLCJpbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4uL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZSwgVHJhbnNmb3JtIH0gZnJvbSBcIi4uL01vZGVsXCI7XHJcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tIFwiLi9EaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IE9CSlBhcnNlciB9IGZyb20gXCIuL09ialBhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0TG9hZGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZpbGVDYWNoZTogRGljdGlvbmFyeSA9IG5ldyBEaWN0aW9uYXJ5KCk7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkSW1hZ2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4oKHJlc29sdmUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHRoZSBpbWFnZSBvYmplY3QnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIG9uIGxvYWRpbmcgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCBpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOi3qOWMuuivt+axglxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY3Jvc3NPcmlnaW4gPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRlbGwgdGhlIGJyb3dzZXIgdG8gbG9hZCBhbiBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZU5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRUZXh0RmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgcmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTW9kZWxGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPE9CSkRvYz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxPQkpEb2M+KChyZXNvbHZlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmpEb2MgPSBuZXcgT0JKRG9jKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCBvYmpEb2MucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQsIDEsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPQkogZmlsZSBwYXJzaW5nIGVycm9yOiBcIiArIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgb2JqRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5LiN6KaB5byA5ZCv5byC5q2l77yM6K6+572u5Li6ZmFsc2XvvIzlkKbliJnlrrnmmJPljaHlnKhyZWFkeVN0YXRlID0gMe+8jOWOn+WboOS4jeaYjlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIGZpbGVOYW1lLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRJbnN0YW5jZUZyb21Nb2RlbChuYW1lOiBzdHJpbmcsIG1vZGVsUGF0aDogc3RyaW5nLCBzY2FsZTogbnVtYmVyID0gMSwgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxJbnN0YW5jZT4ge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBJbnN0YW5jZSgpO1xyXG4gICAgICAgIGluc3RhbmNlLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0obmFtZSk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uaWRlbnRpdHk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gVmVjdG9yMy5PTkU7XHJcblxyXG4gICAgICAgIHZhciBvYmpEb2MgPSBhd2FpdCBBc3NldExvYWRlci5sb2FkVGV4dEZpbGUobW9kZWxQYXRoKTtcclxuICAgICAgICBpZiAob2JqRG9jICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBPQkpQYXJzZXIucGFyc2VPQkoob2JqRG9jKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UubW9kZWwgPSBtb2RlbDtcclxuXHJcbiAgICAgICAgICAgIC8vIOi+k+WHuue7n+iuoeS/oeaBr1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhPQkpQYXJzZXIuZ2V0TW9kZWxTdGF0cyhtb2RlbCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gdmFyIG9ianMgPSBvYmpEb2MuZ2V0T2JqcyhzY2FsZSwgcmV2ZXJzZSk7XHJcbiAgICAgICAgICAgIC8vIG9ianMuZm9yRWFjaChhc3luYyBvYmogPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgLy90b2RvOuS4tOatu+WGmeatu++8jOWPquWKoOi9vea8q+WPjeWwhOi0tOWbvlxyXG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKG9iai5tYXRlcmlhbCAhPSBudWxsICYmIG9iai5tYXRlcmlhbC5tYXBfS2QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHJlbmRlci5tYXRlcmlhbC5jcmVhdGVUZXh0dXJlKG9iai5tYXRlcmlhbC5tYXBfS2QpO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLnZlcnRpY2VzID0gb2JqLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwuaW5kaWNlcyA9IG9iai5pbmRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwudXZzID0gb2JqLnV2cztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLm5vcm1hbHMgPSBvYmoubm9ybWFscztcclxuICAgICAgICAgICAgLy8gICAgIGluc3RhbmNlLm1vZGVsLnB1c2gobW9kZWwpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xyXG5cclxuICBpdGVtczogb2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcclxuICAgIHRoaXMuaXRlbXNba2V5XSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuaXRlbXNba2V5XSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5pdGVtc1trXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGZ1bikge1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGZ1bihrLCB0aGlzLml0ZW1zW2tdKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAnLi4vTWF0aC9WZWN0b3IzJztcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJy4uL01hdGgvVmVjdG9yMic7XHJcblxyXG4vKipcclxuICogT0JK5qih5Z6L6Kej5p6Q57uT5p6c5o6l5Y+jXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9CSk1vZGVsIHtcclxuICAgIHZlcnRpY2VzOiBWZWN0b3IzW107XHJcbiAgICB0ZXh0dXJlQ29vcmRzOiBWZWN0b3IyW107XHJcbiAgICB2ZXJ0ZXhOb3JtYWxzOiBWZWN0b3IzW107XHJcbiAgICBmYWNlczogRmFjZVtdO1xyXG4gICAgbWF0ZXJpYWxzOiBSZWNvcmQ8c3RyaW5nLCBNYXRlcmlhbD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDpnaLmjqXlj6PvvIzmlK/mjIHkuInop5LlvaLlkozlpJrovrnlvaJcclxuICovXHJcbmludGVyZmFjZSBGYWNlIHtcclxuICAgIHZlcnRleEluZGljZXM6IG51bWJlcltdO1xyXG4gICAgdGV4dHVyZUluZGljZXM/OiBudW1iZXJbXTtcclxuICAgIG5vcm1hbEluZGljZXM/OiBudW1iZXJbXTtcclxuICAgIG1hdGVyaWFsTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIOadkOi0qOS/oeaBr+aOpeWPo1xyXG4gKi9cclxuaW50ZXJmYWNlIE1hdGVyaWFsIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8vIOWPr+agueaNrumcgOimgeaJqeWxleadkOi0qOWxnuaAp1xyXG59XHJcblxyXG4vKipcclxuICogT0JK5paH5Lu26Kej5p6Q5Zmo57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT0JKUGFyc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6QT0JK5paH5Lu2XHJcbiAgICAgKiBAcGFyYW0gZmlsZUNvbnRlbnQgT0JK5paH5Lu25YaF5a65XHJcbiAgICAgKiBAcmV0dXJucyDop6PmnpDlkI7nmoRPQkrmqKHlnovmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwYXJzZU9CSihmaWxlQ29udGVudDogc3RyaW5nKTogT0JKTW9kZWwge1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gZmlsZUNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQ6IE9CSk1vZGVsID0ge1xyXG4gICAgICAgICAgICB2ZXJ0aWNlczogW10sXHJcbiAgICAgICAgICAgIHRleHR1cmVDb29yZHM6IFtdLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhOb3JtYWxzOiBbXSxcclxuICAgICAgICAgICAgZmFjZXM6IFtdLFxyXG4gICAgICAgICAgICBtYXRlcmlhbHM6IHt9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50TWF0ZXJpYWwgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRMaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDot7Pov4fnqbrooYzlkozms6jph4pcclxuICAgICAgICAgICAgaWYgKCF0cmltbWVkTGluZSB8fCB0cmltbWVkTGluZS5zdGFydHNXaXRoKCcjJykpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGluZVBhcnRzID0gdHJpbW1lZExpbmUuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgY29uc3Qga2V5d29yZCA9IGxpbmVQYXJ0c1swXTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5d29yZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndic6IC8vIOmhtueCueWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZlcnRpY2VzLnB1c2godmVydGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndnQnOiAvLyDnurnnkIblnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleENvb3JkID0gbmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRleHR1cmVDb29yZHMucHVzaCh0ZXhDb29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3ZuJzogLy8g6aG254K55rOV57q/XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3JtYWwgPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmVydGV4Tm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2YnOiAvLyDpnaLlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2U6IEZhY2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbEluZGljZXM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDpnaLnmoTmr4/kuKrpobbngrnlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lUGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERlZiA9IGxpbmVQYXJ0c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIF244CBdi92dOOAgXYvL3Zu44CBdi92dC92buetieWkmuenjeagvOW8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UGFydHMgPSB2ZXJ0ZXhEZWYuc3BsaXQoJy8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpobbngrnntKLlvJXvvIhPQkrntKLlvJXku44x5byA5aeL77yM6ZyA6KaB6L2s5o2i5Li65LuOMOW8gOWni++8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS52ZXJ0ZXhJbmRpY2VzLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMF0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g57q555CG5Z2Q5qCH57Si5byV77yI5Y+v6YCJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMV0gJiYgdmVydGV4UGFydHNbMV0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS50ZXh0dXJlSW5kaWNlcyEucHVzaChwYXJzZUludCh2ZXJ0ZXhQYXJ0c1sxXSkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDms5Xnur/ntKLlvJXvvIjlj6/pgInvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1syXSAmJiB2ZXJ0ZXhQYXJ0c1syXSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLm5vcm1hbEluZGljZXMhLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMl0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaciee6ueeQhuaIluazlee6v+e0ouW8le+8jOa4heepuuaVsOe7hOS7peS/neaMgeaVsOaNruaVtOa0gVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2UudGV4dHVyZUluZGljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2Uubm9ybWFsSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2Uubm9ybWFsSW5kaWNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5re75Yqg5p2Q6LSo5L+h5oGv77yI5aaC5p6c5pyJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UubWF0ZXJpYWxOYW1lID0gY3VycmVudE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZmFjZXMucHVzaChmYWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbXRsbGliJzogLy8g5p2Q6LSo5bqT5byV55SoXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbExpYk5hbWUgPSBsaW5lUGFydHNbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWunumZheW6lOeUqOS4remcgOimgeWKoOi9veW5tuino+aekOWvueW6lOeahC5tdGzmlofku7ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWPkeeOsOadkOi0qOW6k+W8leeUqDogJHttYXRlcmlhbExpYk5hbWV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VzZW10bCc6IC8vIOS9v+eUqOadkOi0qFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE1hdGVyaWFsID0gbGluZVBhcnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJbmnZDotKjorrDlvZXvvIjlrp7pmYXkvb/nlKjml7bpnIDopoHku44ubXRs5paH5Lu25Yqg6L295a6M5pW05L+h5oGv77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdID0geyBuYW1lOiBjdXJyZW50TWF0ZXJpYWwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlj6/ku6Xmt7vliqDmm7TlpJpPQkrmoLzlvI/lhbPplK7lrZfnmoTlpITnkIZcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5b+955Wl5LiN5pSv5oyB55qE5YWz6ZSu5a2XXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbop6PmnpDlkI7nmoTmqKHlnovmlbDmja7ovazmjaLkuLpKU09O5a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyBKU09O5a2X56ym5LiyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9KU09OKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1vZGVsLCBudWxsLCAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaooeWei+e7n+iuoeS/oeaBr1xyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMg57uf6K6h5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TW9kZWxTdGF0cyhtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVDb3VudCA9IG1vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbENvdW50ID0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoVGV4dHVyZXMgPSBtb2RlbC5mYWNlcy5maWx0ZXIoZmFjZSA9PiBmYWNlLnRleHR1cmVJbmRpY2VzKS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoTm9ybWFscyA9IG1vZGVsLmZhY2VzLmZpbHRlcihmYWNlID0+IGZhY2Uubm9ybWFsSW5kaWNlcykubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gYFxyXG7mqKHlnovnu5/orqHkv6Hmga86XHJcbi0g6aG254K55pWwOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aH1cclxuLSDnurnnkIblnZDmoIfmlbA6ICR7dGV4dHVyZUNvdW50fVxyXG4tIOazlee6v+WQkemHj+aVsDogJHtub3JtYWxDb3VudH1cclxuLSDpnaLmlbA6ICR7bW9kZWwuZmFjZXMubGVuZ3RofVxyXG4tIOW4pue6ueeQhueahOmdojogJHtmYWNlc1dpdGhUZXh0dXJlc31cclxuLSDluKbms5Xnur/nmoTpnaI6ICR7ZmFjZXNXaXRoTm9ybWFsc31cclxuLSDmnZDotKjmlbA6ICR7T2JqZWN0LmtleXMobW9kZWwubWF0ZXJpYWxzKS5sZW5ndGh9XHJcbiAgICAgICAgYC50cmltKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpqozor4Hop6PmnpDmlbDmja7nmoTlrozmlbTmgKdcclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIOmqjOivgee7k+aenOa2iOaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlTW9kZWwobW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIC8vIOajgOafpemdoue0ouW8leaYr+WQpui2iueVjFxyXG4gICAgICAgIGZvciAoY29uc3QgZmFjZSBvZiBtb2RlbC5mYWNlcykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZlcnRleEluZGV4IG9mIGZhY2UudmVydGV4SW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleEluZGV4IDwgMCB8fCB2ZXJ0ZXhJbmRleCA+PSBtb2RlbC52ZXJ0aWNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg6aG254K557Si5byV6LaK55WMOiAke3ZlcnRleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZXhJbmRleCBvZiBmYWNlLnRleHR1cmVJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleEluZGV4IDwgMCB8fCB0ZXhJbmRleCA+PSBtb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg57q555CG5Z2Q5qCH57Si5byV6LaK55WMOiAke3RleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoIC0gMX0pYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS5ub3JtYWxJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vcm1hbEluZGV4IG9mIGZhY2Uubm9ybWFsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxJbmRleCA8IDAgfHwgbm9ybWFsSW5kZXggPj0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOazlee6v+e0ouW8lei2iueVjDogJHtub3JtYWxJbmRleH0gKOacgOWkpzogJHttb2RlbC52ZXJ0ZXhOb3JtYWxzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwIFxyXG4gICAgICAgICAgICA/IGDlj5HnjrAgJHtlcnJvcnMubGVuZ3RofSDkuKrplJnor686XFxuJHtlcnJvcnMuam9pbignXFxuJyl9YFxyXG4gICAgICAgICAgICA6ICfmqKHlnovmlbDmja7pqozor4HpgJrov4cnO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL0lucHV0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gXCIuL01vZGVsXCI7XHJcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgQXNzZXRMb2FkZXIgfSBmcm9tIFwiLi9VdGlscy9Bc3NldExvYWRlclwiO1xyXG5cclxuLy8g55S75biD5bC65a+4XHJcbmNvbnN0IGNhbnZhc1dpZHRoID0gNDAwO1xyXG5jb25zdCBjYW52YXNIZWlnaHQgPSA2MDA7XHJcblxyXG4vLyDlr7nosaHliJfooahcclxuY29uc3QgaW5zdGFuY2VzOiBJbnN0YW5jZVtdID0gW107XHJcblxyXG4vLyDlvZNET03lhoXlrrnliqDovb3lrozmiJDlkI7miafooYxcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIC8vIOiOt+WPlmNhbnZhc+WFg+e0oOWSjDJE5riy5p+T5LiK5LiL5paHXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAvLyDorr7nva5jYW52YXPlsLrlr7hcclxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodDtcclxuXHJcbiAgICAvLyDliJvlu7rlm77lg4/mlbDmja7lr7nosaFcclxuICAgIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5jcmVhdGVJbWFnZURhdGEoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XHJcbiAgICAvLyDliJvlu7ozMuS9jeaXoOespuWPt+aVtOWei+aVsOe7hOinhuWbvu+8jOeUqOS6juebtOaOpeaTjeS9nOWDj+e0oOaVsOaNrlxyXG4gICAgY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShpbWFnZURhdGEuZGF0YS5idWZmZXIpO1xyXG5cclxuICAgIC8vIOWIm+W7uua4suafk+WZqOWunuS+i1xyXG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodWludDMyVmlldywgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XHJcblxyXG4gICAgSW5pdCgpO1xyXG5cclxuICAgIC8vIOa4suafk+WHveaVsFxyXG4gICAgZnVuY3Rpb24gbWFpbkxvb3AoKSB7XHJcbiAgICAgICAgLy8g5aSE55CG6YC76L6RXHJcbiAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgLy8g5riy5p+TXHJcbiAgICAgICAgUmVuZGVyKHJlbmRlcmVyKTtcclxuICAgICAgICAvLyDlsIblm77lg4/mlbDmja7nu5jliLbliLBjYW52YXPkuIpcclxuICAgICAgICBjdHgucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgLy8g6K+35rGC5LiL5LiA5bin5Yqo55S7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxuICAgIH1cclxuICAgIC8vIOW8gOWni+WKqOeUu+W+queOr1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxufSk7XHJcblxyXG4vLyDojrflj5bpvKDmoIfkuovku7ZcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAvLyDojrflj5bpvKDmoIfnm7jlr7nkuo5jYW52YXPnmoTlnZDmoIdcclxuICAgIGNvbnN0IHJlY3QgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgICBJbnB1dC5tb3VzZVggPSBtb3VzZVg7XHJcbiAgICBJbnB1dC5tb3VzZVkgPSBtb3VzZVk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gSW5pdCgpIHtcclxuICAgIGxldCBsZWU6IEluc3RhbmNlO1xyXG5cclxuICAgIC8vIOWKoOi9veaooeWei1xyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdsZWUnLCAncmVzb3VyY2VzL2Fzc2V0cy9tZXNoZXMvbGVlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgbGVlID0gaW5zdGFuY2U7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMik7XHJcbiAgICAgICAgaW5zdGFuY2VzLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdjdWJlJywgJ3Jlc291cmNlcy9jdWJlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgNSk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNldFBhcmVudChsZWUudHJhbnNmb3JtKTtcclxuICAgICAgICBpbnN0YW5jZXMucHVzaChpbnN0YW5jZSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gVXBkYXRlKCkge1xyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UubmFtZSA9PSBcImN1YmVcIil7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6K6p54mp5L2T5Zyo5omA5pyJ6L205LiK5peL6L2sXHJcbiAgICAgICAgY29uc3QgZXVsZXJBbmdsZXMgPSBpbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24uZXVsZXJBbmdsZXM7XHJcbiAgICAgICAgZXVsZXJBbmdsZXMueCArPSAwLjAxO1xyXG4gICAgICAgIGV1bGVyQW5nbGVzLnkgKz0gMC4wMjtcclxuICAgICAgICBldWxlckFuZ2xlcy56ICs9IDAuMDE1O1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IG5ldyBRdWF0ZXJuaW9uKGV1bGVyQW5nbGVzKTtcclxuXHJcbiAgICAgICAgLy8g5L2/55Soc2lu5Ye95pWw5a6e546w57yp5pS+5ZyoMC455YiwMS4x5LmL6Ze05b6q546vXHJcbiAgICAgICAgY29uc3Qgc2NhbGVPZmZzZXQgPSBNYXRoLnNpbihEYXRlLm5vdygpICogMC4wMDIpICogMC4xICsgMTtcclxuICAgICAgICBpbnN0YW5jZS50cmFuc2Zvcm0uc2NhbGUueCA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5zY2FsZS55ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlLnogPSBzY2FsZU9mZnNldDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gUmVuZGVyKHJlbmRlcmVyOiBSZW5kZXJlcikge1xyXG4gICAgcmVuZGVyZXIuQ2xlYXIoQ29sb3IuQkxBQ0spO1xyXG5cclxuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2YgaW5zdGFuY2VzKSB7XHJcbiAgICAgICAgcmVuZGVyZXIuRHJhd09iamVjdChpbnN0YW5jZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55S75LiJ6KeS5b2iXHJcbiAgICAvLyByZW5kZXJlci5EcmF3VHJpYW5nbGVGaWxsZWRXaXRoVmVydGV4Q29sb3IoMCwgMCwgMTAwLCAxMDAsIElucHV0Lm1vdXNlWCwgSW5wdXQubW91c2VZLCBDb2xvci5SRUQsIENvbG9yLkdSRUVOLCBDb2xvci5CTFVFKTtcclxufSJdfQ==
