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
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.GameObject = void 0;
var Transfrom_1 = require("./Transfrom");
var GameObject = /** @class */ (function () {
    function GameObject(name) {
        this.tag = "Untagged"; // 添加标签属性
        this.layer = 0; // 默认层
        this.components = [];
        this.startedComponents = new Set();
        this._active = true;
        this.name = name;
        this.transform = new Transfrom_1.Transform(this);
    }
    Object.defineProperty(GameObject.prototype, "active", {
        // 检查游戏对象是否处于活动状态（考虑父对象）
        get: function () {
            if (!this._active)
                return false;
            // 检查父对象的激活状态
            var parent = this.transform.parent;
            while (parent) {
                var parentGameObject = parent.gameObject;
                if (parentGameObject && !parentGameObject.active) {
                    return false;
                }
                parent = parent.parent;
            }
            return true;
        },
        // 设置游戏对象的激活状态
        set: function (value) {
            if (this._active !== value) {
                this._active = value;
                // 处理组件的启用/禁用
                for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                    var component = _a[_i];
                    if (value) {
                        component.onEnable();
                    }
                    else {
                        component.onDisable();
                    }
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    // 调用所有组件的Start方法（如果尚未调用）
    GameObject.prototype.startComponents = function () {
        if (!this.active)
            return;
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (!this.startedComponents.has(component) && component.enabled) {
                component.start();
                this.startedComponents.add(component);
            }
        }
        // 递归调用子对象的startComponents
        for (var _b = 0, _c = this.transform.children; _b < _c.length; _b++) {
            var child = _c[_b];
            if (child.gameObject) {
                child.gameObject.startComponents();
            }
        }
    };
    // 更新所有组件
    GameObject.prototype.updateComponents = function () {
        if (!this.active)
            return;
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.enabled) {
                component.update();
            }
        }
        // 递归调用子对象的updateComponents
        for (var _b = 0, _c = this.transform.children; _b < _c.length; _b++) {
            var child = _c[_b];
            if (child.gameObject) {
                child.gameObject.updateComponents();
            }
        }
    };
    // 添加组件
    GameObject.prototype.addComponent = function (type) {
        var comp = this.getComponent(type);
        if (comp == null) {
            comp = new type(this);
            this.components.push(comp);
        }
        return comp;
    };
    // 获取指定类型的组件
    GameObject.prototype.getComponent = function (componentType) {
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component instanceof componentType) {
                return component;
            }
        }
        return null;
    };
    // 获取所有指定类型的组件
    GameObject.prototype.getComponents = function (componentType) {
        var result = [];
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component instanceof componentType) {
                result.push(component);
            }
        }
        return result;
    };
    // 获取子节点上的组件
    GameObject.prototype.getComponentInChildren = function (type) {
        // 先检查自身
        var comp = this.getComponent(type);
        if (comp != null) {
            return comp;
        }
        // 遍历所有子节点
        for (var _i = 0, _a = this.transform.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childGameObject = child.gameObject;
            if (childGameObject) {
                var childComp = childGameObject.getComponent(type);
                if (childComp != null) {
                    return childComp;
                }
                // 递归检查子节点的子节点
                var deepChildComp = childGameObject.getComponentInChildren(type);
                if (deepChildComp != null) {
                    return deepChildComp;
                }
            }
        }
        return null;
    };
    // 获取子节点上的所有组件
    GameObject.prototype.getComponentsInChildren = function (type) {
        var result = [];
        // 添加自身的组件
        result.push.apply(result, this.getComponents(type));
        // 遍历所有子节点
        for (var _i = 0, _a = this.transform.children; _i < _a.length; _i++) {
            var child = _a[_i];
            // 假设每个Transform都有对应的GameObject
            var childGameObject = child.gameObject;
            if (childGameObject) {
                // 递归获取子节点的所有组件
                result.push.apply(result, childGameObject.getComponentsInChildren(type));
            }
        }
        return result;
    };
    // 移除组件
    GameObject.prototype.removeComponent = function (type) {
        var index = this.components.findIndex(function (component) { return component instanceof type; });
        if (index !== -1) {
            var component = this.components[index];
            component.onDestroy();
            this.components.splice(index, 1);
            return true;
        }
        return false;
    };
    // 静态方法：通过名称查找GameObject
    GameObject.find = function (name) {
        // 实现查找逻辑
        // 这需要一个全局的GameObject注册表
        return null;
    };
    // 静态方法：通过标签查找第一个GameObject
    GameObject.findWithTag = function (tag) {
        // 实现查找逻辑
        // 这需要一个标签系统
        return null;
    };
    // 静态方法：通过标签查找所有GameObject
    GameObject.findGameObjectsWithTag = function (tag) {
        // 实现查找逻辑
        return [];
    };
    // 静态方法：查找特定类型的第一个组件
    GameObject.findObjectOfType = function (type) {
        // 实现查找逻辑
        return null;
    };
    // 静态方法：查找特定类型的所有组件
    GameObject.findObjectsOfType = function (type) {
        // 实现查找逻辑
        return [];
    };
    // 静态方法：实例化游戏对象
    GameObject.instantiate = function (original, position, rotation) {
        // 创建新的游戏对象
        var clone = new GameObject(original.name);
        // 复制属性
        clone.tag = original.tag;
        clone.layer = original.layer;
        clone.active = original.active;
        // 设置位置和旋转（如果提供）
        if (position) {
            clone.transform.position = position;
        }
        if (rotation) {
            clone.transform.rotation = rotation;
        }
        // 复制组件（这需要一个深度复制机制）
        return clone;
    };
    // 销毁游戏对象
    GameObject.prototype.destroy = function () {
        // 调用所有组件的onDestroy方法
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            component.onDestroy();
        }
        // 这里可以添加从场景中移除游戏对象的逻辑
    };
    return GameObject;
}());
exports.GameObject = GameObject;
},{"./Transfrom":13}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Input = void 0;
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.mouseX = 0;
    Input.mouseY = 0;
    Input.deltaY = 0;
    return Input;
}());
exports.Input = Input;
},{}],5:[function(require,module,exports){
"use strict";
var _a;
exports.__esModule = true;
exports.Logger = void 0;
var LogType;
(function (LogType) {
    LogType[LogType["Info"] = 0] = "Info";
    LogType[LogType["Warning"] = 1] = "Warning";
    LogType[LogType["Error"] = 2] = "Error";
})(LogType || (LogType = {}));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.printLogs = function (ctx) {
        for (var i = 0; i < this.logs.length; i++) {
            var log = this.logs[i];
            ctx.fillStyle = Logger.logColors[log.type];
            ctx.fillText(log.message, 10, 20 + i * 15);
        }
        this.logs = [];
    };
    Logger.log = function (message, duration) {
        this.push(message, LogType.Info, duration);
    };
    Logger.warning = function (message, duration) {
        this.push(message, LogType.Warning, duration);
    };
    Logger.error = function (message, duration) {
        this.push(message, LogType.Error, duration);
    };
    Logger.push = function (message, type, duration) {
        var log = {
            message: message,
            type: type,
            duration: duration !== null && duration !== void 0 ? duration : 0
        };
        this.logs.push(log);
    };
    Logger.logs = [];
    Logger.logColors = (_a = {},
        _a[LogType.Info] = 'white',
        _a[LogType.Warning] = 'orange',
        _a[LogType.Error] = 'red',
        _a);
    return Logger;
}());
exports.Logger = Logger;
},{}],6:[function(require,module,exports){
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
},{"./Quaternion":7,"./Vector3":9,"./Vector4":10}],7:[function(require,module,exports){
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
},{"./Matrix4x4":6,"./Vector3":9}],8:[function(require,module,exports){
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
},{"./Vector3":9,"./Vector4":10}],9:[function(require,module,exports){
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
},{"./Vector2":8,"./Vector4":10}],10:[function(require,module,exports){
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
},{"./Vector2":8,"./Vector3":9}],11:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.Scene = void 0;
var Scene = /** @class */ (function () {
    function Scene(name) {
        this.rootGameObjects = [];
        this.name = name;
    }
    Scene.prototype.addGameObject = function (gameObject) {
        this.rootGameObjects.push(gameObject);
    };
    Scene.prototype.removeGameObject = function (gameObject) {
        var index = this.rootGameObjects.indexOf(gameObject);
        if (index !== -1) {
            this.rootGameObjects.splice(index, 1);
        }
    };
    Scene.prototype.getRootGameObjects = function () {
        return __spreadArrays(this.rootGameObjects);
    };
    Scene.prototype.update = function () {
        // 更新所有根游戏对象及其子对象
        for (var _i = 0, _a = this.rootGameObjects; _i < _a.length; _i++) {
            var gameObject = _a[_i];
            gameObject.startComponents();
            gameObject.updateComponents();
        }
    };
    return Scene;
}());
exports.Scene = Scene;
},{}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.SceneManager = void 0;
var Scene_1 = require("./Scene");
var SceneManager = /** @class */ (function () {
    function SceneManager() {
        this.scenes = new Map();
        this.activeScene = null;
    }
    Object.defineProperty(SceneManager, "instance", {
        get: function () {
            if (!SceneManager._instance) {
                SceneManager._instance = new SceneManager();
            }
            return SceneManager._instance;
        },
        enumerable: false,
        configurable: true
    });
    SceneManager.prototype.createScene = function (name) {
        var scene = new Scene_1.Scene(name);
        this.scenes.set(name, scene);
        return scene;
    };
    SceneManager.prototype.getScene = function (name) {
        return this.scenes.get(name);
    };
    SceneManager.prototype.setActiveScene = function (scene) {
        if (typeof scene === 'string') {
            var foundScene = this.scenes.get(scene);
            if (foundScene) {
                this.activeScene = foundScene;
            }
        }
        else {
            this.activeScene = scene;
        }
    };
    SceneManager.prototype.getActiveScene = function () {
        return this.activeScene;
    };
    SceneManager.prototype.updateActiveScene = function () {
        if (this.activeScene) {
            this.activeScene.update();
        }
    };
    return SceneManager;
}());
exports.SceneManager = SceneManager;
},{"./Scene":11}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Transform = void 0;
var Matrix4x4_1 = require("./Math/Matrix4x4");
var Quaternion_1 = require("./Math/Quaternion");
var Vector3_1 = require("./Math/Vector3");
var Vector4_1 = require("./Math/Vector4");
var Transform = /** @class */ (function () {
    function Transform(gameObject) {
        this._parent = null;
        this.gameObject = gameObject;
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
},{"./Math/Matrix4x4":6,"./Math/Quaternion":7,"./Math/Vector3":9,"./Math/Vector4":10}],14:[function(require,module,exports){
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
    AssetLoader.loadModel = function (name, modelPath, scale, reverse) {
        if (scale === void 0) { scale = 1; }
        if (reverse === void 0) { reverse = false; }
        return __awaiter(this, void 0, void 0, function () {
            var model, objDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = null;
                        return [4 /*yield*/, AssetLoader.loadTextFile(modelPath)];
                    case 1:
                        objDoc = _a.sent();
                        if (objDoc != null) {
                            model = ObjParser_1.OBJParser.parseOBJ(objDoc);
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
                        return [2 /*return*/, model];
                }
            });
        });
    };
    AssetLoader.fileCache = new Dictionary_1.Dictionary();
    return AssetLoader;
}());
exports.AssetLoader = AssetLoader;
},{"./Dictionary":15,"./ObjParser":16}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"../Math/Vector2":8,"../Math/Vector3":9}],17:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Config_1 = require("./Config");
var Logger_1 = require("./Logger");
var SceneManager_1 = require("./Scene/SceneManager");
//import { RasterizationPipeline } from "./RasterizationPipeline";
var Input_1 = require("./Input");
var AssetLoader_1 = require("./Utils/AssetLoader");
var GameObject_1 = require("./GameObject");
var Vector3_1 = require("./Math/Vector3");
//import { Camera } from "./Component/Camera";
//import { Renderer } from "./Component/Renderer";
//import { MeshRenderer } from "./Component/MeshRenderer";
//import { ObjRotate } from "./Component/ObjRotate";
var Color_1 = require("./Color");
// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取canvas元素和2D渲染上下文
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // 设置canvas尺寸
    canvas.width = Config_1.Config.canvasWidth;
    canvas.height = Config_1.Config.canvasHeight;
    // 设置文本样式
    ctx.font = 'Arial';
    ctx.textAlign = 'left';
    // 创建图像数据对象
    var imageData = ctx.createImageData(Config_1.Config.canvasWidth, Config_1.Config.canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    var uint32View = new Uint32Array(imageData.data.buffer);
    // 创建渲染器实例
    var pipeline = new RasterizationPipeline(uint32View);
    Init();
    // 渲染函数
    function mainLoop() {
        // 处理逻辑
        Update();
        // 渲染
        Render(pipeline);
        // 将图像数据绘制到canvas上
        ctx.putImageData(imageData, 0, 0);
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
        // 屏幕输出日志
        Logger_1.Logger.printLogs(ctx);
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
document.addEventListener('wheel', function (event) {
    Input_1.Input.deltaY = event.deltaY;
    console.log(event.deltaY);
});
document.addEventListener('scrollend', function (event) {
    Input_1.Input.deltaY = 0;
});
function Init() {
    // 初始化场景
    var mainScene = SceneManager_1.SceneManager.instance.createScene("MainScene");
    SceneManager_1.SceneManager.instance.setActiveScene(mainScene);
    // 相机
    var camera = new GameObject_1.GameObject("camera");
    mainScene.addGameObject(camera);
    camera.addComponent(Camera);
    var lee;
    // 加载模型
    AssetLoader_1.AssetLoader.loadModel('lee', 'resources/assets/meshes/lee.obj').then(function (model) {
        lee = new GameObject_1.GameObject("lee");
        lee.transform.position = new Vector3_1.Vector3(0, 0, 2);
        var renderer = lee.addComponent(MeshRenderer);
        renderer.mesh = model;
        lee.addComponent(ObjRotate);
        mainScene.addGameObject(lee);
    });
    AssetLoader_1.AssetLoader.loadModel('cube', 'resources/cube.obj').then(function (model) {
        var cube = new GameObject_1.GameObject("cube");
        cube.transform.position = new Vector3_1.Vector3(2, 0, 0);
        cube.transform.scale = new Vector3_1.Vector3(0.1, 0.1, 0.1);
        var renderer = cube.addComponent(MeshRenderer);
        renderer.mesh = model;
        cube.addComponent(ObjRotate);
        cube.transform.setParent(lee.transform, false);
    });
}
function Update() {
    var _a;
    // 使用场景的update方法更新所有游戏对象
    (_a = SceneManager_1.SceneManager.instance.getActiveScene()) === null || _a === void 0 ? void 0 : _a.update();
}
function Render(pipeline) {
    var _a;
    pipeline.Clear(Color_1.Color.BLACK);
    // 获取场景中的所有根游戏对象并渲染
    var rootObjects = (_a = SceneManager_1.SceneManager.instance.getActiveScene()) === null || _a === void 0 ? void 0 : _a.getRootGameObjects();
    if (rootObjects) {
        for (var _i = 0, rootObjects_1 = rootObjects; _i < rootObjects_1.length; _i++) {
            var gameObject = rootObjects_1[_i];
            var renders = gameObject.getComponentsInChildren(Renderer);
            for (var _b = 0, renders_1 = renders; _b < renders_1.length; _b++) {
                var render = renders_1[_b];
                pipeline.DrawObject(render);
                Logger_1.Logger.log(render.gameObject.name);
            }
        }
    }
}
},{"./Color":1,"./Config":2,"./GameObject":3,"./Input":4,"./Logger":5,"./Math/Vector3":9,"./Scene/SceneManager":12,"./Utils/AssetLoader":14}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvQ29uZmlnLnRzIiwic3JjL0dhbWVPYmplY3QudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTG9nZ2VyLnRzIiwic3JjL01hdGgvTWF0cml4NHg0LnRzIiwic3JjL01hdGgvUXVhdGVybmlvbi50cyIsInNyYy9NYXRoL1ZlY3RvcjIudHMiLCJzcmMvTWF0aC9WZWN0b3IzLnRzIiwic3JjL01hdGgvVmVjdG9yNC50cyIsInNyYy9TY2VuZS9TY2VuZS50cyIsInNyYy9TY2VuZS9TY2VuZU1hbmFnZXIudHMiLCJzcmMvVHJhbnNmcm9tLnRzIiwic3JjL1V0aWxzL0Fzc2V0TG9hZGVyLnRzIiwic3JjL1V0aWxzL0RpY3Rpb25hcnkudHMiLCJzcmMvVXRpbHMvT2JqUGFyc2VyLnRzIiwic3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7SUFrQkksZUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFlO1FBQWYsa0JBQUEsRUFBQSxPQUFlO1FBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVNLHdCQUFRLEdBQWY7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDbkMsT0FBTyxJQUFJLEtB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TUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLDRCQUFRLEdBQWYsVUFBZ0IsQ0FBWTtRQUN4QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxnQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUU3QixnREFBZ0Q7SUFDaEQsZ0dBQWdHO0lBQ2hHLGdEQUFnRDtJQUVoRCxtRkFBbUY7SUFDbkYsSUFBSTtJQUVHLDZCQUFTLEdBQWhCO1FBQ0ksc0JBQXNCO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7UUFDN0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsMkJBQTJCO1lBQ3ZDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNKO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFDSSxpRUFBaUU7UUFDakUsZ0NBQWdDO1FBQ2hDLGdEQUFnRDtRQUNoRCxZQUFZO1FBRVosSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxD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LENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVMsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxD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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM1RCxlQUFlO1NBQ2xCO1FBRUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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O1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHFDQUEyQixHQUF6QyxVQUEwQyxDQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxD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QUFvQyxLQUFhLEVBQUUsSUFBYTtRQUM1RCxJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QixLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQzlCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2QsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ1QsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRWEsd0JBQWMsR0FBNUIsVUFBNkIsQ0FBVTtRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFD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MkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVcsRUFBRTtZQUFqQyxJQUFNLFVBQVUsb0JBQUE7WUFDakIsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLHVCQUF1QixDQUFXLFFBQWUsQ0FBQyxDQUFDO1lBQzlFLEtBQXFCLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTyxFQUFFO2dCQUF6QixJQUFNLE1BQU0sZ0JBQUE7Z0JBQ2IsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUIsZUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RDO1NBQ0o7S0FDSjtBQUNMLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBXSElURSA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTEFDSyA9IG5ldyBDb2xvcigwLCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkFZID0gbmV3IENvbG9yKDEyOCwgMTI4LCAxMjgpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFRCA9IG5ldyBDb2xvcigyNTUsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSRUVOID0gbmV3IENvbG9yKDAsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxVRSA9IG5ldyBDb2xvcigwLCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFlFTExPVyA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1lBTiA9IG5ldyBDb2xvcigwLCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFHRU5UQSA9IG5ldyBDb2xvcigyNTUsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT1JBTkdFID0gbmV3IENvbG9yKDI1NSwgMTY1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVVJQTEUgPSBuZXcgQ29sb3IoMTI4LCAwLCAxMjgpLlRvVWludDMyKCk7XHJcblxyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG4gICAgcHVibGljIGE6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgPSAyNTUpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUb1VpbnQzMigpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuYSA8PCAyNCkgfCAodGhpcy5iIDw8IDE2KSB8ICh0aGlzLmcgPDwgOCkgfCB0aGlzLnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGcm9tVWludDMyKHVpbnQzMjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgdWludDMyICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiA4KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMTYpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAyNCkgJiAweEZGXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb25maWcge1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXNXaWR0aDogbnVtYmVyID0gNDAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXNIZWlnaHQ6IG51bWJlciA9IDQwMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFsZkNhbnZhc1dpZHRoOiBudW1iZXIgPSBDb25maWcuY2FudmFzV2lkdGggPj4gMTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFsZkNhbnZhc0hlaWdodDogbnVtYmVyID0gQ29uZmlnLmNhbnZhc0hlaWdodCA+PiAxO1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3BlY3RSYXRpbzogbnVtYmVyID0gQ29uZmlnLmNhbnZhc1dpZHRoIC8gQ29uZmlnLmNhbnZhc0hlaWdodDtcclxufSIsImltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZnJvbVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnQvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHB1YmxpYyB0YWc6IHN0cmluZyA9IFwiVW50YWdnZWRcIjsgLy8g5re75Yqg5qCH562+5bGe5oCnXHJcbiAgICBwdWJsaWMgbGF5ZXI6IG51bWJlciA9IDA7IC8vIOm7mOiupOWxglxyXG5cclxuICAgIHByaXZhdGUgY29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhcnRlZENvbXBvbmVudHM6IFNldDxDb21wb25lbnQ+ID0gbmV3IFNldDxDb21wb25lbnQ+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0odGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8vIOiuvue9rua4uOaIj+WvueixoeeahOa/gOa0u+eKtuaAgVxyXG4gICAgcHVibGljIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWkhOeQhue7hOS7tueahOWQr+eUqC/npoHnlKhcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub25FbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm9uRGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g5qOA5p+l5ri45oiP5a+56LGh5piv5ZCm5aSE5LqO5rS75Yqo54q25oCB77yI6ICD6JmR54i25a+56LGh77yJXHJcbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAvLyDmo4Dmn6XniLblr7nosaHnmoTmv4DmtLvnirbmgIFcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50cmFuc2Zvcm0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50R2FtZU9iamVjdCA9IHBhcmVudC5nYW1lT2JqZWN0O1xyXG4gICAgICAgICAgICBpZiAocGFyZW50R2FtZU9iamVjdCAmJiAhcGFyZW50R2FtZU9iamVjdC5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6LCD55So5omA5pyJ57uE5Lu255qEU3RhcnTmlrnms5XvvIjlpoLmnpzlsJrmnKrosIPnlKjvvIlcclxuICAgIHB1YmxpYyBzdGFydENvbXBvbmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWRDb21wb25lbnRzLmhhcyhjb21wb25lbnQpICYmIGNvbXBvbmVudC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRlZENvbXBvbmVudHMuYWRkKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOmAkuW9kuiwg+eUqOWtkOWvueixoeeahHN0YXJ0Q29tcG9uZW50c1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmdhbWVPYmplY3Quc3RhcnRDb21wb25lbnRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5pu05paw5omA5pyJ57uE5Lu2XHJcbiAgICBwdWJsaWMgdXBkYXRlQ29tcG9uZW50cygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YCS5b2S6LCD55So5a2Q5a+56LGh55qEdXBkYXRlQ29tcG9uZW50c1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmdhbWVPYmplY3QudXBkYXRlQ29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOa3u+WKoOe7hOS7tlxyXG4gICAgcHVibGljIGFkZENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7IG5ldyhnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogVCB9KTogVCB7XHJcbiAgICAgICAgdmFyIGNvbXAgPSB0aGlzLmdldENvbXBvbmVudCh0eXBlKTtcclxuICAgICAgICBpZiAoY29tcCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbXAgPSBuZXcgdHlwZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21wO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluaMh+Wumuexu+Wei+eahOe7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBuZXcgKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpID0+IFQpOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IGFzIFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5omA5pyJ5oyH5a6a57G75Z6L55qE57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50czxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBuZXcgKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpID0+IFQpOiBUW10ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVFtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjb21wb25lbnQgYXMgVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blrZDoioLngrnkuIrnmoTnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IHsgbmV3KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiBUIH0pOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5YWI5qOA5p+l6Ieq6LqrXHJcbiAgICAgICAgY29uc3QgY29tcCA9IHRoaXMuZ2V0Q29tcG9uZW50KHR5cGUpO1xyXG4gICAgICAgIGlmIChjb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR2FtZU9iamVjdCA9IGNoaWxkLmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZEdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkQ29tcCA9IGNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnQodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRDb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRDb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOmAkuW9kuajgOafpeWtkOiKgueCueeahOWtkOiKgueCuVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVlcENoaWxkQ29tcCA9IGNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnRJbkNoaWxkcmVuKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlZXBDaGlsZENvbXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2hpbGRDb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blrZDoioLngrnkuIrnmoTmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzSW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7IG5ldyhnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogVCB9KTogVFtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDmt7vliqDoh6rouqvnmoTnu4Tku7ZcclxuICAgICAgICByZXN1bHQucHVzaCguLi50aGlzLmdldENvbXBvbmVudHModHlwZSkpO1xyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuavj+S4qlRyYW5zZm9ybemDveacieWvueW6lOeahEdhbWVPYmplY3RcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHYW1lT2JqZWN0ID0gY2hpbGQuZ2FtZU9iamVjdDtcclxuICAgICAgICAgICAgaWYgKGNoaWxkR2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgLy8g6YCS5b2S6I635Y+W5a2Q6IqC54K555qE5omA5pyJ57uE5Lu2XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4odHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOenu+mZpOe7hOS7tlxyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7IG5ldyhnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogVCB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmNvbXBvbmVudHMuZmluZEluZGV4KGNvbXBvbmVudCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiB0eXBlKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5vbkRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5ZCN56ew5p+l5om+R2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kKG5hbWU6IHN0cmluZyk6IEdhbWVPYmplY3QgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICAvLyDov5npnIDopoHkuIDkuKrlhajlsYDnmoRHYW1lT2JqZWN05rOo5YaM6KGoXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5qCH562+5p+l5om+56ys5LiA5LiqR2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kV2l0aFRhZyh0YWc6IHN0cmluZyk6IEdhbWVPYmplY3QgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICAvLyDov5npnIDopoHkuIDkuKrmoIfnrb7ns7vnu59cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4fmoIfnrb7mn6Xmib7miYDmnIlHYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRHYW1lT2JqZWN0c1dpdGhUYWcodGFnOiBzdHJpbmcpOiBHYW1lT2JqZWN0W10ge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrmn6Xmib7nibnlrprnsbvlnovnmoTnrKzkuIDkuKrnu4Tku7ZcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZE9iamVjdE9mVHlwZTxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8muafpeaJvueJueWumuexu+Wei+eahOaJgOaciee7hOS7tlxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kT2JqZWN0c09mVHlwZTxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVFtdIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya5a6e5L6L5YyW5ri45oiP5a+56LGhXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKG9yaWdpbmFsOiBHYW1lT2JqZWN0LCBwb3NpdGlvbj86IFZlY3RvcjMsIHJvdGF0aW9uPzogUXVhdGVybmlvbik6IEdhbWVPYmplY3Qge1xyXG4gICAgICAgIC8vIOWIm+W7uuaWsOeahOa4uOaIj+WvueixoVxyXG4gICAgICAgIGNvbnN0IGNsb25lID0gbmV3IEdhbWVPYmplY3Qob3JpZ2luYWwubmFtZSk7XHJcblxyXG4gICAgICAgIC8vIOWkjeWItuWxnuaAp1xyXG4gICAgICAgIGNsb25lLnRhZyA9IG9yaWdpbmFsLnRhZztcclxuICAgICAgICBjbG9uZS5sYXllciA9IG9yaWdpbmFsLmxheWVyO1xyXG4gICAgICAgIGNsb25lLmFjdGl2ZSA9IG9yaWdpbmFsLmFjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8g6K6+572u5L2N572u5ZKM5peL6L2s77yI5aaC5p6c5o+Q5L6b77yJXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnRyYW5zZm9ybS5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnRyYW5zZm9ybS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5aSN5Yi257uE5Lu277yI6L+Z6ZyA6KaB5LiA5Liq5rex5bqm5aSN5Yi25py65Yi277yJXHJcblxyXG4gICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDplIDmr4HmuLjmiI/lr7nosaFcclxuICAgIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOiwg+eUqOaJgOaciee7hOS7tueahG9uRGVzdHJveeaWueazlVxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBjb21wb25lbnQub25EZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOi/memHjOWPr+S7pea3u+WKoOS7juWcuuaZr+S4reenu+mZpOa4uOaIj+WvueixoeeahOmAu+i+kVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIElucHV0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VYOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVk6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRlbHRhWTogbnVtYmVyID0gMDtcclxufSIsImVudW0gTG9nVHlwZSB7XHJcbiAgICBJbmZvLFxyXG4gICAgV2FybmluZyxcclxuICAgIEVycm9yLFxyXG59XHJcblxyXG5pbnRlcmZhY2UgSUxvZyB7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBMb2dUeXBlO1xyXG4gICAgZHVyYXRpb246IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dzOiBJTG9nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBsb2dDb2xvcnMgPSB7XHJcbiAgICAgICAgW0xvZ1R5cGUuSW5mb106ICd3aGl0ZScsXHJcbiAgICAgICAgW0xvZ1R5cGUuV2FybmluZ106ICdvcmFuZ2UnLFxyXG4gICAgICAgIFtMb2dUeXBlLkVycm9yXTogJ3JlZCdcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHByaW50TG9ncyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IHRoaXMubG9nc1tpXTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IExvZ2dlci5sb2dDb2xvcnNbbG9nLnR5cGVdO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobG9nLm1lc3NhZ2UsIDEwLCAyMCArIGkgKiAxNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9ncyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2cobWVzc2FnZTogc3RyaW5nLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucHVzaChtZXNzYWdlLCBMb2dUeXBlLkluZm8sIGR1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgd2FybmluZyhtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UsIExvZ1R5cGUuV2FybmluZywgZHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UsIExvZ1R5cGUuRXJyb3IsIGR1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwdXNoKG1lc3NhZ2U6IHN0cmluZywgdHlwZTogTG9nVHlwZSwgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsb2c6IElMb2cgPSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbiA/PyAwLFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ3MucHVzaChsb2cpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL1F1YXRlcm5pb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXg0eDQge1xyXG5cclxuICAgIHB1YmxpYyBtYXRyaXg6IEFycmF5PEFycmF5PG51bWJlcj4+ID0gbmV3IEFycmF5PEFycmF5PG51bWJlcj4+KCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29sdW1uMDogVmVjdG9yNCwgY29sdW1uMTogVmVjdG9yNCwgY29sdW1uMjogVmVjdG9yNCwgY29sdW1uMzogVmVjdG9yNCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgPSBhcmd1bWVudHNbaV0gYXMgVmVjdG9yNDtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2ldID0gbmV3IEFycmF5PG51bWJlcj4odi54LCB2LnksIHYueiwgdi53KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2ldID0gbmV3IEFycmF5PG51bWJlcj4oMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDooYxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFJvdyhpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLm1hdHJpeFtpbmRleF07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KGNbMF0sIGNbMV0sIGNbMl0sIGNbM10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg5YiXXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb2x1bW4oaW5kZXg6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCh0aGlzLm1hdHJpeFswXVtpbmRleF0sIHRoaXMubWF0cml4WzFdW2luZGV4XSwgdGhpcy5tYXRyaXhbMl1baW5kZXhdLCB0aGlzLm1hdHJpeFszXVtpbmRleF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTZXRSb3coaW5kZXg6IG51bWJlciwgcm93OiBWZWN0b3I0KSB7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzBdID0gcm93Lng7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzFdID0gcm93Lnk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzJdID0gcm93Lno7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzNdID0gcm93Lnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldENvbHVtbihpbmRleDogbnVtYmVyLCBjb2x1bW46IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFswXVtpbmRleF0gPSBjb2x1bW4ueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFsxXVtpbmRleF0gPSBjb2x1bW4ueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFsyXVtpbmRleF0gPSBjb2x1bW4uejtcclxuICAgICAgICB0aGlzLm1hdHJpeFszXVtpbmRleF0gPSBjb2x1bW4udztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkobTogTWF0cml4NHg0KTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbGhzID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHJocyA9IG0ubWF0cml4O1xyXG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgTWF0cml4NHg0KCkubWF0cml4O1xyXG5cclxuICAgICAgICBtYXRyaXhbMF1bMF0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMF1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzBdWzFdID0gbGhzWzBdWzBdICogcmhzWzBdWzFdICsgbGhzWzBdWzFdICogcmhzWzFdWzFdICsgbGhzWzBdWzJdICogcmhzWzJdWzFdICsgbGhzWzBdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFswXVsyXSA9IGxoc1swXVswXSAqIHJoc1swXVsyXSArIGxoc1swXVsxXSAqIHJoc1sxXVsyXSArIGxoc1swXVsyXSAqIHJoc1syXVsyXSArIGxoc1swXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMF1bM10gPSBsaHNbMF1bMF0gKiByaHNbMF1bM10gKyBsaHNbMF1bMV0gKiByaHNbMV1bM10gKyBsaHNbMF1bMl0gKiByaHNbMl1bM10gKyBsaHNbMF1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzFdWzBdID0gbGhzWzFdWzBdICogcmhzWzBdWzBdICsgbGhzWzFdWzFdICogcmhzWzFdWzBdICsgbGhzWzFdWzJdICogcmhzWzJdWzBdICsgbGhzWzFdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsxXSA9IGxoc1sxXVswXSAqIHJoc1swXVsxXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsxXSArIGxoc1sxXVsyXSAqIHJoc1syXVsxXSArIGxoc1sxXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMV1bMl0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMV1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzFdWzNdID0gbGhzWzFdWzBdICogcmhzWzBdWzNdICsgbGhzWzFdWzFdICogcmhzWzFdWzNdICsgbGhzWzFdWzJdICogcmhzWzJdWzNdICsgbGhzWzFdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFsyXVswXSA9IGxoc1syXVswXSAqIHJoc1swXVswXSArIGxoc1syXVsxXSAqIHJoc1sxXVswXSArIGxoc1syXVsyXSAqIHJoc1syXVswXSArIGxoc1syXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMl1bMV0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMl1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzJdWzJdID0gbGhzWzJdWzBdICogcmhzWzBdWzJdICsgbGhzWzJdWzFdICogcmhzWzFdWzJdICsgbGhzWzJdWzJdICogcmhzWzJdWzJdICsgbGhzWzJdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFsyXVszXSA9IGxoc1syXVswXSAqIHJoc1swXVszXSArIGxoc1syXVsxXSAqIHJoc1sxXVszXSArIGxoc1syXVsyXSAqIHJoc1syXVszXSArIGxoc1syXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbM11bMF0gPSBsaHNbM11bMF0gKiByaHNbMF1bMF0gKyBsaHNbM11bMV0gKiByaHNbMV1bMF0gKyBsaHNbM11bMl0gKiByaHNbMl1bMF0gKyBsaHNbM11bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzNdWzFdID0gbGhzWzNdWzBdICogcmhzWzBdWzFdICsgbGhzWzNdWzFdICogcmhzWzFdWzFdICsgbGhzWzNdWzJdICogcmhzWzJdWzFdICsgbGhzWzNdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFszXVsyXSA9IGxoc1szXVswXSAqIHJoc1swXVsyXSArIGxoc1szXVsxXSAqIHJoc1sxXVsyXSArIGxoc1szXVsyXSAqIHJoc1syXVsyXSArIGxoc1szXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbM11bM10gPSBsaHNbM11bMF0gKiByaHNbMF1bM10gKyBsaHNbM11bMV0gKiByaHNbMV1bM10gKyBsaHNbM11bMl0gKiByaHNbMl1bM10gKyBsaHNbM11bM10gKiByaHNbM11bM107XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVZlY3RvcjModjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHJlcy54ID0gbVswXVswXSAqIHYueCArIG1bMF1bMV0gKiB2LnkgKyBtWzBdWzJdICogdi56O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56O1xyXG4gICAgICAgIHJlcy56ID0gbVsyXVswXSAqIHYueCArIG1bMl1bMV0gKiB2LnkgKyBtWzJdWzJdICogdi56O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVZlY3RvcjQodjogVmVjdG9yNCk6IFZlY3RvcjQge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgVmVjdG9yNCgpO1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHJlcy54ID0gbVswXVswXSAqIHYueCArIG1bMF1bMV0gKiB2LnkgKyBtWzBdWzJdICogdi56ICsgbVswXVszXSAqIHYudztcclxuICAgICAgICByZXMueSA9IG1bMV1bMF0gKiB2LnggKyBtWzFdWzFdICogdi55ICsgbVsxXVsyXSAqIHYueiArIG1bMV1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2LnogKyBtWzJdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy53ID0gbVszXVswXSAqIHYueCArIG1bM11bMV0gKiB2LnkgKyBtWzNdWzJdICogdi56ICsgbVszXVszXSAqIHYudztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VHJhbnNsYXRlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKG1bMF1bM10sIG1bMV1bM10sIG1bMl1bM10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRSb3RhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAvLyAgICAgbGV0IG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgIC8vICAgICBsZXQgeCA9IE1hdGguYXRhbjIobWF0WzFdWzJdLCBtYXRbMl1bMl0pO1xyXG4gICAgLy8gICAgIGxldCB5ID0gTWF0aC5hdGFuMigtbWF0WzBdWzJdLCBNYXRoLnNxcnQobWF0WzFdWzJdICogbWF0WzFdWzJdICsgbWF0WzJdWzJdICogbWF0WzJdWzJdKSk7XHJcbiAgICAvLyAgICAgbGV0IHogPSBNYXRoLmF0YW4yKG1hdFswXVsxXSwgbWF0WzBdWzBdKTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHggLyBNYXRoLlBJICogMTgwLCB5IC8gTWF0aC5QSSAqIDE4MCwgeiAvIE1hdGguUEkgKiAxODApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSb3RhdGUoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgLy/kuIDlrpropoHojrflj5bnuq/lh4DnmoTml4vovaznn6npmLXvvIzljbPljrvpmaTnvKnmlL7lgI3njodcclxuICAgICAgICBsZXQgbWF0ID0gdGhpcy5nZXRSb3RhdGVNYXRyaXgoKS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHEgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICB2YXIgdHJhY2UgPSBtYXRbMF1bMF0gKyBtYXRbMV1bMV0gKyBtYXRbMl1bMl07IC8vIEkgcmVtb3ZlZCArIDEuMGY7IHNlZSBkaXNjdXNzaW9uIHdpdGggRXRoYW5cclxuICAgICAgICB2YXIgcyA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0cmFjZSA+IDApIHsvLyBJIGNoYW5nZWQgTV9FUFNJTE9OIHRvIDBcclxuICAgICAgICAgICAgcyA9IDAuNSAvIE1hdGguc3FydCh0cmFjZSArIDEuMCk7XHJcbiAgICAgICAgICAgIHEudyA9IDAuMjUgLyBzO1xyXG4gICAgICAgICAgICBxLnggPSAobWF0WzJdWzFdIC0gbWF0WzFdWzJdKSAqIHM7XHJcbiAgICAgICAgICAgIHEueSA9IChtYXRbMF1bMl0gLSBtYXRbMl1bMF0pICogcztcclxuICAgICAgICAgICAgcS56ID0gKG1hdFsxXVswXSAtIG1hdFswXVsxXSkgKiBzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtYXRbMF1bMF0gPiBtYXRbMV1bMV0gJiYgbWF0WzBdWzBdID4gbWF0WzJdWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFswXVswXSAtIG1hdFsxXVsxXSAtIG1hdFsyXVsyXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzJdWzFdIC0gbWF0WzFdWzJdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAwLjI1ICogcztcclxuICAgICAgICAgICAgICAgIHEueSA9IChtYXRbMF1bMV0gKyBtYXRbMV1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueiA9IChtYXRbMF1bMl0gKyBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRbMV1bMV0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzFdWzFdIC0gbWF0WzBdWzBdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMF1bMl0gLSBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IChtYXRbMF1bMV0gKyBtYXRbMV1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueSA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFsxXVsyXSArIG1hdFsyXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMl1bMl0gLSBtYXRbMF1bMF0gLSBtYXRbMV1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFsxXVswXSAtIG1hdFswXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFsxXVsyXSArIG1hdFsyXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSb3RhdGVNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9kZXYvc3JjL21hdGgvTWF0cml4NC5qc1xyXG4gICAgICAgIC8v5Zug5Li65peL6L2s55+p6Zi15q+U6L6D54m55q6K77yM5pyJ5pe25YCZ6KaB5Y2V54us5aSE55CG77yM5omA5pyJ5oul5pyJ5LiA5Liq5o+Q5Y+W5pa55rOVXHJcbiAgICAgICAgLy/mj5Dlj5bmlrnlvI/lvojnroDljZXvvIzlhYjojrflj5bnvKnmlL7lgLzvvIznhLblkI7liKnnlKjojrflj5bnvKnmlL7lgLznmoTljp/nkIbvvIzpgIblkJHpmaTljrvnvKnmlL7lgLzvvIzlsLHlvpfliLDnuq/lh4DnmoTml4vovaznn6npmLVcclxuICAgICAgICAvL+atpOaWueazleS4jeaUr+aMgeWPjeWwhOefqemYtVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIHZhciB0ZSA9IG1hdC5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuZ2V0U2NhbGUoKTtcclxuICAgICAgICB2YXIgc2NhbGVYID0gMSAvIHNjYWxlLng7XHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IDEgLyBzY2FsZS55O1xyXG4gICAgICAgIHZhciBzY2FsZVogPSAxIC8gc2NhbGUuejtcclxuXHJcbiAgICAgICAgdGVbMF1bMF0gPSBtZVswXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVsxXVswXSA9IG1lWzFdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzJdWzBdID0gbWVbMl1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbM11bMF0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVsxXSA9IG1lWzBdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzFdWzFdID0gbWVbMV1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMl1bMV0gPSBtZVsyXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVszXVsxXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzJdID0gbWVbMF1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbMV1bMl0gPSBtZVsxXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsyXVsyXSA9IG1lWzJdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzNdWzJdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bM10gPSAwO1xyXG4gICAgICAgIHRlWzFdWzNdID0gMDtcclxuICAgICAgICB0ZVsyXVszXSA9IDA7XHJcbiAgICAgICAgdGVbM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFdWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9kZXYvc3JjL21hdGgvTWF0cml4NC5qc1xyXG4gICAgICAgIC8v5LuO5peL6L2s55+p6Zi16YeM6I635Y+W5qyn5ouJ6KeSXHJcbiAgICAgICAgLy/lv4XpobvmmK/nuq/lh4DnmoTml4vovaznn6npmLVcclxuXHJcbiAgICAgICAgdmFyIGFuZ2xlID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRlID0gdGhpcy5nZXRSb3RhdGVNYXRyaXgoKS5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0xMSA9IHRlWzBdWzBdLCBtMTIgPSB0ZVswXVsxXSwgbTEzID0gdGVbMF1bMl07XHJcbiAgICAgICAgdmFyIG0yMSA9IHRlWzFdWzBdLCBtMjIgPSB0ZVsxXVsxXSwgbTIzID0gdGVbMV1bMl07XHJcbiAgICAgICAgdmFyIG0zMSA9IHRlWzJdWzBdLCBtMzIgPSB0ZVsyXVsxXSwgbTMzID0gdGVbMl1bMl07XHJcblxyXG4gICAgICAgIG0xMyA9IG0xMyA+IDEgPyAxIDogbTEzO1xyXG4gICAgICAgIG0xMyA9IG0xMyA8IC0xID8gLTEgOiBtMTM7XHJcbiAgICAgICAgYW5nbGUueSA9IE1hdGguYXNpbihtMTMpO1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMobTEzKSA8IDAuOTk5OTk5OSkge1xyXG4gICAgICAgICAgICBhbmdsZS54ID0gTWF0aC5hdGFuMigtbTIzLCBtMzMpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gTWF0aC5hdGFuMigtbTEyLCBtMTEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKG0zMiwgbTIyKTtcclxuICAgICAgICAgICAgYW5nbGUueiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoYW5nbGUueCAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnkgLyBNYXRoLlBJICogMTgwLCBhbmdsZS56IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHYgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2LnggPSBNYXRoLnNxcnQobVswXVswXSAqIG1bMF1bMF0gKyBtWzFdWzBdICogbVsxXVswXSArIG1bMl1bMF0gKiBtWzJdWzBdKTtcclxuICAgICAgICB2LnkgPSBNYXRoLnNxcnQobVswXVsxXSAqIG1bMF1bMV0gKyBtWzFdWzFdICogbVsxXVsxXSArIG1bMl1bMV0gKiBtWzJdWzFdKTtcclxuICAgICAgICB2LnogPSBNYXRoLnNxcnQobVswXVsyXSAqIG1bMF1bMl0gKyBtWzFdWzJdICogbVsxXVsyXSArIG1bMl1bMl0gKiBtWzJdWzJdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zcG9zZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtMSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIHZhciBtMiA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG0yWzBdWzBdID0gbTFbMF1bMF07IG0yWzBdWzFdID0gbTFbMV1bMF07IG0yWzBdWzJdID0gbTFbMl1bMF07IG0yWzBdWzNdID0gbTFbM11bMF07XHJcbiAgICAgICAgbTJbMV1bMF0gPSBtMVswXVsxXTsgbTJbMV1bMV0gPSBtMVsxXVsxXTsgbTJbMV1bMl0gPSBtMVsyXVsxXTsgbTJbMV1bM10gPSBtMVszXVsxXTtcclxuICAgICAgICBtMlsyXVswXSA9IG0xWzBdWzJdOyBtMlsyXVsxXSA9IG0xWzFdWzJdOyBtMlsyXVsyXSA9IG0xWzJdWzJdOyBtMlsyXVszXSA9IG0xWzNdWzJdO1xyXG4gICAgICAgIG0yWzNdWzBdID0gbTFbMF1bM107IG0yWzNdWzFdID0gbTFbMV1bM107IG0yWzNdWzJdID0gbTFbMl1bM107IG0yWzNdWzNdID0gbTFbM11bM107XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbTI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZShwb3M6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gTWF0cml4NHg0LmdldFRyYW5zbGF0ZU1hdHJpeChwb3MpO1xyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZShxOiBRdWF0ZXJuaW9uKTogTWF0cml4NHg0O1xyXG4gICAgcHVibGljIHJvdGF0ZShldWxlckFuZ2xlczogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgcm90YXRlKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKCkge1xyXG4gICAgICAgIGxldCBtID0gbmV3IE1hdHJpeDR4NCgpO1xyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgUXVhdGVybmlvbikge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUoczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgocyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9va0F0KHRhcmdldDogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy8gdG9kb1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8v6L2s5o2i5Yiw5pGE5b2x5py655yL5ZCR55qE55+p6Zi16YeMXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtVG9Mb29rQXRTcGFjZShleWU6IFZlY3RvcjMsIHRhcmdldFBvaW50OiBWZWN0b3IzLCB1cDogVmVjdG9yMyA9IFZlY3RvcjMuVVApOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v5LuO5ZOq6YeM55yL5ZCR5ZOq6YeM77yM5Lmf5Y+v5Lul55CG6Kej5Li65pGE5b2x5py66KeG6KeS77yM5Y2z6KeC5a+f56m66Ze0XHJcbiAgICAgICAgLy/oi6XopoHlj5jmjaLliLDmkYTlvbHmnLrnqbrpl7TvvIzlj6/ku6XlgYforr7mlbTkuKrop4Llr5/nqbrpl7Tku6XmkYTlvbHmnLrkvY3kuo7kuJbnlYzlnZDmoIfljp/ngrnvvIznhLblkI7lsIbmiYDmnInniankvZPmnJ3mkYTlvbHmnLrljp/lhYjlnKjkuJbnlYznqbrpl7TkuK3nmoTkvY3nva7lj43lkJHnp7vliqjljbPlj69cclxuICAgICAgICAvL+WcqOe6uOS4iueUu+S4i+WbvuWwsea4heaZsOS6hlxyXG5cclxuICAgICAgICAvL+eUseS6jum7mOiupOefqemYteaYr1NSVOmhuuW6j+e7hOaIkOeahOWPmOaNouepuumXtO+8jOimgemAhuWQke+8jOWImeaYr1RSU+eahOmhuuW6j++8jOWNs+WFiOenu+WKqOWQjuaXi+i9rFxyXG4gICAgICAgIC8vMS7lkJHlj43mlrnlkJHlubPnp7tcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShuZXcgVmVjdG9yMygtZXllLngsIC1leWUueSwgLWV5ZS56KSk7XHJcblxyXG4gICAgICAgIC8vMi7lkJHlj43mlrnlkJHml4vovaxcclxuICAgICAgICAvL+WFiOiOt+WPluaRhOW9seS4lueVjOmDqOWdkOagh+i9tFxyXG4gICAgICAgIHZhciB6QXhpcyA9IFZlY3RvcjMuZGlmZmVyZW5jZShleWUsIHRhcmdldFBvaW50KS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+WboOS4uuaIkeS7rOaYr+WPs+aJi+ezu+e7n++8jOimgeaxgljvvIzliJnlv4Xpobt65LmYeVxyXG4gICAgICAgIHZhciB4QXhpcyA9IFZlY3RvcjMuY3Jvc3ModXAsIHpBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICB2YXIgeUF4aXMgPSBWZWN0b3IzLmNyb3NzKHpBeGlzLCB4QXhpcykubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy/mnoTlu7rmkYTlvbHmnLrlj43mlrnlkJHml4vovaznn6npmLVcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoeEF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh5QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHpBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSkpO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZydXN0dW0obGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KChuZWFyICogMikgLyBybCwgMCwgKHJpZ2h0ICsgbGVmdCkgLyBybCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIChuZWFyICogMikgLyB0YiwgKHRvcCArIGJvdHRvbSkgLyB0YiwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyBmbiwgLShmYXIgKiBuZWFyICogMikgLyBmbiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0xLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3J0aG9ncmFwaGljKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBybCA9IChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgY29uc3QgdGIgPSAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGNvbnN0IGZuID0gKGZhciAtIG5lYXIpXHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgyIC8gcmwsIDAsIDAsIC0obGVmdCArIHJpZ2h0KSAvIHJsKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMiAvIHRiLCAwLCAtKHRvcCArIGJvdHRvbSkgLyB0YiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0yIC8gZm4sIC0oZmFyICsgbmVhcikgLyBmbiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDEpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwZXJzcGVjdGl2ZShmb3Y6IG51bWJlciwgYXNwZWN0OiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IGhmb3YgPSBmb3YgLyAxODAgKiBNYXRoLlBJIC8gMjtcclxuICAgICAgICBjb25zdCB0YW4gPSBNYXRoLnRhbihoZm92KTtcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDEgLyAoYXNwZWN0ICogdGFuKSwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDEgLyB0YW4sIDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtKGZhciArIG5lYXIpIC8gKGZhciAtIG5lYXIpLCAtKDIgKiBmYXIgKiBuZWFyKSAvIChmYXIgLSBuZWFyKSksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0xLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW52ZXJzZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBtYXQgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgY29uc3QgYTAwID0gbWF0WzBdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEwMSA9IG1hdFswXVsxXTtcclxuICAgICAgICBjb25zdCBhMDIgPSBtYXRbMF1bMl07XHJcbiAgICAgICAgY29uc3QgYTAzID0gbWF0WzBdWzNdO1xyXG4gICAgICAgIGNvbnN0IGExMCA9IG1hdFsxXVswXTtcclxuICAgICAgICBjb25zdCBhMTEgPSBtYXRbMV1bMV07XHJcbiAgICAgICAgY29uc3QgYTEyID0gbWF0WzFdWzJdO1xyXG4gICAgICAgIGNvbnN0IGExMyA9IG1hdFsxXVszXTtcclxuICAgICAgICBjb25zdCBhMjAgPSBtYXRbMl1bMF07XHJcbiAgICAgICAgY29uc3QgYTIxID0gbWF0WzJdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEyMiA9IG1hdFsyXVsyXTtcclxuICAgICAgICBjb25zdCBhMjMgPSBtYXRbMl1bM107XHJcbiAgICAgICAgY29uc3QgYTMwID0gbWF0WzNdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEzMSA9IG1hdFszXVsxXTtcclxuICAgICAgICBjb25zdCBhMzIgPSBtYXRbM11bMl07XHJcbiAgICAgICAgY29uc3QgYTMzID0gbWF0WzNdWzNdO1xyXG5cclxuICAgICAgICBjb25zdCBkZXQwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAxID0gYTAwICogYTEyIC0gYTAyICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMVxyXG4gICAgICAgIGNvbnN0IGRldDA0ID0gYTAxICogYTEzIC0gYTAzICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTJcclxuICAgICAgICBjb25zdCBkZXQwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGRldDEwID0gYTIxICogYTMzIC0gYTIzICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzJcclxuXHJcbiAgICAgICAgbGV0IGRldCA9IChkZXQwMCAqIGRldDExIC0gZGV0MDEgKiBkZXQxMCArIGRldDAyICogZGV0MDkgKyBkZXQwMyAqIGRldDA4IC0gZGV0MDQgKiBkZXQwNyArIGRldDA1ICogZGV0MDYpO1xyXG5cclxuICAgICAgICBpZiAoIWRldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTWF0cml4NHg0IGludmVyc2UgZmFpbGVkLCBkZXRlcm1pbmFudCBpcyAwXCIpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuXHJcbiAgICAgICAgbWF0WzBdWzBdID0gKGExMSAqIGRldDExIC0gYTEyICogZGV0MTAgKyBhMTMgKiBkZXQwOSkgKiBkZXRcclxuICAgICAgICBtYXRbMF1bMV0gPSAoLWEwMSAqIGRldDExICsgYTAyICogZGV0MTAgLSBhMDMgKiBkZXQwOSkgKiBkZXRcclxuICAgICAgICBtYXRbMF1bMl0gPSAoYTMxICogZGV0MDUgLSBhMzIgKiBkZXQwNCArIGEzMyAqIGRldDAzKSAqIGRldFxyXG4gICAgICAgIG1hdFswXVszXSA9ICgtYTIxICogZGV0MDUgKyBhMjIgKiBkZXQwNCAtIGEyMyAqIGRldDAzKSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVswXSA9ICgtYTEwICogZGV0MTEgKyBhMTIgKiBkZXQwOCAtIGExMyAqIGRldDA3KSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVsxXSA9IChhMDAgKiBkZXQxMSAtIGEwMiAqIGRldDA4ICsgYTAzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzJdID0gKC1hMzAgKiBkZXQwNSArIGEzMiAqIGRldDAyIC0gYTMzICogZGV0MDEpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzNdID0gKGEyMCAqIGRldDA1IC0gYTIyICogZGV0MDIgKyBhMjMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMF0gPSAoYTEwICogZGV0MTAgLSBhMTEgKiBkZXQwOCArIGExMyAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVsxXSA9ICgtYTAwICogZGV0MTAgKyBhMDEgKiBkZXQwOCAtIGEwMyAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVsyXSA9IChhMzAgKiBkZXQwNCAtIGEzMSAqIGRldDAyICsgYTMzICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzNdID0gKC1hMjAgKiBkZXQwNCArIGEyMSAqIGRldDAyIC0gYTIzICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzBdID0gKC1hMTAgKiBkZXQwOSArIGExMSAqIGRldDA3IC0gYTEyICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzFdID0gKGEwMCAqIGRldDA5IC0gYTAxICogZGV0MDcgKyBhMDIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMl0gPSAoLWEzMCAqIGRldDAzICsgYTMxICogZGV0MDEgLSBhMzIgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bM10gPSAoYTIwICogZGV0MDMgLSBhMjEgKiBkZXQwMSArIGEyMiAqIGRldDAwKSAqIGRldFxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9GbG9hdDMyTGlzdCgpOiBGbG9hdDMyTGlzdCB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICAvL+eUseS6jk9wZW5HTOaYr+WIl+W6j+WtmOWCqO+8jOaJgOS7pemcgOimgei9rOe9ruS4gOS4i+efqemYtVxyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgbVswXVswXSwgbVsxXVswXSwgbVsyXVswXSwgbVszXVswXSxcclxuICAgICAgICAgICAgbVswXVsxXSwgbVsxXVsxXSwgbVsyXVsxXSwgbVszXVsxXSxcclxuICAgICAgICAgICAgbVswXVsyXSwgbVsxXVsyXSwgbVsyXVsyXSwgbVszXVsyXSxcclxuICAgICAgICAgICAgbVswXVszXSwgbVsxXVszXSwgbVsyXVszXSwgbVszXVszXVxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygwKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMSksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDIpLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygzKSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUUlNNYXRyaXgocG9zOiBWZWN0b3IzLCBxdWF0OiBRdWF0ZXJuaW9uLCBzY2FsZTogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHRtID0gTWF0cml4NHg0LmdldFRyYW5zbGF0ZU1hdHJpeChwb3MpO1xyXG4gICAgICAgIGxldCBybSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24ocXVhdCk7XHJcbiAgICAgICAgbGV0IHNtID0gTWF0cml4NHg0LmdldFNjYWxlTWF0cml4KHNjYWxlKTtcclxuXHJcbiAgICAgICAgLy/lv4XpobvkuKXmoLzmjInnhaflhYhTY2FsZe+8jOWGjVJvdGF0Ze+8jOWGjVRyYW5zbGF0ZeeahOmhuuW6j++8jOWQpuWImeW+l+WIsOeahOe7k+aenOiCr+WumuaYr+S4jea7oeaEj+eahFxyXG4gICAgICAgIC8v5L6L5aaC5pyJ5LiA5LiqMVgx5q2j5pa55b2i5Zyo5Y6f54K577yM5oiR5Lus5oOz6KaB5b6X5Yiw5LiA5LiqMVgy77yM5bm25LiU5pac5ZCRNDXCsO+8jOiAjOS4lOemu+WdkOagh+WOn+eCuTHkuKrljZXkvY3lpIRcclxuICAgICAgICAvL+WmguaenOWFiOaXi+i9rO+8jOWGjee8qeaUvueahOivne+8jOaXi+i9rOaWueWQkeaYr+WvueS6hu+8jOS9huaYr+aIkeS7rOaYr+WwhuaXi+i9rOWQjjQ1wrDnmoTmraPmlrnlvaLnmoRZ6L205ouJ5Ly4MuWAje+8jOW+l+WIsOeahOaYr+S4gOS4quiiq+aLiemVv+eahOiPseW9olxyXG4gICAgICAgIC8v5aaC5p6c5YWI5bmz56e777yM5YaN5peL6L2s55qE6K+d77yM5Zug5Li65oiR5Lus5peL6L2s6YO95piv57uV552A5Z2Q5qCH5Y6f54K555qE77yM57uT5p6c6Ieq54S25piv5q2j5pa55b2i5LiN5piv6Ieq6Lqr5peL6L2sNDXCsO+8jOiAjOaYr+e7leedgOWOn+eCueaXi+i9rFxyXG4gICAgICAgIHJldHVybiB0bS5tdWx0aXBseShybS5tdWx0aXBseShzbSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VHJhbnNsYXRlTWF0cml4KHBvczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSAxOyBtWzBdWzFdID0gMDsgbVswXVsyXSA9IDA7IG1bMF1bM10gPSBwb3MueDtcclxuICAgICAgICBtWzFdWzBdID0gMDsgbVsxXVsxXSA9IDE7IG1bMV1bMl0gPSAwOyBtWzFdWzNdID0gcG9zLnk7XHJcbiAgICAgICAgbVsyXVswXSA9IDA7IG1bMl1bMV0gPSAwOyBtWzJdWzJdID0gMTsgbVsyXVszXSA9IHBvcy56O1xyXG4gICAgICAgIG1bM11bMF0gPSAwOyBtWzNdWzFdID0gMDsgbVszXVsyXSA9IDA7IG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24pOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBsZXQgbnVtID0gcS54ICogMjtcclxuICAgICAgICBsZXQgbnVtMiA9IHEueSAqIDI7XHJcbiAgICAgICAgbGV0IG51bTMgPSBxLnogKiAyO1xyXG4gICAgICAgIGxldCBudW00ID0gcS54ICogbnVtO1xyXG4gICAgICAgIGxldCBudW01ID0gcS55ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtNiA9IHEueiAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTcgPSBxLnggKiBudW0yO1xyXG4gICAgICAgIGxldCBudW04ID0gcS54ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtOSA9IHEueSAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTEwID0gcS53ICogbnVtO1xyXG4gICAgICAgIGxldCBudW0xMSA9IHEudyAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTEyID0gcS53ICogbnVtMztcclxuXHJcbiAgICAgICAgbVswXVswXSA9IDEgLSAobnVtNSArIG51bTYpO1xyXG4gICAgICAgIG1bMV1bMF0gPSBudW03ICsgbnVtMTI7XHJcbiAgICAgICAgbVsyXVswXSA9IG51bTggLSBudW0xMTtcclxuICAgICAgICBtWzNdWzBdID0gMDtcclxuICAgICAgICBtWzBdWzFdID0gbnVtNyAtIG51bTEyO1xyXG4gICAgICAgIG1bMV1bMV0gPSAxIC0gKG51bTQgKyBudW02KTtcclxuICAgICAgICBtWzJdWzFdID0gbnVtOSArIG51bTEwO1xyXG4gICAgICAgIG1bM11bMV0gPSAwO1xyXG4gICAgICAgIG1bMF1bMl0gPSBudW04ICsgbnVtMTE7XHJcbiAgICAgICAgbVsxXVsyXSA9IG51bTkgLSBudW0xMDtcclxuICAgICAgICBtWzJdWzJdID0gMSAtIChudW00ICsgbnVtNSk7XHJcbiAgICAgICAgbVszXVsyXSA9IDA7XHJcbiAgICAgICAgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGU6IFZlY3RvcjMsIG9yZGVyOiBzdHJpbmcgPSBcIlhZWlwiKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL+mAmui/h+asp+aLieinkuiOt+WPluaXi+i9rOefqemYtVxyXG4gICAgICAgIC8v5YWI5YiG5Yir6I635Y+WWFla6L205LiK55qE5peL6L2s55+p6Zi177yM54S25ZCO5ZCI5bm26LW35p2lXHJcbiAgICAgICAgLy/ms6jmhI/vvJrml4vovazovbTnmoTpobrluo/lhYjlkI7kuI3lkIzvvIzkvJrlh7rnjrDkuI3lkIznmoTnu5PmnpzvvIzlm6DmraTlv4XpobvopoHmjIflrprml4vovazpobrluo9cclxuICAgICAgICAvL2h0dHA6Ly9wbGFubmluZy5jcy51aXVjLmVkdS9ub2RlMTAyLmh0bWxcclxuICAgICAgICAvL2h0dHBzOi8vdGhyZWVqcy5vcmcvZG9jcy8jYXBpL2VuL21hdGgvRXVsZXIub3JkZXJcclxuICAgICAgICB2YXIgeCA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoZS54LCBWZWN0b3IzLlJJR0hUKTtcclxuICAgICAgICB2YXIgeSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoZS55LCBWZWN0b3IzLlVQKTtcclxuICAgICAgICB2YXIgeiA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoZS56LCBWZWN0b3IzLkZPUldBUkQpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG9yZGVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYWVpcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHkubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWFpZXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geS5tdWx0aXBseSh6Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICAgICAgY2FzZSBcIllYWlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeC5tdWx0aXBseSh5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJZWlhcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB4Lm11bHRpcGx5KHoubXVsdGlwbHkoeSkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWlhZXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geS5tdWx0aXBseSh4Lm11bHRpcGx5KHopKTtcclxuICAgICAgICAgICAgY2FzZSBcIlpZWFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHgubXVsdGlwbHkoeS5tdWx0aXBseSh6KSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUm90YXRpb24gb3JkZXIgZXJyb3IsIG11c3QgYmUgc2ltaWxhciB0byAnWFlaJ1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHkubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgb3V0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIHZhciBtID0gb3V0Lm1hdHJpeDtcclxuICAgICAgICB2YXIgeCA9IGF4aXMueCwgeSA9IGF4aXMueSwgeiA9IGF4aXMuejtcclxuICAgICAgICB2YXIgbGVuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICAgICAgdmFyIHMgPSAwLCBjID0gMCwgdCA9IDA7XHJcblxyXG4gICAgICAgIGFuZ2xlID0gTWF0aC5QSSAqIGFuZ2xlIC8gMTgwO1xyXG4gICAgICAgIGxlbiA9IDEgLyBsZW47XHJcbiAgICAgICAgeCAqPSBsZW47XHJcbiAgICAgICAgeSAqPSBsZW47XHJcbiAgICAgICAgeiAqPSBsZW47XHJcbiAgICAgICAgcyA9IE1hdGguc2luKGFuZ2xlKTtcclxuICAgICAgICBjID0gTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgIHQgPSAxIC0gYztcclxuICAgICAgICBtWzBdWzBdID0geCAqIHggKiB0ICsgYztcclxuICAgICAgICBtWzFdWzBdID0geSAqIHggKiB0ICsgeiAqIHM7XHJcbiAgICAgICAgbVsyXVswXSA9IHogKiB4ICogdCAtIHkgKiBzO1xyXG4gICAgICAgIG1bM11bMF0gPSAwO1xyXG4gICAgICAgIG1bMF1bMV0gPSB4ICogeSAqIHQgLSB6ICogcztcclxuICAgICAgICBtWzFdWzFdID0geSAqIHkgKiB0ICsgYztcclxuICAgICAgICBtWzJdWzFdID0geiAqIHkgKiB0ICsgeCAqIHM7XHJcbiAgICAgICAgbVszXVsxXSA9IDA7XHJcbiAgICAgICAgbVswXVsyXSA9IHggKiB6ICogdCArIHkgKiBzO1xyXG4gICAgICAgIG1bMV1bMl0gPSB5ICogeiAqIHQgLSB4ICogcztcclxuICAgICAgICBtWzJdWzJdID0geiAqIHogKiB0ICsgYztcclxuICAgICAgICBtWzNdWzJdID0gMDtcclxuICAgICAgICBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzNdID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U2NhbGVNYXRyaXgoczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSBzLng7IG1bMF1bMV0gPSAwOyBtWzBdWzJdID0gMDsgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVswXSA9IDA7IG1bMV1bMV0gPSBzLnk7IG1bMV1bMl0gPSAwOyBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzBdID0gMDsgbVsyXVsxXSA9IDA7IG1bMl1bMl0gPSBzLno7IG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bMF0gPSAwOyBtWzNdWzFdID0gMDsgbVszXVsyXSA9IDA7IG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlkZW50aXR5KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbS5tYXRyaXhbMF1bMF0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzFdWzFdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFsyXVsyXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbM11bM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBtO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgTWF0cml4NHg0IH0gZnJvbSBcIi4vTWF0cml4NHg0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVhdGVybmlvbiB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZXVsZXI6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGVBcm91bmQoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5ldWxlckFuZ2xlcyA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZXVsZXJBbmdsZXMoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24odGhpcykuZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGV1bGVyQW5nbGVzKGU6IFZlY3RvcjMpIHtcclxuICAgICAgICB2YXIgcSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGUpLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMudyA9IHEudztcclxuICAgICAgICB0aGlzLnggPSBxLng7XHJcbiAgICAgICAgdGhpcy55ID0gcS55O1xyXG4gICAgICAgIHRoaXMueiA9IHEuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlQXJvdW5kKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICBsZXQgcSA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKGFuZ2xlLCBheGlzKTtcclxuICAgICAgICB0aGlzLnggPSBxLng7XHJcbiAgICAgICAgdGhpcy55ID0gcS55O1xyXG4gICAgICAgIHRoaXMueiA9IHEuejtcclxuICAgICAgICB0aGlzLncgPSBxLnc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEB6aCDlkJHph4/lm5vlhYPmlbDkuZjms5VcclxuICAgICovXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtUXVhdChhOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy8gYmVuY2htYXJrczogaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi10cmFuc2Zvcm0tVmVjMy1pbXBsZW1lbnRhdGlvbnNcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgbGV0IHEgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xyXG4gICAgICAgIGNvbnN0IGl4ID0gcS53ICogYS54ICsgcS55ICogYS56IC0gcS56ICogYS55O1xyXG4gICAgICAgIGNvbnN0IGl5ID0gcS53ICogYS55ICsgcS56ICogYS54IC0gcS54ICogYS56O1xyXG4gICAgICAgIGNvbnN0IGl6ID0gcS53ICogYS56ICsgcS54ICogYS55IC0gcS55ICogYS54O1xyXG4gICAgICAgIGNvbnN0IGl3ID0gLXEueCAqIGEueCAtIHEueSAqIGEueSAtIHEueiAqIGEuejtcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxyXG4gICAgICAgIG91dC54ID0gaXggKiBxLncgKyBpdyAqIC1xLnggKyBpeSAqIC1xLnogLSBpeiAqIC1xLnk7XHJcbiAgICAgICAgb3V0LnkgPSBpeSAqIHEudyArIGl3ICogLXEueSArIGl6ICogLXEueCAtIGl4ICogLXEuejtcclxuICAgICAgICBvdXQueiA9IGl6ICogcS53ICsgaXcgKiAtcS56ICsgaXggKiAtcS55IC0gaXkgKiAtcS54O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbih0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWbm+WFg+aVsOeQg+mdouaPkuWAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNsZXJwKGE6IFF1YXRlcm5pb24sIGI6IFF1YXRlcm5pb24sIHQ6IG51bWJlcik6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6XHJcbiAgICAgICAgLy8gICAgaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi1zbGVycC1pbXBsZW1lbnRhdGlvbnNcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIGxldCBzY2FsZTAgPSAwO1xyXG4gICAgICAgIGxldCBzY2FsZTEgPSAwO1xyXG5cclxuICAgICAgICAvLyBjYWxjIGNvc2luZVxyXG4gICAgICAgIGxldCBjb3NvbSA9IGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgICAgICAvLyBhZGp1c3Qgc2lnbnMgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAgICBpZiAoY29zb20gPCAwLjApIHtcclxuICAgICAgICAgICAgY29zb20gPSAtY29zb207XHJcbiAgICAgICAgICAgIGIueCA9IC1iLng7XHJcbiAgICAgICAgICAgIGIueSA9IC1iLnk7XHJcbiAgICAgICAgICAgIGIueiA9IC1iLno7XHJcbiAgICAgICAgICAgIGIudyA9IC1iLnc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBjb2VmZmljaWVudHNcclxuICAgICAgICBpZiAoKDEuMCAtIGNvc29tKSA+IDAuMDAwMDAxKSB7XHJcbiAgICAgICAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKVxyXG4gICAgICAgICAgICBjb25zdCBvbWVnYSA9IE1hdGguYWNvcyhjb3NvbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbm9tID0gTWF0aC5zaW4ob21lZ2EpO1xyXG4gICAgICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICAgICAgc2NhbGUxID0gTWF0aC5zaW4odCAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFwiZnJvbVwiIGFuZCBcInRvXCIgcXVhdGVybmlvbnMgYXJlIHZlcnkgY2xvc2VcclxuICAgICAgICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xyXG4gICAgICAgICAgICBzY2FsZTEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXHJcbiAgICAgICAgb3V0LnggPSBzY2FsZTAgKiBhLnggKyBzY2FsZTEgKiBiLng7XHJcbiAgICAgICAgb3V0LnkgPSBzY2FsZTAgKiBhLnkgKyBzY2FsZTEgKiBiLnk7XHJcbiAgICAgICAgb3V0LnogPSBzY2FsZTAgKiBhLnogKyBzY2FsZTEgKiBiLno7XHJcbiAgICAgICAgb3V0LncgPSBzY2FsZTAgKiBhLncgKyBzY2FsZTEgKiBiLnc7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QoYTogUXVhdGVybmlvbiwgYjogUXVhdGVybmlvbik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlQXhpcyhhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIGFuZ2xlID0gTWF0aC5QSSAqIGFuZ2xlIC8gMTgwO1xyXG4gICAgICAgIGFuZ2xlICo9IDAuNTtcclxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XHJcblxyXG4gICAgICAgIHJlcy54ID0gYXhpcy54ICogc2luO1xyXG4gICAgICAgIHJlcy55ID0gYXhpcy55ICogc2luO1xyXG4gICAgICAgIHJlcy56ID0gYXhpcy56ICogc2luO1xyXG4gICAgICAgIHJlcy53ID0gTWF0aC5jb3MoYW5nbGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlkZW50aXR5KCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbigwLCAwLCAwLCAxKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yMiB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGdldCB3aWR0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy54OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjQpXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3IyKTogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWN0b3IyO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3IyKTogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjI7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3IyLmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMi5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIsIHQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHggPSB2Mi54IC0gdjEueDtcclxuICAgICAgICB2YXIgeSA9IHYyLnkgLSB2MS55O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMi5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKC0xLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgLTEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IzIHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yNClcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjdG9yMztcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3IzKTogVmVjdG9yMztcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjdG9yMztcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3IzLmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMy5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjMpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55ICYmIHYueiA9PSB0aGlzLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzLCB0OiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICB2LnogPSB2MS56ICsgdCAqICh2Mi56IC0gdjEueik7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkgKyB2MS56ICogdjIueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcm9zcyh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgeCA9IHYxLnkgKiB2Mi56IC0gdjEueiAqIHYyLnk7XHJcbiAgICAgICAgdmFyIHkgPSB2MS56ICogdjIueCAtIHYxLnggKiB2Mi56O1xyXG4gICAgICAgIHZhciB6ID0gdjEueCAqIHYyLnkgLSB2MS55ICogdjIueDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB4ID0gdjIueCAtIHYxLng7XHJcbiAgICAgICAgdmFyIHkgPSB2Mi55IC0gdjEueTtcclxuICAgICAgICB2YXIgeiA9IHYyLnogLSB2MS56O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpZmZlcmVuY2UodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIGRlc3QgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICBkZXN0LnggPSB2MS54IC0gdjIueFxyXG4gICAgICAgIGRlc3QueSA9IHYxLnkgLSB2Mi55XHJcbiAgICAgICAgZGVzdC56ID0gdjEueiAtIHYyLnpcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlc3RcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhWZWN0b3IzLmRvdCh2MSwgdjIpIC8gKHYxLm1hZ25pdHVkZSAqIHYyLm1hZ25pdHVkZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygxLCAxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBSSUdIVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgTEVGVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoLTEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFVQKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAxLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBET1dOKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAtMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRk9SV0FSRCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgQkFDSygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMCwgLTEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3I0IHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgcigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy54OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGcoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueTsgfVxyXG4gICAgcHVibGljIGdldCBiKCk6IG51bWJlciB7IHJldHVybiB0aGlzLno7IH1cclxuICAgIHB1YmxpYyBnZXQgYSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy53OyB9XHJcblxyXG4gICAgcHVibGljIGdldCB2ZWN0b3IzKCk6IFZlY3RvcjMgeyByZXR1cm4gbmV3IFZlY3RvcjModGhpcyk7IH1cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50cy5sZW5ndGggPT0gMiA/IGFyZ3VtZW50c1sxXSA6IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjQpOiBWZWN0b3I0O1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiBWZWN0b3I0O1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMudyArPSBhcmd1bWVudHNbMF0udztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgKz0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yNCk6IFZlY3RvcjQ7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjdG9yNDtcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMudyAtPSBhcmd1bWVudHNbMF0udztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgLT0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgdGhpcy56ICo9IGQ7XHJcbiAgICAgICAgdGhpcy53ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICB0aGlzLnogLz0gZDtcclxuICAgICAgICB0aGlzLncgLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yNCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICB0aGlzLnogKj0gdi56O1xyXG4gICAgICAgIHRoaXMudyAqPSB2Lnc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yNC5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjQuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55ICYmIHYueiA9PSB0aGlzLnogJiYgdi53ID09IHRoaXMudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIiwgXCIgKyB0aGlzLncgKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQsIHQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjQoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICB2LncgPSB2MS53ICsgdCAqICh2Mi53IC0gdjEudyk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkgKyB2MS56ICogdjIueiArIHYxLncgKiB2Mi53KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3I0LmRvdCh2MSwgdjIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoMSwgMSwgMSwgMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0dhbWVPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2VuZSB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByb290R2FtZU9iamVjdHM6IEdhbWVPYmplY3RbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgYWRkR2FtZU9iamVjdChnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yb290R2FtZU9iamVjdHMucHVzaChnYW1lT2JqZWN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHJlbW92ZUdhbWVPYmplY3QoZ2FtZU9iamVjdDogR2FtZU9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yb290R2FtZU9iamVjdHMuaW5kZXhPZihnYW1lT2JqZWN0KTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEdhbWVPYmplY3RzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0Um9vdEdhbWVPYmplY3RzKCk6IEdhbWVPYmplY3RbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLnJvb3RHYW1lT2JqZWN0c107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy8g5pu05paw5omA5pyJ5qC55ri45oiP5a+56LGh5Y+K5YW25a2Q5a+56LGhXHJcbiAgICAgICAgZm9yIChjb25zdCBnYW1lT2JqZWN0IG9mIHRoaXMucm9vdEdhbWVPYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGdhbWVPYmplY3Quc3RhcnRDb21wb25lbnRzKCk7XHJcbiAgICAgICAgICAgIGdhbWVPYmplY3QudXBkYXRlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFNjZW5lIH0gZnJvbSBcIi4vU2NlbmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2VuZU1hbmFnZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBTY2VuZU1hbmFnZXI7XHJcbiAgICBwcml2YXRlIHNjZW5lczogTWFwPHN0cmluZywgU2NlbmU+ID0gbmV3IE1hcDxzdHJpbmcsIFNjZW5lPigpO1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVTY2VuZTogU2NlbmUgfCBudWxsID0gbnVsbDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGluc3RhbmNlKCk6IFNjZW5lTWFuYWdlciB7XHJcbiAgICAgICAgaWYgKCFTY2VuZU1hbmFnZXIuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5faW5zdGFuY2UgPSBuZXcgU2NlbmVNYW5hZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTY2VuZU1hbmFnZXIuX2luc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgY3JlYXRlU2NlbmUobmFtZTogc3RyaW5nKTogU2NlbmUge1xyXG4gICAgICAgIGNvbnN0IHNjZW5lID0gbmV3IFNjZW5lKG5hbWUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLnNldChuYW1lLCBzY2VuZSk7XHJcbiAgICAgICAgcmV0dXJuIHNjZW5lO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0U2NlbmUobmFtZTogc3RyaW5nKTogU2NlbmUgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjZW5lcy5nZXQobmFtZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXRBY3RpdmVTY2VuZShzY2VuZTogU2NlbmUgfCBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNjZW5lID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZFNjZW5lID0gdGhpcy5zY2VuZXMuZ2V0KHNjZW5lKTtcclxuICAgICAgICAgICAgaWYgKGZvdW5kU2NlbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBmb3VuZFNjZW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldEFjdGl2ZVNjZW5lKCk6IFNjZW5lIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlU2NlbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyB1cGRhdGVBY3RpdmVTY2VuZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVTY2VuZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IE1hdHJpeDR4NCB9IGZyb20gXCIuL01hdGgvTWF0cml4NHg0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3I0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcclxuICAgIHB1YmxpYyByZWFkb25seSBnYW1lT2JqZWN0OiBHYW1lT2JqZWN0O1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNoaWxkcmVuOiBBcnJheTxUcmFuc2Zvcm0+O1xyXG5cclxuICAgIHByaXZhdGUgX3BhcmVudDogVHJhbnNmb3JtIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90ZW1wUG9zOiBWZWN0b3IzO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFJvdDogUXVhdGVybmlvbjtcclxuICAgIHByaXZhdGUgX3RlbXBTY2FsZTogVmVjdG9yMztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0ID0gZ2FtZU9iamVjdDtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gbmV3IEFycmF5PFRyYW5zZm9ybT4oKTtcclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3RlbXBQb3MgPSBWZWN0b3IzLlpFUk87XHJcbiAgICAgICAgdGhpcy5fdGVtcFJvdCA9IFF1YXRlcm5pb24uaWRlbnRpdHk7XHJcbiAgICAgICAgdGhpcy5fdGVtcFNjYWxlID0gVmVjdG9yMy5PTkU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzZWxmTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDR4NC5nZXRUUlNNYXRyaXgodGhpcy5fdGVtcFBvcywgdGhpcy5fdGVtcFJvdCwgdGhpcy5fdGVtcFNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGxvY2FsVG9Xb3JsZE1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBwID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LmxvY2FsVG9Xb3JsZE1hdHJpeCA6IE1hdHJpeDR4NC5pZGVudGl0eTtcclxuICAgICAgICByZXR1cm4gcC5tdWx0aXBseSh0aGlzLnNlbGZNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRUb0xvY2FsTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQud29ybGRUb0xvY2FsTWF0cml4IDogTWF0cml4NHg0LmlkZW50aXR5O1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGZNYXRyaXguaW52ZXJzZSgpLm11bHRpcGx5KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgeCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB4KHg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIHBvcy54ID0geDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgeSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB5KHk6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIHBvcy55ID0geTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgeigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB6KHo6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIHBvcy56ID0gejtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZm9yd2FyZCgpOiBWZWN0b3IzIHtcclxuICAgICAgICAvL+aIkeS7rOimgeW+l+WIsOeahOaYr+S4gOS4quaWueWQke+8jOWboOatpOS4jemcgOimgeS9jee9ruS/oeaBr++8jOWwhum9kOasoeWdkOagh+eahHforr7nva7kuLow77yM5oqb5byD5o6J5Z2Q5qCH5L+h5oGvXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLkZPUldBUkQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdXAoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLlVQLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJpZ2h0KCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5SSUdIVCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwb3NpdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFBvcy5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcG9zaXRpb24ocG9zOiBWZWN0b3IzKSB7XHJcbiAgICAgICAgdGhpcy5fdGVtcFBvcyA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkUG9zaXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4LmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm90YXRpb24oKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBSb3QuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJvdGF0aW9uKHE6IFF1YXRlcm5pb24pIHtcclxuICAgICAgICB0aGlzLl90ZW1wUm90ID0gcTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkUm90YXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4LmdldEV1bGVyQW5nbGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFNjYWxlLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzY2FsZShzOiBWZWN0b3IzKSB7XHJcbiAgICAgICAgdGhpcy5fdGVtcFNjYWxlID0gcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkU2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4LmdldFNjYWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwYXJlbnQoKTogVHJhbnNmb3JtIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UGFyZW50KHBhcmVudDogVHJhbnNmb3JtLCB3b3JsZFBvc2l0aW9uU3RheXM6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudCAhPSBudWxsICYmIHBhcmVudCAhPSB0aGlzICYmIHBhcmVudCAhPSB0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICAvL+mYsuatouWHuueOsO+8mueItuiKgueCueaYr+W9k+WJjeiKgueCueeahOWtkOiKgueCue+8jOWwhuWtkOiKgueahOiuvue9ruS4uuiHquW3seeahOeItuiKgueCue+8jOS8muatu+W+queOr1xyXG4gICAgICAgICAgICBpZiAocGFyZW50Lmhhc1BhcmVudCh0aGlzKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZXQgcGFyZW50LCB0aGlzIG5vZGUgaXMgdGhlIHBhcmVudCBub2RlJ3MgcGFyZW50LlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzlvZPliY3oioLngrnmnInniLboioLngrnvvIzopoHlhYjnp7vpmaTml6fnmoRcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwYXJlbnQgPT0gbnVsbCAmJiB0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v6IqC54K5cOaYr+WQpuaYr+W9k+WJjeiKgueCueeahOS4iue6p1xyXG4gICAgcHVibGljIGhhc1BhcmVudChwOiBUcmFuc2Zvcm0pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgPT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMucGFyZW50ID09IHApXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lmhhc1BhcmVudChwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZENoaWxkKGNoaWxkOiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCAmJiBjaGlsZCAhPSB0aGlzICYmICF0aGlzLmNoaWxkcmVuLmluY2x1ZGVzKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAvL+mYsuatouWHuueOsO+8mmNoaWxk6IqC54K55piv5b2T5YmN6IqC54K555qE54i26IqC54K577yM5bCG54i26IqC55qE6K6+572u5Li66Ieq5bex55qE5a2Q6IqC54K577yM5Lya5q275b6q546vXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1BhcmVudChjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gYWRkIGNoaWxkLCB0aGlzIG5vZGUgaXMgdGhlIGNoaWxkIG5vZGUncyBjaGlsZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8v5aaC5p6c5a2Q6IqC54K55pyJ5pen55qE54i26IqC54K577yM6KaB5YWI56e76ZmkXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICBjaGlsZC5fcGFyZW50ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmICh3b3JsZFBvc2l0aW9uU3RheXMpIHtcclxuICAgICAgICAgICAgICAgIC8v5L+d55WZ5Y6f5LiW55WM5Z2Q5qCH5L2N572u77yM5YWI5pyd54i26IqC54K555qE5Y+Y5o2i55qE5Y+N5pa55ZCR56e75Yqo77yM54S25ZCO5YaN5re75Yqg6L+b5Y6777yM5bCx6IO95L+d5oyB5LiW55WM5Z2Q5qCH5LiN5Y+YXHJcbiAgICAgICAgICAgICAgICAvL+WNs+WPmOaNouWIsOeItuiKgueCueeahOmAhuefqemYtemHjFxyXG4gICAgICAgICAgICAgICAgdmFyIG0gPSB0aGlzLndvcmxkVG9Mb2NhbE1hdHJpeC5tdWx0aXBseShjaGlsZC5zZWxmTWF0cml4KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUG9zID0gbS5nZXRUcmFuc2xhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUm90ID0gbS5nZXRSb3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wU2NhbGUgPSBtLmdldFNjYWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVDaGlsZChjaGlsZDogVHJhbnNmb3JtLCB3b3JsZFBvc2l0aW9uU3RheXM6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNoaWxkLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh3b3JsZFBvc2l0aW9uU3RheXMpIHtcclxuICAgICAgICAgICAgICAgIC8v5L+d55WZ5LiW55WM5Z2Q5qCH77yM55u05o6l5bCG5pys5Zyw5Z2Q5qCH562J5ZCM5LqO5b2T5YmN5LiW55WM5Z2Q5qCH5Y2z5Y+vXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHRoaXMubG9jYWxUb1dvcmxkTWF0cml4Lm11bHRpcGx5KGNoaWxkLnNlbGZNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBQb3MgPSBtLmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBSb3QgPSBtLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBTY2FsZSA9IG0uZ2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBjaGlsZC5fcGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udmVydFRvTm9kZVNwYWNlKHY6IFZlY3RvcjMsIHc6IG51bWJlciA9IDEpOiBWZWN0b3IzIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAq5bCG5p+Q5Liq5Z2Q5qCH6L2s5Yiw6Ieq5bex55qE5bGA6YOo56m66Ze077yM5L6L5aaC5b2T5YmN55qE5bGA6YOo5Z2Q5qCH5Y6f54K55Zyo5LiW55WM5Z2Q5qCH55qE77yIMe+8jDHvvInlpIRcclxuICAgICAgICAgKueCuXDlnKjkuJbnlYzlnZDmoIfvvIgy77yMMe+8ieWkhO+8jOmCo+S5iOWwhueCuXDnm7jlr7nkuo7lvZPliY3lsYDpg6jlnZDmoIfns7vnmoTkvY3nva7lsLHmmK/vvIgy77yMMe+8iS3vvIgx77yMMe+8iT0g77yIMe+8jCAw77yJXHJcbiAgICAgICAgICrljbPlsIbngrlw5Y+N5ZCR5Y+Y5o2i5b2T5YmN55qE55+p6Zi1IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB0aGlzLndvcmxkVG9Mb2NhbE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodiwgdykpLnZlY3RvcjM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbnZlcnRUb1dvcmxkU3BhY2UodjogVmVjdG9yMywgdzogbnVtYmVyID0gMSk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodiwgdykpLnZlY3RvcjM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3koZGVzdHJveUNoaWxkcmVuOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChkZXN0cm95Q2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koZGVzdHJveUNoaWxkcmVuKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4uL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBPQkpNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSBcIi4vRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgeyBPQkpQYXJzZXIgfSBmcm9tIFwiLi9PYmpQYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBc3NldExvYWRlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBmaWxlQ2FjaGU6IERpY3Rpb25hcnkgPSBuZXcgRGljdGlvbmFyeSgpO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEltYWdlRmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KChyZXNvbHZlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSB0aGUgaW1hZ2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCBvbiBsb2FkaW5nIGFuIGltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDot6jljLror7fmsYJcclxuICAgICAgICAgICAgICAgIGltYWdlLmNyb3NzT3JpZ2luID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZWxsIHRoZSBicm93c2VyIHRvIGxvYWQgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGZpbGVOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkVGV4dEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zkuI3opoHlvIDlkK/lvILmraXvvIzorr7nva7kuLpmYWxzZe+8jOWQpuWImeWuueaYk+WNoeWcqHJlYWR5U3RhdGUgPSAx77yM5Y6f5Zug5LiN5piOXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgZmlsZU5hbWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZE1vZGVsRmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxPQkpEb2M+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8T0JKRG9jPigocmVzb2x2ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqRG9jID0gbmV3IE9CSkRvYyhmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgb2JqRG9jLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0LCAxLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiT0JKIGZpbGUgcGFyc2luZyBlcnJvcjogXCIgKyBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIG9iakRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iakRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBsb2FkTW9kZWwobmFtZTogc3RyaW5nLCBtb2RlbFBhdGg6IHN0cmluZywgc2NhbGU6IG51bWJlciA9IDEsIHJldmVyc2U6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8T0JKTW9kZWwgfCBudWxsPiB7XHJcbiAgICAgICAgbGV0IG1vZGVsOiBPQkpNb2RlbCB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIHZhciBvYmpEb2MgPSBhd2FpdCBBc3NldExvYWRlci5sb2FkVGV4dEZpbGUobW9kZWxQYXRoKTtcclxuXHJcbiAgICAgICAgaWYgKG9iakRvYyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsID0gT0JKUGFyc2VyLnBhcnNlT0JKKG9iakRvYyk7XHJcbiAgICAgICAgICAgIC8vIOi+k+WHuue7n+iuoeS/oeaBr1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhPQkpQYXJzZXIuZ2V0TW9kZWxTdGF0cyhtb2RlbCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gdmFyIG9ianMgPSBvYmpEb2MuZ2V0T2JqcyhzY2FsZSwgcmV2ZXJzZSk7XHJcbiAgICAgICAgICAgIC8vIG9ianMuZm9yRWFjaChhc3luYyBvYmogPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgLy90b2RvOuS4tOatu+WGmeatu++8jOWPquWKoOi9vea8q+WPjeWwhOi0tOWbvlxyXG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKG9iai5tYXRlcmlhbCAhPSBudWxsICYmIG9iai5tYXRlcmlhbC5tYXBfS2QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHJlbmRlci5tYXRlcmlhbC5jcmVhdGVUZXh0dXJlKG9iai5tYXRlcmlhbC5tYXBfS2QpO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLnZlcnRpY2VzID0gb2JqLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwuaW5kaWNlcyA9IG9iai5pbmRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwudXZzID0gb2JqLnV2cztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLm5vcm1hbHMgPSBvYmoubm9ybWFscztcclxuICAgICAgICAgICAgLy8gICAgIGluc3RhbmNlLm1vZGVsLnB1c2gobW9kZWwpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xyXG5cclxuICBpdGVtczogb2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcclxuICAgIHRoaXMuaXRlbXNba2V5XSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuaXRlbXNba2V5XSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5pdGVtc1trXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGZ1bikge1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGZ1bihrLCB0aGlzLml0ZW1zW2tdKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAnLi4vTWF0aC9WZWN0b3IzJztcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJy4uL01hdGgvVmVjdG9yMic7XHJcbmltcG9ydCB7IEZhY2UsIE9CSk1vZGVsIH0gZnJvbSAnLi4vTW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIE9CSuaWh+S7tuino+aekOWZqOexu1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE9CSlBhcnNlciB7XHJcbiAgICAvKipcclxuICAgICAqIOino+aekE9CSuaWh+S7tlxyXG4gICAgICogQHBhcmFtIGZpbGVDb250ZW50IE9CSuaWh+S7tuWGheWuuVxyXG4gICAgICogQHJldHVybnMg6Kej5p6Q5ZCO55qET0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2VPQkooZmlsZUNvbnRlbnQ6IHN0cmluZyk6IE9CSk1vZGVsIHtcclxuICAgICAgICBjb25zdCBsaW5lcyA9IGZpbGVDb250ZW50LnNwbGl0KCdcXG4nKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBPQkpNb2RlbCA9IHtcclxuICAgICAgICAgICAgdmVydGljZXM6IFtdLFxyXG4gICAgICAgICAgICB0ZXh0dXJlQ29vcmRzOiBbXSxcclxuICAgICAgICAgICAgdmVydGV4Tm9ybWFsczogW10sXHJcbiAgICAgICAgICAgIGZhY2VzOiBbXSxcclxuICAgICAgICAgICAgbWF0ZXJpYWxzOiB7fSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudE1hdGVyaWFsID0gJyc7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltbWVkTGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g6Lez6L+H56m66KGM5ZKM5rOo6YeKXHJcbiAgICAgICAgICAgIGlmICghdHJpbW1lZExpbmUgfHwgdHJpbW1lZExpbmUuc3RhcnRzV2l0aCgnIycpKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVQYXJ0cyA9IHRyaW1tZWRMaW5lLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXdvcmQgPSBsaW5lUGFydHNbMF07XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleXdvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3YnOiAvLyDpobbngrnlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbM10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC52ZXJ0aWNlcy5wdXNoKHZlcnRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Z0JzogLy8g57q555CG5Z2Q5qCHXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXhDb29yZCA9IG5ldyBWZWN0b3IyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC50ZXh0dXJlQ29vcmRzLnB1c2godGV4Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd2bic6IC8vIOmhtueCueazlee6v1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZlcnRleE5vcm1hbHMucHVzaChub3JtYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdmJzogLy8g6Z2i5a6a5LmJXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNlOiBGYWNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4SW5kaWNlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlSW5kaWNlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxJbmRpY2VzOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6Kej5p6Q6Z2i55qE5q+P5Liq6aG254K55a6a5LmJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZVBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhEZWYgPSBsaW5lUGFydHNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pSv5oyBduOAgXYvdnTjgIF2Ly92buOAgXYvdnQvdm7nrYnlpJrnp43moLzlvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleFBhcnRzID0gdmVydGV4RGVmLnNwbGl0KCcvJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6aG254K557Si5byV77yIT0JK57Si5byV5LuOMeW8gOWni++8jOmcgOimgei9rOaNouS4uuS7jjDlvIDlp4vvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UudmVydGV4SW5kaWNlcy5wdXNoKHBhcnNlSW50KHZlcnRleFBhcnRzWzBdKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe6ueeQhuWdkOagh+e0ouW8le+8iOWPr+mAie+8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzFdICYmIHZlcnRleFBhcnRzWzFdICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UudGV4dHVyZUluZGljZXMhLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMV0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rOV57q/57Si5byV77yI5Y+v6YCJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMl0gJiYgdmVydGV4UGFydHNbMl0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5ub3JtYWxJbmRpY2VzIS5wdXNoKHBhcnNlSW50KHZlcnRleFBhcnRzWzJdKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInnurnnkIbmiJbms5Xnur/ntKLlvJXvvIzmuIXnqbrmlbDnu4Tku6Xkv53mjIHmlbDmja7mlbTmtIFcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2UudGV4dHVyZUluZGljZXMhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmYWNlLnRleHR1cmVJbmRpY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYWNlLm5vcm1hbEluZGljZXMhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmYWNlLm5vcm1hbEluZGljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa3u+WKoOadkOi0qOS/oeaBr++8iOWmguaenOacie+8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLm1hdGVyaWFsTmFtZSA9IGN1cnJlbnRNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZhY2VzLnB1c2goZmFjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ210bGxpYic6IC8vIOadkOi0qOW6k+W8leeUqFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWxMaWJOYW1lID0gbGluZVBhcnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlrp7pmYXlupTnlKjkuK3pnIDopoHliqDovb3lubbop6PmnpDlr7nlupTnmoQubXRs5paH5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDlj5HnjrDmnZDotKjlupPlvJXnlKg6ICR7bWF0ZXJpYWxMaWJOYW1lfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd1c2VtdGwnOiAvLyDkvb/nlKjmnZDotKhcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRNYXRlcmlhbCA9IGxpbmVQYXJ0c1sxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Yid5aeL5YyW5p2Q6LSo6K6w5b2V77yI5a6e6ZmF5L2/55So5pe26ZyA6KaB5LuOLm10bOaWh+S7tuWKoOi9veWujOaVtOS/oeaBr++8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5tYXRlcmlhbHNbY3VycmVudE1hdGVyaWFsXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5tYXRlcmlhbHNbY3VycmVudE1hdGVyaWFsXSA9IHsgbmFtZTogY3VycmVudE1hdGVyaWFsIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5Y+v5Lul5re75Yqg5pu05aSaT0JK5qC85byP5YWz6ZSu5a2X55qE5aSE55CGXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOW/veeVpeS4jeaUr+aMgeeahOWFs+mUruWtl1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG6Kej5p6Q5ZCO55qE5qih5Z6L5pWw5o2u6L2s5o2i5Li6SlNPTuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMgSlNPTuWtl+espuS4slxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvSlNPTihtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtb2RlbCwgbnVsbCwgMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmqKHlnovnu5/orqHkv6Hmga9cclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIOe7n+iuoeS/oeaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE1vZGVsU3RhdHMobW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlQ291bnQgPSBtb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBub3JtYWxDb3VudCA9IG1vZGVsLnZlcnRleE5vcm1hbHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGZhY2VzV2l0aFRleHR1cmVzID0gbW9kZWwuZmFjZXMuZmlsdGVyKGZhY2UgPT4gZmFjZS50ZXh0dXJlSW5kaWNlcykubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGZhY2VzV2l0aE5vcm1hbHMgPSBtb2RlbC5mYWNlcy5maWx0ZXIoZmFjZSA9PiBmYWNlLm5vcm1hbEluZGljZXMpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGBcclxu5qih5Z6L57uf6K6h5L+h5oGvOlxyXG4tIOmhtueCueaVsDogJHttb2RlbC52ZXJ0aWNlcy5sZW5ndGh9XHJcbi0g57q555CG5Z2Q5qCH5pWwOiAke3RleHR1cmVDb3VudH1cclxuLSDms5Xnur/lkJHph4/mlbA6ICR7bm9ybWFsQ291bnR9XHJcbi0g6Z2i5pWwOiAke21vZGVsLmZhY2VzLmxlbmd0aH1cclxuLSDluKbnurnnkIbnmoTpnaI6ICR7ZmFjZXNXaXRoVGV4dHVyZXN9XHJcbi0g5bim5rOV57q/55qE6Z2iOiAke2ZhY2VzV2l0aE5vcm1hbHN9XHJcbi0g5p2Q6LSo5pWwOiAke09iamVjdC5rZXlzKG1vZGVsLm1hdGVyaWFscykubGVuZ3RofVxyXG4gICAgICAgIGAudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6aqM6K+B6Kej5p6Q5pWw5o2u55qE5a6M5pW05oCnXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyDpqozor4Hnu5Pmnpzmtojmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZU1vZGVsKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDmo4Dmn6XpnaLntKLlvJXmmK/lkKbotornlYxcclxuICAgICAgICBmb3IgKGNvbnN0IGZhY2Ugb2YgbW9kZWwuZmFjZXMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXhJbmRleCBvZiBmYWNlLnZlcnRleEluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhJbmRleCA8IDAgfHwgdmVydGV4SW5kZXggPj0gbW9kZWwudmVydGljZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOmhtueCuee0ouW8lei2iueVjDogJHt2ZXJ0ZXhJbmRleH0gKOacgOWkpzogJHttb2RlbC52ZXJ0aWNlcy5sZW5ndGggLSAxfSlgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZhY2UudGV4dHVyZUluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGV4SW5kZXggb2YgZmFjZS50ZXh0dXJlSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXhJbmRleCA8IDAgfHwgdGV4SW5kZXggPj0gbW9kZWwudGV4dHVyZUNvb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOe6ueeQhuWdkOagh+e0ouW8lei2iueVjDogJHt0ZXhJbmRleH0gKOacgOWkpzogJHttb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZhY2Uubm9ybWFsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3JtYWxJbmRleCBvZiBmYWNlLm5vcm1hbEluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9ybWFsSW5kZXggPCAwIHx8IG5vcm1hbEluZGV4ID49IG1vZGVsLnZlcnRleE5vcm1hbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGDms5Xnur/ntKLlvJXotornlYw6ICR7bm9ybWFsSW5kZXh9ICjmnIDlpKc6ICR7bW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGggLSAxfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCBcclxuICAgICAgICAgICAgPyBg5Y+R546wICR7ZXJyb3JzLmxlbmd0aH0g5Liq6ZSZ6K+vOlxcbiR7ZXJyb3JzLmpvaW4oJ1xcbicpfWBcclxuICAgICAgICAgICAgOiAn5qih5Z6L5pWw5o2u6aqM6K+B6YCa6L+HJztcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9Mb2dnZXJcIjtcclxuaW1wb3J0IHsgU2NlbmVNYW5hZ2VyIH0gZnJvbSBcIi4vU2NlbmUvU2NlbmVNYW5hZ2VyXCI7XHJcbi8vaW1wb3J0IHsgUmFzdGVyaXphdGlvblBpcGVsaW5lIH0gZnJvbSBcIi4vUmFzdGVyaXphdGlvblBpcGVsaW5lXCI7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vSW5wdXRcIjtcclxuaW1wb3J0IHsgQXNzZXRMb2FkZXIgfSBmcm9tIFwiLi9VdGlscy9Bc3NldExvYWRlclwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbi8vaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ29tcG9uZW50L0NhbWVyYVwiO1xyXG4vL2ltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L1JlbmRlcmVyXCI7XHJcbi8vaW1wb3J0IHsgTWVzaFJlbmRlcmVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L01lc2hSZW5kZXJlclwiO1xyXG4vL2ltcG9ydCB7IE9ialJvdGF0ZSB9IGZyb20gXCIuL0NvbXBvbmVudC9PYmpSb3RhdGVcIjtcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5cclxuLy8g5b2TRE9N5YaF5a655Yqg6L295a6M5oiQ5ZCO5omn6KGMXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAvLyDojrflj5ZjYW52YXPlhYPntKDlkowyROa4suafk+S4iuS4i+aWh1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgLy8g6K6+572uY2FudmFz5bC65a+4XHJcbiAgICBjYW52YXMud2lkdGggPSBDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gQ29uZmlnLmNhbnZhc0hlaWdodDtcclxuXHJcbiAgICAvLyDorr7nva7mlofmnKzmoLflvI9cclxuICAgIGN0eC5mb250ID0gJ0FyaWFsJztcclxuICAgIGN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcblxyXG4gICAgLy8g5Yib5bu65Zu+5YOP5pWw5o2u5a+56LGhXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguY3JlYXRlSW1hZ2VEYXRhKENvbmZpZy5jYW52YXNXaWR0aCwgQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICAvLyDliJvlu7ozMuS9jeaXoOespuWPt+aVtOWei+aVsOe7hOinhuWbvu+8jOeUqOS6juebtOaOpeaTjeS9nOWDj+e0oOaVsOaNrlxyXG4gICAgY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShpbWFnZURhdGEuZGF0YS5idWZmZXIpO1xyXG5cclxuICAgIC8vIOWIm+W7uua4suafk+WZqOWunuS+i1xyXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgUmFzdGVyaXphdGlvblBpcGVsaW5lKHVpbnQzMlZpZXcpO1xyXG5cclxuICAgIEluaXQoKTtcclxuXHJcbiAgICAvLyDmuLLmn5Plh73mlbBcclxuICAgIGZ1bmN0aW9uIG1haW5Mb29wKCkge1xyXG4gICAgICAgIC8vIOWkhOeQhumAu+i+kVxyXG4gICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIFJlbmRlcihwaXBlbGluZSk7XHJcbiAgICAgICAgLy8g5bCG5Zu+5YOP5pWw5o2u57uY5Yi25YiwY2FudmFz5LiKXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgIC8vIOivt+axguS4i+S4gOW4p+WKqOeUu1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbiAgICAgICAgLy8g5bGP5bmV6L6T5Ye65pel5b+XXHJcbiAgICAgICAgTG9nZ2VyLnByaW50TG9ncyhjdHgpO1xyXG4gICAgfVxyXG4gICAgLy8g5byA5aeL5Yqo55S75b6q546vXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbkxvb3ApO1xyXG59KTtcclxuXHJcbi8vIOiOt+WPlum8oOagh+S6i+S7tlxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpID0+IHtcclxuICAgIC8vIOiOt+WPlum8oOagh+ebuOWvueS6jmNhbnZhc+eahOWdkOagh1xyXG4gICAgY29uc3QgcmVjdCA9IChldmVudC50YXJnZXQgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgIGNvbnN0IG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcclxuICAgIElucHV0Lm1vdXNlWCA9IG1vdXNlWDtcclxuICAgIElucHV0Lm1vdXNlWSA9IG1vdXNlWTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgSW5wdXQuZGVsdGFZID0gZXZlbnQuZGVsdGFZO1xyXG4gICAgY29uc29sZS5sb2coZXZlbnQuZGVsdGFZKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGxlbmQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIElucHV0LmRlbHRhWSA9IDA7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gSW5pdCgpIHtcclxuICAgIC8vIOWIneWni+WMluWcuuaZr1xyXG4gICAgY29uc3QgbWFpblNjZW5lID0gU2NlbmVNYW5hZ2VyLmluc3RhbmNlLmNyZWF0ZVNjZW5lKFwiTWFpblNjZW5lXCIpO1xyXG4gICAgU2NlbmVNYW5hZ2VyLmluc3RhbmNlLnNldEFjdGl2ZVNjZW5lKG1haW5TY2VuZSk7XHJcblxyXG4gICAgLy8g55u45py6XHJcbiAgICBjb25zdCBjYW1lcmEgPSBuZXcgR2FtZU9iamVjdChcImNhbWVyYVwiKTtcclxuICAgIG1haW5TY2VuZS5hZGRHYW1lT2JqZWN0KGNhbWVyYSk7XHJcbiAgICBjYW1lcmEuYWRkQ29tcG9uZW50KENhbWVyYSk7XHJcblxyXG4gICAgbGV0IGxlZTogR2FtZU9iamVjdDtcclxuICAgIC8vIOWKoOi9veaooeWei1xyXG4gICAgQXNzZXRMb2FkZXIubG9hZE1vZGVsKCdsZWUnLCAncmVzb3VyY2VzL2Fzc2V0cy9tZXNoZXMvbGVlLm9iaicpLnRoZW4oKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgbGVlID0gbmV3IEdhbWVPYmplY3QoXCJsZWVcIik7XHJcbiAgICAgICAgbGVlLnRyYW5zZm9ybS5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAsIDAsIDIpO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbGVlLmFkZENvbXBvbmVudChNZXNoUmVuZGVyZXIpO1xyXG4gICAgICAgIHJlbmRlcmVyLm1lc2ggPSBtb2RlbDtcclxuICAgICAgICBsZWUuYWRkQ29tcG9uZW50KE9ialJvdGF0ZSk7XHJcbiAgICAgICAgbWFpblNjZW5lLmFkZEdhbWVPYmplY3QobGVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIEFzc2V0TG9hZGVyLmxvYWRNb2RlbCgnY3ViZScsICdyZXNvdXJjZXMvY3ViZS5vYmonKS50aGVuKChtb2RlbCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGN1YmUgPSBuZXcgR2FtZU9iamVjdChcImN1YmVcIik7XHJcbiAgICAgICAgY3ViZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygyLCAwLCAwKTtcclxuICAgICAgICBjdWJlLnRyYW5zZm9ybS5zY2FsZSA9IG5ldyBWZWN0b3IzKDAuMSwgMC4xLCAwLjEpO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gY3ViZS5hZGRDb21wb25lbnQoTWVzaFJlbmRlcmVyKTtcclxuICAgICAgICByZW5kZXJlci5tZXNoID0gbW9kZWw7XHJcbiAgICAgICAgY3ViZS5hZGRDb21wb25lbnQoT2JqUm90YXRlKTtcclxuICAgICAgICBjdWJlLnRyYW5zZm9ybS5zZXRQYXJlbnQobGVlLnRyYW5zZm9ybSwgZmFsc2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFVwZGF0ZSgpIHtcclxuICAgIC8vIOS9v+eUqOWcuuaZr+eahHVwZGF0ZeaWueazleabtOaWsOaJgOaciea4uOaIj+WvueixoVxyXG4gICAgU2NlbmVNYW5hZ2VyLmluc3RhbmNlLmdldEFjdGl2ZVNjZW5lKCk/LnVwZGF0ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZW5kZXIocGlwZWxpbmU6IFJhc3Rlcml6YXRpb25QaXBlbGluZSkge1xyXG4gICAgcGlwZWxpbmUuQ2xlYXIoQ29sb3IuQkxBQ0spO1xyXG5cclxuICAgIC8vIOiOt+WPluWcuuaZr+S4reeahOaJgOacieaguea4uOaIj+WvueixoeW5tua4suafk1xyXG4gICAgY29uc3Qgcm9vdE9iamVjdHMgPSBTY2VuZU1hbmFnZXIuaW5zdGFuY2UuZ2V0QWN0aXZlU2NlbmUoKT8uZ2V0Um9vdEdhbWVPYmplY3RzKCk7XHJcbiAgICBpZiAocm9vdE9iamVjdHMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGdhbWVPYmplY3Qgb2Ygcm9vdE9iamVjdHMpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVuZGVycyA9IGdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW48UmVuZGVyZXI+KFJlbmRlcmVyIGFzIGFueSk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVuZGVyIG9mIHJlbmRlcnMpIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lLkRyYXdPYmplY3QocmVuZGVyKTtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2cocmVuZGVyLmdhbWVPYmplY3QubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=
