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
var Config_1 = require("../Config");
var Vector4_1 = require("../Math/Vector4");
var Component_1 = require("./Component");
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
}(Component_1.Component));
exports.Camera = Camera;
},{"../Color":1,"../Config":7,"../Math/Vector4":15,"./Component":3}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Component = void 0;
var Component = /** @class */ (function () {
    function Component(gameObject) {
        this._enabled = true;
        this.gameObject = gameObject;
        this.awake();
    }
    Object.defineProperty(Component.prototype, "transform", {
        get: function () {
            return this.gameObject.transform;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "enabled", {
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
    Component.prototype.awake = function () { };
    // 在启用组件的第一帧调用
    Component.prototype.start = function () { };
    // 每帧更新前调用
    Component.prototype.update = function () { };
    // 每帧更新后调用
    //public lateUpdate(): void {}
    // 当组件被启用时调用
    Component.prototype.onEnable = function () { };
    // 当组件被禁用时调用
    Component.prototype.onDisable = function () { };
    // 当组件被销毁时调用
    Component.prototype.onDestroy = function () { };
    return Component;
}());
exports.Component = Component;
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
exports.MeshRenderer = void 0;
var Renderer_1 = require("./Renderer");
var MeshRenderer = /** @class */ (function (_super) {
    __extends(MeshRenderer, _super);
    function MeshRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mesh = null;
        _this._castShadows = true;
        _this._receiveShadows = true;
        return _this;
    }
    Object.defineProperty(MeshRenderer.prototype, "mesh", {
        // 网格属性
        get: function () {
            return this._mesh;
        },
        set: function (value) {
            this._mesh = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MeshRenderer.prototype, "castShadows", {
        // 是否投射阴影
        get: function () {
            return this._castShadows;
        },
        set: function (value) {
            this._castShadows = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MeshRenderer.prototype, "receiveShadows", {
        // 是否接收阴影
        get: function () {
            return this._receiveShadows;
        },
        set: function (value) {
            this._receiveShadows = value;
        },
        enumerable: false,
        configurable: true
    });
    // 实现渲染方法
    MeshRenderer.prototype.render = function () {
        // 渲染逻辑将由RasterizationPipeline调用
    };
    MeshRenderer.prototype.onDestroy = function () {
        // 清理资源
        this._mesh = null;
        _super.prototype.material = null;
    };
    return MeshRenderer;
}(Renderer_1.Renderer));
exports.MeshRenderer = MeshRenderer;
},{"./Renderer":6}],5:[function(require,module,exports){
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
exports.ObjRotate = void 0;
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
var Component_1 = require("./Component");
var ObjRotate = /** @class */ (function (_super) {
    __extends(ObjRotate, _super);
    function ObjRotate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angle = 0;
        return _this;
    }
    ObjRotate.prototype.update = function () {
        if (this.gameObject.name == "cube") {
            // 使用sin函数实现缩放在0.9到1.1之间循环
            var scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
            var scale = this.transform.scale;
            scale.x = scaleOffset;
            scale.y = scaleOffset;
            scale.z = scaleOffset;
            this.transform.scale = scale;
            this.transform.rotation = Quaternion_1.Quaternion.angleAxis(this.angle, Vector3_1.Vector3.FORWARD);
            this.angle += 1;
            return;
        }
        // 让物体在所有轴上旋转
        this.transform.rotation = Quaternion_1.Quaternion.angleAxis(this.angle, Vector3_1.Vector3.UP);
        this.angle += 1;
    };
    return ObjRotate;
}(Component_1.Component));
exports.ObjRotate = ObjRotate;
},{"../Math/Quaternion":12,"../Math/Vector3":14,"./Component":3}],6:[function(require,module,exports){
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
var Component_1 = require("./Component");
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
}(Component_1.Component));
exports.Renderer = Renderer;
},{"./Component":3}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
    GameObject.prototype.addComponent = function (componentType) {
        var comp = this.getComponent(componentType);
        if (comp == null) {
            comp = new componentType(this);
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
    GameObject.prototype.getComponentInChildren = function (componentType) {
        // 先检查自身
        var comp = this.getComponent(componentType);
        if (comp != null) {
            return comp;
        }
        // 遍历所有子节点
        for (var _i = 0, _a = this.transform.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childGameObject = child.gameObject;
            if (childGameObject) {
                var childComp = childGameObject.getComponent(componentType);
                if (childComp != null) {
                    return childComp;
                }
                // 递归检查子节点的子节点
                var deepChildComp = childGameObject.getComponentInChildren(componentType);
                if (deepChildComp != null) {
                    return deepChildComp;
                }
            }
        }
        return null;
    };
    // 获取子节点上的所有组件
    GameObject.prototype.getComponentsInChildren = function (componentType) {
        var result = [];
        // 添加自身的组件
        result.push.apply(result, this.getComponents(componentType));
        // 遍历所有子节点
        for (var _i = 0, _a = this.transform.children; _i < _a.length; _i++) {
            var child = _a[_i];
            // 假设每个Transform都有对应的GameObject
            var childGameObject = child.gameObject;
            if (childGameObject) {
                // 递归获取子节点的所有组件
                result.push.apply(result, childGameObject.getComponentsInChildren(componentType));
            }
        }
        return result;
    };
    // 移除组件
    GameObject.prototype.removeComponent = function (componentType) {
        var index = this.components.findIndex(function (component) { return component instanceof componentType; });
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
},{"./Transfrom":19}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{"./Quaternion":12,"./Vector3":14,"./Vector4":15}],12:[function(require,module,exports){
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
},{"./Matrix4x4":11,"./Vector3":14}],13:[function(require,module,exports){
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
},{"./Vector3":14,"./Vector4":15}],14:[function(require,module,exports){
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
},{"./Vector2":13,"./Vector4":15}],15:[function(require,module,exports){
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
},{"./Vector2":13,"./Vector3":14}],16:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.RasterizationPipeline = void 0;
var Color_1 = require("./Color");
var Vector2_1 = require("./Math/Vector2");
var Vector3_1 = require("./Math/Vector3");
var Config_1 = require("./Config");
var Vector4_1 = require("./Math/Vector4");
var Camera_1 = require("./Component/Camera");
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
    RasterizationPipeline.prototype.VertexProcessingStage = function (vertices, transform) {
        var clipSpaceVertices = new Array(vertices.length);
        // 构建MVP矩阵
        var modelMatrix = transform.localToWorldMatrix;
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
    RasterizationPipeline.prototype.EasyVertexProcessingStage = function (vertices, transform) {
        var clipSpaceVertices = new Array(vertices.length);
        // 简单变换
        for (var i = 0; i < vertices.length; i += 1) {
            var vertice = vertices[i].clone();
            // 先变换，必须严格按照先缩放，再旋转，再平移
            this.ScaleVertex(vertice, transform);
            this.RotateVertex(vertice, transform);
            this.TranslateVertex(vertice, transform);
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
        var model = renderer.mesh;
        if (!model) {
            return;
        }
        var indices = model.faces.flatMap(function (face) { return face.vertexIndices; });
        // 1.剔除
        this.FrustumCulling();
        this.BackfaceCulling();
        this.OcclusionCulling();
        // 2.变换
        // MVP变换
        var screenVertices = this.VertexProcessingStage(model.vertices, renderer.transform);
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
},{"./Color":1,"./Component/Camera":2,"./Config":7,"./Math/Vector2":13,"./Math/Vector3":14,"./Math/Vector4":15}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{"./Scene":17}],19:[function(require,module,exports){
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
},{"./Math/Matrix4x4":11,"./Math/Quaternion":12,"./Math/Vector3":14,"./Math/Vector4":15}],20:[function(require,module,exports){
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
},{"./Dictionary":21,"./ObjParser":22}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{"../Math/Vector2":13,"../Math/Vector3":14}],23:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Config_1 = require("./Config");
var Logger_1 = require("./Logger");
var SceneManager_1 = require("./Scene/SceneManager");
var RasterizationPipeline_1 = require("./RasterizationPipeline");
var Input_1 = require("./Input");
var AssetLoader_1 = require("./Utils/AssetLoader");
var GameObject_1 = require("./GameObject");
var Vector3_1 = require("./Math/Vector3");
var Camera_1 = require("./Component/Camera");
var Renderer_1 = require("./Component/Renderer");
var MeshRenderer_1 = require("./Component/MeshRenderer");
var ObjRotate_1 = require("./Component/ObjRotate");
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
    AssetLoader_1.AssetLoader.loadModel('lee', 'resources/assets/meshes/lee.obj').then(function (model) {
        lee = new GameObject_1.GameObject("lee");
        lee.transform.position = new Vector3_1.Vector3(0, 0, 2);
        var renderer = lee.addComponent(MeshRenderer_1.MeshRenderer);
        renderer.mesh = model;
        lee.addComponent(ObjRotate_1.ObjRotate);
        mainScene.addGameObject(lee);
    });
    AssetLoader_1.AssetLoader.loadModel('cube', 'resources/cube.obj').then(function (model) {
        var cube = new GameObject_1.GameObject("cube");
        cube.transform.position = new Vector3_1.Vector3(2, 0, 0);
        cube.transform.scale = new Vector3_1.Vector3(0.1, 0.1, 0.1);
        var renderer = cube.addComponent(MeshRenderer_1.MeshRenderer);
        renderer.mesh = model;
        cube.addComponent(ObjRotate_1.ObjRotate);
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
            // 显式指定类型参数
            var renders = gameObject.getComponentsInChildren(Renderer_1.Renderer);
            for (var _b = 0, renders_1 = renders; _b < renders_1.length; _b++) {
                var render = renders_1[_b];
                pipeline.DrawObject(render);
                Logger_1.Logger.log(render.gameObject.name);
            }
        }
    }
}
},{"./Color":1,"./Component/Camera":2,"./Component/MeshRenderer":4,"./Component/ObjRotate":5,"./Component/Renderer":6,"./Config":7,"./GameObject":8,"./Input":9,"./Logger":10,"./Math/Vector3":14,"./RasterizationPipeline":16,"./Scene/SceneManager":18,"./Utils/AssetLoader":20}]},{},[23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvQ29tcG9uZW50L0NhbWVyYS50cyIsInNyYy9Db21wb25lbnQvQ29tcG9uZW50LnRzIiwic3JjL0NvbXBvbmVudC9NZXNoUmVuZGVyZXIudHMiLCJzcmMvQ29tcG9uZW50L09ialJvdGF0ZS50cyIsInNyYy9Db21wb25lbnQvUmVuZGVyZXIudHMiLCJzcmMvQ29uZmlnLnRzIiwic3JjL0dhbWVPYmplY3QudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTG9nZ2VyLnRzIiwic3JjL01hdGgvTWF0cml4NHg0LnRzIiwic3JjL01hdGgvUXVhdGVybmlvbi50cyIsInNyYy9NYXRoL1ZlY3RvcjIudHMiLCJzcmMvTWF0aC9WZWN0b3IzLnRzIiwic3JjL01hdGgvVmVjdG9yNC50cyIsInNyYy9SYXN0ZXJpemF0aW9uUGlwZWxpbmUudHMiLCJzcmMvU2NlbmUvU2NlbmUudHMiLCJzcmMvU2NlbmUvU2NlbmVNYW5hZ2VyLnRzIiwic3JjL1RyYW5zZnJvbS50cyIsInNyYy9VdGlscy9Bc3NldExvYWRlci50cyIsInNyYy9VdGlscy9EaWN0aW9uYXJ5LnRzIiwic3JjL1V0aWxzL09ialBhcnNlci50cyIsInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBO0lBa0JJLGVBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBZTtRQUFmLGtCQUFBLEVBQUEsT0FBZTtRQUN4RCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTSx3QkFBUSxHQUFmO1FBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElB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LENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdHLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEQsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsQ0FBVTtRQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXBCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEUsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU0sZ0NBQVksR0FBbkI7UUFDSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxpQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELGdDQUFnQztJQUNoQyw2QkFBNkI7SUFFN0IsZ0RBQWdEO0lBQ2hELGdHQUFnRztJQUNoRyxnREFBZ0Q7SUFFaEQsbUZBQW1GO0lBQ25GLElBQUk7SUFFRyw2QkFBUyxHQUFoQjtRQUNJLHNCQUFzQjtRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBRXpCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsOENBQThDO1FBQzdGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVWLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFDLDJCQUEyQjtZQUN2QyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDSCxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEQsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckM7aUJBQU07Z0JBQ0gsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7YUFDbEI7U0FDSjtRQUVELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLG1DQUFlLEdBQXRCO1FBQ0ksaUVBQWlFO1FBQ2pFLGdDQUFnQztRQUNoQyxnREFBZ0Q7UUFDaEQsWUFBWTtRQUVaLElBQUksR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDMUIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXJCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUViLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMs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QUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNFLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLDZCQUFTLEdBQWhCO1FBQ0ksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUVoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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QU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSwyQkFBTyxHQUFkO1FBQ0ksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFFbkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRTFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7WUFDNUQsZUFBZTtTQUNsQjtRQUVELEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBRWhCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUUzRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0saUNBQWEsR0FBcEI7UUFDSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLDBCQUEwQjtRQUMxQixPQUFPLElBQUksWUFBWSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMs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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5ELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFYSxxQ0FBMkIsR0FBekMsVUFBMEMsQ0FBYTtRQUNuRCxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FB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SUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ1QsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVhLHdCQUFjLEdBQTVCLFVBQTZCLENBQVU7UUFDbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELHNCQUFrQixxQkFBUTthQUExQjtZQUNJLElBQUksQ0FBQyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENB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QyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlDLGtDQUFrQztRQUNsQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFH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LElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSw0Q0FBWSxHQUFuQixVQUFvQixNQUFlLEVBQUUsU0FBb0I7UUFDckQsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFFbkQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsU0FBUztRQUNULElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVDLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixTQUFTO1FB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QUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELFNBQVMsTUFBTTs7SUFDWCx3QkFBd0I7SUFDeEIsTUFBQSwyQkFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsMENBQUUsTUFBTSxHQUFHO0FBQ3JELENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxRQUErQjs7SUFDM0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFNUIsbUJBQW1CO0lBQ25CLElBQU0sV0FBVyxTQUFHLDJCQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSwwQ0FBRSxrQkFBa0IsRUFBRSxDQUFDO0lBQ2pGLElBQUksV0FBVyxFQUFFO1FBQ2IsS0FBeUIsVUFBVyxFQUFYLDJCQUFXLEVBQVgseUJBQVcsRUFBWCxJQUFXLEVBQUU7WUFBakMsSUFBTSxVQUFVLG9CQUFBO1lBQ2pCLFdBQVc7WUFDWCxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsdUJBQXVCLENBQUMsbUJBQVEsQ0FBQyxDQUFDO1lBQzdELEtBQXFCLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTyxFQUFFO2dCQUF6QixJQUFNLE1BQU0sZ0JBQUE7Z0JBQ2IsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUIsZUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RDO1NBQ0o7S0FDSjtBQUNMLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBXSElURSA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTEFDSyA9IG5ldyBDb2xvcigwLCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkFZID0gbmV3IENvbG9yKDEyOCwgMTI4LCAxMjgpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFRCA9IG5ldyBDb2xvcigyNTUsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSRUVOID0gbmV3IENvbG9yKDAsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxVRSA9IG5ldyBDb2xvcigwLCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFlFTExPVyA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1lBTiA9IG5ldyBDb2xvcigwLCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFHRU5UQSA9IG5ldyBDb2xvcigyNTUsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT1JBTkdFID0gbmV3IENvbG9yKDI1NSwgMTY1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVVJQTEUgPSBuZXcgQ29sb3IoMTI4LCAwLCAxMjgpLlRvVWludDMyKCk7XHJcblxyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG4gICAgcHVibGljIGE6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgPSAyNTUpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUb1VpbnQzMigpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuYSA8PCAyNCkgfCAodGhpcy5iIDw8IDE2KSB8ICh0aGlzLmcgPDwgOCkgfCB0aGlzLnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGcm9tVWludDMyKHVpbnQzMjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgdWludDMyICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiA4KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMTYpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAyNCkgJiAweEZGXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4uL0NvbG9yXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9Db25maWdcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFDbGVhckZsYWdzIHtcclxuICAgIE5PTkUgPSAwLFxyXG4gICAgQUxMID0gMTYzODQgfCAyNTYsXHJcbiAgICBDb2xvciA9IDE2Mzg0LCAgLy9nbC5DT0xPUl9CVUZGRVJfQklUXHJcbiAgICBEZXB0aCA9IDI1NiwgICAgLy9nbC5ERVBUSF9CVUZGRVJfQklUXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIHN0YXRpYyBtYWluQ2FtZXJhOiBDYW1lcmE7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBjYW1lcmFzOiBBcnJheTxDYW1lcmE+ID0gbmV3IEFycmF5PENhbWVyYT4oKTtcclxuXHJcbiAgICBwdWJsaWMgYmFja0dyb3VuZENvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigwLjI3LCAwLjI3LCAwLjI3LCAxLjApO1xyXG4gICAgcHVibGljIGZvZ0NvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigwLjI3LCAwLjI3LCAwLjI3LCAxLjApO1xyXG4gICAgcHVibGljIGNsZWFyRmxhZ3M6IENhbWVyYUNsZWFyRmxhZ3MgPSBDYW1lcmFDbGVhckZsYWdzLkNvbG9yIHwgQ2FtZXJhQ2xlYXJGbGFncy5EZXB0aDtcclxuICAgIHB1YmxpYyBuZWFyQ2xpcDogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBmYXJDbGlwOiBudW1iZXIgPSAxMjg7XHJcbiAgICBwdWJsaWMgZm92OiBudW1iZXIgPSA2MDtcclxuICAgIHB1YmxpYyBkZXB0aDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyB2aWV3UG9ydDogVmVjdG9yNCA9IG5ldyBWZWN0b3I0KDAsIDAsIDEsIDEpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYXNwZWN0KCk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHYgPSB0aGlzLnZpZXdQb3J0O1xyXG4gICAgICAgIHJldHVybiAodi56ICogQ29uZmlnLmNhbnZhc1dpZHRoKSAvICh2LncgKiBDb25maWcuY2FudmFzSGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXdha2UoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKENhbWVyYS5tYWluQ2FtZXJhID09IG51bGwpIHtcclxuICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBDYW1lcmEuY2FtZXJhcy5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gQ2FtZXJhLmNhbWVyYXMuaW5kZXhPZih0aGlzLCAwKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBDYW1lcmEuY2FtZXJhcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKENhbWVyYS5tYWluQ2FtZXJhID09IHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKENhbWVyYS5jYW1lcmFzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBDYW1lcmEubWFpbkNhbWVyYSA9IENhbWVyYS5jYW1lcmFzWzBdO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBDYW1lcmEubWFpbkNhbWVyYSA9IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIENhbWVyYTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4uL1RyYW5zZnJvbVwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdDogR2FtZU9iamVjdDtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCB0cmFuc2Zvcm0oKTogVHJhbnNmb3JtIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nYW1lT2JqZWN0LnRyYW5zZm9ybTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfZW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25FbmFibGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uRGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0ID0gZ2FtZU9iamVjdDtcclxuICAgICAgICB0aGlzLmF3YWtlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55Sf5ZG95ZGo5pyf5pa55rOVXHJcbiAgICAvLyDlvZPnu4Tku7booqvliJvlu7rml7bosIPnlKhcclxuICAgIHB1YmxpYyBhd2FrZSgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOWcqOWQr+eUqOe7hOS7tueahOesrOS4gOW4p+iwg+eUqFxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5q+P5bin5pu05paw5YmN6LCD55SoXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5q+P5bin5pu05paw5ZCO6LCD55SoXHJcbiAgICAvL3B1YmxpYyBsYXRlVXBkYXRlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5b2T57uE5Lu26KKr5ZCv55So5pe26LCD55SoXHJcbiAgICBwdWJsaWMgb25FbmFibGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDlvZPnu4Tku7booqvnpoHnlKjml7bosIPnlKhcclxuICAgIHB1YmxpYyBvbkRpc2FibGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDlvZPnu4Tku7booqvplIDmr4Hml7bosIPnlKhcclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKTogdm9pZCB7fVxyXG59IiwiaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBPQkpNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc2hSZW5kZXJlciBleHRlbmRzIFJlbmRlcmVyIHtcclxuICAgIHByaXZhdGUgX21lc2g6IE9CSk1vZGVsIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9jYXN0U2hhZG93czogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9yZWNlaXZlU2hhZG93czogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLy8g572R5qC85bGe5oCnXHJcbiAgICBwdWJsaWMgZ2V0IG1lc2goKTogT0JKTW9kZWwgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWVzaDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG1lc2godmFsdWU6IE9CSk1vZGVsIHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX21lc2ggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmmK/lkKbmipXlsITpmLTlvbFcclxuICAgIHB1YmxpYyBnZXQgY2FzdFNoYWRvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc3RTaGFkb3dzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY2FzdFNoYWRvd3ModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9jYXN0U2hhZG93cyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOaYr+WQpuaOpeaUtumYtOW9sVxyXG4gICAgcHVibGljIGdldCByZWNlaXZlU2hhZG93cygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVjZWl2ZVNoYWRvd3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByZWNlaXZlU2hhZG93cyh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3JlY2VpdmVTaGFkb3dzID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOWunueOsOa4suafk+aWueazlVxyXG4gICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcclxuICAgICAgICAvLyDmuLLmn5PpgLvovpHlsIbnlLFSYXN0ZXJpemF0aW9uUGlwZWxpbmXosIPnlKhcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOa4heeQhui1hOa6kFxyXG4gICAgICAgIHRoaXMuX21lc2ggPSBudWxsO1xyXG4gICAgICAgIHN1cGVyLm1hdGVyaWFsID0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9ialJvdGF0ZSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBwcml2YXRlIGFuZ2xlID0gMDtcclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWVPYmplY3QubmFtZSA9PSBcImN1YmVcIikge1xyXG4gICAgICAgICAgICAvLyDkvb/nlKhzaW7lh73mlbDlrp7njrDnvKnmlL7lnKgwLjnliLAxLjHkuYvpl7Tlvqrnjq9cclxuICAgICAgICAgICAgY29uc3Qgc2NhbGVPZmZzZXQgPSBNYXRoLnNpbihEYXRlLm5vdygpICogMC4wMDIpICogMC4xICsgMC4xO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMudHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICBzY2FsZS54ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICAgICAgICAgIHNjYWxlLnkgPSBzY2FsZU9mZnNldDtcclxuICAgICAgICAgICAgc2NhbGUueiA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS5zY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0ucm90YXRpb24gPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyh0aGlzLmFuZ2xlLCBWZWN0b3IzLkZPUldBUkQpO1xyXG4gICAgICAgICAgICB0aGlzLmFuZ2xlICs9IDE7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOiuqeeJqeS9k+WcqOaJgOaciei9tOS4iuaXi+i9rFxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uID0gUXVhdGVybmlvbi5hbmdsZUF4aXModGhpcy5hbmdsZSwgVmVjdG9yMy5VUCk7XHJcbiAgICAgICAgdGhpcy5hbmdsZSArPSAxO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSBcIi4uL01hdGVyaWFsXCI7XHJcblxyXG4vLyBSZW5kZXJlcuaYr+aJgOaciea4suafk+e7hOS7tueahOWfuuexu1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9zb3J0aW5nTGF5ZXJJRDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3NvcnRpbmdPcmRlcjogbnVtYmVyID0gMDtcclxuICAgIFxyXG4gICAgLy8g5p2Q6LSo5bGe5oCnXHJcbiAgICBwdWJsaWMgZ2V0IG1hdGVyaWFsKCk6IE1hdGVyaWFsIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdGVyaWFsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0IG1hdGVyaWFsKHZhbHVlOiBNYXRlcmlhbCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmjpLluo/lsYJJRFxyXG4gICAgcHVibGljIGdldCBzb3J0aW5nTGF5ZXJJRCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3J0aW5nTGF5ZXJJRDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldCBzb3J0aW5nTGF5ZXJJRCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc29ydGluZ0xheWVySUQgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5o6S5bqP6aG65bqPXHJcbiAgICBwdWJsaWMgZ2V0IHNvcnRpbmdPcmRlcigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3J0aW5nT3JkZXI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXQgc29ydGluZ09yZGVyKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zb3J0aW5nT3JkZXIgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5piv5ZCm5bqU6K+l6KKr5riy5p+TXHJcbiAgICBwdWJsaWMgZ2V0IHNob3VsZFJlbmRlcigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmFibGVkICYmIHRoaXMuZ2FtZU9iamVjdC5hY3RpdmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOa4suafk+aWueazle+8jOWtkOexu+mcgOimgeWunueOsFxyXG4gICAgcHVibGljIGFic3RyYWN0IHJlbmRlcigpOiB2b2lkO1xyXG59IiwiZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhc1dpZHRoOiBudW1iZXIgPSA0MDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhc0hlaWdodDogbnVtYmVyID0gNDAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWxmQ2FudmFzV2lkdGg6IG51bWJlciA9IENvbmZpZy5jYW52YXNXaWR0aCA+PiAxO1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWxmQ2FudmFzSGVpZ2h0OiBudW1iZXIgPSBDb25maWcuY2FudmFzSGVpZ2h0ID4+IDE7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFzcGVjdFJhdGlvOiBudW1iZXIgPSBDb25maWcuY2FudmFzV2lkdGggLyBDb25maWcuY2FudmFzSGVpZ2h0O1xyXG59IiwiaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4vVHJhbnNmcm9tXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudC9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU9iamVjdCB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG4gICAgcHVibGljIHRhZzogc3RyaW5nID0gXCJVbnRhZ2dlZFwiOyAvLyDmt7vliqDmoIfnrb7lsZ7mgKdcclxuICAgIHB1YmxpYyBsYXllcjogbnVtYmVyID0gMDsgLy8g6buY6K6k5bGCXHJcblxyXG4gICAgcHJpdmF0ZSBjb21wb25lbnRzOiBDb21wb25lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzdGFydGVkQ29tcG9uZW50czogU2V0PENvbXBvbmVudD4gPSBuZXcgU2V0PENvbXBvbmVudD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLy8g6K6+572u5ri45oiP5a+56LGh55qE5r+A5rS754q25oCBXHJcbiAgICBwdWJsaWMgc2V0IGFjdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmUgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgLy8g5aSE55CG57uE5Lu255qE5ZCv55SoL+emgeeUqFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vbkVuYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub25EaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDmo4Dmn6XmuLjmiI/lr7nosaHmmK/lkKblpITkuo7mtLvliqjnirbmgIHvvIjogIPomZHniLblr7nosaHvvIlcclxuICAgIHB1YmxpYyBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIOajgOafpeeItuWvueixoeeahOa/gOa0u+eKtuaAgVxyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRyYW5zZm9ybS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRHYW1lT2JqZWN0ID0gcGFyZW50LmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRHYW1lT2JqZWN0ICYmICFwYXJlbnRHYW1lT2JqZWN0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDosIPnlKjmiYDmnInnu4Tku7bnmoRTdGFydOaWueazle+8iOWmguaenOWwmuacquiwg+eUqO+8iVxyXG4gICAgcHVibGljIHN0YXJ0Q29tcG9uZW50cygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnRlZENvbXBvbmVudHMuaGFzKGNvbXBvbmVudCkgJiYgY29tcG9uZW50LmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydGVkQ29tcG9uZW50cy5hZGQoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YCS5b2S6LCD55So5a2Q5a+56LGh55qEc3RhcnRDb21wb25lbnRzXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZ2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZ2FtZU9iamVjdC5zdGFydENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDmm7TmlrDmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyB1cGRhdGVDb21wb25lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDpgJLlvZLosIPnlKjlrZDlr7nosaHnmoR1cGRhdGVDb21wb25lbnRzXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZ2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZ2FtZU9iamVjdC51cGRhdGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5re75Yqg57uE5Lu2XHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IHsgbmV3KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiBUIH0pOiBUIHtcclxuICAgICAgICB2YXIgY29tcCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgIGlmIChjb21wID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29tcCA9IG5ldyBjb21wb25lbnRUeXBlKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5oyH5a6a57G75Z6L55qE57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IFQgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgYXMgVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bmiYDmnInmjIflrprnsbvlnovnmoTnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzPFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IFRbXSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNvbXBvbmVudCBhcyBUKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluWtkOiKgueCueS4iueahOe7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudEluQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWFiOajgOafpeiHqui6q1xyXG4gICAgICAgIGNvbnN0IGNvbXAgPSB0aGlzLmdldENvbXBvbmVudChjb21wb25lbnRUeXBlKTtcclxuICAgICAgICBpZiAoY29tcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YGN5Y6G5omA5pyJ5a2Q6IqC54K5XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEdhbWVPYmplY3QgPSBjaGlsZC5nYW1lT2JqZWN0O1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZENvbXAgPSBjaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50KGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkQ29tcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkQ29tcDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyDpgJLlvZLmo4Dmn6XlrZDoioLngrnnmoTlrZDoioLngrlcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZXBDaGlsZENvbXAgPSBjaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWVwQ2hpbGRDb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVlcENoaWxkQ29tcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5a2Q6IqC54K55LiK55qE5omA5pyJ57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogVFtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDmt7vliqDoh6rouqvnmoTnu4Tku7ZcclxuICAgICAgICByZXN1bHQucHVzaCguLi50aGlzLmdldENvbXBvbmVudHMoY29tcG9uZW50VHlwZSkpO1xyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuavj+S4qlRyYW5zZm9ybemDveacieWvueW6lOeahEdhbWVPYmplY3RcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHYW1lT2JqZWN0ID0gY2hpbGQuZ2FtZU9iamVjdDtcclxuICAgICAgICAgICAgaWYgKGNoaWxkR2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgLy8g6YCS5b2S6I635Y+W5a2Q6IqC54K555qE5omA5pyJ57uE5Lu2XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY29tcG9uZW50VHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOenu+mZpOe7hOS7tlxyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBGdW5jdGlvbiAmIHsgcHJvdG90eXBlOiBUIH0pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuY29tcG9uZW50cy5maW5kSW5kZXgoY29tcG9uZW50ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2luZGV4XTtcclxuICAgICAgICAgICAgY29tcG9uZW50Lm9uRGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4flkI3np7Dmn6Xmib5HYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmQobmFtZTogc3RyaW5nKTogR2FtZU9iamVjdCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIC8vIOi/memcgOimgeS4gOS4quWFqOWxgOeahEdhbWVPYmplY3Tms6jlhozooahcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4fmoIfnrb7mn6Xmib7nrKzkuIDkuKpHYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRXaXRoVGFnKHRhZzogc3RyaW5nKTogR2FtZU9iamVjdCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIC8vIOi/memcgOimgeS4gOS4quagh+etvuezu+e7n1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8mumAmui/h+agh+etvuafpeaJvuaJgOaciUdhbWVPYmplY3RcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZEdhbWVPYmplY3RzV2l0aFRhZyh0YWc6IHN0cmluZyk6IEdhbWVPYmplY3RbXSB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8muafpeaJvueJueWumuexu+Wei+eahOesrOS4gOS4que7hOS7tlxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kT2JqZWN0T2ZUeXBlPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IG5ldyAoLi4uYXJnczogYW55W10pID0+IFQpOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya5p+l5om+54m55a6a57G75Z6L55qE5omA5pyJ57uE5Lu2XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRPYmplY3RzT2ZUeXBlPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IG5ldyAoLi4uYXJnczogYW55W10pID0+IFQpOiBUW10ge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrlrp7kvovljJbmuLjmiI/lr7nosaFcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFudGlhdGUob3JpZ2luYWw6IEdhbWVPYmplY3QsIHBvc2l0aW9uPzogVmVjdG9yMywgcm90YXRpb24/OiBRdWF0ZXJuaW9uKTogR2FtZU9iamVjdCB7XHJcbiAgICAgICAgLy8g5Yib5bu65paw55qE5ri45oiP5a+56LGhXHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgR2FtZU9iamVjdChvcmlnaW5hbC5uYW1lKTtcclxuXHJcbiAgICAgICAgLy8g5aSN5Yi25bGe5oCnXHJcbiAgICAgICAgY2xvbmUudGFnID0gb3JpZ2luYWwudGFnO1xyXG4gICAgICAgIGNsb25lLmxheWVyID0gb3JpZ2luYWwubGF5ZXI7XHJcbiAgICAgICAgY2xvbmUuYWN0aXZlID0gb3JpZ2luYWwuYWN0aXZlO1xyXG5cclxuICAgICAgICAvLyDorr7nva7kvY3nva7lkozml4vovazvvIjlpoLmnpzmj5DkvpvvvIlcclxuICAgICAgICBpZiAocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgY2xvbmUudHJhbnNmb3JtLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocm90YXRpb24pIHtcclxuICAgICAgICAgICAgY2xvbmUudHJhbnNmb3JtLnJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlpI3liLbnu4Tku7bvvIjov5npnIDopoHkuIDkuKrmt7HluqblpI3liLbmnLrliLbvvIlcclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmUgOavgea4uOaIj+WvueixoVxyXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgLy8g6LCD55So5omA5pyJ57uE5Lu255qEb25EZXN0cm955pa55rOVXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5vbkRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6L+Z6YeM5Y+v5Lul5re75Yqg5LuO5Zy65pmv5Lit56e76Zmk5ri45oiP5a+56LGh55qE6YC76L6RXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgSW5wdXQge1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVg6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlWTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgZGVsdGFZOiBudW1iZXIgPSAwO1xyXG59IiwiZW51bSBMb2dUeXBlIHtcclxuICAgIEluZm8sXHJcbiAgICBXYXJuaW5nLFxyXG4gICAgRXJyb3IsXHJcbn1cclxuXHJcbmludGVyZmFjZSBJTG9nIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHR5cGU6IExvZ1R5cGU7XHJcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGxvZ3M6IElMb2dbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGxvZ0NvbG9ycyA9IHtcclxuICAgICAgICBbTG9nVHlwZS5JbmZvXTogJ3doaXRlJyxcclxuICAgICAgICBbTG9nVHlwZS5XYXJuaW5nXTogJ29yYW5nZScsXHJcbiAgICAgICAgW0xvZ1R5cGUuRXJyb3JdOiAncmVkJ1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgcHJpbnRMb2dzKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbG9nID0gdGhpcy5sb2dzW2ldO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gTG9nZ2VyLmxvZ0NvbG9yc1tsb2cudHlwZV07XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsb2cubWVzc2FnZSwgMTAsIDIwICsgaSAqIDE1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvZyhtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UsIExvZ1R5cGUuSW5mbywgZHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB3YXJuaW5nKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnB1c2gobWVzc2FnZSwgTG9nVHlwZS5XYXJuaW5nLCBkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnB1c2gobWVzc2FnZSwgTG9nVHlwZS5FcnJvciwgZHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHB1c2gobWVzc2FnZTogc3RyaW5nLCB0eXBlOiBMb2dUeXBlLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxvZzogSUxvZyA9IHtcclxuICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uID8/IDAsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9ncy5wdXNoKGxvZyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeDR4NCB7XHJcblxyXG4gICAgcHVibGljIG1hdHJpeDogQXJyYXk8QXJyYXk8bnVtYmVyPj4gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4oKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb2x1bW4wOiBWZWN0b3I0LCBjb2x1bW4xOiBWZWN0b3I0LCBjb2x1bW4yOiBWZWN0b3I0LCBjb2x1bW4zOiBWZWN0b3I0KTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGFyZ3VtZW50c1tpXSBhcyBWZWN0b3I0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPih2LngsIHYueSwgdi56LCB2LncpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPigwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGV4IOihjFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Um93KGluZGV4OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgYyA9IHRoaXMubWF0cml4W2luZGV4XTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoY1swXSwgY1sxXSwgY1syXSwgY1szXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDliJdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbHVtbihpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMubWF0cml4WzBdW2luZGV4XSwgdGhpcy5tYXRyaXhbMV1baW5kZXhdLCB0aGlzLm1hdHJpeFsyXVtpbmRleF0sIHRoaXMubWF0cml4WzNdW2luZGV4XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldFJvdyhpbmRleDogbnVtYmVyLCByb3c6IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMF0gPSByb3cueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMV0gPSByb3cueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMl0gPSByb3cuejtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bM10gPSByb3cudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0Q29sdW1uKGluZGV4OiBudW1iZXIsIGNvbHVtbjogVmVjdG9yNCkge1xyXG4gICAgICAgIHRoaXMubWF0cml4WzBdW2luZGV4XSA9IGNvbHVtbi54O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzFdW2luZGV4XSA9IGNvbHVtbi55O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzJdW2luZGV4XSA9IGNvbHVtbi56O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzNdW2luZGV4XSA9IGNvbHVtbi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShtOiBNYXRyaXg0eDQpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBsaHMgPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgcmhzID0gbS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1hdHJpeFswXVswXSA9IGxoc1swXVswXSAqIHJoc1swXVswXSArIGxoc1swXVsxXSAqIHJoc1sxXVswXSArIGxoc1swXVsyXSAqIHJoc1syXVswXSArIGxoc1swXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMF1bMV0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMF1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzBdWzJdID0gbGhzWzBdWzBdICogcmhzWzBdWzJdICsgbGhzWzBdWzFdICogcmhzWzFdWzJdICsgbGhzWzBdWzJdICogcmhzWzJdWzJdICsgbGhzWzBdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFswXVszXSA9IGxoc1swXVswXSAqIHJoc1swXVszXSArIGxoc1swXVsxXSAqIHJoc1sxXVszXSArIGxoc1swXVsyXSAqIHJoc1syXVszXSArIGxoc1swXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbMV1bMF0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMV1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzFdWzFdID0gbGhzWzFdWzBdICogcmhzWzBdWzFdICsgbGhzWzFdWzFdICogcmhzWzFdWzFdICsgbGhzWzFdWzJdICogcmhzWzJdWzFdICsgbGhzWzFdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsyXSA9IGxoc1sxXVswXSAqIHJoc1swXVsyXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsyXSArIGxoc1sxXVsyXSAqIHJoc1syXVsyXSArIGxoc1sxXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMV1bM10gPSBsaHNbMV1bMF0gKiByaHNbMF1bM10gKyBsaHNbMV1bMV0gKiByaHNbMV1bM10gKyBsaHNbMV1bMl0gKiByaHNbMl1bM10gKyBsaHNbMV1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzJdWzBdID0gbGhzWzJdWzBdICogcmhzWzBdWzBdICsgbGhzWzJdWzFdICogcmhzWzFdWzBdICsgbGhzWzJdWzJdICogcmhzWzJdWzBdICsgbGhzWzJdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsyXVsxXSA9IGxoc1syXVswXSAqIHJoc1swXVsxXSArIGxoc1syXVsxXSAqIHJoc1sxXVsxXSArIGxoc1syXVsyXSAqIHJoc1syXVsxXSArIGxoc1syXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMl1bMl0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMl1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzJdWzNdID0gbGhzWzJdWzBdICogcmhzWzBdWzNdICsgbGhzWzJdWzFdICogcmhzWzFdWzNdICsgbGhzWzJdWzJdICogcmhzWzJdWzNdICsgbGhzWzJdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFszXVswXSA9IGxoc1szXVswXSAqIHJoc1swXVswXSArIGxoc1szXVsxXSAqIHJoc1sxXVswXSArIGxoc1szXVsyXSAqIHJoc1syXVswXSArIGxoc1szXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbM11bMV0gPSBsaHNbM11bMF0gKiByaHNbMF1bMV0gKyBsaHNbM11bMV0gKiByaHNbMV1bMV0gKyBsaHNbM11bMl0gKiByaHNbMl1bMV0gKyBsaHNbM11bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzNdWzJdID0gbGhzWzNdWzBdICogcmhzWzBdWzJdICsgbGhzWzNdWzFdICogcmhzWzFdWzJdICsgbGhzWzNdWzJdICogcmhzWzJdWzJdICsgbGhzWzNdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFszXVszXSA9IGxoc1szXVswXSAqIHJoc1swXVszXSArIGxoc1szXVsxXSAqIHJoc1sxXVszXSArIGxoc1szXVsyXSAqIHJoc1syXVszXSArIGxoc1szXVszXSAqIHJoc1szXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yMyh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnkgPSBtWzFdWzBdICogdi54ICsgbVsxXVsxXSAqIHYueSArIG1bMV1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2Lno7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yNCh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2LnogKyBtWzBdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56ICsgbVsxXVszXSAqIHYudztcclxuICAgICAgICByZXMueiA9IG1bMl1bMF0gKiB2LnggKyBtWzJdWzFdICogdi55ICsgbVsyXVsyXSAqIHYueiArIG1bMl1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLncgPSBtWzNdWzBdICogdi54ICsgbVszXVsxXSAqIHYueSArIG1bM11bMl0gKiB2LnogKyBtWzNdWzNdICogdi53O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUcmFuc2xhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMobVswXVszXSwgbVsxXVszXSwgbVsyXVszXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFJvdGF0ZSgpOiBWZWN0b3IzIHtcclxuICAgIC8vICAgICBsZXQgbWF0ID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgLy8gICAgIGxldCB4ID0gTWF0aC5hdGFuMihtYXRbMV1bMl0sIG1hdFsyXVsyXSk7XHJcbiAgICAvLyAgICAgbGV0IHkgPSBNYXRoLmF0YW4yKC1tYXRbMF1bMl0sIE1hdGguc3FydChtYXRbMV1bMl0gKiBtYXRbMV1bMl0gKyBtYXRbMl1bMl0gKiBtYXRbMl1bMl0pKTtcclxuICAgIC8vICAgICBsZXQgeiA9IE1hdGguYXRhbjIobWF0WzBdWzFdLCBtYXRbMF1bMF0pO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gbmV3IFZlY3RvcjMoeCAvIE1hdGguUEkgKiAxODAsIHkgLyBNYXRoLlBJICogMTgwLCB6IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvL+S4gOWumuimgeiOt+WPlue6r+WHgOeahOaXi+i9rOefqemYte+8jOWNs+WOu+mZpOe8qeaUvuWAjeeOh1xyXG4gICAgICAgIGxldCBtYXQgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICBsZXQgcSA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIHZhciB0cmFjZSA9IG1hdFswXVswXSArIG1hdFsxXVsxXSArIG1hdFsyXVsyXTsgLy8gSSByZW1vdmVkICsgMS4wZjsgc2VlIGRpc2N1c3Npb24gd2l0aCBFdGhhblxyXG4gICAgICAgIHZhciBzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRyYWNlID4gMCkgey8vIEkgY2hhbmdlZCBNX0VQU0lMT04gdG8gMFxyXG4gICAgICAgICAgICBzID0gMC41IC8gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKTtcclxuICAgICAgICAgICAgcS53ID0gMC4yNSAvIHM7XHJcbiAgICAgICAgICAgIHEueCA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pICogcztcclxuICAgICAgICAgICAgcS55ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgKiBzO1xyXG4gICAgICAgICAgICBxLnogPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAqIHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hdFswXVswXSA+IG1hdFsxXVsxXSAmJiBtYXRbMF1bMF0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzBdWzBdIC0gbWF0WzFdWzFdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdFsxXVsxXSA+IG1hdFsyXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMV1bMV0gLSBtYXRbMF1bMF0gLSBtYXRbMl1bMl0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFsyXVsyXSAtIG1hdFswXVswXSAtIG1hdFsxXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAobWF0WzBdWzJdICsgbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAwLjI1ICogcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZU1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/lm6DkuLrml4vovaznn6npmLXmr5TovoPnibnmrorvvIzmnInml7blgJnopoHljZXni6zlpITnkIbvvIzmiYDmnInmi6XmnInkuIDkuKrmj5Dlj5bmlrnms5VcclxuICAgICAgICAvL+aPkOWPluaWueW8j+W+iOeugOWNle+8jOWFiOiOt+WPlue8qeaUvuWAvO+8jOeEtuWQjuWIqeeUqOiOt+WPlue8qeaUvuWAvOeahOWOn+eQhu+8jOmAhuWQkemZpOWOu+e8qeaUvuWAvO+8jOWwseW+l+WIsOe6r+WHgOeahOaXi+i9rOefqemYtVxyXG4gICAgICAgIC8v5q2k5pa55rOV5LiN5pSv5oyB5Y+N5bCE55+p6Zi1XHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIHRlID0gbWF0Lm1hdHJpeDtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5nZXRTY2FsZSgpO1xyXG4gICAgICAgIHZhciBzY2FsZVggPSAxIC8gc2NhbGUueDtcclxuICAgICAgICB2YXIgc2NhbGVZID0gMSAvIHNjYWxlLnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWiA9IDEgLyBzY2FsZS56O1xyXG5cclxuICAgICAgICB0ZVswXVswXSA9IG1lWzBdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzFdWzBdID0gbWVbMV1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbMl1bMF0gPSBtZVsyXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVszXVswXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzFdID0gbWVbMF1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMV1bMV0gPSBtZVsxXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVsyXVsxXSA9IG1lWzJdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzNdWzFdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bMl0gPSBtZVswXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsxXVsyXSA9IG1lWzFdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzJdWzJdID0gbWVbMl1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbM11bMl0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVszXSA9IDA7XHJcbiAgICAgICAgdGVbMV1bM10gPSAwO1xyXG4gICAgICAgIHRlWzJdWzNdID0gMDtcclxuICAgICAgICB0ZVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/ku47ml4vovaznn6npmLXph4zojrflj5bmrKfmi4nop5JcclxuICAgICAgICAvL+W/hemhu+aYr+e6r+WHgOeahOaXi+i9rOefqemYtVxyXG5cclxuICAgICAgICB2YXIgYW5nbGUgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2YXIgdGUgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICB2YXIgbTExID0gdGVbMF1bMF0sIG0xMiA9IHRlWzBdWzFdLCBtMTMgPSB0ZVswXVsyXTtcclxuICAgICAgICB2YXIgbTIxID0gdGVbMV1bMF0sIG0yMiA9IHRlWzFdWzFdLCBtMjMgPSB0ZVsxXVsyXTtcclxuICAgICAgICB2YXIgbTMxID0gdGVbMl1bMF0sIG0zMiA9IHRlWzJdWzFdLCBtMzMgPSB0ZVsyXVsyXTtcclxuXHJcbiAgICAgICAgbTEzID0gbTEzID4gMSA/IDEgOiBtMTM7XHJcbiAgICAgICAgbTEzID0gbTEzIDwgLTEgPyAtMSA6IG0xMztcclxuICAgICAgICBhbmdsZS55ID0gTWF0aC5hc2luKG0xMyk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyhtMTMpIDwgMC45OTk5OTk5KSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKC1tMjMsIG0zMyk7XHJcbiAgICAgICAgICAgIGFuZ2xlLnogPSBNYXRoLmF0YW4yKC1tMTIsIG0xMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5nbGUueCA9IE1hdGguYXRhbjIobTMyLCBtMjIpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhhbmdsZS54IC8gTWF0aC5QSSAqIDE4MCwgYW5nbGUueSAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnogLyBNYXRoLlBJICogMTgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgdiA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHYueCA9IE1hdGguc3FydChtWzBdWzBdICogbVswXVswXSArIG1bMV1bMF0gKiBtWzFdWzBdICsgbVsyXVswXSAqIG1bMl1bMF0pO1xyXG4gICAgICAgIHYueSA9IE1hdGguc3FydChtWzBdWzFdICogbVswXVsxXSArIG1bMV1bMV0gKiBtWzFdWzFdICsgbVsyXVsxXSAqIG1bMl1bMV0pO1xyXG4gICAgICAgIHYueiA9IE1hdGguc3FydChtWzBdWzJdICogbVswXVsyXSArIG1bMV1bMl0gKiBtWzFdWzJdICsgbVsyXVsyXSAqIG1bMl1bMl0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNwb3NlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0xID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0yID0gbmV3IE1hdHJpeDR4NCgpLm1hdHJpeDtcclxuXHJcbiAgICAgICAgbTJbMF1bMF0gPSBtMVswXVswXTsgbTJbMF1bMV0gPSBtMVsxXVswXTsgbTJbMF1bMl0gPSBtMVsyXVswXTsgbTJbMF1bM10gPSBtMVszXVswXTtcclxuICAgICAgICBtMlsxXVswXSA9IG0xWzBdWzFdOyBtMlsxXVsxXSA9IG0xWzFdWzFdOyBtMlsxXVsyXSA9IG0xWzJdWzFdOyBtMlsxXVszXSA9IG0xWzNdWzFdO1xyXG4gICAgICAgIG0yWzJdWzBdID0gbTFbMF1bMl07IG0yWzJdWzFdID0gbTFbMV1bMl07IG0yWzJdWzJdID0gbTFbMl1bMl07IG0yWzJdWzNdID0gbTFbM11bMl07XHJcbiAgICAgICAgbTJbM11bMF0gPSBtMVswXVszXTsgbTJbM11bMV0gPSBtMVsxXVszXTsgbTJbM11bMl0gPSBtMVsyXVszXTsgbTJbM11bM10gPSBtMVszXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtMjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlKHBvczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlKHE6IFF1YXRlcm5pb24pOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKGV1bGVyQW5nbGVzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyByb3RhdGUoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyByb3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IG0gPSBuZXcgTWF0cml4NHg0KCk7XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBRdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZShzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzKTtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb29rQXQodGFyZ2V0OiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvLyB0b2RvXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy/ovazmjaLliLDmkYTlvbHmnLrnnIvlkJHnmoTnn6npmLXph4xcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1Ub0xvb2tBdFNwYWNlKGV5ZTogVmVjdG9yMywgdGFyZ2V0UG9pbnQ6IFZlY3RvcjMsIHVwOiBWZWN0b3IzID0gVmVjdG9yMy5VUCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/ku47lk6rph4znnIvlkJHlk6rph4zvvIzkuZ/lj6/ku6XnkIbop6PkuLrmkYTlvbHmnLrop4bop5LvvIzljbPop4Llr5/nqbrpl7RcclxuICAgICAgICAvL+iLpeimgeWPmOaNouWIsOaRhOW9seacuuepuumXtO+8jOWPr+S7peWBh+iuvuaVtOS4quinguWvn+epuumXtOS7peaRhOW9seacuuS9jeS6juS4lueVjOWdkOagh+WOn+eCue+8jOeEtuWQjuWwhuaJgOacieeJqeS9k+acneaRhOW9seacuuWOn+WFiOWcqOS4lueVjOepuumXtOS4reeahOS9jee9ruWPjeWQkeenu+WKqOWNs+WPr1xyXG4gICAgICAgIC8v5Zyo57q45LiK55S75LiL5Zu+5bCx5riF5pmw5LqGXHJcblxyXG4gICAgICAgIC8v55Sx5LqO6buY6K6k55+p6Zi15pivU1JU6aG65bqP57uE5oiQ55qE5Y+Y5o2i56m66Ze077yM6KaB6YCG5ZCR77yM5YiZ5pivVFJT55qE6aG65bqP77yM5Y2z5YWI56e75Yqo5ZCO5peL6L2sXHJcbiAgICAgICAgLy8xLuWQkeWPjeaWueWQkeW5s+enu1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IzKC1leWUueCwgLWV5ZS55LCAtZXllLnopKTtcclxuXHJcbiAgICAgICAgLy8yLuWQkeWPjeaWueWQkeaXi+i9rFxyXG4gICAgICAgIC8v5YWI6I635Y+W5pGE5b2x5LiW55WM6YOo5Z2Q5qCH6L20XHJcbiAgICAgICAgdmFyIHpBeGlzID0gVmVjdG9yMy5kaWZmZXJlbmNlKGV5ZSwgdGFyZ2V0UG9pbnQpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8v5Zug5Li65oiR5Lus5piv5Y+z5omL57O757uf77yM6KaB5rGCWO+8jOWImeW/hemhu3rkuZh5XHJcbiAgICAgICAgdmFyIHhBeGlzID0gVmVjdG9yMy5jcm9zcyh1cCwgekF4aXMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHZhciB5QXhpcyA9IFZlY3RvcjMuY3Jvc3MoekF4aXMsIHhBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+aehOW7uuaRhOW9seacuuWPjeaWueWQkeaXi+i9rOefqemYtVxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh4QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHlBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoekF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJ1c3R1bShsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgcmwgPSAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGNvbnN0IHRiID0gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBjb25zdCBmbiA9IChmYXIgLSBuZWFyKVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoKG5lYXIgKiAyKSAvIHJsLCAwLCAocmlnaHQgKyBsZWZ0KSAvIHJsLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgKG5lYXIgKiAyKSAvIHRiLCAodG9wICsgYm90dG9tKSAvIHRiLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLShmYXIgKyBuZWFyKSAvIGZuLCAtKGZhciAqIG5lYXIgKiAyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcnRob2dyYXBoaWMobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDIgLyBybCwgMCwgMCwgLShsZWZ0ICsgcmlnaHQpIC8gcmwpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAyIC8gdGIsIDAsIC0odG9wICsgYm90dG9tKSAvIHRiKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTIgLyBmbiwgLShmYXIgKyBuZWFyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcnNwZWN0aXZlKGZvdjogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgaGZvdiA9IGZvdiAvIDE4MCAqIE1hdGguUEkgLyAyO1xyXG4gICAgICAgIGNvbnN0IHRhbiA9IE1hdGgudGFuKGhmb3YpO1xyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMSAvIChhc3BlY3QgKiB0YW4pLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMSAvIHRhbiwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyAoZmFyIC0gbmVhciksIC0oMiAqIGZhciAqIG5lYXIpIC8gKGZhciAtIG5lYXIpKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnZlcnNlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICBjb25zdCBhMDAgPSBtYXRbMF1bMF07XHJcbiAgICAgICAgY29uc3QgYTAxID0gbWF0WzBdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEwMiA9IG1hdFswXVsyXTtcclxuICAgICAgICBjb25zdCBhMDMgPSBtYXRbMF1bM107XHJcbiAgICAgICAgY29uc3QgYTEwID0gbWF0WzFdWzBdO1xyXG4gICAgICAgIGNvbnN0IGExMSA9IG1hdFsxXVsxXTtcclxuICAgICAgICBjb25zdCBhMTIgPSBtYXRbMV1bMl07XHJcbiAgICAgICAgY29uc3QgYTEzID0gbWF0WzFdWzNdO1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IG1hdFsyXVswXTtcclxuICAgICAgICBjb25zdCBhMjEgPSBtYXRbMl1bMV07XHJcbiAgICAgICAgY29uc3QgYTIyID0gbWF0WzJdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEyMyA9IG1hdFsyXVszXTtcclxuICAgICAgICBjb25zdCBhMzAgPSBtYXRbM11bMF07XHJcbiAgICAgICAgY29uc3QgYTMxID0gbWF0WzNdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEzMiA9IG1hdFszXVsyXTtcclxuICAgICAgICBjb25zdCBhMzMgPSBtYXRbM11bM107XHJcblxyXG4gICAgICAgIGNvbnN0IGRldDAwID0gYTAwICogYTExIC0gYTAxICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAzID0gYTAxICogYTEyIC0gYTAyICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTFcclxuICAgICAgICBjb25zdCBkZXQwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMlxyXG4gICAgICAgIGNvbnN0IGRldDA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzFcclxuICAgICAgICBjb25zdCBkZXQxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMlxyXG5cclxuICAgICAgICBsZXQgZGV0ID0gKGRldDAwICogZGV0MTEgLSBkZXQwMSAqIGRldDEwICsgZGV0MDIgKiBkZXQwOSArIGRldDAzICogZGV0MDggLSBkZXQwNCAqIGRldDA3ICsgZGV0MDUgKiBkZXQwNik7XHJcblxyXG4gICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNYXRyaXg0eDQgaW52ZXJzZSBmYWlsZWQsIGRldGVybWluYW50IGlzIDBcIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG5cclxuICAgICAgICBtYXRbMF1bMF0gPSAoYTExICogZGV0MTEgLSBhMTIgKiBkZXQxMCArIGExMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsxXSA9ICgtYTAxICogZGV0MTEgKyBhMDIgKiBkZXQxMCAtIGEwMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsyXSA9IChhMzEgKiBkZXQwNSAtIGEzMiAqIGRldDA0ICsgYTMzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzNdID0gKC1hMjEgKiBkZXQwNSArIGEyMiAqIGRldDA0IC0gYTIzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzBdID0gKC1hMTAgKiBkZXQxMSArIGExMiAqIGRldDA4IC0gYTEzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzFdID0gKGEwMCAqIGRldDExIC0gYTAyICogZGV0MDggKyBhMDMgKiBkZXQwNykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMl0gPSAoLWEzMCAqIGRldDA1ICsgYTMyICogZGV0MDIgLSBhMzMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMV1bM10gPSAoYTIwICogZGV0MDUgLSBhMjIgKiBkZXQwMiArIGEyMyAqIGRldDAxKSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVswXSA9IChhMTAgKiBkZXQxMCAtIGExMSAqIGRldDA4ICsgYTEzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzFdID0gKC1hMDAgKiBkZXQxMCArIGEwMSAqIGRldDA4IC0gYTAzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzJdID0gKGEzMCAqIGRldDA0IC0gYTMxICogZGV0MDIgKyBhMzMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bM10gPSAoLWEyMCAqIGRldDA0ICsgYTIxICogZGV0MDIgLSBhMjMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bMF0gPSAoLWExMCAqIGRldDA5ICsgYTExICogZGV0MDcgLSBhMTIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMV0gPSAoYTAwICogZGV0MDkgLSBhMDEgKiBkZXQwNyArIGEwMiAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFszXVsyXSA9ICgtYTMwICogZGV0MDMgKyBhMzEgKiBkZXQwMSAtIGEzMiAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFszXVszXSA9IChhMjAgKiBkZXQwMyAtIGEyMSAqIGRldDAxICsgYTIyICogZGV0MDApICogZGV0XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0Zsb2F0MzJMaXN0KCk6IEZsb2F0MzJMaXN0IHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIC8v55Sx5LqOT3BlbkdM5piv5YiX5bqP5a2Y5YKo77yM5omA5Lul6ZyA6KaB6L2s572u5LiA5LiL55+p6Zi1XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICBtWzBdWzBdLCBtWzFdWzBdLCBtWzJdWzBdLCBtWzNdWzBdLFxyXG4gICAgICAgICAgICBtWzBdWzFdLCBtWzFdWzFdLCBtWzJdWzFdLCBtWzNdWzFdLFxyXG4gICAgICAgICAgICBtWzBdWzJdLCBtWzFdWzJdLCBtWzJdWzJdLCBtWzNdWzJdLFxyXG4gICAgICAgICAgICBtWzBdWzNdLCBtWzFdWzNdLCBtWzJdWzNdLCBtWzNdWzNdXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDApLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygxKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMiksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDMpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRSU01hdHJpeChwb3M6IFZlY3RvcjMsIHF1YXQ6IFF1YXRlcm5pb24sIHNjYWxlOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgdG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgbGV0IHJtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxdWF0KTtcclxuICAgICAgICBsZXQgc20gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgoc2NhbGUpO1xyXG5cclxuICAgICAgICAvL+W/hemhu+S4peagvOaMieeFp+WFiFNjYWxl77yM5YaNUm90YXRl77yM5YaNVHJhbnNsYXRl55qE6aG65bqP77yM5ZCm5YiZ5b6X5Yiw55qE57uT5p6c6IKv5a6a5piv5LiN5ruh5oSP55qEXHJcbiAgICAgICAgLy/kvovlpoLmnInkuIDkuKoxWDHmraPmlrnlvaLlnKjljp/ngrnvvIzmiJHku6zmg7PopoHlvpfliLDkuIDkuKoxWDLvvIzlubbkuJTmlpzlkJE0NcKw77yM6ICM5LiU56a75Z2Q5qCH5Y6f54K5MeS4quWNleS9jeWkhFxyXG4gICAgICAgIC8v5aaC5p6c5YWI5peL6L2s77yM5YaN57yp5pS+55qE6K+d77yM5peL6L2s5pa55ZCR5piv5a+55LqG77yM5L2G5piv5oiR5Lus5piv5bCG5peL6L2s5ZCONDXCsOeahOato+aWueW9oueahFnovbTmi4nkvLgy5YCN77yM5b6X5Yiw55qE5piv5LiA5Liq6KKr5ouJ6ZW/55qE6I+x5b2iXHJcbiAgICAgICAgLy/lpoLmnpzlhYjlubPnp7vvvIzlho3ml4vovaznmoTor53vvIzlm6DkuLrmiJHku6zml4vovazpg73mmK/nu5XnnYDlnZDmoIfljp/ngrnnmoTvvIznu5Pmnpzoh6rnhLbmmK/mraPmlrnlvaLkuI3mmK/oh6rouqvml4vovaw0NcKw77yM6ICM5piv57uV552A5Y6f54K55peL6L2sXHJcbiAgICAgICAgcmV0dXJuIHRtLm11bHRpcGx5KHJtLm11bHRpcGx5KHNtKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUcmFuc2xhdGVNYXRyaXgocG9zOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IDE7IG1bMF1bMV0gPSAwOyBtWzBdWzJdID0gMDsgbVswXVszXSA9IHBvcy54O1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gMTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSBwb3MueTtcclxuICAgICAgICBtWzJdWzBdID0gMDsgbVsyXVsxXSA9IDA7IG1bMl1bMl0gPSAxOyBtWzJdWzNdID0gcG9zLno7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24ocTogUXVhdGVybmlvbik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIGxldCBudW0gPSBxLnggKiAyO1xyXG4gICAgICAgIGxldCBudW0yID0gcS55ICogMjtcclxuICAgICAgICBsZXQgbnVtMyA9IHEueiAqIDI7XHJcbiAgICAgICAgbGV0IG51bTQgPSBxLnggKiBudW07XHJcbiAgICAgICAgbGV0IG51bTUgPSBxLnkgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW02ID0gcS56ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtNyA9IHEueCAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTggPSBxLnggKiBudW0zO1xyXG4gICAgICAgIGxldCBudW05ID0gcS55ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtMTAgPSBxLncgKiBudW07XHJcbiAgICAgICAgbGV0IG51bTExID0gcS53ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtMTIgPSBxLncgKiBudW0zO1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMSAtIChudW01ICsgbnVtNik7XHJcbiAgICAgICAgbVsxXVswXSA9IG51bTcgKyBudW0xMjtcclxuICAgICAgICBtWzJdWzBdID0gbnVtOCAtIG51bTExO1xyXG4gICAgICAgIG1bM11bMF0gPSAwO1xyXG4gICAgICAgIG1bMF1bMV0gPSBudW03IC0gbnVtMTI7XHJcbiAgICAgICAgbVsxXVsxXSA9IDEgLSAobnVtNCArIG51bTYpO1xyXG4gICAgICAgIG1bMl1bMV0gPSBudW05ICsgbnVtMTA7XHJcbiAgICAgICAgbVszXVsxXSA9IDA7XHJcbiAgICAgICAgbVswXVsyXSA9IG51bTggKyBudW0xMTtcclxuICAgICAgICBtWzFdWzJdID0gbnVtOSAtIG51bTEwO1xyXG4gICAgICAgIG1bMl1bMl0gPSAxIC0gKG51bTQgKyBudW01KTtcclxuICAgICAgICBtWzNdWzJdID0gMDtcclxuICAgICAgICBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZTogVmVjdG9yMywgb3JkZXI6IHN0cmluZyA9IFwiWFlaXCIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v6YCa6L+H5qyn5ouJ6KeS6I635Y+W5peL6L2s55+p6Zi1XHJcbiAgICAgICAgLy/lhYjliIbliKvojrflj5ZYWVrovbTkuIrnmoTml4vovaznn6npmLXvvIznhLblkI7lkIjlubbotbfmnaVcclxuICAgICAgICAvL+azqOaEj++8muaXi+i9rOi9tOeahOmhuuW6j+WFiOWQjuS4jeWQjO+8jOS8muWHuueOsOS4jeWQjOeahOe7k+aenO+8jOWboOatpOW/hemhu+imgeaMh+WumuaXi+i9rOmhuuW6j1xyXG4gICAgICAgIC8vaHR0cDovL3BsYW5uaW5nLmNzLnVpdWMuZWR1L25vZGUxMDIuaHRtbFxyXG4gICAgICAgIC8vaHR0cHM6Ly90aHJlZWpzLm9yZy9kb2NzLyNhcGkvZW4vbWF0aC9FdWxlci5vcmRlclxyXG4gICAgICAgIHZhciB4ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLngsIFZlY3RvcjMuUklHSFQpO1xyXG4gICAgICAgIHZhciB5ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnksIFZlY3RvcjMuVVApO1xyXG4gICAgICAgIHZhciB6ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnosIFZlY3RvcjMuRk9SV0FSRCk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAob3JkZXIpIHtcclxuICAgICAgICAgICAgY2FzZSBcIlhZWlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYWllcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHoubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVhaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh4Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIllaWFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHgubXVsdGlwbHkoei5tdWx0aXBseSh5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWFlcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHgubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWllYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh5Lm11bHRpcGx5KHopKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSb3RhdGlvbiBvcmRlciBlcnJvciwgbXVzdCBiZSBzaW1pbGFyIHRvICdYWVonXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBvdXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIG0gPSBvdXQubWF0cml4O1xyXG4gICAgICAgIHZhciB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xyXG4gICAgICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgICAgICB2YXIgcyA9IDAsIGMgPSAwLCB0ID0gMDtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcclxuICAgICAgICB4ICo9IGxlbjtcclxuICAgICAgICB5ICo9IGxlbjtcclxuICAgICAgICB6ICo9IGxlbjtcclxuICAgICAgICBzID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgdCA9IDEgLSBjO1xyXG4gICAgICAgIG1bMF1bMF0gPSB4ICogeCAqIHQgKyBjO1xyXG4gICAgICAgIG1bMV1bMF0gPSB5ICogeCAqIHQgKyB6ICogcztcclxuICAgICAgICBtWzJdWzBdID0geiAqIHggKiB0IC0geSAqIHM7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IHggKiB5ICogdCAtIHogKiBzO1xyXG4gICAgICAgIG1bMV1bMV0gPSB5ICogeSAqIHQgKyBjO1xyXG4gICAgICAgIG1bMl1bMV0gPSB6ICogeSAqIHQgKyB4ICogcztcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0geCAqIHogKiB0ICsgeSAqIHM7XHJcbiAgICAgICAgbVsxXVsyXSA9IHkgKiB6ICogdCAtIHggKiBzO1xyXG4gICAgICAgIG1bMl1bMl0gPSB6ICogeiAqIHQgKyBjO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTY2FsZU1hdHJpeChzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IHMueDsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzBdID0gMDsgbVsxXVsxXSA9IHMueTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IHMuejsgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBtLm1hdHJpeFswXVswXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMV1bMV0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzJdWzJdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRyaXg0eDRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWF0ZXJuaW9uIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihldWxlcjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUFyb3VuZChhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmV1bGVyQW5nbGVzID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcclxuICAgICAgICAgICAgdGhpcy53ID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBldWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbih0aGlzKS5nZXRFdWxlckFuZ2xlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZXVsZXJBbmdsZXMoZTogVmVjdG9yMykge1xyXG4gICAgICAgIHZhciBxID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZSkuZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVBcm91bmQoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCBxID0gUXVhdGVybmlvbi5hbmdsZUF4aXMoYW5nbGUsIGF4aXMpO1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgICAgIHRoaXMudyA9IHEudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQHpoIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxyXG4gICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1RdWF0KGE6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOiBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXRyYW5zZm9ybS1WZWMzLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICBsZXQgcSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXHJcbiAgICAgICAgY29uc3QgaXggPSBxLncgKiBhLnggKyBxLnkgKiBhLnogLSBxLnogKiBhLnk7XHJcbiAgICAgICAgY29uc3QgaXkgPSBxLncgKiBhLnkgKyBxLnogKiBhLnggLSBxLnggKiBhLno7XHJcbiAgICAgICAgY29uc3QgaXogPSBxLncgKiBhLnogKyBxLnggKiBhLnkgLSBxLnkgKiBhLng7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtcS54ICogYS54IC0gcS55ICogYS55IC0gcS56ICogYS56O1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XHJcbiAgICAgICAgb3V0LnggPSBpeCAqIHEudyArIGl3ICogLXEueCArIGl5ICogLXEueiAtIGl6ICogLXEueTtcclxuICAgICAgICBvdXQueSA9IGl5ICogcS53ICsgaXcgKiAtcS55ICsgaXogKiAtcS54IC0gaXggKiAtcS56O1xyXG4gICAgICAgIG91dC56ID0gaXogKiBxLncgKyBpdyAqIC1xLnogKyBpeCAqIC1xLnkgLSBpeSAqIC1xLng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw55CD6Z2i5o+S5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2xlcnAoYTogUXVhdGVybmlvbiwgYjogUXVhdGVybmlvbiwgdDogbnVtYmVyKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgLy8gYmVuY2htYXJrczpcclxuICAgICAgICAvLyAgICBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXNsZXJwLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlMCA9IDA7XHJcbiAgICAgICAgbGV0IHNjYWxlMSA9IDA7XHJcblxyXG4gICAgICAgIC8vIGNhbGMgY29zaW5lXHJcbiAgICAgICAgbGV0IGNvc29tID0gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgICAgIC8vIGFkanVzdCBzaWducyAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgIGlmIChjb3NvbSA8IDAuMCkge1xyXG4gICAgICAgICAgICBjb3NvbSA9IC1jb3NvbTtcclxuICAgICAgICAgICAgYi54ID0gLWIueDtcclxuICAgICAgICAgICAgYi55ID0gLWIueTtcclxuICAgICAgICAgICAgYi56ID0gLWIuejtcclxuICAgICAgICAgICAgYi53ID0gLWIudztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGNvZWZmaWNpZW50c1xyXG4gICAgICAgIGlmICgoMS4wIC0gY29zb20pID4gMC4wMDAwMDEpIHtcclxuICAgICAgICAgICAgLy8gc3RhbmRhcmQgY2FzZSAoc2xlcnApXHJcbiAgICAgICAgICAgIGNvbnN0IG9tZWdhID0gTWF0aC5hY29zKGNvc29tKTtcclxuICAgICAgICAgICAgY29uc3Qgc2lub20gPSBNYXRoLnNpbihvbWVnYSk7XHJcbiAgICAgICAgICAgIHNjYWxlMCA9IE1hdGguc2luKCgxLjAgLSB0KSAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2lub207XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBxdWF0ZXJuaW9ucyBhcmUgdmVyeSBjbG9zZVxyXG4gICAgICAgICAgICAvLyAgLi4uIHNvIHdlIGNhbiBkbyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgICAgIHNjYWxlMCA9IDEuMCAtIHQ7XHJcbiAgICAgICAgICAgIHNjYWxlMSA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBmaW5hbCB2YWx1ZXNcclxuICAgICAgICBvdXQueCA9IHNjYWxlMCAqIGEueCArIHNjYWxlMSAqIGIueDtcclxuICAgICAgICBvdXQueSA9IHNjYWxlMCAqIGEueSArIHNjYWxlMSAqIGIueTtcclxuICAgICAgICBvdXQueiA9IHNjYWxlMCAqIGEueiArIHNjYWxlMSAqIGIuejtcclxuICAgICAgICBvdXQudyA9IHNjYWxlMCAqIGEudyArIHNjYWxlMSAqIGIudztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdChhOiBRdWF0ZXJuaW9uLCBiOiBRdWF0ZXJuaW9uKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGVBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgYW5nbGUgKj0gMC41O1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmVzLnggPSBheGlzLnggKiBzaW47XHJcbiAgICAgICAgcmVzLnkgPSBheGlzLnkgKiBzaW47XHJcbiAgICAgICAgcmVzLnogPSBheGlzLnogKiBzaW47XHJcbiAgICAgICAgcmVzLncgPSBNYXRoLmNvcyhhbmdsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdpZHRoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yNClcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjIpOiBWZWN0b3IyO1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjI7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjIpOiBWZWN0b3IyO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMjtcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3IyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjIuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IyLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMiwgdDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLngpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhWZWN0b3IyLmRvdCh2MSwgdjIpIC8gKHYxLm1hZ25pdHVkZSAqIHYyLm1hZ25pdHVkZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBSSUdIVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgTEVGVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFVQKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBET1dOKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMyk6IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgdGhpcy56ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICB0aGlzLnogLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICB0aGlzLnogKj0gdi56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IzLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnkgJiYgdi56ID09IHRoaXMuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMsIHQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSArIHYxLnogKiB2Mi56KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB4ID0gdjEueSAqIHYyLnogLSB2MS56ICogdjIueTtcclxuICAgICAgICB2YXIgeSA9IHYxLnogKiB2Mi54IC0gdjEueCAqIHYyLno7XHJcbiAgICAgICAgdmFyIHogPSB2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHggPSB2Mi54IC0gdjEueDtcclxuICAgICAgICB2YXIgeSA9IHYyLnkgLSB2MS55O1xyXG4gICAgICAgIHZhciB6ID0gdjIueiAtIHYxLno7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlmZmVyZW5jZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgZGVzdCA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIGRlc3QueCA9IHYxLnggLSB2Mi54XHJcbiAgICAgICAgZGVzdC55ID0gdjEueSAtIHYyLnlcclxuICAgICAgICBkZXN0LnogPSB2MS56IC0gdjIuelxyXG5cclxuICAgICAgICByZXR1cm4gZGVzdFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGUodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlY3RvcjMuZG90KHYxLCB2MikgLyAodjEubWFnbml0dWRlICogdjIubWFnbml0dWRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFJJR0hUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBMRUZUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygtMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgVVAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERPV04oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBGT1JXQVJEKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBCQUNLKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjQge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGdldCByKCk6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXQgZygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuejsgfVxyXG4gICAgcHVibGljIGdldCBhKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnc7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZlY3RvcjMoKTogVmVjdG9yMyB7IHJldHVybiBuZXcgVmVjdG9yMyh0aGlzKTsgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMywgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHRoaXMudyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzLmxlbmd0aCA9PSAyID8gYXJndW1lbnRzWzFdIDogMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yNCk6IFZlY3RvcjQ7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1swXS53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyArPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiBWZWN0b3I0O1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1swXS53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyAtPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICB0aGlzLnogKj0gZDtcclxuICAgICAgICB0aGlzLncgKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHRoaXMueiAvPSBkO1xyXG4gICAgICAgIHRoaXMudyAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHRoaXMueiAqPSB2Lno7XHJcbiAgICAgICAgdGhpcy53ICo9IHYudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yNC5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCh0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yNCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnkgJiYgdi56ID09IHRoaXMueiAmJiB2LncgPT0gdGhpcy53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiLCBcIiArIHRoaXMudyArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCwgdDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yNCgpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgdi56ID0gdjEueiArIHQgKiAodjIueiAtIHYxLnopO1xyXG4gICAgICAgIHYudyA9IHYxLncgKyB0ICogKHYyLncgLSB2MS53KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSArIHYxLnogKiB2Mi56ICsgdjEudyAqIHYyLncpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjQuZG90KHYxLCB2MikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgxLCAxLCAxLCAxKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL01hdGgvVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZnJvbVwiO1xyXG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gXCIuL0NvbXBvbmVudC9SZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tIFwiLi9Db21wb25lbnQvTWVzaFJlbmRlcmVyXCI7XHJcbmltcG9ydCB7IENhbWVyYSB9IGZyb20gXCIuL0NvbXBvbmVudC9DYW1lcmFcIjtcclxuXHJcbmVudW0gRHJhd01vZGUge1xyXG4gICAgV2lyZWZyYW1lLFxyXG4gICAgUG9pbnQsXHJcbiAgICBTaGFkZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhc3Rlcml6YXRpb25QaXBlbGluZSB7XHJcbiAgICBwdWJsaWMgZHJhd01vZGU6IERyYXdNb2RlID0gRHJhd01vZGUuV2lyZWZyYW1lO1xyXG4gICAgcHJpdmF0ZSB1aW50MzJWaWV3OiBVaW50MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aW50MzJWaWV3OiBVaW50MzJBcnJheSkge1xyXG4gICAgICAgIHRoaXMudWludDMyVmlldyA9IHVpbnQzMlZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIOWfuuehgOe7mOWItuaOpeWPo1xyXG5cclxuICAgIHB1YmxpYyBDbGVhcihjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5L2/55SoIGZpbGwg5pa55rOV5pu/5Luj5b6q546v77yM5oCn6IO95pu05aW9XHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3LmZpbGwoY29sb3IpO1xyXG4gICAgICAgIC8vIOaIluiAheS9v+eUqOW+queOr++8jOS9huaAp+iDvei+g+W3rlxyXG4gICAgICAgIC8vIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jYW52YXNXaWR0aDsgeCsrKSB7XHJcbiAgICAgICAgLy8gICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5jYW52YXNIZWlnaHQ7IHkrKykge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5TZXRQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdQaXhlbCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOe7mOWItuWIsOWxj+W5leS4iueahOWDj+e0oOW6lOivpeaYr+aVtOaVsOeahFxyXG4gICAgICAgIC8vIOS8mOWMljog5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHggPSAoeCB8IDApO1xyXG4gICAgICAgIHkgPSAoeSB8IDApO1xyXG4gICAgICAgIC8vIHggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIC8vIHkgPSBNYXRoLmZsb29yKHkpO1xyXG5cclxuICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBDb25maWcuY2FudmFzV2lkdGggfHwgeSA8IDAgfHwgeSA+PSBDb25maWcuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWludDMyVmlld1t5ICogQ29uZmlnLmNhbnZhc1dpZHRoICsgeF0gPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd0xpbmUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOWPluaVtFxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG5cclxuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XHJcbiAgICAgICAgY29uc3QgZHkgPSB5MiAtIHkxO1xyXG5cclxuICAgICAgICAvLyDkuLrkvZXopoHljLrliIbmlpznjofmmK/lkKblgY/msLTlubPov5jmmK/lnoLnm7TlkaLvvJ/lm6DkuLrlpoLmnpzkuI3ljLrliIbvvIzkvovlpoLlvZPmlpznjoflpKfkuo4x5pe277yM5Lya5a+86Ie055u057q/57uY5Yi25LiN6L+e57ut77yM5Zug5Li6eeS8mui3s+WPmO+8jOiAjOS4jeaYr+i/nue7reeahOWinuWKoOOAglxyXG4gICAgICAgIC8vIOWPquacieaWnOeOh+WImuWlveS4ujHml7bvvIx46LefeeaJjeaYr+i/nue7reWQjOatpeiHquWinueahO+8jHgrMe+8jOWImXnkuZ8rMVxyXG4gICAgICAgIC8vIOaJgOS7pe+8jOW9k+aWnOeOh+Wkp+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh55L2c5Li65b6q546v5Y+Y6YeP77yM6ICM5b2T5pac546H5bCP5LqOMeaXtu+8jOaIkeS7rOmcgOimgeS9v+eUqHjkvZzkuLrlvqrnjq/lj5jph4/jgIJcclxuICAgICAgICAvLyDkuL7kuKrmnoHnq6/kvovlrZDvvIzlvZPmlpznjofkuLow5pe277yM55u057q/5bCx5piv5LiA5p2h5Z6C55u055u057q/77yM5aaC5p6c6L+Z5pe25YCZ6L+Y55SoeOS9nOS4uuW+queOr+WPmOmHj++8jOWImeS8muWvvOiHtOi/meadoeebtOe6v+S4iuaJgOaciXnngrnpg73lr7nlupTkuIDkuKp477yM5Lmf5bCx5piv6K+06L+Z5p2h57q/5Y+Y5oiQ5LiA5Liq54K55LqG44CCXHJcblxyXG4gICAgICAgIC8vIOaWnOeOh+Wwj+S6jjHvvIznm7Tnur/lgY/msLTlubPmg4XlhrXvvIzkvb/nlKh45L2c5Li65b6q546v5Y+Y6YePXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA+IE1hdGguYWJzKGR5KSkge1xyXG4gICAgICAgICAgICAvLyDkuIvpnaLnmoTlvqrnjq/nu5jliLblh73mlbDmmK/ku47lt6blvoDlj7PnmoTvvIzov5nph4zopoHnoa7kv53nu5PmnZ/ngrnlnKjlvIDlp4vngrnnmoTlj7PovrlcclxuICAgICAgICAgICAgaWYgKHgyIDwgeDEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgLy8g5pac546HXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkeSAvIGR4O1xyXG4gICAgICAgICAgICAvLyDmiKrot53vvIh5PWF4K2LvvIxiPXktYXjvvIlcclxuICAgICAgICAgICAgLy8gY29uc3QgYiA9IHkxIC0gYSAqIHgxO1xyXG4gICAgICAgICAgICBsZXQgeSA9IHkxO1xyXG4gICAgICAgICAgICAvLyDnu5jliLbnm7Tnur9cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIC8vIOebtOe6v+WFrOW8j3k9YXgrYu+8jOi/memHjOS4jeW/heiuoeeul+i/meS4quWFrOW8j++8jOWboOS4uuW9k3jliqAx6Ieq5aKe5pe277yMeeS5n+S8muWKoGHvvIzmiYDku6Xlj6/ku6Xnm7TmjqXnlKh5K2Hku6Pmm79heCti77yM566X5piv5LiA5Liq5oCn6IO95LyY5YyW54K5XHJcbiAgICAgICAgICAgICAgICAvLyB5ID0gYSAqIHggKyBiO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiJZcclxuICAgICAgICAgICAgLy8gY29uc3QgeXMgPSB0aGlzLkludGVycG9sYXRlKHgxLCB5MSwgeDIsIHkyKTtcclxuICAgICAgICAgICAgLy8gZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuRHJhd1BpeGVsKHgsIHlzW3ggLSB4MV0sIGNvbG9yKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmlpznjoflpKfkuo4x77yM55u057q/5YGP5Z6C55u05oOF5Ya177yM5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoeTIgPCB5MSkgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhID0gZHggLyBkeTtcclxuICAgICAgICAgICAgbGV0IHggPSB4MTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHhzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4c1t5IC0geTFdLCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDIsIHkyLCB4MywgeTMsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgzLCB5MywgeDEsIHkxLCBjb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZUZpbGxlZCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5rOo77ya5Lul5LiL5o+Q5Yiw55qE6ZW/6L6577yM54m55oyHeei9tOi3qOW6puacgOmVv+eahOi+ue+8jOiAjOS4jeaYr+WunumZheS4iueahOi+uemVv1xyXG5cclxuICAgICAgICAvLyDlrp7pmYXnu5jliLbliLDlsY/luZXkuIrnmoTngrnvvIzlv4XpobvmmK/mlbTmlbDvvIzlj5bmlbTkuIDkuIvjgILkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgeDEgPSB4MSB8IDA7XHJcbiAgICAgICAgeTEgPSB5MSB8IDA7XHJcbiAgICAgICAgeDIgPSB4MiB8IDA7XHJcbiAgICAgICAgeTIgPSB5MiB8IDA7XHJcbiAgICAgICAgeDMgPSB4MyB8IDA7XHJcbiAgICAgICAgeTMgPSB5MyB8IDA7XHJcblxyXG4gICAgICAgIC8vIOWvueeCuei/m+ihjOaOkuW6j++8jOS9v+W+l3kxPD15Mjw9eTPvvIzljbPlj6/noa7lrprkuInop5LlvaLnmoTplb/ovrnkuLpMMTPvvIxMMTLlkoxMMjPliJnmmK/lj6blpJbkuKTmnaHnn63ovrlcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5M10gPSBbeDMsIHkzLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MiA+IHkzKSBbeDIsIHkyLCB4MywgeTNdID0gW3gzLCB5MywgeDIsIHkyXTtcclxuXHJcbiAgICAgICAgLy8g6I635Y+WM+adoei+ueeahOeCueWdkOagh+WQiOmbhlxyXG4gICAgICAgIGNvbnN0IHAxMiA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG5cclxuICAgICAgICAvLyDmi7zlkIjkuKTmnaHnn63ovrnkuLrkuIDmnaHplb/ovrnvvIjlhYjnp7vpmaTnrKzkuIDmnaHovrnnmoTmnIDlkI7kuIDkuKrmlbDmja7vvIzpgb/lhY3ph43lpI3vvIlcclxuICAgICAgICAvLyDnjrDlnKjlj5jmiJAy5p2h6ZW/6L6577yMTDEz5ZKMTDEyM1xyXG4gICAgICAgIHAxMi5wb3AoKTtcclxuICAgICAgICBjb25zdCBwMTIzID0gcDEyLmNvbmNhdChwMjMpO1xyXG5cclxuICAgICAgICAvLyDliKTmlq1MMTPlkoxMMTIz5ZOq5p2h6ZW/6L655piv5bem5ZOq5p2h5piv5Y+z77yM6YO95Y+W5pWw57uE5Lit6Ze055qE54K577yM5Yik5pat6LCB5bem6LCB5Y+z5Y2z5Y+v44CCXHJcbiAgICAgICAgLy8g5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIC8vIGNvbnN0IG0gPSBNYXRoLmZsb29yKHAxMjMubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgbSA9IChwMTIzLmxlbmd0aCA+PiAxKSB8IDA7XHJcbiAgICAgICAgbGV0IHBMZWZ0ID0gcDEyMztcclxuICAgICAgICBsZXQgcFJpZ2h0ID0gcDEzO1xyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIHBMZWZ0ID0gcDEzO1xyXG4gICAgICAgICAgICBwUmlnaHQgPSBwMTIzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q61XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHBMZWZ0W3kgLSB5MV07IHggPD0gcFJpZ2h0W3kgLSB5MV07IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWRXaXRoVmVydGV4Q29sb3IoXHJcbiAgICAgICAgeDE6IG51bWJlciwgeTE6IG51bWJlcixcclxuICAgICAgICB4MjogbnVtYmVyLCB5MjogbnVtYmVyLFxyXG4gICAgICAgIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsXHJcbiAgICAgICAgY29sb3IxOiBudW1iZXIsIGNvbG9yMjogbnVtYmVyLCBjb2xvcjM6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnmjIlZ5Z2Q5qCH5o6S5bqP77yM56Gu5L+deTEgPD0geTIgPD0geTNcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyLCBjb2xvcjEsIGNvbG9yMl0gPSBbeDIsIHkyLCB4MSwgeTEsIGNvbG9yMiwgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzLCBjb2xvcjEsIGNvbG9yM10gPSBbeDMsIHkzLCB4MSwgeTEsIGNvbG9yMywgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzLCBjb2xvcjIsIGNvbG9yM10gPSBbeDMsIHkzLCB4MiwgeTIsIGNvbG9yMywgY29sb3IyXTtcclxuXHJcbiAgICAgICAgLy8g5o+Q5Y+WUkdC5YiG6YePXHJcbiAgICAgICAgY29uc3QgYzEgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMSk7XHJcbiAgICAgICAgY29uc3QgYzIgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMik7XHJcbiAgICAgICAgY29uc3QgYzMgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMyk7XHJcblxyXG4gICAgICAgIC8vIOaPkuWAvOWHveaVsO+8jOminOiJsjHkuI7popzoibIy5ZyoZDEtZDLnmoTojIPlm7TlhoXlnYfljIDmj5LlgLxcclxuICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZUNvbG9yID0gKGQxOiBudW1iZXIsIHIxOiBudW1iZXIsIGcxOiBudW1iZXIsIGIxOiBudW1iZXIsIGExOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGQyOiBudW1iZXIsIHIyOiBudW1iZXIsIGcyOiBudW1iZXIsIGIyOiBudW1iZXIsIGEyOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCPXHJcbiAgICAgICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LlkoxNYXRoLmFic++8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgICAgICAvLyBjb25zdCBkeCA9IE1hdGguYWJzKE1hdGguZmxvb3IoZDIgLSBkMSkpO1xyXG4gICAgICAgICAgICBjb25zdCBkeCA9ICgoZDIgPiBkMSA/IGQyIC0gZDEgOiBkMSAtIGQyKSB8IDApO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+atpemVv1xyXG4gICAgICAgICAgICBjb25zdCBpbnZEZWx0YSA9IDEgLyAoZDIgLSBkMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gKHIyIC0gcjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gKGcyIC0gZzEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gKGIyIC0gYjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gKGEyIC0gYTEpICogaW52RGVsdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IHIxLCBnID0gZzEsIGIgPSBiMSwgYSA9IGExO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB7IHIsIGcsIGIsIGEgfTtcclxuICAgICAgICAgICAgICAgIHIgKz0gclN0ZXA7XHJcbiAgICAgICAgICAgICAgICBnICs9IGdTdGVwO1xyXG4gICAgICAgICAgICAgICAgYiArPSBiU3RlcDtcclxuICAgICAgICAgICAgICAgIGEgKz0gYVN0ZXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzkuInmnaHovrnnmoTlnZDmoIflkozpopzoibJcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMTJDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkxLCBjMS5yLCBjMS5nLCBjMS5iLCBjMS5hLCB5MiwgYzIuciwgYzIuZywgYzIuYiwgYzIuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAyM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTMsIGMzLnIsIGMzLmcsIGMzLmIsIGMzLmEpO1xyXG5cclxuICAgICAgICAvLyDlkIjlubbkuKTmnaHnn63ovrlcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuICAgICAgICBjb25zdCBwMTIzQ29sb3JzID0gcDEyQ29sb3JzLmNvbmNhdChwMjNDb2xvcnMpO1xyXG5cclxuICAgICAgICAvLyDnoa7lrprlt6blj7PovrnnlYxcclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBsZWZ0UG9pbnRzID0gcDEyMztcclxuICAgICAgICBsZXQgcmlnaHRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgbGV0IGxlZnRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIGxldCByaWdodENvbG9ycyA9IHAxM0NvbG9ycztcclxuXHJcbiAgICAgICAgaWYgKHAxM1ttXSA8IHAxMjNbbV0pIHtcclxuICAgICAgICAgICAgbGVmdFBvaW50cyA9IHAxMztcclxuICAgICAgICAgICAgcmlnaHRQb2ludHMgPSBwMTIzO1xyXG4gICAgICAgICAgICBsZWZ0Q29sb3JzID0gcDEzQ29sb3JzO1xyXG4gICAgICAgICAgICByaWdodENvbG9ycyA9IHAxMjNDb2xvcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu5jliLbmsLTlubPnur/mrrXvvIzlubbov5vooYzpopzoibLmj5LlgLxcclxuICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTM7IHkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB5IC0geTE7XHJcbiAgICAgICAgICAgIGNvbnN0IHhTdGFydCA9IGxlZnRQb2ludHNbaWR4XTtcclxuICAgICAgICAgICAgY29uc3QgeEVuZCA9IHJpZ2h0UG9pbnRzW2lkeF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0Q29sb3IgPSBsZWZ0Q29sb3JzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q29sb3IgPSByaWdodENvbG9yc1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgLy8g6aKE6K6h566X6aKc6Imy5beu5YC8XHJcbiAgICAgICAgICAgIGNvbnN0IHJEaWZmID0gcmlnaHRDb2xvci5yIC0gbGVmdENvbG9yLnI7XHJcbiAgICAgICAgICAgIGNvbnN0IGdEaWZmID0gcmlnaHRDb2xvci5nIC0gbGVmdENvbG9yLmc7XHJcbiAgICAgICAgICAgIGNvbnN0IGJEaWZmID0gcmlnaHRDb2xvci5iIC0gbGVmdENvbG9yLmI7XHJcbiAgICAgICAgICAgIGNvbnN0IGFEaWZmID0gcmlnaHRDb2xvci5hIC0gbGVmdENvbG9yLmE7XHJcblxyXG4gICAgICAgICAgICAvLyDmraXplb/lkozpopzoibLlop7ph49cclxuICAgICAgICAgICAgY29uc3QgaW52TGVuZ3RoID0gMSAvICgoeEVuZCAtIHhTdGFydCkgKyAxKTtcclxuICAgICAgICAgICAgY29uc3QgclN0ZXAgPSByRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgZ1N0ZXAgPSBnRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYlN0ZXAgPSBiRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYVN0ZXAgPSBhRGlmZiAqIGludkxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIOWIneWni+minOiJsuWAvFxyXG4gICAgICAgICAgICBsZXQgciA9IGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBsZXQgZyA9IGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBsZXQgYiA9IGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBsZXQgYSA9IGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5rC05bmz5pa55ZCR6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5hbENvbG9yID0gKChhIHwgMCkgPDwgMjQpIHwgKChiIHwgMCkgPDwgMTYpIHwgKChnIHwgMCkgPDwgOCkgfCAociB8IDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgZmluYWxDb2xvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g57Sv5Yqg6aKc6Imy5YC8XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDmipXlvbHnm7jlhbNcclxuXHJcbiAgICAvLyDlsIbop4blj6PkuIrnmoTlhoXlrrnmmKDlsITliLDlrp7pmYXlsY/luZXkuIpcclxuICAgIHB1YmxpYyBWaWV3cG9ydFRvQ2FudmFzKHBvaW50OiBWZWN0b3IyKSB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG5Y+j5a695bqm5Li6MeS4quWNleS9jVxyXG4gICAgICAgIC8vIOWboOS4umFzcGVjdFJhdGlvID0gY2FudmFzV2lkdGggLyBjYW52YXNIZWlnaHTvvIxcclxuICAgICAgICAvLyDmiYDku6Xop4blj6Ppq5jluqYgPSAxIC8gYXNwZWN0UmF0aW8gPSBjYW52YXNIZWlnaHQgLyBjYW52YXNXaWR0aFxyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSAxO1xyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gMSAvIENvbmZpZy5hc3BlY3RSYXRpbztcclxuXHJcbiAgICAgICAgLy8g5bCG5oqV5b2x5Z2Q5qCH5pig5bCE5YiwQ2FudmFz5YOP57Sg5Z2Q5qCHXHJcbiAgICAgICAgLy8gWOWdkOagh++8muS7jiBbLXZpZXdwb3J0V2lkdGgvMiwgdmlld3BvcnRXaWR0aC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc1dpZHRoXVxyXG4gICAgICAgIC8vIFnlnZDmoIfvvJrku44gWy12aWV3cG9ydEhlaWdodC8yLCB2aWV3cG9ydEhlaWdodC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc0hlaWdodF0gKOazqOaEj1novbTmlrnlkJEpXHJcbiAgICAgICAgY29uc3QgY2FudmFzWCA9ICgocG9pbnQueCArIHZpZXdwb3J0V2lkdGggLyAyKSAvIHZpZXdwb3J0V2lkdGgpICogQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSBDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgocG9pbnQueSArIHZpZXdwb3J0SGVpZ2h0IC8gMikgLyB2aWV3cG9ydEhlaWdodCkgKiBDb25maWcuY2FudmFzSGVpZ2h0KTsgLy8gQ2FudmFz55qEWei9tOmAmuW4uOaYr+WQkeS4i+eahFxyXG4gICAgICAgIHBvaW50LnggPSBjYW52YXNYO1xyXG4gICAgICAgIHBvaW50LnkgPSBjYW52YXNZO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmAj+inhuaKleW9se+8jOWwhjNE5Zy65pmv55qE5Z2Q5qCH6L2s5o2i5Li6MkTlsY/luZXlnZDmoIfvvIzmipXlsITliLDop4blj6PkuIpcclxuICAgIHB1YmxpYyBQcm9qZWN0VmVydGV4KHZlcnRleDogVmVjdG9yMyk6IFZlY3RvcjIge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhueCueWIsOi/keijgemdou+8iOinhuWPo++8ieeahOi3neemu+aYr2TvvIzop4blj6PnmoTlrr3mmK8xXHJcbiAgICAgICAgLy8g5qC55o2u5LiJ6KeS5Ye95pWw5pyJ77yadGFuKGZvdi8yKSA9ICgwLjUgLyBkKVxyXG4gICAgICAgIC8vIOaJgOS7pe+8mmQgPSAwLjUgLyB0YW4oZm92LzIpXHJcbiAgICAgICAgY29uc3QgZm92RGVncmVlcyA9IDYwO1xyXG4gICAgICAgIGNvbnN0IGZvdlJhZGlhbnMgPSBmb3ZEZWdyZWVzICogKE1hdGguUEkgLyAxODApOyAvLyDlsIbop5LluqbovazmjaLkuLrlvKfluqZcclxuICAgICAgICBjb25zdCBkID0gMC41IC8gTWF0aC50YW4oZm92UmFkaWFucyAvIDIpO1xyXG5cclxuICAgICAgICAvLyDpgI/op4blhazlvI/vvIzlgYforr7op4bngrnkvY3nva4oMCwwKe+8jOinhueCueWIsOinhuWPo+i3neemu+S4umTvvIzlnLrmma/ph4znmoTngrnkuLpQKHgseSx6Ke+8jOaKleWwhOWIsOinhuWPo+S4iueahOeCueS4ulAnKHgseSlcclxuICAgICAgICAvLyDliJnmoLnmja7nm7jkvLzkuInop5LlvaLmnInvvJp6IC8gZCA9IHggLyB4JyA9IHkgLyB5J++8jOWPr+W+l+WIsO+8mlxyXG4gICAgICAgIC8vIHgnID0gKGQgKiB4KSAvIHpcclxuICAgICAgICAvLyB5JyA9IChkICogeSkgLyB6XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblggPSAoZCAqIHZlcnRleC54KSAvIHZlcnRleC56O1xyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb25ZID0gKGQgKiB2ZXJ0ZXgueSkgLyB2ZXJ0ZXguejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHByb2plY3Rpb25YLCBwcm9qZWN0aW9uWSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOWPmOaNolxyXG5cclxuICAgIC8qXHJcbiAgICAgKiDpobbngrnlpITnkIbpmLbmrrXvvJrmqKHlnovnqbrpl7Qg4oaS77yI5qih5Z6L55+p6Zi16Zi177yJ4oaSIOS4lueVjOepuumXtCDihpLvvIjop4blm77nn6npmLXvvInihpIg6KeC5a+f56m66Ze0IOKGku+8iOaKleW9seefqemYte+8ieKGkiDoo4Hliarnqbrpl7Qg4oaS77yI6YCP6KeG6Zmk5rOV77yJ4oaSIE5EQyDnqbrpl7Qg4oaS77yI6KeG5Y+j5Y+Y5o2i77yJ4oaSIOWxj+W5leepuumXtCDihpIg5YWJ5qCF5YyW5riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2UodmVydGljZXM6IFZlY3RvcjNbXSwgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBjbGlwU3BhY2VWZXJ0aWNlcyA9IG5ldyBBcnJheSh2ZXJ0aWNlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyDmnoTlu7pNVlDnn6npmLVcclxuICAgICAgICBjb25zdCBtb2RlbE1hdHJpeCA9IHRyYW5zZm9ybS5sb2NhbFRvV29ybGRNYXRyaXg7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gQ2FtZXJhLm1haW5DYW1lcmE7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhRm9yd2FyZCA9IGNhbWVyYS50cmFuc2Zvcm0uZm9yd2FyZDtcclxuICAgICAgICBjb25zdCBjYW1lcmFVcCA9IGNhbWVyYS50cmFuc2Zvcm0udXA7XHJcbiAgICAgICAgLy8g5p6E5bu65LiA5Liq5YWI5pyd5pGE5b2x5py65Y+N5pa55ZCR56e75Yqo77yM5YaN5Y+N5pa55ZCR5peL6L2s55qE55+p6Zi177yM5YW25a6e5b6X5Yiw55qE5Lmf5bCx5piv5LiK6Z2i5pGE5b2x5py655qE5LiW55WM5Z2Q5qCH55+p6Zi1XHJcbiAgICAgICAgY29uc3QgbW9kZWxWaWV3TWF0cml4ID0gbW9kZWxNYXRyaXguY2xvbmUoKS50cmFuc2Zvcm1Ub0xvb2tBdFNwYWNlKGNhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24sIGNhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24uYWRkKGNhbWVyYUZvcndhcmQpLCBjYW1lcmFVcCk7XHJcbiAgICAgICAgY29uc3QgbXZwTWF0cml4ID0gbW9kZWxWaWV3TWF0cml4LnBlcnNwZWN0aXZlKGNhbWVyYS5mb3YsIGNhbWVyYS5hc3BlY3QsIGNhbWVyYS5uZWFyQ2xpcCwgY2FtZXJhLmZhckNsaXApO1xyXG5cclxuICAgICAgICAvLyAxLiBNVlDlj5jmjaLliLDoo4Hliarnqbrpl7RcclxuICAgICAgICAvLyDmqKHlnovnqbrpl7QgLT4g5LiW55WM56m66Ze0IC0+IOinguWvn+epuumXtCAtPiDoo4Hliarnqbrpl7RcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCB2ZXJ0aWNlID0gdmVydGljZXNbaV0uY2xvbmUoKTtcclxuICAgICAgICAgICAgbGV0IHYgPSBtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHZlcnRpY2UsIDEpKTtcclxuICAgICAgICAgICAgY2xpcFNwYWNlVmVydGljZXNbaV0gPSB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMi4g6YCP6KeG6Zmk5rOV77ya5bCG6KOB5Ymq56m66Ze05Z2Q5qCH6L2s5o2i5Li65qCH5YeG6K6+5aSH5Z2Q5qCH77yITkRD77yJXHJcbiAgICAgICAgLy8g6KOB5Ymq56m66Ze0IC0+IOagh+WHhuWMluiuvuWkh+WdkOagh++8iE5EQyDnqbrpl7TvvIlcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsaXBTcGFjZVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHYgPSBjbGlwU3BhY2VWZXJ0aWNlc1tpXTtcclxuICAgICAgICAgICAgLy8gd+WIhumHj+aYr+mAj+inhuaKleW9seS6p+eUn+eahO+8jOeUqOS6jumAj+inhumZpOazlVxyXG4gICAgICAgICAgICBjb25zdCB3ID0gdi53OyAvLyDlgYforr7kvaDnmoRWZWN0b3I0L1ZlY3RvcjPlrp7njrDkuK3vvIzpvZDmrKHlnZDmoId35a2Y5YKo5Zyod+WxnuaAp+S4reOAguWmguaenOayoeacie+8jOmcgOimgeehruS/nU1WUOWPmOaNouaXtuWkhOeQhuS6hum9kOasoeWdkOagh+OAglxyXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInmmL7lvI/nmoR35YiG6YeP77yM5LiUbXZwTWF0cml4Lm11bHRpcGx5VmVjdG9yM+i/lOWbnueahOaYr1ZlY3RvcjPvvIzpgqPkuYjpgJrluLjorqTkuLp3PTHvvIjmraPkuqTmipXlvbHvvInmiJbogIXpnIDopoHku47lj5jmjaLnn6npmLXkuK3ogIPomZHpgI/op4ZcclxuXHJcbiAgICAgICAgICAgIC8vIOi/m+ihjOmAj+inhumZpOazle+8mnh5euWIhuWIq+mZpOS7pXdcclxuICAgICAgICAgICAgLy8g5rOo5oSP77ya5aaC5p6c5L2g55qE55+p6Zi15LmY5rOV5rKh5pyJ5aSE55CG6b2Q5qyh5Z2Q5qCH77yI5Y2z6L+U5Zue55qEdmVydGljZeaYr+S4iee7tOWQkemHj++8ie+8jOmCo+S5iOW+iOWPr+iDveS9oOeahOWPmOaNouayoeacieWMheWQq+mAj+inhuaKleW9seS6p+eUn+eahHfliIbph4/jgIJcclxuICAgICAgICAgICAgLy8g5YGH6K6+5L2g55qEbXZwTWF0cml4Lm11bHRpcGx5VmVjdG9yM+ehruWunui/lOWbnuS6huWMheWQq+m9kOasoeWdkOagh+eahFZlY3RvcjTvvIzmiJbogIXmnInkuIDkuKrov5Tlm55WZWN0b3I055qE5pa55rOV44CCXHJcbiAgICAgICAgICAgIC8vIOi/memHjOWBh+iuviBwcm9qZWN0ZWRWZXJ0aWNlcyDkuK3lrZjlgqjnmoTmmK8gVmVjdG9yNO+8jOaIluiAheiHs+WwkeaciSB4LCB5LCB6LCB3IOWxnuaAp+OAglxyXG5cclxuICAgICAgICAgICAgLy8g5aaC5p6c5oKo55qE5a6e546w5Lit77yM57uP6L+H6YCP6KeG5oqV5b2x55+p6Zi15Y+Y5o2i5ZCO77yM6aG254K55bey57uP5piv5LiA5Liq6b2Q5qyh5Z2Q5qCH77yIeCwgeSwgeiwgd++8ie+8jOWImemcgOimgeS7peS4i+mZpOazle+8mlxyXG4gICAgICAgICAgICB2LnggPSB2LnggLyB3O1xyXG4gICAgICAgICAgICB2LnkgPSB2LnkgLyB3O1xyXG4gICAgICAgICAgICB2LnogPSB2LnogLyB3OyAvLyDlr7nkuo7mt7Hluqbkv6Hmga/vvIzlj6/og73ov5jpnIDopoHov5vkuIDmraXlpITnkIbvvIzkvYblsY/luZXmmKDlsITpgJrluLjkuLvopoHlhbPms6h4LHlcclxuICAgICAgICAgICAgLy8g57uP6L+H6YCP6KeG6Zmk5rOV5ZCO77yM5Z2Q5qCH5L2N5LqO5qCH5YeG6K6+5aSH5Z2Q5qCH77yITkRD77yJ56m66Ze077yM6YCa5bi4eCwgeSwgeuiMg+WbtOWcqFstMSwgMV3vvIhPcGVuR0zpo47moLzvvInmiJZbMCwgMV3vvIhEaXJlY3RY6aOO5qC877yJ5LmL6Ze044CCXHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuaIkeS7rOeahE5EQ+aYr1stMSwgMV3ojIPlm7TjgIJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDMuIOinhuWPo+WPmOaNou+8muWwhk5EQ+WdkOagh+aYoOWwhOWIsOWxj+W5leWdkOagh1xyXG4gICAgICAgIC8vIOagh+WHhuWMluiuvuWkh+WdkOagh++8iE5EQyDnqbrpl7TvvIkgLT4g5bGP5bmV56m66Ze0XHJcbiAgICAgICAgLy8g6I635Y+W55S75biD77yI5oiW6KeG5Y+j77yJ55qE5a695bqm5ZKM6auY5bqmXHJcbiAgICAgICAgY29uc3Qgc2NyZWVuVmVydGljZXMgPSBuZXcgQXJyYXkoY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsaXBTcGFjZVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5kYyA9IGNsaXBTcGFjZVZlcnRpY2VzW2ldOyAvLyDmraTml7ZuZGPlupTor6XmmK/nu4/ov4fpgI/op4bpmaTms5XlkI7nmoROREPlnZDmoIdcclxuXHJcbiAgICAgICAgICAgIC8vIOWwhk5EQ+eahHjku45bLTEsIDFd5pig5bCE5YiwWzAsIHNjcmVlbldpZHRoXVxyXG4gICAgICAgICAgICBjb25zdCBzY3JlZW5YID0gKChuZGMueCArIDEpIC8gMikgKiBDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgICAgIC8vIOWwhk5EQ+eahHnku45bLTEsIDFd5pig5bCE5YiwWzAsIHNjcmVlbkhlaWdodF3jgILms6jmhI/lsY/luZXlnZDmoIfpgJrluLh55ZCR5LiL5Li65q2j77yM6ICMTkRD55qEeeWQkeS4iuS4uuato++8jOaJgOS7pemcgOimgee/u+i9rFxyXG4gICAgICAgICAgICBjb25zdCBzY3JlZW5ZID0gQ29uZmlnLmNhbnZhc0hlaWdodCAtICgoKG5kYy55ICsgMSkgLyAyKSAqIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgICAgICAgICAvLyB65YiG6YeP6YCa5bi455So5LqO5rex5bqm5rWL6K+V77yM6L+Z6YeM5oiR5Lus5Y+q5YWz5b+D5bGP5bmVeCx5XHJcbiAgICAgICAgICAgIC8vIOWmguaenOS9oOeahE5EQ3rojIPlm7TmmK9bLTEsMV3kuJTpnIDopoHmmKDlsITliLBbMCwxXe+8iOS+i+WmgldlYkdQVeafkOS6m+aDheWGte+8ie+8jOWPr+S7peexu+S8vOWkhOeQhu+8mmNvbnN0IHNjcmVlblogPSAobmRjLnogKyAxKSAvIDI7XHJcblxyXG4gICAgICAgICAgICBzY3JlZW5WZXJ0aWNlc1tpXSA9IHsgeDogc2NyZWVuWCwgeTogc2NyZWVuWSB9OyAvLyDlrZjlgqjlsY/luZXlnZDmoIdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JlZW5WZXJ0aWNlcztcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICog566A5Y2V5Y+Y5o2i6Zi25q6177ya5rKh5pyJ6YCa6L+H55+p6Zi16K6h566X77yM6ICM5piv566A5Y2V55qE55u45Ly85LiJ6KeS5b2i5Y6f55CG77yM5LiJ6KeS5Ye95pWw566X5Ye6TVZQ5Y+Y5o2i6Lef5bGP5bmV5pig5bCE77yM55CG6Kej6LW35p2l5q+U6L6D566A5Y2V77yM5L2G5q+P5Liq6aG254K56YO957uP6L+H5LuO5aS05Yiw5bC+55qE6K6h566X77yM5q+U6L6D6ICX5oCn6IO9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBFYXN5VmVydGV4UHJvY2Vzc2luZ1N0YWdlKHZlcnRpY2VzOiBWZWN0b3IzW10sIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgY2xpcFNwYWNlVmVydGljZXMgPSBuZXcgQXJyYXkodmVydGljZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgLy8g566A5Y2V5Y+Y5o2iXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdmVydGljZSA9IHZlcnRpY2VzW2ldLmNsb25lKCk7XHJcbiAgICAgICAgICAgIC8vIOWFiOWPmOaNou+8jOW/hemhu+S4peagvOaMieeFp+WFiOe8qeaUvu+8jOWGjeaXi+i9rO+8jOWGjeW5s+enu1xyXG4gICAgICAgICAgICB0aGlzLlNjYWxlVmVydGV4KHZlcnRpY2UsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHRoaXMuUm90YXRlVmVydGV4KHZlcnRpY2UsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlVmVydGV4KHZlcnRpY2UsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIC8vIOWGjeaKleW9sVxyXG4gICAgICAgICAgICBjbGlwU3BhY2VWZXJ0aWNlc1tpXSA9IHRoaXMuUHJvamVjdFZlcnRleCh2ZXJ0aWNlKTtcclxuICAgICAgICAgICAgLy8g5YaN6KeG5Y+j5pig5bCEXHJcbiAgICAgICAgICAgIHRoaXMuVmlld3BvcnRUb0NhbnZhcyhjbGlwU3BhY2VWZXJ0aWNlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xpcFNwYWNlVmVydGljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNjYWxlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2ZXJ0ZXgueCAqPSB0cmFuc2Zvcm0uc2NhbGUueDtcclxuICAgICAgICB2ZXJ0ZXgueSAqPSB0cmFuc2Zvcm0uc2NhbGUueTtcclxuICAgICAgICB2ZXJ0ZXgueiAqPSB0cmFuc2Zvcm0uc2NhbGUuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUm90YXRlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBldWxlckFuZ2xlcyA9IHRyYW5zZm9ybS5yb3RhdGlvbi5ldWxlckFuZ2xlcztcclxuXHJcbiAgICAgICAgY29uc3QgY29zWCA9IE1hdGguY29zKGV1bGVyQW5nbGVzLngpO1xyXG4gICAgICAgIGNvbnN0IHNpblggPSBNYXRoLnNpbihldWxlckFuZ2xlcy54KTtcclxuICAgICAgICBjb25zdCBjb3NZID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueSk7XHJcbiAgICAgICAgY29uc3Qgc2luWSA9IE1hdGguc2luKGV1bGVyQW5nbGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IGNvc1ogPSBNYXRoLmNvcyhldWxlckFuZ2xlcy56KTtcclxuICAgICAgICBjb25zdCBzaW5aID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueik7XHJcbiAgICAgICAgLy8g5YWI57uVWui9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHggPSB2ZXJ0ZXgueCAqIGNvc1ogLSB2ZXJ0ZXgueSAqIHNpblo7XHJcbiAgICAgICAgY29uc3QgeSA9IHZlcnRleC54ICogc2luWiArIHZlcnRleC55ICogY29zWjtcclxuICAgICAgICB2ZXJ0ZXgueCA9IHg7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5O1xyXG4gICAgICAgIC8vIOWGjee7lVnovbTml4vovaxcclxuICAgICAgICBjb25zdCB6ID0gdmVydGV4LnogKiBjb3NZIC0gdmVydGV4LnggKiBzaW5ZO1xyXG4gICAgICAgIGNvbnN0IHgyID0gdmVydGV4LnogKiBzaW5ZICsgdmVydGV4LnggKiBjb3NZO1xyXG4gICAgICAgIHZlcnRleC56ID0gejtcclxuICAgICAgICB2ZXJ0ZXgueCA9IHgyO1xyXG4gICAgICAgIC8vIOacgOWQjue7lVjovbTml4vovaxcclxuICAgICAgICBjb25zdCB5MiA9IHZlcnRleC55ICogY29zWCAtIHZlcnRleC56ICogc2luWDtcclxuICAgICAgICBjb25zdCB6MiA9IHZlcnRleC55ICogc2luWCArIHZlcnRleC56ICogY29zWDtcclxuICAgICAgICB2ZXJ0ZXgueSA9IHkyO1xyXG4gICAgICAgIHZlcnRleC56ID0gejI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRyYW5zbGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKz0gdHJhbnNmb3JtLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmVydGV4LnkgKz0gdHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmVydGV4LnogKz0gdHJhbnNmb3JtLnBvc2l0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOWJlOmZpOijgeWJqlxyXG5cclxuICAgIC8vIOinhumUpeS9k+WJlOmZpFxyXG4gICAgcHVibGljIEZydXN0dW1DdWxsaW5nKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyDog4zpnaLliZTpmaRcclxuICAgIHB1YmxpYyBCYWNrZmFjZUN1bGxpbmcoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOmBruaMoeWJlOmZpFxyXG4gICAgcHVibGljIE9jY2x1c2lvbkN1bGxpbmcoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDbGlwVHJpYW5nbGUodHJpYW5nbGU6IFZlY3RvcjNbXSkge1xyXG4gICAgICAgIC8vIDEu6K6h566X5LiJ6KeS5b2i55qE5Lit5b+DXHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICh0cmlhbmdsZVswXS54ICsgdHJpYW5nbGVbMV0ueCArIHRyaWFuZ2xlWzJdLngpIC8gMyxcclxuICAgICAgICAgICAgKHRyaWFuZ2xlWzBdLnkgKyB0cmlhbmdsZVsxXS55ICsgdHJpYW5nbGVbMl0ueSkgLyAzLFxyXG4gICAgICAgICAgICAodHJpYW5nbGVbMF0ueiArIHRyaWFuZ2xlWzFdLnogKyB0cmlhbmdsZVsyXS56KSAvIDNcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDnu5jliLbniankvZNcclxuXHJcbiAgICBwdWJsaWMgRHJhd09iamVjdChyZW5kZXJlcjogUmVuZGVyZXIpIHtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IChyZW5kZXJlciBhcyBNZXNoUmVuZGVyZXIpLm1lc2g7XHJcbiAgICAgICAgaWYgKCFtb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmRpY2VzID0gbW9kZWwuZmFjZXMuZmxhdE1hcChmYWNlID0+IGZhY2UudmVydGV4SW5kaWNlcyk7XHJcblxyXG4gICAgICAgIC8vIDEu5YmU6ZmkXHJcbiAgICAgICAgdGhpcy5GcnVzdHVtQ3VsbGluZygpO1xyXG4gICAgICAgIHRoaXMuQmFja2ZhY2VDdWxsaW5nKCk7XHJcbiAgICAgICAgdGhpcy5PY2NsdXNpb25DdWxsaW5nKCk7XHJcblxyXG4gICAgICAgIC8vIDIu5Y+Y5o2iXHJcbiAgICAgICAgLy8gTVZQ5Y+Y5o2iXHJcbiAgICAgICAgY29uc3Qgc2NyZWVuVmVydGljZXMgPSB0aGlzLlZlcnRleFByb2Nlc3NpbmdTdGFnZShtb2RlbC52ZXJ0aWNlcywgcmVuZGVyZXIudHJhbnNmb3JtKTtcclxuICAgICAgICAvLyDnroDljZVNVlDlj5jmjaJcclxuICAgICAgICAvLyBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IHRoaXMuRWFzeVZlcnRleFByb2Nlc3NpbmdTdGFnZShvYmopO1xyXG5cclxuICAgICAgICAvLyAzLuijgeWJqlxyXG5cclxuICAgICAgICAvLyA0LuWFieagheWMluS4juWDj+e0oOe7mOeUu1xyXG4gICAgICAgIC8vIOacgOWQjue7mOWItuS4ieinkuW9ouWIsOWxj+W5leS4ilxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICBjb25zdCBwMSA9IHNjcmVlblZlcnRpY2VzW2luZGljZXNbaV1dO1xyXG4gICAgICAgICAgICBjb25zdCBwMiA9IHNjcmVlblZlcnRpY2VzW2luZGljZXNbaSArIDFdXTtcclxuICAgICAgICAgICAgY29uc3QgcDMgPSBzY3JlZW5WZXJ0aWNlc1tpbmRpY2VzW2kgKyAyXV07XHJcblxyXG4gICAgICAgICAgICAvLyDnur/moYbmqKHlvI/vvIzmmoLkuI3mlK/mjIHpobbngrnoibJcclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhd01vZGUgPT09IERyYXdNb2RlLldpcmVmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGUocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZHJhd01vZGUgPT09IERyYXdNb2RlLlBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbChwMS54LCBwMS55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbChwMi54LCBwMi55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbChwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuU2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZShwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOW3peWFt+WHveaVsFxyXG5cclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyDnur/mgKfmj5LlgLxcclxuICAgIC8vLyDkvKDlhaUy5Liq54K577yM6L+U5Zue5a6D5Lus57uE5oiQ57q/5q6155qE5o+S5YC844CCXHJcbiAgICAvLy8g6KaB5rGC77yaXHJcbiAgICAvLy8gMS4g6KaB5YWI566X5Ye655u057q/5YGP5rC05bmz6L+Y5piv5Z6C55u077yM5aaC5p6c5piv5YGP5rC05bmz77yI5pac546H5bCP5LqOMe+8ie+8jOWImeS7pXjkuLrlvqrnjq/vvIzkvKDlhaXpobrluo/mmK8oeDEseTEseDIseTIp77yM5Y+N5LmL5aaC5p6c55u057q/5YGP5Z6C55u077yM5YiZ5pivKHkxLHgxLHkyLHgyKVxyXG4gICAgLy8vIDIuIOWQjOaXtuimgeehruS/nee6v+auteeCueeahOaWueWQkeaYr+S7juW3puW+gOWPs+aIluS7juS4iuW+gOS4i++8jOS+i+Wmgue6v+auteaYr+WBj+awtOW5s+eahOivne+8jOimgeehruS/nXgyPngx77yM5aaC5p6c5piv5YGP5Z6C55u055qE6K+d77yM6KaB56Gu5L+deTI+eTFcclxuICAgIC8vLyDkuL7kuKrkvovlrZDvvJpcclxuICAgIC8vLyDngrkoMCwgMCnlkowoMiwxKe+8jOS8oOWFpeeahOWPguaVsOaYrygwLCAwLCAyLCAxKe+8jOi/lOWbnueahOaYrygoMi0wKSsxPTMp5Liq5YC877yM6L+Z5Lqb5YC85piv5LuOKDAtMSnkuK3pl7Tmj5LlgLznmoTvvIzljbMoMCwgMC41LCAxKVxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIHByaXZhdGUgSW50ZXJwb2xhdGUoYTE6IG51bWJlciwgYjE6IG51bWJlciwgYTI6IG51bWJlciwgYjI6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgICAgICAvLyDpooTliIbphY3mlbDnu4TlpKflsI/ku6Xpgb/lhY3liqjmgIHmianlrrlcclxuICAgICAgICAvLyBjb25zdCBkeCA9IE1hdGguYWJzKE1hdGguZmxvb3IoYTIgLSBhMSkpO1xyXG4gICAgICAgIGNvbnN0IGR4ID0gKChhMiA+IGExID8gYTIgLSBhMSA6IGExIC0gYTIpIHwgMCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuICAgICAgICBjb25zdCBhID0gKGIyIC0gYjEpIC8gKGEyIC0gYTEpO1xyXG4gICAgICAgIGxldCBkID0gYjE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGR4OyBpKyspIHtcclxuICAgICAgICAgICAgdmFsdWVbaV0gPSBkO1xyXG4gICAgICAgICAgICBkICs9IGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vR2FtZU9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJvb3RHYW1lT2JqZWN0czogR2FtZU9iamVjdFtdID0gW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBhZGRHYW1lT2JqZWN0KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJvb3RHYW1lT2JqZWN0cy5wdXNoKGdhbWVPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgcmVtb3ZlR2FtZU9iamVjdChnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJvb3RHYW1lT2JqZWN0cy5pbmRleE9mKGdhbWVPYmplY3QpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290R2FtZU9iamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSb290R2FtZU9iamVjdHMoKTogR2FtZU9iamVjdFtdIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMucm9vdEdhbWVPYmplY3RzXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmm7TmlrDmiYDmnInmoLnmuLjmiI/lr7nosaHlj4rlhbblrZDlr7nosaFcclxuICAgICAgICBmb3IgKGNvbnN0IGdhbWVPYmplY3Qgb2YgdGhpcy5yb290R2FtZU9iamVjdHMpIHtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdC5zdGFydENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdC51cGRhdGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU2NlbmUgfSBmcm9tIFwiLi9TY2VuZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFNjZW5lTWFuYWdlcjtcclxuICAgIHByaXZhdGUgc2NlbmVzOiBNYXA8c3RyaW5nLCBTY2VuZT4gPSBuZXcgTWFwPHN0cmluZywgU2NlbmU+KCk7XHJcbiAgICBwcml2YXRlIGFjdGl2ZVNjZW5lOiBTY2VuZSB8IG51bGwgPSBudWxsO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaW5zdGFuY2UoKTogU2NlbmVNYW5hZ2VyIHtcclxuICAgICAgICBpZiAoIVNjZW5lTWFuYWdlci5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLl9pbnN0YW5jZSA9IG5ldyBTY2VuZU1hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFNjZW5lTWFuYWdlci5faW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBjcmVhdGVTY2VuZShuYW1lOiBzdHJpbmcpOiBTY2VuZSB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmUgPSBuZXcgU2NlbmUobmFtZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMuc2V0KG5hbWUsIHNjZW5lKTtcclxuICAgICAgICByZXR1cm4gc2NlbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRTY2VuZShuYW1lOiBzdHJpbmcpOiBTY2VuZSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NlbmVzLmdldChuYW1lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldEFjdGl2ZVNjZW5lKHNjZW5lOiBTY2VuZSB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2NlbmUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kU2NlbmUgPSB0aGlzLnNjZW5lcy5nZXQoc2NlbmUpO1xyXG4gICAgICAgICAgICBpZiAoZm91bmRTY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVTY2VuZSA9IGZvdW5kU2NlbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0QWN0aXZlU2NlbmUoKTogU2NlbmUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVTY2VuZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZUFjdGl2ZVNjZW5lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVNjZW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgTWF0cml4NHg0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaXg0eDRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVPYmplY3Q6IEdhbWVPYmplY3Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IEFycmF5PFRyYW5zZm9ybT47XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50OiBUcmFuc2Zvcm0gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RlbXBQb3M6IFZlY3RvcjM7XHJcbiAgICBwcml2YXRlIF90ZW1wUm90OiBRdWF0ZXJuaW9uO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFNjYWxlOiBWZWN0b3IzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgQXJyYXk8VHJhbnNmb3JtPigpO1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdGVtcFBvcyA9IFZlY3RvcjMuWkVSTztcclxuICAgICAgICB0aGlzLl90ZW1wUm90ID0gUXVhdGVybmlvbi5pZGVudGl0eTtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBWZWN0b3IzLk9ORTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGZNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFRSU01hdHJpeCh0aGlzLl90ZW1wUG9zLCB0aGlzLl90ZW1wUm90LCB0aGlzLl90ZW1wU2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbG9jYWxUb1dvcmxkTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubG9jYWxUb1dvcmxkTWF0cml4IDogTWF0cml4NHg0LmlkZW50aXR5O1xyXG4gICAgICAgIHJldHVybiBwLm11bHRpcGx5KHRoaXMuc2VsZk1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFRvTG9jYWxNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC53b3JsZFRvTG9jYWxNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZk1hdHJpeC5pbnZlcnNlKCkubXVsdGlwbHkocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB4KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHgoeDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB5KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHkoeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB6KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHooejogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnogPSB6O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmb3J3YXJkKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8v5oiR5Lus6KaB5b6X5Yiw55qE5piv5LiA5Liq5pa55ZCR77yM5Zug5q2k5LiN6ZyA6KaB5L2N572u5L+h5oGv77yM5bCG6b2Q5qyh5Z2Q5qCH55qEd+iuvue9ruS4ujDvvIzmipvlvIPmjonlnZDmoIfkv6Hmga9cclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuRk9SV0FSRCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1cCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuVVAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmlnaHQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLlJJR0hULCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUG9zLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwb3NpdGlvbihwb3M6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRQb3NpdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdGlvbigpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFJvdC5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24ocTogUXVhdGVybmlvbikge1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wU2NhbGUuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNjYWxlKHM6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBUcmFuc2Zvcm0gfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQocGFyZW50OiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAocGFyZW50ICE9IG51bGwgJiYgcGFyZW50ICE9IHRoaXMgJiYgcGFyZW50ICE9IHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77ya54i26IqC54K55piv5b2T5YmN6IqC54K555qE5a2Q6IqC54K577yM5bCG5a2Q6IqC55qE6K6+572u5Li66Ieq5bex55qE54i26IqC54K577yM5Lya5q275b6q546vXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzUGFyZW50KHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNldCBwYXJlbnQsIHRoaXMgbm9kZSBpcyB0aGUgcGFyZW50IG5vZGUncyBwYXJlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOW9k+WJjeiKgueCueacieeItuiKgueCue+8jOimgeWFiOenu+mZpOaXp+eahFxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBhcmVudCA9PSBudWxsICYmIHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/oioLngrlw5piv5ZCm5piv5b2T5YmN6IqC54K555qE5LiK57qnXHJcbiAgICBwdWJsaWMgaGFzUGFyZW50KHA6IFRyYW5zZm9ybSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgPT0gcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGFzUGFyZW50KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9IHRoaXMgJiYgIXRoaXMuY2hpbGRyZW4uaW5jbHVkZXMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77yaY2hpbGToioLngrnmmK/lvZPliY3oioLngrnnmoTniLboioLngrnvvIzlsIbniLboioLnmoTorr7nva7kuLroh6rlt7HnmoTlrZDoioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGFyZW50KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2hpbGQsIHRoaXMgbm9kZSBpcyB0aGUgY2hpbGQgbm9kZSdzIGNoaWxkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzlrZDoioLngrnmnInml6fnmoTniLboioLngrnvvIzopoHlhYjnp7vpmaRcclxuICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnljp/kuJbnlYzlnZDmoIfkvY3nva7vvIzlhYjmnJ3niLboioLngrnnmoTlj5jmjaLnmoTlj43mlrnlkJHnp7vliqjvvIznhLblkI7lho3mt7vliqDov5vljrvvvIzlsLHog73kv53mjIHkuJbnlYzlnZDmoIfkuI3lj5hcclxuICAgICAgICAgICAgICAgIC8v5Y2z5Y+Y5o2i5Yiw54i26IqC54K555qE6YCG55+p6Zi16YeMXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5KGNoaWxkLnNlbGZNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBQb3MgPSBtLmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBSb3QgPSBtLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBTY2FsZSA9IG0uZ2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUNoaWxkKGNoaWxkOiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQsIDApO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnkuJbnlYzlnZDmoIfvvIznm7TmjqXlsIbmnKzlnLDlnZDmoIfnrYnlkIzkuo7lvZPliY3kuJbnlYzlnZDmoIfljbPlj69cclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Ob2RlU3BhY2UodjogVmVjdG9yMywgdzogbnVtYmVyID0gMSk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICrlsIbmn5DkuKrlnZDmoIfovazliLDoh6rlt7HnmoTlsYDpg6jnqbrpl7TvvIzkvovlpoLlvZPliY3nmoTlsYDpg6jlnZDmoIfljp/ngrnlnKjkuJbnlYzlnZDmoIfnmoTvvIgx77yMMe+8ieWkhFxyXG4gICAgICAgICAq54K5cOWcqOS4lueVjOWdkOagh++8iDLvvIwx77yJ5aSE77yM6YKj5LmI5bCG54K5cOebuOWvueS6juW9k+WJjeWxgOmDqOWdkOagh+ezu+eahOS9jee9ruWwseaYr++8iDLvvIwx77yJLe+8iDHvvIwx77yJPSDvvIgx77yMIDDvvIlcclxuICAgICAgICAgKuWNs+WwhueCuXDlj43lkJHlj5jmjaLlvZPliY3nmoTnn6npmLUgXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2LCB3KSkudmVjdG9yMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udmVydFRvV29ybGRTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2LCB3KSkudmVjdG9yMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveShkZXN0cm95Q2hpbGRyZW46IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKGRlc3Ryb3lDaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveShkZXN0cm95Q2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IE9CSk1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XHJcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tIFwiLi9EaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IE9CSlBhcnNlciB9IGZyb20gXCIuL09ialBhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0TG9hZGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZpbGVDYWNoZTogRGljdGlvbmFyeSA9IG5ldyBEaWN0aW9uYXJ5KCk7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkSW1hZ2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4oKHJlc29sdmUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHRoZSBpbWFnZSBvYmplY3QnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIG9uIGxvYWRpbmcgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCBpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOi3qOWMuuivt+axglxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY3Jvc3NPcmlnaW4gPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRlbGwgdGhlIGJyb3dzZXIgdG8gbG9hZCBhbiBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZU5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRUZXh0RmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgcmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTW9kZWxGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPE9CSkRvYz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxPQkpEb2M+KChyZXNvbHZlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmpEb2MgPSBuZXcgT0JKRG9jKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCBvYmpEb2MucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQsIDEsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPQkogZmlsZSBwYXJzaW5nIGVycm9yOiBcIiArIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgb2JqRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5LiN6KaB5byA5ZCv5byC5q2l77yM6K6+572u5Li6ZmFsc2XvvIzlkKbliJnlrrnmmJPljaHlnKhyZWFkeVN0YXRlID0gMe+8jOWOn+WboOS4jeaYjlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIGZpbGVOYW1lLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRNb2RlbChuYW1lOiBzdHJpbmcsIG1vZGVsUGF0aDogc3RyaW5nLCBzY2FsZTogbnVtYmVyID0gMSwgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxPQkpNb2RlbCB8IG51bGw+IHtcclxuICAgICAgICBsZXQgbW9kZWw6IE9CSk1vZGVsIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgdmFyIG9iakRvYyA9IGF3YWl0IEFzc2V0TG9hZGVyLmxvYWRUZXh0RmlsZShtb2RlbFBhdGgpO1xyXG5cclxuICAgICAgICBpZiAob2JqRG9jICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbW9kZWwgPSBPQkpQYXJzZXIucGFyc2VPQkoob2JqRG9jKTtcclxuICAgICAgICAgICAgLy8g6L6T5Ye657uf6K6h5L+h5oGvXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE9CSlBhcnNlci5nZXRNb2RlbFN0YXRzKG1vZGVsKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB2YXIgb2JqcyA9IG9iakRvYy5nZXRPYmpzKHNjYWxlLCByZXZlcnNlKTtcclxuICAgICAgICAgICAgLy8gb2Jqcy5mb3JFYWNoKGFzeW5jIG9iaiA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICAvL3RvZG865Li05q275YaZ5q2777yM5Y+q5Yqg6L295ryr5Y+N5bCE6LS05Zu+XHJcbiAgICAgICAgICAgIC8vICAgICAvLyBpZiAob2JqLm1hdGVyaWFsICE9IG51bGwgJiYgb2JqLm1hdGVyaWFsLm1hcF9LZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyAgICAgcmVuZGVyLm1hdGVyaWFsLmNyZWF0ZVRleHR1cmUob2JqLm1hdGVyaWFsLm1hcF9LZCk7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vICAgICB2YXIgbW9kZWwgPSBuZXcgTW9kZWwoKTtcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwudmVydGljZXMgPSBvYmoudmVydGljZXM7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5pbmRpY2VzID0gb2JqLmluZGljZXM7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC51dnMgPSBvYmoudXZzO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwubm9ybWFscyA9IG9iai5ub3JtYWxzO1xyXG4gICAgICAgICAgICAvLyAgICAgaW5zdGFuY2UubW9kZWwucHVzaChtb2RlbCk7XHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgRGljdGlvbmFyeSB7XHJcblxyXG4gIGl0ZW1zOiBvYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pdGVtcykubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgaGFzKGtleTogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xyXG4gIH1cclxuXHJcbiAgc2V0KGtleTogYW55LCB2YWw6IGFueSkge1xyXG4gICAgdGhpcy5pdGVtc1trZXldID0gdmFsO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlKGtleTogYW55KTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5oYXMoa2V5KSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5pdGVtc1trZXldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGtleTogYW55KTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLmhhcyhrZXkpID8gdGhpcy5pdGVtc1trZXldIDogdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0ge307XHJcbiAgfVxyXG5cclxuICB2YWx1ZXMoKTogYW55W10ge1xyXG4gICAgbGV0IHZhbHVlczogYW55W10gPSBbXTtcclxuICAgIGZvciAobGV0IGsgaW4gdGhpcy5pdGVtcykge1xyXG4gICAgICBpZiAodGhpcy5oYXMoaykpIHtcclxuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLml0ZW1zW2tdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9XHJcblxyXG4gIGZvckVhY2goZnVuKSB7XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgZnVuKGssIHRoaXMuaXRlbXNba10pO1xyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tICcuLi9NYXRoL1ZlY3RvcjMnO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSAnLi4vTWF0aC9WZWN0b3IyJztcclxuaW1wb3J0IHsgRmFjZSwgT0JKTW9kZWwgfSBmcm9tICcuLi9Nb2RlbCc7XHJcblxyXG4vKipcclxuICogT0JK5paH5Lu26Kej5p6Q5Zmo57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT0JKUGFyc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6QT0JK5paH5Lu2XHJcbiAgICAgKiBAcGFyYW0gZmlsZUNvbnRlbnQgT0JK5paH5Lu25YaF5a65XHJcbiAgICAgKiBAcmV0dXJucyDop6PmnpDlkI7nmoRPQkrmqKHlnovmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwYXJzZU9CSihmaWxlQ29udGVudDogc3RyaW5nKTogT0JKTW9kZWwge1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gZmlsZUNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQ6IE9CSk1vZGVsID0ge1xyXG4gICAgICAgICAgICB2ZXJ0aWNlczogW10sXHJcbiAgICAgICAgICAgIHRleHR1cmVDb29yZHM6IFtdLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhOb3JtYWxzOiBbXSxcclxuICAgICAgICAgICAgZmFjZXM6IFtdLFxyXG4gICAgICAgICAgICBtYXRlcmlhbHM6IHt9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50TWF0ZXJpYWwgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRMaW5lID0gbGluZS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDot7Pov4fnqbrooYzlkozms6jph4pcclxuICAgICAgICAgICAgaWYgKCF0cmltbWVkTGluZSB8fCB0cmltbWVkTGluZS5zdGFydHNXaXRoKCcjJykpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGluZVBhcnRzID0gdHJpbW1lZExpbmUuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgY29uc3Qga2V5d29yZCA9IGxpbmVQYXJ0c1swXTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5d29yZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndic6IC8vIOmhtueCueWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gbmV3IFZlY3RvcjMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZlcnRpY2VzLnB1c2godmVydGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndnQnOiAvLyDnurnnkIblnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleENvb3JkID0gbmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1sxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGxpbmVQYXJ0c1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRleHR1cmVDb29yZHMucHVzaCh0ZXhDb29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3ZuJzogLy8g6aG254K55rOV57q/XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3JtYWwgPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmVydGV4Tm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2YnOiAvLyDpnaLlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2U6IEZhY2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVJbmRpY2VzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbEluZGljZXM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDpnaLnmoTmr4/kuKrpobbngrnlrprkuYlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lUGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleERlZiA9IGxpbmVQYXJ0c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIF244CBdi92dOOAgXYvL3Zu44CBdi92dC92buetieWkmuenjeagvOW8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UGFydHMgPSB2ZXJ0ZXhEZWYuc3BsaXQoJy8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpobbngrnntKLlvJXvvIhPQkrntKLlvJXku44x5byA5aeL77yM6ZyA6KaB6L2s5o2i5Li65LuOMOW8gOWni++8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS52ZXJ0ZXhJbmRpY2VzLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMF0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g57q555CG5Z2Q5qCH57Si5byV77yI5Y+v6YCJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMV0gJiYgdmVydGV4UGFydHNbMV0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS50ZXh0dXJlSW5kaWNlcyEucHVzaChwYXJzZUludCh2ZXJ0ZXhQYXJ0c1sxXSkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDms5Xnur/ntKLlvJXvvIjlj6/pgInvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1syXSAmJiB2ZXJ0ZXhQYXJ0c1syXSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLm5vcm1hbEluZGljZXMhLnB1c2gocGFyc2VJbnQodmVydGV4UGFydHNbMl0pIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaciee6ueeQhuaIluazlee6v+e0ouW8le+8jOa4heepuuaVsOe7hOS7peS/neaMgeaVsOaNruaVtOa0gVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2UudGV4dHVyZUluZGljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2Uubm9ybWFsSW5kaWNlcyEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZhY2Uubm9ybWFsSW5kaWNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5re75Yqg5p2Q6LSo5L+h5oGv77yI5aaC5p6c5pyJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UubWF0ZXJpYWxOYW1lID0gY3VycmVudE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZmFjZXMucHVzaChmYWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbXRsbGliJzogLy8g5p2Q6LSo5bqT5byV55SoXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbExpYk5hbWUgPSBsaW5lUGFydHNbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWunumZheW6lOeUqOS4remcgOimgeWKoOi9veW5tuino+aekOWvueW6lOeahC5tdGzmlofku7ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWPkeeOsOadkOi0qOW6k+W8leeUqDogJHttYXRlcmlhbExpYk5hbWV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VzZW10bCc6IC8vIOS9v+eUqOadkOi0qFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE1hdGVyaWFsID0gbGluZVBhcnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJbmnZDotKjorrDlvZXvvIjlrp7pmYXkvb/nlKjml7bpnIDopoHku44ubXRs5paH5Lu25Yqg6L295a6M5pW05L+h5oGv77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm1hdGVyaWFsc1tjdXJyZW50TWF0ZXJpYWxdID0geyBuYW1lOiBjdXJyZW50TWF0ZXJpYWwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlj6/ku6Xmt7vliqDmm7TlpJpPQkrmoLzlvI/lhbPplK7lrZfnmoTlpITnkIZcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5b+955Wl5LiN5pSv5oyB55qE5YWz6ZSu5a2XXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbop6PmnpDlkI7nmoTmqKHlnovmlbDmja7ovazmjaLkuLpKU09O5a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyBKU09O5a2X56ym5LiyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9KU09OKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1vZGVsLCBudWxsLCAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaooeWei+e7n+iuoeS/oeaBr1xyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMg57uf6K6h5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TW9kZWxTdGF0cyhtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVDb3VudCA9IG1vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbENvdW50ID0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoVGV4dHVyZXMgPSBtb2RlbC5mYWNlcy5maWx0ZXIoZmFjZSA9PiBmYWNlLnRleHR1cmVJbmRpY2VzKS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgZmFjZXNXaXRoTm9ybWFscyA9IG1vZGVsLmZhY2VzLmZpbHRlcihmYWNlID0+IGZhY2Uubm9ybWFsSW5kaWNlcykubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gYFxyXG7mqKHlnovnu5/orqHkv6Hmga86XHJcbi0g6aG254K55pWwOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aH1cclxuLSDnurnnkIblnZDmoIfmlbA6ICR7dGV4dHVyZUNvdW50fVxyXG4tIOazlee6v+WQkemHj+aVsDogJHtub3JtYWxDb3VudH1cclxuLSDpnaLmlbA6ICR7bW9kZWwuZmFjZXMubGVuZ3RofVxyXG4tIOW4pue6ueeQhueahOmdojogJHtmYWNlc1dpdGhUZXh0dXJlc31cclxuLSDluKbms5Xnur/nmoTpnaI6ICR7ZmFjZXNXaXRoTm9ybWFsc31cclxuLSDmnZDotKjmlbA6ICR7T2JqZWN0LmtleXMobW9kZWwubWF0ZXJpYWxzKS5sZW5ndGh9XHJcbiAgICAgICAgYC50cmltKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpqozor4Hop6PmnpDmlbDmja7nmoTlrozmlbTmgKdcclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIOmqjOivgee7k+aenOa2iOaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlTW9kZWwobW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIC8vIOajgOafpemdoue0ouW8leaYr+WQpui2iueVjFxyXG4gICAgICAgIGZvciAoY29uc3QgZmFjZSBvZiBtb2RlbC5mYWNlcykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZlcnRleEluZGV4IG9mIGZhY2UudmVydGV4SW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleEluZGV4IDwgMCB8fCB2ZXJ0ZXhJbmRleCA+PSBtb2RlbC52ZXJ0aWNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg6aG254K557Si5byV6LaK55WMOiAke3ZlcnRleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnZlcnRpY2VzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS50ZXh0dXJlSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZXhJbmRleCBvZiBmYWNlLnRleHR1cmVJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleEluZGV4IDwgMCB8fCB0ZXhJbmRleCA+PSBtb2RlbC50ZXh0dXJlQ29vcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg57q555CG5Z2Q5qCH57Si5byV6LaK55WMOiAke3RleEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoIC0gMX0pYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmFjZS5ub3JtYWxJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vcm1hbEluZGV4IG9mIGZhY2Uubm9ybWFsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxJbmRleCA8IDAgfHwgbm9ybWFsSW5kZXggPj0gbW9kZWwudmVydGV4Tm9ybWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYOazlee6v+e0ouW8lei2iueVjDogJHtub3JtYWxJbmRleH0gKOacgOWkpzogJHttb2RlbC52ZXJ0ZXhOb3JtYWxzLmxlbmd0aCAtIDF9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwIFxyXG4gICAgICAgICAgICA/IGDlj5HnjrAgJHtlcnJvcnMubGVuZ3RofSDkuKrplJnor686XFxuJHtlcnJvcnMuam9pbignXFxuJyl9YFxyXG4gICAgICAgICAgICA6ICfmqKHlnovmlbDmja7pqozor4HpgJrov4cnO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBTY2VuZU1hbmFnZXIgfSBmcm9tIFwiLi9TY2VuZS9TY2VuZU1hbmFnZXJcIjtcclxuaW1wb3J0IHsgUmFzdGVyaXphdGlvblBpcGVsaW5lIH0gZnJvbSBcIi4vUmFzdGVyaXphdGlvblBpcGVsaW5lXCI7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vSW5wdXRcIjtcclxuaW1wb3J0IHsgQXNzZXRMb2FkZXIgfSBmcm9tIFwiLi9VdGlscy9Bc3NldExvYWRlclwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IENhbWVyYSB9IGZyb20gXCIuL0NvbXBvbmVudC9DYW1lcmFcIjtcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9Db21wb25lbnQvUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgTWVzaFJlbmRlcmVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L01lc2hSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBPYmpSb3RhdGUgfSBmcm9tIFwiLi9Db21wb25lbnQvT2JqUm90YXRlXCI7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuXHJcbi8vIOW9k0RPTeWGheWuueWKoOi9veWujOaIkOWQjuaJp+ihjFxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8g6I635Y+WY2FudmFz5YWD57Sg5ZKMMkTmuLLmn5PkuIrkuIvmlodcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIC8vIOiuvue9rmNhbnZhc+WwuuWvuFxyXG4gICAgY2FudmFzLndpZHRoID0gQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IENvbmZpZy5jYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgLy8g6K6+572u5paH5pys5qC35byPXHJcbiAgICBjdHguZm9udCA9ICdBcmlhbCc7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xyXG5cclxuICAgIC8vIOWIm+W7uuWbvuWDj+aVsOaNruWvueixoVxyXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YShDb25maWcuY2FudmFzV2lkdGgsIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFJhc3Rlcml6YXRpb25QaXBlbGluZSh1aW50MzJWaWV3KTtcclxuXHJcbiAgICBJbml0KCk7XHJcblxyXG4gICAgLy8g5riy5p+T5Ye95pWwXHJcbiAgICBmdW5jdGlvbiBtYWluTG9vcCgpIHtcclxuICAgICAgICAvLyDlpITnkIbpgLvovpFcclxuICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICAvLyDmuLLmn5NcclxuICAgICAgICBSZW5kZXIocGlwZWxpbmUpO1xyXG4gICAgICAgIC8vIOWwhuWbvuWDj+aVsOaNrue7mOWItuWIsGNhbnZhc+S4ilxyXG4gICAgICAgIGN0eC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAvLyDor7fmsYLkuIvkuIDluKfliqjnlLtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbkxvb3ApO1xyXG4gICAgICAgIC8vIOWxj+W5lei+k+WHuuaXpeW/l1xyXG4gICAgICAgIExvZ2dlci5wcmludExvZ3MoY3R4KTtcclxuICAgIH1cclxuICAgIC8vIOW8gOWni+WKqOeUu+W+queOr1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxufSk7XHJcblxyXG4vLyDojrflj5bpvKDmoIfkuovku7ZcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAvLyDojrflj5bpvKDmoIfnm7jlr7nkuo5jYW52YXPnmoTlnZDmoIdcclxuICAgIGNvbnN0IHJlY3QgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgICBJbnB1dC5tb3VzZVggPSBtb3VzZVg7XHJcbiAgICBJbnB1dC5tb3VzZVkgPSBtb3VzZVk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIElucHV0LmRlbHRhWSA9IGV2ZW50LmRlbHRhWTtcclxuICAgIGNvbnNvbGUubG9nKGV2ZW50LmRlbHRhWSk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsZW5kJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBJbnB1dC5kZWx0YVkgPSAwO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICAvLyDliJ3lp4vljJblnLrmma9cclxuICAgIGNvbnN0IG1haW5TY2VuZSA9IFNjZW5lTWFuYWdlci5pbnN0YW5jZS5jcmVhdGVTY2VuZShcIk1haW5TY2VuZVwiKTtcclxuICAgIFNjZW5lTWFuYWdlci5pbnN0YW5jZS5zZXRBY3RpdmVTY2VuZShtYWluU2NlbmUpO1xyXG5cclxuICAgIC8vIOebuOaculxyXG4gICAgY29uc3QgY2FtZXJhID0gbmV3IEdhbWVPYmplY3QoXCJjYW1lcmFcIik7XHJcbiAgICBtYWluU2NlbmUuYWRkR2FtZU9iamVjdChjYW1lcmEpO1xyXG4gICAgY2FtZXJhLmFkZENvbXBvbmVudChDYW1lcmEpO1xyXG5cclxuICAgIGxldCBsZWU6IEdhbWVPYmplY3Q7XHJcbiAgICAvLyDliqDovb3mqKHlnotcclxuICAgIEFzc2V0TG9hZGVyLmxvYWRNb2RlbCgnbGVlJywgJ3Jlc291cmNlcy9hc3NldHMvbWVzaGVzL2xlZS5vYmonKS50aGVuKChtb2RlbCkgPT4ge1xyXG4gICAgICAgIGxlZSA9IG5ldyBHYW1lT2JqZWN0KFwibGVlXCIpO1xyXG4gICAgICAgIGxlZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAyKTtcclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IGxlZS5hZGRDb21wb25lbnQoTWVzaFJlbmRlcmVyKTtcclxuICAgICAgICByZW5kZXJlci5tZXNoID0gbW9kZWw7XHJcbiAgICAgICAgbGVlLmFkZENvbXBvbmVudChPYmpSb3RhdGUpO1xyXG4gICAgICAgIG1haW5TY2VuZS5hZGRHYW1lT2JqZWN0KGxlZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBBc3NldExvYWRlci5sb2FkTW9kZWwoJ2N1YmUnLCAncmVzb3VyY2VzL2N1YmUub2JqJykudGhlbigobW9kZWwpID0+IHtcclxuICAgICAgICBjb25zdCBjdWJlID0gbmV3IEdhbWVPYmplY3QoXCJjdWJlXCIpO1xyXG4gICAgICAgIGN1YmUudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMiwgMCwgMCk7XHJcbiAgICAgICAgY3ViZS50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yMygwLjEsIDAuMSwgMC4xKTtcclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IGN1YmUuYWRkQ29tcG9uZW50KE1lc2hSZW5kZXJlcik7XHJcbiAgICAgICAgcmVuZGVyZXIubWVzaCA9IG1vZGVsO1xyXG4gICAgICAgIGN1YmUuYWRkQ29tcG9uZW50KE9ialJvdGF0ZSk7XHJcbiAgICAgICAgY3ViZS50cmFuc2Zvcm0uc2V0UGFyZW50KGxlZS50cmFuc2Zvcm0sIGZhbHNlKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBVcGRhdGUoKSB7XHJcbiAgICAvLyDkvb/nlKjlnLrmma/nmoR1cGRhdGXmlrnms5Xmm7TmlrDmiYDmnInmuLjmiI/lr7nosaFcclxuICAgIFNjZW5lTWFuYWdlci5pbnN0YW5jZS5nZXRBY3RpdmVTY2VuZSgpPy51cGRhdGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gUmVuZGVyKHBpcGVsaW5lOiBSYXN0ZXJpemF0aW9uUGlwZWxpbmUpIHtcclxuICAgIHBpcGVsaW5lLkNsZWFyKENvbG9yLkJMQUNLKTtcclxuXHJcbiAgICAvLyDojrflj5blnLrmma/kuK3nmoTmiYDmnInmoLnmuLjmiI/lr7nosaHlubbmuLLmn5NcclxuICAgIGNvbnN0IHJvb3RPYmplY3RzID0gU2NlbmVNYW5hZ2VyLmluc3RhbmNlLmdldEFjdGl2ZVNjZW5lKCk/LmdldFJvb3RHYW1lT2JqZWN0cygpO1xyXG4gICAgaWYgKHJvb3RPYmplY3RzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBnYW1lT2JqZWN0IG9mIHJvb3RPYmplY3RzKSB7XHJcbiAgICAgICAgICAgIC8vIOaYvuW8j+aMh+Wumuexu+Wei+WPguaVsFxyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJzID0gZ2FtZU9iamVjdC5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihSZW5kZXJlcik7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVuZGVyIG9mIHJlbmRlcnMpIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lLkRyYXdPYmplY3QocmVuZGVyKTtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2cocmVuZGVyLmdhbWVPYmplY3QubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=
