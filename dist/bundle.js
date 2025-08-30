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
    Matrix4x4.prototype.clone = function () {
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
    Quaternion.prototype.clone = function () {
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
    Vector2.prototype.clone = function () {
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
    Vector3.prototype.clone = function () {
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
    Vector4.prototype.clone = function () {
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
            return this._tempPos.clone();
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
            return this._tempRot.clone();
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
            return this._tempScale.clone();
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
        this.drawMode = DrawMode.Wireframe;
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
    /*
     * 顶点处理阶段：模型空间 →（模型矩阵阵）→ 世界空间 →（视图矩阵）→ 观察空间 →（投影矩阵）→ 裁剪空间 →（透视除法）→ NDC 空间 →（视口变换）→ 屏幕空间 → 光栅化渲染
     */
    Renderer.prototype.VertexProcessingStage = function (obj) {
        var model = obj.model;
        var vertices = model.vertices;
        var clipSpaceVertices = new Array(vertices.length);
        // 构建MVP矩阵
        var modelMatrix = obj.transform.localToWorldMatrix;
        var camera = Camera_1.Camera.mainCamera;
        var cameraForward = camera.transform.forward;
        var cameraUp = camera.transform.up;
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        var modelViewMatrix = modelMatrix.clone().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        var mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);
        // 1. MVP变换到裁剪空间
        // 模型空间 -> 世界空间 -> 观察空间 -> 裁剪空间
        for (var i = 0; i < vertices.length; i += 1) {
            var vertice = vertices[i].clone();
            var v = mvpMatrix.multiplyVector4(new Vector4_1.Vector4(vertice, 1));
            clipSpaceVertices[i] = v;
        }
        // 2. 透视除法：将裁剪空间坐标转换为标准设备坐标（NDC）
        // 裁剪空间 -> 标准化设备坐标（NDC 空间）
        for (var i = 0; i < clipSpaceVertices.length; i++) {
            var v = clipSpaceVertices[i];
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
        // 3. 视口变换：将NDC坐标映射到屏幕坐标
        // 标准化设备坐标（NDC 空间） -> 屏幕空间
        // 获取画布（或视口）的宽度和高度
        var screenVertices = new Array(clipSpaceVertices.length);
        for (var i = 0; i < clipSpaceVertices.length; i++) {
            var ndc = clipSpaceVertices[i]; // 此时ndc应该是经过透视除法后的NDC坐标
            // 将NDC的x从[-1, 1]映射到[0, screenWidth]
            var screenX_1 = ((ndc.x + 1) / 2) * Config_1.Config.canvasWidth;
            // 将NDC的y从[-1, 1]映射到[0, screenHeight]。注意屏幕坐标通常y向下为正，而NDC的y向上为正，所以需要翻转
            var screenY_1 = Config_1.Config.canvasHeight - (((ndc.y + 1) / 2) * Config_1.Config.canvasHeight);
            // z分量通常用于深度测试，这里我们只关心屏幕x,y
            // 如果你的NDCz范围是[-1,1]且需要映射到[0,1]（例如WebGPU某些情况），可以类似处理：const screenZ = (ndc.z + 1) / 2;
            screenVertices[i] = { x: screenX_1, y: screenY_1 }; // 存储屏幕坐标
        }
        return screenVertices;
    };
    /*
     * 简单变换阶段：没有通过矩阵计算，而是简单的相似三角形原理，三角函数算出MVP变换跟屏幕映射，理解起来比较简单，但每个顶点都经过从头到尾的计算，比较耗性能
     */
    Renderer.prototype.EasyVertexProcessingStage = function (obj) {
        var model = obj.model;
        var vertices = model.vertices;
        var clipSpaceVertices = new Array(vertices.length);
        // 简单变换
        for (var i = 0; i < vertices.length; i += 1) {
            var vertice = vertices[i].clone();
            // 先变换，必须严格按照先缩放，再旋转，再平移
            this.ScaleVertex(vertice, obj.transform);
            this.RotateVertex(vertice, obj.transform);
            this.TranslateVertex(vertice, obj.transform);
            // 再投影
            clipSpaceVertices[i] = this.ProjectVertex(vertice);
            // 再视口映射
            this.ViewportToCanvas(clipSpaceVertices[i]);
        }
        return clipSpaceVertices;
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
        var indices = model.faces.flatMap(function (face) { return face.vertexIndices; });
        // MVP变换
        var screenVertices = this.VertexProcessingStage(obj);
        // 简单MVP变换
        // const screenVertices = this.EasyVertexProcessingStage(obj);
        // 最后绘制三角形到屏幕上
        for (var i = 0; i < indices.length; i += 3) {
            var p1 = screenVertices[indices[i]];
            var p2 = screenVertices[indices[i + 1]];
            var p3 = screenVertices[indices[i + 2]];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FtZXJhLnRzIiwic3JjL0NvbG9yLnRzIiwic3JjL0NvbmZpZy50cyIsInNyYy9JbnB1dC50cyIsInNyYy9NYXRoL01hdHJpeDR4NC50cyIsInNyYy9NYXRoL1F1YXRlcm5pb24udHMiLCJzcmMvTWF0aC9WZWN0b3IyLnRzIiwic3JjL01hdGgvVmVjdG9yMy50cyIsInNyYy9NYXRoL1ZlY3RvcjQudHMiLCJzcmMvTW9kZWwudHMiLCJzcmMvUmVuZGVyZXIudHMiLCJzcmMvVXRpbHMvQXNzZXRMb2FkZXIudHMiLCJzcmMvVXRpbHMvRGljdGlvbmFyeS50cyIsInNyYy9VdGlscy9PYmpQYXJzZXIudHMiLCJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUNBQWdDO0FBQ2hDLG1DQUFrQztBQUNsQywwQ0FBeUM7QUFDekMsaUNBQW1DO0FBRW5DLElBQVksZ0JBS1g7QUFMRCxXQUFZLGdCQUFnQjtJQUN4Qix1REFBUSxDQUFBO0lBQ1IseURBQWlCLENBQUE7SUFDakIsNkRBQWEsQ0FBQTtJQUNiLDJEQUFXLENBQUE7QUFDZixDQUFDLEVBTFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFLM0I7QUFFRDtJQUE0QiwwQkFBUTtJQWtCaEMsZ0JBQVksSUFBWTtRQUF4QixZQUNJLGtCQUFNLElBQUksQ0FBQyxTQUtkO1FBcEJNLHFCQUFlLEdBQVUsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUQsY0FBUSxHQUFVLElBQUksYUFBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELGdCQUFVLEdBQXFCLGdCQUFnQixDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7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SSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxnQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUU3QixnREFBZ0Q7SUFDaEQsZ0dBQWdHO0lBQ2hHLGdEQUFnRDtJQUVoRCxtRkFBbUY7SUFDbkYsSUFBSTtJQUVHLDZCQUFTLEdBQWhCO1FBQ0ksc0JBQXNCO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7UUFDN0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsMkJBQTJCO1lBQ3ZDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNKO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFDSSxpRUFBaUU7UUFDakUsZ0NBQWdDO1FBQ2hDLGdEQUFnRDtRQUNoRCxZQUFZO1FBRVosSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFB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LENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVMsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUs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LENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNqRixJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDJCQUFPLEdBQWQ7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXRCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM1RCxlQUFlO1NBQ2xCO1FBRUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBRTNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxpQ0FBYSxHQUFwQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsMEJBQTBCO1FBQzFCLE9BQU8sSUFBSSxZQUFZLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0seUJBQUssR0FBWjtRQUNJLE9BQU8sSUFBSSxTQUFTLENBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2pCLENBQUM7SUFDTixDQUFDO0lBRUQ7O09BRUc7SUFFVyxzQkFBWSxHQUExQixVQUEyQixHQUFZLEVBQUUsSUFBZ0IsRUFBRSxLQUFjO1FBQ3JFLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QyxtREFBbUQ7UUFDbkQsaURBQWlEO1FBQ2pELDBEQUEwRDtRQUMxRCx3REFBd0Q7UUFDeEQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRWEsNEJBQWtCLEdBQWhDLFVBQWlDLEdBQVk7UUFDekMsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHFDQUEyQixHQUF6QyxVQUEwQyxDQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFH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QUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QixLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQzlCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2QsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ1QsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRWEsd0JBQWMsR0FBNUIsVUFBNkIsQ0FBVTtRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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QztZQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUlELDBCQUFRLEdBQVI7UUFDSSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxPQUFPLEVBQUU7WUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDBCQUFRLEdBQWYsVUFBZ0IsQ0FBUztRQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sd0JBQU0sR0FBYixVQUFjLENBQVM7UUFD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QyxHQUFHLFdBQVcsQ0FBQztZQUN0QixLQUFLLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUN0QixLQUFLLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUN0QixRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFakMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsdUJBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0UsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNYLFNBQVM7U0FDWjtRQUVELGFBQWE7UUFDYixRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0RSxjQUFjO0tBQ2pCO0FBQ0wsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLFFBQWtCO0lBQzlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTVCLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO1FBQTdCLElBQU0sUUFBUSxrQkFBQTtRQUNmLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDakM7SUFFRCxPQUFPO0lBQ1AsOEhBQThIO0FBQ2xJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL0NvbG9yXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSBcIi4vTW9kZWxcIjtcclxuXHJcbmV4cG9ydCBlbnVtIENhbWVyYUNsZWFyRmxhZ3Mge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBBTEwgPSAxNjM4NCB8IDI1NixcclxuICAgIENvbG9yID0gMTYzODQsICAvL2dsLkNPTE9SX0JVRkZFUl9CSVRcclxuICAgIERlcHRoID0gMjU2LCAgICAvL2dsLkRFUFRIX0JVRkZFUl9CSVRcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbWVyYSBleHRlbmRzIEluc3RhbmNlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbWFpbkNhbWVyYTogQ2FtZXJhO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FtZXJhczogQXJyYXk8Q2FtZXJhPiA9IG5ldyBBcnJheTxDYW1lcmE+KCk7XHJcblxyXG4gICAgcHVibGljIGJhY2tHcm91bmRDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMC4yNywgMC4yNywgMC4yNywgMS4wKTtcclxuICAgIHB1YmxpYyBmb2dDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMC4yNywgMC4yNywgMC4yNywgMS4wKTtcclxuICAgIHB1YmxpYyBjbGVhckZsYWdzOiBDYW1lcmFDbGVhckZsYWdzID0gQ2FtZXJhQ2xlYXJGbGFncy5Db2xvciB8IENhbWVyYUNsZWFyRmxhZ3MuRGVwdGg7XHJcbiAgICBwdWJsaWMgbmVhckNsaXA6IG51bWJlciA9IDE7XHJcbiAgICBwdWJsaWMgZmFyQ2xpcDogbnVtYmVyID0gMTI4O1xyXG4gICAgcHVibGljIGZvdjogbnVtYmVyID0gNjA7XHJcbiAgICBwdWJsaWMgZGVwdGg6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdmlld1BvcnQ6IFZlY3RvcjQgPSBuZXcgVmVjdG9yNCgwLCAwLCAxLCAxKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFzcGVjdCgpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB2ID0gdGhpcy52aWV3UG9ydDtcclxuICAgICAgICByZXR1cm4gKHYueiAqIENvbmZpZy5jYW52YXNXaWR0aCkgLyAodi53ICogQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgaWYgKENhbWVyYS5tYWluQ2FtZXJhID09IG51bGwpIHtcclxuICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBDYW1lcmEuY2FtZXJhcy5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBkZXN0cm95KCkge1xyXG4gICAgLy8gICAgIHZhciBpbmRleCA9IENhbWVyYS5jYW1lcmFzLmluZGV4T2YodGhpcywgMCk7XHJcbiAgICAvLyAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgIC8vICAgICAgICAgQ2FtZXJhLmNhbWVyYXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGlmIChDYW1lcmEubWFpbkNhbWVyYSA9PSB0aGlzKSB7XHJcbiAgICAvLyAgICAgICAgIGlmIChDYW1lcmEuY2FtZXJhcy5sZW5ndGggPiAwKVxyXG4gICAgLy8gICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSBDYW1lcmEuY2FtZXJhc1swXTtcclxuICAgIC8vICAgICAgICAgZWxzZVxyXG4gICAgLy8gICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSBudWxsO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdISVRFID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMQUNLID0gbmV3IENvbG9yKDAsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSQVkgPSBuZXcgQ29sb3IoMTI4LCAxMjgsIDEyOCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVEID0gbmV3IENvbG9yKDI1NSwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JFRU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTFVFID0gbmV3IENvbG9yKDAsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgWUVMTE9XID0gbmV3IENvbG9yKDI1NSwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDWUFOID0gbmV3IENvbG9yKDAsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQUdFTlRBID0gbmV3IENvbG9yKDI1NSwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBPUkFOR0UgPSBuZXcgQ29sb3IoMjU1LCAxNjUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBVUlBMRSA9IG5ldyBDb2xvcigxMjgsIDAsIDEyOCkuVG9VaW50MzIoKTtcclxuXHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlciA9IDI1NSkge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRvVWludDMyKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5hIDw8IDI0KSB8ICh0aGlzLmIgPDwgMTYpIHwgKHRoaXMuZyA8PCA4KSB8IHRoaXMucjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZyb21VaW50MzIodWludDMyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICB1aW50MzIgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDgpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAxNikgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDI0KSAmIDB4RkZcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhc1dpZHRoOiBudW1iZXIgPSA0MDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhc0hlaWdodDogbnVtYmVyID0gNDAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWxmQ2FudmFzV2lkdGg6IG51bWJlciA9IENvbmZpZy5jYW52YXNXaWR0aCA+PiAxO1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWxmQ2FudmFzSGVpZ2h0OiBudW1iZXIgPSBDb25maWcuY2FudmFzSGVpZ2h0ID4+IDE7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFzcGVjdFJhdGlvOiBudW1iZXIgPSBDb25maWcuY2FudmFzV2lkdGggLyBDb25maWcuY2FudmFzSGVpZ2h0O1xyXG59IiwiZXhwb3J0IGNsYXNzIElucHV0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VYOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVk6IG51bWJlciA9IDA7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeDR4NCB7XHJcblxyXG4gICAgcHVibGljIG1hdHJpeDogQXJyYXk8QXJyYXk8bnVtYmVyPj4gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4oKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb2x1bW4wOiBWZWN0b3I0LCBjb2x1bW4xOiBWZWN0b3I0LCBjb2x1bW4yOiBWZWN0b3I0LCBjb2x1bW4zOiBWZWN0b3I0KTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGFyZ3VtZW50c1tpXSBhcyBWZWN0b3I0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPih2LngsIHYueSwgdi56LCB2LncpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPigwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGV4IOihjFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Um93KGluZGV4OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgYyA9IHRoaXMubWF0cml4W2luZGV4XTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoY1swXSwgY1sxXSwgY1syXSwgY1szXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDliJdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbHVtbihpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMubWF0cml4WzBdW2luZGV4XSwgdGhpcy5tYXRyaXhbMV1baW5kZXhdLCB0aGlzLm1hdHJpeFsyXVtpbmRleF0sIHRoaXMubWF0cml4WzNdW2luZGV4XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldFJvdyhpbmRleDogbnVtYmVyLCByb3c6IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMF0gPSByb3cueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMV0gPSByb3cueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMl0gPSByb3cuejtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bM10gPSByb3cudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0Q29sdW1uKGluZGV4OiBudW1iZXIsIGNvbHVtbjogVmVjdG9yNCkge1xyXG4gICAgICAgIHRoaXMubWF0cml4WzBdW2luZGV4XSA9IGNvbHVtbi54O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzFdW2luZGV4XSA9IGNvbHVtbi55O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzJdW2luZGV4XSA9IGNvbHVtbi56O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzNdW2luZGV4XSA9IGNvbHVtbi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShtOiBNYXRyaXg0eDQpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBsaHMgPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgcmhzID0gbS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1hdHJpeFswXVswXSA9IGxoc1swXVswXSAqIHJoc1swXVswXSArIGxoc1swXVsxXSAqIHJoc1sxXVswXSArIGxoc1swXVsyXSAqIHJoc1syXVswXSArIGxoc1swXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMF1bMV0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMF1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzBdWzJdID0gbGhzWzBdWzBdICogcmhzWzBdWzJdICsgbGhzWzBdWzFdICogcmhzWzFdWzJdICsgbGhzWzBdWzJdICogcmhzWzJdWzJdICsgbGhzWzBdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFswXVszXSA9IGxoc1swXVswXSAqIHJoc1swXVszXSArIGxoc1swXVsxXSAqIHJoc1sxXVszXSArIGxoc1swXVsyXSAqIHJoc1syXVszXSArIGxoc1swXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbMV1bMF0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMV1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzFdWzFdID0gbGhzWzFdWzBdICogcmhzWzBdWzFdICsgbGhzWzFdWzFdICogcmhzWzFdWzFdICsgbGhzWzFdWzJdICogcmhzWzJdWzFdICsgbGhzWzFdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsyXSA9IGxoc1sxXVswXSAqIHJoc1swXVsyXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsyXSArIGxoc1sxXVsyXSAqIHJoc1syXVsyXSArIGxoc1sxXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMV1bM10gPSBsaHNbMV1bMF0gKiByaHNbMF1bM10gKyBsaHNbMV1bMV0gKiByaHNbMV1bM10gKyBsaHNbMV1bMl0gKiByaHNbMl1bM10gKyBsaHNbMV1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzJdWzBdID0gbGhzWzJdWzBdICogcmhzWzBdWzBdICsgbGhzWzJdWzFdICogcmhzWzFdWzBdICsgbGhzWzJdWzJdICogcmhzWzJdWzBdICsgbGhzWzJdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsyXVsxXSA9IGxoc1syXVswXSAqIHJoc1swXVsxXSArIGxoc1syXVsxXSAqIHJoc1sxXVsxXSArIGxoc1syXVsyXSAqIHJoc1syXVsxXSArIGxoc1syXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMl1bMl0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMl1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzJdWzNdID0gbGhzWzJdWzBdICogcmhzWzBdWzNdICsgbGhzWzJdWzFdICogcmhzWzFdWzNdICsgbGhzWzJdWzJdICogcmhzWzJdWzNdICsgbGhzWzJdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFszXVswXSA9IGxoc1szXVswXSAqIHJoc1swXVswXSArIGxoc1szXVsxXSAqIHJoc1sxXVswXSArIGxoc1szXVsyXSAqIHJoc1syXVswXSArIGxoc1szXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbM11bMV0gPSBsaHNbM11bMF0gKiByaHNbMF1bMV0gKyBsaHNbM11bMV0gKiByaHNbMV1bMV0gKyBsaHNbM11bMl0gKiByaHNbMl1bMV0gKyBsaHNbM11bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzNdWzJdID0gbGhzWzNdWzBdICogcmhzWzBdWzJdICsgbGhzWzNdWzFdICogcmhzWzFdWzJdICsgbGhzWzNdWzJdICogcmhzWzJdWzJdICsgbGhzWzNdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFszXVszXSA9IGxoc1szXVswXSAqIHJoc1swXVszXSArIGxoc1szXVsxXSAqIHJoc1sxXVszXSArIGxoc1szXVsyXSAqIHJoc1syXVszXSArIGxoc1szXVszXSAqIHJoc1szXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yMyh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnkgPSBtWzFdWzBdICogdi54ICsgbVsxXVsxXSAqIHYueSArIG1bMV1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2Lno7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yNCh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2LnogKyBtWzBdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56ICsgbVsxXVszXSAqIHYudztcclxuICAgICAgICByZXMueiA9IG1bMl1bMF0gKiB2LnggKyBtWzJdWzFdICogdi55ICsgbVsyXVsyXSAqIHYueiArIG1bMl1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLncgPSBtWzNdWzBdICogdi54ICsgbVszXVsxXSAqIHYueSArIG1bM11bMl0gKiB2LnogKyBtWzNdWzNdICogdi53O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUcmFuc2xhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMobVswXVszXSwgbVsxXVszXSwgbVsyXVszXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFJvdGF0ZSgpOiBWZWN0b3IzIHtcclxuICAgIC8vICAgICBsZXQgbWF0ID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgLy8gICAgIGxldCB4ID0gTWF0aC5hdGFuMihtYXRbMV1bMl0sIG1hdFsyXVsyXSk7XHJcbiAgICAvLyAgICAgbGV0IHkgPSBNYXRoLmF0YW4yKC1tYXRbMF1bMl0sIE1hdGguc3FydChtYXRbMV1bMl0gKiBtYXRbMV1bMl0gKyBtYXRbMl1bMl0gKiBtYXRbMl1bMl0pKTtcclxuICAgIC8vICAgICBsZXQgeiA9IE1hdGguYXRhbjIobWF0WzBdWzFdLCBtYXRbMF1bMF0pO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gbmV3IFZlY3RvcjMoeCAvIE1hdGguUEkgKiAxODAsIHkgLyBNYXRoLlBJICogMTgwLCB6IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvL+S4gOWumuimgeiOt+WPlue6r+WHgOeahOaXi+i9rOefqemYte+8jOWNs+WOu+mZpOe8qeaUvuWAjeeOh1xyXG4gICAgICAgIGxldCBtYXQgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICBsZXQgcSA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIHZhciB0cmFjZSA9IG1hdFswXVswXSArIG1hdFsxXVsxXSArIG1hdFsyXVsyXTsgLy8gSSByZW1vdmVkICsgMS4wZjsgc2VlIGRpc2N1c3Npb24gd2l0aCBFdGhhblxyXG4gICAgICAgIHZhciBzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRyYWNlID4gMCkgey8vIEkgY2hhbmdlZCBNX0VQU0lMT04gdG8gMFxyXG4gICAgICAgICAgICBzID0gMC41IC8gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKTtcclxuICAgICAgICAgICAgcS53ID0gMC4yNSAvIHM7XHJcbiAgICAgICAgICAgIHEueCA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pICogcztcclxuICAgICAgICAgICAgcS55ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgKiBzO1xyXG4gICAgICAgICAgICBxLnogPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAqIHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hdFswXVswXSA+IG1hdFsxXVsxXSAmJiBtYXRbMF1bMF0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzBdWzBdIC0gbWF0WzFdWzFdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdFsxXVsxXSA+IG1hdFsyXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMV1bMV0gLSBtYXRbMF1bMF0gLSBtYXRbMl1bMl0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFsyXVsyXSAtIG1hdFswXVswXSAtIG1hdFsxXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAobWF0WzBdWzJdICsgbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAwLjI1ICogcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZU1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/lm6DkuLrml4vovaznn6npmLXmr5TovoPnibnmrorvvIzmnInml7blgJnopoHljZXni6zlpITnkIbvvIzmiYDmnInmi6XmnInkuIDkuKrmj5Dlj5bmlrnms5VcclxuICAgICAgICAvL+aPkOWPluaWueW8j+W+iOeugOWNle+8jOWFiOiOt+WPlue8qeaUvuWAvO+8jOeEtuWQjuWIqeeUqOiOt+WPlue8qeaUvuWAvOeahOWOn+eQhu+8jOmAhuWQkemZpOWOu+e8qeaUvuWAvO+8jOWwseW+l+WIsOe6r+WHgOeahOaXi+i9rOefqemYtVxyXG4gICAgICAgIC8v5q2k5pa55rOV5LiN5pSv5oyB5Y+N5bCE55+p6Zi1XHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIHRlID0gbWF0Lm1hdHJpeDtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5nZXRTY2FsZSgpO1xyXG4gICAgICAgIHZhciBzY2FsZVggPSAxIC8gc2NhbGUueDtcclxuICAgICAgICB2YXIgc2NhbGVZID0gMSAvIHNjYWxlLnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWiA9IDEgLyBzY2FsZS56O1xyXG5cclxuICAgICAgICB0ZVswXVswXSA9IG1lWzBdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzFdWzBdID0gbWVbMV1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbMl1bMF0gPSBtZVsyXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVszXVswXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzFdID0gbWVbMF1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMV1bMV0gPSBtZVsxXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVsyXVsxXSA9IG1lWzJdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzNdWzFdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bMl0gPSBtZVswXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsxXVsyXSA9IG1lWzFdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzJdWzJdID0gbWVbMl1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbM11bMl0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVszXSA9IDA7XHJcbiAgICAgICAgdGVbMV1bM10gPSAwO1xyXG4gICAgICAgIHRlWzJdWzNdID0gMDtcclxuICAgICAgICB0ZVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/ku47ml4vovaznn6npmLXph4zojrflj5bmrKfmi4nop5JcclxuICAgICAgICAvL+W/hemhu+aYr+e6r+WHgOeahOaXi+i9rOefqemYtVxyXG5cclxuICAgICAgICB2YXIgYW5nbGUgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2YXIgdGUgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICB2YXIgbTExID0gdGVbMF1bMF0sIG0xMiA9IHRlWzBdWzFdLCBtMTMgPSB0ZVswXVsyXTtcclxuICAgICAgICB2YXIgbTIxID0gdGVbMV1bMF0sIG0yMiA9IHRlWzFdWzFdLCBtMjMgPSB0ZVsxXVsyXTtcclxuICAgICAgICB2YXIgbTMxID0gdGVbMl1bMF0sIG0zMiA9IHRlWzJdWzFdLCBtMzMgPSB0ZVsyXVsyXTtcclxuXHJcbiAgICAgICAgbTEzID0gbTEzID4gMSA/IDEgOiBtMTM7XHJcbiAgICAgICAgbTEzID0gbTEzIDwgLTEgPyAtMSA6IG0xMztcclxuICAgICAgICBhbmdsZS55ID0gTWF0aC5hc2luKG0xMyk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyhtMTMpIDwgMC45OTk5OTk5KSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKC1tMjMsIG0zMyk7XHJcbiAgICAgICAgICAgIGFuZ2xlLnogPSBNYXRoLmF0YW4yKC1tMTIsIG0xMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5nbGUueCA9IE1hdGguYXRhbjIobTMyLCBtMjIpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhhbmdsZS54IC8gTWF0aC5QSSAqIDE4MCwgYW5nbGUueSAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnogLyBNYXRoLlBJICogMTgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgdiA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHYueCA9IE1hdGguc3FydChtWzBdWzBdICogbVswXVswXSArIG1bMV1bMF0gKiBtWzFdWzBdICsgbVsyXVswXSAqIG1bMl1bMF0pO1xyXG4gICAgICAgIHYueSA9IE1hdGguc3FydChtWzBdWzFdICogbVswXVsxXSArIG1bMV1bMV0gKiBtWzFdWzFdICsgbVsyXVsxXSAqIG1bMl1bMV0pO1xyXG4gICAgICAgIHYueiA9IE1hdGguc3FydChtWzBdWzJdICogbVswXVsyXSArIG1bMV1bMl0gKiBtWzFdWzJdICsgbVsyXVsyXSAqIG1bMl1bMl0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNwb3NlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0xID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0yID0gbmV3IE1hdHJpeDR4NCgpLm1hdHJpeDtcclxuXHJcbiAgICAgICAgbTJbMF1bMF0gPSBtMVswXVswXTsgbTJbMF1bMV0gPSBtMVsxXVswXTsgbTJbMF1bMl0gPSBtMVsyXVswXTsgbTJbMF1bM10gPSBtMVszXVswXTtcclxuICAgICAgICBtMlsxXVswXSA9IG0xWzBdWzFdOyBtMlsxXVsxXSA9IG0xWzFdWzFdOyBtMlsxXVsyXSA9IG0xWzJdWzFdOyBtMlsxXVszXSA9IG0xWzNdWzFdO1xyXG4gICAgICAgIG0yWzJdWzBdID0gbTFbMF1bMl07IG0yWzJdWzFdID0gbTFbMV1bMl07IG0yWzJdWzJdID0gbTFbMl1bMl07IG0yWzJdWzNdID0gbTFbM11bMl07XHJcbiAgICAgICAgbTJbM11bMF0gPSBtMVswXVszXTsgbTJbM11bMV0gPSBtMVsxXVszXTsgbTJbM11bMl0gPSBtMVsyXVszXTsgbTJbM11bM10gPSBtMVszXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtMjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlKHBvczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlKHE6IFF1YXRlcm5pb24pOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKGV1bGVyQW5nbGVzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyByb3RhdGUoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyByb3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IG0gPSBuZXcgTWF0cml4NHg0KCk7XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBRdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZShzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzKTtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb29rQXQodGFyZ2V0OiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvLyB0b2RvXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy/ovazmjaLliLDmkYTlvbHmnLrnnIvlkJHnmoTnn6npmLXph4xcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1Ub0xvb2tBdFNwYWNlKGV5ZTogVmVjdG9yMywgdGFyZ2V0UG9pbnQ6IFZlY3RvcjMsIHVwOiBWZWN0b3IzID0gVmVjdG9yMy5VUCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/ku47lk6rph4znnIvlkJHlk6rph4zvvIzkuZ/lj6/ku6XnkIbop6PkuLrmkYTlvbHmnLrop4bop5LvvIzljbPop4Llr5/nqbrpl7RcclxuICAgICAgICAvL+iLpeimgeWPmOaNouWIsOaRhOW9seacuuepuumXtO+8jOWPr+S7peWBh+iuvuaVtOS4quinguWvn+epuumXtOS7peaRhOW9seacuuS9jeS6juS4lueVjOWdkOagh+WOn+eCue+8jOeEtuWQjuWwhuaJgOacieeJqeS9k+acneaRhOW9seacuuWOn+WFiOWcqOS4lueVjOepuumXtOS4reeahOS9jee9ruWPjeWQkeenu+WKqOWNs+WPr1xyXG4gICAgICAgIC8v5Zyo57q45LiK55S75LiL5Zu+5bCx5riF5pmw5LqGXHJcblxyXG4gICAgICAgIC8v55Sx5LqO6buY6K6k55+p6Zi15pivU1JU6aG65bqP57uE5oiQ55qE5Y+Y5o2i56m66Ze077yM6KaB6YCG5ZCR77yM5YiZ5pivVFJT55qE6aG65bqP77yM5Y2z5YWI56e75Yqo5ZCO5peL6L2sXHJcbiAgICAgICAgLy8xLuWQkeWPjeaWueWQkeW5s+enu1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IzKC1leWUueCwgLWV5ZS55LCAtZXllLnopKTtcclxuXHJcbiAgICAgICAgLy8yLuWQkeWPjeaWueWQkeaXi+i9rFxyXG4gICAgICAgIC8v5YWI6I635Y+W5pGE5b2x5LiW55WM6YOo5Z2Q5qCH6L20XHJcbiAgICAgICAgdmFyIHpBeGlzID0gVmVjdG9yMy5kaWZmZXJlbmNlKGV5ZSwgdGFyZ2V0UG9pbnQpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8v5Zug5Li65oiR5Lus5piv5Y+z5omL57O757uf77yM6KaB5rGCWO+8jOWImeW/hemhu3rkuZh5XHJcbiAgICAgICAgdmFyIHhBeGlzID0gVmVjdG9yMy5jcm9zcyh1cCwgekF4aXMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHZhciB5QXhpcyA9IFZlY3RvcjMuY3Jvc3MoekF4aXMsIHhBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+aehOW7uuaRhOW9seacuuWPjeaWueWQkeaXi+i9rOefqemYtVxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh4QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHlBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoekF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJ1c3R1bShsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgcmwgPSAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGNvbnN0IHRiID0gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBjb25zdCBmbiA9IChmYXIgLSBuZWFyKVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoKG5lYXIgKiAyKSAvIHJsLCAwLCAocmlnaHQgKyBsZWZ0KSAvIHJsLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgKG5lYXIgKiAyKSAvIHRiLCAodG9wICsgYm90dG9tKSAvIHRiLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLShmYXIgKyBuZWFyKSAvIGZuLCAtKGZhciAqIG5lYXIgKiAyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcnRob2dyYXBoaWMobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDIgLyBybCwgMCwgMCwgLShsZWZ0ICsgcmlnaHQpIC8gcmwpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAyIC8gdGIsIDAsIC0odG9wICsgYm90dG9tKSAvIHRiKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTIgLyBmbiwgLShmYXIgKyBuZWFyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcnNwZWN0aXZlKGZvdjogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgaGZvdiA9IGZvdiAvIDE4MCAqIE1hdGguUEkgLyAyO1xyXG4gICAgICAgIGNvbnN0IHRhbiA9IE1hdGgudGFuKGhmb3YpO1xyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMSAvIChhc3BlY3QgKiB0YW4pLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMSAvIHRhbiwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyAoZmFyIC0gbmVhciksIC0oMiAqIGZhciAqIG5lYXIpIC8gKGZhciAtIG5lYXIpKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnZlcnNlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICBjb25zdCBhMDAgPSBtYXRbMF1bMF07XHJcbiAgICAgICAgY29uc3QgYTAxID0gbWF0WzBdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEwMiA9IG1hdFswXVsyXTtcclxuICAgICAgICBjb25zdCBhMDMgPSBtYXRbMF1bM107XHJcbiAgICAgICAgY29uc3QgYTEwID0gbWF0WzFdWzBdO1xyXG4gICAgICAgIGNvbnN0IGExMSA9IG1hdFsxXVsxXTtcclxuICAgICAgICBjb25zdCBhMTIgPSBtYXRbMV1bMl07XHJcbiAgICAgICAgY29uc3QgYTEzID0gbWF0WzFdWzNdO1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IG1hdFsyXVswXTtcclxuICAgICAgICBjb25zdCBhMjEgPSBtYXRbMl1bMV07XHJcbiAgICAgICAgY29uc3QgYTIyID0gbWF0WzJdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEyMyA9IG1hdFsyXVszXTtcclxuICAgICAgICBjb25zdCBhMzAgPSBtYXRbM11bMF07XHJcbiAgICAgICAgY29uc3QgYTMxID0gbWF0WzNdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEzMiA9IG1hdFszXVsyXTtcclxuICAgICAgICBjb25zdCBhMzMgPSBtYXRbM11bM107XHJcblxyXG4gICAgICAgIGNvbnN0IGRldDAwID0gYTAwICogYTExIC0gYTAxICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAzID0gYTAxICogYTEyIC0gYTAyICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTFcclxuICAgICAgICBjb25zdCBkZXQwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMlxyXG4gICAgICAgIGNvbnN0IGRldDA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzFcclxuICAgICAgICBjb25zdCBkZXQxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMlxyXG5cclxuICAgICAgICBsZXQgZGV0ID0gKGRldDAwICogZGV0MTEgLSBkZXQwMSAqIGRldDEwICsgZGV0MDIgKiBkZXQwOSArIGRldDAzICogZGV0MDggLSBkZXQwNCAqIGRldDA3ICsgZGV0MDUgKiBkZXQwNik7XHJcblxyXG4gICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNYXRyaXg0eDQgaW52ZXJzZSBmYWlsZWQsIGRldGVybWluYW50IGlzIDBcIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG5cclxuICAgICAgICBtYXRbMF1bMF0gPSAoYTExICogZGV0MTEgLSBhMTIgKiBkZXQxMCArIGExMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsxXSA9ICgtYTAxICogZGV0MTEgKyBhMDIgKiBkZXQxMCAtIGEwMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsyXSA9IChhMzEgKiBkZXQwNSAtIGEzMiAqIGRldDA0ICsgYTMzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzNdID0gKC1hMjEgKiBkZXQwNSArIGEyMiAqIGRldDA0IC0gYTIzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzBdID0gKC1hMTAgKiBkZXQxMSArIGExMiAqIGRldDA4IC0gYTEzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzFdID0gKGEwMCAqIGRldDExIC0gYTAyICogZGV0MDggKyBhMDMgKiBkZXQwNykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMl0gPSAoLWEzMCAqIGRldDA1ICsgYTMyICogZGV0MDIgLSBhMzMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMV1bM10gPSAoYTIwICogZGV0MDUgLSBhMjIgKiBkZXQwMiArIGEyMyAqIGRldDAxKSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVswXSA9IChhMTAgKiBkZXQxMCAtIGExMSAqIGRldDA4ICsgYTEzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzFdID0gKC1hMDAgKiBkZXQxMCArIGEwMSAqIGRldDA4IC0gYTAzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzJdID0gKGEzMCAqIGRldDA0IC0gYTMxICogZGV0MDIgKyBhMzMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bM10gPSAoLWEyMCAqIGRldDA0ICsgYTIxICogZGV0MDIgLSBhMjMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bMF0gPSAoLWExMCAqIGRldDA5ICsgYTExICogZGV0MDcgLSBhMTIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMV0gPSAoYTAwICogZGV0MDkgLSBhMDEgKiBkZXQwNyArIGEwMiAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFszXVsyXSA9ICgtYTMwICogZGV0MDMgKyBhMzEgKiBkZXQwMSAtIGEzMiAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFszXVszXSA9IChhMjAgKiBkZXQwMyAtIGEyMSAqIGRldDAxICsgYTIyICogZGV0MDApICogZGV0XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0Zsb2F0MzJMaXN0KCk6IEZsb2F0MzJMaXN0IHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIC8v55Sx5LqOT3BlbkdM5piv5YiX5bqP5a2Y5YKo77yM5omA5Lul6ZyA6KaB6L2s572u5LiA5LiL55+p6Zi1XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICBtWzBdWzBdLCBtWzFdWzBdLCBtWzJdWzBdLCBtWzNdWzBdLFxyXG4gICAgICAgICAgICBtWzBdWzFdLCBtWzFdWzFdLCBtWzJdWzFdLCBtWzNdWzFdLFxyXG4gICAgICAgICAgICBtWzBdWzJdLCBtWzFdWzJdLCBtWzJdWzJdLCBtWzNdWzJdLFxyXG4gICAgICAgICAgICBtWzBdWzNdLCBtWzFdWzNdLCBtWzJdWzNdLCBtWzNdWzNdXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDApLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygxKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMiksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDMpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRSU01hdHJpeChwb3M6IFZlY3RvcjMsIHF1YXQ6IFF1YXRlcm5pb24sIHNjYWxlOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgdG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgbGV0IHJtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxdWF0KTtcclxuICAgICAgICBsZXQgc20gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgoc2NhbGUpO1xyXG5cclxuICAgICAgICAvL+W/hemhu+S4peagvOaMieeFp+WFiFNjYWxl77yM5YaNUm90YXRl77yM5YaNVHJhbnNsYXRl55qE6aG65bqP77yM5ZCm5YiZ5b6X5Yiw55qE57uT5p6c6IKv5a6a5piv5LiN5ruh5oSP55qEXHJcbiAgICAgICAgLy/kvovlpoLmnInkuIDkuKoxWDHmraPmlrnlvaLlnKjljp/ngrnvvIzmiJHku6zmg7PopoHlvpfliLDkuIDkuKoxWDLvvIzlubbkuJTmlpzlkJE0NcKw77yM6ICM5LiU56a75Z2Q5qCH5Y6f54K5MeS4quWNleS9jeWkhFxyXG4gICAgICAgIC8v5aaC5p6c5YWI5peL6L2s77yM5YaN57yp5pS+55qE6K+d77yM5peL6L2s5pa55ZCR5piv5a+55LqG77yM5L2G5piv5oiR5Lus5piv5bCG5peL6L2s5ZCONDXCsOeahOato+aWueW9oueahFnovbTmi4nkvLgy5YCN77yM5b6X5Yiw55qE5piv5LiA5Liq6KKr5ouJ6ZW/55qE6I+x5b2iXHJcbiAgICAgICAgLy/lpoLmnpzlhYjlubPnp7vvvIzlho3ml4vovaznmoTor53vvIzlm6DkuLrmiJHku6zml4vovazpg73mmK/nu5XnnYDlnZDmoIfljp/ngrnnmoTvvIznu5Pmnpzoh6rnhLbmmK/mraPmlrnlvaLkuI3mmK/oh6rouqvml4vovaw0NcKw77yM6ICM5piv57uV552A5Y6f54K55peL6L2sXHJcbiAgICAgICAgcmV0dXJuIHRtLm11bHRpcGx5KHJtLm11bHRpcGx5KHNtKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUcmFuc2xhdGVNYXRyaXgocG9zOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IDE7IG1bMF1bMV0gPSAwOyBtWzBdWzJdID0gMDsgbVswXVszXSA9IHBvcy54O1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gMTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSBwb3MueTtcclxuICAgICAgICBtWzJdWzBdID0gMDsgbVsyXVsxXSA9IDA7IG1bMl1bMl0gPSAxOyBtWzJdWzNdID0gcG9zLno7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24ocTogUXVhdGVybmlvbik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIGxldCBudW0gPSBxLnggKiAyO1xyXG4gICAgICAgIGxldCBudW0yID0gcS55ICogMjtcclxuICAgICAgICBsZXQgbnVtMyA9IHEueiAqIDI7XHJcbiAgICAgICAgbGV0IG51bTQgPSBxLnggKiBudW07XHJcbiAgICAgICAgbGV0IG51bTUgPSBxLnkgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW02ID0gcS56ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtNyA9IHEueCAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTggPSBxLnggKiBudW0zO1xyXG4gICAgICAgIGxldCBudW05ID0gcS55ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtMTAgPSBxLncgKiBudW07XHJcbiAgICAgICAgbGV0IG51bTExID0gcS53ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtMTIgPSBxLncgKiBudW0zO1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMSAtIChudW01ICsgbnVtNik7XHJcbiAgICAgICAgbVsxXVswXSA9IG51bTcgKyBudW0xMjtcclxuICAgICAgICBtWzJdWzBdID0gbnVtOCAtIG51bTExO1xyXG4gICAgICAgIG1bM11bMF0gPSAwO1xyXG4gICAgICAgIG1bMF1bMV0gPSBudW03IC0gbnVtMTI7XHJcbiAgICAgICAgbVsxXVsxXSA9IDEgLSAobnVtNCArIG51bTYpO1xyXG4gICAgICAgIG1bMl1bMV0gPSBudW05ICsgbnVtMTA7XHJcbiAgICAgICAgbVszXVsxXSA9IDA7XHJcbiAgICAgICAgbVswXVsyXSA9IG51bTggKyBudW0xMTtcclxuICAgICAgICBtWzFdWzJdID0gbnVtOSAtIG51bTEwO1xyXG4gICAgICAgIG1bMl1bMl0gPSAxIC0gKG51bTQgKyBudW01KTtcclxuICAgICAgICBtWzNdWzJdID0gMDtcclxuICAgICAgICBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZTogVmVjdG9yMywgb3JkZXI6IHN0cmluZyA9IFwiWFlaXCIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v6YCa6L+H5qyn5ouJ6KeS6I635Y+W5peL6L2s55+p6Zi1XHJcbiAgICAgICAgLy/lhYjliIbliKvojrflj5ZYWVrovbTkuIrnmoTml4vovaznn6npmLXvvIznhLblkI7lkIjlubbotbfmnaVcclxuICAgICAgICAvL+azqOaEj++8muaXi+i9rOi9tOeahOmhuuW6j+WFiOWQjuS4jeWQjO+8jOS8muWHuueOsOS4jeWQjOeahOe7k+aenO+8jOWboOatpOW/hemhu+imgeaMh+WumuaXi+i9rOmhuuW6j1xyXG4gICAgICAgIC8vaHR0cDovL3BsYW5uaW5nLmNzLnVpdWMuZWR1L25vZGUxMDIuaHRtbFxyXG4gICAgICAgIC8vaHR0cHM6Ly90aHJlZWpzLm9yZy9kb2NzLyNhcGkvZW4vbWF0aC9FdWxlci5vcmRlclxyXG4gICAgICAgIHZhciB4ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLngsIFZlY3RvcjMuUklHSFQpO1xyXG4gICAgICAgIHZhciB5ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnksIFZlY3RvcjMuVVApO1xyXG4gICAgICAgIHZhciB6ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnosIFZlY3RvcjMuRk9SV0FSRCk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAob3JkZXIpIHtcclxuICAgICAgICAgICAgY2FzZSBcIlhZWlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYWllcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHoubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVhaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh4Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIllaWFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHgubXVsdGlwbHkoei5tdWx0aXBseSh5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWFlcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHgubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWllYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh5Lm11bHRpcGx5KHopKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSb3RhdGlvbiBvcmRlciBlcnJvciwgbXVzdCBiZSBzaW1pbGFyIHRvICdYWVonXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBvdXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIG0gPSBvdXQubWF0cml4O1xyXG4gICAgICAgIHZhciB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xyXG4gICAgICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgICAgICB2YXIgcyA9IDAsIGMgPSAwLCB0ID0gMDtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcclxuICAgICAgICB4ICo9IGxlbjtcclxuICAgICAgICB5ICo9IGxlbjtcclxuICAgICAgICB6ICo9IGxlbjtcclxuICAgICAgICBzID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgdCA9IDEgLSBjO1xyXG4gICAgICAgIG1bMF1bMF0gPSB4ICogeCAqIHQgKyBjO1xyXG4gICAgICAgIG1bMV1bMF0gPSB5ICogeCAqIHQgKyB6ICogcztcclxuICAgICAgICBtWzJdWzBdID0geiAqIHggKiB0IC0geSAqIHM7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IHggKiB5ICogdCAtIHogKiBzO1xyXG4gICAgICAgIG1bMV1bMV0gPSB5ICogeSAqIHQgKyBjO1xyXG4gICAgICAgIG1bMl1bMV0gPSB6ICogeSAqIHQgKyB4ICogcztcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0geCAqIHogKiB0ICsgeSAqIHM7XHJcbiAgICAgICAgbVsxXVsyXSA9IHkgKiB6ICogdCAtIHggKiBzO1xyXG4gICAgICAgIG1bMl1bMl0gPSB6ICogeiAqIHQgKyBjO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTY2FsZU1hdHJpeChzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IHMueDsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzBdID0gMDsgbVsxXVsxXSA9IHMueTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IHMuejsgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBtLm1hdHJpeFswXVswXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMV1bMV0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzJdWzJdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRyaXg0eDRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWF0ZXJuaW9uIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihldWxlcjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUFyb3VuZChhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmV1bGVyQW5nbGVzID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcclxuICAgICAgICAgICAgdGhpcy53ID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBldWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbih0aGlzKS5nZXRFdWxlckFuZ2xlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZXVsZXJBbmdsZXMoZTogVmVjdG9yMykge1xyXG4gICAgICAgIHZhciBxID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZSkuZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVBcm91bmQoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCBxID0gUXVhdGVybmlvbi5hbmdsZUF4aXMoYW5nbGUsIGF4aXMpO1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgICAgIHRoaXMudyA9IHEudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQHpoIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxyXG4gICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1RdWF0KGE6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOiBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXRyYW5zZm9ybS1WZWMzLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICBsZXQgcSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXHJcbiAgICAgICAgY29uc3QgaXggPSBxLncgKiBhLnggKyBxLnkgKiBhLnogLSBxLnogKiBhLnk7XHJcbiAgICAgICAgY29uc3QgaXkgPSBxLncgKiBhLnkgKyBxLnogKiBhLnggLSBxLnggKiBhLno7XHJcbiAgICAgICAgY29uc3QgaXogPSBxLncgKiBhLnogKyBxLnggKiBhLnkgLSBxLnkgKiBhLng7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtcS54ICogYS54IC0gcS55ICogYS55IC0gcS56ICogYS56O1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XHJcbiAgICAgICAgb3V0LnggPSBpeCAqIHEudyArIGl3ICogLXEueCArIGl5ICogLXEueiAtIGl6ICogLXEueTtcclxuICAgICAgICBvdXQueSA9IGl5ICogcS53ICsgaXcgKiAtcS55ICsgaXogKiAtcS54IC0gaXggKiAtcS56O1xyXG4gICAgICAgIG91dC56ID0gaXogKiBxLncgKyBpdyAqIC1xLnogKyBpeCAqIC1xLnkgLSBpeSAqIC1xLng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw55CD6Z2i5o+S5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2xlcnAoYTogUXVhdGVybmlvbiwgYjogUXVhdGVybmlvbiwgdDogbnVtYmVyKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgLy8gYmVuY2htYXJrczpcclxuICAgICAgICAvLyAgICBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXNsZXJwLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlMCA9IDA7XHJcbiAgICAgICAgbGV0IHNjYWxlMSA9IDA7XHJcblxyXG4gICAgICAgIC8vIGNhbGMgY29zaW5lXHJcbiAgICAgICAgbGV0IGNvc29tID0gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgICAgIC8vIGFkanVzdCBzaWducyAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgIGlmIChjb3NvbSA8IDAuMCkge1xyXG4gICAgICAgICAgICBjb3NvbSA9IC1jb3NvbTtcclxuICAgICAgICAgICAgYi54ID0gLWIueDtcclxuICAgICAgICAgICAgYi55ID0gLWIueTtcclxuICAgICAgICAgICAgYi56ID0gLWIuejtcclxuICAgICAgICAgICAgYi53ID0gLWIudztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGNvZWZmaWNpZW50c1xyXG4gICAgICAgIGlmICgoMS4wIC0gY29zb20pID4gMC4wMDAwMDEpIHtcclxuICAgICAgICAgICAgLy8gc3RhbmRhcmQgY2FzZSAoc2xlcnApXHJcbiAgICAgICAgICAgIGNvbnN0IG9tZWdhID0gTWF0aC5hY29zKGNvc29tKTtcclxuICAgICAgICAgICAgY29uc3Qgc2lub20gPSBNYXRoLnNpbihvbWVnYSk7XHJcbiAgICAgICAgICAgIHNjYWxlMCA9IE1hdGguc2luKCgxLjAgLSB0KSAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2lub207XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBxdWF0ZXJuaW9ucyBhcmUgdmVyeSBjbG9zZVxyXG4gICAgICAgICAgICAvLyAgLi4uIHNvIHdlIGNhbiBkbyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgICAgIHNjYWxlMCA9IDEuMCAtIHQ7XHJcbiAgICAgICAgICAgIHNjYWxlMSA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBmaW5hbCB2YWx1ZXNcclxuICAgICAgICBvdXQueCA9IHNjYWxlMCAqIGEueCArIHNjYWxlMSAqIGIueDtcclxuICAgICAgICBvdXQueSA9IHNjYWxlMCAqIGEueSArIHNjYWxlMSAqIGIueTtcclxuICAgICAgICBvdXQueiA9IHNjYWxlMCAqIGEueiArIHNjYWxlMSAqIGIuejtcclxuICAgICAgICBvdXQudyA9IHNjYWxlMCAqIGEudyArIHNjYWxlMSAqIGIudztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdChhOiBRdWF0ZXJuaW9uLCBiOiBRdWF0ZXJuaW9uKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGVBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgYW5nbGUgKj0gMC41O1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmVzLnggPSBheGlzLnggKiBzaW47XHJcbiAgICAgICAgcmVzLnkgPSBheGlzLnkgKiBzaW47XHJcbiAgICAgICAgcmVzLnogPSBheGlzLnogKiBzaW47XHJcbiAgICAgICAgcmVzLncgPSBNYXRoLmNvcyhhbmdsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdpZHRoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yNClcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjIpOiBWZWN0b3IyO1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjI7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjIpOiBWZWN0b3IyO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMjtcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3IyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjIuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IyLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMiwgdDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLngpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhWZWN0b3IyLmRvdCh2MSwgdjIpIC8gKHYxLm1hZ25pdHVkZSAqIHYyLm1hZ25pdHVkZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBSSUdIVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgTEVGVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFVQKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBET1dOKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMyk6IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgdGhpcy56ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICB0aGlzLnogLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICB0aGlzLnogKj0gdi56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IzLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnkgJiYgdi56ID09IHRoaXMuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMsIHQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSArIHYxLnogKiB2Mi56KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB4ID0gdjEueSAqIHYyLnogLSB2MS56ICogdjIueTtcclxuICAgICAgICB2YXIgeSA9IHYxLnogKiB2Mi54IC0gdjEueCAqIHYyLno7XHJcbiAgICAgICAgdmFyIHogPSB2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHggPSB2Mi54IC0gdjEueDtcclxuICAgICAgICB2YXIgeSA9IHYyLnkgLSB2MS55O1xyXG4gICAgICAgIHZhciB6ID0gdjIueiAtIHYxLno7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlmZmVyZW5jZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgZGVzdCA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIGRlc3QueCA9IHYxLnggLSB2Mi54XHJcbiAgICAgICAgZGVzdC55ID0gdjEueSAtIHYyLnlcclxuICAgICAgICBkZXN0LnogPSB2MS56IC0gdjIuelxyXG5cclxuICAgICAgICByZXR1cm4gZGVzdFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGUodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlY3RvcjMuZG90KHYxLCB2MikgLyAodjEubWFnbml0dWRlICogdjIubWFnbml0dWRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFJJR0hUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBMRUZUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygtMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgVVAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERPV04oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBGT1JXQVJEKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBCQUNLKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjQge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGdldCByKCk6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXQgZygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuejsgfVxyXG4gICAgcHVibGljIGdldCBhKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnc7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZlY3RvcjMoKTogVmVjdG9yMyB7IHJldHVybiBuZXcgVmVjdG9yMyh0aGlzKTsgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMywgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHRoaXMudyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzLmxlbmd0aCA9PSAyID8gYXJndW1lbnRzWzFdIDogMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yNCk6IFZlY3RvcjQ7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1swXS53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyArPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiBWZWN0b3I0O1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1swXS53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyAtPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICB0aGlzLnogKj0gZDtcclxuICAgICAgICB0aGlzLncgKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHRoaXMueiAvPSBkO1xyXG4gICAgICAgIHRoaXMudyAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHRoaXMueiAqPSB2Lno7XHJcbiAgICAgICAgdGhpcy53ICo9IHYudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yNC5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCh0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yNCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnkgJiYgdi56ID09IHRoaXMueiAmJiB2LncgPT0gdGhpcy53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiLCBcIiArIHRoaXMudyArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCwgdDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yNCgpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgdi56ID0gdjEueiArIHQgKiAodjIueiAtIHYxLnopO1xyXG4gICAgICAgIHYudyA9IHYxLncgKyB0ICogKHYyLncgLSB2MS53KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSArIHYxLnogKiB2Mi56ICsgdjEudyAqIHYyLncpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjQuZG90KHYxLCB2MikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgxLCAxLCAxLCAxKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1hdHJpeDR4NCB9IGZyb20gXCIuL01hdGgvTWF0cml4NHg0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IE9CSk1vZGVsIH0gZnJvbSBcIi4vVXRpbHMvT2JqUGFyc2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdGFuY2Uge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBtb2RlbDogT0JKTW9kZWw7XHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtOiBUcmFuc2Zvcm07XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0obmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHRhZzogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNoaWxkcmVuOiBBcnJheTxUcmFuc2Zvcm0+O1xyXG5cclxuICAgIHByaXZhdGUgX3BhcmVudDogVHJhbnNmb3JtIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90ZW1wUG9zOiBWZWN0b3IzO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFJvdDogUXVhdGVybmlvbjtcclxuICAgIHByaXZhdGUgX3RlbXBTY2FsZTogVmVjdG9yMztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWc6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudGFnID0gdGFnO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgQXJyYXk8VHJhbnNmb3JtPigpO1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdGVtcFBvcyA9IFZlY3RvcjMuWkVSTztcclxuICAgICAgICB0aGlzLl90ZW1wUm90ID0gUXVhdGVybmlvbi5pZGVudGl0eTtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBWZWN0b3IzLk9ORTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGZNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFRSU01hdHJpeCh0aGlzLl90ZW1wUG9zLCB0aGlzLl90ZW1wUm90LCB0aGlzLl90ZW1wU2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbG9jYWxUb1dvcmxkTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubG9jYWxUb1dvcmxkTWF0cml4IDogTWF0cml4NHg0LmlkZW50aXR5O1xyXG4gICAgICAgIHJldHVybiBwLm11bHRpcGx5KHRoaXMuc2VsZk1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFRvTG9jYWxNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC53b3JsZFRvTG9jYWxNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZk1hdHJpeC5pbnZlcnNlKCkubXVsdGlwbHkocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB4KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHgoeDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB5KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHkoeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB6KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHooejogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnogPSB6O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmb3J3YXJkKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8v5oiR5Lus6KaB5b6X5Yiw55qE5piv5LiA5Liq5pa55ZCR77yM5Zug5q2k5LiN6ZyA6KaB5L2N572u5L+h5oGv77yM5bCG6b2Q5qyh5Z2Q5qCH55qEd+iuvue9ruS4ujDvvIzmipvlvIPmjonlnZDmoIfkv6Hmga9cclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuRk9SV0FSRCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1cCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuVVAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmlnaHQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLlJJR0hULCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUG9zLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwb3NpdGlvbihwb3M6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRQb3NpdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdGlvbigpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFJvdC5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24ocTogUXVhdGVybmlvbikge1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wU2NhbGUuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNjYWxlKHM6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBUcmFuc2Zvcm0gfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQocGFyZW50OiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAocGFyZW50ICE9IG51bGwgJiYgcGFyZW50ICE9IHRoaXMgJiYgcGFyZW50ICE9IHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77ya54i26IqC54K55piv5b2T5YmN6IqC54K555qE5a2Q6IqC54K577yM5bCG5a2Q6IqC55qE6K6+572u5Li66Ieq5bex55qE54i26IqC54K577yM5Lya5q275b6q546vXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzUGFyZW50KHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNldCBwYXJlbnQsIHRoaXMgbm9kZSBpcyB0aGUgcGFyZW50IG5vZGUncyBwYXJlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOW9k+WJjeiKgueCueacieeItuiKgueCue+8jOimgeWFiOenu+mZpOaXp+eahFxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBhcmVudCA9PSBudWxsICYmIHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/oioLngrlw5piv5ZCm5piv5b2T5YmN6IqC54K555qE5LiK57qnXHJcbiAgICBwdWJsaWMgaGFzUGFyZW50KHA6IFRyYW5zZm9ybSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgPT0gcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGFzUGFyZW50KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9IHRoaXMgJiYgIXRoaXMuY2hpbGRyZW4uaW5jbHVkZXMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77yaY2hpbGToioLngrnmmK/lvZPliY3oioLngrnnmoTniLboioLngrnvvIzlsIbniLboioLnmoTorr7nva7kuLroh6rlt7HnmoTlrZDoioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGFyZW50KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2hpbGQsIHRoaXMgbm9kZSBpcyB0aGUgY2hpbGQgbm9kZSdzIGNoaWxkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzlrZDoioLngrnmnInml6fnmoTniLboioLngrnvvIzopoHlhYjnp7vpmaRcclxuICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnljp/kuJbnlYzlnZDmoIfkvY3nva7vvIzlhYjmnJ3niLboioLngrnnmoTlj5jmjaLnmoTlj43mlrnlkJHnp7vliqjvvIznhLblkI7lho3mt7vliqDov5vljrvvvIzlsLHog73kv53mjIHkuJbnlYzlnZDmoIfkuI3lj5hcclxuICAgICAgICAgICAgICAgIC8v5Y2z5Y+Y5o2i5Yiw54i26IqC54K555qE6YCG55+p6Zi16YeMXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5KGNoaWxkLnNlbGZNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBQb3MgPSBtLmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBSb3QgPSBtLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBTY2FsZSA9IG0uZ2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUNoaWxkKGNoaWxkOiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQsIDApO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnkuJbnlYzlnZDmoIfvvIznm7TmjqXlsIbmnKzlnLDlnZDmoIfnrYnlkIzkuo7lvZPliY3kuJbnlYzlnZDmoIfljbPlj69cclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZEJ5VGFnKHRhZzogc3RyaW5nKTogVHJhbnNmb3JtIHwgbnVsbCB7XHJcblxyXG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGVzW2ldLnRhZyA9PSB0YWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2Rlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbnZlcnRUb05vZGVTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKuWwhuafkOS4quWdkOagh+i9rOWIsOiHquW3seeahOWxgOmDqOepuumXtO+8jOS+i+WmguW9k+WJjeeahOWxgOmDqOWdkOagh+WOn+eCueWcqOS4lueVjOWdkOagh+eahO+8iDHvvIwx77yJ5aSEXHJcbiAgICAgICAgICrngrlw5Zyo5LiW55WM5Z2Q5qCH77yIMu+8jDHvvInlpITvvIzpgqPkuYjlsIbngrlw55u45a+55LqO5b2T5YmN5bGA6YOo5Z2Q5qCH57O755qE5L2N572u5bCx5piv77yIMu+8jDHvvIkt77yIMe+8jDHvvIk9IO+8iDHvvIwgMO+8iVxyXG4gICAgICAgICAq5Y2z5bCG54K5cOWPjeWQkeWPmOaNouW9k+WJjeeahOefqemYtSBcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Xb3JsZFNwYWNlKHY6IFZlY3RvcjMsIHc6IG51bWJlciA9IDEpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95KGRlc3Ryb3lDaGlsZHJlbjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoZGVzdHJveUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KGRlc3Ryb3lDaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL0NvbG9yXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlLCBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9Nb2RlbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ2FtZXJhXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3I0XCI7XHJcblxyXG5lbnVtIERyYXdNb2RlIHtcclxuICAgIFdpcmVmcmFtZSxcclxuICAgIFBvaW50LFxyXG4gICAgU2hhZGVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XHJcbiAgICBwdWJsaWMgZHJhd01vZGU6IERyYXdNb2RlID0gRHJhd01vZGUuV2lyZWZyYW1lO1xyXG4gICAgcHJpdmF0ZSB1aW50MzJWaWV3OiBVaW50MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aW50MzJWaWV3OiBVaW50MzJBcnJheSkge1xyXG4gICAgICAgIHRoaXMudWludDMyVmlldyA9IHVpbnQzMlZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIOWfuuehgOe7mOWItuaOpeWPo1xyXG5cclxuICAgIHB1YmxpYyBDbGVhcihjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5L2/55SoIGZpbGwg5pa55rOV5pu/5Luj5b6q546v77yM5oCn6IO95pu05aW9XHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3LmZpbGwoY29sb3IpO1xyXG4gICAgICAgIC8vIOaIluiAheS9v+eUqOW+queOr++8jOS9huaAp+iDvei+g+W3rlxyXG4gICAgICAgIC8vIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jYW52YXNXaWR0aDsgeCsrKSB7XHJcbiAgICAgICAgLy8gICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5jYW52YXNIZWlnaHQ7IHkrKykge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5TZXRQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdQaXhlbCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOe7mOWItuWIsOWxj+W5leS4iueahOWDj+e0oOW6lOivpeaYr+aVtOaVsOeahFxyXG4gICAgICAgIC8vIOS8mOWMljog5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHggPSAoeCB8IDApO1xyXG4gICAgICAgIHkgPSAoeSB8IDApO1xyXG4gICAgICAgIC8vIHggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIC8vIHkgPSBNYXRoLmZsb29yKHkpO1xyXG5cclxuICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBDb25maWcuY2FudmFzV2lkdGggfHwgeSA8IDAgfHwgeSA+PSBDb25maWcuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWludDMyVmlld1t5ICogQ29uZmlnLmNhbnZhc1dpZHRoICsgeF0gPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd0xpbmUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOWPluaVtFxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG5cclxuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XHJcbiAgICAgICAgY29uc3QgZHkgPSB5MiAtIHkxO1xyXG5cclxuICAgICAgICAvLyDkuLrkvZXopoHljLrliIbmlpznjofmmK/lkKblgY/msLTlubPov5jmmK/lnoLnm7TlkaLvvJ/lm6DkuLrlpoLmnpzkuI3ljLrliIbvvIzkvovlpoLlvZPmlpznjoflpKfkuo4x5pe277yM5Lya5a+86Ie055u057q/57uY5Yi25LiN6L+e57ut77yM5Zug5Li6eeS8mui3s+WPmO+8jOiAjOS4jeaYr+i/nue7reeahOWinuWKoOOAglxyXG4gICAgICAgIC8vIOWPquacieaWnOeOh+WImuWlveS4ujHml7bvvIx46LefeeaJjeaYr+i/nue7reWQjOatpeiHquWinueahO+8jHgrMe+8jOWImXnkuZ8rMVxyXG4gICAgICAgIC8vIOaJgOS7pe+8jOW9k+aWnOeOh+Wkp+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh55L2c5Li65b6q546v5Y+Y6YeP77yM6ICM5b2T5pac546H5bCP5LqOMeaXtu+8jOaIkeS7rOmcgOimgeS9v+eUqHjkvZzkuLrlvqrnjq/lj5jph4/jgIJcclxuICAgICAgICAvLyDkuL7kuKrmnoHnq6/kvovlrZDvvIzlvZPmlpznjofkuLow5pe277yM55u057q/5bCx5piv5LiA5p2h5Z6C55u055u057q/77yM5aaC5p6c6L+Z5pe25YCZ6L+Y55SoeOS9nOS4uuW+queOr+WPmOmHj++8jOWImeS8muWvvOiHtOi/meadoeebtOe6v+S4iuaJgOaciXnngrnpg73lr7nlupTkuIDkuKp477yM5Lmf5bCx5piv6K+06L+Z5p2h57q/5Y+Y5oiQ5LiA5Liq54K55LqG44CCXHJcblxyXG4gICAgICAgIC8vIOaWnOeOh+Wwj+S6jjHvvIznm7Tnur/lgY/msLTlubPmg4XlhrXvvIzkvb/nlKh45L2c5Li65b6q546v5Y+Y6YePXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA+IE1hdGguYWJzKGR5KSkge1xyXG4gICAgICAgICAgICAvLyDkuIvpnaLnmoTlvqrnjq/nu5jliLblh73mlbDmmK/ku47lt6blvoDlj7PnmoTvvIzov5nph4zopoHnoa7kv53nu5PmnZ/ngrnlnKjlvIDlp4vngrnnmoTlj7PovrlcclxuICAgICAgICAgICAgaWYgKHgyIDwgeDEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgLy8g5pac546HXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkeSAvIGR4O1xyXG4gICAgICAgICAgICAvLyDmiKrot53vvIh5PWF4K2LvvIxiPXktYXjvvIlcclxuICAgICAgICAgICAgLy8gY29uc3QgYiA9IHkxIC0gYSAqIHgxO1xyXG4gICAgICAgICAgICBsZXQgeSA9IHkxO1xyXG4gICAgICAgICAgICAvLyDnu5jliLbnm7Tnur9cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIC8vIOebtOe6v+WFrOW8j3k9YXgrYu+8jOi/memHjOS4jeW/heiuoeeul+i/meS4quWFrOW8j++8jOWboOS4uuW9k3jliqAx6Ieq5aKe5pe277yMeeS5n+S8muWKoGHvvIzmiYDku6Xlj6/ku6Xnm7TmjqXnlKh5K2Hku6Pmm79heCti77yM566X5piv5LiA5Liq5oCn6IO95LyY5YyW54K5XHJcbiAgICAgICAgICAgICAgICAvLyB5ID0gYSAqIHggKyBiO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiJZcclxuICAgICAgICAgICAgLy8gY29uc3QgeXMgPSB0aGlzLkludGVycG9sYXRlKHgxLCB5MSwgeDIsIHkyKTtcclxuICAgICAgICAgICAgLy8gZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuRHJhd1BpeGVsKHgsIHlzW3ggLSB4MV0sIGNvbG9yKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmlpznjoflpKfkuo4x77yM55u057q/5YGP5Z6C55u05oOF5Ya177yM5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoeTIgPCB5MSkgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhID0gZHggLyBkeTtcclxuICAgICAgICAgICAgbGV0IHggPSB4MTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHhzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4c1t5IC0geTFdLCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDIsIHkyLCB4MywgeTMsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgzLCB5MywgeDEsIHkxLCBjb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZUZpbGxlZCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5rOo77ya5Lul5LiL5o+Q5Yiw55qE6ZW/6L6577yM54m55oyHeei9tOi3qOW6puacgOmVv+eahOi+ue+8jOiAjOS4jeaYr+WunumZheS4iueahOi+uemVv1xyXG5cclxuICAgICAgICAvLyDlrp7pmYXnu5jliLbliLDlsY/luZXkuIrnmoTngrnvvIzlv4XpobvmmK/mlbTmlbDvvIzlj5bmlbTkuIDkuIvjgILkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgeDEgPSB4MSB8IDA7XHJcbiAgICAgICAgeTEgPSB5MSB8IDA7XHJcbiAgICAgICAgeDIgPSB4MiB8IDA7XHJcbiAgICAgICAgeTIgPSB5MiB8IDA7XHJcbiAgICAgICAgeDMgPSB4MyB8IDA7XHJcbiAgICAgICAgeTMgPSB5MyB8IDA7XHJcblxyXG4gICAgICAgIC8vIOWvueeCuei/m+ihjOaOkuW6j++8jOS9v+W+l3kxPD15Mjw9eTPvvIzljbPlj6/noa7lrprkuInop5LlvaLnmoTplb/ovrnkuLpMMTPvvIxMMTLlkoxMMjPliJnmmK/lj6blpJbkuKTmnaHnn63ovrlcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5M10gPSBbeDMsIHkzLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MiA+IHkzKSBbeDIsIHkyLCB4MywgeTNdID0gW3gzLCB5MywgeDIsIHkyXTtcclxuXHJcbiAgICAgICAgLy8g6I635Y+WM+adoei+ueeahOeCueWdkOagh+WQiOmbhlxyXG4gICAgICAgIGNvbnN0IHAxMiA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG5cclxuICAgICAgICAvLyDmi7zlkIjkuKTmnaHnn63ovrnkuLrkuIDmnaHplb/ovrnvvIjlhYjnp7vpmaTnrKzkuIDmnaHovrnnmoTmnIDlkI7kuIDkuKrmlbDmja7vvIzpgb/lhY3ph43lpI3vvIlcclxuICAgICAgICAvLyDnjrDlnKjlj5jmiJAy5p2h6ZW/6L6577yMTDEz5ZKMTDEyM1xyXG4gICAgICAgIHAxMi5wb3AoKTtcclxuICAgICAgICBjb25zdCBwMTIzID0gcDEyLmNvbmNhdChwMjMpO1xyXG5cclxuICAgICAgICAvLyDliKTmlq1MMTPlkoxMMTIz5ZOq5p2h6ZW/6L655piv5bem5ZOq5p2h5piv5Y+z77yM6YO95Y+W5pWw57uE5Lit6Ze055qE54K577yM5Yik5pat6LCB5bem6LCB5Y+z5Y2z5Y+v44CCXHJcbiAgICAgICAgLy8g5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIC8vIGNvbnN0IG0gPSBNYXRoLmZsb29yKHAxMjMubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgbSA9IChwMTIzLmxlbmd0aCA+PiAxKSB8IDA7XHJcbiAgICAgICAgbGV0IHBMZWZ0ID0gcDEyMztcclxuICAgICAgICBsZXQgcFJpZ2h0ID0gcDEzO1xyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIHBMZWZ0ID0gcDEzO1xyXG4gICAgICAgICAgICBwUmlnaHQgPSBwMTIzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q61XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHBMZWZ0W3kgLSB5MV07IHggPD0gcFJpZ2h0W3kgLSB5MV07IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWRXaXRoVmVydGV4Q29sb3IoXHJcbiAgICAgICAgeDE6IG51bWJlciwgeTE6IG51bWJlcixcclxuICAgICAgICB4MjogbnVtYmVyLCB5MjogbnVtYmVyLFxyXG4gICAgICAgIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsXHJcbiAgICAgICAgY29sb3IxOiBudW1iZXIsIGNvbG9yMjogbnVtYmVyLCBjb2xvcjM6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnmjIlZ5Z2Q5qCH5o6S5bqP77yM56Gu5L+deTEgPD0geTIgPD0geTNcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyLCBjb2xvcjEsIGNvbG9yMl0gPSBbeDIsIHkyLCB4MSwgeTEsIGNvbG9yMiwgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzLCBjb2xvcjEsIGNvbG9yM10gPSBbeDMsIHkzLCB4MSwgeTEsIGNvbG9yMywgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzLCBjb2xvcjIsIGNvbG9yM10gPSBbeDMsIHkzLCB4MiwgeTIsIGNvbG9yMywgY29sb3IyXTtcclxuXHJcbiAgICAgICAgLy8g5o+Q5Y+WUkdC5YiG6YePXHJcbiAgICAgICAgY29uc3QgYzEgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMSk7XHJcbiAgICAgICAgY29uc3QgYzIgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMik7XHJcbiAgICAgICAgY29uc3QgYzMgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMyk7XHJcblxyXG4gICAgICAgIC8vIOaPkuWAvOWHveaVsO+8jOminOiJsjHkuI7popzoibIy5ZyoZDEtZDLnmoTojIPlm7TlhoXlnYfljIDmj5LlgLxcclxuICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZUNvbG9yID0gKGQxOiBudW1iZXIsIHIxOiBudW1iZXIsIGcxOiBudW1iZXIsIGIxOiBudW1iZXIsIGExOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGQyOiBudW1iZXIsIHIyOiBudW1iZXIsIGcyOiBudW1iZXIsIGIyOiBudW1iZXIsIGEyOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCPXHJcbiAgICAgICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LlkoxNYXRoLmFic++8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgICAgICAvLyBjb25zdCBkeCA9IE1hdGguYWJzKE1hdGguZmxvb3IoZDIgLSBkMSkpO1xyXG4gICAgICAgICAgICBjb25zdCBkeCA9ICgoZDIgPiBkMSA/IGQyIC0gZDEgOiBkMSAtIGQyKSB8IDApO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+atpemVv1xyXG4gICAgICAgICAgICBjb25zdCBpbnZEZWx0YSA9IDEgLyAoZDIgLSBkMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gKHIyIC0gcjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gKGcyIC0gZzEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gKGIyIC0gYjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gKGEyIC0gYTEpICogaW52RGVsdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IHIxLCBnID0gZzEsIGIgPSBiMSwgYSA9IGExO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB7IHIsIGcsIGIsIGEgfTtcclxuICAgICAgICAgICAgICAgIHIgKz0gclN0ZXA7XHJcbiAgICAgICAgICAgICAgICBnICs9IGdTdGVwO1xyXG4gICAgICAgICAgICAgICAgYiArPSBiU3RlcDtcclxuICAgICAgICAgICAgICAgIGEgKz0gYVN0ZXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzkuInmnaHovrnnmoTlnZDmoIflkozpopzoibJcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMTJDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkxLCBjMS5yLCBjMS5nLCBjMS5iLCBjMS5hLCB5MiwgYzIuciwgYzIuZywgYzIuYiwgYzIuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAyM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTMsIGMzLnIsIGMzLmcsIGMzLmIsIGMzLmEpO1xyXG5cclxuICAgICAgICAvLyDlkIjlubbkuKTmnaHnn63ovrlcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuICAgICAgICBjb25zdCBwMTIzQ29sb3JzID0gcDEyQ29sb3JzLmNvbmNhdChwMjNDb2xvcnMpO1xyXG5cclxuICAgICAgICAvLyDnoa7lrprlt6blj7PovrnnlYxcclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBsZWZ0UG9pbnRzID0gcDEyMztcclxuICAgICAgICBsZXQgcmlnaHRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgbGV0IGxlZnRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIGxldCByaWdodENvbG9ycyA9IHAxM0NvbG9ycztcclxuXHJcbiAgICAgICAgaWYgKHAxM1ttXSA8IHAxMjNbbV0pIHtcclxuICAgICAgICAgICAgbGVmdFBvaW50cyA9IHAxMztcclxuICAgICAgICAgICAgcmlnaHRQb2ludHMgPSBwMTIzO1xyXG4gICAgICAgICAgICBsZWZ0Q29sb3JzID0gcDEzQ29sb3JzO1xyXG4gICAgICAgICAgICByaWdodENvbG9ycyA9IHAxMjNDb2xvcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu5jliLbmsLTlubPnur/mrrXvvIzlubbov5vooYzpopzoibLmj5LlgLxcclxuICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTM7IHkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB5IC0geTE7XHJcbiAgICAgICAgICAgIGNvbnN0IHhTdGFydCA9IGxlZnRQb2ludHNbaWR4XTtcclxuICAgICAgICAgICAgY29uc3QgeEVuZCA9IHJpZ2h0UG9pbnRzW2lkeF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0Q29sb3IgPSBsZWZ0Q29sb3JzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q29sb3IgPSByaWdodENvbG9yc1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgLy8g6aKE6K6h566X6aKc6Imy5beu5YC8XHJcbiAgICAgICAgICAgIGNvbnN0IHJEaWZmID0gcmlnaHRDb2xvci5yIC0gbGVmdENvbG9yLnI7XHJcbiAgICAgICAgICAgIGNvbnN0IGdEaWZmID0gcmlnaHRDb2xvci5nIC0gbGVmdENvbG9yLmc7XHJcbiAgICAgICAgICAgIGNvbnN0IGJEaWZmID0gcmlnaHRDb2xvci5iIC0gbGVmdENvbG9yLmI7XHJcbiAgICAgICAgICAgIGNvbnN0IGFEaWZmID0gcmlnaHRDb2xvci5hIC0gbGVmdENvbG9yLmE7XHJcblxyXG4gICAgICAgICAgICAvLyDmraXplb/lkozpopzoibLlop7ph49cclxuICAgICAgICAgICAgY29uc3QgaW52TGVuZ3RoID0gMSAvICgoeEVuZCAtIHhTdGFydCkgKyAxKTtcclxuICAgICAgICAgICAgY29uc3QgclN0ZXAgPSByRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgZ1N0ZXAgPSBnRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYlN0ZXAgPSBiRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYVN0ZXAgPSBhRGlmZiAqIGludkxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIOWIneWni+minOiJsuWAvFxyXG4gICAgICAgICAgICBsZXQgciA9IGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBsZXQgZyA9IGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBsZXQgYiA9IGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBsZXQgYSA9IGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5rC05bmz5pa55ZCR6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5hbENvbG9yID0gKChhIHwgMCkgPDwgMjQpIHwgKChiIHwgMCkgPDwgMTYpIHwgKChnIHwgMCkgPDwgOCkgfCAociB8IDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgZmluYWxDb2xvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g57Sv5Yqg6aKc6Imy5YC8XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDmipXlvbHnm7jlhbNcclxuXHJcbiAgICAvLyDlsIbop4blj6PkuIrnmoTlhoXlrrnmmKDlsITliLDlrp7pmYXlsY/luZXkuIpcclxuICAgIHB1YmxpYyBWaWV3cG9ydFRvQ2FudmFzKHBvaW50OiBWZWN0b3IyKSB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG5Y+j5a695bqm5Li6MeS4quWNleS9jVxyXG4gICAgICAgIC8vIOWboOS4umFzcGVjdFJhdGlvID0gY2FudmFzV2lkdGggLyBjYW52YXNIZWlnaHTvvIxcclxuICAgICAgICAvLyDmiYDku6Xop4blj6Ppq5jluqYgPSAxIC8gYXNwZWN0UmF0aW8gPSBjYW52YXNIZWlnaHQgLyBjYW52YXNXaWR0aFxyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSAxO1xyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gMSAvIENvbmZpZy5hc3BlY3RSYXRpbztcclxuXHJcbiAgICAgICAgLy8g5bCG5oqV5b2x5Z2Q5qCH5pig5bCE5YiwQ2FudmFz5YOP57Sg5Z2Q5qCHXHJcbiAgICAgICAgLy8gWOWdkOagh++8muS7jiBbLXZpZXdwb3J0V2lkdGgvMiwgdmlld3BvcnRXaWR0aC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc1dpZHRoXVxyXG4gICAgICAgIC8vIFnlnZDmoIfvvJrku44gWy12aWV3cG9ydEhlaWdodC8yLCB2aWV3cG9ydEhlaWdodC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc0hlaWdodF0gKOazqOaEj1novbTmlrnlkJEpXHJcbiAgICAgICAgY29uc3QgY2FudmFzWCA9ICgocG9pbnQueCArIHZpZXdwb3J0V2lkdGggLyAyKSAvIHZpZXdwb3J0V2lkdGgpICogQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSBDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgocG9pbnQueSArIHZpZXdwb3J0SGVpZ2h0IC8gMikgLyB2aWV3cG9ydEhlaWdodCkgKiBDb25maWcuY2FudmFzSGVpZ2h0KTsgLy8gQ2FudmFz55qEWei9tOmAmuW4uOaYr+WQkeS4i+eahFxyXG4gICAgICAgIHBvaW50LnggPSBjYW52YXNYO1xyXG4gICAgICAgIHBvaW50LnkgPSBjYW52YXNZO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmAj+inhuaKleW9se+8jOWwhjNE5Zy65pmv55qE5Z2Q5qCH6L2s5o2i5Li6MkTlsY/luZXlnZDmoIfvvIzmipXlsITliLDop4blj6PkuIpcclxuICAgIHB1YmxpYyBQcm9qZWN0VmVydGV4KHZlcnRleDogVmVjdG9yMyk6IFZlY3RvcjIge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhueCueWIsOi/keijgemdou+8iOinhuWPo++8ieeahOi3neemu+aYr2TvvIzop4blj6PnmoTlrr3mmK8xXHJcbiAgICAgICAgLy8g5qC55o2u5LiJ6KeS5Ye95pWw5pyJ77yadGFuKGZvdi8yKSA9ICgwLjUgLyBkKVxyXG4gICAgICAgIC8vIOaJgOS7pe+8mmQgPSAwLjUgLyB0YW4oZm92LzIpXHJcbiAgICAgICAgY29uc3QgZm92RGVncmVlcyA9IDYwO1xyXG4gICAgICAgIGNvbnN0IGZvdlJhZGlhbnMgPSBmb3ZEZWdyZWVzICogKE1hdGguUEkgLyAxODApOyAvLyDlsIbop5LluqbovazmjaLkuLrlvKfluqZcclxuICAgICAgICBjb25zdCBkID0gMC41IC8gTWF0aC50YW4oZm92UmFkaWFucyAvIDIpO1xyXG5cclxuICAgICAgICAvLyDpgI/op4blhazlvI/vvIzlgYforr7op4bngrnkvY3nva4oMCwwKe+8jOinhueCueWIsOinhuWPo+i3neemu+S4umTvvIzlnLrmma/ph4znmoTngrnkuLpQKHgseSx6Ke+8jOaKleWwhOWIsOinhuWPo+S4iueahOeCueS4ulAnKHgseSlcclxuICAgICAgICAvLyDliJnmoLnmja7nm7jkvLzkuInop5LlvaLmnInvvJp6IC8gZCA9IHggLyB4JyA9IHkgLyB5J++8jOWPr+W+l+WIsO+8mlxyXG4gICAgICAgIC8vIHgnID0gKGQgKiB4KSAvIHpcclxuICAgICAgICAvLyB5JyA9IChkICogeSkgLyB6XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblggPSAoZCAqIHZlcnRleC54KSAvIHZlcnRleC56O1xyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb25ZID0gKGQgKiB2ZXJ0ZXgueSkgLyB2ZXJ0ZXguejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHByb2plY3Rpb25YLCBwcm9qZWN0aW9uWSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOWPmOaNolxyXG5cclxuICAgIC8qXHJcbiAgICAgKiDpobbngrnlpITnkIbpmLbmrrXvvJrmqKHlnovnqbrpl7Qg4oaS77yI5qih5Z6L55+p6Zi16Zi177yJ4oaSIOS4lueVjOepuumXtCDihpLvvIjop4blm77nn6npmLXvvInihpIg6KeC5a+f56m66Ze0IOKGku+8iOaKleW9seefqemYte+8ieKGkiDoo4Hliarnqbrpl7Qg4oaS77yI6YCP6KeG6Zmk5rOV77yJ4oaSIE5EQyDnqbrpl7Qg4oaS77yI6KeG5Y+j5Y+Y5o2i77yJ4oaSIOWxj+W5leepuumXtCDihpIg5YWJ5qCF5YyW5riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2Uob2JqOiBJbnN0YW5jZSkge1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gb2JqLm1vZGVsO1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbW9kZWwudmVydGljZXM7XHJcbiAgICAgICAgY29uc3QgY2xpcFNwYWNlVmVydGljZXMgPSBuZXcgQXJyYXkodmVydGljZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgLy8g5p6E5bu6TVZQ55+p6Zi1XHJcbiAgICAgICAgY29uc3QgbW9kZWxNYXRyaXggPSBvYmoudHJhbnNmb3JtLmxvY2FsVG9Xb3JsZE1hdHJpeDtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBDYW1lcmEubWFpbkNhbWVyYTtcclxuICAgICAgICBjb25zdCBjYW1lcmFGb3J3YXJkID0gY2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVVwID0gY2FtZXJhLnRyYW5zZm9ybS51cDtcclxuICAgICAgICAvLyDmnoTlu7rkuIDkuKrlhYjmnJ3mkYTlvbHmnLrlj43mlrnlkJHnp7vliqjvvIzlho3lj43mlrnlkJHml4vovaznmoTnn6npmLXvvIzlhbblrp7lvpfliLDnmoTkuZ/lsLHmmK/kuIrpnaLmkYTlvbHmnLrnmoTkuJbnlYzlnZDmoIfnn6npmLVcclxuICAgICAgICBjb25zdCBtb2RlbFZpZXdNYXRyaXggPSBtb2RlbE1hdHJpeC5jbG9uZSgpLnRyYW5zZm9ybVRvTG9va0F0U3BhY2UoY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbiwgY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbi5hZGQoY2FtZXJhRm9yd2FyZCksIGNhbWVyYVVwKTtcclxuICAgICAgICBjb25zdCBtdnBNYXRyaXggPSBtb2RlbFZpZXdNYXRyaXgucGVyc3BlY3RpdmUoY2FtZXJhLmZvdiwgY2FtZXJhLmFzcGVjdCwgY2FtZXJhLm5lYXJDbGlwLCBjYW1lcmEuZmFyQ2xpcCk7XHJcblxyXG4gICAgICAgIC8vIDEuIE1WUOWPmOaNouWIsOijgeWJquepuumXtFxyXG4gICAgICAgIC8vIOaooeWei+epuumXtCAtPiDkuJbnlYznqbrpl7QgLT4g6KeC5a+f56m66Ze0IC0+IOijgeWJquepuumXtFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRpY2UgPSB2ZXJ0aWNlc1tpXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBsZXQgdiA9IG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodmVydGljZSwgMSkpO1xyXG4gICAgICAgICAgICBjbGlwU3BhY2VWZXJ0aWNlc1tpXSA9IHY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAyLiDpgI/op4bpmaTms5XvvJrlsIboo4Hliarnqbrpl7TlnZDmoIfovazmjaLkuLrmoIflh4borr7lpIflnZDmoIfvvIhOREPvvIlcclxuICAgICAgICAvLyDoo4Hliarnqbrpl7QgLT4g5qCH5YeG5YyW6K6+5aSH5Z2Q5qCH77yITkRDIOepuumXtO+8iVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdiA9IGNsaXBTcGFjZVZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyB35YiG6YeP5piv6YCP6KeG5oqV5b2x5Lqn55Sf55qE77yM55So5LqO6YCP6KeG6Zmk5rOVXHJcbiAgICAgICAgICAgIGNvbnN0IHcgPSB2Lnc7IC8vIOWBh+iuvuS9oOeahFZlY3RvcjQvVmVjdG9yM+WunueOsOS4re+8jOm9kOasoeWdkOagh3flrZjlgqjlnKh35bGe5oCn5Lit44CC5aaC5p6c5rKh5pyJ77yM6ZyA6KaB56Gu5L+dTVZQ5Y+Y5o2i5pe25aSE55CG5LqG6b2Q5qyh5Z2Q5qCH44CCXHJcbiAgICAgICAgICAgIC8vIOWmguaenOayoeacieaYvuW8j+eahHfliIbph4/vvIzkuJRtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3Iz6L+U5Zue55qE5pivVmVjdG9yM++8jOmCo+S5iOmAmuW4uOiupOS4unc9Me+8iOato+S6pOaKleW9se+8ieaIluiAhemcgOimgeS7juWPmOaNouefqemYteS4reiAg+iZkemAj+inhlxyXG5cclxuICAgICAgICAgICAgLy8g6L+b6KGM6YCP6KeG6Zmk5rOV77yaeHl65YiG5Yir6Zmk5Luld1xyXG4gICAgICAgICAgICAvLyDms6jmhI/vvJrlpoLmnpzkvaDnmoTnn6npmLXkuZjms5XmsqHmnInlpITnkIbpvZDmrKHlnZDmoIfvvIjljbPov5Tlm57nmoR2ZXJ0aWNl5piv5LiJ57u05ZCR6YeP77yJ77yM6YKj5LmI5b6I5Y+v6IO95L2g55qE5Y+Y5o2i5rKh5pyJ5YyF5ZCr6YCP6KeG5oqV5b2x5Lqn55Sf55qEd+WIhumHj+OAglxyXG4gICAgICAgICAgICAvLyDlgYforr7kvaDnmoRtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3Iz56Gu5a6e6L+U5Zue5LqG5YyF5ZCr6b2Q5qyh5Z2Q5qCH55qEVmVjdG9yNO+8jOaIluiAheacieS4gOS4qui/lOWbnlZlY3RvcjTnmoTmlrnms5XjgIJcclxuICAgICAgICAgICAgLy8g6L+Z6YeM5YGH6K6+IHByb2plY3RlZFZlcnRpY2VzIOS4reWtmOWCqOeahOaYryBWZWN0b3I077yM5oiW6ICF6Iez5bCR5pyJIHgsIHksIHosIHcg5bGe5oCn44CCXHJcblxyXG4gICAgICAgICAgICAvLyDlpoLmnpzmgqjnmoTlrp7njrDkuK3vvIznu4/ov4fpgI/op4bmipXlvbHnn6npmLXlj5jmjaLlkI7vvIzpobbngrnlt7Lnu4/mmK/kuIDkuKrpvZDmrKHlnZDmoIfvvIh4LCB5LCB6LCB377yJ77yM5YiZ6ZyA6KaB5Lul5LiL6Zmk5rOV77yaXHJcbiAgICAgICAgICAgIHYueCA9IHYueCAvIHc7XHJcbiAgICAgICAgICAgIHYueSA9IHYueSAvIHc7XHJcbiAgICAgICAgICAgIHYueiA9IHYueiAvIHc7IC8vIOWvueS6jua3seW6puS/oeaBr++8jOWPr+iDvei/mOmcgOimgei/m+S4gOatpeWkhOeQhu+8jOS9huWxj+W5leaYoOWwhOmAmuW4uOS4u+imgeWFs+azqHgseVxyXG4gICAgICAgICAgICAvLyDnu4/ov4fpgI/op4bpmaTms5XlkI7vvIzlnZDmoIfkvY3kuo7moIflh4borr7lpIflnZDmoIfvvIhOREPvvInnqbrpl7TvvIzpgJrluLh4LCB5LCB66IyD5Zu05ZyoWy0xLCAxXe+8iE9wZW5HTOmjjuagvO+8ieaIllswLCAxXe+8iERpcmVjdFjpo47moLzvvInkuYvpl7TjgIJcclxuICAgICAgICAgICAgLy8g5YGH6K6+5oiR5Lus55qETkRD5pivWy0xLCAxXeiMg+WbtOOAglxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMy4g6KeG5Y+j5Y+Y5o2i77ya5bCGTkRD5Z2Q5qCH5pig5bCE5Yiw5bGP5bmV5Z2Q5qCHXHJcbiAgICAgICAgLy8g5qCH5YeG5YyW6K6+5aSH5Z2Q5qCH77yITkRDIOepuumXtO+8iSAtPiDlsY/luZXnqbrpl7RcclxuICAgICAgICAvLyDojrflj5bnlLvluIPvvIjmiJbop4blj6PvvInnmoTlrr3luqblkozpq5jluqZcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IG5ldyBBcnJheShjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbmRjID0gY2xpcFNwYWNlVmVydGljZXNbaV07IC8vIOatpOaXtm5kY+W6lOivpeaYr+e7j+i/h+mAj+inhumZpOazleWQjueahE5EQ+WdkOagh1xyXG5cclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeOS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuV2lkdGhdXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblggPSAoKG5kYy54ICsgMSkgLyAyKSAqIENvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeeS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuSGVpZ2h0XeOAguazqOaEj+Wxj+W5leWdkOagh+mAmuW4uHnlkJHkuIvkuLrmraPvvIzogIxOREPnmoR55ZCR5LiK5Li65q2j77yM5omA5Lul6ZyA6KaB57+76L2sXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblkgPSBDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgobmRjLnkgKyAxKSAvIDIpICogQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICAgICAgICAgIC8vIHrliIbph4/pgJrluLjnlKjkuo7mt7HluqbmtYvor5XvvIzov5nph4zmiJHku6zlj6rlhbPlv4PlsY/luZV4LHlcclxuICAgICAgICAgICAgLy8g5aaC5p6c5L2g55qETkRDeuiMg+WbtOaYr1stMSwxXeS4lOmcgOimgeaYoOWwhOWIsFswLDFd77yI5L6L5aaCV2ViR1BV5p+Q5Lqb5oOF5Ya177yJ77yM5Y+v5Lul57G75Ly85aSE55CG77yaY29uc3Qgc2NyZWVuWiA9IChuZGMueiArIDEpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHNjcmVlblZlcnRpY2VzW2ldID0geyB4OiBzY3JlZW5YLCB5OiBzY3JlZW5ZIH07IC8vIOWtmOWCqOWxj+W5leWdkOagh1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc2NyZWVuVmVydGljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIOeugOWNleWPmOaNoumYtuaute+8muayoeaciemAmui/h+efqemYteiuoeeul++8jOiAjOaYr+eugOWNleeahOebuOS8vOS4ieinkuW9ouWOn+eQhu+8jOS4ieinkuWHveaVsOeul+WHuk1WUOWPmOaNoui3n+Wxj+W5leaYoOWwhO+8jOeQhuino+i1t+adpeavlOi+g+eugOWNle+8jOS9huavj+S4qumhtueCuemDvee7j+i/h+S7juWktOWIsOWwvueahOiuoeeul++8jOavlOi+g+iAl+aAp+iDvVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgRWFzeVZlcnRleFByb2Nlc3NpbmdTdGFnZShvYmo6IEluc3RhbmNlKSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSBvYmoubW9kZWw7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBtb2RlbC52ZXJ0aWNlcztcclxuICAgICAgICBjb25zdCBjbGlwU3BhY2VWZXJ0aWNlcyA9IG5ldyBBcnJheSh2ZXJ0aWNlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyDnroDljZXlj5jmjaJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCB2ZXJ0aWNlID0gdmVydGljZXNbaV0uY2xvbmUoKTtcclxuICAgICAgICAgICAgLy8g5YWI5Y+Y5o2i77yM5b+F6aG75Lil5qC85oyJ54Wn5YWI57yp5pS+77yM5YaN5peL6L2s77yM5YaN5bmz56e7XHJcbiAgICAgICAgICAgIHRoaXMuU2NhbGVWZXJ0ZXgodmVydGljZSwgb2JqLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHRoaXMuUm90YXRlVmVydGV4KHZlcnRpY2UsIG9iai50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVZlcnRleCh2ZXJ0aWNlLCBvYmoudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgLy8g5YaN5oqV5b2xXHJcbiAgICAgICAgICAgIGNsaXBTcGFjZVZlcnRpY2VzW2ldID0gdGhpcy5Qcm9qZWN0VmVydGV4KHZlcnRpY2UpO1xyXG4gICAgICAgICAgICAvLyDlho3op4blj6PmmKDlsIRcclxuICAgICAgICAgICAgdGhpcy5WaWV3cG9ydFRvQ2FudmFzKGNsaXBTcGFjZVZlcnRpY2VzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGNsaXBTcGFjZVZlcnRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTY2FsZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKj0gdHJhbnNmb3JtLnNjYWxlLng7XHJcbiAgICAgICAgdmVydGV4LnkgKj0gdHJhbnNmb3JtLnNjYWxlLnk7XHJcbiAgICAgICAgdmVydGV4LnogKj0gdHJhbnNmb3JtLnNjYWxlLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJvdGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgZXVsZXJBbmdsZXMgPSB0cmFuc2Zvcm0ucm90YXRpb24uZXVsZXJBbmdsZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvc1ggPSBNYXRoLmNvcyhldWxlckFuZ2xlcy54KTtcclxuICAgICAgICBjb25zdCBzaW5YID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueCk7XHJcbiAgICAgICAgY29uc3QgY29zWSA9IE1hdGguY29zKGV1bGVyQW5nbGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IHNpblkgPSBNYXRoLnNpbihldWxlckFuZ2xlcy55KTtcclxuICAgICAgICBjb25zdCBjb3NaID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueik7XHJcbiAgICAgICAgY29uc3Qgc2luWiA9IE1hdGguc2luKGV1bGVyQW5nbGVzLnopO1xyXG4gICAgICAgIC8vIOWFiOe7lVrovbTml4vovaxcclxuICAgICAgICBjb25zdCB4ID0gdmVydGV4LnggKiBjb3NaIC0gdmVydGV4LnkgKiBzaW5aO1xyXG4gICAgICAgIGNvbnN0IHkgPSB2ZXJ0ZXgueCAqIHNpblogKyB2ZXJ0ZXgueSAqIGNvc1o7XHJcbiAgICAgICAgdmVydGV4LnggPSB4O1xyXG4gICAgICAgIHZlcnRleC55ID0geTtcclxuICAgICAgICAvLyDlho3nu5VZ6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeiA9IHZlcnRleC56ICogY29zWSAtIHZlcnRleC54ICogc2luWTtcclxuICAgICAgICBjb25zdCB4MiA9IHZlcnRleC56ICogc2luWSArIHZlcnRleC54ICogY29zWTtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHo7XHJcbiAgICAgICAgdmVydGV4LnggPSB4MjtcclxuICAgICAgICAvLyDmnIDlkI7nu5VY6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeTIgPSB2ZXJ0ZXgueSAqIGNvc1ggLSB2ZXJ0ZXgueiAqIHNpblg7XHJcbiAgICAgICAgY29uc3QgejIgPSB2ZXJ0ZXgueSAqIHNpblggKyB2ZXJ0ZXgueiAqIGNvc1g7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5MjtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHoyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUcmFuc2xhdGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZlcnRleC54ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZlcnRleC55ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZlcnRleC56ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDnu5jliLbniankvZNcclxuXHJcbiAgICBwdWJsaWMgRHJhd09iamVjdChvYmo6IEluc3RhbmNlKSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSBvYmoubW9kZWw7XHJcbiAgICAgICAgY29uc3QgaW5kaWNlcyA9IG1vZGVsLmZhY2VzLmZsYXRNYXAoZmFjZSA9PiBmYWNlLnZlcnRleEluZGljZXMpO1xyXG5cclxuICAgICAgICAvLyBNVlDlj5jmjaJcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IHRoaXMuVmVydGV4UHJvY2Vzc2luZ1N0YWdlKG9iaik7XHJcbiAgICAgICAgLy8g566A5Y2VTVZQ5Y+Y5o2iXHJcbiAgICAgICAgLy8gY29uc3Qgc2NyZWVuVmVydGljZXMgPSB0aGlzLkVhc3lWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2Uob2JqKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5ZCO57uY5Yi25LiJ6KeS5b2i5Yiw5bGP5bmV5LiKXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAxID0gc2NyZWVuVmVydGljZXNbaW5kaWNlc1tpXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0gc2NyZWVuVmVydGljZXNbaW5kaWNlc1tpICsgMV1dO1xyXG4gICAgICAgICAgICBjb25zdCBwMyA9IHNjcmVlblZlcnRpY2VzW2luZGljZXNbaSArIDJdXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOe6v+ahhuaooeW8j++8jOaaguS4jeaUr+aMgemhtueCueiJslxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuV2lyZWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZShwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAxLngsIHAxLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAyLngsIHAyLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5TaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1RyaWFuZ2xlKHAxLngsIHAxLnksIHAyLngsIHAyLnksIHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5bel5YW35Ye95pWwXHJcblxyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIOe6v+aAp+aPkuWAvFxyXG4gICAgLy8vIOS8oOWFpTLkuKrngrnvvIzov5Tlm57lroPku6znu4TmiJDnur/mrrXnmoTmj5LlgLzjgIJcclxuICAgIC8vLyDopoHmsYLvvJpcclxuICAgIC8vLyAxLiDopoHlhYjnrpflh7rnm7Tnur/lgY/msLTlubPov5jmmK/lnoLnm7TvvIzlpoLmnpzmmK/lgY/msLTlubPvvIjmlpznjoflsI/kuo4x77yJ77yM5YiZ5LuleOS4uuW+queOr++8jOS8oOWFpemhuuW6j+aYryh4MSx5MSx4Mix5MinvvIzlj43kuYvlpoLmnpznm7Tnur/lgY/lnoLnm7TvvIzliJnmmK8oeTEseDEseTIseDIpXHJcbiAgICAvLy8gMi4g5ZCM5pe26KaB56Gu5L+d57q/5q6154K555qE5pa55ZCR5piv5LuO5bem5b6A5Y+z5oiW5LuO5LiK5b6A5LiL77yM5L6L5aaC57q/5q615piv5YGP5rC05bmz55qE6K+d77yM6KaB56Gu5L+deDI+eDHvvIzlpoLmnpzmmK/lgY/lnoLnm7TnmoTor53vvIzopoHnoa7kv515Mj55MVxyXG4gICAgLy8vIOS4vuS4quS+i+WtkO+8mlxyXG4gICAgLy8vIOeCuSgwLCAwKeWSjCgyLDEp77yM5Lyg5YWl55qE5Y+C5pWw5pivKDAsIDAsIDIsIDEp77yM6L+U5Zue55qE5pivKCgyLTApKzE9MynkuKrlgLzvvIzov5nkupvlgLzmmK/ku44oMC0xKeS4remXtOaPkuWAvOeahO+8jOWNsygwLCAwLjUsIDEpXHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgcHJpdmF0ZSBJbnRlcnBvbGF0ZShhMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMjogbnVtYmVyLCBiMjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj+S7pemBv+WFjeWKqOaAgeaJqeWuuVxyXG4gICAgICAgIC8vIGNvbnN0IGR4ID0gTWF0aC5hYnMoTWF0aC5mbG9vcihhMiAtIGExKSk7XHJcbiAgICAgICAgY29uc3QgZHggPSAoKGEyID4gYTEgPyBhMiAtIGExIDogYTEgLSBhMikgfCAwKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBBcnJheShkeCArIDEpO1xyXG4gICAgICAgIGNvbnN0IGEgPSAoYjIgLSBiMSkgLyAoYTIgLSBhMSk7XHJcbiAgICAgICAgbGV0IGQgPSBiMTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICB2YWx1ZVtpXSA9IGQ7XHJcbiAgICAgICAgICAgIGQgKz0gYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59IiwiaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2UsIFRyYW5zZm9ybSB9IGZyb20gXCIuLi9Nb2RlbFwiO1xyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSBcIi4vRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgeyBPQkpQYXJzZXIgfSBmcm9tIFwiLi9PYmpQYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBc3NldExvYWRlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBmaWxlQ2FjaGU6IERpY3Rpb25hcnkgPSBuZXcgRGljdGlvbmFyeSgpO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEltYWdlRmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KChyZXNvbHZlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSB0aGUgaW1hZ2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCBvbiBsb2FkaW5nIGFuIGltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDot6jljLror7fmsYJcclxuICAgICAgICAgICAgICAgIGltYWdlLmNyb3NzT3JpZ2luID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZWxsIHRoZSBicm93c2VyIHRvIGxvYWQgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGZpbGVOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkVGV4dEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zkuI3opoHlvIDlkK/lvILmraXvvIzorr7nva7kuLpmYWxzZe+8jOWQpuWImeWuueaYk+WNoeWcqHJlYWR5U3RhdGUgPSAx77yM5Y6f5Zug5LiN5piOXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgZmlsZU5hbWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZE1vZGVsRmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxPQkpEb2M+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8T0JKRG9jPigocmVzb2x2ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqRG9jID0gbmV3IE9CSkRvYyhmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgb2JqRG9jLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0LCAxLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiT0JKIGZpbGUgcGFyc2luZyBlcnJvcjogXCIgKyBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIG9iakRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iakRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICovXHJcbiAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBsb2FkSW5zdGFuY2VGcm9tTW9kZWwobmFtZTogc3RyaW5nLCBtb2RlbFBhdGg6IHN0cmluZywgc2NhbGU6IG51bWJlciA9IDEsIHJldmVyc2U6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8SW5zdGFuY2U+IHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2UobmFtZSk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uaWRlbnRpdHk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gVmVjdG9yMy5PTkU7XHJcblxyXG4gICAgICAgIHZhciBvYmpEb2MgPSBhd2FpdCBBc3NldExvYWRlci5sb2FkVGV4dEZpbGUobW9kZWxQYXRoKTtcclxuICAgICAgICBpZiAob2JqRG9jICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBPQkpQYXJzZXIucGFyc2VPQkoob2JqRG9jKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UubW9kZWwgPSBtb2RlbDtcclxuXHJcbiAgICAgICAgICAgIC8vIOi+k+WHuue7n+iuoeS/oeaBr1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhPQkpQYXJzZXIuZ2V0TW9kZWxTdGF0cyhtb2RlbCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gdmFyIG9ianMgPSBvYmpEb2MuZ2V0T2JqcyhzY2FsZSwgcmV2ZXJzZSk7XHJcbiAgICAgICAgICAgIC8vIG9ianMuZm9yRWFjaChhc3luYyBvYmogPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgLy90b2RvOuS4tOatu+WGmeatu++8jOWPquWKoOi9vea8q+WPjeWwhOi0tOWbvlxyXG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKG9iai5tYXRlcmlhbCAhPSBudWxsICYmIG9iai5tYXRlcmlhbC5tYXBfS2QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHJlbmRlci5tYXRlcmlhbC5jcmVhdGVUZXh0dXJlKG9iai5tYXRlcmlhbC5tYXBfS2QpO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLnZlcnRpY2VzID0gb2JqLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwuaW5kaWNlcyA9IG9iai5pbmRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwudXZzID0gb2JqLnV2cztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLm5vcm1hbHMgPSBvYmoubm9ybWFscztcclxuICAgICAgICAgICAgLy8gICAgIGluc3RhbmNlLm1vZGVsLnB1c2gobW9kZWwpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xyXG5cclxuICBpdGVtczogb2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcclxuICAgIHRoaXMuaXRlbXNba2V5XSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuaXRlbXNba2V5XSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5pdGVtc1trXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGZ1bikge1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGZ1bihrLCB0aGlzLml0ZW1zW2tdKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAnLi4vTWF0aC9WZWN0b3IzJztcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJy4uL01hdGgvVmVjdG9yMic7XHJcblxyXG4vKipcclxuICogT0JK5qih5Z6L6Kej5p6Q57uT5p6c5o6l5Y+jXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9CSk1vZGVsIHtcclxuICAgIHZlcnRpY2VzOiBWZWN0b3IzW107XHJcbiAgICB0ZXh0dXJlQ29vcmRzOiBWZWN0b3IyW107XHJcbiAgICB2ZXJ0ZXhOb3JtYWxzOiBWZWN0b3IzW107XHJcbiAgICBmYWNlczogRmFjZVtdO1xyXG4gICAgbWF0ZXJpYWxzOiBSZWNvcmQ8c3RyaW5nLCBNYXRlcmlhbD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDpnaLmjqXlj6PvvIzmlK/mjIHkuInop5LlvaLlkozlpJrovrnlvaJcclxuICovXHJcbmludGVyZmFjZSBGYWNlIHtcclxuICAgIHZlcnRleEluZGljZXM6IG51bWJlcltdO1xyXG4gICAgdGV4dHVyZUluZGljZXM/OiBudW1iZXJbXTtcclxuICAgIG5vcm1hbEluZGljZXM/OiBudW1iZXJbXTtcclxuICAgIG1hdGVyaWFsTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIOadkOi0qOS/oeaBr+aOpeWPo1xyXG4gKi9cclxuaW50ZXJmYWNlIE1hdGVyaWFsIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8vIOWPr+agueaNrumcgOimgeaJqeWxleadkOi0qOWxnuaAp1xyXG59XHJcblxyXG4vKipcclxuICogT0JK5paH5Lu26Kej5p6Q5Zmo57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT0JKUGFyc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6QT0JK5paH5Lu2XHJcbiAgICAgKiBAcGFyYW0gZmlsZUNvbnRlbnQgT0JK5paH5Lu25YaF5a65XHJcbiAgICAgKiBAcmV0dXJucyDop6PmnpDlkI7nmoRPQkrmqKHlnovmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwYXJzZU9CSihmaWxlQ29udGVudDogc3RyaW5nKTogT0JKTW9kZWwge1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gZmlsZUNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQ6IE9CSk1vZGVsID0ge1xyXG4gICAgICAgICAgICB2ZXJ0aWNlczogW10sXHJcbiAgICAgICAgICAgIHRleHR1cmVDb29yZHM6IFtdLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhOb3JtYWxzOiBbXSxcclxuICAgICAgICAgICAgZmFjZXM6IFtdLFxyXG4gICAgICAgICAgICBtYXRlcmlhbHM6IHt9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50TWF0ZXJpYWwgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRMaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDot7Pov4fnqbrooYzlkozms6jph4pcclxuICAgICAgICAgICAgaWYgKCF0cmltbWVkTGluZSB8fCB0cmltbWVkTGluZS5zdGFydHNXaXRoKCcjJykpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGluZVBhcnRzID0gdHJpbW1lZExpbmUuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgY29uc3Qga2V5d29yZCA9IGxpbmVQYXJ0c1swXTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5d29yZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndic6IC8vIOmhtueCueWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZlcnRpY2VzLnB1c2godmVydGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndnQnOiAvLyDnurnnkIblnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleENvb3JkID0gbmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRleHR1cmVDb29yZHMucHVzaCh0ZXhDb29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3ZuJzogLy8g6aG254K55rOV57q/XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3JtYWwgPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmVydGV4Tm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2YnOiAvLyDpnaLlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2U6IEZhY2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbEluZGljZXM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDpnaLnmoTmr4/kuKrpobbngrnlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lUGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERlZiA9IGxpbmVQYXJ0c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIF244CBdi92dOOAgXYvL3Zu44CBdi92dC92buetieWkmuenjeagvOW8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UGFydHMgPSB2ZXJ0ZXhEZWYuc3BsaXQoJy8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpobbngrnntKLlvJXvvIhPQkrntKLlvJXku44x5byA5aeL77yM6ZyA6KaB6L2s5o2i5Li65LuOMOW8gOWni++8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS52ZXJ0ZXhJbmRpY2VzLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMF0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g57q555CG5Z2Q5qCH57Si5byV77yI5Y+v6YCJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMV0gJiYgdmVydGV4UGFydHNbMV0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS50ZXh0dXJlSW5kaWNlcyEucHVzaChwYXJzZUludCh2ZXJ0ZXhQYXJ0c1sxXSkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDms5Xnur/ntKLlvJXvvIjlj6/pgInvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1syXSAmJiB2ZXJ0ZXhQYXJ0c1syXSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLm5vcm1hbEluZGljZXMhLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMl0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaciee6ueeQhuaIluazlee6v+e0ouW8le+8jOa4heepuuaVsOe7hOS7peS/neaMgeaVsOaNruaVtOa0gVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2UudGV4dHVyZUluZGljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2Uubm9ybWFsSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2Uubm9ybWFsSW5kaWNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5re75Yqg5p2Q6LSo5L+h5oGv77yI5aaC5p6c5pyJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UubWF0ZXJpYWxOYW1lID0gY3VycmVudE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZmFjZXMucHVzaChmYWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbXRsbGliJzogLy8g5p2Q6LSo5bqT5byV55SoXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbExpYk5hbWUgPSBsaW5lUGFydHNbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWunumZheW6lOeUqOS4remcgOimgeWKoOi9veW5tuino+aekOWvueW6lOeahC5tdGzmlofku7ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWPkeeOsOadkOi0qOW6k+W8leeUqDogJHttYXRlcmlhbExpYk5hbWV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VzZW10bCc6IC8vIOS9v+eUqOadkOi0qFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE1hdGVyaWFsID0gbGluZVBhcnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJbmnZDotKjorrDlvZXvvIjlrp7pmYXkvb/nlKjml7bpnIDopoHku44ubXRs5paH5Lu25Yqg6L295a6M5pW05L+h5oGv77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdID0geyBuYW1lOiBjdXJyZW50TWF0ZXJpYWwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlj6/ku6Xmt7vliqDmm7TlpJpPQkrmoLzlvI/lhbPplK7lrZfnmoTlpITnkIZcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5b+955Wl5LiN5pSv5oyB55qE5YWz6ZSu5a2XXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbop6PmnpDlkI7nmoTmqKHlnovmlbDmja7ovazmjaLkuLpKU09O5a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyBKU09O5a2X56ym5LiyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9KU09OKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1vZGVsLCBudWxsLCAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaooeWei+e7n+iuoeS/oeaBr1xyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMg57uf6K6h5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TW9kZWxTdGF0cyhtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVDb3VudCA9IG1vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbENvdW50ID0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoVGV4dHVyZXMgPSBtb2RlbC5mYWNlcy5maWx0ZXIoZmFjZSA9PiBmYWNlLnRleHR1cmVJbmRpY2VzKS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoTm9ybWFscyA9IG1vZGVsLmZhY2VzLmZpbHRlcihmYWNlID0+IGZhY2Uubm9ybWFsSW5kaWNlcykubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gYFxyXG7mqKHlnovnu5/orqHkv6Hmga86XHJcbi0g6aG254K55pWwOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aH1cclxuLSDnurnnkIblnZDmoIfmlbA6ICR7dGV4dHVyZUNvdW50fVxyXG4tIOazlee6v+WQkemHj+aVsDogJHtub3JtYWxDb3VudH1cclxuLSDpnaLmlbA6ICR7bW9kZWwuZmFjZXMubGVuZ3RofVxyXG4tIOW4pue6ueeQhueahOmdojogJHtmYWNlc1dpdGhUZXh0dXJlc31cclxuLSDluKbms5Xnur/nmoTpnaI6ICR7ZmFjZXNXaXRoTm9ybWFsc31cclxuLSDmnZDotKjmlbA6ICR7T2JqZWN0LmtleXMobW9kZWwubWF0ZXJpYWxzKS5sZW5ndGh9XHJcbiAgICAgICAgYC50cmltKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpqozor4Hop6PmnpDmlbDmja7nmoTlrozmlbTmgKdcclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIOmqjOivgee7k+aenOa2iOaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlTW9kZWwobW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIC8vIOajgOafpemdoue0ouW8leaYr+WQpui2iueVjFxyXG4gICAgICAgIGZvciAoY29uc3QgZmFjZSBvZiBtb2RlbC5mYWNlcykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZlcnRleEluZGV4IG9mIGZhY2UudmVydGV4SW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleEluZGV4IDwgMCB8fCB2ZXJ0ZXhJbmRleCA+PSBtb2RlbC52ZXJ0aWNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg6aG254K557Si5byV6LaK55WMOiAke3ZlcnRleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZXhJbmRleCBvZiBmYWNlLnRleHR1cmVJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleEluZGV4IDwgMCB8fCB0ZXhJbmRleCA+PSBtb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg57q555CG5Z2Q5qCH57Si5byV6LaK55WMOiAke3RleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoIC0gMX0pYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS5ub3JtYWxJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vcm1hbEluZGV4IG9mIGZhY2Uubm9ybWFsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxJbmRleCA8IDAgfHwgbm9ybWFsSW5kZXggPj0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOazlee6v+e0ouW8lei2iueVjDogJHtub3JtYWxJbmRleH0gKOacgOWkpzogJHttb2RlbC52ZXJ0ZXhOb3JtYWxzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwIFxyXG4gICAgICAgICAgICA/IGDlj5HnjrAgJHtlcnJvcnMubGVuZ3RofSDkuKrplJnor686XFxuJHtlcnJvcnMuam9pbignXFxuJyl9YFxyXG4gICAgICAgICAgICA6ICfmqKHlnovmlbDmja7pqozor4HpgJrov4cnO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ2FtZXJhXCI7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vSW5wdXRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSBcIi4vTW9kZWxcIjtcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBBc3NldExvYWRlciB9IGZyb20gXCIuL1V0aWxzL0Fzc2V0TG9hZGVyXCI7XHJcblxyXG4vLyDlr7nosaHliJfooahcclxuY29uc3QgaW5zdGFuY2VzOiBJbnN0YW5jZVtdID0gW107XHJcblxyXG4vLyDlvZNET03lhoXlrrnliqDovb3lrozmiJDlkI7miafooYxcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIC8vIOiOt+WPlmNhbnZhc+WFg+e0oOWSjDJE5riy5p+T5LiK5LiL5paHXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAvLyDorr7nva5jYW52YXPlsLrlr7hcclxuICAgIGNhbnZhcy53aWR0aCA9IENvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBDb25maWcuY2FudmFzSGVpZ2h0O1xyXG5cclxuICAgIC8vIOWIm+W7uuWbvuWDj+aVsOaNruWvueixoVxyXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YShDb25maWcuY2FudmFzV2lkdGgsIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKHVpbnQzMlZpZXcpO1xyXG5cclxuICAgIEluaXQoKTtcclxuXHJcbiAgICAvLyDmuLLmn5Plh73mlbBcclxuICAgIGZ1bmN0aW9uIG1haW5Mb29wKCkge1xyXG4gICAgICAgIC8vIOWkhOeQhumAu+i+kVxyXG4gICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIFJlbmRlcihyZW5kZXJlcik7XHJcbiAgICAgICAgLy8g5bCG5Zu+5YOP5pWw5o2u57uY5Yi25YiwY2FudmFz5LiKXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgIC8vIOivt+axguS4i+S4gOW4p+WKqOeUu1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbiAgICB9XHJcbiAgICAvLyDlvIDlp4vliqjnlLvlvqrnjq9cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbn0pO1xyXG5cclxuLy8g6I635Y+W6byg5qCH5LqL5Lu2XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgLy8g6I635Y+W6byg5qCH55u45a+55LqOY2FudmFz55qE5Z2Q5qCHXHJcbiAgICBjb25zdCByZWN0ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgSW5wdXQubW91c2VYID0gbW91c2VYO1xyXG4gICAgSW5wdXQubW91c2VZID0gbW91c2VZO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICBsZXQgbGVlOiBJbnN0YW5jZTtcclxuXHJcbiAgICAvLyDnm7jmnLpcclxuICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoXCJjYW1lcmFcIik7XHJcbiAgICAvL2NhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAtMTApO1xyXG5cclxuICAgIC8vIOWKoOi9veaooeWei1xyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdsZWUnLCAncmVzb3VyY2VzL2Fzc2V0cy9tZXNoZXMvbGVlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgbGVlID0gaW5zdGFuY2U7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMik7XHJcbiAgICAgICAgaW5zdGFuY2VzLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdjdWJlJywgJ3Jlc291cmNlcy9jdWJlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMSwgMCwgMCk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjMoMC4xLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgLy9pbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24gPSBuZXcgUXVhdGVybmlvbihuZXcgVmVjdG9yMygwLCA0NSwgMCkpO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5zZXRQYXJlbnQobGVlLnRyYW5zZm9ybSwgZmFsc2UpO1xyXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKGluc3RhbmNlKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5sZXQgYW5nbGUgPSAwO1xyXG5mdW5jdGlvbiBVcGRhdGUoKSB7XHJcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZS5uYW1lID09IFwiY3ViZVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOS9v+eUqHNpbuWHveaVsOWunueOsOe8qeaUvuWcqDAuOeWIsDEuMeS5i+mXtOW+queOr1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZU9mZnNldCA9IE1hdGguc2luKERhdGUubm93KCkgKiAwLjAwMikgKiAwLjEgKyAwLjE7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICBzY2FsZS54ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICAgICAgICAgIHNjYWxlLnkgPSBzY2FsZU9mZnNldDtcclxuICAgICAgICAgICAgc2NhbGUueiA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgICAgICAgICBpbnN0YW5jZS50cmFuc2Zvcm0uc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKGFuZ2xlLCBWZWN0b3IzLkZPUldBUkQpO1xyXG4gICAgICAgICAgICBhbmdsZSArPSAxO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOiuqeeJqeS9k+WcqOaJgOaciei9tOS4iuaXi+i9rFxyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKGFuZ2xlLCBWZWN0b3IzLlVQKTtcclxuICAgICAgICAvLyBhbmdsZSArPSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBSZW5kZXIocmVuZGVyZXI6IFJlbmRlcmVyKSB7XHJcbiAgICByZW5kZXJlci5DbGVhcihDb2xvci5CTEFDSyk7XHJcblxyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICByZW5kZXJlci5EcmF3T2JqZWN0KGluc3RhbmNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlLvkuInop5LlvaJcclxuICAgIC8vIHJlbmRlcmVyLkRyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcigwLCAwLCAxMDAsIDEwMCwgSW5wdXQubW91c2VYLCBJbnB1dC5tb3VzZVksIENvbG9yLlJFRCwgQ29sb3IuR1JFRU4sIENvbG9yLkJMVUUpO1xyXG59Il19
