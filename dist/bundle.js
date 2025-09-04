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
var Color_1 = require("../Color");
var Compoment_1 = require("./Compoment");
var Config_1 = require("../Config");
var Vector4_1 = require("../Math/Vector4");
var CameraClearFlags;
(function (CameraClearFlags) {
    CameraClearFlags[CameraClearFlags["NONE"] = 0] = "NONE";
    CameraClearFlags[CameraClearFlags["ALL"] = 16640] = "ALL";
    CameraClearFlags[CameraClearFlags["Color"] = 16384] = "Color";
    CameraClearFlags[CameraClearFlags["Depth"] = 256] = "Depth";
})(CameraClearFlags = exports.CameraClearFlags || (exports.CameraClearFlags = {}));
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.backGroundColor = new Color_1.Color(0.27, 0.27, 0.27, 1.0);
        _this.fogColor = new Color_1.Color(0.27, 0.27, 0.27, 1.0);
        _this.clearFlags = CameraClearFlags.Color | CameraClearFlags.Depth;
        _this.nearClip = 1;
        _this.farClip = 128;
        _this.fov = 60;
        _this.depth = 0;
        _this.viewPort = new Vector4_1.Vector4(0, 0, 1, 1);
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
    Camera.prototype.awake = function () {
        if (Camera.mainCamera == null) {
            Camera.mainCamera = this;
        }
        Camera.cameras.push(this);
    };
    Camera.prototype.onDestroy = function () {
        var index = Camera.cameras.indexOf(this, 0);
        if (index > -1) {
            Camera.cameras.splice(index, 1);
        }
        if (Camera.mainCamera == this) {
            if (Camera.cameras.length > 0)
                Camera.mainCamera = Camera.cameras[0];
            else
                Camera.mainCamera = undefined;
        }
    };
    Camera.cameras = new Array();
    return Camera;
}(Compoment_1.Compoment));
exports.Camera = Camera;
},{"../Color":1,"../Config":5,"../Math/Vector4":13,"./Compoment":3}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Compoment = void 0;
var Compoment = /** @class */ (function () {
    function Compoment(gameObject) {
        this._enabled = true;
        this.gameObject = gameObject;
        this.awake();
    }
    Object.defineProperty(Compoment.prototype, "transform", {
        get: function () {
            return this.gameObject.transform;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Compoment.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
            if (value) {
                this.onEnable();
            }
            else {
                this.onDisable();
            }
        },
        enumerable: false,
        configurable: true
    });
    // 生命周期方法
    // 当组件被创建时调用
    Compoment.prototype.awake = function () { };
    // 在启用组件的第一帧调用
    Compoment.prototype.start = function () { };
    // 每帧更新前调用
    Compoment.prototype.update = function () { };
    // 每帧更新后调用
    //public lateUpdate(): void {}
    // 用于渲染
    //public render(): void {}
    // 当组件被启用时调用
    Compoment.prototype.onEnable = function () { };
    // 当组件被禁用时调用
    Compoment.prototype.onDisable = function () { };
    // 当组件被销毁时调用
    Compoment.prototype.onDestroy = function () { };
    return Compoment;
}());
exports.Compoment = Compoment;
},{}],4:[function(require,module,exports){
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
exports.Renderer = void 0;
var Compoment_1 = require("./Compoment");
// Renderer是所有渲染组件的基类
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._material = null;
        _this._sortingLayerID = 0;
        _this._sortingOrder = 0;
        return _this;
    }
    Object.defineProperty(Renderer.prototype, "material", {
        // 材质属性
        get: function () {
            return this._material;
        },
        set: function (value) {
            this._material = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "sortingLayerID", {
        // 排序层ID
        get: function () {
            return this._sortingLayerID;
        },
        set: function (value) {
            this._sortingLayerID = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "sortingOrder", {
        // 排序顺序
        get: function () {
            return this._sortingOrder;
        },
        set: function (value) {
            this._sortingOrder = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "shouldRender", {
        // 是否应该被渲染
        get: function () {
            return this.enabled && this.gameObject.active;
        },
        enumerable: false,
        configurable: true
    });
    return Renderer;
}(Compoment_1.Compoment));
exports.Renderer = Renderer;
},{"./Compoment":3}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"./Transfrom":17}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
    Logger.log = function (message) {
        this.push(message, LogType.Info);
    };
    Logger.warning = function (message) {
        this.push(message, LogType.Warning);
    };
    Logger.error = function (message) {
        this.push(message, LogType.Error);
    };
    Logger.push = function (message, type) {
        var log = {
            message: message,
            type: type
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
},{}],9:[function(require,module,exports){
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
},{"./Quaternion":10,"./Vector3":12,"./Vector4":13}],10:[function(require,module,exports){
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
},{"./Matrix4x4":9,"./Vector3":12}],11:[function(require,module,exports){
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
},{"./Vector3":12,"./Vector4":13}],12:[function(require,module,exports){
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
},{"./Vector2":11,"./Vector4":13}],13:[function(require,module,exports){
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
},{"./Vector2":11,"./Vector3":12}],14:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.RasterizationPipeline = void 0;
var Color_1 = require("./Color");
var Vector2_1 = require("./Math/Vector2");
var Vector3_1 = require("./Math/Vector3");
var Camera_1 = require("./Compoment/Camera");
var Config_1 = require("./Config");
var Vector4_1 = require("./Math/Vector4");
var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["Wireframe"] = 0] = "Wireframe";
    DrawMode[DrawMode["Point"] = 1] = "Point";
    DrawMode[DrawMode["Shader"] = 2] = "Shader";
})(DrawMode || (DrawMode = {}));
var RasterizationPipeline = /** @class */ (function () {
    function RasterizationPipeline(uint32View) {
        this.drawMode = DrawMode.Wireframe;
        this.uint32View = uint32View;
    }
    //#region 基础绘制接口
    RasterizationPipeline.prototype.Clear = function (color) {
        // 使用 fill 方法替代循环，性能更好
        this.uint32View.fill(color);
        // 或者使用循环，但性能较差
        // for (let x = 0; x < this.canvasWidth; x++) {
        //     for (let y = 0; y < this.canvasHeight; y++) {
        //         this.SetPixel(x, y, color);
        //     }
        // }
    };
    RasterizationPipeline.prototype.DrawPixel = function (x, y, color) {
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
    RasterizationPipeline.prototype.DrawLine = function (x1, y1, x2, y2, color) {
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
    RasterizationPipeline.prototype.DrawTriangle = function (x1, y1, x2, y2, x3, y3, color) {
        this.DrawLine(x1, y1, x2, y2, color);
        this.DrawLine(x2, y2, x3, y3, color);
        this.DrawLine(x3, y3, x1, y1, color);
    };
    RasterizationPipeline.prototype.DrawTriangleFilled = function (x1, y1, x2, y2, x3, y3, color) {
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
    RasterizationPipeline.prototype.DrawTriangleFilledWithVertexColor = function (x1, y1, x2, y2, x3, y3, color1, color2, color3) {
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
    RasterizationPipeline.prototype.ViewportToCanvas = function (point) {
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
    RasterizationPipeline.prototype.ProjectVertex = function (vertex) {
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
    RasterizationPipeline.prototype.VertexProcessingStage = function (obj) {
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
    RasterizationPipeline.prototype.EasyVertexProcessingStage = function (obj) {
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
    RasterizationPipeline.prototype.ScaleVertex = function (vertex, transform) {
        vertex.x *= transform.scale.x;
        vertex.y *= transform.scale.y;
        vertex.z *= transform.scale.z;
    };
    RasterizationPipeline.prototype.RotateVertex = function (vertex, transform) {
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
    RasterizationPipeline.prototype.TranslateVertex = function (vertex, transform) {
        vertex.x += transform.position.x;
        vertex.y += transform.position.y;
        vertex.z += transform.position.z;
    };
    //#endregion
    //#region 剔除裁剪
    // 视锥体剔除
    RasterizationPipeline.prototype.FrustumCulling = function () {
    };
    // 背面剔除
    RasterizationPipeline.prototype.BackfaceCulling = function () {
    };
    // 遮挡剔除
    RasterizationPipeline.prototype.OcclusionCulling = function () {
    };
    RasterizationPipeline.prototype.ClipTriangle = function (triangle) {
        // 1.计算三角形的中心
        var center = new Vector3_1.Vector3((triangle[0].x + triangle[1].x + triangle[2].x) / 3, (triangle[0].y + triangle[1].y + triangle[2].y) / 3, (triangle[0].z + triangle[1].z + triangle[2].z) / 3);
    };
    //#endregion
    //#region 绘制物体
    RasterizationPipeline.prototype.DrawObject = function (renderer) {
        var model = renderer.model;
        var indices = model.faces.flatMap(function (face) { return face.vertexIndices; });
        // 1.剔除
        this.FrustumCulling();
        this.BackfaceCulling();
        this.OcclusionCulling();
        // 2.变换
        // MVP变换
        var screenVertices = this.VertexProcessingStage(renderer);
        // 简单MVP变换
        // const screenVertices = this.EasyVertexProcessingStage(obj);
        // 3.裁剪
        // 4.光栅化与像素绘画
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
    RasterizationPipeline.prototype.Interpolate = function (a1, b1, a2, b2) {
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
    return RasterizationPipeline;
}());
exports.RasterizationPipeline = RasterizationPipeline;
},{"./Color":1,"./Compoment/Camera":2,"./Config":5,"./Math/Vector2":11,"./Math/Vector3":12,"./Math/Vector4":13}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"./Scene":15}],17:[function(require,module,exports){
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
},{"./Math/Matrix4x4":9,"./Math/Quaternion":10,"./Math/Vector3":12,"./Math/Vector4":13}],18:[function(require,module,exports){
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
var GameObject_1 = require("../GameObject");
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
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
                        instance = new GameObject_1.GameObject(name);
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
},{"../GameObject":6,"../Math/Quaternion":10,"../Math/Vector3":12,"./Dictionary":19,"./ObjParser":20}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{"../Math/Vector2":11,"../Math/Vector3":12}],21:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Camera_1 = require("./Compoment/Camera");
var Color_1 = require("./Color");
var Config_1 = require("./Config");
var Input_1 = require("./Input");
var Vector3_1 = require("./Math/Vector3");
var GameObject_1 = require("./GameObject");
var RasterizationPipeline_1 = require("./RasterizationPipeline");
var AssetLoader_1 = require("./Utils/AssetLoader");
var Logger_1 = require("./Logger");
var SceneManager_1 = require("./Scene/SceneManager");
var Renderer_1 = require("./Compoment/Renderer");
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
    // ctx.textBaseline = 'middle';
    // 创建图像数据对象
    var imageData = ctx.createImageData(Config_1.Config.canvasWidth, Config_1.Config.canvasHeight);
    // 创建32位无符号整型数组视图，用于直接操作像素数据
    var uint32View = new Uint32Array(imageData.data.buffer);
    // 创建渲染器实例
    var pipeline = new RasterizationPipeline_1.RasterizationPipeline(uint32View);
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
    camera.addComponent(Camera_1.Camera);
    var lee;
    // 加载模型
    AssetLoader_1.AssetLoader.loadInstanceFromModel('lee', 'resources/assets/meshes/lee.obj').then(function (instance) {
        lee = instance;
        instance.transform.position = new Vector3_1.Vector3(0, 0, 2);
        mainScene.addGameObject(lee);
    });
    AssetLoader_1.AssetLoader.loadInstanceFromModel('cube', 'resources/cube.obj').then(function (instance) {
        instance.transform.position = new Vector3_1.Vector3(2, 0, 0);
        instance.transform.scale = new Vector3_1.Vector3(0.1, 0.1, 0.1);
        instance.transform.setParent(lee.transform, false);
        mainScene.addGameObject(instance);
    });
}
var angle = 0;
function Update() {
    var _a;
    // 使用场景的update方法更新所有游戏对象
    (_a = SceneManager_1.SceneManager.instance.getActiveScene()) === null || _a === void 0 ? void 0 : _a.update();
    // 其他特定的更新逻辑
    // for (const instance of instances) {
    //     if (instance.name == "cube") {
    //         // 使用sin函数实现缩放在0.9到1.1之间循环
    //         const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
    //         const scale = instance.transform.scale;
    //         scale.x = scaleOffset;
    //         scale.y = scaleOffset;
    //         scale.z = scaleOffset;
    //         instance.transform.scale = scale;
    //         instance.transform.rotation = Quaternion.angleAxis(angle, Vector3.FORWARD);
    //         angle += 1;
    //         continue;
    //     }
    //     // 让物体在所有轴上旋转
    //     instance.transform.rotation = Quaternion.angleAxis(angle, Vector3.UP);
    // }
}
function Render(renderer) {
    var _a;
    renderer.Clear(Color_1.Color.BLACK);
    // 获取场景中的所有根游戏对象并渲染
    var rootObjects = (_a = SceneManager_1.SceneManager.instance.getActiveScene()) === null || _a === void 0 ? void 0 : _a.getRootGameObjects();
    if (rootObjects) {
        for (var _i = 0, rootObjects_1 = rootObjects; _i < rootObjects_1.length; _i++) {
            var gameObject = rootObjects_1[_i];
            // 检查游戏对象是否有renderer组件
            if (gameObject.getComponent(Renderer_1.Renderer)) {
                renderer.DrawObject(gameObject);
            }
        }
    }
}
},{"./Color":1,"./Compoment/Camera":2,"./Compoment/Renderer":4,"./Config":5,"./GameObject":6,"./Input":7,"./Logger":8,"./Math/Vector3":12,"./RasterizationPipeline":14,"./Scene/SceneManager":16,"./Utils/AssetLoader":18}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvQ29tcG9tZW50L0NhbWVyYS50cyIsInNyYy9Db21wb21lbnQvQ29tcG9tZW50LnRzIiwic3JjL0NvbXBvbWVudC9SZW5kZXJlci50cyIsInNyYy9Db25maWcudHMiLCJzcmMvR2FtZU9iamVjdC50cyIsInNyYy9JbnB1dC50cyIsInNyYy9Mb2dnZXIudHMiLCJzcmMvTWF0aC9NYXRyaXg0eDQudHMiLCJzcmMvTWF0aC9RdWF0ZXJuaW9uLnRzIiwic3JjL01hdGgvVmVjdG9yMi50cyIsInNyYy9NYXRoL1ZlY3RvcjMudHMiLCJzcmMvTWF0aC9WZWN0b3I0LnRzIiwic3JjL1Jhc3Rlcml6YXRpb25QaXBlbGluZS50cyIsInNyYy9TY2VuZS9TY2VuZS50cyIsInNyYy9TY2VuZS9TY2VuZU1hbmFnZXIudHMiLCJzcmMvVHJhbnNmcm9tLnRzIiwic3JjL1V0aWxzL0Fzc2V0TG9hZGVyLnRzIiwic3JjL1V0aWxzL0RpY3Rpb25hcnkudHMiLCJzcmMvVXRpbHMvT2JqUGFyc2VyLnRzIiwic3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7SUFrQkksZUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFlO1FBQWYsa0JBQUEsRUFBQSxPQUFlO1FBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVNLHdCQUFRLEdBQWY7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDbkMsT0FBTyxJQUFJLEtBQUssQ0FDWixNQUFNLEdBQUcsSUFBSSxFQUNiLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFDcEIsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUNyQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQ3hCLENBQUM7SUFDTixDQUFDO0lBbkNzQixXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QyxXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxVQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxTQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QyxVQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN2QyxZQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxVQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QyxhQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QyxZQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQyxZQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQTBCdEUsWUFBQztDQXJDRCxBQXFDQyxJQUFBO0FBckNZLHNCQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBbEIsa0NBQWlDO0FBQ2pDLHlDQUF3QztBQUN4QyxvQ0FBbUM7QUFDbkMsMkNBQTBDO0FBRTFDLElBQVksZ0JBS1g7QUFMRCxXQUFZLGdCQUFnQjtJQUN4Qix1REFBUSxDQUFBO0lBQ1IseURBQWlCLENBQUE7SUFDakIsNkRBQWEsQ0FBQTtJQUNiLDJEQUFXLENBQUE7QUFDZixDQUFDLEVBTFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFLM0I7QUFFRDtJQUE0QiwwQkFBUztJQUFyQztRQUFBLHFFQXNDQztRQWxDVSxxQkFBZSxHQUFVLElBQUksYUFBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFELGNBQVEsR0FBVSxJQUFJLGFBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuRCxnQkFBVSxHQUFxQixnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBQy9FLGNBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsYUFBTyxHQUFXLEdBQUcsQ0FBQztRQUN0QixTQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ2pCLFdBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsY0FBUSxHQUFZLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7SUEyQnZELENBQUM7SUF6Qkcsc0JBQVcsMEJBQU07YUFBakI7WUFDSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3BFLENBQUM7OztPQUFBO0lBRU0sc0JBQUssR0FBWjtRQUNJLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDM0IsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDNUI7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sMEJBQVMsR0FBaEI7UUFDSSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDWixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFO1lBQzNCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDekIsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFFdEMsTUFBTSxDQUFDLFVBQVUsR0FBRyxTQUE4QixDQUFDO1NBQzFEO0lBQ0wsQ0FBQztJQW5DYyxjQUFPLEdBQWtCLElBQUksS0FBSyxFQUFVLENBQUM7SUFvQ2hFLGFBQUM7Q0F0Q0QsQUFzQ0MsQ0F0QzJCLHFCQUFTLEdBc0NwQztBQXRDWSx3QkFBTTs7Ozs7QUNUbkI7SUFvQkksbUJBQVksVUFBc0I7UUFiMUIsYUFBUSxHQUFZLElBQUksQ0FBQztRQWM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQXBCRCxzQkFBVyxnQ0FBUzthQUFwQjtZQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDckMsQ0FBQzs7O09BQUE7SUFHRCxzQkFBVyw4QkFBTzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDO2FBQ0QsVUFBbUIsS0FBYztZQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLEtBQUssRUFBRTtnQkFDUCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3BCO1FBQ0wsQ0FBQzs7O09BUkE7SUFlRCxTQUFTO0lBQ1QsWUFBWTtJQUNMLHlCQUFLLEdBQVosY0FBc0IsQ0FBQztJQUV2QixjQUFjO0lBQ1AseUJBQUssR0FBWixjQUFzQixDQUFDO0lBRXZCLFVBQVU7SUFDSCwwQkFBTSxHQUFiLGNBQXVCLENBQUM7SUFFeEIsVUFBVTtJQUNWLDhCQUE4QjtJQUU5QixPQUFPO0lBQ1AsMEJBQTBCO0lBRTFCLFlBQVk7SUFDTCw0QkFBUSxHQUFmLGNBQXlCLENBQUM7SUFFMUIsWUFBWTtJQUNMLDZCQUFTLEdBQWhCLGNBQTBCLENBQUM7SUFFM0IsWUFBWTtJQUNMLDZCQUFTLEdBQWhCLGNBQTBCLENBQUM7SUFDL0IsZ0JBQUM7QUFBRCxDQWpEQSxBQWlEQyxJQUFBO0FBakRxQiw4QkFBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSC9CLHlDQUF3QztBQUl4QyxxQkFBcUI7QUFDckI7SUFBdUMsNEJBQVM7SUFBaEQ7UUFBQSxxRUF1Q0M7UUF0Q1csZUFBUyxHQUFvQixJQUFJLENBQUM7UUFDbEMscUJBQWUsR0FBVyxDQUFDLENBQUM7UUFDNUIsbUJBQWEsR0FBVyxDQUFDLENBQUM7O0lBb0N0QyxDQUFDO0lBakNHLHNCQUFXLDhCQUFRO1FBRG5CLE9BQU87YUFDUDtZQUNJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO2FBRUQsVUFBb0IsS0FBc0I7WUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDM0IsQ0FBQzs7O09BSkE7SUFPRCxzQkFBVyxvQ0FBYztRQUR6QixRQUFRO2FBQ1I7WUFDSSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDaEMsQ0FBQzthQUVELFVBQTBCLEtBQWE7WUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDakMsQ0FBQzs7O09BSkE7SUFPRCxzQkFBVyxrQ0FBWTtRQUR2QixPQUFPO2FBQ1A7WUFDSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDOUIsQ0FBQzthQUVELFVBQXdCLEtBQWE7WUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDL0IsQ0FBQzs7O09BSkE7SUFPRCxzQkFBVyxrQ0FBWTtRQUR2QixVQUFVO2FBQ1Y7WUFDSSxPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDbEQsQ0FBQzs7O09BQUE7SUFJTCxlQUFDO0FBQUQsQ0F2Q0EsQUF1Q0MsQ0F2Q3NDLHFCQUFTLEdBdUMvQztBQXZDcUIsNEJBQVE7Ozs7O0FDTDlCO0lBQUE7SUFNQSxDQUFDO0lBTGlCLGtCQUFXLEdBQVcsR0FBRyxDQUFDO0lBQzFCLG1CQUFZLEdBQVcsR0FBRyxDQUFDO0lBQzNCLHNCQUFlLEdBQVcsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7SUFDbEQsdUJBQWdCLEdBQVcsTUFBTSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7SUFDcEQsa0JBQVcsR0FBVyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDakYsYUFBQztDQU5ELEFBTUMsSUFBQTtBQU5ZLHdCQUFNOzs7OztBQ0NuQix5Q0FBd0M7QUFLeEM7SUFTSSxvQkFBWSxJQUFZO1FBTmpCLFFBQUcsR0FBVyxVQUFVLENBQUMsQ0FBQyxTQUFTO1FBQ25DLFVBQUssR0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBRXhCLGVBQVUsR0FBZ0IsRUFBRSxDQUFDO1FBQzdCLHNCQUFpQixHQUFtQixJQUFJLEdBQUcsRUFBYSxDQUFDO1FBT3pELFlBQU8sR0FBWSxJQUFJLENBQUM7UUFKNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUlELHNCQUFXLDhCQUFNO1FBY2pCLHdCQUF3QjthQUN4QjtZQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUVoQyxhQUFhO1lBQ2IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDbkMsT0FBTyxNQUFNLEVBQUU7Z0JBQ1gsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUMzQyxJQUFJLGdCQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO29CQUM5QyxPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDMUI7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBOUJELGNBQWM7YUFDZCxVQUFrQixLQUFjO1lBQzVCLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUVyQixhQUFhO2dCQUNiLEtBQXdCLFVBQWUsRUFBZixLQUFBLElBQUksQ0FBQyxVQUFVLEVBQWYsY0FBZSxFQUFmLElBQWUsRUFBRTtvQkFBcEMsSUFBTSxTQUFTLFNBQUE7b0JBQ2hCLElBQUksS0FBSyxFQUFFO3dCQUNQLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDeEI7eUJBQU07d0JBQ0gsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO3FCQUN6QjtpQkFDSjthQUNKO1FBQ0wsQ0FBQzs7O09BQUE7SUFrQkQseUJBQXlCO0lBQ2xCLG9DQUFlLEdBQXRCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUV6QixLQUF3QixVQUFlLEVBQWYsS0FBQSxJQUFJLENBQUMsVUFBVSxFQUFmLGNBQWUsRUFBZixJQUFlLEVBQUU7WUFBcEMsSUFBTSxTQUFTLFNBQUE7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtnQkFDN0QsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNsQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0o7UUFFRCwwQkFBMEI7UUFDMUIsS0FBb0IsVUFBdUIsRUFBdkIsS0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUIsRUFBRTtZQUF4QyxJQUFNLEtBQUssU0FBQTtZQUNaLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDbEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN0QztTQUNKO0lBQ0wsQ0FBQztJQUVELFNBQVM7SUFDRixxQ0FBZ0IsR0FBdkI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPO1FBRXpCLEtBQXdCLFVBQWUsRUFBZixLQUFBLElBQUksQ0FBQyxVQUFVLEVBQWYsY0FBZSxFQUFmLElBQWUsRUFBRTtZQUFwQyxJQUFNLFNBQVMsU0FBQTtZQUNoQixJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ25CLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN0QjtTQUNKO1FBRUQsMkJBQTJCO1FBQzNCLEtBQW9CLFVBQXVCLEVBQXZCLEtBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCLEVBQUU7WUFBeEMsSUFBTSxLQUFLLFNBQUE7WUFDWixJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQ2xCLEtBQUssQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN2QztTQUNKO0lBQ0wsQ0FBQztJQUVELE9BQU87SUFDQSxpQ0FBWSxHQUFuQixVQUF5QyxJQUF3QztRQUM3RSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNkLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxZQUFZO0lBQ0wsaUNBQVksR0FBbkIsVUFBeUMsYUFBZ0Q7UUFDckYsS0FBd0IsVUFBZSxFQUFmLEtBQUEsSUFBSSxDQUFDLFVBQVUsRUFBZixjQUFlLEVBQWYsSUFBZSxFQUFFO1lBQXBDLElBQU0sU0FBUyxTQUFBO1lBQ2hCLElBQUksU0FBUyxZQUFZLGFBQWEsRUFBRTtnQkFDcEMsT0FBTyxTQUFjLENBQUM7YUFDekI7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxjQUFjO0lBQ1Asa0NBQWEsR0FBcEIsVUFBMEMsYUFBZ0Q7UUFDdEYsSUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLEtBQXdCLFVBQWUsRUFBZixLQUFBLElBQUksQ0FBQyxVQUFVLEVBQWYsY0FBZSxFQUFmLElBQWUsRUFBRTtZQUFwQyxJQUFNLFNBQVMsU0FBQTtZQUNoQixJQUFJLFNBQVMsWUFBWSxhQUFhLEVBQUU7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBYyxDQUFDLENBQUM7YUFDL0I7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxZQUFZO0lBQ0wsMkNBQXNCLEdBQTdCLFVBQW1ELElBQStCO1FBQzlFLFFBQVE7UUFDUixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNkLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxVQUFVO1FBQ1YsS0FBb0IsVUFBdUIsRUFBdkIsS0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUIsRUFBRTtZQUF4QyxJQUFNLEtBQUssU0FBQTtZQUNaLElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDekMsSUFBSSxlQUFlLEVBQUU7Z0JBQ2pCLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtvQkFDbkIsT0FBTyxTQUFTLENBQUM7aUJBQ3BCO2dCQUVELGNBQWM7Z0JBQ2QsSUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuRSxJQUFJLGFBQWEsSUFBSSxJQUFJLEVBQUU7b0JBQ3ZCLE9BQU8sYUFBYSxDQUFDO2lCQUN4QjthQUNKO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsY0FBYztJQUNQLDRDQUF1QixHQUE5QixVQUFvRCxJQUErQjtRQUMvRSxJQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7UUFFdkIsVUFBVTtRQUNWLE1BQU0sQ0FBQyxJQUFJLE9BQVgsTUFBTSxFQUFTLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFFekMsVUFBVTtRQUNWLEtBQW9CLFVBQXVCLEVBQXZCLEtBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCLEVBQUU7WUFBeEMsSUFBTSxLQUFLLFNBQUE7WUFDWiwrQkFBK0I7WUFDL0IsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxJQUFJLGVBQWUsRUFBRTtnQkFDakIsZUFBZTtnQkFDZixNQUFNLENBQUMsSUFBSSxPQUFYLE1BQU0sRUFBUyxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUU7YUFDakU7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxPQUFPO0lBQ0Esb0NBQWUsR0FBdEIsVUFBNEMsSUFBK0I7UUFDdkUsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLFlBQVksSUFBSSxFQUF6QixDQUF5QixDQUFDLENBQUM7UUFDaEYsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCx3QkFBd0I7SUFDVixlQUFJLEdBQWxCLFVBQW1CLElBQVk7UUFDM0IsU0FBUztRQUNULHdCQUF3QjtRQUN4QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsMkJBQTJCO0lBQ2Isc0JBQVcsR0FBekIsVUFBMEIsR0FBVztRQUNqQyxTQUFTO1FBQ1QsWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCwwQkFBMEI7SUFDWixpQ0FBc0IsR0FBcEMsVUFBcUMsR0FBVztRQUM1QyxTQUFTO1FBQ1QsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsb0JBQW9CO0lBQ04sMkJBQWdCLEdBQTlCLFVBQW9ELElBQStCO1FBQy9FLFNBQVM7UUFDVCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsbUJBQW1CO0lBQ0wsNEJBQWlCLEdBQS9CLFVBQXFELElBQStCO1FBQ2hGLFNBQVM7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxlQUFlO0lBQ0Qsc0JBQVcsR0FBekIsVUFBMEIsUUFBb0IsRUFBRSxRQUFrQixFQUFFLFFBQXFCO1FBQ3JGLFdBQVc7UUFDWCxJQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUMsT0FBTztRQUNQLEtBQUssQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUN6QixLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDN0IsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRS9CLGdCQUFnQjtRQUNoQixJQUFJLFFBQVEsRUFBRTtZQUNWLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUN2QztRQUVELElBQUksUUFBUSxFQUFFO1lBQ1YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1NBQ3ZDO1FBRUQsb0JBQW9CO1FBRXBCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTO0lBQ0YsNEJBQU8sR0FBZDtRQUNJLHFCQUFxQjtRQUNyQixLQUF3QixVQUFlLEVBQWYsS0FBQSxJQUFJLENBQUMsVUFBVSxFQUFmLGNBQWUsRUFBZixJQUFlLEVBQUU7WUFBcEMsSUFBTSxTQUFTLFNBQUE7WUFDaEIsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3pCO1FBQ0Qsc0JBQXNCO0lBQzFCLENBQUM7SUFDTCxpQkFBQztBQUFELENBL09BLEFBK09DLElBQUE7QUEvT1ksZ0NBQVU7Ozs7O0FDTnZCO0lBQUE7SUFJQSxDQUFDO0lBSGlCLFlBQU0sR0FBVyxDQUFDLENBQUM7SUFDbkIsWUFBTSxHQUFXLENBQUMsQ0FBQztJQUNuQixZQUFNLEdBQVcsQ0FBQyxDQUFDO0lBQ3JDLFlBQUM7Q0FKRCxBQUlDLElBQUE7QUFKWSxzQkFBSzs7Ozs7O0FDQWxCLElBQUssT0FJSjtBQUpELFdBQUssT0FBTztJQUNSLHFDQUFJLENBQUE7SUFDSiwyQ0FBTyxDQUFBO0lBQ1AsdUNBQUssQ0FBQTtBQUNULENBQUMsRUFKSSxPQUFPLEtBQVAsT0FBTyxRQUlYO0FBT0Q7SUFBQTtJQXFDQSxDQUFDO0lBNUJVLGdCQUFTLEdBQWhCLFVBQWlCLEdBQTZCO1FBQzFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLFVBQUcsR0FBVixVQUFXLE9BQWU7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTSxjQUFPLEdBQWQsVUFBZSxPQUFlO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sWUFBSyxHQUFaLFVBQWEsT0FBZTtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVjLFdBQUksR0FBbkIsVUFBb0IsT0FBZSxFQUFFLElBQWE7UUFDOUMsSUFBTSxHQUFHLEdBQVM7WUFDZCxPQUFPLFNBQUE7WUFDUCxJQUFJLE1BQUE7U0FDUCxDQUFBO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQW5DYyxXQUFJLEdBQVcsRUFBRSxDQUFDO0lBRVQsZ0JBQVM7UUFDN0IsR0FBQyxPQUFPLENBQUMsSUFBSSxJQUFHLE9BQU87UUFDdkIsR0FBQyxPQUFPLENBQUMsT0FBTyxJQUFHLFFBQVE7UUFDM0IsR0FBQyxPQUFPLENBQUMsS0FBSyxJQUFHLEtBQUs7WUFDeEI7SUE4Qk4sYUFBQztDQXJDRCxBQXFDQyxJQUFBO0FBckNZLHdCQUFNOzs7OztBQ1huQixxQ0FBb0M7QUFDcEMscUNBQW9DO0FBQ3BDLDJDQUEwQztBQUUxQztJQU1JO1FBSk8sV0FBTSxHQUF5QixJQUFJLEtBQUssRUFBaUIsQ0FBQztRQUs3RCxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQVksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUQ7U0FDSjthQUNJO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNsRDtTQUNKO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDBCQUFNLEdBQWIsVUFBYyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDZCQUFTLEdBQWhCLFVBQWlCLEtBQWE7UUFDMUIsT0FBTyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ25ILENBQUM7SUFFTSwwQkFBTSxHQUFiLFVBQWMsS0FBYSxFQUFFLEdBQVk7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSw2QkFBUyxHQUFoQixVQUFpQixLQUFhLEVBQUUsTUFBZTtRQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLDRCQUFRLEdBQWYsVUFBZ0IsQ0FBWTtRQUN4QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxnQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUU3QixnREFBZ0Q7SUFDaEQsZ0dBQWdHO0lBQ2hHLGdEQUFnRDtJQUVoRCxtRkFBbUY7SUFDbkYsSUFBSTtJQUVHLDZCQUFTLEdBQWhCO1FBQ0ksc0JBQXNCO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7UUFDN0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsMkJBQTJCO1lBQ3ZDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNKO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFDSSxpRUFBaUU7UUFDakUsZ0NBQWdDO1FBQ2hDLGdEQUFnRDtRQUNoRCxZQUFZO1FBRVosSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUViLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxrQ0FBYyxHQUFyQjtRQUNJLGlFQUFpRTtRQUNqRSxhQUFhO1FBQ2IsWUFBWTtRQUVaLElBQUksS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBRTFCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3hCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDMUIsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLEVBQUU7WUFDM0IsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0gsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLGlCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVMsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENB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QUFJLENBQUMsTUFBTSxDQUFDO1FBRXRCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM1RCxlQUFlO1NBQ2xCO1FBRUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFH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Q0FBQztJQUN4QyxDQUFDO0lBRWEsNEJBQWtCLEdBQWhDLFVBQWlDLEdBQVk7UUFDekMsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHFDQUEyQixHQUF6QyxVQUEwQyxDQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUFDO1FBQ1QsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRWEsd0JBQWMsR0FBNUIsVUFBNkIsQ0FBVTtRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsc0JBQWtCLHFCQUFRO2FBQTFCO1lBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENB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RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUMsa0NBQWtDO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMs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OiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdISVRFID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMQUNLID0gbmV3IENvbG9yKDAsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSQVkgPSBuZXcgQ29sb3IoMTI4LCAxMjgsIDEyOCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVEID0gbmV3IENvbG9yKDI1NSwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JFRU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTFVFID0gbmV3IENvbG9yKDAsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgWUVMTE9XID0gbmV3IENvbG9yKDI1NSwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDWUFOID0gbmV3IENvbG9yKDAsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQUdFTlRBID0gbmV3IENvbG9yKDI1NSwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBPUkFOR0UgPSBuZXcgQ29sb3IoMjU1LCAxNjUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBVUlBMRSA9IG5ldyBDb2xvcigxMjgsIDAsIDEyOCkuVG9VaW50MzIoKTtcclxuXHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlciA9IDI1NSkge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRvVWludDMyKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5hIDw8IDI0KSB8ICh0aGlzLmIgPDwgMTYpIHwgKHRoaXMuZyA8PCA4KSB8IHRoaXMucjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZyb21VaW50MzIodWludDMyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICB1aW50MzIgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDgpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAxNikgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDI0KSAmIDB4RkZcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgQ29tcG9tZW50IH0gZnJvbSBcIi4vQ29tcG9tZW50XCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9Db25maWdcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBlbnVtIENhbWVyYUNsZWFyRmxhZ3Mge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBBTEwgPSAxNjM4NCB8IDI1NixcclxuICAgIENvbG9yID0gMTYzODQsICAvL2dsLkNPTE9SX0JVRkZFUl9CSVRcclxuICAgIERlcHRoID0gMjU2LCAgICAvL2dsLkRFUFRIX0JVRkZFUl9CSVRcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbWVyYSBleHRlbmRzIENvbXBvbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1haW5DYW1lcmE6IENhbWVyYTtcclxuICAgIHByaXZhdGUgc3RhdGljIGNhbWVyYXM6IEFycmF5PENhbWVyYT4gPSBuZXcgQXJyYXk8Q2FtZXJhPigpO1xyXG5cclxuICAgIHB1YmxpYyBiYWNrR3JvdW5kQ29sb3I6IENvbG9yID0gbmV3IENvbG9yKDAuMjcsIDAuMjcsIDAuMjcsIDEuMCk7XHJcbiAgICBwdWJsaWMgZm9nQ29sb3I6IENvbG9yID0gbmV3IENvbG9yKDAuMjcsIDAuMjcsIDAuMjcsIDEuMCk7XHJcbiAgICBwdWJsaWMgY2xlYXJGbGFnczogQ2FtZXJhQ2xlYXJGbGFncyA9IENhbWVyYUNsZWFyRmxhZ3MuQ29sb3IgfCBDYW1lcmFDbGVhckZsYWdzLkRlcHRoO1xyXG4gICAgcHVibGljIG5lYXJDbGlwOiBudW1iZXIgPSAxO1xyXG4gICAgcHVibGljIGZhckNsaXA6IG51bWJlciA9IDEyODtcclxuICAgIHB1YmxpYyBmb3Y6IG51bWJlciA9IDYwO1xyXG4gICAgcHVibGljIGRlcHRoOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHZpZXdQb3J0OiBWZWN0b3I0ID0gbmV3IFZlY3RvcjQoMCwgMCwgMSwgMSk7XHJcblxyXG4gICAgcHVibGljIGdldCBhc3BlY3QoKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgdiA9IHRoaXMudmlld1BvcnQ7XHJcbiAgICAgICAgcmV0dXJuICh2LnogKiBDb25maWcuY2FudmFzV2lkdGgpIC8gKHYudyAqIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhd2FrZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAoQ2FtZXJhLm1haW5DYW1lcmEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBDYW1lcmEubWFpbkNhbWVyYSA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIENhbWVyYS5jYW1lcmFzLnB1c2godGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSgpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBDYW1lcmEuY2FtZXJhcy5pbmRleE9mKHRoaXMsIDApO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIENhbWVyYS5jYW1lcmFzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQ2FtZXJhLm1haW5DYW1lcmEgPT0gdGhpcykge1xyXG4gICAgICAgICAgICBpZiAoQ2FtZXJhLmNhbWVyYXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gQ2FtZXJhLmNhbWVyYXNbMF07XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gdW5kZWZpbmVkIGFzIHVua25vd24gYXMgQ2FtZXJhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vVHJhbnNmcm9tXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9tZW50IHtcclxuICAgIHB1YmxpYyByZWFkb25seSBnYW1lT2JqZWN0OiBHYW1lT2JqZWN0O1xyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHRyYW5zZm9ybSgpOiBUcmFuc2Zvcm0ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVPYmplY3QudHJhbnNmb3JtO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgZW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkVuYWJsZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25EaXNhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgICAgIHRoaXMuYXdha2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlJ/lkb3lkajmnJ/mlrnms5VcclxuICAgIC8vIOW9k+e7hOS7tuiiq+WIm+W7uuaXtuiwg+eUqFxyXG4gICAgcHVibGljIGF3YWtlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5Zyo5ZCv55So57uE5Lu255qE56ys5LiA5bin6LCD55SoXHJcbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDmr4/luKfmm7TmlrDliY3osIPnlKhcclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDmr4/luKfmm7TmlrDlkI7osIPnlKhcclxuICAgIC8vcHVibGljIGxhdGVVcGRhdGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDnlKjkuo7muLLmn5NcclxuICAgIC8vcHVibGljIHJlbmRlcigpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOW9k+e7hOS7tuiiq+WQr+eUqOaXtuiwg+eUqFxyXG4gICAgcHVibGljIG9uRW5hYmxlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5b2T57uE5Lu26KKr56aB55So5pe26LCD55SoXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5b2T57uE5Lu26KKr6ZSA5q+B5pe26LCD55SoXHJcbiAgICBwdWJsaWMgb25EZXN0cm95KCk6IHZvaWQge31cclxufSIsImltcG9ydCB7IENvbXBvbWVudCB9IGZyb20gXCIuL0NvbXBvbWVudFwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tIFwiLi4vTWF0ZXJpYWxcIjtcclxuXHJcbi8vIFJlbmRlcmVy5piv5omA5pyJ5riy5p+T57uE5Lu255qE5Z+657G7XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZW5kZXJlciBleHRlbmRzIENvbXBvbWVudCB7XHJcbiAgICBwcml2YXRlIF9tYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3NvcnRpbmdMYXllcklEOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfc29ydGluZ09yZGVyOiBudW1iZXIgPSAwO1xyXG4gICAgXHJcbiAgICAvLyDmnZDotKjlsZ7mgKdcclxuICAgIHB1YmxpYyBnZXQgbWF0ZXJpYWwoKTogTWF0ZXJpYWwgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXQgbWF0ZXJpYWwodmFsdWU6IE1hdGVyaWFsIHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOaOkuW6j+WxgklEXHJcbiAgICBwdWJsaWMgZ2V0IHNvcnRpbmdMYXllcklEKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvcnRpbmdMYXllcklEO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0IHNvcnRpbmdMYXllcklEKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zb3J0aW5nTGF5ZXJJRCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmjpLluo/pobrluo9cclxuICAgIHB1YmxpYyBnZXQgc29ydGluZ09yZGVyKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvcnRpbmdPcmRlcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldCBzb3J0aW5nT3JkZXIodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NvcnRpbmdPcmRlciA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmmK/lkKblupTor6XooqvmuLLmn5NcclxuICAgIHB1YmxpYyBnZXQgc2hvdWxkUmVuZGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuYWJsZWQgJiYgdGhpcy5nYW1lT2JqZWN0LmFjdGl2ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5riy5p+T5pa55rOV77yM5a2Q57G76ZyA6KaB5a6e546wXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyKCk6IHZvaWQ7XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FudmFzV2lkdGg6IG51bWJlciA9IDQwMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FudmFzSGVpZ2h0OiBudW1iZXIgPSA0MDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGhhbGZDYW52YXNXaWR0aDogbnVtYmVyID0gQ29uZmlnLmNhbnZhc1dpZHRoID4+IDE7XHJcbiAgICBwdWJsaWMgc3RhdGljIGhhbGZDYW52YXNIZWlnaHQ6IG51bWJlciA9IENvbmZpZy5jYW52YXNIZWlnaHQgPj4gMTtcclxuICAgIHB1YmxpYyBzdGF0aWMgYXNwZWN0UmF0aW86IG51bWJlciA9IENvbmZpZy5jYW52YXNXaWR0aCAvIENvbmZpZy5jYW52YXNIZWlnaHQ7XHJcbn0iLCJpbXBvcnQgeyBPQkpNb2RlbCB9IGZyb20gXCIuL01vZGVsXCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZnJvbVwiO1xyXG5pbXBvcnQgeyBDb21wb21lbnQgfSBmcm9tIFwiLi9Db21wb21lbnQvQ29tcG9tZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHB1YmxpYyB0YWc6IHN0cmluZyA9IFwiVW50YWdnZWRcIjsgLy8g5re75Yqg5qCH562+5bGe5oCnXHJcbiAgICBwdWJsaWMgbGF5ZXI6IG51bWJlciA9IDA7IC8vIOm7mOiupOWxglxyXG5cclxuICAgIHByaXZhdGUgY29tcG9uZW50czogQ29tcG9tZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhcnRlZENvbXBvbmVudHM6IFNldDxDb21wb21lbnQ+ID0gbmV3IFNldDxDb21wb21lbnQ+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0odGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8vIOiuvue9rua4uOaIj+WvueixoeeahOa/gOa0u+eKtuaAgVxyXG4gICAgcHVibGljIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOWkhOeQhue7hOS7tueahOWQr+eUqC/npoHnlKhcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub25FbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm9uRGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g5qOA5p+l5ri45oiP5a+56LGh5piv5ZCm5aSE5LqO5rS75Yqo54q25oCB77yI6ICD6JmR54i25a+56LGh77yJXHJcbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOajgOafpeeItuWvueixoeeahOa/gOa0u+eKtuaAgVxyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRyYW5zZm9ybS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRHYW1lT2JqZWN0ID0gcGFyZW50LmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRHYW1lT2JqZWN0ICYmICFwYXJlbnRHYW1lT2JqZWN0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiwg+eUqOaJgOaciee7hOS7tueahFN0YXJ05pa55rOV77yI5aaC5p6c5bCa5pyq6LCD55So77yJXHJcbiAgICBwdWJsaWMgc3RhcnRDb21wb25lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWRDb21wb25lbnRzLmhhcyhjb21wb25lbnQpICYmIGNvbXBvbmVudC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRlZENvbXBvbmVudHMuYWRkKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g6YCS5b2S6LCD55So5a2Q5a+56LGh55qEc3RhcnRDb21wb25lbnRzXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZ2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZ2FtZU9iamVjdC5zdGFydENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDmm7TmlrDmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyB1cGRhdGVDb21wb25lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g6YCS5b2S6LCD55So5a2Q5a+56LGh55qEdXBkYXRlQ29tcG9uZW50c1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmdhbWVPYmplY3QudXBkYXRlQ29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOa3u+WKoOe7hOS7tlxyXG4gICAgcHVibGljIGFkZENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9tZW50Pih0eXBlOiB7IG5ldyhnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogVCB9KTogVCB7XHJcbiAgICAgICAgdmFyIGNvbXAgPSB0aGlzLmdldENvbXBvbmVudCh0eXBlKTtcclxuICAgICAgICBpZiAoY29tcCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbXAgPSBuZXcgdHlwZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21wO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluaMh+Wumuexu+Wei+eahOe7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9tZW50Pihjb21wb25lbnRUeXBlOiBuZXcgKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpID0+IFQpOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IGFzIFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5omA5pyJ5oyH5a6a57G75Z6L55qE57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50czxUIGV4dGVuZHMgQ29tcG9tZW50Pihjb21wb25lbnRUeXBlOiBuZXcgKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpID0+IFQpOiBUW10ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVFtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjb21wb25lbnQgYXMgVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blrZDoioLngrnkuIrnmoTnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb21lbnQ+KHR5cGU6IG5ldyAoLi4uYXJnczogYW55W10pID0+IFQpOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5YWI5qOA5p+l6Ieq6LqrXHJcbiAgICAgICAgY29uc3QgY29tcCA9IHRoaXMuZ2V0Q29tcG9uZW50KHR5cGUpO1xyXG4gICAgICAgIGlmIChjb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR2FtZU9iamVjdCA9IGNoaWxkLmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZEdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkQ29tcCA9IGNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnQodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRDb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRDb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOmAkuW9kuajgOafpeWtkOiKgueCueeahOWtkOiKgueCuVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVlcENoaWxkQ29tcCA9IGNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnRJbkNoaWxkcmVuKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlZXBDaGlsZENvbXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2hpbGRDb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blrZDoioLngrnkuIrnmoTmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzSW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9tZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVFtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDmt7vliqDoh6rouqvnmoTnu4Tku7ZcclxuICAgICAgICByZXN1bHQucHVzaCguLi50aGlzLmdldENvbXBvbmVudHModHlwZSkpO1xyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuavj+S4qlRyYW5zZm9ybemDveacieWvueW6lOeahEdhbWVPYmplY3RcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHYW1lT2JqZWN0ID0gY2hpbGQuZ2FtZU9iamVjdDtcclxuICAgICAgICAgICAgaWYgKGNoaWxkR2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgLy8g6YCS5b2S6I635Y+W5a2Q6IqC54K555qE5omA5pyJ57uE5Lu2XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4odHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOenu+mZpOe7hOS7tlxyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9tZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmNvbXBvbmVudHMuZmluZEluZGV4KGNvbXBvbmVudCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiB0eXBlKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5vbkRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5ZCN56ew5p+l5om+R2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kKG5hbWU6IHN0cmluZyk6IEdhbWVPYmplY3QgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICAvLyDov5npnIDopoHkuIDkuKrlhajlsYDnmoRHYW1lT2JqZWN05rOo5YaM6KGoXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5qCH562+5p+l5om+56ys5LiA5LiqR2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kV2l0aFRhZyh0YWc6IHN0cmluZyk6IEdhbWVPYmplY3QgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICAvLyDov5npnIDopoHkuIDkuKrmoIfnrb7ns7vnu59cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4fmoIfnrb7mn6Xmib7miYDmnIlHYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRHYW1lT2JqZWN0c1dpdGhUYWcodGFnOiBzdHJpbmcpOiBHYW1lT2JqZWN0W10ge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrmn6Xmib7nibnlrprnsbvlnovnmoTnrKzkuIDkuKrnu4Tku7ZcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZE9iamVjdE9mVHlwZTxUIGV4dGVuZHMgQ29tcG9tZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8muafpeaJvueJueWumuexu+Wei+eahOaJgOaciee7hOS7tlxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kT2JqZWN0c09mVHlwZTxUIGV4dGVuZHMgQ29tcG9tZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVFtdIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya5a6e5L6L5YyW5ri45oiP5a+56LGhXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKG9yaWdpbmFsOiBHYW1lT2JqZWN0LCBwb3NpdGlvbj86IFZlY3RvcjMsIHJvdGF0aW9uPzogUXVhdGVybmlvbik6IEdhbWVPYmplY3Qge1xyXG4gICAgICAgIC8vIOWIm+W7uuaWsOeahOa4uOaIj+WvueixoVxyXG4gICAgICAgIGNvbnN0IGNsb25lID0gbmV3IEdhbWVPYmplY3Qob3JpZ2luYWwubmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5aSN5Yi25bGe5oCnXHJcbiAgICAgICAgY2xvbmUudGFnID0gb3JpZ2luYWwudGFnO1xyXG4gICAgICAgIGNsb25lLmxheWVyID0gb3JpZ2luYWwubGF5ZXI7XHJcbiAgICAgICAgY2xvbmUuYWN0aXZlID0gb3JpZ2luYWwuYWN0aXZlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOiuvue9ruS9jee9ruWSjOaXi+i9rO+8iOWmguaenOaPkOS+m++8iVxyXG4gICAgICAgIGlmIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBjbG9uZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnRyYW5zZm9ybS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyDlpI3liLbnu4Tku7bvvIjov5npnIDopoHkuIDkuKrmt7HluqblpI3liLbmnLrliLbvvIlcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6ZSA5q+B5ri45oiP5a+56LGhXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDosIPnlKjmiYDmnInnu4Tku7bnmoRvbkRlc3Ryb3nmlrnms5VcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50Lm9uRGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDov5nph4zlj6/ku6Xmt7vliqDku47lnLrmma/kuK3np7vpmaTmuLjmiI/lr7nosaHnmoTpgLvovpFcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBJbnB1dCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlWDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VZOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBkZWx0YVk6IG51bWJlciA9IDA7XHJcbn0iLCJlbnVtIExvZ1R5cGUge1xyXG4gICAgSW5mbyxcclxuICAgIFdhcm5pbmcsXHJcbiAgICBFcnJvcixcclxufVxyXG5cclxuaW50ZXJmYWNlIElMb2cge1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgdHlwZTogTG9nVHlwZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dzOiBJTG9nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBsb2dDb2xvcnMgPSB7XHJcbiAgICAgICAgW0xvZ1R5cGUuSW5mb106ICd3aGl0ZScsXHJcbiAgICAgICAgW0xvZ1R5cGUuV2FybmluZ106ICdvcmFuZ2UnLFxyXG4gICAgICAgIFtMb2dUeXBlLkVycm9yXTogJ3JlZCdcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHByaW50TG9ncyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IHRoaXMubG9nc1tpXTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IExvZ2dlci5sb2dDb2xvcnNbbG9nLnR5cGVdO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobG9nLm1lc3NhZ2UsIDEwLCAyMCArIGkgKiAxNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9ncyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2cobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UsIExvZ1R5cGUuSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHdhcm5pbmcobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UsIExvZ1R5cGUuV2FybmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucHVzaChtZXNzYWdlLCBMb2dUeXBlLkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwdXNoKG1lc3NhZ2U6IHN0cmluZywgdHlwZTogTG9nVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IGxvZzogSUxvZyA9IHtcclxuICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dzLnB1c2gobG9nKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi9RdWF0ZXJuaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4NHg0IHtcclxuXHJcbiAgICBwdWJsaWMgbWF0cml4OiBBcnJheTxBcnJheTxudW1iZXI+PiA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PigpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbHVtbjA6IFZlY3RvcjQsIGNvbHVtbjE6IFZlY3RvcjQsIGNvbHVtbjI6IFZlY3RvcjQsIGNvbHVtbjM6IFZlY3RvcjQpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB2ID0gYXJndW1lbnRzW2ldIGFzIFZlY3RvcjQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdHJpeFtpXSA9IG5ldyBBcnJheTxudW1iZXI+KHYueCwgdi55LCB2LnosIHYudyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdHJpeFtpXSA9IG5ldyBBcnJheTxudW1iZXI+KDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg6KGMXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSb3coaW5kZXg6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5tYXRyaXhbaW5kZXhdO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGV4IOWIl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q29sdW1uKGluZGV4OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQodGhpcy5tYXRyaXhbMF1baW5kZXhdLCB0aGlzLm1hdHJpeFsxXVtpbmRleF0sIHRoaXMubWF0cml4WzJdW2luZGV4XSwgdGhpcy5tYXRyaXhbM11baW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0Um93KGluZGV4OiBudW1iZXIsIHJvdzogVmVjdG9yNCkge1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVswXSA9IHJvdy54O1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVsxXSA9IHJvdy55O1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVsyXSA9IHJvdy56O1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVszXSA9IHJvdy53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTZXRDb2x1bW4oaW5kZXg6IG51bWJlciwgY29sdW1uOiBWZWN0b3I0KSB7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbMF1baW5kZXhdID0gY29sdW1uLng7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbMV1baW5kZXhdID0gY29sdW1uLnk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbMl1baW5kZXhdID0gY29sdW1uLno7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbM11baW5kZXhdID0gY29sdW1uLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KG06IE1hdHJpeDR4NCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IGxocyA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIGxldCByaHMgPSBtLm1hdHJpeDtcclxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IE1hdHJpeDR4NCgpLm1hdHJpeDtcclxuXHJcbiAgICAgICAgbWF0cml4WzBdWzBdID0gbGhzWzBdWzBdICogcmhzWzBdWzBdICsgbGhzWzBdWzFdICogcmhzWzFdWzBdICsgbGhzWzBdWzJdICogcmhzWzJdWzBdICsgbGhzWzBdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFswXVsxXSA9IGxoc1swXVswXSAqIHJoc1swXVsxXSArIGxoc1swXVsxXSAqIHJoc1sxXVsxXSArIGxoc1swXVsyXSAqIHJoc1syXVsxXSArIGxoc1swXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMF1bMl0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMF1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzBdWzNdID0gbGhzWzBdWzBdICogcmhzWzBdWzNdICsgbGhzWzBdWzFdICogcmhzWzFdWzNdICsgbGhzWzBdWzJdICogcmhzWzJdWzNdICsgbGhzWzBdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFsxXVswXSA9IGxoc1sxXVswXSAqIHJoc1swXVswXSArIGxoc1sxXVsxXSAqIHJoc1sxXVswXSArIGxoc1sxXVsyXSAqIHJoc1syXVswXSArIGxoc1sxXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMV1bMV0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMV1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzFdWzJdID0gbGhzWzFdWzBdICogcmhzWzBdWzJdICsgbGhzWzFdWzFdICogcmhzWzFdWzJdICsgbGhzWzFdWzJdICogcmhzWzJdWzJdICsgbGhzWzFdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFsxXVszXSA9IGxoc1sxXVswXSAqIHJoc1swXVszXSArIGxoc1sxXVsxXSAqIHJoc1sxXVszXSArIGxoc1sxXVsyXSAqIHJoc1syXVszXSArIGxoc1sxXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbMl1bMF0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMl1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzJdWzFdID0gbGhzWzJdWzBdICogcmhzWzBdWzFdICsgbGhzWzJdWzFdICogcmhzWzFdWzFdICsgbGhzWzJdWzJdICogcmhzWzJdWzFdICsgbGhzWzJdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFsyXVsyXSA9IGxoc1syXVswXSAqIHJoc1swXVsyXSArIGxoc1syXVsxXSAqIHJoc1sxXVsyXSArIGxoc1syXVsyXSAqIHJoc1syXVsyXSArIGxoc1syXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMl1bM10gPSBsaHNbMl1bMF0gKiByaHNbMF1bM10gKyBsaHNbMl1bMV0gKiByaHNbMV1bM10gKyBsaHNbMl1bMl0gKiByaHNbMl1bM10gKyBsaHNbMl1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzNdWzBdID0gbGhzWzNdWzBdICogcmhzWzBdWzBdICsgbGhzWzNdWzFdICogcmhzWzFdWzBdICsgbGhzWzNdWzJdICogcmhzWzJdWzBdICsgbGhzWzNdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFszXVsxXSA9IGxoc1szXVswXSAqIHJoc1swXVsxXSArIGxoc1szXVsxXSAqIHJoc1sxXVsxXSArIGxoc1szXVsyXSAqIHJoc1syXVsxXSArIGxoc1szXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbM11bMl0gPSBsaHNbM11bMF0gKiByaHNbMF1bMl0gKyBsaHNbM11bMV0gKiByaHNbMV1bMl0gKyBsaHNbM11bMl0gKiByaHNbMl1bMl0gKyBsaHNbM11bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzNdWzNdID0gbGhzWzNdWzBdICogcmhzWzBdWzNdICsgbGhzWzNdWzFdICogcmhzWzFdWzNdICsgbGhzWzNdWzJdICogcmhzWzJdWzNdICsgbGhzWzNdWzNdICogcmhzWzNdWzNdO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlWZWN0b3IzKHY6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICByZXMueCA9IG1bMF1bMF0gKiB2LnggKyBtWzBdWzFdICogdi55ICsgbVswXVsyXSAqIHYuejtcclxuICAgICAgICByZXMueSA9IG1bMV1bMF0gKiB2LnggKyBtWzFdWzFdICogdi55ICsgbVsxXVsyXSAqIHYuejtcclxuICAgICAgICByZXMueiA9IG1bMl1bMF0gKiB2LnggKyBtWzJdWzFdICogdi55ICsgbVsyXVsyXSAqIHYuejtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlWZWN0b3I0KHY6IFZlY3RvcjQpOiBWZWN0b3I0IHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFZlY3RvcjQoKTtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICByZXMueCA9IG1bMF1bMF0gKiB2LnggKyBtWzBdWzFdICogdi55ICsgbVswXVsyXSAqIHYueiArIG1bMF1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLnkgPSBtWzFdWzBdICogdi54ICsgbVsxXVsxXSAqIHYueSArIG1bMV1bMl0gKiB2LnogKyBtWzFdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy56ID0gbVsyXVswXSAqIHYueCArIG1bMl1bMV0gKiB2LnkgKyBtWzJdWzJdICogdi56ICsgbVsyXVszXSAqIHYudztcclxuICAgICAgICByZXMudyA9IG1bM11bMF0gKiB2LnggKyBtWzNdWzFdICogdi55ICsgbVszXVsyXSAqIHYueiArIG1bM11bM10gKiB2Lnc7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRyYW5zbGF0ZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhtWzBdWzNdLCBtWzFdWzNdLCBtWzJdWzNdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0Um90YXRlKCk6IFZlY3RvcjMge1xyXG4gICAgLy8gICAgIGxldCBtYXQgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAvLyAgICAgbGV0IHggPSBNYXRoLmF0YW4yKG1hdFsxXVsyXSwgbWF0WzJdWzJdKTtcclxuICAgIC8vICAgICBsZXQgeSA9IE1hdGguYXRhbjIoLW1hdFswXVsyXSwgTWF0aC5zcXJ0KG1hdFsxXVsyXSAqIG1hdFsxXVsyXSArIG1hdFsyXVsyXSAqIG1hdFsyXVsyXSkpO1xyXG4gICAgLy8gICAgIGxldCB6ID0gTWF0aC5hdGFuMihtYXRbMF1bMV0sIG1hdFswXVswXSk7XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBuZXcgVmVjdG9yMyh4IC8gTWF0aC5QSSAqIDE4MCwgeSAvIE1hdGguUEkgKiAxODAsIHogLyBNYXRoLlBJICogMTgwKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Um90YXRlKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIC8v5LiA5a6a6KaB6I635Y+W57qv5YeA55qE5peL6L2s55+p6Zi177yM5Y2z5Y676Zmk57yp5pS+5YCN546HXHJcbiAgICAgICAgbGV0IG1hdCA9IHRoaXMuZ2V0Um90YXRlTWF0cml4KCkubWF0cml4O1xyXG4gICAgICAgIGxldCBxID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgdmFyIHRyYWNlID0gbWF0WzBdWzBdICsgbWF0WzFdWzFdICsgbWF0WzJdWzJdOyAvLyBJIHJlbW92ZWQgKyAxLjBmOyBzZWUgZGlzY3Vzc2lvbiB3aXRoIEV0aGFuXHJcbiAgICAgICAgdmFyIHMgPSAwO1xyXG5cclxuICAgICAgICBpZiAodHJhY2UgPiAwKSB7Ly8gSSBjaGFuZ2VkIE1fRVBTSUxPTiB0byAwXHJcbiAgICAgICAgICAgIHMgPSAwLjUgLyBNYXRoLnNxcnQodHJhY2UgKyAxLjApO1xyXG4gICAgICAgICAgICBxLncgPSAwLjI1IC8gcztcclxuICAgICAgICAgICAgcS54ID0gKG1hdFsyXVsxXSAtIG1hdFsxXVsyXSkgKiBzO1xyXG4gICAgICAgICAgICBxLnkgPSAobWF0WzBdWzJdIC0gbWF0WzJdWzBdKSAqIHM7XHJcbiAgICAgICAgICAgIHEueiA9IChtYXRbMV1bMF0gLSBtYXRbMF1bMV0pICogcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobWF0WzBdWzBdID4gbWF0WzFdWzFdICYmIG1hdFswXVswXSA+IG1hdFsyXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMF1bMF0gLSBtYXRbMV1bMV0gLSBtYXRbMl1bMl0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFsyXVsxXSAtIG1hdFsxXVsyXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAobWF0WzBdWzFdICsgbWF0WzFdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAobWF0WzBdWzJdICsgbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0WzFdWzFdID4gbWF0WzJdWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFsxXVsxXSAtIG1hdFswXVswXSAtIG1hdFsyXVsyXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzBdWzJdIC0gbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAobWF0WzBdWzFdICsgbWF0WzFdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAwLjI1ICogcztcclxuICAgICAgICAgICAgICAgIHEueiA9IChtYXRbMV1bMl0gKyBtYXRbMl1bMV0pIC8gcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzJdWzJdIC0gbWF0WzBdWzBdIC0gbWF0WzFdWzFdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMV1bMF0gLSBtYXRbMF1bMV0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IChtYXRbMF1bMl0gKyBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueSA9IChtYXRbMV1bMl0gKyBtYXRbMl1bMV0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueiA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Um90YXRlTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2Jsb2IvZGV2L3NyYy9tYXRoL01hdHJpeDQuanNcclxuICAgICAgICAvL+WboOS4uuaXi+i9rOefqemYteavlOi+g+eJueauiu+8jOacieaXtuWAmeimgeWNleeLrOWkhOeQhu+8jOaJgOacieaLpeacieS4gOS4quaPkOWPluaWueazlVxyXG4gICAgICAgIC8v5o+Q5Y+W5pa55byP5b6I566A5Y2V77yM5YWI6I635Y+W57yp5pS+5YC877yM54S25ZCO5Yip55So6I635Y+W57yp5pS+5YC855qE5Y6f55CG77yM6YCG5ZCR6Zmk5Y6757yp5pS+5YC877yM5bCx5b6X5Yiw57qv5YeA55qE5peL6L2s55+p6Zi1XHJcbiAgICAgICAgLy/mraTmlrnms5XkuI3mlK/mjIHlj43lsITnn6npmLVcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICB2YXIgdGUgPSBtYXQubWF0cml4O1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLmdldFNjYWxlKCk7XHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IDEgLyBzY2FsZS54O1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSAxIC8gc2NhbGUueTtcclxuICAgICAgICB2YXIgc2NhbGVaID0gMSAvIHNjYWxlLno7XHJcblxyXG4gICAgICAgIHRlWzBdWzBdID0gbWVbMF1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbMV1bMF0gPSBtZVsxXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVsyXVswXSA9IG1lWzJdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzNdWzBdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bMV0gPSBtZVswXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVsxXVsxXSA9IG1lWzFdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzJdWzFdID0gbWVbMl1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbM11bMV0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVsyXSA9IG1lWzBdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzFdWzJdID0gbWVbMV1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbMl1bMl0gPSBtZVsyXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVszXVsyXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzNdID0gMDtcclxuICAgICAgICB0ZVsxXVszXSA9IDA7XHJcbiAgICAgICAgdGVbMl1bM10gPSAwO1xyXG4gICAgICAgIHRlWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RXVsZXJBbmdsZXMoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2Jsb2IvZGV2L3NyYy9tYXRoL01hdHJpeDQuanNcclxuICAgICAgICAvL+S7juaXi+i9rOefqemYtemHjOiOt+WPluasp+aLieinklxyXG4gICAgICAgIC8v5b+F6aG75piv57qv5YeA55qE5peL6L2s55+p6Zi1XHJcblxyXG4gICAgICAgIHZhciBhbmdsZSA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHZhciB0ZSA9IHRoaXMuZ2V0Um90YXRlTWF0cml4KCkubWF0cml4O1xyXG4gICAgICAgIHZhciBtMTEgPSB0ZVswXVswXSwgbTEyID0gdGVbMF1bMV0sIG0xMyA9IHRlWzBdWzJdO1xyXG4gICAgICAgIHZhciBtMjEgPSB0ZVsxXVswXSwgbTIyID0gdGVbMV1bMV0sIG0yMyA9IHRlWzFdWzJdO1xyXG4gICAgICAgIHZhciBtMzEgPSB0ZVsyXVswXSwgbTMyID0gdGVbMl1bMV0sIG0zMyA9IHRlWzJdWzJdO1xyXG5cclxuICAgICAgICBtMTMgPSBtMTMgPiAxID8gMSA6IG0xMztcclxuICAgICAgICBtMTMgPSBtMTMgPCAtMSA/IC0xIDogbTEzO1xyXG4gICAgICAgIGFuZ2xlLnkgPSBNYXRoLmFzaW4obTEzKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKG0xMykgPCAwLjk5OTk5OTkpIHtcclxuICAgICAgICAgICAgYW5nbGUueCA9IE1hdGguYXRhbjIoLW0yMywgbTMzKTtcclxuICAgICAgICAgICAgYW5nbGUueiA9IE1hdGguYXRhbjIoLW0xMiwgbTExKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmdsZS54ID0gTWF0aC5hdGFuMihtMzIsIG0yMik7XHJcbiAgICAgICAgICAgIGFuZ2xlLnogPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKGFuZ2xlLnggLyBNYXRoLlBJICogMTgwLCBhbmdsZS55IC8gTWF0aC5QSSAqIDE4MCwgYW5nbGUueiAvIE1hdGguUEkgKiAxODApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIGxldCB2ID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgdi54ID0gTWF0aC5zcXJ0KG1bMF1bMF0gKiBtWzBdWzBdICsgbVsxXVswXSAqIG1bMV1bMF0gKyBtWzJdWzBdICogbVsyXVswXSk7XHJcbiAgICAgICAgdi55ID0gTWF0aC5zcXJ0KG1bMF1bMV0gKiBtWzBdWzFdICsgbVsxXVsxXSAqIG1bMV1bMV0gKyBtWzJdWzFdICogbVsyXVsxXSk7XHJcbiAgICAgICAgdi56ID0gTWF0aC5zcXJ0KG1bMF1bMl0gKiBtWzBdWzJdICsgbVsxXVsyXSAqIG1bMV1bMl0gKyBtWzJdWzJdICogbVsyXVsyXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc3Bvc2UoKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbTEgPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICB2YXIgbTIgPSBuZXcgTWF0cml4NHg0KCkubWF0cml4O1xyXG5cclxuICAgICAgICBtMlswXVswXSA9IG0xWzBdWzBdOyBtMlswXVsxXSA9IG0xWzFdWzBdOyBtMlswXVsyXSA9IG0xWzJdWzBdOyBtMlswXVszXSA9IG0xWzNdWzBdO1xyXG4gICAgICAgIG0yWzFdWzBdID0gbTFbMF1bMV07IG0yWzFdWzFdID0gbTFbMV1bMV07IG0yWzFdWzJdID0gbTFbMl1bMV07IG0yWzFdWzNdID0gbTFbM11bMV07XHJcbiAgICAgICAgbTJbMl1bMF0gPSBtMVswXVsyXTsgbTJbMl1bMV0gPSBtMVsxXVsyXTsgbTJbMl1bMl0gPSBtMVsyXVsyXTsgbTJbMl1bM10gPSBtMVszXVsyXTtcclxuICAgICAgICBtMlszXVswXSA9IG0xWzBdWzNdOyBtMlszXVsxXSA9IG0xWzFdWzNdOyBtMlszXVsyXSA9IG0xWzJdWzNdOyBtMlszXVszXSA9IG0xWzNdWzNdO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0yO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGUocG9zOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IE1hdHJpeDR4NC5nZXRUcmFuc2xhdGVNYXRyaXgocG9zKTtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGUocTogUXVhdGVybmlvbik6IE1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyByb3RhdGUoZXVsZXJBbmdsZXM6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIHJvdGF0ZShhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogTWF0cml4NHg0O1xyXG4gICAgcHVibGljIHJvdGF0ZSgpIHtcclxuICAgICAgICBsZXQgbSA9IG5ldyBNYXRyaXg0eDQoKTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFF1YXRlcm5pb24pIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24oYXJndW1lbnRzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoYXJndW1lbnRzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gTWF0cml4NHg0LmdldFNjYWxlTWF0cml4KHMpO1xyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvb2tBdCh0YXJnZXQ6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8vIHRvZG9cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvL+i9rOaNouWIsOaRhOW9seacuueci+WQkeeahOefqemYtemHjFxyXG4gICAgcHVibGljIHRyYW5zZm9ybVRvTG9va0F0U3BhY2UoZXllOiBWZWN0b3IzLCB0YXJnZXRQb2ludDogVmVjdG9yMywgdXA6IFZlY3RvcjMgPSBWZWN0b3IzLlVQKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL+S7juWTqumHjOeci+WQkeWTqumHjO+8jOS5n+WPr+S7peeQhuino+S4uuaRhOW9seacuuinhuinku+8jOWNs+inguWvn+epuumXtFxyXG4gICAgICAgIC8v6Iul6KaB5Y+Y5o2i5Yiw5pGE5b2x5py656m66Ze077yM5Y+v5Lul5YGH6K6+5pW05Liq6KeC5a+f56m66Ze05Lul5pGE5b2x5py65L2N5LqO5LiW55WM5Z2Q5qCH5Y6f54K577yM54S25ZCO5bCG5omA5pyJ54mp5L2T5pyd5pGE5b2x5py65Y6f5YWI5Zyo5LiW55WM56m66Ze05Lit55qE5L2N572u5Y+N5ZCR56e75Yqo5Y2z5Y+vXHJcbiAgICAgICAgLy/lnKjnurjkuIrnlLvkuIvlm77lsLHmuIXmmbDkuoZcclxuXHJcbiAgICAgICAgLy/nlLHkuo7pu5jorqTnn6npmLXmmK9TUlTpobrluo/nu4TmiJDnmoTlj5jmjaLnqbrpl7TvvIzopoHpgIblkJHvvIzliJnmmK9UUlPnmoTpobrluo/vvIzljbPlhYjnp7vliqjlkI7ml4vovaxcclxuICAgICAgICAvLzEu5ZCR5Y+N5pa55ZCR5bmz56e7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcjMoLWV5ZS54LCAtZXllLnksIC1leWUueikpO1xyXG5cclxuICAgICAgICAvLzIu5ZCR5Y+N5pa55ZCR5peL6L2sXHJcbiAgICAgICAgLy/lhYjojrflj5bmkYTlvbHkuJbnlYzpg6jlnZDmoIfovbRcclxuICAgICAgICB2YXIgekF4aXMgPSBWZWN0b3IzLmRpZmZlcmVuY2UoZXllLCB0YXJnZXRQb2ludCkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy/lm6DkuLrmiJHku6zmmK/lj7PmiYvns7vnu5/vvIzopoHmsYJY77yM5YiZ5b+F6aG7euS5mHlcclxuICAgICAgICB2YXIgeEF4aXMgPSBWZWN0b3IzLmNyb3NzKHVwLCB6QXhpcykubm9ybWFsaXplKCk7XHJcbiAgICAgICAgdmFyIHlBeGlzID0gVmVjdG9yMy5jcm9zcyh6QXhpcywgeEF4aXMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8v5p6E5bu65pGE5b2x5py65Y+N5pa55ZCR5peL6L2s55+p6Zi1XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHhBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoeUF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh6QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcnVzdHVtKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBybCA9IChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgY29uc3QgdGIgPSAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGNvbnN0IGZuID0gKGZhciAtIG5lYXIpXHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgobmVhciAqIDIpIC8gcmwsIDAsIChyaWdodCArIGxlZnQpIC8gcmwsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAobmVhciAqIDIpIC8gdGIsICh0b3AgKyBib3R0b20pIC8gdGIsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtKGZhciArIG5lYXIpIC8gZm4sIC0oZmFyICogbmVhciAqIDIpIC8gZm4pLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtMSwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ydGhvZ3JhcGhpYyhsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgcmwgPSAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGNvbnN0IHRiID0gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBjb25zdCBmbiA9IChmYXIgLSBuZWFyKVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMiAvIHJsLCAwLCAwLCAtKGxlZnQgKyByaWdodCkgLyBybCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDIgLyB0YiwgMCwgLSh0b3AgKyBib3R0b20pIC8gdGIpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtMiAvIGZuLCAtKGZhciArIG5lYXIpIC8gZm4pLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyc3BlY3RpdmUoZm92OiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBoZm92ID0gZm92IC8gMTgwICogTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgY29uc3QgdGFuID0gTWF0aC50YW4oaGZvdik7XHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgxIC8gKGFzcGVjdCAqIHRhbiksIDAsIDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAxIC8gdGFuLCAwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLShmYXIgKyBuZWFyKSAvIChmYXIgLSBuZWFyKSwgLSgyICogZmFyICogbmVhcikgLyAoZmFyIC0gbmVhcikpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtMSwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGludmVyc2UoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgbWF0ID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIGNvbnN0IGEwMCA9IG1hdFswXVswXTtcclxuICAgICAgICBjb25zdCBhMDEgPSBtYXRbMF1bMV07XHJcbiAgICAgICAgY29uc3QgYTAyID0gbWF0WzBdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEwMyA9IG1hdFswXVszXTtcclxuICAgICAgICBjb25zdCBhMTAgPSBtYXRbMV1bMF07XHJcbiAgICAgICAgY29uc3QgYTExID0gbWF0WzFdWzFdO1xyXG4gICAgICAgIGNvbnN0IGExMiA9IG1hdFsxXVsyXTtcclxuICAgICAgICBjb25zdCBhMTMgPSBtYXRbMV1bM107XHJcbiAgICAgICAgY29uc3QgYTIwID0gbWF0WzJdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEyMSA9IG1hdFsyXVsxXTtcclxuICAgICAgICBjb25zdCBhMjIgPSBtYXRbMl1bMl07XHJcbiAgICAgICAgY29uc3QgYTIzID0gbWF0WzJdWzNdO1xyXG4gICAgICAgIGNvbnN0IGEzMCA9IG1hdFszXVswXTtcclxuICAgICAgICBjb25zdCBhMzEgPSBtYXRbM11bMV07XHJcbiAgICAgICAgY29uc3QgYTMyID0gbWF0WzNdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEzMyA9IG1hdFszXVszXTtcclxuXHJcbiAgICAgICAgY29uc3QgZGV0MDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAyID0gYTAwICogYTEzIC0gYTAzICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTFcclxuICAgICAgICBjb25zdCBkZXQwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMVxyXG4gICAgICAgIGNvbnN0IGRldDA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyXHJcbiAgICAgICAgY29uc3QgZGV0MDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzFcclxuICAgICAgICBjb25zdCBkZXQxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGRldDExID0gYTIyICogYTMzIC0gYTIzICogYTMyXHJcblxyXG4gICAgICAgIGxldCBkZXQgPSAoZGV0MDAgKiBkZXQxMSAtIGRldDAxICogZGV0MTAgKyBkZXQwMiAqIGRldDA5ICsgZGV0MDMgKiBkZXQwOCAtIGRldDA0ICogZGV0MDcgKyBkZXQwNSAqIGRldDA2KTtcclxuXHJcbiAgICAgICAgaWYgKCFkZXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk1hdHJpeDR4NCBpbnZlcnNlIGZhaWxlZCwgZGV0ZXJtaW5hbnQgaXMgMFwiKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcblxyXG4gICAgICAgIG1hdFswXVswXSA9IChhMTEgKiBkZXQxMSAtIGExMiAqIGRldDEwICsgYTEzICogZGV0MDkpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzFdID0gKC1hMDEgKiBkZXQxMSArIGEwMiAqIGRldDEwIC0gYTAzICogZGV0MDkpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzJdID0gKGEzMSAqIGRldDA1IC0gYTMyICogZGV0MDQgKyBhMzMgKiBkZXQwMykgKiBkZXRcclxuICAgICAgICBtYXRbMF1bM10gPSAoLWEyMSAqIGRldDA1ICsgYTIyICogZGV0MDQgLSBhMjMgKiBkZXQwMykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMF0gPSAoLWExMCAqIGRldDExICsgYTEyICogZGV0MDggLSBhMTMgKiBkZXQwNykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMV0gPSAoYTAwICogZGV0MTEgLSBhMDIgKiBkZXQwOCArIGEwMyAqIGRldDA3KSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVsyXSA9ICgtYTMwICogZGV0MDUgKyBhMzIgKiBkZXQwMiAtIGEzMyAqIGRldDAxKSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVszXSA9IChhMjAgKiBkZXQwNSAtIGEyMiAqIGRldDAyICsgYTIzICogZGV0MDEpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzBdID0gKGExMCAqIGRldDEwIC0gYTExICogZGV0MDggKyBhMTMgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMV0gPSAoLWEwMCAqIGRldDEwICsgYTAxICogZGV0MDggLSBhMDMgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMl0gPSAoYTMwICogZGV0MDQgLSBhMzEgKiBkZXQwMiArIGEzMyAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVszXSA9ICgtYTIwICogZGV0MDQgKyBhMjEgKiBkZXQwMiAtIGEyMyAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFszXVswXSA9ICgtYTEwICogZGV0MDkgKyBhMTEgKiBkZXQwNyAtIGExMiAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFszXVsxXSA9IChhMDAgKiBkZXQwOSAtIGEwMSAqIGRldDA3ICsgYTAyICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzJdID0gKC1hMzAgKiBkZXQwMyArIGEzMSAqIGRldDAxIC0gYTMyICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzNdID0gKGEyMCAqIGRldDAzIC0gYTIxICogZGV0MDEgKyBhMjIgKiBkZXQwMCkgKiBkZXRcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvRmxvYXQzMkxpc3QoKTogRmxvYXQzMkxpc3Qge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgLy/nlLHkuo5PcGVuR0zmmK/liJfluo/lrZjlgqjvvIzmiYDku6XpnIDopoHovaznva7kuIDkuIvnn6npmLVcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgIG1bMF1bMF0sIG1bMV1bMF0sIG1bMl1bMF0sIG1bM11bMF0sXHJcbiAgICAgICAgICAgIG1bMF1bMV0sIG1bMV1bMV0sIG1bMl1bMV0sIG1bM11bMV0sXHJcbiAgICAgICAgICAgIG1bMF1bMl0sIG1bMV1bMl0sIG1bMl1bMl0sIG1bM11bMl0sXHJcbiAgICAgICAgICAgIG1bMF1bM10sIG1bMV1bM10sIG1bMl1bM10sIG1bM11bM11cclxuICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMCksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDEpLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygyKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMyksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VFJTTWF0cml4KHBvczogVmVjdG9yMywgcXVhdDogUXVhdGVybmlvbiwgc2NhbGU6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCB0bSA9IE1hdHJpeDR4NC5nZXRUcmFuc2xhdGVNYXRyaXgocG9zKTtcclxuICAgICAgICBsZXQgcm0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHF1YXQpO1xyXG4gICAgICAgIGxldCBzbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzY2FsZSk7XHJcblxyXG4gICAgICAgIC8v5b+F6aG75Lil5qC85oyJ54Wn5YWIU2NhbGXvvIzlho1Sb3RhdGXvvIzlho1UcmFuc2xhdGXnmoTpobrluo/vvIzlkKbliJnlvpfliLDnmoTnu5Pmnpzogq/lrprmmK/kuI3mu6HmhI/nmoRcclxuICAgICAgICAvL+S+i+WmguacieS4gOS4qjFYMeato+aWueW9ouWcqOWOn+eCue+8jOaIkeS7rOaDs+imgeW+l+WIsOS4gOS4qjFYMu+8jOW5tuS4lOaWnOWQkTQ1wrDvvIzogIzkuJTnprvlnZDmoIfljp/ngrkx5Liq5Y2V5L2N5aSEXHJcbiAgICAgICAgLy/lpoLmnpzlhYjml4vovazvvIzlho3nvKnmlL7nmoTor53vvIzml4vovazmlrnlkJHmmK/lr7nkuobvvIzkvYbmmK/miJHku6zmmK/lsIbml4vovazlkI40NcKw55qE5q2j5pa55b2i55qEWei9tOaLieS8uDLlgI3vvIzlvpfliLDnmoTmmK/kuIDkuKrooqvmi4nplb/nmoToj7HlvaJcclxuICAgICAgICAvL+WmguaenOWFiOW5s+enu++8jOWGjeaXi+i9rOeahOivne+8jOWboOS4uuaIkeS7rOaXi+i9rOmDveaYr+e7leedgOWdkOagh+WOn+eCueeahO+8jOe7k+aenOiHqueEtuaYr+ato+aWueW9ouS4jeaYr+iHqui6q+aXi+i9rDQ1wrDvvIzogIzmmK/nu5XnnYDljp/ngrnml4vovaxcclxuICAgICAgICByZXR1cm4gdG0ubXVsdGlwbHkocm0ubXVsdGlwbHkoc20pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRyYW5zbGF0ZU1hdHJpeChwb3M6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMTsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gcG9zLng7XHJcbiAgICAgICAgbVsxXVswXSA9IDA7IG1bMV1bMV0gPSAxOyBtWzFdWzJdID0gMDsgbVsxXVszXSA9IHBvcy55O1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IDE7IG1bMl1bM10gPSBwb3MuejtcclxuICAgICAgICBtWzNdWzBdID0gMDsgbVszXVsxXSA9IDA7IG1bM11bMl0gPSAwOyBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxOiBRdWF0ZXJuaW9uKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbGV0IG51bSA9IHEueCAqIDI7XHJcbiAgICAgICAgbGV0IG51bTIgPSBxLnkgKiAyO1xyXG4gICAgICAgIGxldCBudW0zID0gcS56ICogMjtcclxuICAgICAgICBsZXQgbnVtNCA9IHEueCAqIG51bTtcclxuICAgICAgICBsZXQgbnVtNSA9IHEueSAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTYgPSBxLnogKiBudW0zO1xyXG4gICAgICAgIGxldCBudW03ID0gcS54ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtOCA9IHEueCAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTkgPSBxLnkgKiBudW0zO1xyXG4gICAgICAgIGxldCBudW0xMCA9IHEudyAqIG51bTtcclxuICAgICAgICBsZXQgbnVtMTEgPSBxLncgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW0xMiA9IHEudyAqIG51bTM7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSAxIC0gKG51bTUgKyBudW02KTtcclxuICAgICAgICBtWzFdWzBdID0gbnVtNyArIG51bTEyO1xyXG4gICAgICAgIG1bMl1bMF0gPSBudW04IC0gbnVtMTE7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IG51bTcgLSBudW0xMjtcclxuICAgICAgICBtWzFdWzFdID0gMSAtIChudW00ICsgbnVtNik7XHJcbiAgICAgICAgbVsyXVsxXSA9IG51bTkgKyBudW0xMDtcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0gbnVtOCArIG51bTExO1xyXG4gICAgICAgIG1bMV1bMl0gPSBudW05IC0gbnVtMTA7XHJcbiAgICAgICAgbVsyXVsyXSA9IDEgLSAobnVtNCArIG51bTUpO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhlOiBWZWN0b3IzLCBvcmRlcjogc3RyaW5nID0gXCJYWVpcIik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/pgJrov4fmrKfmi4nop5Lojrflj5bml4vovaznn6npmLVcclxuICAgICAgICAvL+WFiOWIhuWIq+iOt+WPllhZWui9tOS4iueahOaXi+i9rOefqemYte+8jOeEtuWQjuWQiOW5tui1t+adpVxyXG4gICAgICAgIC8v5rOo5oSP77ya5peL6L2s6L2055qE6aG65bqP5YWI5ZCO5LiN5ZCM77yM5Lya5Ye6546w5LiN5ZCM55qE57uT5p6c77yM5Zug5q2k5b+F6aG76KaB5oyH5a6a5peL6L2s6aG65bqPXHJcbiAgICAgICAgLy9odHRwOi8vcGxhbm5pbmcuY3MudWl1Yy5lZHUvbm9kZTEwMi5odG1sXHJcbiAgICAgICAgLy9odHRwczovL3RocmVlanMub3JnL2RvY3MvI2FwaS9lbi9tYXRoL0V1bGVyLm9yZGVyXHJcbiAgICAgICAgdmFyIHggPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueCwgVmVjdG9yMy5SSUdIVCk7XHJcbiAgICAgICAgdmFyIHkgPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueSwgVmVjdG9yMy5VUCk7XHJcbiAgICAgICAgdmFyIHogPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueiwgVmVjdG9yMy5GT1JXQVJEKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChvcmRlcikge1xyXG4gICAgICAgICAgICBjYXNlIFwiWFlaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh5Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICAgICAgY2FzZSBcIlhaWVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkubXVsdGlwbHkoei5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJZWFpcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHgubXVsdGlwbHkoeSkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVpYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh6Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIlpYWVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkubXVsdGlwbHkoeC5tdWx0aXBseSh6KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWVhcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB4Lm11bHRpcGx5KHkubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJvdGF0aW9uIG9yZGVyIGVycm9yLCBtdXN0IGJlIHNpbWlsYXIgdG8gJ1hZWidcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh5Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeUF4aXMoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG91dCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICB2YXIgbSA9IG91dC5tYXRyaXg7XHJcbiAgICAgICAgdmFyIHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XHJcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgICAgIHZhciBzID0gMCwgYyA9IDAsIHQgPSAwO1xyXG5cclxuICAgICAgICBhbmdsZSA9IE1hdGguUEkgKiBhbmdsZSAvIDE4MDtcclxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xyXG4gICAgICAgIHggKj0gbGVuO1xyXG4gICAgICAgIHkgKj0gbGVuO1xyXG4gICAgICAgIHogKj0gbGVuO1xyXG4gICAgICAgIHMgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICB0ID0gMSAtIGM7XHJcbiAgICAgICAgbVswXVswXSA9IHggKiB4ICogdCArIGM7XHJcbiAgICAgICAgbVsxXVswXSA9IHkgKiB4ICogdCArIHogKiBzO1xyXG4gICAgICAgIG1bMl1bMF0gPSB6ICogeCAqIHQgLSB5ICogcztcclxuICAgICAgICBtWzNdWzBdID0gMDtcclxuICAgICAgICBtWzBdWzFdID0geCAqIHkgKiB0IC0geiAqIHM7XHJcbiAgICAgICAgbVsxXVsxXSA9IHkgKiB5ICogdCArIGM7XHJcbiAgICAgICAgbVsyXVsxXSA9IHogKiB5ICogdCArIHggKiBzO1xyXG4gICAgICAgIG1bM11bMV0gPSAwO1xyXG4gICAgICAgIG1bMF1bMl0gPSB4ICogeiAqIHQgKyB5ICogcztcclxuICAgICAgICBtWzFdWzJdID0geSAqIHogKiB0IC0geCAqIHM7XHJcbiAgICAgICAgbVsyXVsyXSA9IHogKiB6ICogdCArIGM7XHJcbiAgICAgICAgbVszXVsyXSA9IDA7XHJcbiAgICAgICAgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNjYWxlTWF0cml4KHM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gcy54OyBtWzBdWzFdID0gMDsgbVswXVsyXSA9IDA7IG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gcy55OyBtWzFdWzJdID0gMDsgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVswXSA9IDA7IG1bMl1bMV0gPSAwOyBtWzJdWzJdID0gcy56OyBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzBdID0gMDsgbVszXVsxXSA9IDA7IG1bM11bMl0gPSAwOyBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpZGVudGl0eSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIG0ubWF0cml4WzBdWzBdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFsxXVsxXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMl1bMl0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzNdWzNdID0gMTtcclxuICAgICAgICByZXR1cm4gbTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IE1hdHJpeDR4NCB9IGZyb20gXCIuL01hdHJpeDR4NFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1YXRlcm5pb24ge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGV1bGVyOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlQXJvdW5kKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXVsZXJBbmdsZXMgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xyXG4gICAgICAgICAgICB0aGlzLncgPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHRoaXMpLmdldEV1bGVyQW5nbGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBldWxlckFuZ2xlcyhlOiBWZWN0b3IzKSB7XHJcbiAgICAgICAgdmFyIHEgPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhlKS5nZXRSb3RhdGUoKTtcclxuICAgICAgICB0aGlzLncgPSBxLnc7XHJcbiAgICAgICAgdGhpcy54ID0gcS54O1xyXG4gICAgICAgIHRoaXMueSA9IHEueTtcclxuICAgICAgICB0aGlzLnogPSBxLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZUFyb3VuZChhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgbGV0IHEgPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhhbmdsZSwgYXhpcyk7XHJcbiAgICAgICAgdGhpcy54ID0gcS54O1xyXG4gICAgICAgIHRoaXMueSA9IHEueTtcclxuICAgICAgICB0aGlzLnogPSBxLno7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAemgg5ZCR6YeP5Zub5YWD5pWw5LmY5rOVXHJcbiAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybVF1YXQoYTogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6IGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tdHJhbnNmb3JtLVZlYzMtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIGxldCBxID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHF1YXQgKiB2ZWNcclxuICAgICAgICBjb25zdCBpeCA9IHEudyAqIGEueCArIHEueSAqIGEueiAtIHEueiAqIGEueTtcclxuICAgICAgICBjb25zdCBpeSA9IHEudyAqIGEueSArIHEueiAqIGEueCAtIHEueCAqIGEuejtcclxuICAgICAgICBjb25zdCBpeiA9IHEudyAqIGEueiArIHEueCAqIGEueSAtIHEueSAqIGEueDtcclxuICAgICAgICBjb25zdCBpdyA9IC1xLnggKiBhLnggLSBxLnkgKiBhLnkgLSBxLnogKiBhLno7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcclxuICAgICAgICBvdXQueCA9IGl4ICogcS53ICsgaXcgKiAtcS54ICsgaXkgKiAtcS56IC0gaXogKiAtcS55O1xyXG4gICAgICAgIG91dC55ID0gaXkgKiBxLncgKyBpdyAqIC1xLnkgKyBpeiAqIC1xLnggLSBpeCAqIC1xLno7XHJcbiAgICAgICAgb3V0LnogPSBpeiAqIHEudyArIGl3ICogLXEueiArIGl4ICogLXEueSAtIGl5ICogLXEueDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24odGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlm5vlhYPmlbDnkIPpnaLmj5LlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzbGVycChhOiBRdWF0ZXJuaW9uLCBiOiBRdWF0ZXJuaW9uLCB0OiBudW1iZXIpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOlxyXG4gICAgICAgIC8vICAgIGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tc2xlcnAtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUwID0gMDtcclxuICAgICAgICBsZXQgc2NhbGUxID0gMDtcclxuXHJcbiAgICAgICAgLy8gY2FsYyBjb3NpbmVcclxuICAgICAgICBsZXQgY29zb20gPSBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICAgICAgLy8gYWRqdXN0IHNpZ25zIChpZiBuZWNlc3NhcnkpXHJcbiAgICAgICAgaWYgKGNvc29tIDwgMC4wKSB7XHJcbiAgICAgICAgICAgIGNvc29tID0gLWNvc29tO1xyXG4gICAgICAgICAgICBiLnggPSAtYi54O1xyXG4gICAgICAgICAgICBiLnkgPSAtYi55O1xyXG4gICAgICAgICAgICBiLnogPSAtYi56O1xyXG4gICAgICAgICAgICBiLncgPSAtYi53O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgY29lZmZpY2llbnRzXHJcbiAgICAgICAgaWYgKCgxLjAgLSBjb3NvbSkgPiAwLjAwMDAwMSkge1xyXG4gICAgICAgICAgICAvLyBzdGFuZGFyZCBjYXNlIChzbGVycClcclxuICAgICAgICAgICAgY29uc3Qgb21lZ2EgPSBNYXRoLmFjb3MoY29zb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzaW5vbSA9IE1hdGguc2luKG9tZWdhKTtcclxuICAgICAgICAgICAgc2NhbGUwID0gTWF0aC5zaW4oKDEuMCAtIHQpICogb21lZ2EpIC8gc2lub207XHJcbiAgICAgICAgICAgIHNjYWxlMSA9IE1hdGguc2luKHQgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBcImZyb21cIiBhbmQgXCJ0b1wiIHF1YXRlcm5pb25zIGFyZSB2ZXJ5IGNsb3NlXHJcbiAgICAgICAgICAgIC8vICAuLi4gc28gd2UgY2FuIGRvIGEgbGluZWFyIGludGVycG9sYXRpb25cclxuICAgICAgICAgICAgc2NhbGUwID0gMS4wIC0gdDtcclxuICAgICAgICAgICAgc2NhbGUxID0gdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGZpbmFsIHZhbHVlc1xyXG4gICAgICAgIG91dC54ID0gc2NhbGUwICogYS54ICsgc2NhbGUxICogYi54O1xyXG4gICAgICAgIG91dC55ID0gc2NhbGUwICogYS55ICsgc2NhbGUxICogYi55O1xyXG4gICAgICAgIG91dC56ID0gc2NhbGUwICogYS56ICsgc2NhbGUxICogYi56O1xyXG4gICAgICAgIG91dC53ID0gc2NhbGUwICogYS53ICsgc2NhbGUxICogYi53O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KGE6IFF1YXRlcm5pb24sIGI6IFF1YXRlcm5pb24pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZUF4aXMoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICBhbmdsZSA9IE1hdGguUEkgKiBhbmdsZSAvIDE4MDtcclxuICAgICAgICBhbmdsZSAqPSAwLjU7XHJcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xyXG5cclxuICAgICAgICByZXMueCA9IGF4aXMueCAqIHNpbjtcclxuICAgICAgICByZXMueSA9IGF4aXMueSAqIHNpbjtcclxuICAgICAgICByZXMueiA9IGF4aXMueiAqIHNpbjtcclxuICAgICAgICByZXMudyA9IE1hdGguY29zKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpZGVudGl0eSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd2lkdGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueTsgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMik6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMjtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yMik6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWN0b3IyO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yMi5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyLCB0OiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcm9zcyh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnkgLSB2MS55ICogdjIueCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB4ID0gdjIueCAtIHYxLng7XHJcbiAgICAgICAgdmFyIHkgPSB2Mi55IC0gdjEueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGUodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlY3RvcjIuZG90KHYxLCB2MikgLyAodjEubWFnbml0dWRlICogdjIubWFnbml0dWRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFJJR0hUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBMRUZUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigtMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgVVAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERPV04oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIC0xKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yMyB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjQpXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3IzKTogVmVjdG9yMztcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlY3RvcjM7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yMyk6IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlY3RvcjM7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICB0aGlzLnogKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHRoaXMueiAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHRoaXMueiAqPSB2Lno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yMy5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMywgdDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgdi56ID0gdjEueiArIHQgKiAodjIueiAtIHYxLnopO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHggPSB2MS55ICogdjIueiAtIHYxLnogKiB2Mi55O1xyXG4gICAgICAgIHZhciB5ID0gdjEueiAqIHYyLnggLSB2MS54ICogdjIuejtcclxuICAgICAgICB2YXIgeiA9IHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLng7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHgsIHksIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgdmFyIHogPSB2Mi56IC0gdjEuejtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaWZmZXJlbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBkZXN0ID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgZGVzdC54ID0gdjEueCAtIHYyLnhcclxuICAgICAgICBkZXN0LnkgPSB2MS55IC0gdjIueVxyXG4gICAgICAgIGRlc3QueiA9IHYxLnogLSB2Mi56XHJcblxyXG4gICAgICAgIHJldHVybiBkZXN0XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMy5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKC0xLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEZPUldBUkQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEJBQ0soKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIC0xKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yNCB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBnKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuICAgIHB1YmxpYyBnZXQgYigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy56OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGEoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudzsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmVjdG9yMygpOiBWZWN0b3IzIHsgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMpOyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHMubGVuZ3RoID09IDIgPyBhcmd1bWVudHNbMV0gOiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjdG9yNDtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgKz0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjQpOiBWZWN0b3I0O1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgLT0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHRoaXMudyAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgdGhpcy53IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjQpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICB0aGlzLncgKj0gdi53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjQuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3I0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56ICYmIHYudyA9PSB0aGlzLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56ICsgXCIsIFwiICsgdGhpcy53ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0LCB0OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICB2LnogPSB2MS56ICsgdCAqICh2Mi56IC0gdjEueik7XHJcbiAgICAgICAgdi53ID0gdjEudyArIHQgKiAodjIudyAtIHYxLncpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnogKyB2MS53ICogdjIudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yNC5kb3QodjEsIHYyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDEsIDEsIDEsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ29tcG9tZW50L0NhbWVyYVwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zyb21cIjtcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9Db21wb21lbnQvUmVuZGVyZXJcIjtcclxuXHJcbmVudW0gRHJhd01vZGUge1xyXG4gICAgV2lyZWZyYW1lLFxyXG4gICAgUG9pbnQsXHJcbiAgICBTaGFkZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhc3Rlcml6YXRpb25QaXBlbGluZSB7XHJcbiAgICBwdWJsaWMgZHJhd01vZGU6IERyYXdNb2RlID0gRHJhd01vZGUuV2lyZWZyYW1lO1xyXG4gICAgcHJpdmF0ZSB1aW50MzJWaWV3OiBVaW50MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aW50MzJWaWV3OiBVaW50MzJBcnJheSkge1xyXG4gICAgICAgIHRoaXMudWludDMyVmlldyA9IHVpbnQzMlZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIOWfuuehgOe7mOWItuaOpeWPo1xyXG5cclxuICAgIHB1YmxpYyBDbGVhcihjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5L2/55SoIGZpbGwg5pa55rOV5pu/5Luj5b6q546v77yM5oCn6IO95pu05aW9XHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3LmZpbGwoY29sb3IpO1xyXG4gICAgICAgIC8vIOaIluiAheS9v+eUqOW+queOr++8jOS9huaAp+iDvei+g+W3rlxyXG4gICAgICAgIC8vIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jYW52YXNXaWR0aDsgeCsrKSB7XHJcbiAgICAgICAgLy8gICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5jYW52YXNIZWlnaHQ7IHkrKykge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5TZXRQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdQaXhlbCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOe7mOWItuWIsOWxj+W5leS4iueahOWDj+e0oOW6lOivpeaYr+aVtOaVsOeahFxyXG4gICAgICAgIC8vIOS8mOWMljog5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHggPSAoeCB8IDApO1xyXG4gICAgICAgIHkgPSAoeSB8IDApO1xyXG4gICAgICAgIC8vIHggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIC8vIHkgPSBNYXRoLmZsb29yKHkpO1xyXG5cclxuICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBDb25maWcuY2FudmFzV2lkdGggfHwgeSA8IDAgfHwgeSA+PSBDb25maWcuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWludDMyVmlld1t5ICogQ29uZmlnLmNhbnZhc1dpZHRoICsgeF0gPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd0xpbmUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOWPluaVtFxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG5cclxuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XHJcbiAgICAgICAgY29uc3QgZHkgPSB5MiAtIHkxO1xyXG5cclxuICAgICAgICAvLyDkuLrkvZXopoHljLrliIbmlpznjofmmK/lkKblgY/msLTlubPov5jmmK/lnoLnm7TlkaLvvJ/lm6DkuLrlpoLmnpzkuI3ljLrliIbvvIzkvovlpoLlvZPmlpznjoflpKfkuo4x5pe277yM5Lya5a+86Ie055u057q/57uY5Yi25LiN6L+e57ut77yM5Zug5Li6eeS8mui3s+WPmO+8jOiAjOS4jeaYr+i/nue7reeahOWinuWKoOOAglxyXG4gICAgICAgIC8vIOWPquacieaWnOeOh+WImuWlveS4ujHml7bvvIx46LefeeaJjeaYr+i/nue7reWQjOatpeiHquWinueahO+8jHgrMe+8jOWImXnkuZ8rMVxyXG4gICAgICAgIC8vIOaJgOS7pe+8jOW9k+aWnOeOh+Wkp+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh55L2c5Li65b6q546v5Y+Y6YeP77yM6ICM5b2T5pac546H5bCP5LqOMeaXtu+8jOaIkeS7rOmcgOimgeS9v+eUqHjkvZzkuLrlvqrnjq/lj5jph4/jgIJcclxuICAgICAgICAvLyDkuL7kuKrmnoHnq6/kvovlrZDvvIzlvZPmlpznjofkuLow5pe277yM55u057q/5bCx5piv5LiA5p2h5Z6C55u055u057q/77yM5aaC5p6c6L+Z5pe25YCZ6L+Y55SoeOS9nOS4uuW+queOr+WPmOmHj++8jOWImeS8muWvvOiHtOi/meadoeebtOe6v+S4iuaJgOaciXnngrnpg73lr7nlupTkuIDkuKp477yM5Lmf5bCx5piv6K+06L+Z5p2h57q/5Y+Y5oiQ5LiA5Liq54K55LqG44CCXHJcblxyXG4gICAgICAgIC8vIOaWnOeOh+Wwj+S6jjHvvIznm7Tnur/lgY/msLTlubPmg4XlhrXvvIzkvb/nlKh45L2c5Li65b6q546v5Y+Y6YePXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA+IE1hdGguYWJzKGR5KSkge1xyXG4gICAgICAgICAgICAvLyDkuIvpnaLnmoTlvqrnjq/nu5jliLblh73mlbDmmK/ku47lt6blvoDlj7PnmoTvvIzov5nph4zopoHnoa7kv53nu5PmnZ/ngrnlnKjlvIDlp4vngrnnmoTlj7PovrlcclxuICAgICAgICAgICAgaWYgKHgyIDwgeDEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgLy8g5pac546HXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkeSAvIGR4O1xyXG4gICAgICAgICAgICAvLyDmiKrot53vvIh5PWF4K2LvvIxiPXktYXjvvIlcclxuICAgICAgICAgICAgLy8gY29uc3QgYiA9IHkxIC0gYSAqIHgxO1xyXG4gICAgICAgICAgICBsZXQgeSA9IHkxO1xyXG4gICAgICAgICAgICAvLyDnu5jliLbnm7Tnur9cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIC8vIOebtOe6v+WFrOW8j3k9YXgrYu+8jOi/memHjOS4jeW/heiuoeeul+i/meS4quWFrOW8j++8jOWboOS4uuW9k3jliqAx6Ieq5aKe5pe277yMeeS5n+S8muWKoGHvvIzmiYDku6Xlj6/ku6Xnm7TmjqXnlKh5K2Hku6Pmm79heCti77yM566X5piv5LiA5Liq5oCn6IO95LyY5YyW54K5XHJcbiAgICAgICAgICAgICAgICAvLyB5ID0gYSAqIHggKyBiO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiJZcclxuICAgICAgICAgICAgLy8gY29uc3QgeXMgPSB0aGlzLkludGVycG9sYXRlKHgxLCB5MSwgeDIsIHkyKTtcclxuICAgICAgICAgICAgLy8gZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuRHJhd1BpeGVsKHgsIHlzW3ggLSB4MV0sIGNvbG9yKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmlpznjoflpKfkuo4x77yM55u057q/5YGP5Z6C55u05oOF5Ya177yM5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoeTIgPCB5MSkgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhID0gZHggLyBkeTtcclxuICAgICAgICAgICAgbGV0IHggPSB4MTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHhzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4c1t5IC0geTFdLCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDIsIHkyLCB4MywgeTMsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgzLCB5MywgeDEsIHkxLCBjb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZUZpbGxlZCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5rOo77ya5Lul5LiL5o+Q5Yiw55qE6ZW/6L6577yM54m55oyHeei9tOi3qOW6puacgOmVv+eahOi+ue+8jOiAjOS4jeaYr+WunumZheS4iueahOi+uemVv1xyXG5cclxuICAgICAgICAvLyDlrp7pmYXnu5jliLbliLDlsY/luZXkuIrnmoTngrnvvIzlv4XpobvmmK/mlbTmlbDvvIzlj5bmlbTkuIDkuIvjgILkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgeDEgPSB4MSB8IDA7XHJcbiAgICAgICAgeTEgPSB5MSB8IDA7XHJcbiAgICAgICAgeDIgPSB4MiB8IDA7XHJcbiAgICAgICAgeTIgPSB5MiB8IDA7XHJcbiAgICAgICAgeDMgPSB4MyB8IDA7XHJcbiAgICAgICAgeTMgPSB5MyB8IDA7XHJcblxyXG4gICAgICAgIC8vIOWvueeCuei/m+ihjOaOkuW6j++8jOS9v+W+l3kxPD15Mjw9eTPvvIzljbPlj6/noa7lrprkuInop5LlvaLnmoTplb/ovrnkuLpMMTPvvIxMMTLlkoxMMjPliJnmmK/lj6blpJbkuKTmnaHnn63ovrlcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5M10gPSBbeDMsIHkzLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MiA+IHkzKSBbeDIsIHkyLCB4MywgeTNdID0gW3gzLCB5MywgeDIsIHkyXTtcclxuXHJcbiAgICAgICAgLy8g6I635Y+WM+adoei+ueeahOeCueWdkOagh+WQiOmbhlxyXG4gICAgICAgIGNvbnN0IHAxMiA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG5cclxuICAgICAgICAvLyDmi7zlkIjkuKTmnaHnn63ovrnkuLrkuIDmnaHplb/ovrnvvIjlhYjnp7vpmaTnrKzkuIDmnaHovrnnmoTmnIDlkI7kuIDkuKrmlbDmja7vvIzpgb/lhY3ph43lpI3vvIlcclxuICAgICAgICAvLyDnjrDlnKjlj5jmiJAy5p2h6ZW/6L6577yMTDEz5ZKMTDEyM1xyXG4gICAgICAgIHAxMi5wb3AoKTtcclxuICAgICAgICBjb25zdCBwMTIzID0gcDEyLmNvbmNhdChwMjMpO1xyXG5cclxuICAgICAgICAvLyDliKTmlq1MMTPlkoxMMTIz5ZOq5p2h6ZW/6L655piv5bem5ZOq5p2h5piv5Y+z77yM6YO95Y+W5pWw57uE5Lit6Ze055qE54K577yM5Yik5pat6LCB5bem6LCB5Y+z5Y2z5Y+v44CCXHJcbiAgICAgICAgLy8g5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIC8vIGNvbnN0IG0gPSBNYXRoLmZsb29yKHAxMjMubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgbSA9IChwMTIzLmxlbmd0aCA+PiAxKSB8IDA7XHJcbiAgICAgICAgbGV0IHBMZWZ0ID0gcDEyMztcclxuICAgICAgICBsZXQgcFJpZ2h0ID0gcDEzO1xyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIHBMZWZ0ID0gcDEzO1xyXG4gICAgICAgICAgICBwUmlnaHQgPSBwMTIzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q61XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHBMZWZ0W3kgLSB5MV07IHggPD0gcFJpZ2h0W3kgLSB5MV07IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWRXaXRoVmVydGV4Q29sb3IoXHJcbiAgICAgICAgeDE6IG51bWJlciwgeTE6IG51bWJlcixcclxuICAgICAgICB4MjogbnVtYmVyLCB5MjogbnVtYmVyLFxyXG4gICAgICAgIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsXHJcbiAgICAgICAgY29sb3IxOiBudW1iZXIsIGNvbG9yMjogbnVtYmVyLCBjb2xvcjM6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnmjIlZ5Z2Q5qCH5o6S5bqP77yM56Gu5L+deTEgPD0geTIgPD0geTNcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyLCBjb2xvcjEsIGNvbG9yMl0gPSBbeDIsIHkyLCB4MSwgeTEsIGNvbG9yMiwgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzLCBjb2xvcjEsIGNvbG9yM10gPSBbeDMsIHkzLCB4MSwgeTEsIGNvbG9yMywgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzLCBjb2xvcjIsIGNvbG9yM10gPSBbeDMsIHkzLCB4MiwgeTIsIGNvbG9yMywgY29sb3IyXTtcclxuXHJcbiAgICAgICAgLy8g5o+Q5Y+WUkdC5YiG6YePXHJcbiAgICAgICAgY29uc3QgYzEgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMSk7XHJcbiAgICAgICAgY29uc3QgYzIgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMik7XHJcbiAgICAgICAgY29uc3QgYzMgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMyk7XHJcblxyXG4gICAgICAgIC8vIOaPkuWAvOWHveaVsO+8jOminOiJsjHkuI7popzoibIy5ZyoZDEtZDLnmoTojIPlm7TlhoXlnYfljIDmj5LlgLxcclxuICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZUNvbG9yID0gKGQxOiBudW1iZXIsIHIxOiBudW1iZXIsIGcxOiBudW1iZXIsIGIxOiBudW1iZXIsIGExOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGQyOiBudW1iZXIsIHIyOiBudW1iZXIsIGcyOiBudW1iZXIsIGIyOiBudW1iZXIsIGEyOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCPXHJcbiAgICAgICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LlkoxNYXRoLmFic++8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgICAgICAvLyBjb25zdCBkeCA9IE1hdGguYWJzKE1hdGguZmxvb3IoZDIgLSBkMSkpO1xyXG4gICAgICAgICAgICBjb25zdCBkeCA9ICgoZDIgPiBkMSA/IGQyIC0gZDEgOiBkMSAtIGQyKSB8IDApO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+atpemVv1xyXG4gICAgICAgICAgICBjb25zdCBpbnZEZWx0YSA9IDEgLyAoZDIgLSBkMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gKHIyIC0gcjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gKGcyIC0gZzEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gKGIyIC0gYjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gKGEyIC0gYTEpICogaW52RGVsdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IHIxLCBnID0gZzEsIGIgPSBiMSwgYSA9IGExO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB7IHIsIGcsIGIsIGEgfTtcclxuICAgICAgICAgICAgICAgIHIgKz0gclN0ZXA7XHJcbiAgICAgICAgICAgICAgICBnICs9IGdTdGVwO1xyXG4gICAgICAgICAgICAgICAgYiArPSBiU3RlcDtcclxuICAgICAgICAgICAgICAgIGEgKz0gYVN0ZXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzkuInmnaHovrnnmoTlnZDmoIflkozpopzoibJcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMTJDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkxLCBjMS5yLCBjMS5nLCBjMS5iLCBjMS5hLCB5MiwgYzIuciwgYzIuZywgYzIuYiwgYzIuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAyM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTMsIGMzLnIsIGMzLmcsIGMzLmIsIGMzLmEpO1xyXG5cclxuICAgICAgICAvLyDlkIjlubbkuKTmnaHnn63ovrlcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuICAgICAgICBjb25zdCBwMTIzQ29sb3JzID0gcDEyQ29sb3JzLmNvbmNhdChwMjNDb2xvcnMpO1xyXG5cclxuICAgICAgICAvLyDnoa7lrprlt6blj7PovrnnlYxcclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBsZWZ0UG9pbnRzID0gcDEyMztcclxuICAgICAgICBsZXQgcmlnaHRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgbGV0IGxlZnRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIGxldCByaWdodENvbG9ycyA9IHAxM0NvbG9ycztcclxuXHJcbiAgICAgICAgaWYgKHAxM1ttXSA8IHAxMjNbbV0pIHtcclxuICAgICAgICAgICAgbGVmdFBvaW50cyA9IHAxMztcclxuICAgICAgICAgICAgcmlnaHRQb2ludHMgPSBwMTIzO1xyXG4gICAgICAgICAgICBsZWZ0Q29sb3JzID0gcDEzQ29sb3JzO1xyXG4gICAgICAgICAgICByaWdodENvbG9ycyA9IHAxMjNDb2xvcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu5jliLbmsLTlubPnur/mrrXvvIzlubbov5vooYzpopzoibLmj5LlgLxcclxuICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTM7IHkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB5IC0geTE7XHJcbiAgICAgICAgICAgIGNvbnN0IHhTdGFydCA9IGxlZnRQb2ludHNbaWR4XTtcclxuICAgICAgICAgICAgY29uc3QgeEVuZCA9IHJpZ2h0UG9pbnRzW2lkeF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0Q29sb3IgPSBsZWZ0Q29sb3JzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q29sb3IgPSByaWdodENvbG9yc1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgLy8g6aKE6K6h566X6aKc6Imy5beu5YC8XHJcbiAgICAgICAgICAgIGNvbnN0IHJEaWZmID0gcmlnaHRDb2xvci5yIC0gbGVmdENvbG9yLnI7XHJcbiAgICAgICAgICAgIGNvbnN0IGdEaWZmID0gcmlnaHRDb2xvci5nIC0gbGVmdENvbG9yLmc7XHJcbiAgICAgICAgICAgIGNvbnN0IGJEaWZmID0gcmlnaHRDb2xvci5iIC0gbGVmdENvbG9yLmI7XHJcbiAgICAgICAgICAgIGNvbnN0IGFEaWZmID0gcmlnaHRDb2xvci5hIC0gbGVmdENvbG9yLmE7XHJcblxyXG4gICAgICAgICAgICAvLyDmraXplb/lkozpopzoibLlop7ph49cclxuICAgICAgICAgICAgY29uc3QgaW52TGVuZ3RoID0gMSAvICgoeEVuZCAtIHhTdGFydCkgKyAxKTtcclxuICAgICAgICAgICAgY29uc3QgclN0ZXAgPSByRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgZ1N0ZXAgPSBnRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYlN0ZXAgPSBiRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYVN0ZXAgPSBhRGlmZiAqIGludkxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIOWIneWni+minOiJsuWAvFxyXG4gICAgICAgICAgICBsZXQgciA9IGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBsZXQgZyA9IGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBsZXQgYiA9IGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBsZXQgYSA9IGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5rC05bmz5pa55ZCR6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5hbENvbG9yID0gKChhIHwgMCkgPDwgMjQpIHwgKChiIHwgMCkgPDwgMTYpIHwgKChnIHwgMCkgPDwgOCkgfCAociB8IDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgZmluYWxDb2xvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g57Sv5Yqg6aKc6Imy5YC8XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDmipXlvbHnm7jlhbNcclxuXHJcbiAgICAvLyDlsIbop4blj6PkuIrnmoTlhoXlrrnmmKDlsITliLDlrp7pmYXlsY/luZXkuIpcclxuICAgIHB1YmxpYyBWaWV3cG9ydFRvQ2FudmFzKHBvaW50OiBWZWN0b3IyKSB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG5Y+j5a695bqm5Li6MeS4quWNleS9jVxyXG4gICAgICAgIC8vIOWboOS4umFzcGVjdFJhdGlvID0gY2FudmFzV2lkdGggLyBjYW52YXNIZWlnaHTvvIxcclxuICAgICAgICAvLyDmiYDku6Xop4blj6Ppq5jluqYgPSAxIC8gYXNwZWN0UmF0aW8gPSBjYW52YXNIZWlnaHQgLyBjYW52YXNXaWR0aFxyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSAxO1xyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gMSAvIENvbmZpZy5hc3BlY3RSYXRpbztcclxuXHJcbiAgICAgICAgLy8g5bCG5oqV5b2x5Z2Q5qCH5pig5bCE5YiwQ2FudmFz5YOP57Sg5Z2Q5qCHXHJcbiAgICAgICAgLy8gWOWdkOagh++8muS7jiBbLXZpZXdwb3J0V2lkdGgvMiwgdmlld3BvcnRXaWR0aC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc1dpZHRoXVxyXG4gICAgICAgIC8vIFnlnZDmoIfvvJrku44gWy12aWV3cG9ydEhlaWdodC8yLCB2aWV3cG9ydEhlaWdodC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc0hlaWdodF0gKOazqOaEj1novbTmlrnlkJEpXHJcbiAgICAgICAgY29uc3QgY2FudmFzWCA9ICgocG9pbnQueCArIHZpZXdwb3J0V2lkdGggLyAyKSAvIHZpZXdwb3J0V2lkdGgpICogQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSBDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgocG9pbnQueSArIHZpZXdwb3J0SGVpZ2h0IC8gMikgLyB2aWV3cG9ydEhlaWdodCkgKiBDb25maWcuY2FudmFzSGVpZ2h0KTsgLy8gQ2FudmFz55qEWei9tOmAmuW4uOaYr+WQkeS4i+eahFxyXG4gICAgICAgIHBvaW50LnggPSBjYW52YXNYO1xyXG4gICAgICAgIHBvaW50LnkgPSBjYW52YXNZO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmAj+inhuaKleW9se+8jOWwhjNE5Zy65pmv55qE5Z2Q5qCH6L2s5o2i5Li6MkTlsY/luZXlnZDmoIfvvIzmipXlsITliLDop4blj6PkuIpcclxuICAgIHB1YmxpYyBQcm9qZWN0VmVydGV4KHZlcnRleDogVmVjdG9yMyk6IFZlY3RvcjIge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhueCueWIsOi/keijgemdou+8iOinhuWPo++8ieeahOi3neemu+aYr2TvvIzop4blj6PnmoTlrr3mmK8xXHJcbiAgICAgICAgLy8g5qC55o2u5LiJ6KeS5Ye95pWw5pyJ77yadGFuKGZvdi8yKSA9ICgwLjUgLyBkKVxyXG4gICAgICAgIC8vIOaJgOS7pe+8mmQgPSAwLjUgLyB0YW4oZm92LzIpXHJcbiAgICAgICAgY29uc3QgZm92RGVncmVlcyA9IDYwO1xyXG4gICAgICAgIGNvbnN0IGZvdlJhZGlhbnMgPSBmb3ZEZWdyZWVzICogKE1hdGguUEkgLyAxODApOyAvLyDlsIbop5LluqbovazmjaLkuLrlvKfluqZcclxuICAgICAgICBjb25zdCBkID0gMC41IC8gTWF0aC50YW4oZm92UmFkaWFucyAvIDIpO1xyXG5cclxuICAgICAgICAvLyDpgI/op4blhazlvI/vvIzlgYforr7op4bngrnkvY3nva4oMCwwKe+8jOinhueCueWIsOinhuWPo+i3neemu+S4umTvvIzlnLrmma/ph4znmoTngrnkuLpQKHgseSx6Ke+8jOaKleWwhOWIsOinhuWPo+S4iueahOeCueS4ulAnKHgseSlcclxuICAgICAgICAvLyDliJnmoLnmja7nm7jkvLzkuInop5LlvaLmnInvvJp6IC8gZCA9IHggLyB4JyA9IHkgLyB5J++8jOWPr+W+l+WIsO+8mlxyXG4gICAgICAgIC8vIHgnID0gKGQgKiB4KSAvIHpcclxuICAgICAgICAvLyB5JyA9IChkICogeSkgLyB6XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblggPSAoZCAqIHZlcnRleC54KSAvIHZlcnRleC56O1xyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb25ZID0gKGQgKiB2ZXJ0ZXgueSkgLyB2ZXJ0ZXguejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHByb2plY3Rpb25YLCBwcm9qZWN0aW9uWSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOWPmOaNolxyXG5cclxuICAgIC8qXHJcbiAgICAgKiDpobbngrnlpITnkIbpmLbmrrXvvJrmqKHlnovnqbrpl7Qg4oaS77yI5qih5Z6L55+p6Zi16Zi177yJ4oaSIOS4lueVjOepuumXtCDihpLvvIjop4blm77nn6npmLXvvInihpIg6KeC5a+f56m66Ze0IOKGku+8iOaKleW9seefqemYte+8ieKGkiDoo4Hliarnqbrpl7Qg4oaS77yI6YCP6KeG6Zmk5rOV77yJ4oaSIE5EQyDnqbrpl7Qg4oaS77yI6KeG5Y+j5Y+Y5o2i77yJ4oaSIOWxj+W5leepuumXtCDihpIg5YWJ5qCF5YyW5riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2Uob2JqOiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSBvYmoubW9kZWw7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBtb2RlbC52ZXJ0aWNlcztcclxuICAgICAgICBjb25zdCBjbGlwU3BhY2VWZXJ0aWNlcyA9IG5ldyBBcnJheSh2ZXJ0aWNlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyDmnoTlu7pNVlDnn6npmLVcclxuICAgICAgICBjb25zdCBtb2RlbE1hdHJpeCA9IG9iai50cmFuc2Zvcm0ubG9jYWxUb1dvcmxkTWF0cml4O1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IENhbWVyYS5tYWluQ2FtZXJhO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYUZvcndhcmQgPSBjYW1lcmEudHJhbnNmb3JtLmZvcndhcmQ7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhVXAgPSBjYW1lcmEudHJhbnNmb3JtLnVwO1xyXG4gICAgICAgIC8vIOaehOW7uuS4gOS4quWFiOacneaRhOW9seacuuWPjeaWueWQkeenu+WKqO+8jOWGjeWPjeaWueWQkeaXi+i9rOeahOefqemYte+8jOWFtuWunuW+l+WIsOeahOS5n+WwseaYr+S4iumdouaRhOW9seacuueahOS4lueVjOWdkOagh+efqemYtVxyXG4gICAgICAgIGNvbnN0IG1vZGVsVmlld01hdHJpeCA9IG1vZGVsTWF0cml4LmNsb25lKCkudHJhbnNmb3JtVG9Mb29rQXRTcGFjZShjYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLCBjYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLmFkZChjYW1lcmFGb3J3YXJkKSwgY2FtZXJhVXApO1xyXG4gICAgICAgIGNvbnN0IG12cE1hdHJpeCA9IG1vZGVsVmlld01hdHJpeC5wZXJzcGVjdGl2ZShjYW1lcmEuZm92LCBjYW1lcmEuYXNwZWN0LCBjYW1lcmEubmVhckNsaXAsIGNhbWVyYS5mYXJDbGlwKTtcclxuXHJcbiAgICAgICAgLy8gMS4gTVZQ5Y+Y5o2i5Yiw6KOB5Ymq56m66Ze0XHJcbiAgICAgICAgLy8g5qih5Z6L56m66Ze0IC0+IOS4lueVjOepuumXtCAtPiDop4Llr5/nqbrpl7QgLT4g6KOB5Ymq56m66Ze0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdmVydGljZSA9IHZlcnRpY2VzW2ldLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGxldCB2ID0gbXZwTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2ZXJ0aWNlLCAxKSk7XHJcbiAgICAgICAgICAgIGNsaXBTcGFjZVZlcnRpY2VzW2ldID0gdjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDIuIOmAj+inhumZpOazle+8muWwhuijgeWJquepuumXtOWdkOagh+i9rOaNouS4uuagh+WHhuiuvuWkh+WdkOagh++8iE5EQ++8iVxyXG4gICAgICAgIC8vIOijgeWJquepuumXtCAtPiDmoIflh4bljJborr7lpIflnZDmoIfvvIhOREMg56m66Ze077yJXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB2ID0gY2xpcFNwYWNlVmVydGljZXNbaV07XHJcbiAgICAgICAgICAgIC8vIHfliIbph4/mmK/pgI/op4bmipXlvbHkuqfnlJ/nmoTvvIznlKjkuo7pgI/op4bpmaTms5VcclxuICAgICAgICAgICAgY29uc3QgdyA9IHYudzsgLy8g5YGH6K6+5L2g55qEVmVjdG9yNC9WZWN0b3Iz5a6e546w5Lit77yM6b2Q5qyh5Z2Q5qCHd+WtmOWCqOWcqHflsZ7mgKfkuK3jgILlpoLmnpzmsqHmnInvvIzpnIDopoHnoa7kv51NVlDlj5jmjaLml7blpITnkIbkuobpvZDmrKHlnZDmoIfjgIJcclxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5pi+5byP55qEd+WIhumHj++8jOS4lG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjPov5Tlm57nmoTmmK9WZWN0b3Iz77yM6YKj5LmI6YCa5bi46K6k5Li6dz0x77yI5q2j5Lqk5oqV5b2x77yJ5oiW6ICF6ZyA6KaB5LuO5Y+Y5o2i55+p6Zi15Lit6ICD6JmR6YCP6KeGXHJcblxyXG4gICAgICAgICAgICAvLyDov5vooYzpgI/op4bpmaTms5XvvJp4eXrliIbliKvpmaTku6V3XHJcbiAgICAgICAgICAgIC8vIOazqOaEj++8muWmguaenOS9oOeahOefqemYteS5mOazleayoeacieWkhOeQhum9kOasoeWdkOagh++8iOWNs+i/lOWbnueahHZlcnRpY2XmmK/kuInnu7TlkJHph4/vvInvvIzpgqPkuYjlvojlj6/og73kvaDnmoTlj5jmjaLmsqHmnInljIXlkKvpgI/op4bmipXlvbHkuqfnlJ/nmoR35YiG6YeP44CCXHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuS9oOeahG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjPnoa7lrp7ov5Tlm57kuobljIXlkKvpvZDmrKHlnZDmoIfnmoRWZWN0b3I077yM5oiW6ICF5pyJ5LiA5Liq6L+U5ZueVmVjdG9yNOeahOaWueazleOAglxyXG4gICAgICAgICAgICAvLyDov5nph4zlgYforr4gcHJvamVjdGVkVmVydGljZXMg5Lit5a2Y5YKo55qE5pivIFZlY3RvcjTvvIzmiJbogIXoh7PlsJHmnIkgeCwgeSwgeiwgdyDlsZ7mgKfjgIJcclxuXHJcbiAgICAgICAgICAgIC8vIOWmguaenOaCqOeahOWunueOsOS4re+8jOe7j+i/h+mAj+inhuaKleW9seefqemYteWPmOaNouWQju+8jOmhtueCueW3sue7j+aYr+S4gOS4qum9kOasoeWdkOagh++8iHgsIHksIHosIHfvvInvvIzliJnpnIDopoHku6XkuIvpmaTms5XvvJpcclxuICAgICAgICAgICAgdi54ID0gdi54IC8gdztcclxuICAgICAgICAgICAgdi55ID0gdi55IC8gdztcclxuICAgICAgICAgICAgdi56ID0gdi56IC8gdzsgLy8g5a+55LqO5rex5bqm5L+h5oGv77yM5Y+v6IO96L+Y6ZyA6KaB6L+b5LiA5q2l5aSE55CG77yM5L2G5bGP5bmV5pig5bCE6YCa5bi45Li76KaB5YWz5rOoeCx5XHJcbiAgICAgICAgICAgIC8vIOe7j+i/h+mAj+inhumZpOazleWQju+8jOWdkOagh+S9jeS6juagh+WHhuiuvuWkh+WdkOagh++8iE5EQ++8ieepuumXtO+8jOmAmuW4uHgsIHksIHrojIPlm7TlnKhbLTEsIDFd77yIT3BlbkdM6aOO5qC877yJ5oiWWzAsIDFd77yIRGlyZWN0WOmjjuagvO+8ieS5i+mXtOOAglxyXG4gICAgICAgICAgICAvLyDlgYforr7miJHku6znmoROREPmmK9bLTEsIDFd6IyD5Zu044CCXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAzLiDop4blj6Plj5jmjaLvvJrlsIZOREPlnZDmoIfmmKDlsITliLDlsY/luZXlnZDmoIdcclxuICAgICAgICAvLyDmoIflh4bljJborr7lpIflnZDmoIfvvIhOREMg56m66Ze077yJIC0+IOWxj+W5leepuumXtFxyXG4gICAgICAgIC8vIOiOt+WPlueUu+W4g++8iOaIluinhuWPo++8ieeahOWuveW6puWSjOmrmOW6plxyXG4gICAgICAgIGNvbnN0IHNjcmVlblZlcnRpY2VzID0gbmV3IEFycmF5KGNsaXBTcGFjZVZlcnRpY2VzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBuZGMgPSBjbGlwU3BhY2VWZXJ0aWNlc1tpXTsgLy8g5q2k5pe2bmRj5bqU6K+l5piv57uP6L+H6YCP6KeG6Zmk5rOV5ZCO55qETkRD5Z2Q5qCHXHJcblxyXG4gICAgICAgICAgICAvLyDlsIZOREPnmoR45LuOWy0xLCAxXeaYoOWwhOWIsFswLCBzY3JlZW5XaWR0aF1cclxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuWCA9ICgobmRjLnggKyAxKSAvIDIpICogQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgICAgICAvLyDlsIZOREPnmoR55LuOWy0xLCAxXeaYoOWwhOWIsFswLCBzY3JlZW5IZWlnaHRd44CC5rOo5oSP5bGP5bmV5Z2Q5qCH6YCa5bi4eeWQkeS4i+S4uuato++8jOiAjE5EQ+eahHnlkJHkuIrkuLrmraPvvIzmiYDku6XpnIDopoHnv7vovaxcclxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuWSA9IENvbmZpZy5jYW52YXNIZWlnaHQgLSAoKChuZGMueSArIDEpIC8gMikgKiBDb25maWcuY2FudmFzSGVpZ2h0KTtcclxuICAgICAgICAgICAgLy8geuWIhumHj+mAmuW4uOeUqOS6jua3seW6pua1i+ivle+8jOi/memHjOaIkeS7rOWPquWFs+W/g+Wxj+W5lXgseVxyXG4gICAgICAgICAgICAvLyDlpoLmnpzkvaDnmoROREN66IyD5Zu05pivWy0xLDFd5LiU6ZyA6KaB5pig5bCE5YiwWzAsMV3vvIjkvovlpoJXZWJHUFXmn5Dkupvmg4XlhrXvvInvvIzlj6/ku6XnsbvkvLzlpITnkIbvvJpjb25zdCBzY3JlZW5aID0gKG5kYy56ICsgMSkgLyAyO1xyXG5cclxuICAgICAgICAgICAgc2NyZWVuVmVydGljZXNbaV0gPSB7IHg6IHNjcmVlblgsIHk6IHNjcmVlblkgfTsgLy8g5a2Y5YKo5bGP5bmV5Z2Q5qCHXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuVmVydGljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIOeugOWNleWPmOaNoumYtuaute+8muayoeaciemAmui/h+efqemYteiuoeeul++8jOiAjOaYr+eugOWNleeahOebuOS8vOS4ieinkuW9ouWOn+eQhu+8jOS4ieinkuWHveaVsOeul+WHuk1WUOWPmOaNoui3n+Wxj+W5leaYoOWwhO+8jOeQhuino+i1t+adpeavlOi+g+eugOWNle+8jOS9huavj+S4qumhtueCuemDvee7j+i/h+S7juWktOWIsOWwvueahOiuoeeul++8jOavlOi+g+iAl+aAp+iDvVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgRWFzeVZlcnRleFByb2Nlc3NpbmdTdGFnZShvYmo6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IG9iai5tb2RlbDtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG1vZGVsLnZlcnRpY2VzO1xyXG4gICAgICAgIGNvbnN0IGNsaXBTcGFjZVZlcnRpY2VzID0gbmV3IEFycmF5KHZlcnRpY2VzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIC8vIOeugOWNleWPmOaNolxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRpY2UgPSB2ZXJ0aWNlc1tpXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICAvLyDlhYjlj5jmjaLvvIzlv4XpobvkuKXmoLzmjInnhaflhYjnvKnmlL7vvIzlho3ml4vovazvvIzlho3lubPnp7tcclxuICAgICAgICAgICAgdGhpcy5TY2FsZVZlcnRleCh2ZXJ0aWNlLCBvYmoudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdGhpcy5Sb3RhdGVWZXJ0ZXgodmVydGljZSwgb2JqLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlVmVydGV4KHZlcnRpY2UsIG9iai50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAvLyDlho3mipXlvbFcclxuICAgICAgICAgICAgY2xpcFNwYWNlVmVydGljZXNbaV0gPSB0aGlzLlByb2plY3RWZXJ0ZXgodmVydGljZSk7XHJcbiAgICAgICAgICAgIC8vIOWGjeinhuWPo+aYoOWwhFxyXG4gICAgICAgICAgICB0aGlzLlZpZXdwb3J0VG9DYW52YXMoY2xpcFNwYWNlVmVydGljZXNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsaXBTcGFjZVZlcnRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTY2FsZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKj0gdHJhbnNmb3JtLnNjYWxlLng7XHJcbiAgICAgICAgdmVydGV4LnkgKj0gdHJhbnNmb3JtLnNjYWxlLnk7XHJcbiAgICAgICAgdmVydGV4LnogKj0gdHJhbnNmb3JtLnNjYWxlLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJvdGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgZXVsZXJBbmdsZXMgPSB0cmFuc2Zvcm0ucm90YXRpb24uZXVsZXJBbmdsZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvc1ggPSBNYXRoLmNvcyhldWxlckFuZ2xlcy54KTtcclxuICAgICAgICBjb25zdCBzaW5YID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueCk7XHJcbiAgICAgICAgY29uc3QgY29zWSA9IE1hdGguY29zKGV1bGVyQW5nbGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IHNpblkgPSBNYXRoLnNpbihldWxlckFuZ2xlcy55KTtcclxuICAgICAgICBjb25zdCBjb3NaID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueik7XHJcbiAgICAgICAgY29uc3Qgc2luWiA9IE1hdGguc2luKGV1bGVyQW5nbGVzLnopO1xyXG4gICAgICAgIC8vIOWFiOe7lVrovbTml4vovaxcclxuICAgICAgICBjb25zdCB4ID0gdmVydGV4LnggKiBjb3NaIC0gdmVydGV4LnkgKiBzaW5aO1xyXG4gICAgICAgIGNvbnN0IHkgPSB2ZXJ0ZXgueCAqIHNpblogKyB2ZXJ0ZXgueSAqIGNvc1o7XHJcbiAgICAgICAgdmVydGV4LnggPSB4O1xyXG4gICAgICAgIHZlcnRleC55ID0geTtcclxuICAgICAgICAvLyDlho3nu5VZ6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeiA9IHZlcnRleC56ICogY29zWSAtIHZlcnRleC54ICogc2luWTtcclxuICAgICAgICBjb25zdCB4MiA9IHZlcnRleC56ICogc2luWSArIHZlcnRleC54ICogY29zWTtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHo7XHJcbiAgICAgICAgdmVydGV4LnggPSB4MjtcclxuICAgICAgICAvLyDmnIDlkI7nu5VY6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeTIgPSB2ZXJ0ZXgueSAqIGNvc1ggLSB2ZXJ0ZXgueiAqIHNpblg7XHJcbiAgICAgICAgY29uc3QgejIgPSB2ZXJ0ZXgueSAqIHNpblggKyB2ZXJ0ZXgueiAqIGNvc1g7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5MjtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHoyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUcmFuc2xhdGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZlcnRleC54ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZlcnRleC55ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZlcnRleC56ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDliZTpmaToo4HliapcclxuXHJcbiAgICAvLyDop4bplKXkvZPliZTpmaRcclxuICAgIHB1YmxpYyBGcnVzdHVtQ3VsbGluZygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6IOM6Z2i5YmU6ZmkXHJcbiAgICBwdWJsaWMgQmFja2ZhY2VDdWxsaW5nKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyDpga7mjKHliZTpmaRcclxuICAgIHB1YmxpYyBPY2NsdXNpb25DdWxsaW5nKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ2xpcFRyaWFuZ2xlKHRyaWFuZ2xlOiBWZWN0b3IzW10pIHtcclxuICAgICAgICAvLyAxLuiuoeeul+S4ieinkuW9oueahOS4reW/g1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAodHJpYW5nbGVbMF0ueCArIHRyaWFuZ2xlWzFdLnggKyB0cmlhbmdsZVsyXS54KSAvIDMsXHJcbiAgICAgICAgICAgICh0cmlhbmdsZVswXS55ICsgdHJpYW5nbGVbMV0ueSArIHRyaWFuZ2xlWzJdLnkpIC8gMyxcclxuICAgICAgICAgICAgKHRyaWFuZ2xlWzBdLnogKyB0cmlhbmdsZVsxXS56ICsgdHJpYW5nbGVbMl0ueikgLyAzXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g57uY5Yi254mp5L2TXHJcblxyXG4gICAgcHVibGljIERyYXdPYmplY3QocmVuZGVyZXI6IFJlbmRlcmVyKSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSByZW5kZXJlci5tb2RlbDtcclxuICAgICAgICBjb25zdCBpbmRpY2VzID0gbW9kZWwuZmFjZXMuZmxhdE1hcChmYWNlID0+IGZhY2UudmVydGV4SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIC8vIDEu5YmU6ZmkXHJcbiAgICAgICAgdGhpcy5GcnVzdHVtQ3VsbGluZygpO1xyXG4gICAgICAgIHRoaXMuQmFja2ZhY2VDdWxsaW5nKCk7XHJcbiAgICAgICAgdGhpcy5PY2NsdXNpb25DdWxsaW5nKCk7XHJcblxyXG4gICAgICAgIC8vIDIu5Y+Y5o2iXHJcbiAgICAgICAgLy8gTVZQ5Y+Y5o2iXHJcbiAgICAgICAgY29uc3Qgc2NyZWVuVmVydGljZXMgPSB0aGlzLlZlcnRleFByb2Nlc3NpbmdTdGFnZShyZW5kZXJlcik7XHJcbiAgICAgICAgLy8g566A5Y2VTVZQ5Y+Y5o2iXHJcbiAgICAgICAgLy8gY29uc3Qgc2NyZWVuVmVydGljZXMgPSB0aGlzLkVhc3lWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2Uob2JqKTtcclxuXHJcbiAgICAgICAgLy8gMy7oo4HliapcclxuXHJcbiAgICAgICAgLy8gNC7lhYnmoIXljJbkuI7lg4/ntKDnu5jnlLtcclxuICAgICAgICAvLyDmnIDlkI7nu5jliLbkuInop5LlvaLliLDlsY/luZXkuIpcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgcDEgPSBzY3JlZW5WZXJ0aWNlc1tpbmRpY2VzW2ldXTtcclxuICAgICAgICAgICAgY29uc3QgcDIgPSBzY3JlZW5WZXJ0aWNlc1tpbmRpY2VzW2kgKyAxXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAzID0gc2NyZWVuVmVydGljZXNbaW5kaWNlc1tpICsgMl1dO1xyXG5cclxuICAgICAgICAgICAgLy8g57q/5qGG5qih5byP77yM5pqC5LiN5pSv5oyB6aG254K56ImyXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5XaXJlZnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1RyaWFuZ2xlKHAxLngsIHAxLnksIHAyLngsIHAyLnksIHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwocDEueCwgcDEueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwocDIueCwgcDIueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwocDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZHJhd01vZGUgPT09IERyYXdNb2RlLlNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGUocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlt6Xlhbflh73mlbBcclxuXHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8g57q/5oCn5o+S5YC8XHJcbiAgICAvLy8g5Lyg5YWlMuS4queCue+8jOi/lOWbnuWug+S7rOe7hOaIkOe6v+auteeahOaPkuWAvOOAglxyXG4gICAgLy8vIOimgeaxgu+8mlxyXG4gICAgLy8vIDEuIOimgeWFiOeul+WHuuebtOe6v+WBj+awtOW5s+i/mOaYr+WeguebtO+8jOWmguaenOaYr+WBj+awtOW5s++8iOaWnOeOh+Wwj+S6jjHvvInvvIzliJnku6V45Li65b6q546v77yM5Lyg5YWl6aG65bqP5pivKHgxLHkxLHgyLHkyKe+8jOWPjeS5i+WmguaenOebtOe6v+WBj+WeguebtO+8jOWImeaYryh5MSx4MSx5Mix4MilcclxuICAgIC8vLyAyLiDlkIzml7bopoHnoa7kv53nur/mrrXngrnnmoTmlrnlkJHmmK/ku47lt6blvoDlj7PmiJbku47kuIrlvoDkuIvvvIzkvovlpoLnur/mrrXmmK/lgY/msLTlubPnmoTor53vvIzopoHnoa7kv514Mj54Me+8jOWmguaenOaYr+WBj+WeguebtOeahOivne+8jOimgeehruS/nXkyPnkxXHJcbiAgICAvLy8g5Li+5Liq5L6L5a2Q77yaXHJcbiAgICAvLy8g54K5KDAsIDAp5ZKMKDIsMSnvvIzkvKDlhaXnmoTlj4LmlbDmmK8oMCwgMCwgMiwgMSnvvIzov5Tlm57nmoTmmK8oKDItMCkrMT0zKeS4quWAvO+8jOi/meS6m+WAvOaYr+S7jigwLTEp5Lit6Ze05o+S5YC855qE77yM5Y2zKDAsIDAuNSwgMSlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBwcml2YXRlIEludGVycG9sYXRlKGExOiBudW1iZXIsIGIxOiBudW1iZXIsIGEyOiBudW1iZXIsIGIyOiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCP5Lul6YG/5YWN5Yqo5oCB5omp5a65XHJcbiAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGEyIC0gYTEpKTtcclxuICAgICAgICBjb25zdCBkeCA9ICgoYTIgPiBhMSA/IGEyIC0gYTEgOiBhMSAtIGEyKSB8IDApO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcbiAgICAgICAgY29uc3QgYSA9IChiMiAtIGIxKSAvIChhMiAtIGExKTtcclxuICAgICAgICBsZXQgZCA9IGIxO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlW2ldID0gZDtcclxuICAgICAgICAgICAgZCArPSBhO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vR2FtZU9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJvb3RHYW1lT2JqZWN0czogR2FtZU9iamVjdFtdID0gW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBhZGRHYW1lT2JqZWN0KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJvb3RHYW1lT2JqZWN0cy5wdXNoKGdhbWVPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgcmVtb3ZlR2FtZU9iamVjdChnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJvb3RHYW1lT2JqZWN0cy5pbmRleE9mKGdhbWVPYmplY3QpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290R2FtZU9iamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSb290R2FtZU9iamVjdHMoKTogR2FtZU9iamVjdFtdIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMucm9vdEdhbWVPYmplY3RzXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmm7TmlrDmiYDmnInmoLnmuLjmiI/lr7nosaHlj4rlhbblrZDlr7nosaFcclxuICAgICAgICBmb3IgKGNvbnN0IGdhbWVPYmplY3Qgb2YgdGhpcy5yb290R2FtZU9iamVjdHMpIHtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdC5zdGFydENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdC51cGRhdGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU2NlbmUgfSBmcm9tIFwiLi9TY2VuZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFNjZW5lTWFuYWdlcjtcclxuICAgIHByaXZhdGUgc2NlbmVzOiBNYXA8c3RyaW5nLCBTY2VuZT4gPSBuZXcgTWFwPHN0cmluZywgU2NlbmU+KCk7XHJcbiAgICBwcml2YXRlIGFjdGl2ZVNjZW5lOiBTY2VuZSB8IG51bGwgPSBudWxsO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaW5zdGFuY2UoKTogU2NlbmVNYW5hZ2VyIHtcclxuICAgICAgICBpZiAoIVNjZW5lTWFuYWdlci5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLl9pbnN0YW5jZSA9IG5ldyBTY2VuZU1hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFNjZW5lTWFuYWdlci5faW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBjcmVhdGVTY2VuZShuYW1lOiBzdHJpbmcpOiBTY2VuZSB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmUgPSBuZXcgU2NlbmUobmFtZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMuc2V0KG5hbWUsIHNjZW5lKTtcclxuICAgICAgICByZXR1cm4gc2NlbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRTY2VuZShuYW1lOiBzdHJpbmcpOiBTY2VuZSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NlbmVzLmdldChuYW1lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldEFjdGl2ZVNjZW5lKHNjZW5lOiBTY2VuZSB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2NlbmUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kU2NlbmUgPSB0aGlzLnNjZW5lcy5nZXQoc2NlbmUpO1xyXG4gICAgICAgICAgICBpZiAoZm91bmRTY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVTY2VuZSA9IGZvdW5kU2NlbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0QWN0aXZlU2NlbmUoKTogU2NlbmUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVTY2VuZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZUFjdGl2ZVNjZW5lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVNjZW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgTWF0cml4NHg0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaXg0eDRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVPYmplY3Q6IEdhbWVPYmplY3Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IEFycmF5PFRyYW5zZm9ybT47XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50OiBUcmFuc2Zvcm0gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RlbXBQb3M6IFZlY3RvcjM7XHJcbiAgICBwcml2YXRlIF90ZW1wUm90OiBRdWF0ZXJuaW9uO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFNjYWxlOiBWZWN0b3IzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgQXJyYXk8VHJhbnNmb3JtPigpO1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdGVtcFBvcyA9IFZlY3RvcjMuWkVSTztcclxuICAgICAgICB0aGlzLl90ZW1wUm90ID0gUXVhdGVybmlvbi5pZGVudGl0eTtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBWZWN0b3IzLk9ORTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGZNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFRSU01hdHJpeCh0aGlzLl90ZW1wUG9zLCB0aGlzLl90ZW1wUm90LCB0aGlzLl90ZW1wU2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbG9jYWxUb1dvcmxkTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubG9jYWxUb1dvcmxkTWF0cml4IDogTWF0cml4NHg0LmlkZW50aXR5O1xyXG4gICAgICAgIHJldHVybiBwLm11bHRpcGx5KHRoaXMuc2VsZk1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFRvTG9jYWxNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC53b3JsZFRvTG9jYWxNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZk1hdHJpeC5pbnZlcnNlKCkubXVsdGlwbHkocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB4KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHgoeDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB5KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHkoeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB6KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHooejogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnogPSB6O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmb3J3YXJkKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8v5oiR5Lus6KaB5b6X5Yiw55qE5piv5LiA5Liq5pa55ZCR77yM5Zug5q2k5LiN6ZyA6KaB5L2N572u5L+h5oGv77yM5bCG6b2Q5qyh5Z2Q5qCH55qEd+iuvue9ruS4ujDvvIzmipvlvIPmjonlnZDmoIfkv6Hmga9cclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuRk9SV0FSRCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1cCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuVVAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmlnaHQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLlJJR0hULCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUG9zLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwb3NpdGlvbihwb3M6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRQb3NpdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdGlvbigpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFJvdC5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24ocTogUXVhdGVybmlvbikge1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wU2NhbGUuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNjYWxlKHM6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBUcmFuc2Zvcm0gfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQocGFyZW50OiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAocGFyZW50ICE9IG51bGwgJiYgcGFyZW50ICE9IHRoaXMgJiYgcGFyZW50ICE9IHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77ya54i26IqC54K55piv5b2T5YmN6IqC54K555qE5a2Q6IqC54K577yM5bCG5a2Q6IqC55qE6K6+572u5Li66Ieq5bex55qE54i26IqC54K577yM5Lya5q275b6q546vXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzUGFyZW50KHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNldCBwYXJlbnQsIHRoaXMgbm9kZSBpcyB0aGUgcGFyZW50IG5vZGUncyBwYXJlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOW9k+WJjeiKgueCueacieeItuiKgueCue+8jOimgeWFiOenu+mZpOaXp+eahFxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBhcmVudCA9PSBudWxsICYmIHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/oioLngrlw5piv5ZCm5piv5b2T5YmN6IqC54K555qE5LiK57qnXHJcbiAgICBwdWJsaWMgaGFzUGFyZW50KHA6IFRyYW5zZm9ybSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgPT0gcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGFzUGFyZW50KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9IHRoaXMgJiYgIXRoaXMuY2hpbGRyZW4uaW5jbHVkZXMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77yaY2hpbGToioLngrnmmK/lvZPliY3oioLngrnnmoTniLboioLngrnvvIzlsIbniLboioLnmoTorr7nva7kuLroh6rlt7HnmoTlrZDoioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGFyZW50KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2hpbGQsIHRoaXMgbm9kZSBpcyB0aGUgY2hpbGQgbm9kZSdzIGNoaWxkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzlrZDoioLngrnmnInml6fnmoTniLboioLngrnvvIzopoHlhYjnp7vpmaRcclxuICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnljp/kuJbnlYzlnZDmoIfkvY3nva7vvIzlhYjmnJ3niLboioLngrnnmoTlj5jmjaLnmoTlj43mlrnlkJHnp7vliqjvvIznhLblkI7lho3mt7vliqDov5vljrvvvIzlsLHog73kv53mjIHkuJbnlYzlnZDmoIfkuI3lj5hcclxuICAgICAgICAgICAgICAgIC8v5Y2z5Y+Y5o2i5Yiw54i26IqC54K555qE6YCG55+p6Zi16YeMXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5KGNoaWxkLnNlbGZNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBQb3MgPSBtLmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBSb3QgPSBtLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBTY2FsZSA9IG0uZ2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUNoaWxkKGNoaWxkOiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQsIDApO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnkuJbnlYzlnZDmoIfvvIznm7TmjqXlsIbmnKzlnLDlnZDmoIfnrYnlkIzkuo7lvZPliY3kuJbnlYzlnZDmoIfljbPlj69cclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Ob2RlU3BhY2UodjogVmVjdG9yMywgdzogbnVtYmVyID0gMSk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICrlsIbmn5DkuKrlnZDmoIfovazliLDoh6rlt7HnmoTlsYDpg6jnqbrpl7TvvIzkvovlpoLlvZPliY3nmoTlsYDpg6jlnZDmoIfljp/ngrnlnKjkuJbnlYzlnZDmoIfnmoTvvIgx77yMMe+8ieWkhFxyXG4gICAgICAgICAq54K5cOWcqOS4lueVjOWdkOagh++8iDLvvIwx77yJ5aSE77yM6YKj5LmI5bCG54K5cOebuOWvueS6juW9k+WJjeWxgOmDqOWdkOagh+ezu+eahOS9jee9ruWwseaYr++8iDLvvIwx77yJLe+8iDHvvIwx77yJPSDvvIgx77yMIDDvvIlcclxuICAgICAgICAgKuWNs+WwhueCuXDlj43lkJHlj5jmjaLlvZPliY3nmoTnn6npmLUgXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2LCB3KSkudmVjdG9yMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udmVydFRvV29ybGRTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2LCB3KSkudmVjdG9yMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveShkZXN0cm95Q2hpbGRyZW46IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKGRlc3Ryb3lDaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveShkZXN0cm95Q2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tIFwiLi9EaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IE9CSlBhcnNlciB9IGZyb20gXCIuL09ialBhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0TG9hZGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZpbGVDYWNoZTogRGljdGlvbmFyeSA9IG5ldyBEaWN0aW9uYXJ5KCk7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkSW1hZ2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4oKHJlc29sdmUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHRoZSBpbWFnZSBvYmplY3QnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIG9uIGxvYWRpbmcgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCBpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOi3qOWMuuivt+axglxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY3Jvc3NPcmlnaW4gPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRlbGwgdGhlIGJyb3dzZXIgdG8gbG9hZCBhbiBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZU5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRUZXh0RmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgcmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTW9kZWxGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPE9CSkRvYz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxPQkpEb2M+KChyZXNvbHZlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmpEb2MgPSBuZXcgT0JKRG9jKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCBvYmpEb2MucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQsIDEsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPQkogZmlsZSBwYXJzaW5nIGVycm9yOiBcIiArIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgb2JqRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5LiN6KaB5byA5ZCv5byC5q2l77yM6K6+572u5Li6ZmFsc2XvvIzlkKbliJnlrrnmmJPljaHlnKhyZWFkeVN0YXRlID0gMe+8jOWOn+WboOS4jeaYjlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIGZpbGVOYW1lLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRJbnN0YW5jZUZyb21Nb2RlbChuYW1lOiBzdHJpbmcsIG1vZGVsUGF0aDogc3RyaW5nLCBzY2FsZTogbnVtYmVyID0gMSwgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxHYW1lT2JqZWN0PiB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gbmV3IEdhbWVPYmplY3QobmFtZSk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uaWRlbnRpdHk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gVmVjdG9yMy5PTkU7XHJcblxyXG4gICAgICAgIHZhciBvYmpEb2MgPSBhd2FpdCBBc3NldExvYWRlci5sb2FkVGV4dEZpbGUobW9kZWxQYXRoKTtcclxuICAgICAgICBpZiAob2JqRG9jICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBPQkpQYXJzZXIucGFyc2VPQkoob2JqRG9jKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UubW9kZWwgPSBtb2RlbDtcclxuXHJcbiAgICAgICAgICAgIC8vIOi+k+WHuue7n+iuoeS/oeaBr1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhPQkpQYXJzZXIuZ2V0TW9kZWxTdGF0cyhtb2RlbCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gdmFyIG9ianMgPSBvYmpEb2MuZ2V0T2JqcyhzY2FsZSwgcmV2ZXJzZSk7XHJcbiAgICAgICAgICAgIC8vIG9ianMuZm9yRWFjaChhc3luYyBvYmogPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgLy90b2RvOuS4tOatu+WGmeatu++8jOWPquWKoOi9vea8q+WPjeWwhOi0tOWbvlxyXG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKG9iai5tYXRlcmlhbCAhPSBudWxsICYmIG9iai5tYXRlcmlhbC5tYXBfS2QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHJlbmRlci5tYXRlcmlhbC5jcmVhdGVUZXh0dXJlKG9iai5tYXRlcmlhbC5tYXBfS2QpO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLnZlcnRpY2VzID0gb2JqLnZlcnRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwuaW5kaWNlcyA9IG9iai5pbmRpY2VzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwudXZzID0gb2JqLnV2cztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLm5vcm1hbHMgPSBvYmoubm9ybWFscztcclxuICAgICAgICAgICAgLy8gICAgIGluc3RhbmNlLm1vZGVsLnB1c2gobW9kZWwpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xyXG5cclxuICBpdGVtczogb2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcclxuICAgIHRoaXMuaXRlbXNba2V5XSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuaXRlbXNba2V5XSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5pdGVtc1trXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGZ1bikge1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGZ1bihrLCB0aGlzLml0ZW1zW2tdKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAnLi4vTWF0aC9WZWN0b3IzJztcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gJy4uL01hdGgvVmVjdG9yMic7XHJcbmltcG9ydCB7IEZhY2UsIE9CSk1vZGVsIH0gZnJvbSAnLi4vTW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIE9CSuaWh+S7tuino+aekOWZqOexu1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE9CSlBhcnNlciB7XHJcbiAgICAvKipcclxuICAgICAqIOino+aekE9CSuaWh+S7tlxyXG4gICAgICogQHBhcmFtIGZpbGVDb250ZW50IE9CSuaWh+S7tuWGheWuuVxyXG4gICAgICogQHJldHVybnMg6Kej5p6Q5ZCO55qET0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2VPQkooZmlsZUNvbnRlbnQ6IHN0cmluZyk6IE9CSk1vZGVsIHtcclxuICAgICAgICBjb25zdCBsaW5lcyA9IGZpbGVDb250ZW50LnNwbGl0KCdcXG4nKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBPQkpNb2RlbCA9IHtcclxuICAgICAgICAgICAgdmVydGljZXM6IFtdLFxyXG4gICAgICAgICAgICB0ZXh0dXJlQ29vcmRzOiBbXSxcclxuICAgICAgICAgICAgdmVydGV4Tm9ybWFsczogW10sXHJcbiAgICAgICAgICAgIGZhY2VzOiBbXSxcclxuICAgICAgICAgICAgbWF0ZXJpYWxzOiB7fSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudE1hdGVyaWFsID0gJyc7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltbWVkTGluZSA9IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g6Lez6L+H56m66KGM5ZKM5rOo6YeKXHJcbiAgICAgICAgICAgIGlmICghdHJpbW1lZExpbmUgfHwgdHJpbW1lZExpbmUuc3RhcnRzV2l0aCgnIycpKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVQYXJ0cyA9IHRyaW1tZWRMaW5lLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXdvcmQgPSBsaW5lUGFydHNbMF07XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleXdvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3YnOiAvLyDpobbngrnlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbM10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC52ZXJ0aWNlcy5wdXNoKHZlcnRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Z0JzogLy8g57q555CG5Z2Q5qCHXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXhDb29yZCA9IG5ldyBWZWN0b3IyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC50ZXh0dXJlQ29vcmRzLnB1c2godGV4Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd2bic6IC8vIOmhtueCueazlee6v1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZlcnRleE5vcm1hbHMucHVzaChub3JtYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdmJzogLy8g6Z2i5a6a5LmJXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNlOiBGYWNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4SW5kaWNlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlSW5kaWNlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxJbmRpY2VzOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6Kej5p6Q6Z2i55qE5q+P5Liq6aG254K55a6a5LmJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZVBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhEZWYgPSBsaW5lUGFydHNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pSv5oyBduOAgXYvdnTjgIF2Ly92buOAgXYvdnQvdm7nrYnlpJrnp43moLzlvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleFBhcnRzID0gdmVydGV4RGVmLnNwbGl0KCcvJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6aG254K557Si5byV77yIT0JK57Si5byV5LuOMeW8gOWni++8jOmcgOimgei9rOaNouS4uuS7jjDlvIDlp4vvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UudmVydGV4SW5kaWNlcy5wdXNoKHBhcnNlSW50KHZlcnRleFBhcnRzWzBdKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe6ueeQhuWdkOagh+e0ouW8le+8iOWPr+mAie+8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzFdICYmIHZlcnRleFBhcnRzWzFdICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UudGV4dHVyZUluZGljZXMhLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMV0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rOV57q/57Si5byV77yI5Y+v6YCJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMl0gJiYgdmVydGV4UGFydHNbMl0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5ub3JtYWxJbmRpY2VzIS5wdXNoKHBhcnNlSW50KHZlcnRleFBhcnRzWzJdKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInnurnnkIbmiJbms5Xnur/ntKLlvJXvvIzmuIXnqbrmlbDnu4Tku6Xkv53mjIHmlbDmja7mlbTmtIFcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2UudGV4dHVyZUluZGljZXMhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmYWNlLnRleHR1cmVJbmRpY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYWNlLm5vcm1hbEluZGljZXMhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmYWNlLm5vcm1hbEluZGljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa3u+WKoOadkOi0qOS/oeaBr++8iOWmguaenOacie+8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLm1hdGVyaWFsTmFtZSA9IGN1cnJlbnRNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZhY2VzLnB1c2goZmFjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ210bGxpYic6IC8vIOadkOi0qOW6k+W8leeUqFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWxMaWJOYW1lID0gbGluZVBhcnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlrp7pmYXlupTnlKjkuK3pnIDopoHliqDovb3lubbop6PmnpDlr7nlupTnmoQubXRs5paH5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDlj5HnjrDmnZDotKjlupPlvJXnlKg6ICR7bWF0ZXJpYWxMaWJOYW1lfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd1c2VtdGwnOiAvLyDkvb/nlKjmnZDotKhcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRNYXRlcmlhbCA9IGxpbmVQYXJ0c1sxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Yid5aeL5YyW5p2Q6LSo6K6w5b2V77yI5a6e6ZmF5L2/55So5pe26ZyA6KaB5LuOLm10bOaWh+S7tuWKoOi9veWujOaVtOS/oeaBr++8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5tYXRlcmlhbHNbY3VycmVudE1hdGVyaWFsXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5tYXRlcmlhbHNbY3VycmVudE1hdGVyaWFsXSA9IHsgbmFtZTogY3VycmVudE1hdGVyaWFsIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5Y+v5Lul5re75Yqg5pu05aSaT0JK5qC85byP5YWz6ZSu5a2X55qE5aSE55CGXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOW/veeVpeS4jeaUr+aMgeeahOWFs+mUruWtl1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG6Kej5p6Q5ZCO55qE5qih5Z6L5pWw5o2u6L2s5o2i5Li6SlNPTuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMgSlNPTuWtl+espuS4slxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvSlNPTihtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtb2RlbCwgbnVsbCwgMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmqKHlnovnu5/orqHkv6Hmga9cclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIOe7n+iuoeS/oeaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE1vZGVsU3RhdHMobW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlQ291bnQgPSBtb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBub3JtYWxDb3VudCA9IG1vZGVsLnZlcnRleE5vcm1hbHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGZhY2VzV2l0aFRleHR1cmVzID0gbW9kZWwuZmFjZXMuZmlsdGVyKGZhY2UgPT4gZmFjZS50ZXh0dXJlSW5kaWNlcykubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGZhY2VzV2l0aE5vcm1hbHMgPSBtb2RlbC5mYWNlcy5maWx0ZXIoZmFjZSA9PiBmYWNlLm5vcm1hbEluZGljZXMpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGBcclxu5qih5Z6L57uf6K6h5L+h5oGvOlxyXG4tIOmhtueCueaVsDogJHttb2RlbC52ZXJ0aWNlcy5sZW5ndGh9XHJcbi0g57q555CG5Z2Q5qCH5pWwOiAke3RleHR1cmVDb3VudH1cclxuLSDms5Xnur/lkJHph4/mlbA6ICR7bm9ybWFsQ291bnR9XHJcbi0g6Z2i5pWwOiAke21vZGVsLmZhY2VzLmxlbmd0aH1cclxuLSDluKbnurnnkIbnmoTpnaI6ICR7ZmFjZXNXaXRoVGV4dHVyZXN9XHJcbi0g5bim5rOV57q/55qE6Z2iOiAke2ZhY2VzV2l0aE5vcm1hbHN9XHJcbi0g5p2Q6LSo5pWwOiAke09iamVjdC5rZXlzKG1vZGVsLm1hdGVyaWFscykubGVuZ3RofVxyXG4gICAgICAgIGAudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6aqM6K+B6Kej5p6Q5pWw5o2u55qE5a6M5pW05oCnXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyDpqozor4Hnu5Pmnpzmtojmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZU1vZGVsKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDmo4Dmn6XpnaLntKLlvJXmmK/lkKbotornlYxcclxuICAgICAgICBmb3IgKGNvbnN0IGZhY2Ugb2YgbW9kZWwuZmFjZXMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB2ZXJ0ZXhJbmRleCBvZiBmYWNlLnZlcnRleEluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhJbmRleCA8IDAgfHwgdmVydGV4SW5kZXggPj0gbW9kZWwudmVydGljZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOmhtueCuee0ouW8lei2iueVjDogJHt2ZXJ0ZXhJbmRleH0gKOacgOWkpzogJHttb2RlbC52ZXJ0aWNlcy5sZW5ndGggLSAxfSlgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZhY2UudGV4dHVyZUluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGV4SW5kZXggb2YgZmFjZS50ZXh0dXJlSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXhJbmRleCA8IDAgfHwgdGV4SW5kZXggPj0gbW9kZWwudGV4dHVyZUNvb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOe6ueeQhuWdkOagh+e0ouW8lei2iueVjDogJHt0ZXhJbmRleH0gKOacgOWkpzogJHttb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZhY2Uubm9ybWFsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3JtYWxJbmRleCBvZiBmYWNlLm5vcm1hbEluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9ybWFsSW5kZXggPCAwIHx8IG5vcm1hbEluZGV4ID49IG1vZGVsLnZlcnRleE5vcm1hbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGDms5Xnur/ntKLlvJXotornlYw6ICR7bm9ybWFsSW5kZXh9ICjmnIDlpKc6ICR7bW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGggLSAxfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCBcclxuICAgICAgICAgICAgPyBg5Y+R546wICR7ZXJyb3JzLmxlbmd0aH0g5Liq6ZSZ6K+vOlxcbiR7ZXJyb3JzLmpvaW4oJ1xcbicpfWBcclxuICAgICAgICAgICAgOiAn5qih5Z6L5pWw5o2u6aqM6K+B6YCa6L+HJztcclxuICAgIH1cclxufSIsImltcG9ydCB7IENhbWVyYSB9IGZyb20gXCIuL0NvbXBvbWVudC9DYW1lcmFcIjtcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFJhc3Rlcml6YXRpb25QaXBlbGluZSB9IGZyb20gXCIuL1Jhc3Rlcml6YXRpb25QaXBlbGluZVwiO1xyXG5pbXBvcnQgeyBBc3NldExvYWRlciB9IGZyb20gXCIuL1V0aWxzL0Fzc2V0TG9hZGVyXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBTY2VuZU1hbmFnZXIgfSBmcm9tIFwiLi9TY2VuZS9TY2VuZU1hbmFnZXJcIjtcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9Db21wb21lbnQvUmVuZGVyZXJcIjtcclxuXHJcbi8vIOW9k0RPTeWGheWuueWKoOi9veWujOaIkOWQjuaJp+ihjFxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8g6I635Y+WY2FudmFz5YWD57Sg5ZKMMkTmuLLmn5PkuIrkuIvmlodcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIC8vIOiuvue9rmNhbnZhc+WwuuWvuFxyXG4gICAgY2FudmFzLndpZHRoID0gQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IENvbmZpZy5jYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgLy8g6K6+572u5paH5pys5qC35byPXHJcbiAgICBjdHguZm9udCA9ICdBcmlhbCc7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xyXG4gICAgLy8gY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG5cclxuICAgIC8vIOWIm+W7uuWbvuWDj+aVsOaNruWvueixoVxyXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YShDb25maWcuY2FudmFzV2lkdGgsIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFJhc3Rlcml6YXRpb25QaXBlbGluZSh1aW50MzJWaWV3KTtcclxuXHJcbiAgICBJbml0KCk7XHJcblxyXG4gICAgLy8g5riy5p+T5Ye95pWwXHJcbiAgICBmdW5jdGlvbiBtYWluTG9vcCgpIHtcclxuICAgICAgICAvLyDlpITnkIbpgLvovpFcclxuICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICAvLyDmuLLmn5NcclxuICAgICAgICBSZW5kZXIocGlwZWxpbmUpO1xyXG4gICAgICAgIC8vIOWwhuWbvuWDj+aVsOaNrue7mOWItuWIsGNhbnZhc+S4ilxyXG4gICAgICAgIGN0eC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAvLyDor7fmsYLkuIvkuIDluKfliqjnlLtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbkxvb3ApO1xyXG4gICAgICAgIC8vIOWxj+W5lei+k+WHuuaXpeW/l1xyXG4gICAgICAgIExvZ2dlci5wcmludExvZ3MoY3R4KTtcclxuICAgIH1cclxuICAgIC8vIOW8gOWni+WKqOeUu+W+queOr1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxufSk7XHJcblxyXG4vLyDojrflj5bpvKDmoIfkuovku7ZcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAvLyDojrflj5bpvKDmoIfnm7jlr7nkuo5jYW52YXPnmoTlnZDmoIdcclxuICAgIGNvbnN0IHJlY3QgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgICBJbnB1dC5tb3VzZVggPSBtb3VzZVg7XHJcbiAgICBJbnB1dC5tb3VzZVkgPSBtb3VzZVk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIElucHV0LmRlbHRhWSA9IGV2ZW50LmRlbHRhWTtcclxuICAgIGNvbnNvbGUubG9nKGV2ZW50LmRlbHRhWSk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsZW5kJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBJbnB1dC5kZWx0YVkgPSAwO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICAvLyDliJ3lp4vljJblnLrmma9cclxuICAgIGNvbnN0IG1haW5TY2VuZSA9IFNjZW5lTWFuYWdlci5pbnN0YW5jZS5jcmVhdGVTY2VuZShcIk1haW5TY2VuZVwiKTtcclxuICAgIFNjZW5lTWFuYWdlci5pbnN0YW5jZS5zZXRBY3RpdmVTY2VuZShtYWluU2NlbmUpO1xyXG5cclxuICAgIC8vIOebuOaculxyXG4gICAgY29uc3QgY2FtZXJhID0gbmV3IEdhbWVPYmplY3QoXCJjYW1lcmFcIik7XHJcbiAgICBtYWluU2NlbmUuYWRkR2FtZU9iamVjdChjYW1lcmEpO1xyXG4gICAgY2FtZXJhLmFkZENvbXBvbmVudChDYW1lcmEpO1xyXG5cclxuICAgIGxldCBsZWU6IEdhbWVPYmplY3Q7XHJcbiAgICAvLyDliqDovb3mqKHlnotcclxuICAgIEFzc2V0TG9hZGVyLmxvYWRJbnN0YW5jZUZyb21Nb2RlbCgnbGVlJywgJ3Jlc291cmNlcy9hc3NldHMvbWVzaGVzL2xlZS5vYmonKS50aGVuKChpbnN0YW5jZSkgPT4ge1xyXG4gICAgICAgIGxlZSA9IGluc3RhbmNlO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAsIDAsIDIpO1xyXG4gICAgICAgIG1haW5TY2VuZS5hZGRHYW1lT2JqZWN0KGxlZSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgQXNzZXRMb2FkZXIubG9hZEluc3RhbmNlRnJvbU1vZGVsKCdjdWJlJywgJ3Jlc291cmNlcy9jdWJlLm9iaicpLnRoZW4oKGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMiwgMCwgMCk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjMoMC4xLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNldFBhcmVudChsZWUudHJhbnNmb3JtLCBmYWxzZSk7XHJcbiAgICAgICAgbWFpblNjZW5lLmFkZEdhbWVPYmplY3QoaW5zdGFuY2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIFVwZGF0ZSgpIHtcclxuICAgIC8vIOS9v+eUqOWcuuaZr+eahHVwZGF0ZeaWueazleabtOaWsOaJgOaciea4uOaIj+WvueixoVxyXG4gICAgU2NlbmVNYW5hZ2VyLmluc3RhbmNlLmdldEFjdGl2ZVNjZW5lKCk/LnVwZGF0ZSgpO1xyXG5cclxuICAgIC8vIOWFtuS7lueJueWumueahOabtOaWsOmAu+i+kVxyXG4gICAgLy8gZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgIC8vICAgICBpZiAoaW5zdGFuY2UubmFtZSA9PSBcImN1YmVcIikge1xyXG4gICAgLy8gICAgICAgICAvLyDkvb/nlKhzaW7lh73mlbDlrp7njrDnvKnmlL7lnKgwLjnliLAxLjHkuYvpl7Tlvqrnjq9cclxuICAgIC8vICAgICAgICAgY29uc3Qgc2NhbGVPZmZzZXQgPSBNYXRoLnNpbihEYXRlLm5vdygpICogMC4wMDIpICogMC4xICsgMC4xO1xyXG4gICAgLy8gICAgICAgICBjb25zdCBzY2FsZSA9IGluc3RhbmNlLnRyYW5zZm9ybS5zY2FsZTtcclxuICAgIC8vICAgICAgICAgc2NhbGUueCA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgLy8gICAgICAgICBzY2FsZS55ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICAvLyAgICAgICAgIHNjYWxlLnogPSBzY2FsZU9mZnNldDtcclxuICAgIC8vICAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgLy8gICAgICAgICBpbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24gPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhhbmdsZSwgVmVjdG9yMy5GT1JXQVJEKTtcclxuICAgIC8vICAgICAgICAgYW5nbGUgKz0gMTtcclxuICAgIC8vICAgICAgICAgY29udGludWU7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICAvLyDorqnniankvZPlnKjmiYDmnInovbTkuIrml4vovaxcclxuICAgIC8vICAgICBpbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24gPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhhbmdsZSwgVmVjdG9yMy5VUCk7XHJcbiAgICAvLyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJlbmRlcihyZW5kZXJlcjogUmFzdGVyaXphdGlvblBpcGVsaW5lKSB7XHJcbiAgICByZW5kZXJlci5DbGVhcihDb2xvci5CTEFDSyk7XHJcblxyXG4gICAgLy8g6I635Y+W5Zy65pmv5Lit55qE5omA5pyJ5qC55ri45oiP5a+56LGh5bm25riy5p+TXHJcbiAgICBjb25zdCByb290T2JqZWN0cyA9IFNjZW5lTWFuYWdlci5pbnN0YW5jZS5nZXRBY3RpdmVTY2VuZSgpPy5nZXRSb290R2FtZU9iamVjdHMoKTtcclxuICAgIGlmIChyb290T2JqZWN0cykge1xyXG4gICAgICAgIGZvciAoY29uc3QgZ2FtZU9iamVjdCBvZiByb290T2JqZWN0cykge1xyXG4gICAgICAgICAgICAvLyDmo4Dmn6XmuLjmiI/lr7nosaHmmK/lkKbmnIlyZW5kZXJlcue7hOS7tlxyXG4gICAgICAgICAgICBpZiAoZ2FtZU9iamVjdC5nZXRDb21wb25lbnQoUmVuZGVyZXIpKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJlci5EcmF3T2JqZWN0KGdhbWVPYmplY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
