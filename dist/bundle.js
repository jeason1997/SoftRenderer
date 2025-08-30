(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Camera = exports.CameraClearFlags = void 0;
var Color_1 = require("./Color");
var Config_1 = require("./Config");
var Vector4_1 = require("./Math/Vector4");
var Model_1 = require("./Model");
var CameraClearFlags;
(function (CameraClearFlags) {
    CameraClearFlags[CameraClearFlags["NONE"] = 0] = "NONE";
    CameraClearFlags[CameraClearFlags["ALL"] = 16640] = "ALL";
    CameraClearFlags[CameraClearFlags["Color"] = 16384] = "Color";
    CameraClearFlags[CameraClearFlags["Depth"] = 256] = "Depth";
})(CameraClearFlags = exports.CameraClearFlags || (exports.CameraClearFlags = {}));
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera(name) {
        var _this = _super.call(this, name) || this;
        _this.backGroundColor = new Color_1.Color(0.27, 0.27, 0.27, 1.0);
        _this.fogColor = new Color_1.Color(0.27, 0.27, 0.27, 1.0);
        _this.clearFlags = CameraClearFlags.Color | CameraClearFlags.Depth;
        _this.nearClip = 1;
        _this.farClip = 128;
        _this.fov = 60;
        _this.depth = 0;
        _this.viewPort = new Vector4_1.Vector4(0, 0, 1, 1);
        if (Camera.mainCamera == null) {
            Camera.mainCamera = _this;
        }
        Camera.cameras.push(_this);
        return _this;
    }
    Object.defineProperty(Camera.prototype, "aspect", {
        get: function () {
            var v = this.viewPort;
            return (v.z * Config_1.Config.canvasWidth) / (v.w * Config_1.Config.canvasHeight);
        },
        enumerable: false,
        configurable: true
    });
    Camera.cameras = new Array();
    return Camera;
}(Model_1.Instance));
exports.Camera = Camera;
},{"./Color":2,"./Config":3,"./Math/Vector4":9,"./Model":10}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Config = void 0;
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.canvasWidth = 400;
    Config.canvasHeight = 400;
    Config.halfCanvasWidth = Config.canvasWidth >> 1;
    Config.halfCanvasHeight = Config.canvasHeight >> 1;
    Config.aspectRatio = Config.canvasWidth / Config.canvasHeight;
    return Config;
}());
exports.Config = Config;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./Quaternion":6,"./Vector3":8,"./Vector4":9}],6:[function(require,module,exports){
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
},{"./Matrix4x4":5,"./Vector3":8}],7:[function(require,module,exports){
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
},{"./Vector3":8,"./Vector4":9}],8:[function(require,module,exports){
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
},{"./Vector2":7,"./Vector4":9}],9:[function(require,module,exports){
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
},{"./Vector2":7,"./Vector3":8}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Transform = exports.Instance = void 0;
var Matrix4x4_1 = require("./Math/Matrix4x4");
var Quaternion_1 = require("./Math/Quaternion");
var Vector3_1 = require("./Math/Vector3");
var Vector4_1 = require("./Math/Vector4");
var Instance = /** @class */ (function () {
    function Instance(name) {
        this.name = name;
        this.transform = new Transform(name);
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
            //我们要得到的是一个方向，因此不需要位置信息，将齐次坐标的w设置为0，抛弃掉坐标信息
            return this.convertToWorldSpace(Vector3_1.Vector3.FORWARD, 0);
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
},{"./Math/Matrix4x4":5,"./Math/Quaternion":6,"./Math/Vector3":8,"./Math/Vector4":9}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Renderer = void 0;
var Color_1 = require("./Color");
var Vector2_1 = require("./Math/Vector2");
var Camera_1 = require("./Camera");
var Config_1 = require("./Config");
var Vector4_1 = require("./Math/Vector4");
var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["Wireframe"] = 0] = "Wireframe";
    DrawMode[DrawMode["Point"] = 1] = "Point";
    DrawMode[DrawMode["Shader"] = 2] = "Shader";
})(DrawMode || (DrawMode = {}));
var Renderer = /** @class */ (function () {
    function Renderer(uint32View) {
        this.drawMode = DrawMode.Point;
        this.uint32View = uint32View;
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
        if (x < 0 || x >= Config_1.Config.canvasWidth || y < 0 || y >= Config_1.Config.canvasHeight) {
            return;
        }
        this.uint32View[y * Config_1.Config.canvasWidth + x] = color;
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
        var viewportHeight = 1 / Config_1.Config.aspectRatio;
        // 将投影坐标映射到Canvas像素坐标
        // X坐标：从 [-viewportWidth/2, viewportWidth/2] 映射到 [0, canvasWidth]
        // Y坐标：从 [-viewportHeight/2, viewportHeight/2] 映射到 [0, canvasHeight] (注意Y轴方向)
        var canvasX = ((point.x + viewportWidth / 2) / viewportWidth) * Config_1.Config.canvasWidth;
        var canvasY = Config_1.Config.canvasHeight - (((point.y + viewportHeight / 2) / viewportHeight) * Config_1.Config.canvasHeight); // Canvas的Y轴通常是向下的
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
        // 构建MVP矩阵
        var modelMatrix = obj.transform.localToWorldMatrix;
        var camera = Camera_1.Camera.mainCamera;
        var cameraForward = camera.transform.forward;
        var cameraUp = camera.transform.up;
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        var modelViewMatrix = modelMatrix.copy().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        var mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);
        var projectedVertices = new Array(vertices.length);
        // 简单变换
        // for (let i = 0; i < vertices.length; i += 1) {
        //     let vertice = vertices[i].copy();
        //     // 先变换
        //     this.ApplyTransform(vertice, obj.transform);
        //     // 再投影
        //     projectedVertices[i] = this.ProjectVertex(vertice);
        //     // 再视口映射
        //     this.ViewportToCanvas(projectedVertices[i]);
        // }
        // let vs = projectedVertices;
        // MVP变换
        for (var i = 0; i < vertices.length; i += 1) {
            var vertice = vertices[i].copy();
            var v = mvpMatrix.multiplyVector4(new Vector4_1.Vector4(vertice, 1));
            projectedVertices[i] = v;
        }
        // 1. 透视除法：将裁剪空间坐标转换为标准设备坐标（NDC）
        for (var i = 0; i < projectedVertices.length; i++) {
            var v = projectedVertices[i];
            // w分量是透视投影产生的，用于透视除法
            var w = v.w; // 假设你的Vector4/Vector3实现中，齐次坐标w存储在w属性中。如果没有，需要确保MVP变换时处理了齐次坐标。
            // 如果没有显式的w分量，且mvpMatrix.multiplyVector3返回的是Vector3，那么通常认为w=1（正交投影）或者需要从变换矩阵中考虑透视
            // 进行透视除法：xyz分别除以w
            // 注意：如果你的矩阵乘法没有处理齐次坐标（即返回的vertice是三维向量），那么很可能你的变换没有包含透视投影产生的w分量。
            // 假设你的mvpMatrix.multiplyVector3确实返回了包含齐次坐标的Vector4，或者有一个返回Vector4的方法。
            // 这里假设 projectedVertices 中存储的是 Vector4，或者至少有 x, y, z, w 属性。
            // 如果您的实现中，经过透视投影矩阵变换后，顶点已经是一个齐次坐标（x, y, z, w），则需要以下除法：
            v.x = v.x / w;
            v.y = v.y / w;
            v.z = v.z / w; // 对于深度信息，可能还需要进一步处理，但屏幕映射通常主要关注x,y
            // 经过透视除法后，坐标位于标准设备坐标（NDC）空间，通常x, y, z范围在[-1, 1]（OpenGL风格）或[0, 1]（DirectX风格）之间。
            // 假设我们的NDC是[-1, 1]范围。
        }
        // 2. 视口变换：将NDC坐标映射到屏幕坐标
        // 获取画布（或视口）的宽度和高度
        var screenVertices = new Array(projectedVertices.length);
        for (var i = 0; i < projectedVertices.length; i++) {
            var ndc = projectedVertices[i]; // 此时ndc应该是经过透视除法后的NDC坐标
            // 将NDC的x从[-1, 1]映射到[0, screenWidth]
            var screenX_1 = ((ndc.x + 1) / 2) * Config_1.Config.canvasWidth;
            // 将NDC的y从[-1, 1]映射到[0, screenHeight]。注意屏幕坐标通常y向下为正，而NDC的y向上为正，所以需要翻转
            var screenY_1 = Config_1.Config.canvasHeight - (((ndc.y + 1) / 2) * Config_1.Config.canvasHeight);
            // z分量通常用于深度测试，这里我们只关心屏幕x,y
            // 如果你的NDCz范围是[-1,1]且需要映射到[0,1]（例如WebGPU某些情况），可以类似处理：const screenZ = (ndc.z + 1) / 2;
            screenVertices[i] = { x: screenX_1, y: screenY_1 }; // 存储屏幕坐标
        }
        var vs = screenVertices;
        // 最后绘制三角形到屏幕上
        for (var i = 0; i < indices.length; i += 3) {
            var p1 = vs[indices[i]];
            var p2 = vs[indices[i + 1]];
            var p3 = vs[indices[i + 2]];
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
},{"./Camera":1,"./Color":2,"./Config":3,"./Math/Vector2":7,"./Math/Vector4":9}],12:[function(require,module,exports){
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
                        instance = new Model_1.Instance(name);
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
},{"../Math/Quaternion":6,"../Math/Vector3":8,"../Model":10,"./Dictionary":13,"./ObjParser":14}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"../Math/Vector2":7,"../Math/Vector3":8}],15:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Camera_1 = require("./Camera");
var Color_1 = require("./Color");
var Config_1 = require("./Config");
var Input_1 = require("./Input");
var Quaternion_1 = require("./Math/Quaternion");
var Vector3_1 = require("./Math/Vector3");
var Renderer_1 = require("./Renderer");
var AssetLoader_1 = require("./Utils/AssetLoader");
// 对象列表
var instances = [];
// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取canvas元素和2D渲染上下文
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // 设置canvas尺寸
    canvas.width = Config_1.Config.canvasWidth;
    canvas.height = Config_1.Config.canvasHeight;
    // 创建图像数据对象
    var imageData = ctx.createImageData(Config_1.Config.canvasWidth, Config_1.Config.canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    var uint32View = new Uint32Array(imageData.data.buffer);
    // 创建渲染器实例
    var renderer = new Renderer_1.Renderer(uint32View);
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
    // 相机
    var camera = new Camera_1.Camera("camera");
    //camera.transform.position = new Vector3(0, 0, -10);
    // 加载模型
    AssetLoader_1.AssetLoader.loadInstanceFromModel('lee', 'resources/assets/meshes/lee.obj').then(function (instance) {
        lee = instance;
        instance.transform.position = new Vector3_1.Vector3(0, 0, 2);
        instances.push(instance);
    });
    AssetLoader_1.AssetLoader.loadInstanceFromModel('cube', 'resources/cube.obj').then(function (instance) {
        instance.transform.position = new Vector3_1.Vector3(1, 0, 0);
        instance.transform.scale = new Vector3_1.Vector3(0.1, 0.1, 0.1);
        //instance.transform.rotation = new Quaternion(new Vector3(0, 45, 0));
        instance.transform.setParent(lee.transform, false);
        instances.push(instance);
    });
}
var angle = 0;
function Update() {
    for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
        var instance = instances_1[_i];
        if (instance.name == "cube") {
            // 使用sin函数实现缩放在0.9到1.1之间循环
            var scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
            var scale = instance.transform.scale;
            scale.x = scaleOffset;
            scale.y = scaleOffset;
            scale.z = scaleOffset;
            instance.transform.scale = scale;
            instance.transform.rotation = Quaternion_1.Quaternion.angleAxis(angle, Vector3_1.Vector3.FORWARD);
            angle += 1;
            continue;
        }
        // 让物体在所有轴上旋转
        instance.transform.rotation = Quaternion_1.Quaternion.angleAxis(angle, Vector3_1.Vector3.UP);
        // angle += 1;
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
},{"./Camera":1,"./Color":2,"./Config":3,"./Input":4,"./Math/Quaternion":6,"./Math/Vector3":8,"./Renderer":11,"./Utils/AssetLoader":12}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FtZXJhLnRzIiwic3JjL0NvbG9yLnRzIiwic3JjL0NvbmZpZy50cyIsInNyYy9JbnB1dC50cyIsInNyYy9NYXRoL01hdHJpeDR4NC50cyIsInNyYy9NYXRoL1F1YXRlcm5pb24udHMiLCJzcmMvTWF0aC9WZWN0b3IyLnRzIiwic3JjL01hdGgvVmVjdG9yMy50cyIsInNyYy9NYXRoL1ZlY3RvcjQudHMiLCJzcmMvTW9kZWwudHMiLCJzcmMvUmVuZGVyZXIudHMiLCJzcmMvVXRpbHMvQXNzZXRMb2FkZXIudHMiLCJzcmMvVXRpbHMvRGljdGlvbmFyeS50cyIsInNyYy9VdGlscy9PYmpQYXJzZXIudHMiLCJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUNBQWdDO0FBQ2hDLG1DQUFrQztBQUNsQywwQ0FBeUM7QUFDekMsaUNBQW1DO0FBRW5DLElBQVksZ0JBS1g7QUFMRCxXQUFZLGdCQUFnQjtJQUN4Qix1REFBUSxDQUFBO0lBQ1IseURBQWlCLENBQUE7SUFDakIsNkRBQWEsQ0FBQTtJQUNiLDJEQUFXLENBQUE7QUFDZixDQUFDLEVBTFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFLM0I7QUFFRDtJQUE0QiwwQkFBUTtJQWtCaEMsZ0JBQVksSUFBWTtRQUF4QixZQUNJLGtCQUFNLElBQUksQ0FBQyxTQUtkO1FBcEJNLHFCQUFlLEdBQVUsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUQsY0FBUSxHQUFVLElBQUksYUFBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELGdCQUFVLEdBQXFCLGdCQUFnQixDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7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SSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxnQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUU3QixnREFBZ0Q7SUFDaEQsZ0dBQWdHO0lBQ2hHLGdEQUFnRDtJQUVoRCxtRkFBbUY7SUFDbkYsSUFBSTtJQUVHLDZCQUFTLEdBQWhCO1FBQ0ksc0JBQXNCO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7UUFDN0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsMkJBQTJCO1lBQ3ZDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNKO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFDSSxpRUFBaUU7UUFDakUsZ0NBQWdDO1FBQ2hDLGdEQUFnRDtRQUNoRCxZQUFZO1FBRVosSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUViLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxrQ0FBYyxHQUFyQjtRQUNJLGlFQUFpRTtRQUNqRSxhQUFhO1FBQ2IsWUFBWTtRQUVaLElBQUksS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBRTFCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3hCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDMUIsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLEVBQUU7WUFDM0IsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0gsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLGlCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVMsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUs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LENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNqRixJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDJCQUFPLEdBQWQ7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXRCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM1RCxlQUFlO1NBQ2xCO1FBRUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBRTNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxpQ0FBYSxHQUFwQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsMEJBQTBCO1FBQzFCLE9BQU8sSUFBSSxZQUFZLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0JBQUksR0FBWDtRQUNJLE9BQU8sSUFBSSxTQUFTLENBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2pCLENBQUM7SUFDTixDQUFDO0lBRUQ7O09BRUc7SUFFVyxzQkFBWSxHQUExQixVQUEyQixHQUFZLEVBQUUsSUFBZ0IsRUFBRSxLQUFjO1FBQ3JFLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QyxtREFBbUQ7UUFDbkQsaURBQWlEO1FBQ2pELDBEQUEwRDtRQUMxRCx3REFBd0Q7UUFDeEQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRWEsNEJBQWtCLEdBQWhDLFVBQWlDLEdBQVk7UUFDekMsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHFDQUEyQixHQUF6QyxVQUEwQyxDQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFH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QUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QixLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQzlCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2QsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ1QsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRWEsd0JBQWMsR0FBNUIsVUFBNkIsQ0FBVTtRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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QztZQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUlELDBCQUFRLEdBQVI7UUFDSSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxPQUFPLEVBQUU7WUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDBCQUFRLEdBQWYsVUFBZ0IsQ0FBUztRQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sd0JBQU0sR0FBYixVQUFjLENBQVM7UUFD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LElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLFNBQVM7UUFDVCxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsU0FBUztRQUNULElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVDLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxVQUFVO1FBQ1YsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDN0MsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDN0MsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU0sa0NBQWUsR0FBdEIsVUFBdUIsTUFBZSxFQUFFLFNBQW9CO1FBQ3hELE1BQU0sQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDakMs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O0lBRUQsT0FBTztJQUNQLDhIQUE4SDtBQUNsSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gXCIuL01vZGVsXCI7XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFDbGVhckZsYWdzIHtcclxuICAgIE5PTkUgPSAwLFxyXG4gICAgQUxMID0gMTYzODQgfCAyNTYsXHJcbiAgICBDb2xvciA9IDE2Mzg0LCAgLy9nbC5DT0xPUl9CVUZGRVJfQklUXHJcbiAgICBEZXB0aCA9IDI1NiwgICAgLy9nbC5ERVBUSF9CVUZGRVJfQklUXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEgZXh0ZW5kcyBJbnN0YW5jZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1haW5DYW1lcmE6IENhbWVyYTtcclxuICAgIHByaXZhdGUgc3RhdGljIGNhbWVyYXM6IEFycmF5PENhbWVyYT4gPSBuZXcgQXJyYXk8Q2FtZXJhPigpO1xyXG5cclxuICAgIHB1YmxpYyBiYWNrR3JvdW5kQ29sb3I6IENvbG9yID0gbmV3IENvbG9yKDAuMjcsIDAuMjcsIDAuMjcsIDEuMCk7XHJcbiAgICBwdWJsaWMgZm9nQ29sb3I6IENvbG9yID0gbmV3IENvbG9yKDAuMjcsIDAuMjcsIDAuMjcsIDEuMCk7XHJcbiAgICBwdWJsaWMgY2xlYXJGbGFnczogQ2FtZXJhQ2xlYXJGbGFncyA9IENhbWVyYUNsZWFyRmxhZ3MuQ29sb3IgfCBDYW1lcmFDbGVhckZsYWdzLkRlcHRoO1xyXG4gICAgcHVibGljIG5lYXJDbGlwOiBudW1iZXIgPSAxO1xyXG4gICAgcHVibGljIGZhckNsaXA6IG51bWJlciA9IDEyODtcclxuICAgIHB1YmxpYyBmb3Y6IG51bWJlciA9IDYwO1xyXG4gICAgcHVibGljIGRlcHRoOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHZpZXdQb3J0OiBWZWN0b3I0ID0gbmV3IFZlY3RvcjQoMCwgMCwgMSwgMSk7XHJcblxyXG4gICAgcHVibGljIGdldCBhc3BlY3QoKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgdiA9IHRoaXMudmlld1BvcnQ7XHJcbiAgICAgICAgcmV0dXJuICh2LnogKiBDb25maWcuY2FudmFzV2lkdGgpIC8gKHYudyAqIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIGlmIChDYW1lcmEubWFpbkNhbWVyYSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQ2FtZXJhLmNhbWVyYXMucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZGVzdHJveSgpIHtcclxuICAgIC8vICAgICB2YXIgaW5kZXggPSBDYW1lcmEuY2FtZXJhcy5pbmRleE9mKHRoaXMsIDApO1xyXG4gICAgLy8gICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAvLyAgICAgICAgIENhbWVyYS5jYW1lcmFzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICBpZiAoQ2FtZXJhLm1haW5DYW1lcmEgPT0gdGhpcykge1xyXG4gICAgLy8gICAgICAgICBpZiAoQ2FtZXJhLmNhbWVyYXMubGVuZ3RoID4gMClcclxuICAgIC8vICAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gQ2FtZXJhLmNhbWVyYXNbMF07XHJcbiAgICAvLyAgICAgICAgIGVsc2VcclxuICAgIC8vICAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gbnVsbDtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBXSElURSA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTEFDSyA9IG5ldyBDb2xvcigwLCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkFZID0gbmV3IENvbG9yKDEyOCwgMTI4LCAxMjgpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFRCA9IG5ldyBDb2xvcigyNTUsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSRUVOID0gbmV3IENvbG9yKDAsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxVRSA9IG5ldyBDb2xvcigwLCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFlFTExPVyA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1lBTiA9IG5ldyBDb2xvcigwLCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFHRU5UQSA9IG5ldyBDb2xvcigyNTUsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT1JBTkdFID0gbmV3IENvbG9yKDI1NSwgMTY1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVVJQTEUgPSBuZXcgQ29sb3IoMTI4LCAwLCAxMjgpLlRvVWludDMyKCk7XHJcblxyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG4gICAgcHVibGljIGE6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgPSAyNTUpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUb1VpbnQzMigpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuYSA8PCAyNCkgfCAodGhpcy5iIDw8IDE2KSB8ICh0aGlzLmcgPDwgOCkgfCB0aGlzLnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGcm9tVWludDMyKHVpbnQzMjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgdWludDMyICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiA4KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMTYpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAyNCkgJiAweEZGXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb25maWcge1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXNXaWR0aDogbnVtYmVyID0gNDAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXNIZWlnaHQ6IG51bWJlciA9IDQwMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFsZkNhbnZhc1dpZHRoOiBudW1iZXIgPSBDb25maWcuY2FudmFzV2lkdGggPj4gMTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFsZkNhbnZhc0hlaWdodDogbnVtYmVyID0gQ29uZmlnLmNhbnZhc0hlaWdodCA+PiAxO1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3BlY3RSYXRpbzogbnVtYmVyID0gQ29uZmlnLmNhbnZhc1dpZHRoIC8gQ29uZmlnLmNhbnZhc0hlaWdodDtcclxufSIsImV4cG9ydCBjbGFzcyBJbnB1dCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlWDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VZOiBudW1iZXIgPSAwO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL1F1YXRlcm5pb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXg0eDQge1xyXG5cclxuICAgIHB1YmxpYyBtYXRyaXg6IEFycmF5PEFycmF5PG51bWJlcj4+ID0gbmV3IEFycmF5PEFycmF5PG51bWJlcj4+KCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29sdW1uMDogVmVjdG9yNCwgY29sdW1uMTogVmVjdG9yNCwgY29sdW1uMjogVmVjdG9yNCwgY29sdW1uMzogVmVjdG9yNCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgPSBhcmd1bWVudHNbaV0gYXMgVmVjdG9yNDtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2ldID0gbmV3IEFycmF5PG51bWJlcj4odi54LCB2LnksIHYueiwgdi53KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2ldID0gbmV3IEFycmF5PG51bWJlcj4oMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDooYxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFJvdyhpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLm1hdHJpeFtpbmRleF07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KGNbMF0sIGNbMV0sIGNbMl0sIGNbM10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg5YiXXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb2x1bW4oaW5kZXg6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCh0aGlzLm1hdHJpeFswXVtpbmRleF0sIHRoaXMubWF0cml4WzFdW2luZGV4XSwgdGhpcy5tYXRyaXhbMl1baW5kZXhdLCB0aGlzLm1hdHJpeFszXVtpbmRleF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTZXRSb3coaW5kZXg6IG51bWJlciwgcm93OiBWZWN0b3I0KSB7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzBdID0gcm93Lng7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzFdID0gcm93Lnk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzJdID0gcm93Lno7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzNdID0gcm93Lnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldENvbHVtbihpbmRleDogbnVtYmVyLCBjb2x1bW46IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFswXVtpbmRleF0gPSBjb2x1bW4ueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFsxXVtpbmRleF0gPSBjb2x1bW4ueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFsyXVtpbmRleF0gPSBjb2x1bW4uejtcclxuICAgICAgICB0aGlzLm1hdHJpeFszXVtpbmRleF0gPSBjb2x1bW4udztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkobTogTWF0cml4NHg0KTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbGhzID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHJocyA9IG0ubWF0cml4O1xyXG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgTWF0cml4NHg0KCkubWF0cml4O1xyXG5cclxuICAgICAgICBtYXRyaXhbMF1bMF0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMF1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzBdWzFdID0gbGhzWzBdWzBdICogcmhzWzBdWzFdICsgbGhzWzBdWzFdICogcmhzWzFdWzFdICsgbGhzWzBdWzJdICogcmhzWzJdWzFdICsgbGhzWzBdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFswXVsyXSA9IGxoc1swXVswXSAqIHJoc1swXVsyXSArIGxoc1swXVsxXSAqIHJoc1sxXVsyXSArIGxoc1swXVsyXSAqIHJoc1syXVsyXSArIGxoc1swXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMF1bM10gPSBsaHNbMF1bMF0gKiByaHNbMF1bM10gKyBsaHNbMF1bMV0gKiByaHNbMV1bM10gKyBsaHNbMF1bMl0gKiByaHNbMl1bM10gKyBsaHNbMF1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzFdWzBdID0gbGhzWzFdWzBdICogcmhzWzBdWzBdICsgbGhzWzFdWzFdICogcmhzWzFdWzBdICsgbGhzWzFdWzJdICogcmhzWzJdWzBdICsgbGhzWzFdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsxXSA9IGxoc1sxXVswXSAqIHJoc1swXVsxXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsxXSArIGxoc1sxXVsyXSAqIHJoc1syXVsxXSArIGxoc1sxXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMV1bMl0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMV1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzFdWzNdID0gbGhzWzFdWzBdICogcmhzWzBdWzNdICsgbGhzWzFdWzFdICogcmhzWzFdWzNdICsgbGhzWzFdWzJdICogcmhzWzJdWzNdICsgbGhzWzFdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFsyXVswXSA9IGxoc1syXVswXSAqIHJoc1swXVswXSArIGxoc1syXVsxXSAqIHJoc1sxXVswXSArIGxoc1syXVsyXSAqIHJoc1syXVswXSArIGxoc1syXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMl1bMV0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMl1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzJdWzJdID0gbGhzWzJdWzBdICogcmhzWzBdWzJdICsgbGhzWzJdWzFdICogcmhzWzFdWzJdICsgbGhzWzJdWzJdICogcmhzWzJdWzJdICsgbGhzWzJdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFsyXVszXSA9IGxoc1syXVswXSAqIHJoc1swXVszXSArIGxoc1syXVsxXSAqIHJoc1sxXVszXSArIGxoc1syXVsyXSAqIHJoc1syXVszXSArIGxoc1syXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbM11bMF0gPSBsaHNbM11bMF0gKiByaHNbMF1bMF0gKyBsaHNbM11bMV0gKiByaHNbMV1bMF0gKyBsaHNbM11bMl0gKiByaHNbMl1bMF0gKyBsaHNbM11bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzNdWzFdID0gbGhzWzNdWzBdICogcmhzWzBdWzFdICsgbGhzWzNdWzFdICogcmhzWzFdWzFdICsgbGhzWzNdWzJdICogcmhzWzJdWzFdICsgbGhzWzNdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFszXVsyXSA9IGxoc1szXVswXSAqIHJoc1swXVsyXSArIGxoc1szXVsxXSAqIHJoc1sxXVsyXSArIGxoc1szXVsyXSAqIHJoc1syXVsyXSArIGxoc1szXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbM11bM10gPSBsaHNbM11bMF0gKiByaHNbMF1bM10gKyBsaHNbM11bMV0gKiByaHNbMV1bM10gKyBsaHNbM11bMl0gKiByaHNbMl1bM10gKyBsaHNbM11bM10gKiByaHNbM11bM107XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVZlY3RvcjModjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHJlcy54ID0gbVswXVswXSAqIHYueCArIG1bMF1bMV0gKiB2LnkgKyBtWzBdWzJdICogdi56O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56O1xyXG4gICAgICAgIHJlcy56ID0gbVsyXVswXSAqIHYueCArIG1bMl1bMV0gKiB2LnkgKyBtWzJdWzJdICogdi56O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVZlY3RvcjQodjogVmVjdG9yNCk6IFZlY3RvcjQge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgVmVjdG9yNCgpO1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHJlcy54ID0gbVswXVswXSAqIHYueCArIG1bMF1bMV0gKiB2LnkgKyBtWzBdWzJdICogdi56ICsgbVswXVszXSAqIHYudztcclxuICAgICAgICByZXMueSA9IG1bMV1bMF0gKiB2LnggKyBtWzFdWzFdICogdi55ICsgbVsxXVsyXSAqIHYueiArIG1bMV1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2LnogKyBtWzJdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy53ID0gbVszXVswXSAqIHYueCArIG1bM11bMV0gKiB2LnkgKyBtWzNdWzJdICogdi56ICsgbVszXVszXSAqIHYudztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VHJhbnNsYXRlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKG1bMF1bM10sIG1bMV1bM10sIG1bMl1bM10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRSb3RhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAvLyAgICAgbGV0IG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgIC8vICAgICBsZXQgeCA9IE1hdGguYXRhbjIobWF0WzFdWzJdLCBtYXRbMl1bMl0pO1xyXG4gICAgLy8gICAgIGxldCB5ID0gTWF0aC5hdGFuMigtbWF0WzBdWzJdLCBNYXRoLnNxcnQobWF0WzFdWzJdICogbWF0WzFdWzJdICsgbWF0WzJdWzJdICogbWF0WzJdWzJdKSk7XHJcbiAgICAvLyAgICAgbGV0IHogPSBNYXRoLmF0YW4yKG1hdFswXVsxXSwgbWF0WzBdWzBdKTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHggLyBNYXRoLlBJICogMTgwLCB5IC8gTWF0aC5QSSAqIDE4MCwgeiAvIE1hdGguUEkgKiAxODApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSb3RhdGUoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgLy/kuIDlrpropoHojrflj5bnuq/lh4DnmoTml4vovaznn6npmLXvvIzljbPljrvpmaTnvKnmlL7lgI3njodcclxuICAgICAgICBsZXQgbWF0ID0gdGhpcy5nZXRSb3RhdGVNYXRyaXgoKS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHEgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICB2YXIgdHJhY2UgPSBtYXRbMF1bMF0gKyBtYXRbMV1bMV0gKyBtYXRbMl1bMl07IC8vIEkgcmVtb3ZlZCArIDEuMGY7IHNlZSBkaXNjdXNzaW9uIHdpdGggRXRoYW5cclxuICAgICAgICB2YXIgcyA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0cmFjZSA+IDApIHsvLyBJIGNoYW5nZWQgTV9FUFNJTE9OIHRvIDBcclxuICAgICAgICAgICAgcyA9IDAuNSAvIE1hdGguc3FydCh0cmFjZSArIDEuMCk7XHJcbiAgICAgICAgICAgIHEudyA9IDAuMjUgLyBzO1xyXG4gICAgICAgICAgICBxLnggPSAobWF0WzJdWzFdIC0gbWF0WzFdWzJdKSAqIHM7XHJcbiAgICAgICAgICAgIHEueSA9IChtYXRbMF1bMl0gLSBtYXRbMl1bMF0pICogcztcclxuICAgICAgICAgICAgcS56ID0gKG1hdFsxXVswXSAtIG1hdFswXVsxXSkgKiBzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtYXRbMF1bMF0gPiBtYXRbMV1bMV0gJiYgbWF0WzBdWzBdID4gbWF0WzJdWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFswXVswXSAtIG1hdFsxXVsxXSAtIG1hdFsyXVsyXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzJdWzFdIC0gbWF0WzFdWzJdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAwLjI1ICogcztcclxuICAgICAgICAgICAgICAgIHEueSA9IChtYXRbMF1bMV0gKyBtYXRbMV1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueiA9IChtYXRbMF1bMl0gKyBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRbMV1bMV0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzFdWzFdIC0gbWF0WzBdWzBdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMF1bMl0gLSBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IChtYXRbMF1bMV0gKyBtYXRbMV1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueSA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFsxXVsyXSArIG1hdFsyXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMl1bMl0gLSBtYXRbMF1bMF0gLSBtYXRbMV1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFsxXVswXSAtIG1hdFswXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFsxXVsyXSArIG1hdFsyXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSb3RhdGVNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9kZXYvc3JjL21hdGgvTWF0cml4NC5qc1xyXG4gICAgICAgIC8v5Zug5Li65peL6L2s55+p6Zi15q+U6L6D54m55q6K77yM5pyJ5pe25YCZ6KaB5Y2V54us5aSE55CG77yM5omA5pyJ5oul5pyJ5LiA5Liq5o+Q5Y+W5pa55rOVXHJcbiAgICAgICAgLy/mj5Dlj5bmlrnlvI/lvojnroDljZXvvIzlhYjojrflj5bnvKnmlL7lgLzvvIznhLblkI7liKnnlKjojrflj5bnvKnmlL7lgLznmoTljp/nkIbvvIzpgIblkJHpmaTljrvnvKnmlL7lgLzvvIzlsLHlvpfliLDnuq/lh4DnmoTml4vovaznn6npmLVcclxuICAgICAgICAvL+atpOaWueazleS4jeaUr+aMgeWPjeWwhOefqemYtVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIHZhciB0ZSA9IG1hdC5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuZ2V0U2NhbGUoKTtcclxuICAgICAgICB2YXIgc2NhbGVYID0gMSAvIHNjYWxlLng7XHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IDEgLyBzY2FsZS55O1xyXG4gICAgICAgIHZhciBzY2FsZVogPSAxIC8gc2NhbGUuejtcclxuXHJcbiAgICAgICAgdGVbMF1bMF0gPSBtZVswXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVsxXVswXSA9IG1lWzFdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzJdWzBdID0gbWVbMl1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbM11bMF0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVsxXSA9IG1lWzBdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzFdWzFdID0gbWVbMV1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMl1bMV0gPSBtZVsyXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVszXVsxXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzJdID0gbWVbMF1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbMV1bMl0gPSBtZVsxXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsyXVsyXSA9IG1lWzJdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzNdWzJdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bM10gPSAwO1xyXG4gICAgICAgIHRlWzFdWzNdID0gMDtcclxuICAgICAgICB0ZVsyXVszXSA9IDA7XHJcbiAgICAgICAgdGVbM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFdWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9kZXYvc3JjL21hdGgvTWF0cml4NC5qc1xyXG4gICAgICAgIC8v5LuO5peL6L2s55+p6Zi16YeM6I635Y+W5qyn5ouJ6KeSXHJcbiAgICAgICAgLy/lv4XpobvmmK/nuq/lh4DnmoTml4vovaznn6npmLVcclxuXHJcbiAgICAgICAgdmFyIGFuZ2xlID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRlID0gdGhpcy5nZXRSb3RhdGVNYXRyaXgoKS5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0xMSA9IHRlWzBdWzBdLCBtMTIgPSB0ZVswXVsxXSwgbTEzID0gdGVbMF1bMl07XHJcbiAgICAgICAgdmFyIG0yMSA9IHRlWzFdWzBdLCBtMjIgPSB0ZVsxXVsxXSwgbTIzID0gdGVbMV1bMl07XHJcbiAgICAgICAgdmFyIG0zMSA9IHRlWzJdWzBdLCBtMzIgPSB0ZVsyXVsxXSwgbTMzID0gdGVbMl1bMl07XHJcblxyXG4gICAgICAgIG0xMyA9IG0xMyA+IDEgPyAxIDogbTEzO1xyXG4gICAgICAgIG0xMyA9IG0xMyA8IC0xID8gLTEgOiBtMTM7XHJcbiAgICAgICAgYW5nbGUueSA9IE1hdGguYXNpbihtMTMpO1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMobTEzKSA8IDAuOTk5OTk5OSkge1xyXG4gICAgICAgICAgICBhbmdsZS54ID0gTWF0aC5hdGFuMigtbTIzLCBtMzMpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gTWF0aC5hdGFuMigtbTEyLCBtMTEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKG0zMiwgbTIyKTtcclxuICAgICAgICAgICAgYW5nbGUueiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoYW5nbGUueCAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnkgLyBNYXRoLlBJICogMTgwLCBhbmdsZS56IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHYgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2LnggPSBNYXRoLnNxcnQobVswXVswXSAqIG1bMF1bMF0gKyBtWzFdWzBdICogbVsxXVswXSArIG1bMl1bMF0gKiBtWzJdWzBdKTtcclxuICAgICAgICB2LnkgPSBNYXRoLnNxcnQobVswXVsxXSAqIG1bMF1bMV0gKyBtWzFdWzFdICogbVsxXVsxXSArIG1bMl1bMV0gKiBtWzJdWzFdKTtcclxuICAgICAgICB2LnogPSBNYXRoLnNxcnQobVswXVsyXSAqIG1bMF1bMl0gKyBtWzFdWzJdICogbVsxXVsyXSArIG1bMl1bMl0gKiBtWzJdWzJdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zcG9zZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtMSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIHZhciBtMiA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG0yWzBdWzBdID0gbTFbMF1bMF07IG0yWzBdWzFdID0gbTFbMV1bMF07IG0yWzBdWzJdID0gbTFbMl1bMF07IG0yWzBdWzNdID0gbTFbM11bMF07XHJcbiAgICAgICAgbTJbMV1bMF0gPSBtMVswXVsxXTsgbTJbMV1bMV0gPSBtMVsxXVsxXTsgbTJbMV1bMl0gPSBtMVsyXVsxXTsgbTJbMV1bM10gPSBtMVszXVsxXTtcclxuICAgICAgICBtMlsyXVswXSA9IG0xWzBdWzJdOyBtMlsyXVsxXSA9IG0xWzFdWzJdOyBtMlsyXVsyXSA9IG0xWzJdWzJdOyBtMlsyXVszXSA9IG0xWzNdWzJdO1xyXG4gICAgICAgIG0yWzNdWzBdID0gbTFbMF1bM107IG0yWzNdWzFdID0gbTFbMV1bM107IG0yWzNdWzJdID0gbTFbMl1bM107IG0yWzNdWzNdID0gbTFbM11bM107XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbTI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZShwb3M6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gTWF0cml4NHg0LmdldFRyYW5zbGF0ZU1hdHJpeChwb3MpO1xyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZShxOiBRdWF0ZXJuaW9uKTogTWF0cml4NHg0O1xyXG4gICAgcHVibGljIHJvdGF0ZShldWxlckFuZ2xlczogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgcm90YXRlKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKCkge1xyXG4gICAgICAgIGxldCBtID0gbmV3IE1hdHJpeDR4NCgpO1xyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgUXVhdGVybmlvbikge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUoczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgocyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9va0F0KHRhcmdldDogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy8gdG9kb1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8v6L2s5o2i5Yiw5pGE5b2x5py655yL5ZCR55qE55+p6Zi16YeMXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtVG9Mb29rQXRTcGFjZShleWU6IFZlY3RvcjMsIHRhcmdldFBvaW50OiBWZWN0b3IzLCB1cDogVmVjdG9yMyA9IFZlY3RvcjMuVVApOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v5LuO5ZOq6YeM55yL5ZCR5ZOq6YeM77yM5Lmf5Y+v5Lul55CG6Kej5Li65pGE5b2x5py66KeG6KeS77yM5Y2z6KeC5a+f56m66Ze0XHJcbiAgICAgICAgLy/oi6XopoHlj5jmjaLliLDmkYTlvbHmnLrnqbrpl7TvvIzlj6/ku6XlgYforr7mlbTkuKrop4Llr5/nqbrpl7Tku6XmkYTlvbHmnLrkvY3kuo7kuJbnlYzlnZDmoIfljp/ngrnvvIznhLblkI7lsIbmiYDmnInniankvZPmnJ3mkYTlvbHmnLrljp/lhYjlnKjkuJbnlYznqbrpl7TkuK3nmoTkvY3nva7lj43lkJHnp7vliqjljbPlj69cclxuICAgICAgICAvL+WcqOe6uOS4iueUu+S4i+WbvuWwsea4heaZsOS6hlxyXG5cclxuICAgICAgICAvL+eUseS6jum7mOiupOefqemYteaYr1NSVOmhuuW6j+e7hOaIkOeahOWPmOaNouepuumXtO+8jOimgemAhuWQke+8jOWImeaYr1RSU+eahOmhuuW6j++8jOWNs+WFiOenu+WKqOWQjuaXi+i9rFxyXG4gICAgICAgIC8vMS7lkJHlj43mlrnlkJHlubPnp7tcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShuZXcgVmVjdG9yMygtZXllLngsIC1leWUueSwgLWV5ZS56KSk7XHJcblxyXG4gICAgICAgIC8vMi7lkJHlj43mlrnlkJHml4vovaxcclxuICAgICAgICAvL+WFiOiOt+WPluaRhOW9seS4lueVjOmDqOWdkOagh+i9tFxyXG4gICAgICAgIHZhciB6QXhpcyA9IFZlY3RvcjMuZGlmZmVyZW5jZShleWUsIHRhcmdldFBvaW50KS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+WboOS4uuaIkeS7rOaYr+WPs+aJi+ezu+e7n++8jOimgeaxgljvvIzliJnlv4Xpobt65LmYeVxyXG4gICAgICAgIHZhciB4QXhpcyA9IFZlY3RvcjMuY3Jvc3ModXAsIHpBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICB2YXIgeUF4aXMgPSBWZWN0b3IzLmNyb3NzKHpBeGlzLCB4QXhpcykubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy/mnoTlu7rmkYTlvbHmnLrlj43mlrnlkJHml4vovaznn6npmLVcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoeEF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh5QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHpBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSkpO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZydXN0dW0obGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KChuZWFyICogMikgLyBybCwgMCwgKHJpZ2h0ICsgbGVmdCkgLyBybCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIChuZWFyICogMikgLyB0YiwgKHRvcCArIGJvdHRvbSkgLyB0YiwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyBmbiwgLShmYXIgKiBuZWFyICogMikgLyBmbiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0xLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3J0aG9ncmFwaGljKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBybCA9IChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgY29uc3QgdGIgPSAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGNvbnN0IGZuID0gKGZhciAtIG5lYXIpXHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgyIC8gcmwsIDAsIDAsIC0obGVmdCArIHJpZ2h0KSAvIHJsKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMiAvIHRiLCAwLCAtKHRvcCArIGJvdHRvbSkgLyB0YiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0yIC8gZm4sIC0oZmFyICsgbmVhcikgLyBmbiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDEpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwZXJzcGVjdGl2ZShmb3Y6IG51bWJlciwgYXNwZWN0OiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IGhmb3YgPSBmb3YgLyAxODAgKiBNYXRoLlBJIC8gMjtcclxuICAgICAgICBjb25zdCB0YW4gPSBNYXRoLnRhbihoZm92KTtcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDEgLyAoYXNwZWN0ICogdGFuKSwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDEgLyB0YW4sIDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtKGZhciArIG5lYXIpIC8gKGZhciAtIG5lYXIpLCAtKDIgKiBmYXIgKiBuZWFyKSAvIChmYXIgLSBuZWFyKSksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0xLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW52ZXJzZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBtYXQgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgY29uc3QgYTAwID0gbWF0WzBdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEwMSA9IG1hdFswXVsxXTtcclxuICAgICAgICBjb25zdCBhMDIgPSBtYXRbMF1bMl07XHJcbiAgICAgICAgY29uc3QgYTAzID0gbWF0WzBdWzNdO1xyXG4gICAgICAgIGNvbnN0IGExMCA9IG1hdFsxXVswXTtcclxuICAgICAgICBjb25zdCBhMTEgPSBtYXRbMV1bMV07XHJcbiAgICAgICAgY29uc3QgYTEyID0gbWF0WzFdWzJdO1xyXG4gICAgICAgIGNvbnN0IGExMyA9IG1hdFsxXVszXTtcclxuICAgICAgICBjb25zdCBhMjAgPSBtYXRbMl1bMF07XHJcbiAgICAgICAgY29uc3QgYTIxID0gbWF0WzJdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEyMiA9IG1hdFsyXVsyXTtcclxuICAgICAgICBjb25zdCBhMjMgPSBtYXRbMl1bM107XHJcbiAgICAgICAgY29uc3QgYTMwID0gbWF0WzNdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEzMSA9IG1hdFszXVsxXTtcclxuICAgICAgICBjb25zdCBhMzIgPSBtYXRbM11bMl07XHJcbiAgICAgICAgY29uc3QgYTMzID0gbWF0WzNdWzNdO1xyXG5cclxuICAgICAgICBjb25zdCBkZXQwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAxID0gYTAwICogYTEyIC0gYTAyICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMVxyXG4gICAgICAgIGNvbnN0IGRldDA0ID0gYTAxICogYTEzIC0gYTAzICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTJcclxuICAgICAgICBjb25zdCBkZXQwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGRldDEwID0gYTIxICogYTMzIC0gYTIzICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzJcclxuXHJcbiAgICAgICAgbGV0IGRldCA9IChkZXQwMCAqIGRldDExIC0gZGV0MDEgKiBkZXQxMCArIGRldDAyICogZGV0MDkgKyBkZXQwMyAqIGRldDA4IC0gZGV0MDQgKiBkZXQwNyArIGRldDA1ICogZGV0MDYpO1xyXG5cclxuICAgICAgICBpZiAoIWRldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTWF0cml4NHg0IGludmVyc2UgZmFpbGVkLCBkZXRlcm1pbmFudCBpcyAwXCIpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuXHJcbiAgICAgICAgbWF0WzBdWzBdID0gKGExMSAqIGRldDExIC0gYTEyICogZGV0MTAgKyBhMTMgKiBkZXQwOSkgKiBkZXRcclxuICAgICAgICBtYXRbMF1bMV0gPSAoLWEwMSAqIGRldDExICsgYTAyICogZGV0MTAgLSBhMDMgKiBkZXQwOSkgKiBkZXRcclxuICAgICAgICBtYXRbMF1bMl0gPSAoYTMxICogZGV0MDUgLSBhMzIgKiBkZXQwNCArIGEzMyAqIGRldDAzKSAqIGRldFxyXG4gICAgICAgIG1hdFswXVszXSA9ICgtYTIxICogZGV0MDUgKyBhMjIgKiBkZXQwNCAtIGEyMyAqIGRldDAzKSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVswXSA9ICgtYTEwICogZGV0MTEgKyBhMTIgKiBkZXQwOCAtIGExMyAqIGRldDA3KSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVsxXSA9IChhMDAgKiBkZXQxMSAtIGEwMiAqIGRldDA4ICsgYTAzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzJdID0gKC1hMzAgKiBkZXQwNSArIGEzMiAqIGRldDAyIC0gYTMzICogZGV0MDEpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzNdID0gKGEyMCAqIGRldDA1IC0gYTIyICogZGV0MDIgKyBhMjMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMF0gPSAoYTEwICogZGV0MTAgLSBhMTEgKiBkZXQwOCArIGExMyAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVsxXSA9ICgtYTAwICogZGV0MTAgKyBhMDEgKiBkZXQwOCAtIGEwMyAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVsyXSA9IChhMzAgKiBkZXQwNCAtIGEzMSAqIGRldDAyICsgYTMzICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzNdID0gKC1hMjAgKiBkZXQwNCArIGEyMSAqIGRldDAyIC0gYTIzICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzBdID0gKC1hMTAgKiBkZXQwOSArIGExMSAqIGRldDA3IC0gYTEyICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzFdID0gKGEwMCAqIGRldDA5IC0gYTAxICogZGV0MDcgKyBhMDIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMl0gPSAoLWEzMCAqIGRldDAzICsgYTMxICogZGV0MDEgLSBhMzIgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bM10gPSAoYTIwICogZGV0MDMgLSBhMjEgKiBkZXQwMSArIGEyMiAqIGRldDAwKSAqIGRldFxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9GbG9hdDMyTGlzdCgpOiBGbG9hdDMyTGlzdCB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICAvL+eUseS6jk9wZW5HTOaYr+WIl+W6j+WtmOWCqO+8jOaJgOS7pemcgOimgei9rOe9ruS4gOS4i+efqemYtVxyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgbVswXVswXSwgbVsxXVswXSwgbVsyXVswXSwgbVszXVswXSxcclxuICAgICAgICAgICAgbVswXVsxXSwgbVsxXVsxXSwgbVsyXVsxXSwgbVszXVsxXSxcclxuICAgICAgICAgICAgbVswXVsyXSwgbVsxXVsyXSwgbVsyXVsyXSwgbVszXVsyXSxcclxuICAgICAgICAgICAgbVswXVszXSwgbVsxXVszXSwgbVsyXVszXSwgbVszXVszXVxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDApLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygxKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMiksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDMpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRSU01hdHJpeChwb3M6IFZlY3RvcjMsIHF1YXQ6IFF1YXRlcm5pb24sIHNjYWxlOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgdG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgbGV0IHJtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxdWF0KTtcclxuICAgICAgICBsZXQgc20gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgoc2NhbGUpO1xyXG5cclxuICAgICAgICAvL+W/hemhu+S4peagvOaMieeFp+WFiFNjYWxl77yM5YaNUm90YXRl77yM5YaNVHJhbnNsYXRl55qE6aG65bqP77yM5ZCm5YiZ5b6X5Yiw55qE57uT5p6c6IKv5a6a5piv5LiN5ruh5oSP55qEXHJcbiAgICAgICAgLy/kvovlpoLmnInkuIDkuKoxWDHmraPmlrnlvaLlnKjljp/ngrnvvIzmiJHku6zmg7PopoHlvpfliLDkuIDkuKoxWDLvvIzlubbkuJTmlpzlkJE0NcKw77yM6ICM5LiU56a75Z2Q5qCH5Y6f54K5MeS4quWNleS9jeWkhFxyXG4gICAgICAgIC8v5aaC5p6c5YWI5peL6L2s77yM5YaN57yp5pS+55qE6K+d77yM5peL6L2s5pa55ZCR5piv5a+55LqG77yM5L2G5piv5oiR5Lus5piv5bCG5peL6L2s5ZCONDXCsOeahOato+aWueW9oueahFnovbTmi4nkvLgy5YCN77yM5b6X5Yiw55qE5piv5LiA5Liq6KKr5ouJ6ZW/55qE6I+x5b2iXHJcbiAgICAgICAgLy/lpoLmnpzlhYjlubPnp7vvvIzlho3ml4vovaznmoTor53vvIzlm6DkuLrmiJHku6zml4vovazpg73mmK/nu5XnnYDlnZDmoIfljp/ngrnnmoTvvIznu5Pmnpzoh6rnhLbmmK/mraPmlrnlvaLkuI3mmK/oh6rouqvml4vovaw0NcKw77yM6ICM5piv57uV552A5Y6f54K55peL6L2sXHJcbiAgICAgICAgcmV0dXJuIHRtLm11bHRpcGx5KHJtLm11bHRpcGx5KHNtKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUcmFuc2xhdGVNYXRyaXgocG9zOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IDE7IG1bMF1bMV0gPSAwOyBtWzBdWzJdID0gMDsgbVswXVszXSA9IHBvcy54O1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gMTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSBwb3MueTtcclxuICAgICAgICBtWzJdWzBdID0gMDsgbVsyXVsxXSA9IDA7IG1bMl1bMl0gPSAxOyBtWzJdWzNdID0gcG9zLno7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24ocTogUXVhdGVybmlvbik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIGxldCBudW0gPSBxLnggKiAyO1xyXG4gICAgICAgIGxldCBudW0yID0gcS55ICogMjtcclxuICAgICAgICBsZXQgbnVtMyA9IHEueiAqIDI7XHJcbiAgICAgICAgbGV0IG51bTQgPSBxLnggKiBudW07XHJcbiAgICAgICAgbGV0IG51bTUgPSBxLnkgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW02ID0gcS56ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtNyA9IHEueCAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTggPSBxLnggKiBudW0zO1xyXG4gICAgICAgIGxldCBudW05ID0gcS55ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtMTAgPSBxLncgKiBudW07XHJcbiAgICAgICAgbGV0IG51bTExID0gcS53ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtMTIgPSBxLncgKiBudW0zO1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMSAtIChudW01ICsgbnVtNik7XHJcbiAgICAgICAgbVsxXVswXSA9IG51bTcgKyBudW0xMjtcclxuICAgICAgICBtWzJdWzBdID0gbnVtOCAtIG51bTExO1xyXG4gICAgICAgIG1bM11bMF0gPSAwO1xyXG4gICAgICAgIG1bMF1bMV0gPSBudW03IC0gbnVtMTI7XHJcbiAgICAgICAgbVsxXVsxXSA9IDEgLSAobnVtNCArIG51bTYpO1xyXG4gICAgICAgIG1bMl1bMV0gPSBudW05ICsgbnVtMTA7XHJcbiAgICAgICAgbVszXVsxXSA9IDA7XHJcbiAgICAgICAgbVswXVsyXSA9IG51bTggKyBudW0xMTtcclxuICAgICAgICBtWzFdWzJdID0gbnVtOSAtIG51bTEwO1xyXG4gICAgICAgIG1bMl1bMl0gPSAxIC0gKG51bTQgKyBudW01KTtcclxuICAgICAgICBtWzNdWzJdID0gMDtcclxuICAgICAgICBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZTogVmVjdG9yMywgb3JkZXI6IHN0cmluZyA9IFwiWFlaXCIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v6YCa6L+H5qyn5ouJ6KeS6I635Y+W5peL6L2s55+p6Zi1XHJcbiAgICAgICAgLy/lhYjliIbliKvojrflj5ZYWVrovbTkuIrnmoTml4vovaznn6npmLXvvIznhLblkI7lkIjlubbotbfmnaVcclxuICAgICAgICAvL+azqOaEj++8muaXi+i9rOi9tOeahOmhuuW6j+WFiOWQjuS4jeWQjO+8jOS8muWHuueOsOS4jeWQjOeahOe7k+aenO+8jOWboOatpOW/hemhu+imgeaMh+WumuaXi+i9rOmhuuW6j1xyXG4gICAgICAgIC8vaHR0cDovL3BsYW5uaW5nLmNzLnVpdWMuZWR1L25vZGUxMDIuaHRtbFxyXG4gICAgICAgIC8vaHR0cHM6Ly90aHJlZWpzLm9yZy9kb2NzLyNhcGkvZW4vbWF0aC9FdWxlci5vcmRlclxyXG4gICAgICAgIHZhciB4ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLngsIFZlY3RvcjMuUklHSFQpO1xyXG4gICAgICAgIHZhciB5ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnksIFZlY3RvcjMuVVApO1xyXG4gICAgICAgIHZhciB6ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnosIFZlY3RvcjMuRk9SV0FSRCk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAob3JkZXIpIHtcclxuICAgICAgICAgICAgY2FzZSBcIlhZWlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYWllcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHoubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVhaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh4Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIllaWFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHgubXVsdGlwbHkoei5tdWx0aXBseSh5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWFlcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHgubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWllYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh5Lm11bHRpcGx5KHopKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSb3RhdGlvbiBvcmRlciBlcnJvciwgbXVzdCBiZSBzaW1pbGFyIHRvICdYWVonXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBvdXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIG0gPSBvdXQubWF0cml4O1xyXG4gICAgICAgIHZhciB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xyXG4gICAgICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgICAgICB2YXIgcyA9IDAsIGMgPSAwLCB0ID0gMDtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcclxuICAgICAgICB4ICo9IGxlbjtcclxuICAgICAgICB5ICo9IGxlbjtcclxuICAgICAgICB6ICo9IGxlbjtcclxuICAgICAgICBzID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgdCA9IDEgLSBjO1xyXG4gICAgICAgIG1bMF1bMF0gPSB4ICogeCAqIHQgKyBjO1xyXG4gICAgICAgIG1bMV1bMF0gPSB5ICogeCAqIHQgKyB6ICogcztcclxuICAgICAgICBtWzJdWzBdID0geiAqIHggKiB0IC0geSAqIHM7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IHggKiB5ICogdCAtIHogKiBzO1xyXG4gICAgICAgIG1bMV1bMV0gPSB5ICogeSAqIHQgKyBjO1xyXG4gICAgICAgIG1bMl1bMV0gPSB6ICogeSAqIHQgKyB4ICogcztcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0geCAqIHogKiB0ICsgeSAqIHM7XHJcbiAgICAgICAgbVsxXVsyXSA9IHkgKiB6ICogdCAtIHggKiBzO1xyXG4gICAgICAgIG1bMl1bMl0gPSB6ICogeiAqIHQgKyBjO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTY2FsZU1hdHJpeChzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IHMueDsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzBdID0gMDsgbVsxXVsxXSA9IHMueTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IHMuejsgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBtLm1hdHJpeFswXVswXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMV1bMV0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzJdWzJdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRyaXg0eDRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWF0ZXJuaW9uIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihldWxlcjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUFyb3VuZChhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmV1bGVyQW5nbGVzID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcclxuICAgICAgICAgICAgdGhpcy53ID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBldWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbih0aGlzKS5nZXRFdWxlckFuZ2xlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZXVsZXJBbmdsZXMoZTogVmVjdG9yMykge1xyXG4gICAgICAgIHZhciBxID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZSkuZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVBcm91bmQoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCBxID0gUXVhdGVybmlvbi5hbmdsZUF4aXMoYW5nbGUsIGF4aXMpO1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgICAgIHRoaXMudyA9IHEudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQHpoIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxyXG4gICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1RdWF0KGE6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOiBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXRyYW5zZm9ybS1WZWMzLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICBsZXQgcSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXHJcbiAgICAgICAgY29uc3QgaXggPSBxLncgKiBhLnggKyBxLnkgKiBhLnogLSBxLnogKiBhLnk7XHJcbiAgICAgICAgY29uc3QgaXkgPSBxLncgKiBhLnkgKyBxLnogKiBhLnggLSBxLnggKiBhLno7XHJcbiAgICAgICAgY29uc3QgaXogPSBxLncgKiBhLnogKyBxLnggKiBhLnkgLSBxLnkgKiBhLng7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtcS54ICogYS54IC0gcS55ICogYS55IC0gcS56ICogYS56O1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XHJcbiAgICAgICAgb3V0LnggPSBpeCAqIHEudyArIGl3ICogLXEueCArIGl5ICogLXEueiAtIGl6ICogLXEueTtcclxuICAgICAgICBvdXQueSA9IGl5ICogcS53ICsgaXcgKiAtcS55ICsgaXogKiAtcS54IC0gaXggKiAtcS56O1xyXG4gICAgICAgIG91dC56ID0gaXogKiBxLncgKyBpdyAqIC1xLnogKyBpeCAqIC1xLnkgLSBpeSAqIC1xLng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24odGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlm5vlhYPmlbDnkIPpnaLmj5LlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzbGVycChhOiBRdWF0ZXJuaW9uLCBiOiBRdWF0ZXJuaW9uLCB0OiBudW1iZXIpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOlxyXG4gICAgICAgIC8vICAgIGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tc2xlcnAtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUwID0gMDtcclxuICAgICAgICBsZXQgc2NhbGUxID0gMDtcclxuXHJcbiAgICAgICAgLy8gY2FsYyBjb3NpbmVcclxuICAgICAgICBsZXQgY29zb20gPSBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICAgICAgLy8gYWRqdXN0IHNpZ25zIChpZiBuZWNlc3NhcnkpXHJcbiAgICAgICAgaWYgKGNvc29tIDwgMC4wKSB7XHJcbiAgICAgICAgICAgIGNvc29tID0gLWNvc29tO1xyXG4gICAgICAgICAgICBiLnggPSAtYi54O1xyXG4gICAgICAgICAgICBiLnkgPSAtYi55O1xyXG4gICAgICAgICAgICBiLnogPSAtYi56O1xyXG4gICAgICAgICAgICBiLncgPSAtYi53O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgY29lZmZpY2llbnRzXHJcbiAgICAgICAgaWYgKCgxLjAgLSBjb3NvbSkgPiAwLjAwMDAwMSkge1xyXG4gICAgICAgICAgICAvLyBzdGFuZGFyZCBjYXNlIChzbGVycClcclxuICAgICAgICAgICAgY29uc3Qgb21lZ2EgPSBNYXRoLmFjb3MoY29zb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzaW5vbSA9IE1hdGguc2luKG9tZWdhKTtcclxuICAgICAgICAgICAgc2NhbGUwID0gTWF0aC5zaW4oKDEuMCAtIHQpICogb21lZ2EpIC8gc2lub207XHJcbiAgICAgICAgICAgIHNjYWxlMSA9IE1hdGguc2luKHQgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBcImZyb21cIiBhbmQgXCJ0b1wiIHF1YXRlcm5pb25zIGFyZSB2ZXJ5IGNsb3NlXHJcbiAgICAgICAgICAgIC8vICAuLi4gc28gd2UgY2FuIGRvIGEgbGluZWFyIGludGVycG9sYXRpb25cclxuICAgICAgICAgICAgc2NhbGUwID0gMS4wIC0gdDtcclxuICAgICAgICAgICAgc2NhbGUxID0gdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGZpbmFsIHZhbHVlc1xyXG4gICAgICAgIG91dC54ID0gc2NhbGUwICogYS54ICsgc2NhbGUxICogYi54O1xyXG4gICAgICAgIG91dC55ID0gc2NhbGUwICogYS55ICsgc2NhbGUxICogYi55O1xyXG4gICAgICAgIG91dC56ID0gc2NhbGUwICogYS56ICsgc2NhbGUxICogYi56O1xyXG4gICAgICAgIG91dC53ID0gc2NhbGUwICogYS53ICsgc2NhbGUxICogYi53O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KGE6IFF1YXRlcm5pb24sIGI6IFF1YXRlcm5pb24pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZUF4aXMoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICBhbmdsZSA9IE1hdGguUEkgKiBhbmdsZSAvIDE4MDtcclxuICAgICAgICBhbmdsZSAqPSAwLjU7XHJcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xyXG5cclxuICAgICAgICByZXMueCA9IGF4aXMueCAqIHNpbjtcclxuICAgICAgICByZXMueSA9IGF4aXMueSAqIHNpbjtcclxuICAgICAgICByZXMueiA9IGF4aXMueiAqIHNpbjtcclxuICAgICAgICByZXMudyA9IE1hdGguY29zKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpZGVudGl0eSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd2lkdGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueTsgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMik6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMjtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yMik6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWN0b3IyO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yMi5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjb3B5KCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIsIHQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHggPSB2Mi54IC0gdjEueDtcclxuICAgICAgICB2YXIgeSA9IHYyLnkgLSB2MS55O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMi5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKC0xLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgLTEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IzIHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yNClcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjdG9yMztcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3IzKTogVmVjdG9yMztcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjdG9yMztcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3IzLmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMy5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNvcHkoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnkgJiYgdi56ID09IHRoaXMuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMsIHQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSArIHYxLnogKiB2Mi56KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB4ID0gdjEueSAqIHYyLnogLSB2MS56ICogdjIueTtcclxuICAgICAgICB2YXIgeSA9IHYxLnogKiB2Mi54IC0gdjEueCAqIHYyLno7XHJcbiAgICAgICAgdmFyIHogPSB2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHggPSB2Mi54IC0gdjEueDtcclxuICAgICAgICB2YXIgeSA9IHYyLnkgLSB2MS55O1xyXG4gICAgICAgIHZhciB6ID0gdjIueiAtIHYxLno7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlmZmVyZW5jZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgZGVzdCA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIGRlc3QueCA9IHYxLnggLSB2Mi54XHJcbiAgICAgICAgZGVzdC55ID0gdjEueSAtIHYyLnlcclxuICAgICAgICBkZXN0LnogPSB2MS56IC0gdjIuelxyXG5cclxuICAgICAgICByZXR1cm4gZGVzdFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGUodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlY3RvcjMuZG90KHYxLCB2MikgLyAodjEubWFnbml0dWRlICogdjIubWFnbml0dWRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFJJR0hUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBMRUZUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygtMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgVVAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERPV04oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBGT1JXQVJEKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBCQUNLKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjQge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGdldCByKCk6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXQgZygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuejsgfVxyXG4gICAgcHVibGljIGdldCBhKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnc7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZlY3RvcjMoKTogVmVjdG9yMyB7IHJldHVybiBuZXcgVmVjdG9yMyh0aGlzKTsgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMywgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHRoaXMudyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzLmxlbmd0aCA9PSAyID8gYXJndW1lbnRzWzFdIDogMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yNCk6IFZlY3RvcjQ7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1swXS53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyArPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiBWZWN0b3I0O1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1swXS53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyAtPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICB0aGlzLnogKj0gZDtcclxuICAgICAgICB0aGlzLncgKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHRoaXMueiAvPSBkO1xyXG4gICAgICAgIHRoaXMudyAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHRoaXMueiAqPSB2Lno7XHJcbiAgICAgICAgdGhpcy53ICo9IHYudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yNC5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNvcHkoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3I0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56ICYmIHYudyA9PSB0aGlzLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56ICsgXCIsIFwiICsgdGhpcy53ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0LCB0OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICB2LnogPSB2MS56ICsgdCAqICh2Mi56IC0gdjEueik7XHJcbiAgICAgICAgdi53ID0gdjEudyArIHQgKiAodjIudyAtIHYxLncpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnogKyB2MS53ICogdjIudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yNC5kb3QodjEsIHYyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDEsIDEsIDEsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTWF0cml4NHg0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaXg0eDRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgT0JKTW9kZWwgfSBmcm9tIFwiLi9VdGlscy9PYmpQYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0YW5jZSB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIG1vZGVsOiBPQkpNb2RlbDtcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybShuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IEFycmF5PFRyYW5zZm9ybT47XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50OiBUcmFuc2Zvcm0gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RlbXBQb3M6IFZlY3RvcjM7XHJcbiAgICBwcml2YXRlIF90ZW1wUm90OiBRdWF0ZXJuaW9uO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFNjYWxlOiBWZWN0b3IzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50YWcgPSB0YWc7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBBcnJheTxUcmFuc2Zvcm0+KCk7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBRdWF0ZXJuaW9uLmlkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuX3RlbXBTY2FsZSA9IFZlY3RvcjMuT05FO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VsZk1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHJldHVybiBNYXRyaXg0eDQuZ2V0VFJTTWF0cml4KHRoaXMuX3RlbXBQb3MsIHRoaXMuX3RlbXBSb3QsIHRoaXMuX3RlbXBTY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBsb2NhbFRvV29ybGRNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5sb2NhbFRvV29ybGRNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHAubXVsdGlwbHkodGhpcy5zZWxmTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkVG9Mb2NhbE1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBwID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LndvcmxkVG9Mb2NhbE1hdHJpeCA6IE1hdHJpeDR4NC5pZGVudGl0eTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxmTWF0cml4LmludmVyc2UoKS5tdWx0aXBseShwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeCh4OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeSh5OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueSA9IHk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHooKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeih6OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueiA9IHo7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGZvcndhcmQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy/miJHku6zopoHlvpfliLDnmoTmmK/kuIDkuKrmlrnlkJHvvIzlm6DmraTkuI3pnIDopoHkvY3nva7kv6Hmga/vvIzlsIbpvZDmrKHlnZDmoIfnmoR36K6+572u5Li6MO+8jOaKm+W8g+aOieWdkOagh+S/oeaBr1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5GT1JXQVJELCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHVwKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5VUCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByaWdodCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuUklHSFQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBQb3MuY29weSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcG9zaXRpb24ocG9zOiBWZWN0b3IzKSB7XHJcbiAgICAgICAgdGhpcy5fdGVtcFBvcyA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkUG9zaXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4LmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm90YXRpb24oKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBSb3QuY29weSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24ocTogUXVhdGVybmlvbikge1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wU2NhbGUuY29weSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2NhbGUoczogVmVjdG9yMykge1xyXG4gICAgICAgIHRoaXMuX3RlbXBTY2FsZSA9IHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRTY2FsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFyZW50KCk6IFRyYW5zZm9ybSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFBhcmVudChwYXJlbnQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCAmJiBwYXJlbnQgIT0gdGhpcyAmJiBwYXJlbnQgIT0gdGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgLy/pmLLmraLlh7rnjrDvvJrniLboioLngrnmmK/lvZPliY3oioLngrnnmoTlrZDoioLngrnvvIzlsIblrZDoioLnmoTorr7nva7kuLroh6rlt7HnmoTniLboioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5oYXNQYXJlbnQodGhpcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2V0IHBhcmVudCwgdGhpcyBub2RlIGlzIHRoZSBwYXJlbnQgbm9kZSdzIHBhcmVudC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN6IqC54K55pyJ54i26IqC54K577yM6KaB5YWI56e76Zmk5pen55qEXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocGFyZW50ID09IG51bGwgJiYgdGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+iKgueCuXDmmK/lkKbmmK/lvZPliY3oioLngrnnmoTkuIrnuqdcclxuICAgIHB1YmxpYyBoYXNQYXJlbnQocDogVHJhbnNmb3JtKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLnBhcmVudCA9PSBwKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5oYXNQYXJlbnQocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRDaGlsZChjaGlsZDogVHJhbnNmb3JtLCB3b3JsZFBvc2l0aW9uU3RheXM6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQgIT0gdGhpcyAmJiAhdGhpcy5jaGlsZHJlbi5pbmNsdWRlcyhjaGlsZCkpIHtcclxuICAgICAgICAgICAgLy/pmLLmraLlh7rnjrDvvJpjaGlsZOiKgueCueaYr+W9k+WJjeiKgueCueeahOeItuiKgueCue+8jOWwhueItuiKgueahOiuvue9ruS4uuiHquW3seeahOWtkOiKgueCue+8jOS8muatu+W+queOr1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQYXJlbnQoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjaGlsZCwgdGhpcyBub2RlIGlzIHRoZSBjaGlsZCBub2RlJ3MgY2hpbGQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOWtkOiKgueCueacieaXp+eahOeItuiKgueCue+8jOimgeWFiOenu+mZpFxyXG4gICAgICAgICAgICBpZiAoY2hpbGQucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCwgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAod29ybGRQb3NpdGlvblN0YXlzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S/neeVmeWOn+S4lueVjOWdkOagh+S9jee9ru+8jOWFiOacneeItuiKgueCueeahOWPmOaNoueahOWPjeaWueWQkeenu+WKqO+8jOeEtuWQjuWGjea3u+WKoOi/m+WOu++8jOWwseiDveS/neaMgeS4lueVjOWdkOagh+S4jeWPmFxyXG4gICAgICAgICAgICAgICAgLy/ljbPlj5jmjaLliLDniLboioLngrnnmoTpgIbnn6npmLXph4xcclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCwgMCk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAod29ybGRQb3NpdGlvblN0YXlzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S/neeVmeS4lueVjOWdkOagh++8jOebtOaOpeWwhuacrOWcsOWdkOagh+etieWQjOS6juW9k+WJjeS4lueVjOWdkOagh+WNs+WPr1xyXG4gICAgICAgICAgICAgICAgdmFyIG0gPSB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5tdWx0aXBseShjaGlsZC5zZWxmTWF0cml4KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUG9zID0gbS5nZXRUcmFuc2xhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUm90ID0gbS5nZXRSb3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wU2NhbGUgPSBtLmdldFNjYWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkQnlUYWcodGFnOiBzdHJpbmcpOiBUcmFuc2Zvcm0gfCBudWxsIHtcclxuXHJcbiAgICAgICAgdmFyIG5vZGVzID0gdGhpcy5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZXNbaV0udGFnID09IHRhZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udmVydFRvTm9kZVNwYWNlKHY6IFZlY3RvcjMsIHc6IG51bWJlciA9IDEpOiBWZWN0b3IzIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAq5bCG5p+Q5Liq5Z2Q5qCH6L2s5Yiw6Ieq5bex55qE5bGA6YOo56m66Ze077yM5L6L5aaC5b2T5YmN55qE5bGA6YOo5Z2Q5qCH5Y6f54K55Zyo5LiW55WM5Z2Q5qCH55qE77yIMe+8jDHvvInlpIRcclxuICAgICAgICAgKueCuXDlnKjkuJbnlYzlnZDmoIfvvIgy77yMMe+8ieWkhO+8jOmCo+S5iOWwhueCuXDnm7jlr7nkuo7lvZPliY3lsYDpg6jlnZDmoIfns7vnmoTkvY3nva7lsLHmmK/vvIgy77yMMe+8iS3vvIgx77yMMe+8iT0g77yIMe+8jCAw77yJXHJcbiAgICAgICAgICrljbPlsIbngrlw5Y+N5ZCR5Y+Y5o2i5b2T5YmN55qE55+p6Zi1IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB0aGlzLndvcmxkVG9Mb2NhbE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodiwgdykpLnZlY3RvcjM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbnZlcnRUb1dvcmxkU3BhY2UodjogVmVjdG9yMywgdzogbnVtYmVyID0gMSk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodiwgdykpLnZlY3RvcjM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3koZGVzdHJveUNoaWxkcmVuOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChkZXN0cm95Q2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koZGVzdHJveUNoaWxkcmVuKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2UsIFRyYW5zZm9ybSB9IGZyb20gXCIuL01vZGVsXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tIFwiLi9DYW1lcmFcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuXHJcbmVudW0gRHJhd01vZGUge1xyXG4gICAgV2lyZWZyYW1lLFxyXG4gICAgUG9pbnQsXHJcbiAgICBTaGFkZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcclxuICAgIHB1YmxpYyBkcmF3TW9kZTogRHJhd01vZGUgPSBEcmF3TW9kZS5Qb2ludDtcclxuICAgIHByaXZhdGUgdWludDMyVmlldzogVWludDMyQXJyYXk7XHJcblxyXG4gICAgY29uc3RydWN0b3IodWludDMyVmlldzogVWludDMyQXJyYXkpIHtcclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSB1aW50MzJWaWV3O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiDln7rnoYDnu5jliLbmjqXlj6NcclxuXHJcbiAgICBwdWJsaWMgQ2xlYXIoY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOS9v+eUqCBmaWxsIOaWueazleabv+S7o+W+queOr++8jOaAp+iDveabtOWlvVxyXG4gICAgICAgIHRoaXMudWludDMyVmlldy5maWxsKGNvbG9yKTtcclxuICAgICAgICAvLyDmiJbogIXkvb/nlKjlvqrnjq/vvIzkvYbmgKfog73ovoPlt65cclxuICAgICAgICAvLyBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2FudmFzV2lkdGg7IHgrKykge1xyXG4gICAgICAgIC8vICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuY2FudmFzSGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuU2V0UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3UGl4ZWwoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDnu5jliLbliLDlsY/luZXkuIrnmoTlg4/ntKDlupTor6XmmK/mlbTmlbDnmoRcclxuICAgICAgICAvLyDkvJjljJY6IOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4ID0gKHggfCAwKTtcclxuICAgICAgICB5ID0gKHkgfCAwKTtcclxuICAgICAgICAvLyB4ID0gTWF0aC5mbG9vcih4KTtcclxuICAgICAgICAvLyB5ID0gTWF0aC5mbG9vcih5KTtcclxuXHJcbiAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gQ29uZmlnLmNhbnZhc1dpZHRoIHx8IHkgPCAwIHx8IHkgPj0gQ29uZmlnLmNhbnZhc0hlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXdbeSAqIENvbmZpZy5jYW52YXNXaWR0aCArIHhdID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdMaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDlj5bmlbRcclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuXHJcbiAgICAgICAgY29uc3QgZHggPSB4MiAtIHgxO1xyXG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcclxuXHJcbiAgICAgICAgLy8g5Li65L2V6KaB5Yy65YiG5pac546H5piv5ZCm5YGP5rC05bmz6L+Y5piv5Z6C55u05ZGi77yf5Zug5Li65aaC5p6c5LiN5Yy65YiG77yM5L6L5aaC5b2T5pac546H5aSn5LqOMeaXtu+8jOS8muWvvOiHtOebtOe6v+e7mOWItuS4jei/nue7re+8jOWboOS4unnkvJrot7Plj5jvvIzogIzkuI3mmK/ov57nu63nmoTlop7liqDjgIJcclxuICAgICAgICAvLyDlj6rmnInmlpznjofliJrlpb3kuLox5pe277yMeOi3n3nmiY3mmK/ov57nu63lkIzmraXoh6rlop7nmoTvvIx4KzHvvIzliJl55LmfKzFcclxuICAgICAgICAvLyDmiYDku6XvvIzlvZPmlpznjoflpKfkuo4x5pe277yM5oiR5Lus6ZyA6KaB5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj++8jOiAjOW9k+aWnOeOh+Wwj+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh45L2c5Li65b6q546v5Y+Y6YeP44CCXHJcbiAgICAgICAgLy8g5Li+5Liq5p6B56uv5L6L5a2Q77yM5b2T5pac546H5Li6MOaXtu+8jOebtOe6v+WwseaYr+S4gOadoeWeguebtOebtOe6v++8jOWmguaenOi/meaXtuWAmei/mOeUqHjkvZzkuLrlvqrnjq/lj5jph4/vvIzliJnkvJrlr7zoh7Tov5nmnaHnm7Tnur/kuIrmiYDmnIl554K56YO95a+55bqU5LiA5LiqeO+8jOS5n+WwseaYr+ivtOi/meadoee6v+WPmOaIkOS4gOS4queCueS6huOAglxyXG5cclxuICAgICAgICAvLyDmlpznjoflsI/kuo4x77yM55u057q/5YGP5rC05bmz5oOF5Ya177yM5L2/55SoeOS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiBNYXRoLmFicyhkeSkpIHtcclxuICAgICAgICAgICAgLy8g5LiL6Z2i55qE5b6q546v57uY5Yi25Ye95pWw5piv5LuO5bem5b6A5Y+z55qE77yM6L+Z6YeM6KaB56Gu5L+d57uT5p2f54K55Zyo5byA5aeL54K555qE5Y+z6L65XHJcbiAgICAgICAgICAgIGlmICh4MiA8IHgxKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaWnOeOh1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZHkgLyBkeDtcclxuICAgICAgICAgICAgLy8g5oiq6Led77yIeT1heCti77yMYj15LWF477yJXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGIgPSB5MSAtIGEgKiB4MTtcclxuICAgICAgICAgICAgbGV0IHkgPSB5MTtcclxuICAgICAgICAgICAgLy8g57uY5Yi255u057q/XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICAvLyDnm7Tnur/lhazlvI95PWF4K2LvvIzov5nph4zkuI3lv4XorqHnrpfov5nkuKrlhazlvI/vvIzlm6DkuLrlvZN45YqgMeiHquWinuaXtu+8jHnkuZ/kvJrliqBh77yM5omA5Lul5Y+v5Lul55u05o6l55SoeSth5Luj5pu/YXgrYu+8jOeul+aYr+S4gOS4quaAp+iDveS8mOWMlueCuVxyXG4gICAgICAgICAgICAgICAgLy8geSA9IGEgKiB4ICsgYjtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHlzID0gdGhpcy5JbnRlcnBvbGF0ZSh4MSwgeTEsIHgyLCB5Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5c1t4IC0geDFdLCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5pac546H5aSn5LqOMe+8jOebtOe6v+WBj+WeguebtOaDheWGte+8jOS9v+eUqHnkvZzkuLrlvqrnjq/lj5jph49cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHkyIDwgeTEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYSA9IGR4IC8gZHk7XHJcbiAgICAgICAgICAgIGxldCB4ID0geDE7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaIllxyXG4gICAgICAgICAgICAvLyBjb25zdCB4cyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5EcmF3UGl4ZWwoeHNbeSAtIHkxXSwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgyLCB5MiwgeDMsIHkzLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MywgeTMsIHgxLCB5MSwgY29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWQoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOazqO+8muS7peS4i+aPkOWIsOeahOmVv+i+ue+8jOeJueaMh3novbTot6jluqbmnIDplb/nmoTovrnvvIzogIzkuI3mmK/lrp7pmYXkuIrnmoTovrnplb9cclxuXHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnov5vooYzmjpLluo/vvIzkvb/lvpd5MTw9eTI8PXkz77yM5Y2z5Y+v56Gu5a6a5LiJ6KeS5b2i55qE6ZW/6L655Li6TDEz77yMTDEy5ZKMTDIz5YiZ5piv5Y+m5aSW5Lik5p2h55+t6L65XHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MSA+IHkzKSBbeDEsIHkxLCB4MywgeTNdID0gW3gzLCB5MywgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzXSA9IFt4MywgeTMsIHgyLCB5Ml07XHJcblxyXG4gICAgICAgIC8vIOiOt+WPljPmnaHovrnnmoTngrnlnZDmoIflkIjpm4ZcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMTMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTMsIHgzKTtcclxuXHJcbiAgICAgICAgLy8g5ou85ZCI5Lik5p2h55+t6L655Li65LiA5p2h6ZW/6L6577yI5YWI56e76Zmk56ys5LiA5p2h6L6555qE5pyA5ZCO5LiA5Liq5pWw5o2u77yM6YG/5YWN6YeN5aSN77yJXHJcbiAgICAgICAgLy8g546w5Zyo5Y+Y5oiQMuadoemVv+i+ue+8jEwxM+WSjEwxMjNcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuXHJcbiAgICAgICAgLy8g5Yik5patTDEz5ZKMTDEyM+WTquadoemVv+i+ueaYr+W3puWTquadoeaYr+WPs++8jOmDveWPluaVsOe7hOS4remXtOeahOeCue+8jOWIpOaWreiwgeW3puiwgeWPs+WNs+WPr+OAglxyXG4gICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBwTGVmdCA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHBSaWdodCA9IHAxMztcclxuICAgICAgICBpZiAocDEzW21dIDwgcDEyM1ttXSkge1xyXG4gICAgICAgICAgICBwTGVmdCA9IHAxMztcclxuICAgICAgICAgICAgcFJpZ2h0ID0gcDEyMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuawtOW5s+e6v+autVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MzsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwTGVmdFt5IC0geTFdOyB4IDw9IHBSaWdodFt5IC0geTFdOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKFxyXG4gICAgICAgIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsXHJcbiAgICAgICAgeDI6IG51bWJlciwgeTI6IG51bWJlcixcclxuICAgICAgICB4MzogbnVtYmVyLCB5MzogbnVtYmVyLFxyXG4gICAgICAgIGNvbG9yMTogbnVtYmVyLCBjb2xvcjI6IG51bWJlciwgY29sb3IzOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIOWunumZhee7mOWItuWIsOWxj+W5leS4iueahOeCue+8jOW/hemhu+aYr+aVtOaVsO+8jOWPluaVtOS4gOS4i+OAguS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuICAgICAgICB4MyA9IHgzIHwgMDtcclxuICAgICAgICB5MyA9IHkzIHwgMDtcclxuXHJcbiAgICAgICAgLy8g5a+554K55oyJWeWdkOagh+aOkuW6j++8jOehruS/nXkxIDw9IHkyIDw9IHkzXHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5MiwgY29sb3IxLCBjb2xvcjJdID0gW3gyLCB5MiwgeDEsIHkxLCBjb2xvcjIsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5MywgY29sb3IxLCBjb2xvcjNdID0gW3gzLCB5MywgeDEsIHkxLCBjb2xvcjMsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5MywgY29sb3IyLCBjb2xvcjNdID0gW3gzLCB5MywgeDIsIHkyLCBjb2xvcjMsIGNvbG9yMl07XHJcblxyXG4gICAgICAgIC8vIOaPkOWPllJHQuWIhumHj1xyXG4gICAgICAgIGNvbnN0IGMxID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjEpO1xyXG4gICAgICAgIGNvbnN0IGMyID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjIpO1xyXG4gICAgICAgIGNvbnN0IGMzID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjMpO1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzlh73mlbDvvIzpopzoibIx5LiO6aKc6ImyMuWcqGQxLWQy55qE6IyD5Zu05YaF5Z2H5YyA5o+S5YC8XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVDb2xvciA9IChkMTogbnVtYmVyLCByMTogbnVtYmVyLCBnMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMTogbnVtYmVyLFxyXG4gICAgICAgICAgICBkMjogbnVtYmVyLCByMjogbnVtYmVyLCBnMjogbnVtYmVyLCBiMjogbnVtYmVyLCBhMjogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj1xyXG4gICAgICAgICAgICAvLyDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y5ZKMTWF0aC5hYnPvvIzmj5DljYfmgKfog71cclxuICAgICAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGQyIC0gZDEpKTtcclxuICAgICAgICAgICAgY29uc3QgZHggPSAoKGQyID4gZDEgPyBkMiAtIGQxIDogZDEgLSBkMikgfCAwKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfmraXplb9cclxuICAgICAgICAgICAgY29uc3QgaW52RGVsdGEgPSAxIC8gKGQyIC0gZDEpO1xyXG4gICAgICAgICAgICBjb25zdCByU3RlcCA9IChyMiAtIHIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBnU3RlcCA9IChnMiAtIGcxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBiU3RlcCA9IChiMiAtIGIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBhU3RlcCA9IChhMiAtIGExKSAqIGludkRlbHRhO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSByMSwgZyA9IGcxLCBiID0gYjEsIGEgPSBhMTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0geyByLCBnLCBiLCBhIH07XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85LiJ5p2h6L6555qE5Z2Q5qCH5ZKM6aKc6ImyXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDEyQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEpO1xyXG5cclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMjNDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkyLCBjMi5yLCBjMi5nLCBjMi5iLCBjMi5hLCB5MywgYzMuciwgYzMuZywgYzMuYiwgYzMuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTEsIGMxLnIsIGMxLmcsIGMxLmIsIGMxLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgLy8g5ZCI5bm25Lik5p2h55+t6L65XHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcbiAgICAgICAgY29uc3QgcDEyM0NvbG9ycyA9IHAxMkNvbG9ycy5jb25jYXQocDIzQ29sb3JzKTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5bem5Y+z6L6555WMXHJcbiAgICAgICAgLy8gY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBjb25zdCBtID0gKHAxMjMubGVuZ3RoID4+IDEpIHwgMDtcclxuICAgICAgICBsZXQgbGVmdFBvaW50cyA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHJpZ2h0UG9pbnRzID0gcDEzO1xyXG4gICAgICAgIGxldCBsZWZ0Q29sb3JzID0gcDEyM0NvbG9ycztcclxuICAgICAgICBsZXQgcmlnaHRDb2xvcnMgPSBwMTNDb2xvcnM7XHJcblxyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIGxlZnRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgICAgIHJpZ2h0UG9pbnRzID0gcDEyMztcclxuICAgICAgICAgICAgbGVmdENvbG9ycyA9IHAxM0NvbG9ycztcclxuICAgICAgICAgICAgcmlnaHRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q6177yM5bm26L+b6KGM6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0geSAtIHkxO1xyXG4gICAgICAgICAgICBjb25zdCB4U3RhcnQgPSBsZWZ0UG9pbnRzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHhFbmQgPSByaWdodFBvaW50c1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVmdENvbG9yID0gbGVmdENvbG9yc1tpZHhdO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodENvbG9yID0gcmlnaHRDb2xvcnNbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmihOiuoeeul+minOiJsuW3ruWAvFxyXG4gICAgICAgICAgICBjb25zdCByRGlmZiA9IHJpZ2h0Q29sb3IuciAtIGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBjb25zdCBnRGlmZiA9IHJpZ2h0Q29sb3IuZyAtIGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBjb25zdCBiRGlmZiA9IHJpZ2h0Q29sb3IuYiAtIGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBjb25zdCBhRGlmZiA9IHJpZ2h0Q29sb3IuYSAtIGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5q2l6ZW/5ZKM6aKc6Imy5aKe6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGludkxlbmd0aCA9IDEgLyAoKHhFbmQgLSB4U3RhcnQpICsgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gckRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gZ0RpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gYkRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gYURpZmYgKiBpbnZMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyDliJ3lp4vpopzoibLlgLxcclxuICAgICAgICAgICAgbGV0IHIgPSBsZWZ0Q29sb3IucjtcclxuICAgICAgICAgICAgbGV0IGcgPSBsZWZ0Q29sb3IuZztcclxuICAgICAgICAgICAgbGV0IGIgPSBsZWZ0Q29sb3IuYjtcclxuICAgICAgICAgICAgbGV0IGEgPSBsZWZ0Q29sb3IuYTtcclxuXHJcbiAgICAgICAgICAgIC8vIOawtOW5s+aWueWQkeminOiJsuaPkuWAvFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDw9IHhFbmQ7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmluYWxDb2xvciA9ICgoYSB8IDApIDw8IDI0KSB8ICgoYiB8IDApIDw8IDE2KSB8ICgoZyB8IDApIDw8IDgpIHwgKHIgfCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGZpbmFsQ29sb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOe0r+WKoOminOiJsuWAvFxyXG4gICAgICAgICAgICAgICAgciArPSByU3RlcDtcclxuICAgICAgICAgICAgICAgIGcgKz0gZ1N0ZXA7XHJcbiAgICAgICAgICAgICAgICBiICs9IGJTdGVwO1xyXG4gICAgICAgICAgICAgICAgYSArPSBhU3RlcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5oqV5b2x55u45YWzXHJcblxyXG4gICAgLy8g5bCG6KeG5Y+j5LiK55qE5YaF5a655pig5bCE5Yiw5a6e6ZmF5bGP5bmV5LiKXHJcbiAgICBwdWJsaWMgVmlld3BvcnRUb0NhbnZhcyhwb2ludDogVmVjdG9yMikge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhuWPo+WuveW6puS4ujHkuKrljZXkvY1cclxuICAgICAgICAvLyDlm6DkuLphc3BlY3RSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h077yMXHJcbiAgICAgICAgLy8g5omA5Lul6KeG5Y+j6auY5bqmID0gMSAvIGFzcGVjdFJhdGlvID0gY2FudmFzSGVpZ2h0IC8gY2FudmFzV2lkdGhcclxuICAgICAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gMTtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IDEgLyBDb25maWcuYXNwZWN0UmF0aW87XHJcblxyXG4gICAgICAgIC8vIOWwhuaKleW9seWdkOagh+aYoOWwhOWIsENhbnZhc+WDj+e0oOWdkOagh1xyXG4gICAgICAgIC8vIFjlnZDmoIfvvJrku44gWy12aWV3cG9ydFdpZHRoLzIsIHZpZXdwb3J0V2lkdGgvMl0g5pig5bCE5YiwIFswLCBjYW52YXNXaWR0aF1cclxuICAgICAgICAvLyBZ5Z2Q5qCH77ya5LuOIFstdmlld3BvcnRIZWlnaHQvMiwgdmlld3BvcnRIZWlnaHQvMl0g5pig5bCE5YiwIFswLCBjYW52YXNIZWlnaHRdICjms6jmhI9Z6L205pa55ZCRKVxyXG4gICAgICAgIGNvbnN0IGNhbnZhc1ggPSAoKHBvaW50LnggKyB2aWV3cG9ydFdpZHRoIC8gMikgLyB2aWV3cG9ydFdpZHRoKSAqIENvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgICAgICBjb25zdCBjYW52YXNZID0gQ29uZmlnLmNhbnZhc0hlaWdodCAtICgoKHBvaW50LnkgKyB2aWV3cG9ydEhlaWdodCAvIDIpIC8gdmlld3BvcnRIZWlnaHQpICogQ29uZmlnLmNhbnZhc0hlaWdodCk7IC8vIENhbnZhc+eahFnovbTpgJrluLjmmK/lkJHkuIvnmoRcclxuICAgICAgICBwb2ludC54ID0gY2FudmFzWDtcclxuICAgICAgICBwb2ludC55ID0gY2FudmFzWTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpgI/op4bmipXlvbHvvIzlsIYzROWcuuaZr+eahOWdkOagh+i9rOaNouS4ujJE5bGP5bmV5Z2Q5qCH77yM5oqV5bCE5Yiw6KeG5Y+j5LiKXHJcbiAgICBwdWJsaWMgUHJvamVjdFZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMpOiBWZWN0b3IyIHtcclxuICAgICAgICAvLyDlgYforr7op4bngrnliLDov5Hoo4HpnaLvvIjop4blj6PvvInnmoTot53nprvmmK9k77yM6KeG5Y+j55qE5a695pivMVxyXG4gICAgICAgIC8vIOagueaNruS4ieinkuWHveaVsOacie+8mnRhbihmb3YvMikgPSAoMC41IC8gZClcclxuICAgICAgICAvLyDmiYDku6XvvJpkID0gMC41IC8gdGFuKGZvdi8yKVxyXG4gICAgICAgIGNvbnN0IGZvdkRlZ3JlZXMgPSA2MDtcclxuICAgICAgICBjb25zdCBmb3ZSYWRpYW5zID0gZm92RGVncmVlcyAqIChNYXRoLlBJIC8gMTgwKTsgLy8g5bCG6KeS5bqm6L2s5o2i5Li65byn5bqmXHJcbiAgICAgICAgY29uc3QgZCA9IDAuNSAvIE1hdGgudGFuKGZvdlJhZGlhbnMgLyAyKTtcclxuXHJcbiAgICAgICAgLy8g6YCP6KeG5YWs5byP77yM5YGH6K6+6KeG54K55L2N572uKDAsMCnvvIzop4bngrnliLDop4blj6Pot53nprvkuLpk77yM5Zy65pmv6YeM55qE54K55Li6UCh4LHkseinvvIzmipXlsITliLDop4blj6PkuIrnmoTngrnkuLpQJyh4LHkpXHJcbiAgICAgICAgLy8g5YiZ5qC55o2u55u45Ly85LiJ6KeS5b2i5pyJ77yaeiAvIGQgPSB4IC8geCcgPSB5IC8geSfvvIzlj6/lvpfliLDvvJpcclxuICAgICAgICAvLyB4JyA9IChkICogeCkgLyB6XHJcbiAgICAgICAgLy8geScgPSAoZCAqIHkpIC8gelxyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb25YID0gKGQgKiB2ZXJ0ZXgueCkgLyB2ZXJ0ZXguejtcclxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uWSA9IChkICogdmVydGV4LnkpIC8gdmVydGV4Lno7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihwcm9qZWN0aW9uWCwgcHJvamVjdGlvblkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlj5jmjaJcclxuXHJcbiAgICBwdWJsaWMgQXBwbHlUcmFuc2Zvcm0odmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIC8vIOW/hemhu+S4peagvOWuieijheWFiOe8qeaUvuWQjuaXi+i9rOWQjuW5s+enu+eahOmhuuW6j1xyXG4gICAgICAgIHRoaXMuU2NhbGVWZXJ0ZXgodmVydGV4LCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMuUm90YXRlVmVydGV4KHZlcnRleCwgdHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLlRyYW5zbGF0ZVZlcnRleCh2ZXJ0ZXgsIHRyYW5zZm9ybSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNjYWxlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2ZXJ0ZXgueCAqPSB0cmFuc2Zvcm0uc2NhbGUueDtcclxuICAgICAgICB2ZXJ0ZXgueSAqPSB0cmFuc2Zvcm0uc2NhbGUueTtcclxuICAgICAgICB2ZXJ0ZXgueiAqPSB0cmFuc2Zvcm0uc2NhbGUuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUm90YXRlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBldWxlckFuZ2xlcyA9IHRyYW5zZm9ybS5yb3RhdGlvbi5ldWxlckFuZ2xlcztcclxuXHJcbiAgICAgICAgY29uc3QgY29zWCA9IE1hdGguY29zKGV1bGVyQW5nbGVzLngpO1xyXG4gICAgICAgIGNvbnN0IHNpblggPSBNYXRoLnNpbihldWxlckFuZ2xlcy54KTtcclxuICAgICAgICBjb25zdCBjb3NZID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueSk7XHJcbiAgICAgICAgY29uc3Qgc2luWSA9IE1hdGguc2luKGV1bGVyQW5nbGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IGNvc1ogPSBNYXRoLmNvcyhldWxlckFuZ2xlcy56KTtcclxuICAgICAgICBjb25zdCBzaW5aID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueik7XHJcbiAgICAgICAgLy8g5YWI57uVWui9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHggPSB2ZXJ0ZXgueCAqIGNvc1ogLSB2ZXJ0ZXgueSAqIHNpblo7XHJcbiAgICAgICAgY29uc3QgeSA9IHZlcnRleC54ICogc2luWiArIHZlcnRleC55ICogY29zWjtcclxuICAgICAgICB2ZXJ0ZXgueCA9IHg7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5O1xyXG4gICAgICAgIC8vIOWGjee7lVnovbTml4vovaxcclxuICAgICAgICBjb25zdCB6ID0gdmVydGV4LnogKiBjb3NZIC0gdmVydGV4LnggKiBzaW5ZO1xyXG4gICAgICAgIGNvbnN0IHgyID0gdmVydGV4LnogKiBzaW5ZICsgdmVydGV4LnggKiBjb3NZO1xyXG4gICAgICAgIHZlcnRleC56ID0gejtcclxuICAgICAgICB2ZXJ0ZXgueCA9IHgyO1xyXG4gICAgICAgIC8vIOacgOWQjue7lVjovbTml4vovaxcclxuICAgICAgICBjb25zdCB5MiA9IHZlcnRleC55ICogY29zWCAtIHZlcnRleC56ICogc2luWDtcclxuICAgICAgICBjb25zdCB6MiA9IHZlcnRleC55ICogc2luWCArIHZlcnRleC56ICogY29zWDtcclxuICAgICAgICB2ZXJ0ZXgueSA9IHkyO1xyXG4gICAgICAgIHZlcnRleC56ID0gejI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRyYW5zbGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKz0gdHJhbnNmb3JtLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmVydGV4LnkgKz0gdHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmVydGV4LnogKz0gdHJhbnNmb3JtLnBvc2l0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOe7mOWItueJqeS9k1xyXG5cclxuICAgIHB1YmxpYyBEcmF3T2JqZWN0KG9iajogSW5zdGFuY2UpIHtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IG9iai5tb2RlbDtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG1vZGVsLnZlcnRpY2VzO1xyXG4gICAgICAgIGNvbnN0IGluZGljZXMgPSBtb2RlbC5mYWNlcy5mbGF0TWFwKGZhY2UgPT4gZmFjZS52ZXJ0ZXhJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgLy8g5p6E5bu6TVZQ55+p6Zi1XHJcbiAgICAgICAgY29uc3QgbW9kZWxNYXRyaXggPSBvYmoudHJhbnNmb3JtLmxvY2FsVG9Xb3JsZE1hdHJpeDtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBDYW1lcmEubWFpbkNhbWVyYTtcclxuICAgICAgICBjb25zdCBjYW1lcmFGb3J3YXJkID0gY2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVVwID0gY2FtZXJhLnRyYW5zZm9ybS51cDtcclxuICAgICAgICAvLyDmnoTlu7rkuIDkuKrlhYjmnJ3mkYTlvbHmnLrlj43mlrnlkJHnp7vliqjvvIzlho3lj43mlrnlkJHml4vovaznmoTnn6npmLXvvIzlhbblrp7lvpfliLDnmoTkuZ/lsLHmmK/kuIrpnaLmkYTlvbHmnLrnmoTkuJbnlYzlnZDmoIfnn6npmLVcclxuICAgICAgICBjb25zdCBtb2RlbFZpZXdNYXRyaXggPSBtb2RlbE1hdHJpeC5jb3B5KCkudHJhbnNmb3JtVG9Mb29rQXRTcGFjZShjYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLCBjYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLmFkZChjYW1lcmFGb3J3YXJkKSwgY2FtZXJhVXApO1xyXG4gICAgICAgIGNvbnN0IG12cE1hdHJpeCA9IG1vZGVsVmlld01hdHJpeC5wZXJzcGVjdGl2ZShjYW1lcmEuZm92LCBjYW1lcmEuYXNwZWN0LCBjYW1lcmEubmVhckNsaXAsIGNhbWVyYS5mYXJDbGlwKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvamVjdGVkVmVydGljZXMgPSBuZXcgQXJyYXkodmVydGljZXMubGVuZ3RoKTtcclxuICAgICAgICAvLyDnroDljZXlj5jmjaJcclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgLy8gICAgIGxldCB2ZXJ0aWNlID0gdmVydGljZXNbaV0uY29weSgpO1xyXG4gICAgICAgIC8vICAgICAvLyDlhYjlj5jmjaJcclxuICAgICAgICAvLyAgICAgdGhpcy5BcHBseVRyYW5zZm9ybSh2ZXJ0aWNlLCBvYmoudHJhbnNmb3JtKTtcclxuICAgICAgICAvLyAgICAgLy8g5YaN5oqV5b2xXHJcbiAgICAgICAgLy8gICAgIHByb2plY3RlZFZlcnRpY2VzW2ldID0gdGhpcy5Qcm9qZWN0VmVydGV4KHZlcnRpY2UpO1xyXG4gICAgICAgIC8vICAgICAvLyDlho3op4blj6PmmKDlsIRcclxuICAgICAgICAvLyAgICAgdGhpcy5WaWV3cG9ydFRvQ2FudmFzKHByb2plY3RlZFZlcnRpY2VzW2ldKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gbGV0IHZzID0gcHJvamVjdGVkVmVydGljZXM7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIE1WUOWPmOaNolxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRpY2UgPSB2ZXJ0aWNlc1tpXS5jb3B5KCk7XHJcbiAgICAgICAgICAgIGxldCB2ID0gbXZwTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2ZXJ0aWNlLCAxKSk7XHJcbiAgICAgICAgICAgIHByb2plY3RlZFZlcnRpY2VzW2ldID0gdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gMS4g6YCP6KeG6Zmk5rOV77ya5bCG6KOB5Ymq56m66Ze05Z2Q5qCH6L2s5o2i5Li65qCH5YeG6K6+5aSH5Z2Q5qCH77yITkRD77yJXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0ZWRWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB2ID0gcHJvamVjdGVkVmVydGljZXNbaV07XHJcbiAgICAgICAgICAgIC8vIHfliIbph4/mmK/pgI/op4bmipXlvbHkuqfnlJ/nmoTvvIznlKjkuo7pgI/op4bpmaTms5VcclxuICAgICAgICAgICAgY29uc3QgdyA9IHYudzsgLy8g5YGH6K6+5L2g55qEVmVjdG9yNC9WZWN0b3Iz5a6e546w5Lit77yM6b2Q5qyh5Z2Q5qCHd+WtmOWCqOWcqHflsZ7mgKfkuK3jgILlpoLmnpzmsqHmnInvvIzpnIDopoHnoa7kv51NVlDlj5jmjaLml7blpITnkIbkuobpvZDmrKHlnZDmoIfjgIJcclxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5pi+5byP55qEd+WIhumHj++8jOS4lG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjPov5Tlm57nmoTmmK9WZWN0b3Iz77yM6YKj5LmI6YCa5bi46K6k5Li6dz0x77yI5q2j5Lqk5oqV5b2x77yJ5oiW6ICF6ZyA6KaB5LuO5Y+Y5o2i55+p6Zi15Lit6ICD6JmR6YCP6KeGXHJcblxyXG4gICAgICAgICAgICAvLyDov5vooYzpgI/op4bpmaTms5XvvJp4eXrliIbliKvpmaTku6V3XHJcbiAgICAgICAgICAgIC8vIOazqOaEj++8muWmguaenOS9oOeahOefqemYteS5mOazleayoeacieWkhOeQhum9kOasoeWdkOagh++8iOWNs+i/lOWbnueahHZlcnRpY2XmmK/kuInnu7TlkJHph4/vvInvvIzpgqPkuYjlvojlj6/og73kvaDnmoTlj5jmjaLmsqHmnInljIXlkKvpgI/op4bmipXlvbHkuqfnlJ/nmoR35YiG6YeP44CCXHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuS9oOeahG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjPnoa7lrp7ov5Tlm57kuobljIXlkKvpvZDmrKHlnZDmoIfnmoRWZWN0b3I077yM5oiW6ICF5pyJ5LiA5Liq6L+U5ZueVmVjdG9yNOeahOaWueazleOAglxyXG4gICAgICAgICAgICAvLyDov5nph4zlgYforr4gcHJvamVjdGVkVmVydGljZXMg5Lit5a2Y5YKo55qE5pivIFZlY3RvcjTvvIzmiJbogIXoh7PlsJHmnIkgeCwgeSwgeiwgdyDlsZ7mgKfjgIJcclxuXHJcbiAgICAgICAgICAgIC8vIOWmguaenOaCqOeahOWunueOsOS4re+8jOe7j+i/h+mAj+inhuaKleW9seefqemYteWPmOaNouWQju+8jOmhtueCueW3sue7j+aYr+S4gOS4qum9kOasoeWdkOagh++8iHgsIHksIHosIHfvvInvvIzliJnpnIDopoHku6XkuIvpmaTms5XvvJpcclxuICAgICAgICAgICAgdi54ID0gdi54IC8gdztcclxuICAgICAgICAgICAgdi55ID0gdi55IC8gdztcclxuICAgICAgICAgICAgdi56ID0gdi56IC8gdzsgLy8g5a+55LqO5rex5bqm5L+h5oGv77yM5Y+v6IO96L+Y6ZyA6KaB6L+b5LiA5q2l5aSE55CG77yM5L2G5bGP5bmV5pig5bCE6YCa5bi45Li76KaB5YWz5rOoeCx5XHJcbiAgICAgICAgICAgIC8vIOe7j+i/h+mAj+inhumZpOazleWQju+8jOWdkOagh+S9jeS6juagh+WHhuiuvuWkh+WdkOagh++8iE5EQ++8ieepuumXtO+8jOmAmuW4uHgsIHksIHrojIPlm7TlnKhbLTEsIDFd77yIT3BlbkdM6aOO5qC877yJ5oiWWzAsIDFd77yIRGlyZWN0WOmjjuagvO+8ieS5i+mXtOOAglxyXG4gICAgICAgICAgICAvLyDlgYforr7miJHku6znmoROREPmmK9bLTEsIDFd6IyD5Zu044CCXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAyLiDop4blj6Plj5jmjaLvvJrlsIZOREPlnZDmoIfmmKDlsITliLDlsY/luZXlnZDmoIdcclxuICAgICAgICAvLyDojrflj5bnlLvluIPvvIjmiJbop4blj6PvvInnmoTlrr3luqblkozpq5jluqZcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IG5ldyBBcnJheShwcm9qZWN0ZWRWZXJ0aWNlcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdGVkVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbmRjID0gcHJvamVjdGVkVmVydGljZXNbaV07IC8vIOatpOaXtm5kY+W6lOivpeaYr+e7j+i/h+mAj+inhumZpOazleWQjueahE5EQ+WdkOagh1xyXG5cclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeOS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuV2lkdGhdXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblggPSAoKG5kYy54ICsgMSkgLyAyKSAqIENvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeeS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuSGVpZ2h0XeOAguazqOaEj+Wxj+W5leWdkOagh+mAmuW4uHnlkJHkuIvkuLrmraPvvIzogIxOREPnmoR55ZCR5LiK5Li65q2j77yM5omA5Lul6ZyA6KaB57+76L2sXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblkgPSBDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgobmRjLnkgKyAxKSAvIDIpICogQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICAgICAgICAgIC8vIHrliIbph4/pgJrluLjnlKjkuo7mt7HluqbmtYvor5XvvIzov5nph4zmiJHku6zlj6rlhbPlv4PlsY/luZV4LHlcclxuICAgICAgICAgICAgLy8g5aaC5p6c5L2g55qETkRDeuiMg+WbtOaYr1stMSwxXeS4lOmcgOimgeaYoOWwhOWIsFswLDFd77yI5L6L5aaCV2ViR1BV5p+Q5Lqb5oOF5Ya177yJ77yM5Y+v5Lul57G75Ly85aSE55CG77yaY29uc3Qgc2NyZWVuWiA9IChuZGMueiArIDEpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHNjcmVlblZlcnRpY2VzW2ldID0geyB4OiBzY3JlZW5YLCB5OiBzY3JlZW5ZIH07IC8vIOWtmOWCqOWxj+W5leWdkOagh1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdnMgPSBzY3JlZW5WZXJ0aWNlcztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8g5pyA5ZCO57uY5Yi25LiJ6KeS5b2i5Yiw5bGP5bmV5LiKXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAxID0gdnNbaW5kaWNlc1tpXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0gdnNbaW5kaWNlc1tpICsgMV1dO1xyXG4gICAgICAgICAgICBjb25zdCBwMyA9IHZzW2luZGljZXNbaSArIDJdXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOe6v+ahhuaooeW8j++8jOaaguS4jeaUr+aMgemhtueCueiJslxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuV2lyZWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZShwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAxLngsIHAxLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAyLngsIHAyLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5TaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1RyaWFuZ2xlKHAxLngsIHAxLnksIHAyLngsIHAyLnksIHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5bel5YW35Ye95pWwXHJcblxyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIOe6v+aAp+aPkuWAvFxyXG4gICAgLy8vIOS8oOWFpTLkuKrngrnvvIzov5Tlm57lroPku6znu4TmiJDnur/mrrXnmoTmj5LlgLzjgIJcclxuICAgIC8vLyDopoHmsYLvvJpcclxuICAgIC8vLyAxLiDopoHlhYjnrpflh7rnm7Tnur/lgY/msLTlubPov5jmmK/lnoLnm7TvvIzlpoLmnpzmmK/lgY/msLTlubPvvIjmlpznjoflsI/kuo4x77yJ77yM5YiZ5LuleOS4uuW+queOr++8jOS8oOWFpemhuuW6j+aYryh4MSx5MSx4Mix5MinvvIzlj43kuYvlpoLmnpznm7Tnur/lgY/lnoLnm7TvvIzliJnmmK8oeTEseDEseTIseDIpXHJcbiAgICAvLy8gMi4g5ZCM5pe26KaB56Gu5L+d57q/5q6154K555qE5pa55ZCR5piv5LuO5bem5b6A5Y+z5oiW5LuO5LiK5b6A5LiL77yM5L6L5aaC57q/5q615piv5YGP5rC05bmz55qE6K+d77yM6KaB56Gu5L+deDI+eDHvvIzlpoLmnpzmmK/lgY/lnoLnm7TnmoTor53vvIzopoHnoa7kv515Mj55MVxyXG4gICAgLy8vIOS4vuS4quS+i+WtkO+8mlxyXG4gICAgLy8vIOeCuSgwLCAwKeWSjCgyLDEp77yM5Lyg5YWl55qE5Y+C5pWw5pivKDAsIDAsIDIsIDEp77yM6L+U5Zue55qE5pivKCgyLTApKzE9MynkuKrlgLzvvIzov5nkupvlgLzmmK/ku44oMC0xKeS4remXtOaPkuWAvOeahO+8jOWNsygwLCAwLjUsIDEpXHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgcHJpdmF0ZSBJbnRlcnBvbGF0ZShhMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMjogbnVtYmVyLCBiMjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj+S7pemBv+WFjeWKqOaAgeaJqeWuuVxyXG4gICAgICAgIC8vIGNvbnN0IGR4ID0gTWF0aC5hYnMoTWF0aC5mbG9vcihhMiAtIGExKSk7XHJcbiAgICAgICAgY29uc3QgZHggPSAoKGEyID4gYTEgPyBhMiAtIGExIDogYTEgLSBhMikgfCAwKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBBcnJheShkeCArIDEpO1xyXG4gICAgICAgIGNvbnN0IGEgPSAoYjIgLSBiMSkgLyAoYTIgLSBhMSk7XHJcbiAgICAgICAgbGV0IGQgPSBiMTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICB2YWx1ZVtpXSA9IGQ7XHJcbiAgICAgICAgICAgIGQgKz0gYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59IiwiaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2UsIFRyYW5zZm9ybSB9IGZyb20gXCIuLi9Nb2RlbFwiO1xyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSBcIi4vRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgeyBPQkpQYXJzZXIgfSBmcm9tIFwiLi9PYmpQYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBc3NldExvYWRlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBmaWxlQ2FjaGU6IERpY3Rpb25hcnkgPSBuZXcgRGljdGlvbmFyeSgpO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEltYWdlRmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KChyZXNvbHZlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSB0aGUgaW1hZ2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCBvbiBsb2FkaW5nIGFuIGltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDot6jljLror7fmsYJcclxuICAgICAgICAgICAgICAgIGltYWdlLmNyb3NzT3JpZ2luID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZWxsIHRoZSBicm93c2VyIHRvIGxvYWQgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGZpbGVOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkVGV4dEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zkuI3opoHlvIDlkK/lvILmraXvvIzorr7nva7kuLpmYWxzZe+8jOWQpuWImeWuueaYk+WNoeWcqHJlYWR5U3RhdGUgPSAx77yM5Y6f5Zug5LiN5piOXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgZmlsZU5hbWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZE1vZGVsRmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxPQkpEb2M+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8T0JKRG9jPigocmVzb2x2ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqRG9jID0gbmV3IE9CSkRvYyhmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgb2JqRG9jLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0LCAxLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiT0JKIGZpbGUgcGFyc2luZyBlcnJvcjogXCIgKyBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIG9iakRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iakRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICovXHJcbiAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBsb2FkSW5zdGFuY2VGcm9tTW9kZWwobmFtZTogc3RyaW5nLCBtb2RlbFBhdGg6IHN0cmluZywgc2NhbGU6IG51bWJlciA9IDEsIHJldmVyc2U6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8SW5zdGFuY2U+IHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2UobmFtZSk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uaWRlbnRpdHk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gVmVjdG9yMy5PTkU7XHJcblxyXG4gICAgICAgIHZhciBvYmpEb2MgPSBhd2FpdCBBc3NldExvYWRlci5sb2FkVGV4dEZpbGUobW9kZWxQYXRoKTtcclxuICAgICAgICBpZiAob2JqRG9jICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBPQkpQYXJzZXIucGFyc2VPQkoob2JqRG9jKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UubW9kZWwgPSBtb2RlbDtcclxuXHJcbiAgICAgICAgICAgIC8vIOi+k+WHuue7n+iuoeS/oeaBr1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhPQkpQYXJzZXIuZ2V0TW9kZWxTdGF0cyhtb2RlbCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gdmFyIG9ianMgPSBvYmpEb2MuZ2V0T2JqcyhzY2FsZSwgcmV2ZXJzZSk7XHJcbiAgICAgICAgICAgIC8vIG9ianMuZm9yRWFjaChhc3luYyBvYmogPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgLy90b2RvOuS4tOatu+WGmeatu++8jOWPquWKoOi9vea8q+WPjeWwhOi0tOWbvlxyXG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKG9iai5tYXRlcmlhbCAhPSBudWxsICYmIG9iai5tYXRlcmlhbC5tYXBfS2QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHJlbmRlci5tYXRlcmlhbC5jcmVhdGVUZXh0dXJlKG9iai5tYXRlcmlhbC5tYXBfS2QpO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLnZlcnRpY2VzID0gb2JqLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwuaW5kaWNlcyA9IG9iai5pbmRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwudXZzID0gb2JqLnV2cztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLm5vcm1hbHMgPSBvYmoubm9ybWFscztcclxuICAgICAgICAgICAgLy8gICAgIGluc3RhbmNlLm1vZGVsLnB1c2gobW9kZWwpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xyXG5cclxuICBpdGVtczogb2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcclxuICAgIHRoaXMuaXRlbXNba2V5XSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuaXRlbXNba2V5XSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5pdGVtc1trXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGZ1bikge1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGZ1bihrLCB0aGlzLml0ZW1zW2tdKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAnLi4vTWF0aC9WZWN0b3IzJztcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJy4uL01hdGgvVmVjdG9yMic7XHJcblxyXG4vKipcclxuICogT0JK5qih5Z6L6Kej5p6Q57uT5p6c5o6l5Y+jXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9CSk1vZGVsIHtcclxuICAgIHZlcnRpY2VzOiBWZWN0b3IzW107XHJcbiAgICB0ZXh0dXJlQ29vcmRzOiBWZWN0b3IyW107XHJcbiAgICB2ZXJ0ZXhOb3JtYWxzOiBWZWN0b3IzW107XHJcbiAgICBmYWNlczogRmFjZVtdO1xyXG4gICAgbWF0ZXJpYWxzOiBSZWNvcmQ8c3RyaW5nLCBNYXRlcmlhbD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDpnaLmjqXlj6PvvIzmlK/mjIHkuInop5LlvaLlkozlpJrovrnlvaJcclxuICovXHJcbmludGVyZmFjZSBGYWNlIHtcclxuICAgIHZlcnRleEluZGljZXM6IG51bWJlcltdO1xyXG4gICAgdGV4dHVyZUluZGljZXM/OiBudW1iZXJbXTtcclxuICAgIG5vcm1hbEluZGljZXM/OiBudW1iZXJbXTtcclxuICAgIG1hdGVyaWFsTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIOadkOi0qOS/oeaBr+aOpeWPo1xyXG4gKi9cclxuaW50ZXJmYWNlIE1hdGVyaWFsIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8vIOWPr+agueaNrumcgOimgeaJqeWxleadkOi0qOWxnuaAp1xyXG59XHJcblxyXG4vKipcclxuICogT0JK5paH5Lu26Kej5p6Q5Zmo57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT0JKUGFyc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6QT0JK5paH5Lu2XHJcbiAgICAgKiBAcGFyYW0gZmlsZUNvbnRlbnQgT0JK5paH5Lu25YaF5a65XHJcbiAgICAgKiBAcmV0dXJucyDop6PmnpDlkI7nmoRPQkrmqKHlnovmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwYXJzZU9CSihmaWxlQ29udGVudDogc3RyaW5nKTogT0JKTW9kZWwge1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gZmlsZUNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQ6IE9CSk1vZGVsID0ge1xyXG4gICAgICAgICAgICB2ZXJ0aWNlczogW10sXHJcbiAgICAgICAgICAgIHRleHR1cmVDb29yZHM6IFtdLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhOb3JtYWxzOiBbXSxcclxuICAgICAgICAgICAgZmFjZXM6IFtdLFxyXG4gICAgICAgICAgICBtYXRlcmlhbHM6IHt9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50TWF0ZXJpYWwgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRMaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDot7Pov4fnqbrooYzlkozms6jph4pcclxuICAgICAgICAgICAgaWYgKCF0cmltbWVkTGluZSB8fCB0cmltbWVkTGluZS5zdGFydHNXaXRoKCcjJykpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGluZVBhcnRzID0gdHJpbW1lZExpbmUuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgY29uc3Qga2V5d29yZCA9IGxpbmVQYXJ0c1swXTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5d29yZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndic6IC8vIOmhtueCueWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZlcnRpY2VzLnB1c2godmVydGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndnQnOiAvLyDnurnnkIblnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleENvb3JkID0gbmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRleHR1cmVDb29yZHMucHVzaCh0ZXhDb29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3ZuJzogLy8g6aG254K55rOV57q/XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3JtYWwgPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmVydGV4Tm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2YnOiAvLyDpnaLlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2U6IEZhY2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbEluZGljZXM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDpnaLnmoTmr4/kuKrpobbngrnlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lUGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERlZiA9IGxpbmVQYXJ0c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIF244CBdi92dOOAgXYvL3Zu44CBdi92dC92buetieWkmuenjeagvOW8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UGFydHMgPSB2ZXJ0ZXhEZWYuc3BsaXQoJy8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpobbngrnntKLlvJXvvIhPQkrntKLlvJXku44x5byA5aeL77yM6ZyA6KaB6L2s5o2i5Li65LuOMOW8gOWni++8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS52ZXJ0ZXhJbmRpY2VzLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMF0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g57q555CG5Z2Q5qCH57Si5byV77yI5Y+v6YCJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMV0gJiYgdmVydGV4UGFydHNbMV0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS50ZXh0dXJlSW5kaWNlcyEucHVzaChwYXJzZUludCh2ZXJ0ZXhQYXJ0c1sxXSkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDms5Xnur/ntKLlvJXvvIjlj6/pgInvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1syXSAmJiB2ZXJ0ZXhQYXJ0c1syXSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLm5vcm1hbEluZGljZXMhLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMl0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaciee6ueeQhuaIluazlee6v+e0ouW8le+8jOa4heepuuaVsOe7hOS7peS/neaMgeaVsOaNruaVtOa0gVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2UudGV4dHVyZUluZGljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2Uubm9ybWFsSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2Uubm9ybWFsSW5kaWNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5re75Yqg5p2Q6LSo5L+h5oGv77yI5aaC5p6c5pyJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UubWF0ZXJpYWxOYW1lID0gY3VycmVudE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZmFjZXMucHVzaChmYWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbXRsbGliJzogLy8g5p2Q6LSo5bqT5byV55SoXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbExpYk5hbWUgPSBsaW5lUGFydHNbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWunumZheW6lOeUqOS4remcgOimgeWKoOi9veW5tuino+aekOWvueW6lOeahC5tdGzmlofku7ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWPkeeOsOadkOi0qOW6k+W8leeUqDogJHttYXRlcmlhbExpYk5hbWV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VzZW10bCc6IC8vIOS9v+eUqOadkOi0qFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE1hdGVyaWFsID0gbGluZVBhcnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJbmnZDotKjorrDlvZXvvIjlrp7pmYXkvb/nlKjml7bpnIDopoHku44ubXRs5paH5Lu25Yqg6L295a6M5pW05L+h5oGv77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdID0geyBuYW1lOiBjdXJyZW50TWF0ZXJpYWwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlj6/ku6Xmt7vliqDmm7TlpJpPQkrmoLzlvI/lhbPplK7lrZfnmoTlpITnkIZcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5b+955Wl5LiN5pSv5oyB55qE5YWz6ZSu5a2XXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbop6PmnpDlkI7nmoTmqKHlnovmlbDmja7ovazmjaLkuLpKU09O5a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyBKU09O5a2X56ym5LiyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9KU09OKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1vZGVsLCBudWxsLCAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaooeWei+e7n+iuoeS/oeaBr1xyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMg57uf6K6h5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TW9kZWxTdGF0cyhtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVDb3VudCA9IG1vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbENvdW50ID0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoVGV4dHVyZXMgPSBtb2RlbC5mYWNlcy5maWx0ZXIoZmFjZSA9PiBmYWNlLnRleHR1cmVJbmRpY2VzKS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoTm9ybWFscyA9IG1vZGVsLmZhY2VzLmZpbHRlcihmYWNlID0+IGZhY2Uubm9ybWFsSW5kaWNlcykubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gYFxyXG7mqKHlnovnu5/orqHkv6Hmga86XHJcbi0g6aG254K55pWwOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aH1cclxuLSDnurnnkIblnZDmoIfmlbA6ICR7dGV4dHVyZUNvdW50fVxyXG4tIOazlee6v+WQkemHj+aVsDogJHtub3JtYWxDb3VudH1cclxuLSDpnaLmlbA6ICR7bW9kZWwuZmFjZXMubGVuZ3RofVxyXG4tIOW4pue6ueeQhueahOmdojogJHtmYWNlc1dpdGhUZXh0dXJlc31cclxuLSDluKbms5Xnur/nmoTpnaI6ICR7ZmFjZXNXaXRoTm9ybWFsc31cclxuLSDmnZDotKjmlbA6ICR7T2JqZWN0LmtleXMobW9kZWwubWF0ZXJpYWxzKS5sZW5ndGh9XHJcbiAgICAgICAgYC50cmltKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpqozor4Hop6PmnpDmlbDmja7nmoTlrozmlbTmgKdcclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIOmqjOivgee7k+aenOa2iOaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlTW9kZWwobW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIC8vIOajgOafpemdoue0ouW8leaYr+WQpui2iueVjFxyXG4gICAgICAgIGZvciAoY29uc3QgZmFjZSBvZiBtb2RlbC5mYWNlcykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZlcnRleEluZGV4IG9mIGZhY2UudmVydGV4SW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleEluZGV4IDwgMCB8fCB2ZXJ0ZXhJbmRleCA+PSBtb2RlbC52ZXJ0aWNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg6aG254K557Si5byV6LaK55WMOiAke3ZlcnRleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZXhJbmRleCBvZiBmYWNlLnRleHR1cmVJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleEluZGV4IDwgMCB8fCB0ZXhJbmRleCA+PSBtb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg57q555CG5Z2Q5qCH57Si5byV6LaK55WMOiAke3RleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoIC0gMX0pYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS5ub3JtYWxJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vcm1hbEluZGV4IG9mIGZhY2Uubm9ybWFsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxJbmRleCA8IDAgfHwgbm9ybWFsSW5kZXggPj0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOazlee6v+e0ouW8lei2iueVjDogJHtub3JtYWxJbmRleH0gKOacgOWkpzogJHttb2RlbC52ZXJ0ZXhOb3JtYWxzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwIFxyXG4gICAgICAgICAgICA/IGDlj5HnjrAgJHtlcnJvcnMubGVuZ3RofSDkuKrplJnor686XFxuJHtlcnJvcnMuam9pbignXFxuJyl9YFxyXG4gICAgICAgICAgICA6ICfmqKHlnovmlbDmja7pqozor4HpgJrov4cnO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ2FtZXJhXCI7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vSW5wdXRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSBcIi4vTW9kZWxcIjtcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBBc3NldExvYWRlciB9IGZyb20gXCIuL1V0aWxzL0Fzc2V0TG9hZGVyXCI7XHJcblxyXG4vLyDlr7nosaHliJfooahcclxuY29uc3QgaW5zdGFuY2VzOiBJbnN0YW5jZVtdID0gW107XHJcblxyXG4vLyDlvZNET03lhoXlrrnliqDovb3lrozmiJDlkI7miafooYxcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIC8vIOiOt+WPlmNhbnZhc+WFg+e0oOWSjDJE5riy5p+T5LiK5LiL5paHXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAvLyDorr7nva5jYW52YXPlsLrlr7hcclxuICAgIGNhbnZhcy53aWR0aCA9IENvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBDb25maWcuY2FudmFzSGVpZ2h0O1xyXG5cclxuICAgIC8vIOWIm+W7uuWbvuWDj+aVsOaNruWvueixoVxyXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YShDb25maWcuY2FudmFzV2lkdGgsIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKHVpbnQzMlZpZXcpO1xyXG5cclxuICAgIEluaXQoKTtcclxuXHJcbiAgICAvLyDmuLLmn5Plh73mlbBcclxuICAgIGZ1bmN0aW9uIG1haW5Mb29wKCkge1xyXG4gICAgICAgIC8vIOWkhOeQhumAu+i+kVxyXG4gICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIFJlbmRlcihyZW5kZXJlcik7XHJcbiAgICAgICAgLy8g5bCG5Zu+5YOP5pWw5o2u57uY5Yi25YiwY2FudmFz5LiKXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgIC8vIOivt+axguS4i+S4gOW4p+WKqOeUu1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbiAgICB9XHJcbiAgICAvLyDlvIDlp4vliqjnlLvlvqrnjq9cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbn0pO1xyXG5cclxuLy8g6I635Y+W6byg5qCH5LqL5Lu2XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgLy8g6I635Y+W6byg5qCH55u45a+55LqOY2FudmFz55qE5Z2Q5qCHXHJcbiAgICBjb25zdCByZWN0ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgSW5wdXQubW91c2VYID0gbW91c2VYO1xyXG4gICAgSW5wdXQubW91c2VZID0gbW91c2VZO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICBsZXQgbGVlOiBJbnN0YW5jZTtcclxuXHJcbiAgICAvLyDnm7jmnLpcclxuICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoXCJjYW1lcmFcIik7XHJcbiAgICAvL2NhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAtMTApO1xyXG5cclxuICAgIC8vIOWKoOi9veaooeWei1xyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdsZWUnLCAncmVzb3VyY2VzL2Fzc2V0cy9tZXNoZXMvbGVlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgbGVlID0gaW5zdGFuY2U7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMik7XHJcbiAgICAgICAgaW5zdGFuY2VzLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdjdWJlJywgJ3Jlc291cmNlcy9jdWJlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMSwgMCwgMCk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjMoMC4xLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgLy9pbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24gPSBuZXcgUXVhdGVybmlvbihuZXcgVmVjdG9yMygwLCA0NSwgMCkpO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5zZXRQYXJlbnQobGVlLnRyYW5zZm9ybSwgZmFsc2UpO1xyXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKGluc3RhbmNlKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5sZXQgYW5nbGUgPSAwO1xyXG5mdW5jdGlvbiBVcGRhdGUoKSB7XHJcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZS5uYW1lID09IFwiY3ViZVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOS9v+eUqHNpbuWHveaVsOWunueOsOe8qeaUvuWcqDAuOeWIsDEuMeS5i+mXtOW+queOr1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZU9mZnNldCA9IE1hdGguc2luKERhdGUubm93KCkgKiAwLjAwMikgKiAwLjEgKyAwLjE7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICBzY2FsZS54ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICAgICAgICAgIHNjYWxlLnkgPSBzY2FsZU9mZnNldDtcclxuICAgICAgICAgICAgc2NhbGUueiA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgICAgICAgICBpbnN0YW5jZS50cmFuc2Zvcm0uc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKGFuZ2xlLCBWZWN0b3IzLkZPUldBUkQpO1xyXG4gICAgICAgICAgICBhbmdsZSArPSAxO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOiuqeeJqeS9k+WcqOaJgOaciei9tOS4iuaXi+i9rFxyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKGFuZ2xlLCBWZWN0b3IzLlVQKTtcclxuICAgICAgICAvLyBhbmdsZSArPSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBSZW5kZXIocmVuZGVyZXI6IFJlbmRlcmVyKSB7XHJcbiAgICByZW5kZXJlci5DbGVhcihDb2xvci5CTEFDSyk7XHJcblxyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICByZW5kZXJlci5EcmF3T2JqZWN0KGluc3RhbmNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlLvkuInop5LlvaJcclxuICAgIC8vIHJlbmRlcmVyLkRyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcigwLCAwLCAxMDAsIDEwMCwgSW5wdXQubW91c2VYLCBJbnB1dC5tb3VzZVksIENvbG9yLlJFRCwgQ29sb3IuR1JFRU4sIENvbG9yLkJMVUUpO1xyXG59Il19
