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
var Input_1 = require("../Input");
var Component_1 = require("./Component");
var ObjRotate = /** @class */ (function (_super) {
    __extends(ObjRotate, _super);
    function ObjRotate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angle = 0;
        return _this;
    }
    ObjRotate.prototype.update = function () {
        // 键盘输入
        if (Input_1.Input.GetKey(Input_1.Input.KeyCode.W)) {
            // 向前移动
            this.transform.position.z += 0.1;
        }
        if (Input_1.Input.GetKeyDown(Input_1.Input.KeyCode.Space)) {
            // 空格键被按下，执行跳跃
            console.log("跳跃!");
        }
        // 鼠标输入
        if (Input_1.Input.GetMouseButtonDown(0)) {
            // 鼠标左键被按下，执行射击
            console.log("射击!");
        }
        // 鼠标位置
        //console.log(`鼠标位置: (${Input.mouseX}, ${Input.mouseY})`);
        // 鼠标滚轮
        if (Input_1.Input.deltaY !== 0) {
            // 缩放
            var zoomFactor = Input_1.Input.deltaY > 0 ? 0.9 : 1.1;
            this.transform.scale.multiply(zoomFactor);
        }
        // 触摸输入
        if (Input_1.Input.touchCount > 0) {
            var touch = Input_1.Input.GetTouch(0);
            if (touch) {
                console.log("\u89E6\u6478\u4F4D\u7F6E: (" + touch.position.x + ", " + touch.position.y + ")");
            }
        }
        // if (this.gameObject.name == "cube") {
        //     // 使用sin函数实现缩放在0.9到1.1之间循环
        //     const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
        //     const scale = this.transform.scale;
        //     scale.x = scaleOffset;
        //     scale.y = scaleOffset;
        //     scale.z = scaleOffset;
        //     this.transform.scale = scale;
        //     this.transform.rotation = Quaternion.angleAxis(this.angle, Vector3.FORWARD);
        //     this.angle += 1;
        //     return;
        // }
        // // 让物体在所有轴上旋转
        // this.transform.rotation = Quaternion.angleAxis(this.angle, Vector3.UP);
        // this.angle += 1;
    };
    return ObjRotate;
}(Component_1.Component));
exports.ObjRotate = ObjRotate;
},{"../Input":9,"./Component":3}],6:[function(require,module,exports){
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.TouchPhase = exports.Input = void 0;
var Input = /** @class */ (function () {
    function Input() {
    }
    // 初始化输入系统
    Input.initialize = function () {
        // 键盘事件
        document.addEventListener('keydown', function (event) {
            Input.currentKeys.set(event.code, true);
        });
        document.addEventListener('keyup', function (event) {
            Input.currentKeys.set(event.code, false);
        });
        // 鼠标事件
        document.addEventListener('mousedown', function (event) {
            if (event.button >= 0 && event.button < 3) {
                Input.currentMouseButtons[event.button] = true;
            }
        });
        document.addEventListener('mouseup', function (event) {
            if (event.button >= 0 && event.button < 3) {
                Input.currentMouseButtons[event.button] = false;
            }
        });
        document.addEventListener('mousemove', function (event) {
            var canvas = document.getElementById('canvas');
            var rect = canvas.getBoundingClientRect();
            Input.mouseX = event.clientX - rect.left;
            Input.mouseY = event.clientY - rect.top;
        });
        document.addEventListener('wheel', function (event) {
            Input.deltaY = event.deltaY;
        });
        document.addEventListener('scrollend', function () {
            Input.deltaY = 0;
        });
        // 触摸事件
        document.addEventListener('touchstart', function (event) {
            Input.updateTouches(event.touches);
        });
        document.addEventListener('touchmove', function (event) {
            Input.updateTouches(event.touches);
        });
        document.addEventListener('touchend', function (event) {
            Input.updateTouches(event.touches);
        });
        document.addEventListener('touchcancel', function (event) {
            Input.updateTouches(event.touches);
        });
    };
    // 更新输入状态（在每帧开始时调用）
    Input.update = function () {
        // 更新键盘状态
        Input.previousKeys = new Map(Input.currentKeys);
        // 更新鼠标状态
        Input.previousMouseButtons = __spreadArrays(Input.currentMouseButtons);
    };
    // 键盘输入检测
    // 检查按键是否被按下（持续触发）
    Input.GetKey = function (keyCode) {
        return Input.currentKeys.get(keyCode) === true;
    };
    // 检查按键是否在当前帧被按下（仅一帧触发）
    Input.GetKeyDown = function (keyCode) {
        return Input.currentKeys.get(keyCode) === true && Input.previousKeys.get(keyCode) !== true;
    };
    // 检查按键是否在当前帧被释放（仅一帧触发）
    Input.GetKeyUp = function (keyCode) {
        return Input.currentKeys.get(keyCode) !== true && Input.previousKeys.get(keyCode) === true;
    };
    // 鼠标输入检测
    // 检查鼠标按钮是否被按下（持续触发）
    Input.GetMouseButton = function (button) {
        return button >= 0 && button < 3 ? Input.currentMouseButtons[button] : false;
    };
    // 检查鼠标按钮是否在当前帧被按下（仅一帧触发）
    Input.GetMouseButtonDown = function (button) {
        return button >= 0 && button < 3 ?
            (Input.currentMouseButtons[button] && !Input.previousMouseButtons[button]) : false;
    };
    // 检查鼠标按钮是否在当前帧被释放（仅一帧触发）
    Input.GetMouseButtonUp = function (button) {
        return button >= 0 && button < 3 ?
            (!Input.currentMouseButtons[button] && Input.previousMouseButtons[button]) : false;
    };
    // 触摸输入检测
    // 更新触摸状态
    Input.updateTouches = function (touchList) {
        Input.touches = [];
        for (var i = 0; i < touchList.length; i++) {
            var touch = touchList[i];
            var canvas = document.getElementById('canvas');
            var rect = canvas.getBoundingClientRect();
            Input.touches.push({
                fingerId: touch.identifier,
                position: {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                },
                deltaPosition: { x: 0, y: 0 },
                phase: TouchPhase.Moved,
                tapCount: 1 // 简化实现
            });
        }
    };
    // 获取指定索引的触摸
    Input.GetTouch = function (index) {
        return index >= 0 && index < Input.touches.length ? Input.touches[index] : null;
    };
    Object.defineProperty(Input, "touchCount", {
        // 获取触摸数量
        get: function () {
            return Input.touches.length;
        },
        enumerable: false,
        configurable: true
    });
    // 键盘状态
    Input.currentKeys = new Map();
    Input.previousKeys = new Map();
    // 鼠标状态
    Input.currentMouseButtons = [false, false, false]; // 左、中、右键
    Input.previousMouseButtons = [false, false, false];
    Input.mouseX = 0;
    Input.mouseY = 0;
    Input.deltaY = 0; // 鼠标滚轮
    // 触摸状态
    Input.touches = [];
    // 按键常量
    Input.KeyCode = {
        // 字母键
        A: 'KeyA', B: 'KeyB', C: 'KeyC', D: 'KeyD', E: 'KeyE', F: 'KeyF', G: 'KeyG',
        H: 'KeyH', I: 'KeyI', J: 'KeyJ', K: 'KeyK', L: 'KeyL', M: 'KeyM', N: 'KeyN',
        O: 'KeyO', P: 'KeyP', Q: 'KeyQ', R: 'KeyR', S: 'KeyS', T: 'KeyT', U: 'KeyU',
        V: 'KeyV', W: 'KeyW', X: 'KeyX', Y: 'KeyY', Z: 'KeyZ',
        // 数字键
        Alpha0: 'Digit0', Alpha1: 'Digit1', Alpha2: 'Digit2', Alpha3: 'Digit3', Alpha4: 'Digit4',
        Alpha5: 'Digit5', Alpha6: 'Digit6', Alpha7: 'Digit7', Alpha8: 'Digit8', Alpha9: 'Digit9',
        // 功能键
        F1: 'F1', F2: 'F2', F3: 'F3', F4: 'F4', F5: 'F5', F6: 'F6',
        F7: 'F7', F8: 'F8', F9: 'F9', F10: 'F10', F11: 'F11', F12: 'F12',
        // 特殊键
        Space: 'Space',
        Enter: 'Enter',
        Tab: 'Tab',
        Escape: 'Escape',
        Backspace: 'Backspace',
        Shift: 'ShiftLeft',
        Control: 'ControlLeft',
        Alt: 'AltLeft',
        CapsLock: 'CapsLock',
        // 方向键
        UpArrow: 'ArrowUp',
        DownArrow: 'ArrowDown',
        LeftArrow: 'ArrowLeft',
        RightArrow: 'ArrowRight'
    };
    return Input;
}());
exports.Input = Input;
// 触摸阶段枚举
var TouchPhase;
(function (TouchPhase) {
    TouchPhase[TouchPhase["Began"] = 0] = "Began";
    TouchPhase[TouchPhase["Moved"] = 1] = "Moved";
    TouchPhase[TouchPhase["Stationary"] = 2] = "Stationary";
    TouchPhase[TouchPhase["Ended"] = 3] = "Ended";
    TouchPhase[TouchPhase["Canceled"] = 4] = "Canceled";
})(TouchPhase = exports.TouchPhase || (exports.TouchPhase = {}));
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
    // 初始化输入系统
    Input_1.Input.initialize();
    InitScene();
    // 渲染函数
    function mainLoop() {
        // 更新输入状态
        Input_1.Input.update();
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
function InitScene() {
    // 初始化场景
    var mainScene = SceneManager_1.SceneManager.instance.createScene("MainScene");
    SceneManager_1.SceneManager.instance.setActiveScene(mainScene);
    // 相机
    var camera = new GameObject_1.GameObject("camera");
    mainScene.addGameObject(camera);
    camera.addComponent(Camera_1.Camera);
    //camera.addComponent(CameraController);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvQ29tcG9uZW50L0NhbWVyYS50cyIsInNyYy9Db21wb25lbnQvQ29tcG9uZW50LnRzIiwic3JjL0NvbXBvbmVudC9NZXNoUmVuZGVyZXIudHMiLCJzcmMvQ29tcG9uZW50L09ialJvdGF0ZS50cyIsInNyYy9Db21wb25lbnQvUmVuZGVyZXIudHMiLCJzcmMvQ29uZmlnLnRzIiwic3JjL0dhbWVPYmplY3QudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTG9nZ2VyLnRzIiwic3JjL01hdGgvTWF0cml4NHg0LnRzIiwic3JjL01hdGgvUXVhdGVybmlvbi50cyIsInNyYy9NYXRoL1ZlY3RvcjIudHMiLCJzcmMvTWF0aC9WZWN0b3IzLnRzIiwic3JjL01hdGgvVmVjdG9yNC50cyIsInNyYy9SYXN0ZXJpemF0aW9uUGlwZWxpbmUudHMiLCJzcmMvU2NlbmUvU2NlbmUudHMiLCJzcmMvU2NlbmUvU2NlbmVNYW5hZ2VyLnRzIiwic3JjL1RyYW5zZnJvbS50cyIsInNyYy9VdGlscy9Bc3NldExvYWRlci50cyIsInNyYy9VdGlscy9EaWN0aW9uYXJ5LnRzIiwic3JjL1V0aWxzL09ialBhcnNlci50cyIsInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBO0lBa0JJLGVBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBZTtRQUFmLGtCQUFBLEVBQUEsT0FBZTtRQUN4RCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTSx3QkFBUSxHQUFmO1FBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElB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QUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsQ0FBVTtRQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXBCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRFLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVNLGdDQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNwQixPQUFPLElBQUksaUJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsNkJBQTZCO0lBRTdCLGdEQUFnRDtJQUNoRCxnR0FBZ0c7SUFDaEcsZ0RBQWdEO0lBRWhELG1GQUFtRjtJQUNuRixJQUFJO0lBRUcsNkJBQVMsR0FBaEI7UUFDSSxzQkFBc0I7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUV6QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhDQUE4QztRQUM3RixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFVixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBQywyQkFBMkI7WUFDdkMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQzthQUFNO1lBQ0gsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hELENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckM7aUJBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM5QixDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNO2dCQUNILENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO1NBQ0o7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7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QUFDLE1BQU0sQ0FBQztRQUN2QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVuRCxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDeEIsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMxQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFekIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsRUFBRTtZQUMzQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ25DO2FBQU07WUFDSCxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFTSw0QkFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUV0QixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRSxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFTSw2QkFBUyxHQUFoQjtRQUNJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsSUFBSSxFQUFFLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFD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QUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRCLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBRW5DLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztRQUUxRyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQzVELGVBQWU7U0FDbEI7UUFFRCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUVoQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcs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UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRWEscUNBQTJCLEdBQXpDLFVBQTBDLENBQWE7UUFDbkQsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRXZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxD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QUFHLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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QUFFLFNBQW9CO1FBQ3JELElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBRW5ELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLFNBQVM7UUFDVCxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsU0FBUztRQUNULElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVDLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FB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QzVCLGVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QztTQUNKO0tBQ0o7QUFDTCxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgV0hJVEUgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxBQ0sgPSBuZXcgQ29sb3IoMCwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JBWSA9IG5ldyBDb2xvcigxMjgsIDEyOCwgMTI4KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRUQgPSBuZXcgQ29sb3IoMjU1LCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkVFTiA9IG5ldyBDb2xvcigwLCAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMVUUgPSBuZXcgQ29sb3IoMCwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBZRUxMT1cgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENZQU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BR0VOVEEgPSBuZXcgQ29sb3IoMjU1LCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE9SQU5HRSA9IG5ldyBDb2xvcigyNTUsIDE2NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFVSUExFID0gbmV3IENvbG9yKDEyOCwgMCwgMTI4KS5Ub1VpbnQzMigpO1xyXG5cclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyID0gMjU1KSB7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVG9VaW50MzIoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmEgPDwgMjQpIHwgKHRoaXMuYiA8PCAxNikgfCAodGhpcy5nIDw8IDgpIHwgdGhpcy5yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgRnJvbVVpbnQzMih1aW50MzI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoXHJcbiAgICAgICAgICAgIHVpbnQzMiAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gOCkgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDE2KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMjQpICYgMHhGRlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGVudW0gQ2FtZXJhQ2xlYXJGbGFncyB7XHJcbiAgICBOT05FID0gMCxcclxuICAgIEFMTCA9IDE2Mzg0IHwgMjU2LFxyXG4gICAgQ29sb3IgPSAxNjM4NCwgIC8vZ2wuQ09MT1JfQlVGRkVSX0JJVFxyXG4gICAgRGVwdGggPSAyNTYsICAgIC8vZ2wuREVQVEhfQlVGRkVSX0JJVFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbWFpbkNhbWVyYTogQ2FtZXJhO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FtZXJhczogQXJyYXk8Q2FtZXJhPiA9IG5ldyBBcnJheTxDYW1lcmE+KCk7XHJcblxyXG4gICAgcHVibGljIGJhY2tHcm91bmRDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMC4yNywgMC4yNywgMC4yNywgMS4wKTtcclxuICAgIHB1YmxpYyBmb2dDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMC4yNywgMC4yNywgMC4yNywgMS4wKTtcclxuICAgIHB1YmxpYyBjbGVhckZsYWdzOiBDYW1lcmFDbGVhckZsYWdzID0gQ2FtZXJhQ2xlYXJGbGFncy5Db2xvciB8IENhbWVyYUNsZWFyRmxhZ3MuRGVwdGg7XHJcbiAgICBwdWJsaWMgbmVhckNsaXA6IG51bWJlciA9IDE7XHJcbiAgICBwdWJsaWMgZmFyQ2xpcDogbnVtYmVyID0gMTI4O1xyXG4gICAgcHVibGljIGZvdjogbnVtYmVyID0gNjA7XHJcbiAgICBwdWJsaWMgZGVwdGg6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdmlld1BvcnQ6IFZlY3RvcjQgPSBuZXcgVmVjdG9yNCgwLCAwLCAxLCAxKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFzcGVjdCgpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB2ID0gdGhpcy52aWV3UG9ydDtcclxuICAgICAgICByZXR1cm4gKHYueiAqIENvbmZpZy5jYW52YXNXaWR0aCkgLyAodi53ICogQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF3YWtlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChDYW1lcmEubWFpbkNhbWVyYSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQ2FtZXJhLmNhbWVyYXMucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95KCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IENhbWVyYS5jYW1lcmFzLmluZGV4T2YodGhpcywgMCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgQ2FtZXJhLmNhbWVyYXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChDYW1lcmEubWFpbkNhbWVyYSA9PSB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmIChDYW1lcmEuY2FtZXJhcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSBDYW1lcmEuY2FtZXJhc1swXTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBDYW1lcmE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuLi9UcmFuc2Zyb21cIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVPYmplY3Q6IEdhbWVPYmplY3Q7XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgdHJhbnNmb3JtKCk6IFRyYW5zZm9ybSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU9iamVjdC50cmFuc2Zvcm07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBlbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uRW5hYmxlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbkRpc2FibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdCA9IGdhbWVPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5hd2FrZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeUn+WRveWRqOacn+aWueazlVxyXG4gICAgLy8g5b2T57uE5Lu26KKr5Yib5bu65pe26LCD55SoXHJcbiAgICBwdWJsaWMgYXdha2UoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDlnKjlkK/nlKjnu4Tku7bnmoTnrKzkuIDluKfosIPnlKhcclxuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOavj+W4p+abtOaWsOWJjeiwg+eUqFxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOavj+W4p+abtOaWsOWQjuiwg+eUqFxyXG4gICAgLy9wdWJsaWMgbGF0ZVVwZGF0ZSgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOW9k+e7hOS7tuiiq+WQr+eUqOaXtuiwg+eUqFxyXG4gICAgcHVibGljIG9uRW5hYmxlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5b2T57uE5Lu26KKr56aB55So5pe26LCD55SoXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5b2T57uE5Lu26KKr6ZSA5q+B5pe26LCD55SoXHJcbiAgICBwdWJsaWMgb25EZXN0cm95KCk6IHZvaWQge31cclxufSIsImltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgT0JKTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNoUmVuZGVyZXIgZXh0ZW5kcyBSZW5kZXJlciB7XHJcbiAgICBwcml2YXRlIF9tZXNoOiBPQkpNb2RlbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY2FzdFNoYWRvd3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSBfcmVjZWl2ZVNoYWRvd3M6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8vIOe9keagvOWxnuaAp1xyXG4gICAgcHVibGljIGdldCBtZXNoKCk6IE9CSk1vZGVsIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtZXNoKHZhbHVlOiBPQkpNb2RlbCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9tZXNoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5piv5ZCm5oqV5bCE6Zi05b2xXHJcbiAgICBwdWJsaWMgZ2V0IGNhc3RTaGFkb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYXN0U2hhZG93cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNhc3RTaGFkb3dzKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fY2FzdFNoYWRvd3MgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmmK/lkKbmjqXmlLbpmLTlvbFcclxuICAgIHB1YmxpYyBnZXQgcmVjZWl2ZVNoYWRvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY2VpdmVTaGFkb3dzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcmVjZWl2ZVNoYWRvd3ModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9yZWNlaXZlU2hhZG93cyA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDlrp7njrDmuLLmn5Pmlrnms5VcclxuICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XHJcbiAgICAgICAgLy8g5riy5p+T6YC76L6R5bCG55SxUmFzdGVyaXphdGlvblBpcGVsaW5l6LCD55SoXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmuIXnkIbotYTmupBcclxuICAgICAgICB0aGlzLl9tZXNoID0gbnVsbDtcclxuICAgICAgICBzdXBlci5tYXRlcmlhbCA9IG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4uL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPYmpSb3RhdGUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHJpdmF0ZSBhbmdsZSA9IDA7XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDplK7nm5jovpPlhaVcclxuICAgICAgICBpZiAoSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuVykpIHtcclxuICAgICAgICAgICAgLy8g5ZCR5YmN56e75YqoXHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLnogKz0gMC4xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKElucHV0LkdldEtleURvd24oSW5wdXQuS2V5Q29kZS5TcGFjZSkpIHtcclxuICAgICAgICAgICAgLy8g56m65qC86ZSu6KKr5oyJ5LiL77yM5omn6KGM6Lez6LeDXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi6Lez6LeDIVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOm8oOagh+i+k+WFpVxyXG4gICAgICAgIGlmIChJbnB1dC5HZXRNb3VzZUJ1dHRvbkRvd24oMCkpIHtcclxuICAgICAgICAgICAgLy8g6byg5qCH5bem6ZSu6KKr5oyJ5LiL77yM5omn6KGM5bCE5Ye7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5bCE5Ye7IVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOm8oOagh+S9jee9rlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coYOm8oOagh+S9jee9rjogKCR7SW5wdXQubW91c2VYfSwgJHtJbnB1dC5tb3VzZVl9KWApO1xyXG5cclxuICAgICAgICAvLyDpvKDmoIfmu5rova5cclxuICAgICAgICBpZiAoSW5wdXQuZGVsdGFZICE9PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIOe8qeaUvlxyXG4gICAgICAgICAgICBjb25zdCB6b29tRmFjdG9yID0gSW5wdXQuZGVsdGFZID4gMCA/IDAuOSA6IDEuMTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0uc2NhbGUubXVsdGlwbHkoem9vbUZhY3Rvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDop6bmkbjovpPlhaVcclxuICAgICAgICBpZiAoSW5wdXQudG91Y2hDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSBJbnB1dC5HZXRUb3VjaCgwKTtcclxuICAgICAgICAgICAgaWYgKHRvdWNoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg6Kem5pG45L2N572uOiAoJHt0b3VjaC5wb3NpdGlvbi54fSwgJHt0b3VjaC5wb3NpdGlvbi55fSlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiAodGhpcy5nYW1lT2JqZWN0Lm5hbWUgPT0gXCJjdWJlXCIpIHtcclxuICAgICAgICAvLyAgICAgLy8g5L2/55Soc2lu5Ye95pWw5a6e546w57yp5pS+5ZyoMC455YiwMS4x5LmL6Ze05b6q546vXHJcbiAgICAgICAgLy8gICAgIGNvbnN0IHNjYWxlT2Zmc2V0ID0gTWF0aC5zaW4oRGF0ZS5ub3coKSAqIDAuMDAyKSAqIDAuMSArIDAuMTtcclxuICAgICAgICAvLyAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLnRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAvLyAgICAgc2NhbGUueCA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgICAgIC8vICAgICBzY2FsZS55ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICAgICAgLy8gICAgIHNjYWxlLnogPSBzY2FsZU9mZnNldDtcclxuICAgICAgICAvLyAgICAgdGhpcy50cmFuc2Zvcm0uc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICAgICAgLy8gICAgIHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uID0gUXVhdGVybmlvbi5hbmdsZUF4aXModGhpcy5hbmdsZSwgVmVjdG9yMy5GT1JXQVJEKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5hbmdsZSArPSAxO1xyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyAvLyDorqnniankvZPlnKjmiYDmnInovbTkuIrml4vovaxcclxuICAgICAgICAvLyB0aGlzLnRyYW5zZm9ybS5yb3RhdGlvbiA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKHRoaXMuYW5nbGUsIFZlY3RvcjMuVVApO1xyXG4gICAgICAgIC8vIHRoaXMuYW5nbGUgKz0gMTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gXCIuLi9NYXRlcmlhbFwiO1xyXG5cclxuLy8gUmVuZGVyZXLmmK/miYDmnInmuLLmn5Pnu4Tku7bnmoTln7rnsbtcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHByaXZhdGUgX21hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfc29ydGluZ0xheWVySUQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9zb3J0aW5nT3JkZXI6IG51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIC8vIOadkOi0qOWxnuaAp1xyXG4gICAgcHVibGljIGdldCBtYXRlcmlhbCgpOiBNYXRlcmlhbCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldCBtYXRlcmlhbCh2YWx1ZTogTWF0ZXJpYWwgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5o6S5bqP5bGCSURcclxuICAgIHB1YmxpYyBnZXQgc29ydGluZ0xheWVySUQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZ0xheWVySUQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXQgc29ydGluZ0xheWVySUQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NvcnRpbmdMYXllcklEID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOaOkuW6j+mhuuW6j1xyXG4gICAgcHVibGljIGdldCBzb3J0aW5nT3JkZXIoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZ09yZGVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0IHNvcnRpbmdPcmRlcih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc29ydGluZ09yZGVyID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOaYr+WQpuW6lOivpeiiq+a4suafk1xyXG4gICAgcHVibGljIGdldCBzaG91bGRSZW5kZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5hYmxlZCAmJiB0aGlzLmdhbWVPYmplY3QuYWN0aXZlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmuLLmn5Pmlrnms5XvvIzlrZDnsbvpnIDopoHlrp7njrBcclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5kZXIoKTogdm9pZDtcclxufSIsImV4cG9ydCBjbGFzcyBDb25maWcge1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXNXaWR0aDogbnVtYmVyID0gNDAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXNIZWlnaHQ6IG51bWJlciA9IDQwMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFsZkNhbnZhc1dpZHRoOiBudW1iZXIgPSBDb25maWcuY2FudmFzV2lkdGggPj4gMTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFsZkNhbnZhc0hlaWdodDogbnVtYmVyID0gQ29uZmlnLmNhbnZhc0hlaWdodCA+PiAxO1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3BlY3RSYXRpbzogbnVtYmVyID0gQ29uZmlnLmNhbnZhc1dpZHRoIC8gQ29uZmlnLmNhbnZhc0hlaWdodDtcclxufSIsImltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZnJvbVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnQvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm06IFRyYW5zZm9ybTtcclxuICAgIHB1YmxpYyB0YWc6IHN0cmluZyA9IFwiVW50YWdnZWRcIjsgLy8g5re75Yqg5qCH562+5bGe5oCnXHJcbiAgICBwdWJsaWMgbGF5ZXI6IG51bWJlciA9IDA7IC8vIOm7mOiupOWxglxyXG5cclxuICAgIHByaXZhdGUgY29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhcnRlZENvbXBvbmVudHM6IFNldDxDb21wb25lbnQ+ID0gbmV3IFNldDxDb21wb25lbnQ+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0odGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8vIOiuvue9rua4uOaIj+WvueixoeeahOa/gOa0u+eKtuaAgVxyXG4gICAgcHVibGljIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWkhOeQhue7hOS7tueahOWQr+eUqC/npoHnlKhcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub25FbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm9uRGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g5qOA5p+l5ri45oiP5a+56LGh5piv5ZCm5aSE5LqO5rS75Yqo54q25oCB77yI6ICD6JmR54i25a+56LGh77yJXHJcbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAvLyDmo4Dmn6XniLblr7nosaHnmoTmv4DmtLvnirbmgIFcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50cmFuc2Zvcm0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50R2FtZU9iamVjdCA9IHBhcmVudC5nYW1lT2JqZWN0O1xyXG4gICAgICAgICAgICBpZiAocGFyZW50R2FtZU9iamVjdCAmJiAhcGFyZW50R2FtZU9iamVjdC5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6LCD55So5omA5pyJ57uE5Lu255qEU3RhcnTmlrnms5XvvIjlpoLmnpzlsJrmnKrosIPnlKjvvIlcclxuICAgIHB1YmxpYyBzdGFydENvbXBvbmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWRDb21wb25lbnRzLmhhcyhjb21wb25lbnQpICYmIGNvbXBvbmVudC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRlZENvbXBvbmVudHMuYWRkKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOmAkuW9kuiwg+eUqOWtkOWvueixoeeahHN0YXJ0Q29tcG9uZW50c1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmdhbWVPYmplY3Quc3RhcnRDb21wb25lbnRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5pu05paw5omA5pyJ57uE5Lu2XHJcbiAgICBwdWJsaWMgdXBkYXRlQ29tcG9uZW50cygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YCS5b2S6LCD55So5a2Q5a+56LGh55qEdXBkYXRlQ29tcG9uZW50c1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmdhbWVPYmplY3QudXBkYXRlQ29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOa3u+WKoOe7hOS7tlxyXG4gICAgcHVibGljIGFkZENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiB7IG5ldyhnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogVCB9KTogVCB7XHJcbiAgICAgICAgdmFyIGNvbXAgPSB0aGlzLmdldENvbXBvbmVudChjb21wb25lbnRUeXBlKTtcclxuICAgICAgICBpZiAoY29tcCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbXAgPSBuZXcgY29tcG9uZW50VHlwZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21wO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluaMh+Wumuexu+Wei+eahOe7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBGdW5jdGlvbiAmIHsgcHJvdG90eXBlOiBUIH0pOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IGFzIFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5omA5pyJ5oyH5a6a57G75Z6L55qE57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50czxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBGdW5jdGlvbiAmIHsgcHJvdG90eXBlOiBUIH0pOiBUW10ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVFtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjb21wb25lbnQgYXMgVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blrZDoioLngrnkuIrnmoTnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IFQgfCBudWxsIHtcclxuICAgICAgICAvLyDlhYjmo4Dmn6Xoh6rouqtcclxuICAgICAgICBjb25zdCBjb21wID0gdGhpcy5nZXRDb21wb25lbnQoY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgaWYgKGNvbXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOmBjeWOhuaJgOacieWtkOiKgueCuVxyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHYW1lT2JqZWN0ID0gY2hpbGQuZ2FtZU9iamVjdDtcclxuICAgICAgICAgICAgaWYgKGNoaWxkR2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRDb21wID0gY2hpbGRHYW1lT2JqZWN0LmdldENvbXBvbmVudChjb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZENvbXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZENvbXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6YCS5b2S5qOA5p+l5a2Q6IqC54K555qE5a2Q6IqC54K5XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWVwQ2hpbGRDb21wID0gY2hpbGRHYW1lT2JqZWN0LmdldENvbXBvbmVudEluQ2hpbGRyZW4oY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVlcENoaWxkQ29tcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZXBDaGlsZENvbXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluWtkOiKgueCueS4iueahOaJgOaciee7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudHNJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IFRbXSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICAgICAgLy8g5re75Yqg6Ieq6Lqr55qE57uE5Lu2XHJcbiAgICAgICAgcmVzdWx0LnB1c2goLi4udGhpcy5nZXRDb21wb25lbnRzKGNvbXBvbmVudFR5cGUpKTtcclxuXHJcbiAgICAgICAgLy8g6YGN5Y6G5omA5pyJ5a2Q6IqC54K5XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAvLyDlgYforr7mr4/kuKpUcmFuc2Zvcm3pg73mnInlr7nlupTnmoRHYW1lT2JqZWN0XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR2FtZU9iamVjdCA9IGNoaWxkLmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZEdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIOmAkuW9kuiOt+WPluWtkOiKgueCueeahOaJgOaciee7hOS7tlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goLi4uY2hpbGRHYW1lT2JqZWN0LmdldENvbXBvbmVudHNJbkNoaWxkcmVuKGNvbXBvbmVudFR5cGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnp7vpmaTnu4Tku7ZcclxuICAgIHB1YmxpYyByZW1vdmVDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmNvbXBvbmVudHMuZmluZEluZGV4KGNvbXBvbmVudCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiBjb21wb25lbnRUeXBlKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5vbkRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5ZCN56ew5p+l5om+R2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kKG5hbWU6IHN0cmluZyk6IEdhbWVPYmplY3QgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICAvLyDov5npnIDopoHkuIDkuKrlhajlsYDnmoRHYW1lT2JqZWN05rOo5YaM6KGoXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5qCH562+5p+l5om+56ys5LiA5LiqR2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kV2l0aFRhZyh0YWc6IHN0cmluZyk6IEdhbWVPYmplY3QgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICAvLyDov5npnIDopoHkuIDkuKrmoIfnrb7ns7vnu59cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4fmoIfnrb7mn6Xmib7miYDmnIlHYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRHYW1lT2JqZWN0c1dpdGhUYWcodGFnOiBzdHJpbmcpOiBHYW1lT2JqZWN0W10ge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrmn6Xmib7nibnlrprnsbvlnovnmoTnrKzkuIDkuKrnu4Tku7ZcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZE9iamVjdE9mVHlwZTxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8muafpeaJvueJueWumuexu+Wei+eahOaJgOaciee7hOS7tlxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kT2JqZWN0c09mVHlwZTxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogVFtdIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya5a6e5L6L5YyW5ri45oiP5a+56LGhXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKG9yaWdpbmFsOiBHYW1lT2JqZWN0LCBwb3NpdGlvbj86IFZlY3RvcjMsIHJvdGF0aW9uPzogUXVhdGVybmlvbik6IEdhbWVPYmplY3Qge1xyXG4gICAgICAgIC8vIOWIm+W7uuaWsOeahOa4uOaIj+WvueixoVxyXG4gICAgICAgIGNvbnN0IGNsb25lID0gbmV3IEdhbWVPYmplY3Qob3JpZ2luYWwubmFtZSk7XHJcblxyXG4gICAgICAgIC8vIOWkjeWItuWxnuaAp1xyXG4gICAgICAgIGNsb25lLnRhZyA9IG9yaWdpbmFsLnRhZztcclxuICAgICAgICBjbG9uZS5sYXllciA9IG9yaWdpbmFsLmxheWVyO1xyXG4gICAgICAgIGNsb25lLmFjdGl2ZSA9IG9yaWdpbmFsLmFjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8g6K6+572u5L2N572u5ZKM5peL6L2s77yI5aaC5p6c5o+Q5L6b77yJXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnRyYW5zZm9ybS5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnRyYW5zZm9ybS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5aSN5Yi257uE5Lu277yI6L+Z6ZyA6KaB5LiA5Liq5rex5bqm5aSN5Yi25py65Yi277yJXHJcblxyXG4gICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDplIDmr4HmuLjmiI/lr7nosaFcclxuICAgIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOiwg+eUqOaJgOaciee7hOS7tueahG9uRGVzdHJveeaWueazlVxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBjb21wb25lbnQub25EZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOi/memHjOWPr+S7pea3u+WKoOS7juWcuuaZr+S4reenu+mZpOa4uOaIj+WvueixoeeahOmAu+i+kVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIElucHV0IHtcclxuICAgIC8vIOmUruebmOeKtuaAgVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudEtleXM6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcmV2aW91c0tleXM6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XHJcblxyXG4gICAgLy8g6byg5qCH54q25oCBXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXJyZW50TW91c2VCdXR0b25zOiBib29sZWFuW10gPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07IC8vIOW3puOAgeS4reOAgeWPs+mUrlxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJldmlvdXNNb3VzZUJ1dHRvbnM6IGJvb2xlYW5bXSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlXTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VYOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVk6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRlbHRhWTogbnVtYmVyID0gMDsgLy8g6byg5qCH5rua6L2uXHJcblxyXG4gICAgLy8g6Kem5pG454q25oCBXHJcbiAgICBwcml2YXRlIHN0YXRpYyB0b3VjaGVzOiBUb3VjaFtdID0gW107XHJcblxyXG4gICAgLy8g5oyJ6ZSu5bi46YePXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtleUNvZGUgPSB7XHJcbiAgICAgICAgLy8g5a2X5q+N6ZSuXHJcbiAgICAgICAgQTogJ0tleUEnLCBCOiAnS2V5QicsIEM6ICdLZXlDJywgRDogJ0tleUQnLCBFOiAnS2V5RScsIEY6ICdLZXlGJywgRzogJ0tleUcnLFxyXG4gICAgICAgIEg6ICdLZXlIJywgSTogJ0tleUknLCBKOiAnS2V5SicsIEs6ICdLZXlLJywgTDogJ0tleUwnLCBNOiAnS2V5TScsIE46ICdLZXlOJyxcclxuICAgICAgICBPOiAnS2V5TycsIFA6ICdLZXlQJywgUTogJ0tleVEnLCBSOiAnS2V5UicsIFM6ICdLZXlTJywgVDogJ0tleVQnLCBVOiAnS2V5VScsXHJcbiAgICAgICAgVjogJ0tleVYnLCBXOiAnS2V5VycsIFg6ICdLZXlYJywgWTogJ0tleVknLCBaOiAnS2V5WicsXHJcblxyXG4gICAgICAgIC8vIOaVsOWtl+mUrlxyXG4gICAgICAgIEFscGhhMDogJ0RpZ2l0MCcsIEFscGhhMTogJ0RpZ2l0MScsIEFscGhhMjogJ0RpZ2l0MicsIEFscGhhMzogJ0RpZ2l0MycsIEFscGhhNDogJ0RpZ2l0NCcsXHJcbiAgICAgICAgQWxwaGE1OiAnRGlnaXQ1JywgQWxwaGE2OiAnRGlnaXQ2JywgQWxwaGE3OiAnRGlnaXQ3JywgQWxwaGE4OiAnRGlnaXQ4JywgQWxwaGE5OiAnRGlnaXQ5JyxcclxuXHJcbiAgICAgICAgLy8g5Yqf6IO96ZSuXHJcbiAgICAgICAgRjE6ICdGMScsIEYyOiAnRjInLCBGMzogJ0YzJywgRjQ6ICdGNCcsIEY1OiAnRjUnLCBGNjogJ0Y2JyxcclxuICAgICAgICBGNzogJ0Y3JywgRjg6ICdGOCcsIEY5OiAnRjknLCBGMTA6ICdGMTAnLCBGMTE6ICdGMTEnLCBGMTI6ICdGMTInLFxyXG5cclxuICAgICAgICAvLyDnibnmrorplK5cclxuICAgICAgICBTcGFjZTogJ1NwYWNlJyxcclxuICAgICAgICBFbnRlcjogJ0VudGVyJyxcclxuICAgICAgICBUYWI6ICdUYWInLFxyXG4gICAgICAgIEVzY2FwZTogJ0VzY2FwZScsXHJcbiAgICAgICAgQmFja3NwYWNlOiAnQmFja3NwYWNlJyxcclxuICAgICAgICBTaGlmdDogJ1NoaWZ0TGVmdCcsXHJcbiAgICAgICAgQ29udHJvbDogJ0NvbnRyb2xMZWZ0JyxcclxuICAgICAgICBBbHQ6ICdBbHRMZWZ0JyxcclxuICAgICAgICBDYXBzTG9jazogJ0NhcHNMb2NrJyxcclxuXHJcbiAgICAgICAgLy8g5pa55ZCR6ZSuXHJcbiAgICAgICAgVXBBcnJvdzogJ0Fycm93VXAnLFxyXG4gICAgICAgIERvd25BcnJvdzogJ0Fycm93RG93bicsXHJcbiAgICAgICAgTGVmdEFycm93OiAnQXJyb3dMZWZ0JyxcclxuICAgICAgICBSaWdodEFycm93OiAnQXJyb3dSaWdodCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIOWIneWni+WMlui+k+WFpeezu+e7n1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOmUruebmOS6i+S7tlxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQuY3VycmVudEtleXMuc2V0KGV2ZW50LmNvZGUsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC5jdXJyZW50S2V5cy5zZXQoZXZlbnQuY29kZSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDpvKDmoIfkuovku7ZcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA+PSAwICYmIGV2ZW50LmJ1dHRvbiA8IDMpIHtcclxuICAgICAgICAgICAgICAgIElucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNbZXZlbnQuYnV0dG9uXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID49IDAgJiYgZXZlbnQuYnV0dG9uIDwgMykge1xyXG4gICAgICAgICAgICAgICAgSW5wdXQuY3VycmVudE1vdXNlQnV0dG9uc1tldmVudC5idXR0b25dID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgSW5wdXQubW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgICAgICAgICAgSW5wdXQubW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC5kZWx0YVkgPSBldmVudC5kZWx0YVk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbGVuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQuZGVsdGFZID0gMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g6Kem5pG45LqL5Lu2XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC51cGRhdGVUb3VjaGVzKGV2ZW50LnRvdWNoZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQudXBkYXRlVG91Y2hlcyhldmVudC50b3VjaGVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQudXBkYXRlVG91Y2hlcyhldmVudC50b3VjaGVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQudXBkYXRlVG91Y2hlcyhldmVudC50b3VjaGVzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmm7TmlrDovpPlhaXnirbmgIHvvIjlnKjmr4/luKflvIDlp4vml7bosIPnlKjvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOabtOaWsOmUruebmOeKtuaAgVxyXG4gICAgICAgIElucHV0LnByZXZpb3VzS2V5cyA9IG5ldyBNYXAoSW5wdXQuY3VycmVudEtleXMpO1xyXG5cclxuICAgICAgICAvLyDmm7TmlrDpvKDmoIfnirbmgIFcclxuICAgICAgICBJbnB1dC5wcmV2aW91c01vdXNlQnV0dG9ucyA9IFsuLi5JbnB1dC5jdXJyZW50TW91c2VCdXR0b25zXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDplK7nm5jovpPlhaXmo4DmtYtcclxuXHJcbiAgICAvLyDmo4Dmn6XmjInplK7mmK/lkKbooqvmjInkuIvvvIjmjIHnu63op6blj5HvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0S2V5KGtleUNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBJbnB1dC5jdXJyZW50S2V5cy5nZXQoa2V5Q29kZSkgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5qOA5p+l5oyJ6ZSu5piv5ZCm5Zyo5b2T5YmN5bin6KKr5oyJ5LiL77yI5LuF5LiA5bin6Kem5Y+R77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEtleURvd24oa2V5Q29kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIElucHV0LmN1cnJlbnRLZXlzLmdldChrZXlDb2RlKSA9PT0gdHJ1ZSAmJiBJbnB1dC5wcmV2aW91c0tleXMuZ2V0KGtleUNvZGUpICE9PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOajgOafpeaMiemUruaYr+WQpuWcqOW9k+WJjeW4p+iiq+mHiuaUvu+8iOS7heS4gOW4p+inpuWPke+8iVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRLZXlVcChrZXlDb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gSW5wdXQuY3VycmVudEtleXMuZ2V0KGtleUNvZGUpICE9PSB0cnVlICYmIElucHV0LnByZXZpb3VzS2V5cy5nZXQoa2V5Q29kZSkgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6byg5qCH6L6T5YWl5qOA5rWLXHJcblxyXG4gICAgLy8g5qOA5p+l6byg5qCH5oyJ6ZKu5piv5ZCm6KKr5oyJ5LiL77yI5oyB57ut6Kem5Y+R77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldE1vdXNlQnV0dG9uKGJ1dHRvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbiA+PSAwICYmIGJ1dHRvbiA8IDMgPyBJbnB1dC5jdXJyZW50TW91c2VCdXR0b25zW2J1dHRvbl0gOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmo4Dmn6XpvKDmoIfmjInpkq7mmK/lkKblnKjlvZPliY3luKfooqvmjInkuIvvvIjku4XkuIDluKfop6blj5HvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0TW91c2VCdXR0b25Eb3duKGJ1dHRvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbiA+PSAwICYmIGJ1dHRvbiA8IDMgP1xyXG4gICAgICAgICAgICAoSW5wdXQuY3VycmVudE1vdXNlQnV0dG9uc1tidXR0b25dICYmICFJbnB1dC5wcmV2aW91c01vdXNlQnV0dG9uc1tidXR0b25dKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOajgOafpem8oOagh+aMiemSruaYr+WQpuWcqOW9k+WJjeW4p+iiq+mHiuaUvu+8iOS7heS4gOW4p+inpuWPke+8iVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRNb3VzZUJ1dHRvblVwKGJ1dHRvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbiA+PSAwICYmIGJ1dHRvbiA8IDMgP1xyXG4gICAgICAgICAgICAoIUlucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNbYnV0dG9uXSAmJiBJbnB1dC5wcmV2aW91c01vdXNlQnV0dG9uc1tidXR0b25dKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOinpuaRuOi+k+WFpeajgOa1i1xyXG5cclxuICAgIC8vIOabtOaWsOinpuaRuOeKtuaAgVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdXBkYXRlVG91Y2hlcyh0b3VjaExpc3Q6IFRvdWNoTGlzdCk6IHZvaWQge1xyXG4gICAgICAgIElucHV0LnRvdWNoZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IHRvdWNoTGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICAgICAgSW5wdXQudG91Y2hlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGZpbmdlcklkOiB0b3VjaC5pZGVudGlmaWVyLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB0b3VjaC5jbGllbnRYIC0gcmVjdC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHRvdWNoLmNsaWVudFkgLSByZWN0LnRvcFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlbHRhUG9zaXRpb246IHsgeDogMCwgeTogMCB9LCAvLyDnroDljJblrp7njrDvvIzlrp7pmYXlupTor6Xot5/ouKrliY3kuIDluKfkvY3nva5cclxuICAgICAgICAgICAgICAgIHBoYXNlOiBUb3VjaFBoYXNlLk1vdmVkLCAvLyDnroDljJblrp7njrBcclxuICAgICAgICAgICAgICAgIHRhcENvdW50OiAxIC8vIOeugOWMluWunueOsFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5oyH5a6a57Si5byV55qE6Kem5pG4XHJcbiAgICBwdWJsaWMgc3RhdGljIEdldFRvdWNoKGluZGV4OiBudW1iZXIpOiBUb3VjaCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgSW5wdXQudG91Y2hlcy5sZW5ndGggPyBJbnB1dC50b3VjaGVzW2luZGV4XSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W6Kem5pG45pWw6YePXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCB0b3VjaENvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIElucHV0LnRvdWNoZXMubGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyDop6bmkbjpmLbmrrXmnprkuL5cclxuZXhwb3J0IGVudW0gVG91Y2hQaGFzZSB7XHJcbiAgICBCZWdhbixcclxuICAgIE1vdmVkLFxyXG4gICAgU3RhdGlvbmFyeSxcclxuICAgIEVuZGVkLFxyXG4gICAgQ2FuY2VsZWRcclxufVxyXG5cclxuLy8g6Kem5pG45L+h5oGv5o6l5Y+jXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG91Y2gge1xyXG4gICAgZmluZ2VySWQ6IG51bWJlcjtcclxuICAgIHBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcbiAgICBkZWx0YVBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcbiAgICBwaGFzZTogVG91Y2hQaGFzZTtcclxuICAgIHRhcENvdW50OiBudW1iZXI7XHJcbn0iLCJlbnVtIExvZ1R5cGUge1xyXG4gICAgSW5mbyxcclxuICAgIFdhcm5pbmcsXHJcbiAgICBFcnJvcixcclxufVxyXG5cclxuaW50ZXJmYWNlIElMb2cge1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgdHlwZTogTG9nVHlwZTtcclxuICAgIGR1cmF0aW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9nczogSUxvZ1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgbG9nQ29sb3JzID0ge1xyXG4gICAgICAgIFtMb2dUeXBlLkluZm9dOiAnd2hpdGUnLFxyXG4gICAgICAgIFtMb2dUeXBlLldhcm5pbmddOiAnb3JhbmdlJyxcclxuICAgICAgICBbTG9nVHlwZS5FcnJvcl06ICdyZWQnXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBwcmludExvZ3MoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSB0aGlzLmxvZ3NbaV07XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBMb2dnZXIubG9nQ29sb3JzW2xvZy50eXBlXTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxvZy5tZXNzYWdlLCAxMCwgMjAgKyBpICogMTUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9nKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnB1c2gobWVzc2FnZSwgTG9nVHlwZS5JbmZvLCBkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHdhcm5pbmcobWVzc2FnZTogc3RyaW5nLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucHVzaChtZXNzYWdlLCBMb2dUeXBlLldhcm5pbmcsIGR1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucHVzaChtZXNzYWdlLCBMb2dUeXBlLkVycm9yLCBkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHVzaChtZXNzYWdlOiBzdHJpbmcsIHR5cGU6IExvZ1R5cGUsIGR1cmF0aW9uPzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbG9nOiBJTG9nID0ge1xyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gPz8gMCxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dzLnB1c2gobG9nKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi9RdWF0ZXJuaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4NHg0IHtcclxuXHJcbiAgICBwdWJsaWMgbWF0cml4OiBBcnJheTxBcnJheTxudW1iZXI+PiA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PigpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbHVtbjA6IFZlY3RvcjQsIGNvbHVtbjE6IFZlY3RvcjQsIGNvbHVtbjI6IFZlY3RvcjQsIGNvbHVtbjM6IFZlY3RvcjQpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB2ID0gYXJndW1lbnRzW2ldIGFzIFZlY3RvcjQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdHJpeFtpXSA9IG5ldyBBcnJheTxudW1iZXI+KHYueCwgdi55LCB2LnosIHYudyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdHJpeFtpXSA9IG5ldyBBcnJheTxudW1iZXI+KDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg6KGMXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSb3coaW5kZXg6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5tYXRyaXhbaW5kZXhdO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGV4IOWIl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q29sdW1uKGluZGV4OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQodGhpcy5tYXRyaXhbMF1baW5kZXhdLCB0aGlzLm1hdHJpeFsxXVtpbmRleF0sIHRoaXMubWF0cml4WzJdW2luZGV4XSwgdGhpcy5tYXRyaXhbM11baW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0Um93KGluZGV4OiBudW1iZXIsIHJvdzogVmVjdG9yNCkge1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVswXSA9IHJvdy54O1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVsxXSA9IHJvdy55O1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVsyXSA9IHJvdy56O1xyXG4gICAgICAgIHRoaXMubWF0cml4W2luZGV4XVszXSA9IHJvdy53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTZXRDb2x1bW4oaW5kZXg6IG51bWJlciwgY29sdW1uOiBWZWN0b3I0KSB7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbMF1baW5kZXhdID0gY29sdW1uLng7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbMV1baW5kZXhdID0gY29sdW1uLnk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbMl1baW5kZXhdID0gY29sdW1uLno7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbM11baW5kZXhdID0gY29sdW1uLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KG06IE1hdHJpeDR4NCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IGxocyA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIGxldCByaHMgPSBtLm1hdHJpeDtcclxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IE1hdHJpeDR4NCgpLm1hdHJpeDtcclxuXHJcbiAgICAgICAgbWF0cml4WzBdWzBdID0gbGhzWzBdWzBdICogcmhzWzBdWzBdICsgbGhzWzBdWzFdICogcmhzWzFdWzBdICsgbGhzWzBdWzJdICogcmhzWzJdWzBdICsgbGhzWzBdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFswXVsxXSA9IGxoc1swXVswXSAqIHJoc1swXVsxXSArIGxoc1swXVsxXSAqIHJoc1sxXVsxXSArIGxoc1swXVsyXSAqIHJoc1syXVsxXSArIGxoc1swXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMF1bMl0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMF1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzBdWzNdID0gbGhzWzBdWzBdICogcmhzWzBdWzNdICsgbGhzWzBdWzFdICogcmhzWzFdWzNdICsgbGhzWzBdWzJdICogcmhzWzJdWzNdICsgbGhzWzBdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFsxXVswXSA9IGxoc1sxXVswXSAqIHJoc1swXVswXSArIGxoc1sxXVsxXSAqIHJoc1sxXVswXSArIGxoc1sxXVsyXSAqIHJoc1syXVswXSArIGxoc1sxXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMV1bMV0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMV1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzFdWzJdID0gbGhzWzFdWzBdICogcmhzWzBdWzJdICsgbGhzWzFdWzFdICogcmhzWzFdWzJdICsgbGhzWzFdWzJdICogcmhzWzJdWzJdICsgbGhzWzFdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFsxXVszXSA9IGxoc1sxXVswXSAqIHJoc1swXVszXSArIGxoc1sxXVsxXSAqIHJoc1sxXVszXSArIGxoc1sxXVsyXSAqIHJoc1syXVszXSArIGxoc1sxXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbMl1bMF0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMl1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzJdWzFdID0gbGhzWzJdWzBdICogcmhzWzBdWzFdICsgbGhzWzJdWzFdICogcmhzWzFdWzFdICsgbGhzWzJdWzJdICogcmhzWzJdWzFdICsgbGhzWzJdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFsyXVsyXSA9IGxoc1syXVswXSAqIHJoc1swXVsyXSArIGxoc1syXVsxXSAqIHJoc1sxXVsyXSArIGxoc1syXVsyXSAqIHJoc1syXVsyXSArIGxoc1syXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMl1bM10gPSBsaHNbMl1bMF0gKiByaHNbMF1bM10gKyBsaHNbMl1bMV0gKiByaHNbMV1bM10gKyBsaHNbMl1bMl0gKiByaHNbMl1bM10gKyBsaHNbMl1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzNdWzBdID0gbGhzWzNdWzBdICogcmhzWzBdWzBdICsgbGhzWzNdWzFdICogcmhzWzFdWzBdICsgbGhzWzNdWzJdICogcmhzWzJdWzBdICsgbGhzWzNdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFszXVsxXSA9IGxoc1szXVswXSAqIHJoc1swXVsxXSArIGxoc1szXVsxXSAqIHJoc1sxXVsxXSArIGxoc1szXVsyXSAqIHJoc1syXVsxXSArIGxoc1szXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbM11bMl0gPSBsaHNbM11bMF0gKiByaHNbMF1bMl0gKyBsaHNbM11bMV0gKiByaHNbMV1bMl0gKyBsaHNbM11bMl0gKiByaHNbMl1bMl0gKyBsaHNbM11bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzNdWzNdID0gbGhzWzNdWzBdICogcmhzWzBdWzNdICsgbGhzWzNdWzFdICogcmhzWzFdWzNdICsgbGhzWzNdWzJdICogcmhzWzJdWzNdICsgbGhzWzNdWzNdICogcmhzWzNdWzNdO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlWZWN0b3IzKHY6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICByZXMueCA9IG1bMF1bMF0gKiB2LnggKyBtWzBdWzFdICogdi55ICsgbVswXVsyXSAqIHYuejtcclxuICAgICAgICByZXMueSA9IG1bMV1bMF0gKiB2LnggKyBtWzFdWzFdICogdi55ICsgbVsxXVsyXSAqIHYuejtcclxuICAgICAgICByZXMueiA9IG1bMl1bMF0gKiB2LnggKyBtWzJdWzFdICogdi55ICsgbVsyXVsyXSAqIHYuejtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlWZWN0b3I0KHY6IFZlY3RvcjQpOiBWZWN0b3I0IHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFZlY3RvcjQoKTtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICByZXMueCA9IG1bMF1bMF0gKiB2LnggKyBtWzBdWzFdICogdi55ICsgbVswXVsyXSAqIHYueiArIG1bMF1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLnkgPSBtWzFdWzBdICogdi54ICsgbVsxXVsxXSAqIHYueSArIG1bMV1bMl0gKiB2LnogKyBtWzFdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy56ID0gbVsyXVswXSAqIHYueCArIG1bMl1bMV0gKiB2LnkgKyBtWzJdWzJdICogdi56ICsgbVsyXVszXSAqIHYudztcclxuICAgICAgICByZXMudyA9IG1bM11bMF0gKiB2LnggKyBtWzNdWzFdICogdi55ICsgbVszXVsyXSAqIHYueiArIG1bM11bM10gKiB2Lnc7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRyYW5zbGF0ZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhtWzBdWzNdLCBtWzFdWzNdLCBtWzJdWzNdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0Um90YXRlKCk6IFZlY3RvcjMge1xyXG4gICAgLy8gICAgIGxldCBtYXQgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAvLyAgICAgbGV0IHggPSBNYXRoLmF0YW4yKG1hdFsxXVsyXSwgbWF0WzJdWzJdKTtcclxuICAgIC8vICAgICBsZXQgeSA9IE1hdGguYXRhbjIoLW1hdFswXVsyXSwgTWF0aC5zcXJ0KG1hdFsxXVsyXSAqIG1hdFsxXVsyXSArIG1hdFsyXVsyXSAqIG1hdFsyXVsyXSkpO1xyXG4gICAgLy8gICAgIGxldCB6ID0gTWF0aC5hdGFuMihtYXRbMF1bMV0sIG1hdFswXVswXSk7XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBuZXcgVmVjdG9yMyh4IC8gTWF0aC5QSSAqIDE4MCwgeSAvIE1hdGguUEkgKiAxODAsIHogLyBNYXRoLlBJICogMTgwKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Um90YXRlKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIC8v5LiA5a6a6KaB6I635Y+W57qv5YeA55qE5peL6L2s55+p6Zi177yM5Y2z5Y676Zmk57yp5pS+5YCN546HXHJcbiAgICAgICAgbGV0IG1hdCA9IHRoaXMuZ2V0Um90YXRlTWF0cml4KCkubWF0cml4O1xyXG4gICAgICAgIGxldCBxID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgdmFyIHRyYWNlID0gbWF0WzBdWzBdICsgbWF0WzFdWzFdICsgbWF0WzJdWzJdOyAvLyBJIHJlbW92ZWQgKyAxLjBmOyBzZWUgZGlzY3Vzc2lvbiB3aXRoIEV0aGFuXHJcbiAgICAgICAgdmFyIHMgPSAwO1xyXG5cclxuICAgICAgICBpZiAodHJhY2UgPiAwKSB7Ly8gSSBjaGFuZ2VkIE1fRVBTSUxPTiB0byAwXHJcbiAgICAgICAgICAgIHMgPSAwLjUgLyBNYXRoLnNxcnQodHJhY2UgKyAxLjApO1xyXG4gICAgICAgICAgICBxLncgPSAwLjI1IC8gcztcclxuICAgICAgICAgICAgcS54ID0gKG1hdFsyXVsxXSAtIG1hdFsxXVsyXSkgKiBzO1xyXG4gICAgICAgICAgICBxLnkgPSAobWF0WzBdWzJdIC0gbWF0WzJdWzBdKSAqIHM7XHJcbiAgICAgICAgICAgIHEueiA9IChtYXRbMV1bMF0gLSBtYXRbMF1bMV0pICogcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobWF0WzBdWzBdID4gbWF0WzFdWzFdICYmIG1hdFswXVswXSA+IG1hdFsyXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMF1bMF0gLSBtYXRbMV1bMV0gLSBtYXRbMl1bMl0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFsyXVsxXSAtIG1hdFsxXVsyXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAobWF0WzBdWzFdICsgbWF0WzFdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAobWF0WzBdWzJdICsgbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0WzFdWzFdID4gbWF0WzJdWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFsxXVsxXSAtIG1hdFswXVswXSAtIG1hdFsyXVsyXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzBdWzJdIC0gbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAobWF0WzBdWzFdICsgbWF0WzFdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAwLjI1ICogcztcclxuICAgICAgICAgICAgICAgIHEueiA9IChtYXRbMV1bMl0gKyBtYXRbMl1bMV0pIC8gcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzJdWzJdIC0gbWF0WzBdWzBdIC0gbWF0WzFdWzFdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMV1bMF0gLSBtYXRbMF1bMV0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IChtYXRbMF1bMl0gKyBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueSA9IChtYXRbMV1bMl0gKyBtYXRbMl1bMV0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueiA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Um90YXRlTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2Jsb2IvZGV2L3NyYy9tYXRoL01hdHJpeDQuanNcclxuICAgICAgICAvL+WboOS4uuaXi+i9rOefqemYteavlOi+g+eJueauiu+8jOacieaXtuWAmeimgeWNleeLrOWkhOeQhu+8jOaJgOacieaLpeacieS4gOS4quaPkOWPluaWueazlVxyXG4gICAgICAgIC8v5o+Q5Y+W5pa55byP5b6I566A5Y2V77yM5YWI6I635Y+W57yp5pS+5YC877yM54S25ZCO5Yip55So6I635Y+W57yp5pS+5YC855qE5Y6f55CG77yM6YCG5ZCR6Zmk5Y6757yp5pS+5YC877yM5bCx5b6X5Yiw57qv5YeA55qE5peL6L2s55+p6Zi1XHJcbiAgICAgICAgLy/mraTmlrnms5XkuI3mlK/mjIHlj43lsITnn6npmLVcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICB2YXIgdGUgPSBtYXQubWF0cml4O1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLmdldFNjYWxlKCk7XHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IDEgLyBzY2FsZS54O1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSAxIC8gc2NhbGUueTtcclxuICAgICAgICB2YXIgc2NhbGVaID0gMSAvIHNjYWxlLno7XHJcblxyXG4gICAgICAgIHRlWzBdWzBdID0gbWVbMF1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbMV1bMF0gPSBtZVsxXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVsyXVswXSA9IG1lWzJdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzNdWzBdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bMV0gPSBtZVswXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVsxXVsxXSA9IG1lWzFdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzJdWzFdID0gbWVbMl1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbM11bMV0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVsyXSA9IG1lWzBdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzFdWzJdID0gbWVbMV1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbMl1bMl0gPSBtZVsyXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVszXVsyXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzNdID0gMDtcclxuICAgICAgICB0ZVsxXVszXSA9IDA7XHJcbiAgICAgICAgdGVbMl1bM10gPSAwO1xyXG4gICAgICAgIHRlWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RXVsZXJBbmdsZXMoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2Jsb2IvZGV2L3NyYy9tYXRoL01hdHJpeDQuanNcclxuICAgICAgICAvL+S7juaXi+i9rOefqemYtemHjOiOt+WPluasp+aLieinklxyXG4gICAgICAgIC8v5b+F6aG75piv57qv5YeA55qE5peL6L2s55+p6Zi1XHJcblxyXG4gICAgICAgIHZhciBhbmdsZSA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHZhciB0ZSA9IHRoaXMuZ2V0Um90YXRlTWF0cml4KCkubWF0cml4O1xyXG4gICAgICAgIHZhciBtMTEgPSB0ZVswXVswXSwgbTEyID0gdGVbMF1bMV0sIG0xMyA9IHRlWzBdWzJdO1xyXG4gICAgICAgIHZhciBtMjEgPSB0ZVsxXVswXSwgbTIyID0gdGVbMV1bMV0sIG0yMyA9IHRlWzFdWzJdO1xyXG4gICAgICAgIHZhciBtMzEgPSB0ZVsyXVswXSwgbTMyID0gdGVbMl1bMV0sIG0zMyA9IHRlWzJdWzJdO1xyXG5cclxuICAgICAgICBtMTMgPSBtMTMgPiAxID8gMSA6IG0xMztcclxuICAgICAgICBtMTMgPSBtMTMgPCAtMSA/IC0xIDogbTEzO1xyXG4gICAgICAgIGFuZ2xlLnkgPSBNYXRoLmFzaW4obTEzKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKG0xMykgPCAwLjk5OTk5OTkpIHtcclxuICAgICAgICAgICAgYW5nbGUueCA9IE1hdGguYXRhbjIoLW0yMywgbTMzKTtcclxuICAgICAgICAgICAgYW5nbGUueiA9IE1hdGguYXRhbjIoLW0xMiwgbTExKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmdsZS54ID0gTWF0aC5hdGFuMihtMzIsIG0yMik7XHJcbiAgICAgICAgICAgIGFuZ2xlLnogPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKGFuZ2xlLnggLyBNYXRoLlBJICogMTgwLCBhbmdsZS55IC8gTWF0aC5QSSAqIDE4MCwgYW5nbGUueiAvIE1hdGguUEkgKiAxODApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIGxldCB2ID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgdi54ID0gTWF0aC5zcXJ0KG1bMF1bMF0gKiBtWzBdWzBdICsgbVsxXVswXSAqIG1bMV1bMF0gKyBtWzJdWzBdICogbVsyXVswXSk7XHJcbiAgICAgICAgdi55ID0gTWF0aC5zcXJ0KG1bMF1bMV0gKiBtWzBdWzFdICsgbVsxXVsxXSAqIG1bMV1bMV0gKyBtWzJdWzFdICogbVsyXVsxXSk7XHJcbiAgICAgICAgdi56ID0gTWF0aC5zcXJ0KG1bMF1bMl0gKiBtWzBdWzJdICsgbVsxXVsyXSAqIG1bMV1bMl0gKyBtWzJdWzJdICogbVsyXVsyXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc3Bvc2UoKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbTEgPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICB2YXIgbTIgPSBuZXcgTWF0cml4NHg0KCkubWF0cml4O1xyXG5cclxuICAgICAgICBtMlswXVswXSA9IG0xWzBdWzBdOyBtMlswXVsxXSA9IG0xWzFdWzBdOyBtMlswXVsyXSA9IG0xWzJdWzBdOyBtMlswXVszXSA9IG0xWzNdWzBdO1xyXG4gICAgICAgIG0yWzFdWzBdID0gbTFbMF1bMV07IG0yWzFdWzFdID0gbTFbMV1bMV07IG0yWzFdWzJdID0gbTFbMl1bMV07IG0yWzFdWzNdID0gbTFbM11bMV07XHJcbiAgICAgICAgbTJbMl1bMF0gPSBtMVswXVsyXTsgbTJbMl1bMV0gPSBtMVsxXVsyXTsgbTJbMl1bMl0gPSBtMVsyXVsyXTsgbTJbMl1bM10gPSBtMVszXVsyXTtcclxuICAgICAgICBtMlszXVswXSA9IG0xWzBdWzNdOyBtMlszXVsxXSA9IG0xWzFdWzNdOyBtMlszXVsyXSA9IG0xWzJdWzNdOyBtMlszXVszXSA9IG0xWzNdWzNdO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0yO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGUocG9zOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IE1hdHJpeDR4NC5nZXRUcmFuc2xhdGVNYXRyaXgocG9zKTtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGUocTogUXVhdGVybmlvbik6IE1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyByb3RhdGUoZXVsZXJBbmdsZXM6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIHJvdGF0ZShhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogTWF0cml4NHg0O1xyXG4gICAgcHVibGljIHJvdGF0ZSgpIHtcclxuICAgICAgICBsZXQgbSA9IG5ldyBNYXRyaXg0eDQoKTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFF1YXRlcm5pb24pIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24oYXJndW1lbnRzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoYXJndW1lbnRzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gTWF0cml4NHg0LmdldFNjYWxlTWF0cml4KHMpO1xyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvb2tBdCh0YXJnZXQ6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8vIHRvZG9cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvL+i9rOaNouWIsOaRhOW9seacuueci+WQkeeahOefqemYtemHjFxyXG4gICAgcHVibGljIHRyYW5zZm9ybVRvTG9va0F0U3BhY2UoZXllOiBWZWN0b3IzLCB0YXJnZXRQb2ludDogVmVjdG9yMywgdXA6IFZlY3RvcjMgPSBWZWN0b3IzLlVQKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL+S7juWTqumHjOeci+WQkeWTqumHjO+8jOS5n+WPr+S7peeQhuino+S4uuaRhOW9seacuuinhuinku+8jOWNs+inguWvn+epuumXtFxyXG4gICAgICAgIC8v6Iul6KaB5Y+Y5o2i5Yiw5pGE5b2x5py656m66Ze077yM5Y+v5Lul5YGH6K6+5pW05Liq6KeC5a+f56m66Ze05Lul5pGE5b2x5py65L2N5LqO5LiW55WM5Z2Q5qCH5Y6f54K577yM54S25ZCO5bCG5omA5pyJ54mp5L2T5pyd5pGE5b2x5py65Y6f5YWI5Zyo5LiW55WM56m66Ze05Lit55qE5L2N572u5Y+N5ZCR56e75Yqo5Y2z5Y+vXHJcbiAgICAgICAgLy/lnKjnurjkuIrnlLvkuIvlm77lsLHmuIXmmbDkuoZcclxuXHJcbiAgICAgICAgLy/nlLHkuo7pu5jorqTnn6npmLXmmK9TUlTpobrluo/nu4TmiJDnmoTlj5jmjaLnqbrpl7TvvIzopoHpgIblkJHvvIzliJnmmK9UUlPnmoTpobrluo/vvIzljbPlhYjnp7vliqjlkI7ml4vovaxcclxuICAgICAgICAvLzEu5ZCR5Y+N5pa55ZCR5bmz56e7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUobmV3IFZlY3RvcjMoLWV5ZS54LCAtZXllLnksIC1leWUueikpO1xyXG5cclxuICAgICAgICAvLzIu5ZCR5Y+N5pa55ZCR5peL6L2sXHJcbiAgICAgICAgLy/lhYjojrflj5bmkYTlvbHkuJbnlYzpg6jlnZDmoIfovbRcclxuICAgICAgICB2YXIgekF4aXMgPSBWZWN0b3IzLmRpZmZlcmVuY2UoZXllLCB0YXJnZXRQb2ludCkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy/lm6DkuLrmiJHku6zmmK/lj7PmiYvns7vnu5/vvIzopoHmsYJY77yM5YiZ5b+F6aG7euS5mHlcclxuICAgICAgICB2YXIgeEF4aXMgPSBWZWN0b3IzLmNyb3NzKHVwLCB6QXhpcykubm9ybWFsaXplKCk7XHJcbiAgICAgICAgdmFyIHlBeGlzID0gVmVjdG9yMy5jcm9zcyh6QXhpcywgeEF4aXMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8v5p6E5bu65pGE5b2x5py65Y+N5pa55ZCR5peL6L2s55+p6Zi1XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHhBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoeUF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh6QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcnVzdHVtKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBybCA9IChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgY29uc3QgdGIgPSAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGNvbnN0IGZuID0gKGZhciAtIG5lYXIpXHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgobmVhciAqIDIpIC8gcmwsIDAsIChyaWdodCArIGxlZnQpIC8gcmwsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAobmVhciAqIDIpIC8gdGIsICh0b3AgKyBib3R0b20pIC8gdGIsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtKGZhciArIG5lYXIpIC8gZm4sIC0oZmFyICogbmVhciAqIDIpIC8gZm4pLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtMSwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ydGhvZ3JhcGhpYyhsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgcmwgPSAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGNvbnN0IHRiID0gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBjb25zdCBmbiA9IChmYXIgLSBuZWFyKVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMiAvIHJsLCAwLCAwLCAtKGxlZnQgKyByaWdodCkgLyBybCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDIgLyB0YiwgMCwgLSh0b3AgKyBib3R0b20pIC8gdGIpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtMiAvIGZuLCAtKGZhciArIG5lYXIpIC8gZm4pLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyc3BlY3RpdmUoZm92OiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBoZm92ID0gZm92IC8gMTgwICogTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgY29uc3QgdGFuID0gTWF0aC50YW4oaGZvdik7XHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgxIC8gKGFzcGVjdCAqIHRhbiksIDAsIDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAxIC8gdGFuLCAwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLShmYXIgKyBuZWFyKSAvIChmYXIgLSBuZWFyKSwgLSgyICogZmFyICogbmVhcikgLyAoZmFyIC0gbmVhcikpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtMSwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGludmVyc2UoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgbWF0ID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIGNvbnN0IGEwMCA9IG1hdFswXVswXTtcclxuICAgICAgICBjb25zdCBhMDEgPSBtYXRbMF1bMV07XHJcbiAgICAgICAgY29uc3QgYTAyID0gbWF0WzBdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEwMyA9IG1hdFswXVszXTtcclxuICAgICAgICBjb25zdCBhMTAgPSBtYXRbMV1bMF07XHJcbiAgICAgICAgY29uc3QgYTExID0gbWF0WzFdWzFdO1xyXG4gICAgICAgIGNvbnN0IGExMiA9IG1hdFsxXVsyXTtcclxuICAgICAgICBjb25zdCBhMTMgPSBtYXRbMV1bM107XHJcbiAgICAgICAgY29uc3QgYTIwID0gbWF0WzJdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEyMSA9IG1hdFsyXVsxXTtcclxuICAgICAgICBjb25zdCBhMjIgPSBtYXRbMl1bMl07XHJcbiAgICAgICAgY29uc3QgYTIzID0gbWF0WzJdWzNdO1xyXG4gICAgICAgIGNvbnN0IGEzMCA9IG1hdFszXVswXTtcclxuICAgICAgICBjb25zdCBhMzEgPSBtYXRbM11bMV07XHJcbiAgICAgICAgY29uc3QgYTMyID0gbWF0WzNdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEzMyA9IG1hdFszXVszXTtcclxuXHJcbiAgICAgICAgY29uc3QgZGV0MDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAyID0gYTAwICogYTEzIC0gYTAzICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTFcclxuICAgICAgICBjb25zdCBkZXQwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMVxyXG4gICAgICAgIGNvbnN0IGRldDA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyXHJcbiAgICAgICAgY29uc3QgZGV0MDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzFcclxuICAgICAgICBjb25zdCBkZXQxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGRldDExID0gYTIyICogYTMzIC0gYTIzICogYTMyXHJcblxyXG4gICAgICAgIGxldCBkZXQgPSAoZGV0MDAgKiBkZXQxMSAtIGRldDAxICogZGV0MTAgKyBkZXQwMiAqIGRldDA5ICsgZGV0MDMgKiBkZXQwOCAtIGRldDA0ICogZGV0MDcgKyBkZXQwNSAqIGRldDA2KTtcclxuXHJcbiAgICAgICAgaWYgKCFkZXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk1hdHJpeDR4NCBpbnZlcnNlIGZhaWxlZCwgZGV0ZXJtaW5hbnQgaXMgMFwiKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcblxyXG4gICAgICAgIG1hdFswXVswXSA9IChhMTEgKiBkZXQxMSAtIGExMiAqIGRldDEwICsgYTEzICogZGV0MDkpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzFdID0gKC1hMDEgKiBkZXQxMSArIGEwMiAqIGRldDEwIC0gYTAzICogZGV0MDkpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzJdID0gKGEzMSAqIGRldDA1IC0gYTMyICogZGV0MDQgKyBhMzMgKiBkZXQwMykgKiBkZXRcclxuICAgICAgICBtYXRbMF1bM10gPSAoLWEyMSAqIGRldDA1ICsgYTIyICogZGV0MDQgLSBhMjMgKiBkZXQwMykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMF0gPSAoLWExMCAqIGRldDExICsgYTEyICogZGV0MDggLSBhMTMgKiBkZXQwNykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMV0gPSAoYTAwICogZGV0MTEgLSBhMDIgKiBkZXQwOCArIGEwMyAqIGRldDA3KSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVsyXSA9ICgtYTMwICogZGV0MDUgKyBhMzIgKiBkZXQwMiAtIGEzMyAqIGRldDAxKSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVszXSA9IChhMjAgKiBkZXQwNSAtIGEyMiAqIGRldDAyICsgYTIzICogZGV0MDEpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzBdID0gKGExMCAqIGRldDEwIC0gYTExICogZGV0MDggKyBhMTMgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMV0gPSAoLWEwMCAqIGRldDEwICsgYTAxICogZGV0MDggLSBhMDMgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMl0gPSAoYTMwICogZGV0MDQgLSBhMzEgKiBkZXQwMiArIGEzMyAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVszXSA9ICgtYTIwICogZGV0MDQgKyBhMjEgKiBkZXQwMiAtIGEyMyAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFszXVswXSA9ICgtYTEwICogZGV0MDkgKyBhMTEgKiBkZXQwNyAtIGExMiAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFszXVsxXSA9IChhMDAgKiBkZXQwOSAtIGEwMSAqIGRldDA3ICsgYTAyICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzJdID0gKC1hMzAgKiBkZXQwMyArIGEzMSAqIGRldDAxIC0gYTMyICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzNdID0gKGEyMCAqIGRldDAzIC0gYTIxICogZGV0MDEgKyBhMjIgKiBkZXQwMCkgKiBkZXRcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvRmxvYXQzMkxpc3QoKTogRmxvYXQzMkxpc3Qge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgLy/nlLHkuo5PcGVuR0zmmK/liJfluo/lrZjlgqjvvIzmiYDku6XpnIDopoHovaznva7kuIDkuIvnn6npmLVcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgIG1bMF1bMF0sIG1bMV1bMF0sIG1bMl1bMF0sIG1bM11bMF0sXHJcbiAgICAgICAgICAgIG1bMF1bMV0sIG1bMV1bMV0sIG1bMl1bMV0sIG1bM11bMV0sXHJcbiAgICAgICAgICAgIG1bMF1bMl0sIG1bMV1bMl0sIG1bMl1bMl0sIG1bM11bMl0sXHJcbiAgICAgICAgICAgIG1bMF1bM10sIG1bMV1bM10sIG1bMl1bM10sIG1bM11bM11cclxuICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMCksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDEpLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygyKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMyksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VFJTTWF0cml4KHBvczogVmVjdG9yMywgcXVhdDogUXVhdGVybmlvbiwgc2NhbGU6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCB0bSA9IE1hdHJpeDR4NC5nZXRUcmFuc2xhdGVNYXRyaXgocG9zKTtcclxuICAgICAgICBsZXQgcm0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHF1YXQpO1xyXG4gICAgICAgIGxldCBzbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzY2FsZSk7XHJcblxyXG4gICAgICAgIC8v5b+F6aG75Lil5qC85oyJ54Wn5YWIU2NhbGXvvIzlho1Sb3RhdGXvvIzlho1UcmFuc2xhdGXnmoTpobrluo/vvIzlkKbliJnlvpfliLDnmoTnu5Pmnpzogq/lrprmmK/kuI3mu6HmhI/nmoRcclxuICAgICAgICAvL+S+i+WmguacieS4gOS4qjFYMeato+aWueW9ouWcqOWOn+eCue+8jOaIkeS7rOaDs+imgeW+l+WIsOS4gOS4qjFYMu+8jOW5tuS4lOaWnOWQkTQ1wrDvvIzogIzkuJTnprvlnZDmoIfljp/ngrkx5Liq5Y2V5L2N5aSEXHJcbiAgICAgICAgLy/lpoLmnpzlhYjml4vovazvvIzlho3nvKnmlL7nmoTor53vvIzml4vovazmlrnlkJHmmK/lr7nkuobvvIzkvYbmmK/miJHku6zmmK/lsIbml4vovazlkI40NcKw55qE5q2j5pa55b2i55qEWei9tOaLieS8uDLlgI3vvIzlvpfliLDnmoTmmK/kuIDkuKrooqvmi4nplb/nmoToj7HlvaJcclxuICAgICAgICAvL+WmguaenOWFiOW5s+enu++8jOWGjeaXi+i9rOeahOivne+8jOWboOS4uuaIkeS7rOaXi+i9rOmDveaYr+e7leedgOWdkOagh+WOn+eCueeahO+8jOe7k+aenOiHqueEtuaYr+ato+aWueW9ouS4jeaYr+iHqui6q+aXi+i9rDQ1wrDvvIzogIzmmK/nu5XnnYDljp/ngrnml4vovaxcclxuICAgICAgICByZXR1cm4gdG0ubXVsdGlwbHkocm0ubXVsdGlwbHkoc20pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRyYW5zbGF0ZU1hdHJpeChwb3M6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMTsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gcG9zLng7XHJcbiAgICAgICAgbVsxXVswXSA9IDA7IG1bMV1bMV0gPSAxOyBtWzFdWzJdID0gMDsgbVsxXVszXSA9IHBvcy55O1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IDE7IG1bMl1bM10gPSBwb3MuejtcclxuICAgICAgICBtWzNdWzBdID0gMDsgbVszXVsxXSA9IDA7IG1bM11bMl0gPSAwOyBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxOiBRdWF0ZXJuaW9uKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbGV0IG51bSA9IHEueCAqIDI7XHJcbiAgICAgICAgbGV0IG51bTIgPSBxLnkgKiAyO1xyXG4gICAgICAgIGxldCBudW0zID0gcS56ICogMjtcclxuICAgICAgICBsZXQgbnVtNCA9IHEueCAqIG51bTtcclxuICAgICAgICBsZXQgbnVtNSA9IHEueSAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTYgPSBxLnogKiBudW0zO1xyXG4gICAgICAgIGxldCBudW03ID0gcS54ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtOCA9IHEueCAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTkgPSBxLnkgKiBudW0zO1xyXG4gICAgICAgIGxldCBudW0xMCA9IHEudyAqIG51bTtcclxuICAgICAgICBsZXQgbnVtMTEgPSBxLncgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW0xMiA9IHEudyAqIG51bTM7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSAxIC0gKG51bTUgKyBudW02KTtcclxuICAgICAgICBtWzFdWzBdID0gbnVtNyArIG51bTEyO1xyXG4gICAgICAgIG1bMl1bMF0gPSBudW04IC0gbnVtMTE7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IG51bTcgLSBudW0xMjtcclxuICAgICAgICBtWzFdWzFdID0gMSAtIChudW00ICsgbnVtNik7XHJcbiAgICAgICAgbVsyXVsxXSA9IG51bTkgKyBudW0xMDtcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0gbnVtOCArIG51bTExO1xyXG4gICAgICAgIG1bMV1bMl0gPSBudW05IC0gbnVtMTA7XHJcbiAgICAgICAgbVsyXVsyXSA9IDEgLSAobnVtNCArIG51bTUpO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhlOiBWZWN0b3IzLCBvcmRlcjogc3RyaW5nID0gXCJYWVpcIik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/pgJrov4fmrKfmi4nop5Lojrflj5bml4vovaznn6npmLVcclxuICAgICAgICAvL+WFiOWIhuWIq+iOt+WPllhZWui9tOS4iueahOaXi+i9rOefqemYte+8jOeEtuWQjuWQiOW5tui1t+adpVxyXG4gICAgICAgIC8v5rOo5oSP77ya5peL6L2s6L2055qE6aG65bqP5YWI5ZCO5LiN5ZCM77yM5Lya5Ye6546w5LiN5ZCM55qE57uT5p6c77yM5Zug5q2k5b+F6aG76KaB5oyH5a6a5peL6L2s6aG65bqPXHJcbiAgICAgICAgLy9odHRwOi8vcGxhbm5pbmcuY3MudWl1Yy5lZHUvbm9kZTEwMi5odG1sXHJcbiAgICAgICAgLy9odHRwczovL3RocmVlanMub3JnL2RvY3MvI2FwaS9lbi9tYXRoL0V1bGVyLm9yZGVyXHJcbiAgICAgICAgdmFyIHggPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueCwgVmVjdG9yMy5SSUdIVCk7XHJcbiAgICAgICAgdmFyIHkgPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueSwgVmVjdG9yMy5VUCk7XHJcbiAgICAgICAgdmFyIHogPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlBeGlzKGUueiwgVmVjdG9yMy5GT1JXQVJEKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChvcmRlcikge1xyXG4gICAgICAgICAgICBjYXNlIFwiWFlaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh5Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICAgICAgY2FzZSBcIlhaWVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkubXVsdGlwbHkoei5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJZWFpcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHgubXVsdGlwbHkoeSkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVpYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh6Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIlpYWVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkubXVsdGlwbHkoeC5tdWx0aXBseSh6KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWVhcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB4Lm11bHRpcGx5KHkubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJvdGF0aW9uIG9yZGVyIGVycm9yLCBtdXN0IGJlIHNpbWlsYXIgdG8gJ1hZWidcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh5Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeUF4aXMoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG91dCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICB2YXIgbSA9IG91dC5tYXRyaXg7XHJcbiAgICAgICAgdmFyIHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XHJcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgICAgIHZhciBzID0gMCwgYyA9IDAsIHQgPSAwO1xyXG5cclxuICAgICAgICBhbmdsZSA9IE1hdGguUEkgKiBhbmdsZSAvIDE4MDtcclxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xyXG4gICAgICAgIHggKj0gbGVuO1xyXG4gICAgICAgIHkgKj0gbGVuO1xyXG4gICAgICAgIHogKj0gbGVuO1xyXG4gICAgICAgIHMgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICB0ID0gMSAtIGM7XHJcbiAgICAgICAgbVswXVswXSA9IHggKiB4ICogdCArIGM7XHJcbiAgICAgICAgbVsxXVswXSA9IHkgKiB4ICogdCArIHogKiBzO1xyXG4gICAgICAgIG1bMl1bMF0gPSB6ICogeCAqIHQgLSB5ICogcztcclxuICAgICAgICBtWzNdWzBdID0gMDtcclxuICAgICAgICBtWzBdWzFdID0geCAqIHkgKiB0IC0geiAqIHM7XHJcbiAgICAgICAgbVsxXVsxXSA9IHkgKiB5ICogdCArIGM7XHJcbiAgICAgICAgbVsyXVsxXSA9IHogKiB5ICogdCArIHggKiBzO1xyXG4gICAgICAgIG1bM11bMV0gPSAwO1xyXG4gICAgICAgIG1bMF1bMl0gPSB4ICogeiAqIHQgKyB5ICogcztcclxuICAgICAgICBtWzFdWzJdID0geSAqIHogKiB0IC0geCAqIHM7XHJcbiAgICAgICAgbVsyXVsyXSA9IHogKiB6ICogdCArIGM7XHJcbiAgICAgICAgbVszXVsyXSA9IDA7XHJcbiAgICAgICAgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNjYWxlTWF0cml4KHM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gcy54OyBtWzBdWzFdID0gMDsgbVswXVsyXSA9IDA7IG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gcy55OyBtWzFdWzJdID0gMDsgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVswXSA9IDA7IG1bMl1bMV0gPSAwOyBtWzJdWzJdID0gcy56OyBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzBdID0gMDsgbVszXVsxXSA9IDA7IG1bM11bMl0gPSAwOyBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpZGVudGl0eSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIG0ubWF0cml4WzBdWzBdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFsxXVsxXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMl1bMl0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzNdWzNdID0gMTtcclxuICAgICAgICByZXR1cm4gbTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IE1hdHJpeDR4NCB9IGZyb20gXCIuL01hdHJpeDR4NFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1YXRlcm5pb24ge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGV1bGVyOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlQXJvdW5kKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXVsZXJBbmdsZXMgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xyXG4gICAgICAgICAgICB0aGlzLncgPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHRoaXMpLmdldEV1bGVyQW5nbGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBldWxlckFuZ2xlcyhlOiBWZWN0b3IzKSB7XHJcbiAgICAgICAgdmFyIHEgPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhlKS5nZXRSb3RhdGUoKTtcclxuICAgICAgICB0aGlzLncgPSBxLnc7XHJcbiAgICAgICAgdGhpcy54ID0gcS54O1xyXG4gICAgICAgIHRoaXMueSA9IHEueTtcclxuICAgICAgICB0aGlzLnogPSBxLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZUFyb3VuZChhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgbGV0IHEgPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhhbmdsZSwgYXhpcyk7XHJcbiAgICAgICAgdGhpcy54ID0gcS54O1xyXG4gICAgICAgIHRoaXMueSA9IHEueTtcclxuICAgICAgICB0aGlzLnogPSBxLno7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAemgg5ZCR6YeP5Zub5YWD5pWw5LmY5rOVXHJcbiAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybVF1YXQoYTogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6IGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tdHJhbnNmb3JtLVZlYzMtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIGxldCBxID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHF1YXQgKiB2ZWNcclxuICAgICAgICBjb25zdCBpeCA9IHEudyAqIGEueCArIHEueSAqIGEueiAtIHEueiAqIGEueTtcclxuICAgICAgICBjb25zdCBpeSA9IHEudyAqIGEueSArIHEueiAqIGEueCAtIHEueCAqIGEuejtcclxuICAgICAgICBjb25zdCBpeiA9IHEudyAqIGEueiArIHEueCAqIGEueSAtIHEueSAqIGEueDtcclxuICAgICAgICBjb25zdCBpdyA9IC1xLnggKiBhLnggLSBxLnkgKiBhLnkgLSBxLnogKiBhLno7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcclxuICAgICAgICBvdXQueCA9IGl4ICogcS53ICsgaXcgKiAtcS54ICsgaXkgKiAtcS56IC0gaXogKiAtcS55O1xyXG4gICAgICAgIG91dC55ID0gaXkgKiBxLncgKyBpdyAqIC1xLnkgKyBpeiAqIC1xLnggLSBpeCAqIC1xLno7XHJcbiAgICAgICAgb3V0LnogPSBpeiAqIHEudyArIGl3ICogLXEueiArIGl4ICogLXEueSAtIGl5ICogLXEueDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24odGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlm5vlhYPmlbDnkIPpnaLmj5LlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzbGVycChhOiBRdWF0ZXJuaW9uLCBiOiBRdWF0ZXJuaW9uLCB0OiBudW1iZXIpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOlxyXG4gICAgICAgIC8vICAgIGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tc2xlcnAtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUwID0gMDtcclxuICAgICAgICBsZXQgc2NhbGUxID0gMDtcclxuXHJcbiAgICAgICAgLy8gY2FsYyBjb3NpbmVcclxuICAgICAgICBsZXQgY29zb20gPSBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICAgICAgLy8gYWRqdXN0IHNpZ25zIChpZiBuZWNlc3NhcnkpXHJcbiAgICAgICAgaWYgKGNvc29tIDwgMC4wKSB7XHJcbiAgICAgICAgICAgIGNvc29tID0gLWNvc29tO1xyXG4gICAgICAgICAgICBiLnggPSAtYi54O1xyXG4gICAgICAgICAgICBiLnkgPSAtYi55O1xyXG4gICAgICAgICAgICBiLnogPSAtYi56O1xyXG4gICAgICAgICAgICBiLncgPSAtYi53O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgY29lZmZpY2llbnRzXHJcbiAgICAgICAgaWYgKCgxLjAgLSBjb3NvbSkgPiAwLjAwMDAwMSkge1xyXG4gICAgICAgICAgICAvLyBzdGFuZGFyZCBjYXNlIChzbGVycClcclxuICAgICAgICAgICAgY29uc3Qgb21lZ2EgPSBNYXRoLmFjb3MoY29zb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzaW5vbSA9IE1hdGguc2luKG9tZWdhKTtcclxuICAgICAgICAgICAgc2NhbGUwID0gTWF0aC5zaW4oKDEuMCAtIHQpICogb21lZ2EpIC8gc2lub207XHJcbiAgICAgICAgICAgIHNjYWxlMSA9IE1hdGguc2luKHQgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBcImZyb21cIiBhbmQgXCJ0b1wiIHF1YXRlcm5pb25zIGFyZSB2ZXJ5IGNsb3NlXHJcbiAgICAgICAgICAgIC8vICAuLi4gc28gd2UgY2FuIGRvIGEgbGluZWFyIGludGVycG9sYXRpb25cclxuICAgICAgICAgICAgc2NhbGUwID0gMS4wIC0gdDtcclxuICAgICAgICAgICAgc2NhbGUxID0gdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGZpbmFsIHZhbHVlc1xyXG4gICAgICAgIG91dC54ID0gc2NhbGUwICogYS54ICsgc2NhbGUxICogYi54O1xyXG4gICAgICAgIG91dC55ID0gc2NhbGUwICogYS55ICsgc2NhbGUxICogYi55O1xyXG4gICAgICAgIG91dC56ID0gc2NhbGUwICogYS56ICsgc2NhbGUxICogYi56O1xyXG4gICAgICAgIG91dC53ID0gc2NhbGUwICogYS53ICsgc2NhbGUxICogYi53O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KGE6IFF1YXRlcm5pb24sIGI6IFF1YXRlcm5pb24pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZUF4aXMoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICBhbmdsZSA9IE1hdGguUEkgKiBhbmdsZSAvIDE4MDtcclxuICAgICAgICBhbmdsZSAqPSAwLjU7XHJcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xyXG5cclxuICAgICAgICByZXMueCA9IGF4aXMueCAqIHNpbjtcclxuICAgICAgICByZXMueSA9IGF4aXMueSAqIHNpbjtcclxuICAgICAgICByZXMueiA9IGF4aXMueiAqIHNpbjtcclxuICAgICAgICByZXMudyA9IE1hdGguY29zKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpZGVudGl0eSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd2lkdGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueTsgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMik6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMjtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yMik6IFZlY3RvcjI7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWN0b3IyO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yMi5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3IyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyLCB0OiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnggKyB2MS55ICogdjIueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcm9zcyh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodjEueCAqIHYyLnkgLSB2MS55ICogdjIueCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB4ID0gdjIueCAtIHYxLng7XHJcbiAgICAgICAgdmFyIHkgPSB2Mi55IC0gdjEueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGUodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlY3RvcjIuZG90KHYxLCB2MikgLyAodjEubWFnbml0dWRlICogdjIubWFnbml0dWRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFJJR0hUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBMRUZUKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigtMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgVVAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERPV04oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIC0xKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yMyB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjQpXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3IzKTogVmVjdG9yMztcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlY3RvcjM7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yMyk6IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlY3RvcjM7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICB0aGlzLnogKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHRoaXMueiAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHRoaXMueiAqPSB2Lno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yMy5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMywgdDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgdi56ID0gdjEueiArIHQgKiAodjIueiAtIHYxLnopO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHggPSB2MS55ICogdjIueiAtIHYxLnogKiB2Mi55O1xyXG4gICAgICAgIHZhciB5ID0gdjEueiAqIHYyLnggLSB2MS54ICogdjIuejtcclxuICAgICAgICB2YXIgeiA9IHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLng7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHgsIHksIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgdmFyIHogPSB2Mi56IC0gdjEuejtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaWZmZXJlbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBkZXN0ID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgZGVzdC54ID0gdjEueCAtIHYyLnhcclxuICAgICAgICBkZXN0LnkgPSB2MS55IC0gdjIueVxyXG4gICAgICAgIGRlc3QueiA9IHYxLnogLSB2Mi56XHJcblxyXG4gICAgICAgIHJldHVybiBkZXN0XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMy5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKC0xLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEZPUldBUkQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEJBQ0soKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIC0xKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yNCB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBnKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuICAgIHB1YmxpYyBnZXQgYigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy56OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGEoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudzsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmVjdG9yMygpOiBWZWN0b3IzIHsgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMpOyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHMubGVuZ3RoID09IDIgPyBhcmd1bWVudHNbMV0gOiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjdG9yNDtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgKz0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjQpOiBWZWN0b3I0O1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgLT0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHRoaXMudyAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgdGhpcy53IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjQpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICB0aGlzLncgKj0gdi53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjQuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3I0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56ICYmIHYudyA9PSB0aGlzLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56ICsgXCIsIFwiICsgdGhpcy53ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0LCB0OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICB2LnogPSB2MS56ICsgdCAqICh2Mi56IC0gdjEueik7XHJcbiAgICAgICAgdi53ID0gdjEudyArIHQgKiAodjIudyAtIHYxLncpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnogKyB2MS53ICogdjIudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yNC5kb3QodjEsIHYyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDEsIDEsIDEsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4vVHJhbnNmcm9tXCI7XHJcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L1JlbmRlcmVyXCI7XHJcbmltcG9ydCB7IE1lc2hSZW5kZXJlciB9IGZyb20gXCIuL0NvbXBvbmVudC9NZXNoUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ29tcG9uZW50L0NhbWVyYVwiO1xyXG5cclxuZW51bSBEcmF3TW9kZSB7XHJcbiAgICBXaXJlZnJhbWUsXHJcbiAgICBQb2ludCxcclxuICAgIFNoYWRlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmFzdGVyaXphdGlvblBpcGVsaW5lIHtcclxuICAgIHB1YmxpYyBkcmF3TW9kZTogRHJhd01vZGUgPSBEcmF3TW9kZS5XaXJlZnJhbWU7XHJcbiAgICBwcml2YXRlIHVpbnQzMlZpZXc6IFVpbnQzMkFycmF5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVpbnQzMlZpZXc6IFVpbnQzMkFycmF5KSB7XHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3ID0gdWludDMyVmlldztcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24g5Z+656GA57uY5Yi25o6l5Y+jXHJcblxyXG4gICAgcHVibGljIENsZWFyKGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDkvb/nlKggZmlsbCDmlrnms5Xmm7/ku6Plvqrnjq/vvIzmgKfog73mm7Tlpb1cclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXcuZmlsbChjb2xvcik7XHJcbiAgICAgICAgLy8g5oiW6ICF5L2/55So5b6q546v77yM5L2G5oCn6IO96L6D5beuXHJcbiAgICAgICAgLy8gZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNhbnZhc1dpZHRoOyB4KyspIHtcclxuICAgICAgICAvLyAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmNhbnZhc0hlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLlNldFBpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1BpeGVsKHg6IG51bWJlciwgeTogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g57uY5Yi25Yiw5bGP5bmV5LiK55qE5YOP57Sg5bqU6K+l5piv5pW05pWw55qEXHJcbiAgICAgICAgLy8g5LyY5YyWOiDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgeCA9ICh4IHwgMCk7XHJcbiAgICAgICAgeSA9ICh5IHwgMCk7XHJcbiAgICAgICAgLy8geCA9IE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgLy8geSA9IE1hdGguZmxvb3IoeSk7XHJcblxyXG4gICAgICAgIGlmICh4IDwgMCB8fCB4ID49IENvbmZpZy5jYW52YXNXaWR0aCB8fCB5IDwgMCB8fCB5ID49IENvbmZpZy5jYW52YXNIZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3W3kgKiBDb25maWcuY2FudmFzV2lkdGggKyB4XSA9IGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3TGluZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5Y+W5pW0XHJcbiAgICAgICAgeDEgPSB4MSB8IDA7XHJcbiAgICAgICAgeTEgPSB5MSB8IDA7XHJcbiAgICAgICAgeDIgPSB4MiB8IDA7XHJcbiAgICAgICAgeTIgPSB5MiB8IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGR4ID0geDIgLSB4MTtcclxuICAgICAgICBjb25zdCBkeSA9IHkyIC0geTE7XHJcblxyXG4gICAgICAgIC8vIOS4uuS9leimgeWMuuWIhuaWnOeOh+aYr+WQpuWBj+awtOW5s+i/mOaYr+WeguebtOWRou+8n+WboOS4uuWmguaenOS4jeWMuuWIhu+8jOS+i+WmguW9k+aWnOeOh+Wkp+S6jjHml7bvvIzkvJrlr7zoh7Tnm7Tnur/nu5jliLbkuI3ov57nu63vvIzlm6DkuLp55Lya6Lez5Y+Y77yM6ICM5LiN5piv6L+e57ut55qE5aKe5Yqg44CCXHJcbiAgICAgICAgLy8g5Y+q5pyJ5pac546H5Yia5aW95Li6MeaXtu+8jHjot5955omN5piv6L+e57ut5ZCM5q2l6Ieq5aKe55qE77yMeCsx77yM5YiZeeS5nysxXHJcbiAgICAgICAgLy8g5omA5Lul77yM5b2T5pac546H5aSn5LqOMeaXtu+8jOaIkeS7rOmcgOimgeS9v+eUqHnkvZzkuLrlvqrnjq/lj5jph4/vvIzogIzlvZPmlpznjoflsI/kuo4x5pe277yM5oiR5Lus6ZyA6KaB5L2/55SoeOS9nOS4uuW+queOr+WPmOmHj+OAglxyXG4gICAgICAgIC8vIOS4vuS4quaegeerr+S+i+WtkO+8jOW9k+aWnOeOh+S4ujDml7bvvIznm7Tnur/lsLHmmK/kuIDmnaHlnoLnm7Tnm7Tnur/vvIzlpoLmnpzov5nml7blgJnov5jnlKh45L2c5Li65b6q546v5Y+Y6YeP77yM5YiZ5Lya5a+86Ie06L+Z5p2h55u057q/5LiK5omA5pyJeeeCuemDveWvueW6lOS4gOS4qnjvvIzkuZ/lsLHmmK/or7Tov5nmnaHnur/lj5jmiJDkuIDkuKrngrnkuobjgIJcclxuXHJcbiAgICAgICAgLy8g5pac546H5bCP5LqOMe+8jOebtOe6v+WBj+awtOW5s+aDheWGte+8jOS9v+eUqHjkvZzkuLrlvqrnjq/lj5jph49cclxuICAgICAgICBpZiAoTWF0aC5hYnMoZHgpID4gTWF0aC5hYnMoZHkpKSB7XHJcbiAgICAgICAgICAgIC8vIOS4i+mdoueahOW+queOr+e7mOWItuWHveaVsOaYr+S7juW3puW+gOWPs+eahO+8jOi/memHjOimgeehruS/nee7k+adn+eCueWcqOW8gOWni+eCueeahOWPs+i+uVxyXG4gICAgICAgICAgICBpZiAoeDIgPCB4MSkgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcblxyXG4gICAgICAgICAgICAvLyDmlpznjodcclxuICAgICAgICAgICAgY29uc3QgYSA9IGR5IC8gZHg7XHJcbiAgICAgICAgICAgIC8vIOaIqui3ne+8iHk9YXgrYu+8jGI9eS1heO+8iVxyXG4gICAgICAgICAgICAvLyBjb25zdCBiID0geTEgLSBhICogeDE7XHJcbiAgICAgICAgICAgIGxldCB5ID0geTE7XHJcbiAgICAgICAgICAgIC8vIOe7mOWItuebtOe6v1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geDE7IHggPD0geDI7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgLy8g55u057q/5YWs5byPeT1heCti77yM6L+Z6YeM5LiN5b+F6K6h566X6L+Z5Liq5YWs5byP77yM5Zug5Li65b2TeOWKoDHoh6rlop7ml7bvvIx55Lmf5Lya5YqgYe+8jOaJgOS7peWPr+S7peebtOaOpeeUqHkrYeS7o+abv2F4K2LvvIznrpfmmK/kuIDkuKrmgKfog73kvJjljJbngrlcclxuICAgICAgICAgICAgICAgIC8vIHkgPSBhICogeCArIGI7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaIllxyXG4gICAgICAgICAgICAvLyBjb25zdCB5cyA9IHRoaXMuSW50ZXJwb2xhdGUoeDEsIHkxLCB4MiwgeTIpO1xyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCB4ID0geDE7IHggPD0geDI7IHgrKykge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeXNbeCAtIHgxXSwgY29sb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOaWnOeOh+Wkp+S6jjHvvIznm7Tnur/lgY/lnoLnm7Tmg4XlhrXvvIzkvb/nlKh55L2c5Li65b6q546v5Y+Y6YePXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh5MiA8IHkxKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkeCAvIGR5O1xyXG4gICAgICAgICAgICBsZXQgeCA9IHgxO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyBhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiJZcclxuICAgICAgICAgICAgLy8gY29uc3QgeHMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICAgICAgLy8gZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuRHJhd1BpeGVsKHhzW3kgLSB5MV0sIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgxLCB5MSwgeDIsIHkyLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MiwgeTIsIHgzLCB5MywgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDMsIHkzLCB4MSwgeTEsIGNvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDms6jvvJrku6XkuIvmj5DliLDnmoTplb/ovrnvvIznibnmjId56L206Leo5bqm5pyA6ZW/55qE6L6577yM6ICM5LiN5piv5a6e6ZmF5LiK55qE6L656ZW/XHJcblxyXG4gICAgICAgIC8vIOWunumZhee7mOWItuWIsOWxj+W5leS4iueahOeCue+8jOW/hemhu+aYr+aVtOaVsO+8jOWPluaVtOS4gOS4i+OAguS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuICAgICAgICB4MyA9IHgzIHwgMDtcclxuICAgICAgICB5MyA9IHkzIHwgMDtcclxuXHJcbiAgICAgICAgLy8g5a+554K56L+b6KGM5o6S5bqP77yM5L2/5b6XeTE8PXkyPD15M++8jOWNs+WPr+ehruWumuS4ieinkuW9oueahOmVv+i+ueS4ukwxM++8jEwxMuWSjEwyM+WImeaYr+WPpuWkluS4pOadoeefrei+uVxyXG4gICAgICAgIGlmICh5MSA+IHkyKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzXSA9IFt4MywgeTMsIHgxLCB5MV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5M10gPSBbeDMsIHkzLCB4MiwgeTJdO1xyXG5cclxuICAgICAgICAvLyDojrflj5Yz5p2h6L6555qE54K55Z2Q5qCH5ZCI6ZuGXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDIzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MiwgeDIsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcblxyXG4gICAgICAgIC8vIOaLvOWQiOS4pOadoeefrei+ueS4uuS4gOadoemVv+i+ue+8iOWFiOenu+mZpOesrOS4gOadoei+ueeahOacgOWQjuS4gOS4quaVsOaNru+8jOmBv+WFjemHjeWkje+8iVxyXG4gICAgICAgIC8vIOeOsOWcqOWPmOaIkDLmnaHplb/ovrnvvIxMMTPlkoxMMTIzXHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcblxyXG4gICAgICAgIC8vIOWIpOaWrUwxM+WSjEwxMjPlk6rmnaHplb/ovrnmmK/lt6blk6rmnaHmmK/lj7PvvIzpg73lj5bmlbDnu4TkuK3pl7TnmoTngrnvvIzliKTmlq3osIHlt6bosIHlj7PljbPlj6/jgIJcclxuICAgICAgICAvLyDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgLy8gY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBjb25zdCBtID0gKHAxMjMubGVuZ3RoID4+IDEpIHwgMDtcclxuICAgICAgICBsZXQgcExlZnQgPSBwMTIzO1xyXG4gICAgICAgIGxldCBwUmlnaHQgPSBwMTM7XHJcbiAgICAgICAgaWYgKHAxM1ttXSA8IHAxMjNbbV0pIHtcclxuICAgICAgICAgICAgcExlZnQgPSBwMTM7XHJcbiAgICAgICAgICAgIHBSaWdodCA9IHAxMjM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu5jliLbmsLTlubPnur/mrrVcclxuICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTM7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gcExlZnRbeSAtIHkxXTsgeCA8PSBwUmlnaHRbeSAtIHkxXTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcihcclxuICAgICAgICB4MTogbnVtYmVyLCB5MTogbnVtYmVyLFxyXG4gICAgICAgIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsXHJcbiAgICAgICAgeDM6IG51bWJlciwgeTM6IG51bWJlcixcclxuICAgICAgICBjb2xvcjE6IG51bWJlciwgY29sb3IyOiBudW1iZXIsIGNvbG9yMzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyDlrp7pmYXnu5jliLbliLDlsY/luZXkuIrnmoTngrnvvIzlv4XpobvmmK/mlbTmlbDvvIzlj5bmlbTkuIDkuIvjgILkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgeDEgPSB4MSB8IDA7XHJcbiAgICAgICAgeTEgPSB5MSB8IDA7XHJcbiAgICAgICAgeDIgPSB4MiB8IDA7XHJcbiAgICAgICAgeTIgPSB5MiB8IDA7XHJcbiAgICAgICAgeDMgPSB4MyB8IDA7XHJcbiAgICAgICAgeTMgPSB5MyB8IDA7XHJcblxyXG4gICAgICAgIC8vIOWvueeCueaMiVnlnZDmoIfmjpLluo/vvIznoa7kv515MSA8PSB5MiA8PSB5M1xyXG4gICAgICAgIGlmICh5MSA+IHkyKSBbeDEsIHkxLCB4MiwgeTIsIGNvbG9yMSwgY29sb3IyXSA9IFt4MiwgeTIsIHgxLCB5MSwgY29sb3IyLCBjb2xvcjFdO1xyXG4gICAgICAgIGlmICh5MSA+IHkzKSBbeDEsIHkxLCB4MywgeTMsIGNvbG9yMSwgY29sb3IzXSA9IFt4MywgeTMsIHgxLCB5MSwgY29sb3IzLCBjb2xvcjFdO1xyXG4gICAgICAgIGlmICh5MiA+IHkzKSBbeDIsIHkyLCB4MywgeTMsIGNvbG9yMiwgY29sb3IzXSA9IFt4MywgeTMsIHgyLCB5MiwgY29sb3IzLCBjb2xvcjJdO1xyXG5cclxuICAgICAgICAvLyDmj5Dlj5ZSR0LliIbph49cclxuICAgICAgICBjb25zdCBjMSA9IENvbG9yLkZyb21VaW50MzIoY29sb3IxKTtcclxuICAgICAgICBjb25zdCBjMiA9IENvbG9yLkZyb21VaW50MzIoY29sb3IyKTtcclxuICAgICAgICBjb25zdCBjMyA9IENvbG9yLkZyb21VaW50MzIoY29sb3IzKTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85Ye95pWw77yM6aKc6ImyMeS4juminOiJsjLlnKhkMS1kMueahOiMg+WbtOWGheWdh+WMgOaPkuWAvFxyXG4gICAgICAgIGNvbnN0IGludGVycG9sYXRlQ29sb3IgPSAoZDE6IG51bWJlciwgcjE6IG51bWJlciwgZzE6IG51bWJlciwgYjE6IG51bWJlciwgYTE6IG51bWJlcixcclxuICAgICAgICAgICAgZDI6IG51bWJlciwgcjI6IG51bWJlciwgZzI6IG51bWJlciwgYjI6IG51bWJlciwgYTI6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAvLyDpooTliIbphY3mlbDnu4TlpKflsI9cclxuICAgICAgICAgICAgLy8g5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcuWSjE1hdGguYWJz77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGR4ID0gTWF0aC5hYnMoTWF0aC5mbG9vcihkMiAtIGQxKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGR4ID0gKChkMiA+IGQxID8gZDIgLSBkMSA6IGQxIC0gZDIpIHwgMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheShkeCArIDEpO1xyXG5cclxuICAgICAgICAgICAgLy8g6K6h566X5q2l6ZW/XHJcbiAgICAgICAgICAgIGNvbnN0IGludkRlbHRhID0gMSAvIChkMiAtIGQxKTtcclxuICAgICAgICAgICAgY29uc3QgclN0ZXAgPSAocjIgLSByMSkgKiBpbnZEZWx0YTtcclxuICAgICAgICAgICAgY29uc3QgZ1N0ZXAgPSAoZzIgLSBnMSkgKiBpbnZEZWx0YTtcclxuICAgICAgICAgICAgY29uc3QgYlN0ZXAgPSAoYjIgLSBiMSkgKiBpbnZEZWx0YTtcclxuICAgICAgICAgICAgY29uc3QgYVN0ZXAgPSAoYTIgLSBhMSkgKiBpbnZEZWx0YTtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gcjEsIGcgPSBnMSwgYiA9IGIxLCBhID0gYTE7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGR4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHsgciwgZywgYiwgYSB9O1xyXG4gICAgICAgICAgICAgICAgciArPSByU3RlcDtcclxuICAgICAgICAgICAgICAgIGcgKz0gZ1N0ZXA7XHJcbiAgICAgICAgICAgICAgICBiICs9IGJTdGVwO1xyXG4gICAgICAgICAgICAgICAgYSArPSBhU3RlcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIOaPkuWAvOS4ieadoei+ueeahOWdkOagh+WSjOminOiJslxyXG4gICAgICAgIGNvbnN0IHAxMiA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgIGNvbnN0IHAxMkNvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTEsIGMxLnIsIGMxLmcsIGMxLmIsIGMxLmEsIHkyLCBjMi5yLCBjMi5nLCBjMi5iLCBjMi5hKTtcclxuXHJcbiAgICAgICAgY29uc3QgcDIzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MiwgeDIsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDIzQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MiwgYzIuciwgYzIuZywgYzIuYiwgYzIuYSwgeTMsIGMzLnIsIGMzLmcsIGMzLmIsIGMzLmEpO1xyXG5cclxuICAgICAgICBjb25zdCBwMTMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMTNDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkxLCBjMS5yLCBjMS5nLCBjMS5iLCBjMS5hLCB5MywgYzMuciwgYzMuZywgYzMuYiwgYzMuYSk7XHJcblxyXG4gICAgICAgIC8vIOWQiOW5tuS4pOadoeefrei+uVxyXG4gICAgICAgIHAxMi5wb3AoKTtcclxuICAgICAgICBjb25zdCBwMTIzID0gcDEyLmNvbmNhdChwMjMpO1xyXG4gICAgICAgIGNvbnN0IHAxMjNDb2xvcnMgPSBwMTJDb2xvcnMuY29uY2F0KHAyM0NvbG9ycyk7XHJcblxyXG4gICAgICAgIC8vIOehruWumuW3puWPs+i+ueeVjFxyXG4gICAgICAgIC8vIGNvbnN0IG0gPSBNYXRoLmZsb29yKHAxMjMubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgbSA9IChwMTIzLmxlbmd0aCA+PiAxKSB8IDA7XHJcbiAgICAgICAgbGV0IGxlZnRQb2ludHMgPSBwMTIzO1xyXG4gICAgICAgIGxldCByaWdodFBvaW50cyA9IHAxMztcclxuICAgICAgICBsZXQgbGVmdENvbG9ycyA9IHAxMjNDb2xvcnM7XHJcbiAgICAgICAgbGV0IHJpZ2h0Q29sb3JzID0gcDEzQ29sb3JzO1xyXG5cclxuICAgICAgICBpZiAocDEzW21dIDwgcDEyM1ttXSkge1xyXG4gICAgICAgICAgICBsZWZ0UG9pbnRzID0gcDEzO1xyXG4gICAgICAgICAgICByaWdodFBvaW50cyA9IHAxMjM7XHJcbiAgICAgICAgICAgIGxlZnRDb2xvcnMgPSBwMTNDb2xvcnM7XHJcbiAgICAgICAgICAgIHJpZ2h0Q29sb3JzID0gcDEyM0NvbG9ycztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuawtOW5s+e6v+aute+8jOW5tui/m+ihjOminOiJsuaPkuWAvFxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MzsgeSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHkgLSB5MTtcclxuICAgICAgICAgICAgY29uc3QgeFN0YXJ0ID0gbGVmdFBvaW50c1tpZHhdO1xyXG4gICAgICAgICAgICBjb25zdCB4RW5kID0gcmlnaHRQb2ludHNbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnRDb2xvciA9IGxlZnRDb2xvcnNbaWR4XTtcclxuICAgICAgICAgICAgY29uc3QgcmlnaHRDb2xvciA9IHJpZ2h0Q29sb3JzW2lkeF07XHJcblxyXG4gICAgICAgICAgICAvLyDpooTorqHnrpfpopzoibLlt67lgLxcclxuICAgICAgICAgICAgY29uc3QgckRpZmYgPSByaWdodENvbG9yLnIgLSBsZWZ0Q29sb3IucjtcclxuICAgICAgICAgICAgY29uc3QgZ0RpZmYgPSByaWdodENvbG9yLmcgLSBsZWZ0Q29sb3IuZztcclxuICAgICAgICAgICAgY29uc3QgYkRpZmYgPSByaWdodENvbG9yLmIgLSBsZWZ0Q29sb3IuYjtcclxuICAgICAgICAgICAgY29uc3QgYURpZmYgPSByaWdodENvbG9yLmEgLSBsZWZ0Q29sb3IuYTtcclxuXHJcbiAgICAgICAgICAgIC8vIOatpemVv+WSjOminOiJsuWinumHj1xyXG4gICAgICAgICAgICBjb25zdCBpbnZMZW5ndGggPSAxIC8gKCh4RW5kIC0geFN0YXJ0KSArIDEpO1xyXG4gICAgICAgICAgICBjb25zdCByU3RlcCA9IHJEaWZmICogaW52TGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBnU3RlcCA9IGdEaWZmICogaW52TGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBiU3RlcCA9IGJEaWZmICogaW52TGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBhU3RlcCA9IGFEaWZmICogaW52TGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgLy8g5Yid5aeL6aKc6Imy5YC8XHJcbiAgICAgICAgICAgIGxldCByID0gbGVmdENvbG9yLnI7XHJcbiAgICAgICAgICAgIGxldCBnID0gbGVmdENvbG9yLmc7XHJcbiAgICAgICAgICAgIGxldCBiID0gbGVmdENvbG9yLmI7XHJcbiAgICAgICAgICAgIGxldCBhID0gbGVmdENvbG9yLmE7XHJcblxyXG4gICAgICAgICAgICAvLyDmsLTlubPmlrnlkJHpopzoibLmj5LlgLxcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHhTdGFydDsgeCA8PSB4RW5kOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmFsQ29sb3IgPSAoKGEgfCAwKSA8PCAyNCkgfCAoKGIgfCAwKSA8PCAxNikgfCAoKGcgfCAwKSA8PCA4KSB8IChyIHwgMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBmaW5hbENvbG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDntK/liqDpopzoibLlgLxcclxuICAgICAgICAgICAgICAgIHIgKz0gclN0ZXA7XHJcbiAgICAgICAgICAgICAgICBnICs9IGdTdGVwO1xyXG4gICAgICAgICAgICAgICAgYiArPSBiU3RlcDtcclxuICAgICAgICAgICAgICAgIGEgKz0gYVN0ZXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOaKleW9seebuOWFs1xyXG5cclxuICAgIC8vIOWwhuinhuWPo+S4iueahOWGheWuueaYoOWwhOWIsOWunumZheWxj+W5leS4ilxyXG4gICAgcHVibGljIFZpZXdwb3J0VG9DYW52YXMocG9pbnQ6IFZlY3RvcjIpIHtcclxuICAgICAgICAvLyDlgYforr7op4blj6Plrr3luqbkuLox5Liq5Y2V5L2NXHJcbiAgICAgICAgLy8g5Zug5Li6YXNwZWN0UmF0aW8gPSBjYW52YXNXaWR0aCAvIGNhbnZhc0hlaWdodO+8jFxyXG4gICAgICAgIC8vIOaJgOS7peinhuWPo+mrmOW6piA9IDEgLyBhc3BlY3RSYXRpbyA9IGNhbnZhc0hlaWdodCAvIGNhbnZhc1dpZHRoXHJcbiAgICAgICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IDE7XHJcbiAgICAgICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSAxIC8gQ29uZmlnLmFzcGVjdFJhdGlvO1xyXG5cclxuICAgICAgICAvLyDlsIbmipXlvbHlnZDmoIfmmKDlsITliLBDYW52YXPlg4/ntKDlnZDmoIdcclxuICAgICAgICAvLyBY5Z2Q5qCH77ya5LuOIFstdmlld3BvcnRXaWR0aC8yLCB2aWV3cG9ydFdpZHRoLzJdIOaYoOWwhOWIsCBbMCwgY2FudmFzV2lkdGhdXHJcbiAgICAgICAgLy8gWeWdkOagh++8muS7jiBbLXZpZXdwb3J0SGVpZ2h0LzIsIHZpZXdwb3J0SGVpZ2h0LzJdIOaYoOWwhOWIsCBbMCwgY2FudmFzSGVpZ2h0XSAo5rOo5oSPWei9tOaWueWQkSlcclxuICAgICAgICBjb25zdCBjYW52YXNYID0gKChwb2ludC54ICsgdmlld3BvcnRXaWR0aCAvIDIpIC8gdmlld3BvcnRXaWR0aCkgKiBDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgY29uc3QgY2FudmFzWSA9IENvbmZpZy5jYW52YXNIZWlnaHQgLSAoKChwb2ludC55ICsgdmlld3BvcnRIZWlnaHQgLyAyKSAvIHZpZXdwb3J0SGVpZ2h0KSAqIENvbmZpZy5jYW52YXNIZWlnaHQpOyAvLyBDYW52YXPnmoRZ6L206YCa5bi45piv5ZCR5LiL55qEXHJcbiAgICAgICAgcG9pbnQueCA9IGNhbnZhc1g7XHJcbiAgICAgICAgcG9pbnQueSA9IGNhbnZhc1k7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YCP6KeG5oqV5b2x77yM5bCGM0TlnLrmma/nmoTlnZDmoIfovazmjaLkuLoyROWxj+W5leWdkOagh++8jOaKleWwhOWIsOinhuWPo+S4ilxyXG4gICAgcHVibGljIFByb2plY3RWZXJ0ZXgodmVydGV4OiBWZWN0b3IzKTogVmVjdG9yMiB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG54K55Yiw6L+R6KOB6Z2i77yI6KeG5Y+j77yJ55qE6Led56a75pivZO+8jOinhuWPo+eahOWuveaYrzFcclxuICAgICAgICAvLyDmoLnmja7kuInop5Llh73mlbDmnInvvJp0YW4oZm92LzIpID0gKDAuNSAvIGQpXHJcbiAgICAgICAgLy8g5omA5Lul77yaZCA9IDAuNSAvIHRhbihmb3YvMilcclxuICAgICAgICBjb25zdCBmb3ZEZWdyZWVzID0gNjA7XHJcbiAgICAgICAgY29uc3QgZm92UmFkaWFucyA9IGZvdkRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MCk7IC8vIOWwhuinkuW6pui9rOaNouS4uuW8p+W6plxyXG4gICAgICAgIGNvbnN0IGQgPSAwLjUgLyBNYXRoLnRhbihmb3ZSYWRpYW5zIC8gMik7XHJcblxyXG4gICAgICAgIC8vIOmAj+inhuWFrOW8j++8jOWBh+iuvuinhueCueS9jee9rigwLDAp77yM6KeG54K55Yiw6KeG5Y+j6Led56a75Li6ZO+8jOWcuuaZr+mHjOeahOeCueS4ulAoeCx5LHop77yM5oqV5bCE5Yiw6KeG5Y+j5LiK55qE54K55Li6UCcoeCx5KVxyXG4gICAgICAgIC8vIOWImeagueaNruebuOS8vOS4ieinkuW9ouacie+8mnogLyBkID0geCAvIHgnID0geSAvIHkn77yM5Y+v5b6X5Yiw77yaXHJcbiAgICAgICAgLy8geCcgPSAoZCAqIHgpIC8gelxyXG4gICAgICAgIC8vIHknID0gKGQgKiB5KSAvIHpcclxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uWCA9IChkICogdmVydGV4LngpIC8gdmVydGV4Lno7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblkgPSAoZCAqIHZlcnRleC55KSAvIHZlcnRleC56O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIocHJvamVjdGlvblgsIHByb2plY3Rpb25ZKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5Y+Y5o2iXHJcblxyXG4gICAgLypcclxuICAgICAqIOmhtueCueWkhOeQhumYtuaute+8muaooeWei+epuumXtCDihpLvvIjmqKHlnovnn6npmLXpmLXvvInihpIg5LiW55WM56m66Ze0IOKGku+8iOinhuWbvuefqemYte+8ieKGkiDop4Llr5/nqbrpl7Qg4oaS77yI5oqV5b2x55+p6Zi177yJ4oaSIOijgeWJquepuumXtCDihpLvvIjpgI/op4bpmaTms5XvvInihpIgTkRDIOepuumXtCDihpLvvIjop4blj6Plj5jmjaLvvInihpIg5bGP5bmV56m66Ze0IOKGkiDlhYnmoIXljJbmuLLmn5NcclxuICAgICAqL1xyXG4gICAgcHVibGljIFZlcnRleFByb2Nlc3NpbmdTdGFnZSh2ZXJ0aWNlczogVmVjdG9yM1tdLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IGNsaXBTcGFjZVZlcnRpY2VzID0gbmV3IEFycmF5KHZlcnRpY2VzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIC8vIOaehOW7uk1WUOefqemYtVxyXG4gICAgICAgIGNvbnN0IG1vZGVsTWF0cml4ID0gdHJhbnNmb3JtLmxvY2FsVG9Xb3JsZE1hdHJpeDtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBDYW1lcmEubWFpbkNhbWVyYTtcclxuICAgICAgICBjb25zdCBjYW1lcmFGb3J3YXJkID0gY2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVVwID0gY2FtZXJhLnRyYW5zZm9ybS51cDtcclxuICAgICAgICAvLyDmnoTlu7rkuIDkuKrlhYjmnJ3mkYTlvbHmnLrlj43mlrnlkJHnp7vliqjvvIzlho3lj43mlrnlkJHml4vovaznmoTnn6npmLXvvIzlhbblrp7lvpfliLDnmoTkuZ/lsLHmmK/kuIrpnaLmkYTlvbHmnLrnmoTkuJbnlYzlnZDmoIfnn6npmLVcclxuICAgICAgICBjb25zdCBtb2RlbFZpZXdNYXRyaXggPSBtb2RlbE1hdHJpeC5jbG9uZSgpLnRyYW5zZm9ybVRvTG9va0F0U3BhY2UoY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbiwgY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbi5hZGQoY2FtZXJhRm9yd2FyZCksIGNhbWVyYVVwKTtcclxuICAgICAgICBjb25zdCBtdnBNYXRyaXggPSBtb2RlbFZpZXdNYXRyaXgucGVyc3BlY3RpdmUoY2FtZXJhLmZvdiwgY2FtZXJhLmFzcGVjdCwgY2FtZXJhLm5lYXJDbGlwLCBjYW1lcmEuZmFyQ2xpcCk7XHJcblxyXG4gICAgICAgIC8vIDEuIE1WUOWPmOaNouWIsOijgeWJquepuumXtFxyXG4gICAgICAgIC8vIOaooeWei+epuumXtCAtPiDkuJbnlYznqbrpl7QgLT4g6KeC5a+f56m66Ze0IC0+IOijgeWJquepuumXtFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRpY2UgPSB2ZXJ0aWNlc1tpXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBsZXQgdiA9IG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodmVydGljZSwgMSkpO1xyXG4gICAgICAgICAgICBjbGlwU3BhY2VWZXJ0aWNlc1tpXSA9IHY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAyLiDpgI/op4bpmaTms5XvvJrlsIboo4Hliarnqbrpl7TlnZDmoIfovazmjaLkuLrmoIflh4borr7lpIflnZDmoIfvvIhOREPvvIlcclxuICAgICAgICAvLyDoo4Hliarnqbrpl7QgLT4g5qCH5YeG5YyW6K6+5aSH5Z2Q5qCH77yITkRDIOepuumXtO+8iVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdiA9IGNsaXBTcGFjZVZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyB35YiG6YeP5piv6YCP6KeG5oqV5b2x5Lqn55Sf55qE77yM55So5LqO6YCP6KeG6Zmk5rOVXHJcbiAgICAgICAgICAgIGNvbnN0IHcgPSB2Lnc7IC8vIOWBh+iuvuS9oOeahFZlY3RvcjQvVmVjdG9yM+WunueOsOS4re+8jOm9kOasoeWdkOagh3flrZjlgqjlnKh35bGe5oCn5Lit44CC5aaC5p6c5rKh5pyJ77yM6ZyA6KaB56Gu5L+dTVZQ5Y+Y5o2i5pe25aSE55CG5LqG6b2Q5qyh5Z2Q5qCH44CCXHJcbiAgICAgICAgICAgIC8vIOWmguaenOayoeacieaYvuW8j+eahHfliIbph4/vvIzkuJRtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3Iz6L+U5Zue55qE5pivVmVjdG9yM++8jOmCo+S5iOmAmuW4uOiupOS4unc9Me+8iOato+S6pOaKleW9se+8ieaIluiAhemcgOimgeS7juWPmOaNouefqemYteS4reiAg+iZkemAj+inhlxyXG5cclxuICAgICAgICAgICAgLy8g6L+b6KGM6YCP6KeG6Zmk5rOV77yaeHl65YiG5Yir6Zmk5Luld1xyXG4gICAgICAgICAgICAvLyDms6jmhI/vvJrlpoLmnpzkvaDnmoTnn6npmLXkuZjms5XmsqHmnInlpITnkIbpvZDmrKHlnZDmoIfvvIjljbPov5Tlm57nmoR2ZXJ0aWNl5piv5LiJ57u05ZCR6YeP77yJ77yM6YKj5LmI5b6I5Y+v6IO95L2g55qE5Y+Y5o2i5rKh5pyJ5YyF5ZCr6YCP6KeG5oqV5b2x5Lqn55Sf55qEd+WIhumHj+OAglxyXG4gICAgICAgICAgICAvLyDlgYforr7kvaDnmoRtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3Iz56Gu5a6e6L+U5Zue5LqG5YyF5ZCr6b2Q5qyh5Z2Q5qCH55qEVmVjdG9yNO+8jOaIluiAheacieS4gOS4qui/lOWbnlZlY3RvcjTnmoTmlrnms5XjgIJcclxuICAgICAgICAgICAgLy8g6L+Z6YeM5YGH6K6+IHByb2plY3RlZFZlcnRpY2VzIOS4reWtmOWCqOeahOaYryBWZWN0b3I077yM5oiW6ICF6Iez5bCR5pyJIHgsIHksIHosIHcg5bGe5oCn44CCXHJcblxyXG4gICAgICAgICAgICAvLyDlpoLmnpzmgqjnmoTlrp7njrDkuK3vvIznu4/ov4fpgI/op4bmipXlvbHnn6npmLXlj5jmjaLlkI7vvIzpobbngrnlt7Lnu4/mmK/kuIDkuKrpvZDmrKHlnZDmoIfvvIh4LCB5LCB6LCB377yJ77yM5YiZ6ZyA6KaB5Lul5LiL6Zmk5rOV77yaXHJcbiAgICAgICAgICAgIHYueCA9IHYueCAvIHc7XHJcbiAgICAgICAgICAgIHYueSA9IHYueSAvIHc7XHJcbiAgICAgICAgICAgIHYueiA9IHYueiAvIHc7IC8vIOWvueS6jua3seW6puS/oeaBr++8jOWPr+iDvei/mOmcgOimgei/m+S4gOatpeWkhOeQhu+8jOS9huWxj+W5leaYoOWwhOmAmuW4uOS4u+imgeWFs+azqHgseVxyXG4gICAgICAgICAgICAvLyDnu4/ov4fpgI/op4bpmaTms5XlkI7vvIzlnZDmoIfkvY3kuo7moIflh4borr7lpIflnZDmoIfvvIhOREPvvInnqbrpl7TvvIzpgJrluLh4LCB5LCB66IyD5Zu05ZyoWy0xLCAxXe+8iE9wZW5HTOmjjuagvO+8ieaIllswLCAxXe+8iERpcmVjdFjpo47moLzvvInkuYvpl7TjgIJcclxuICAgICAgICAgICAgLy8g5YGH6K6+5oiR5Lus55qETkRD5pivWy0xLCAxXeiMg+WbtOOAglxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMy4g6KeG5Y+j5Y+Y5o2i77ya5bCGTkRD5Z2Q5qCH5pig5bCE5Yiw5bGP5bmV5Z2Q5qCHXHJcbiAgICAgICAgLy8g5qCH5YeG5YyW6K6+5aSH5Z2Q5qCH77yITkRDIOepuumXtO+8iSAtPiDlsY/luZXnqbrpl7RcclxuICAgICAgICAvLyDojrflj5bnlLvluIPvvIjmiJbop4blj6PvvInnmoTlrr3luqblkozpq5jluqZcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IG5ldyBBcnJheShjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbmRjID0gY2xpcFNwYWNlVmVydGljZXNbaV07IC8vIOatpOaXtm5kY+W6lOivpeaYr+e7j+i/h+mAj+inhumZpOazleWQjueahE5EQ+WdkOagh1xyXG5cclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeOS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuV2lkdGhdXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblggPSAoKG5kYy54ICsgMSkgLyAyKSAqIENvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeeS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuSGVpZ2h0XeOAguazqOaEj+Wxj+W5leWdkOagh+mAmuW4uHnlkJHkuIvkuLrmraPvvIzogIxOREPnmoR55ZCR5LiK5Li65q2j77yM5omA5Lul6ZyA6KaB57+76L2sXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblkgPSBDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgobmRjLnkgKyAxKSAvIDIpICogQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICAgICAgICAgIC8vIHrliIbph4/pgJrluLjnlKjkuo7mt7HluqbmtYvor5XvvIzov5nph4zmiJHku6zlj6rlhbPlv4PlsY/luZV4LHlcclxuICAgICAgICAgICAgLy8g5aaC5p6c5L2g55qETkRDeuiMg+WbtOaYr1stMSwxXeS4lOmcgOimgeaYoOWwhOWIsFswLDFd77yI5L6L5aaCV2ViR1BV5p+Q5Lqb5oOF5Ya177yJ77yM5Y+v5Lul57G75Ly85aSE55CG77yaY29uc3Qgc2NyZWVuWiA9IChuZGMueiArIDEpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHNjcmVlblZlcnRpY2VzW2ldID0geyB4OiBzY3JlZW5YLCB5OiBzY3JlZW5ZIH07IC8vIOWtmOWCqOWxj+W5leWdkOagh1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNjcmVlblZlcnRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiDnroDljZXlj5jmjaLpmLbmrrXvvJrmsqHmnInpgJrov4fnn6npmLXorqHnrpfvvIzogIzmmK/nroDljZXnmoTnm7jkvLzkuInop5LlvaLljp/nkIbvvIzkuInop5Llh73mlbDnrpflh7pNVlDlj5jmjaLot5/lsY/luZXmmKDlsITvvIznkIbop6PotbfmnaXmr5TovoPnroDljZXvvIzkvYbmr4/kuKrpobbngrnpg73nu4/ov4fku47lpLTliLDlsL7nmoTorqHnrpfvvIzmr5TovoPogJfmgKfog71cclxuICAgICAqL1xyXG4gICAgcHVibGljIEVhc3lWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2UodmVydGljZXM6IFZlY3RvcjNbXSwgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBjbGlwU3BhY2VWZXJ0aWNlcyA9IG5ldyBBcnJheSh2ZXJ0aWNlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyDnroDljZXlj5jmjaJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCB2ZXJ0aWNlID0gdmVydGljZXNbaV0uY2xvbmUoKTtcclxuICAgICAgICAgICAgLy8g5YWI5Y+Y5o2i77yM5b+F6aG75Lil5qC85oyJ54Wn5YWI57yp5pS+77yM5YaN5peL6L2s77yM5YaN5bmz56e7XHJcbiAgICAgICAgICAgIHRoaXMuU2NhbGVWZXJ0ZXgodmVydGljZSwgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdGhpcy5Sb3RhdGVWZXJ0ZXgodmVydGljZSwgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdGhpcy5UcmFuc2xhdGVWZXJ0ZXgodmVydGljZSwgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgLy8g5YaN5oqV5b2xXHJcbiAgICAgICAgICAgIGNsaXBTcGFjZVZlcnRpY2VzW2ldID0gdGhpcy5Qcm9qZWN0VmVydGV4KHZlcnRpY2UpO1xyXG4gICAgICAgICAgICAvLyDlho3op4blj6PmmKDlsIRcclxuICAgICAgICAgICAgdGhpcy5WaWV3cG9ydFRvQ2FudmFzKGNsaXBTcGFjZVZlcnRpY2VzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbGlwU3BhY2VWZXJ0aWNlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2NhbGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZlcnRleC54ICo9IHRyYW5zZm9ybS5zY2FsZS54O1xyXG4gICAgICAgIHZlcnRleC55ICo9IHRyYW5zZm9ybS5zY2FsZS55O1xyXG4gICAgICAgIHZlcnRleC56ICo9IHRyYW5zZm9ybS5zY2FsZS56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBSb3RhdGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IGV1bGVyQW5nbGVzID0gdHJhbnNmb3JtLnJvdGF0aW9uLmV1bGVyQW5nbGVzO1xyXG5cclxuICAgICAgICBjb25zdCBjb3NYID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueCk7XHJcbiAgICAgICAgY29uc3Qgc2luWCA9IE1hdGguc2luKGV1bGVyQW5nbGVzLngpO1xyXG4gICAgICAgIGNvbnN0IGNvc1kgPSBNYXRoLmNvcyhldWxlckFuZ2xlcy55KTtcclxuICAgICAgICBjb25zdCBzaW5ZID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueSk7XHJcbiAgICAgICAgY29uc3QgY29zWiA9IE1hdGguY29zKGV1bGVyQW5nbGVzLnopO1xyXG4gICAgICAgIGNvbnN0IHNpblogPSBNYXRoLnNpbihldWxlckFuZ2xlcy56KTtcclxuICAgICAgICAvLyDlhYjnu5Va6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeCA9IHZlcnRleC54ICogY29zWiAtIHZlcnRleC55ICogc2luWjtcclxuICAgICAgICBjb25zdCB5ID0gdmVydGV4LnggKiBzaW5aICsgdmVydGV4LnkgKiBjb3NaO1xyXG4gICAgICAgIHZlcnRleC54ID0geDtcclxuICAgICAgICB2ZXJ0ZXgueSA9IHk7XHJcbiAgICAgICAgLy8g5YaN57uVWei9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHogPSB2ZXJ0ZXgueiAqIGNvc1kgLSB2ZXJ0ZXgueCAqIHNpblk7XHJcbiAgICAgICAgY29uc3QgeDIgPSB2ZXJ0ZXgueiAqIHNpblkgKyB2ZXJ0ZXgueCAqIGNvc1k7XHJcbiAgICAgICAgdmVydGV4LnogPSB6O1xyXG4gICAgICAgIHZlcnRleC54ID0geDI7XHJcbiAgICAgICAgLy8g5pyA5ZCO57uVWOi9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHkyID0gdmVydGV4LnkgKiBjb3NYIC0gdmVydGV4LnogKiBzaW5YO1xyXG4gICAgICAgIGNvbnN0IHoyID0gdmVydGV4LnkgKiBzaW5YICsgdmVydGV4LnogKiBjb3NYO1xyXG4gICAgICAgIHZlcnRleC55ID0geTI7XHJcbiAgICAgICAgdmVydGV4LnogPSB6MjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVHJhbnNsYXRlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2ZXJ0ZXgueCArPSB0cmFuc2Zvcm0ucG9zaXRpb24ueDtcclxuICAgICAgICB2ZXJ0ZXgueSArPSB0cmFuc2Zvcm0ucG9zaXRpb24ueTtcclxuICAgICAgICB2ZXJ0ZXgueiArPSB0cmFuc2Zvcm0ucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5YmU6Zmk6KOB5YmqXHJcblxyXG4gICAgLy8g6KeG6ZSl5L2T5YmU6ZmkXHJcbiAgICBwdWJsaWMgRnJ1c3R1bUN1bGxpbmcoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOiDjOmdouWJlOmZpFxyXG4gICAgcHVibGljIEJhY2tmYWNlQ3VsbGluZygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YGu5oyh5YmU6ZmkXHJcbiAgICBwdWJsaWMgT2NjbHVzaW9uQ3VsbGluZygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENsaXBUcmlhbmdsZSh0cmlhbmdsZTogVmVjdG9yM1tdKSB7XHJcbiAgICAgICAgLy8gMS7orqHnrpfkuInop5LlvaLnmoTkuK3lv4NcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgKHRyaWFuZ2xlWzBdLnggKyB0cmlhbmdsZVsxXS54ICsgdHJpYW5nbGVbMl0ueCkgLyAzLFxyXG4gICAgICAgICAgICAodHJpYW5nbGVbMF0ueSArIHRyaWFuZ2xlWzFdLnkgKyB0cmlhbmdsZVsyXS55KSAvIDMsXHJcbiAgICAgICAgICAgICh0cmlhbmdsZVswXS56ICsgdHJpYW5nbGVbMV0ueiArIHRyaWFuZ2xlWzJdLnopIC8gM1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOe7mOWItueJqeS9k1xyXG5cclxuICAgIHB1YmxpYyBEcmF3T2JqZWN0KHJlbmRlcmVyOiBSZW5kZXJlcikge1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gKHJlbmRlcmVyIGFzIE1lc2hSZW5kZXJlcikubWVzaDtcclxuICAgICAgICBpZiAoIW1vZGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGljZXMgPSBtb2RlbC5mYWNlcy5mbGF0TWFwKGZhY2UgPT4gZmFjZS52ZXJ0ZXhJbmRpY2VzKTtcclxuXHJcbiAgICAgICAgLy8gMS7liZTpmaRcclxuICAgICAgICB0aGlzLkZydXN0dW1DdWxsaW5nKCk7XHJcbiAgICAgICAgdGhpcy5CYWNrZmFjZUN1bGxpbmcoKTtcclxuICAgICAgICB0aGlzLk9jY2x1c2lvbkN1bGxpbmcoKTtcclxuXHJcbiAgICAgICAgLy8gMi7lj5jmjaJcclxuICAgICAgICAvLyBNVlDlj5jmjaJcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IHRoaXMuVmVydGV4UHJvY2Vzc2luZ1N0YWdlKG1vZGVsLnZlcnRpY2VzLCByZW5kZXJlci50cmFuc2Zvcm0pO1xyXG4gICAgICAgIC8vIOeugOWNlU1WUOWPmOaNolxyXG4gICAgICAgIC8vIGNvbnN0IHNjcmVlblZlcnRpY2VzID0gdGhpcy5FYXN5VmVydGV4UHJvY2Vzc2luZ1N0YWdlKG9iaik7XHJcblxyXG4gICAgICAgIC8vIDMu6KOB5YmqXHJcblxyXG4gICAgICAgIC8vIDQu5YWJ5qCF5YyW5LiO5YOP57Sg57uY55S7XHJcbiAgICAgICAgLy8g5pyA5ZCO57uY5Yi25LiJ6KeS5b2i5Yiw5bGP5bmV5LiKXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAxID0gc2NyZWVuVmVydGljZXNbaW5kaWNlc1tpXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0gc2NyZWVuVmVydGljZXNbaW5kaWNlc1tpICsgMV1dO1xyXG4gICAgICAgICAgICBjb25zdCBwMyA9IHNjcmVlblZlcnRpY2VzW2luZGljZXNbaSArIDJdXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOe6v+ahhuaooeW8j++8jOaaguS4jeaUr+aMgemhtueCueiJslxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuV2lyZWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZShwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAxLngsIHAxLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAyLngsIHAyLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5TaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1RyaWFuZ2xlKHAxLngsIHAxLnksIHAyLngsIHAyLnksIHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5bel5YW35Ye95pWwXHJcblxyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIOe6v+aAp+aPkuWAvFxyXG4gICAgLy8vIOS8oOWFpTLkuKrngrnvvIzov5Tlm57lroPku6znu4TmiJDnur/mrrXnmoTmj5LlgLzjgIJcclxuICAgIC8vLyDopoHmsYLvvJpcclxuICAgIC8vLyAxLiDopoHlhYjnrpflh7rnm7Tnur/lgY/msLTlubPov5jmmK/lnoLnm7TvvIzlpoLmnpzmmK/lgY/msLTlubPvvIjmlpznjoflsI/kuo4x77yJ77yM5YiZ5LuleOS4uuW+queOr++8jOS8oOWFpemhuuW6j+aYryh4MSx5MSx4Mix5MinvvIzlj43kuYvlpoLmnpznm7Tnur/lgY/lnoLnm7TvvIzliJnmmK8oeTEseDEseTIseDIpXHJcbiAgICAvLy8gMi4g5ZCM5pe26KaB56Gu5L+d57q/5q6154K555qE5pa55ZCR5piv5LuO5bem5b6A5Y+z5oiW5LuO5LiK5b6A5LiL77yM5L6L5aaC57q/5q615piv5YGP5rC05bmz55qE6K+d77yM6KaB56Gu5L+deDI+eDHvvIzlpoLmnpzmmK/lgY/lnoLnm7TnmoTor53vvIzopoHnoa7kv515Mj55MVxyXG4gICAgLy8vIOS4vuS4quS+i+WtkO+8mlxyXG4gICAgLy8vIOeCuSgwLCAwKeWSjCgyLDEp77yM5Lyg5YWl55qE5Y+C5pWw5pivKDAsIDAsIDIsIDEp77yM6L+U5Zue55qE5pivKCgyLTApKzE9MynkuKrlgLzvvIzov5nkupvlgLzmmK/ku44oMC0xKeS4remXtOaPkuWAvOeahO+8jOWNsygwLCAwLjUsIDEpXHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgcHJpdmF0ZSBJbnRlcnBvbGF0ZShhMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMjogbnVtYmVyLCBiMjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj+S7pemBv+WFjeWKqOaAgeaJqeWuuVxyXG4gICAgICAgIC8vIGNvbnN0IGR4ID0gTWF0aC5hYnMoTWF0aC5mbG9vcihhMiAtIGExKSk7XHJcbiAgICAgICAgY29uc3QgZHggPSAoKGEyID4gYTEgPyBhMiAtIGExIDogYTEgLSBhMikgfCAwKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBBcnJheShkeCArIDEpO1xyXG4gICAgICAgIGNvbnN0IGEgPSAoYjIgLSBiMSkgLyAoYTIgLSBhMSk7XHJcbiAgICAgICAgbGV0IGQgPSBiMTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICB2YWx1ZVtpXSA9IGQ7XHJcbiAgICAgICAgICAgIGQgKz0gYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NlbmUge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcm9vdEdhbWVPYmplY3RzOiBHYW1lT2JqZWN0W10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGFkZEdhbWVPYmplY3QoZ2FtZU9iamVjdDogR2FtZU9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucm9vdEdhbWVPYmplY3RzLnB1c2goZ2FtZU9iamVjdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyByZW1vdmVHYW1lT2JqZWN0KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucm9vdEdhbWVPYmplY3RzLmluZGV4T2YoZ2FtZU9iamVjdCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RHYW1lT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFJvb3RHYW1lT2JqZWN0cygpOiBHYW1lT2JqZWN0W10ge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5yb290R2FtZU9iamVjdHNdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOabtOaWsOaJgOacieaguea4uOaIj+WvueixoeWPiuWFtuWtkOWvueixoVxyXG4gICAgICAgIGZvciAoY29uc3QgZ2FtZU9iamVjdCBvZiB0aGlzLnJvb3RHYW1lT2JqZWN0cykge1xyXG4gICAgICAgICAgICBnYW1lT2JqZWN0LnN0YXJ0Q29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICBnYW1lT2JqZWN0LnVwZGF0ZUNvbXBvbmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTY2VuZSB9IGZyb20gXCIuL1NjZW5lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NlbmVNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogU2NlbmVNYW5hZ2VyO1xyXG4gICAgcHJpdmF0ZSBzY2VuZXM6IE1hcDxzdHJpbmcsIFNjZW5lPiA9IG5ldyBNYXA8c3RyaW5nLCBTY2VuZT4oKTtcclxuICAgIHByaXZhdGUgYWN0aXZlU2NlbmU6IFNjZW5lIHwgbnVsbCA9IG51bGw7XHJcbiAgICBcclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBpbnN0YW5jZSgpOiBTY2VuZU1hbmFnZXIge1xyXG4gICAgICAgIGlmICghU2NlbmVNYW5hZ2VyLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBTY2VuZU1hbmFnZXIuX2luc3RhbmNlID0gbmV3IFNjZW5lTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU2NlbmVNYW5hZ2VyLl9pbnN0YW5jZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGNyZWF0ZVNjZW5lKG5hbWU6IHN0cmluZyk6IFNjZW5lIHtcclxuICAgICAgICBjb25zdCBzY2VuZSA9IG5ldyBTY2VuZShuYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lcy5zZXQobmFtZSwgc2NlbmUpO1xyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFNjZW5lKG5hbWU6IHN0cmluZyk6IFNjZW5lIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2VuZXMuZ2V0KG5hbWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0QWN0aXZlU2NlbmUoc2NlbmU6IFNjZW5lIHwgc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzY2VuZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRTY2VuZSA9IHRoaXMuc2NlbmVzLmdldChzY2VuZSk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZFNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVNjZW5lID0gZm91bmRTY2VuZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRBY3RpdmVTY2VuZSgpOiBTY2VuZSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVNjZW5lO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdXBkYXRlQWN0aXZlU2NlbmUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlU2NlbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRoL01hdHJpeDR4NFwiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdDogR2FtZU9iamVjdDtcclxuICAgIHB1YmxpYyByZWFkb25seSBjaGlsZHJlbjogQXJyYXk8VHJhbnNmb3JtPjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnQ6IFRyYW5zZm9ybSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFBvczogVmVjdG9yMztcclxuICAgIHByaXZhdGUgX3RlbXBSb3Q6IFF1YXRlcm5pb247XHJcbiAgICBwcml2YXRlIF90ZW1wU2NhbGU6IFZlY3RvcjM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdCA9IGdhbWVPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBBcnJheTxUcmFuc2Zvcm0+KCk7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBRdWF0ZXJuaW9uLmlkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuX3RlbXBTY2FsZSA9IFZlY3RvcjMuT05FO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VsZk1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHJldHVybiBNYXRyaXg0eDQuZ2V0VFJTTWF0cml4KHRoaXMuX3RlbXBQb3MsIHRoaXMuX3RlbXBSb3QsIHRoaXMuX3RlbXBTY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBsb2NhbFRvV29ybGRNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5sb2NhbFRvV29ybGRNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHAubXVsdGlwbHkodGhpcy5zZWxmTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkVG9Mb2NhbE1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBwID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LndvcmxkVG9Mb2NhbE1hdHJpeCA6IE1hdHJpeDR4NC5pZGVudGl0eTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxmTWF0cml4LmludmVyc2UoKS5tdWx0aXBseShwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeCh4OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeSh5OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueSA9IHk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHooKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeih6OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueiA9IHo7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGZvcndhcmQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy/miJHku6zopoHlvpfliLDnmoTmmK/kuIDkuKrmlrnlkJHvvIzlm6DmraTkuI3pnIDopoHkvY3nva7kv6Hmga/vvIzlsIbpvZDmrKHlnZDmoIfnmoR36K6+572u5Li6MO+8jOaKm+W8g+aOieWdkOagh+S/oeaBr1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5GT1JXQVJELCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHVwKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5VUCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByaWdodCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuUklHSFQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBQb3MuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHBvc2l0aW9uKHBvczogVmVjdG9yMykge1xyXG4gICAgICAgIHRoaXMuX3RlbXBQb3MgPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRUcmFuc2xhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUm90LmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByb3RhdGlvbihxOiBRdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgdGhpcy5fdGVtcFJvdCA9IHE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFJvdGF0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRFdWxlckFuZ2xlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBTY2FsZS5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2NhbGUoczogVmVjdG9yMykge1xyXG4gICAgICAgIHRoaXMuX3RlbXBTY2FsZSA9IHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRTY2FsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFyZW50KCk6IFRyYW5zZm9ybSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFBhcmVudChwYXJlbnQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCAmJiBwYXJlbnQgIT0gdGhpcyAmJiBwYXJlbnQgIT0gdGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgLy/pmLLmraLlh7rnjrDvvJrniLboioLngrnmmK/lvZPliY3oioLngrnnmoTlrZDoioLngrnvvIzlsIblrZDoioLnmoTorr7nva7kuLroh6rlt7HnmoTniLboioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5oYXNQYXJlbnQodGhpcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2V0IHBhcmVudCwgdGhpcyBub2RlIGlzIHRoZSBwYXJlbnQgbm9kZSdzIHBhcmVudC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN6IqC54K55pyJ54i26IqC54K577yM6KaB5YWI56e76Zmk5pen55qEXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocGFyZW50ID09IG51bGwgJiYgdGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+iKgueCuXDmmK/lkKbmmK/lvZPliY3oioLngrnnmoTkuIrnuqdcclxuICAgIHB1YmxpYyBoYXNQYXJlbnQocDogVHJhbnNmb3JtKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLnBhcmVudCA9PSBwKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5oYXNQYXJlbnQocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRDaGlsZChjaGlsZDogVHJhbnNmb3JtLCB3b3JsZFBvc2l0aW9uU3RheXM6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQgIT0gdGhpcyAmJiAhdGhpcy5jaGlsZHJlbi5pbmNsdWRlcyhjaGlsZCkpIHtcclxuICAgICAgICAgICAgLy/pmLLmraLlh7rnjrDvvJpjaGlsZOiKgueCueaYr+W9k+WJjeiKgueCueeahOeItuiKgueCue+8jOWwhueItuiKgueahOiuvue9ruS4uuiHquW3seeahOWtkOiKgueCue+8jOS8muatu+W+queOr1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQYXJlbnQoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjaGlsZCwgdGhpcyBub2RlIGlzIHRoZSBjaGlsZCBub2RlJ3MgY2hpbGQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOWtkOiKgueCueacieaXp+eahOeItuiKgueCue+8jOimgeWFiOenu+mZpFxyXG4gICAgICAgICAgICBpZiAoY2hpbGQucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCwgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAod29ybGRQb3NpdGlvblN0YXlzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S/neeVmeWOn+S4lueVjOWdkOagh+S9jee9ru+8jOWFiOacneeItuiKgueCueeahOWPmOaNoueahOWPjeaWueWQkeenu+WKqO+8jOeEtuWQjuWGjea3u+WKoOi/m+WOu++8jOWwseiDveS/neaMgeS4lueVjOWdkOagh+S4jeWPmFxyXG4gICAgICAgICAgICAgICAgLy/ljbPlj5jmjaLliLDniLboioLngrnnmoTpgIbnn6npmLXph4xcclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCwgMCk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAod29ybGRQb3NpdGlvblN0YXlzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S/neeVmeS4lueVjOWdkOagh++8jOebtOaOpeWwhuacrOWcsOWdkOagh+etieWQjOS6juW9k+WJjeS4lueVjOWdkOagh+WNs+WPr1xyXG4gICAgICAgICAgICAgICAgdmFyIG0gPSB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5tdWx0aXBseShjaGlsZC5zZWxmTWF0cml4KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUG9zID0gbS5nZXRUcmFuc2xhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUm90ID0gbS5nZXRSb3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wU2NhbGUgPSBtLmdldFNjYWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbnZlcnRUb05vZGVTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKuWwhuafkOS4quWdkOagh+i9rOWIsOiHquW3seeahOWxgOmDqOepuumXtO+8jOS+i+WmguW9k+WJjeeahOWxgOmDqOWdkOagh+WOn+eCueWcqOS4lueVjOWdkOagh+eahO+8iDHvvIwx77yJ5aSEXHJcbiAgICAgICAgICrngrlw5Zyo5LiW55WM5Z2Q5qCH77yIMu+8jDHvvInlpITvvIzpgqPkuYjlsIbngrlw55u45a+55LqO5b2T5YmN5bGA6YOo5Z2Q5qCH57O755qE5L2N572u5bCx5piv77yIMu+8jDHvvIkt77yIMe+8jDHvvIk9IO+8iDHvvIwgMO+8iVxyXG4gICAgICAgICAq5Y2z5bCG54K5cOWPjeWQkeWPmOaNouW9k+WJjeeahOefqemYtSBcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Xb3JsZFNwYWNlKHY6IFZlY3RvcjMsIHc6IG51bWJlciA9IDEpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95KGRlc3Ryb3lDaGlsZHJlbjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoZGVzdHJveUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KGRlc3Ryb3lDaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgT0JKTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcclxuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gXCIuL0RpY3Rpb25hcnlcIjtcclxuaW1wb3J0IHsgT0JKUGFyc2VyIH0gZnJvbSBcIi4vT2JqUGFyc2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXNzZXRMb2FkZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZmlsZUNhY2hlOiBEaWN0aW9uYXJ5ID0gbmV3IERpY3Rpb25hcnkoKTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRJbWFnZUZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PigocmVzb2x2ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgdGhlIGltYWdlIG9iamVjdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgb24gbG9hZGluZyBhbiBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIGltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6Leo5Yy66K+35rGCXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5jcm9zc09yaWdpbiA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGVsbCB0aGUgYnJvd3NlciB0byBsb2FkIGFuIGltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBmaWxlTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZFRleHRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCByZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5LiN6KaB5byA5ZCv5byC5q2l77yM6K6+572u5Li6ZmFsc2XvvIzlkKbliJnlrrnmmJPljaHlnKhyZWFkeVN0YXRlID0gMe+8jOWOn+WboOS4jeaYjlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIGZpbGVOYW1lLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRNb2RlbEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8T0JKRG9jPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPE9CSkRvYz4oKHJlc29sdmUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iakRvYyA9IG5ldyBPQkpEb2MoZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IG9iakRvYy5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgMSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk9CSiBmaWxlIHBhcnNpbmcgZXJyb3I6IFwiICsgZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCBvYmpEb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmpEb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zkuI3opoHlvIDlkK/lvILmraXvvIzorr7nva7kuLpmYWxzZe+8jOWQpuWImeWuueaYk+WNoeWcqHJlYWR5U3RhdGUgPSAx77yM5Y6f5Zug5LiN5piOXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgZmlsZU5hbWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9hZE1vZGVsKG5hbWU6IHN0cmluZywgbW9kZWxQYXRoOiBzdHJpbmcsIHNjYWxlOiBudW1iZXIgPSAxLCByZXZlcnNlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE9CSk1vZGVsIHwgbnVsbD4ge1xyXG4gICAgICAgIGxldCBtb2RlbDogT0JKTW9kZWwgfCBudWxsID0gbnVsbDtcclxuICAgICAgICB2YXIgb2JqRG9jID0gYXdhaXQgQXNzZXRMb2FkZXIubG9hZFRleHRGaWxlKG1vZGVsUGF0aCk7XHJcblxyXG4gICAgICAgIGlmIChvYmpEb2MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBtb2RlbCA9IE9CSlBhcnNlci5wYXJzZU9CSihvYmpEb2MpO1xyXG4gICAgICAgICAgICAvLyDovpPlh7rnu5/orqHkv6Hmga9cclxuICAgICAgICAgICAgY29uc29sZS5sb2coT0JKUGFyc2VyLmdldE1vZGVsU3RhdHMobW9kZWwpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZhciBvYmpzID0gb2JqRG9jLmdldE9ianMoc2NhbGUsIHJldmVyc2UpO1xyXG4gICAgICAgICAgICAvLyBvYmpzLmZvckVhY2goYXN5bmMgb2JqID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIC8vdG9kbzrkuLTmrbvlhpnmrbvvvIzlj6rliqDovb3mvKvlj43lsITotLTlm75cclxuICAgICAgICAgICAgLy8gICAgIC8vIGlmIChvYmoubWF0ZXJpYWwgIT0gbnVsbCAmJiBvYmoubWF0ZXJpYWwubWFwX0tkICE9IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gICAgIC8vICAgICByZW5kZXIubWF0ZXJpYWwuY3JlYXRlVGV4dHVyZShvYmoubWF0ZXJpYWwubWFwX0tkKTtcclxuICAgICAgICAgICAgLy8gICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gICAgIHZhciBtb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgICAgICAgICAvLyAgICAgbW9kZWwubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC52ZXJ0aWNlcyA9IG9iai52ZXJ0aWNlcztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLmluZGljZXMgPSBvYmouaW5kaWNlcztcclxuICAgICAgICAgICAgLy8gICAgIG1vZGVsLnV2cyA9IG9iai51dnM7XHJcbiAgICAgICAgICAgIC8vICAgICBtb2RlbC5ub3JtYWxzID0gb2JqLm5vcm1hbHM7XHJcbiAgICAgICAgICAgIC8vICAgICBpbnN0YW5jZS5tb2RlbC5wdXNoKG1vZGVsKTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IHtcclxuXHJcbiAgaXRlbXM6IG9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0ge307XHJcbiAgfVxyXG5cclxuICBnZXQgY291bnQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLml0ZW1zKS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBoYXMoa2V5OiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmhhc093blByb3BlcnR5KGtleSk7XHJcbiAgfVxyXG5cclxuICBzZXQoa2V5OiBhbnksIHZhbDogYW55KSB7XHJcbiAgICB0aGlzLml0ZW1zW2tleV0gPSB2YWw7XHJcbiAgfVxyXG5cclxuICBkZWxldGUoa2V5OiBhbnkpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmhhcyhrZXkpKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLml0ZW1zW2tleV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBnZXQoa2V5OiBhbnkpOiBhbnkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGFzKGtleSkgPyB0aGlzLml0ZW1zW2tleV0gOiB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIHZhbHVlcygpOiBhbnlbXSB7XHJcbiAgICBsZXQgdmFsdWVzOiBhbnlbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhcyhrKSkge1xyXG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuaXRlbXNba10pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH1cclxuXHJcbiAgZm9yRWFjaChmdW4pIHtcclxuICAgIGZvciAobGV0IGsgaW4gdGhpcy5pdGVtcykge1xyXG4gICAgICBmdW4oaywgdGhpcy5pdGVtc1trXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gJy4uL01hdGgvVmVjdG9yMyc7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tICcuLi9NYXRoL1ZlY3RvcjInO1xyXG5pbXBvcnQgeyBGYWNlLCBPQkpNb2RlbCB9IGZyb20gJy4uL01vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBPQkrmlofku7bop6PmnpDlmajnsbtcclxuICovXHJcbmV4cG9ydCBjbGFzcyBPQkpQYXJzZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiDop6PmnpBPQkrmlofku7ZcclxuICAgICAqIEBwYXJhbSBmaWxlQ29udGVudCBPQkrmlofku7blhoXlrrlcclxuICAgICAqIEByZXR1cm5zIOino+aekOWQjueahE9CSuaooeWei+aVsOaNrlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBhcnNlT0JKKGZpbGVDb250ZW50OiBzdHJpbmcpOiBPQkpNb2RlbCB7XHJcbiAgICAgICAgY29uc3QgbGluZXMgPSBmaWxlQ29udGVudC5zcGxpdCgnXFxuJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogT0JKTW9kZWwgPSB7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzOiBbXSxcclxuICAgICAgICAgICAgdGV4dHVyZUNvb3JkczogW10sXHJcbiAgICAgICAgICAgIHZlcnRleE5vcm1hbHM6IFtdLFxyXG4gICAgICAgICAgICBmYWNlczogW10sXHJcbiAgICAgICAgICAgIG1hdGVyaWFsczoge30sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRNYXRlcmlhbCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgdHJpbW1lZExpbmUgPSBsaW5lLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOi3s+i/h+epuuihjOWSjOazqOmHilxyXG4gICAgICAgICAgICBpZiAoIXRyaW1tZWRMaW5lIHx8IHRyaW1tZWRMaW5lLnN0YXJ0c1dpdGgoJyMnKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsaW5lUGFydHMgPSB0cmltbWVkTGluZS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICBjb25zdCBrZXl3b3JkID0gbGluZVBhcnRzWzBdO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChrZXl3b3JkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd2JzogLy8g6aG254K55Z2Q5qCHXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmVydGljZXMucHVzaCh2ZXJ0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd2dCc6IC8vIOe6ueeQhuWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4Q29vcmQgPSBuZXcgVmVjdG9yMihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobGluZVBhcnRzWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudGV4dHVyZUNvb3Jkcy5wdXNoKHRleENvb3JkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndm4nOiAvLyDpobbngrnms5Xnur9cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbCA9IG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChsaW5lUGFydHNbM10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC52ZXJ0ZXhOb3JtYWxzLnB1c2gobm9ybWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZic6IC8vIOmdouWumuS5iVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lUGFydHMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjZTogRmFjZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleEluZGljZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUluZGljZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsSW5kaWNlczogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOino+aekOmdoueahOavj+S4qumhtueCueWumuS5iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVQYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4RGVmID0gbGluZVBhcnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaUr+aMgXbjgIF2L3Z044CBdi8vdm7jgIF2L3Z0L3Zu562J5aSa56eN5qC85byPXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhQYXJ0cyA9IHZlcnRleERlZi5zcGxpdCgnLycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmhtueCuee0ouW8le+8iE9CSue0ouW8leS7jjHlvIDlp4vvvIzpnIDopoHovazmjaLkuLrku44w5byA5aeL77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UGFydHNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLnZlcnRleEluZGljZXMucHVzaChwYXJzZUludCh2ZXJ0ZXhQYXJ0c1swXSkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnurnnkIblnZDmoIfntKLlvJXvvIjlj6/pgInvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQYXJ0c1sxXSAmJiB2ZXJ0ZXhQYXJ0c1sxXSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlLnRleHR1cmVJbmRpY2VzIS5wdXNoKHBhcnNlSW50KHZlcnRleFBhcnRzWzFdKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOazlee6v+e0ouW8le+8iOWPr+mAie+8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBhcnRzWzJdICYmIHZlcnRleFBhcnRzWzJdICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2Uubm9ybWFsSW5kaWNlcyEucHVzaChwYXJzZUludCh2ZXJ0ZXhQYXJ0c1syXSkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ57q555CG5oiW5rOV57q/57Si5byV77yM5riF56m65pWw57uE5Lul5L+d5oyB5pWw5o2u5pW05rSBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYWNlLnRleHR1cmVJbmRpY2VzIS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZmFjZS50ZXh0dXJlSW5kaWNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFjZS5ub3JtYWxJbmRpY2VzIS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZmFjZS5ub3JtYWxJbmRpY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmt7vliqDmnZDotKjkv6Hmga/vvIjlpoLmnpzmnInvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5tYXRlcmlhbE5hbWUgPSBjdXJyZW50TWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5mYWNlcy5wdXNoKGZhY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdtdGxsaWInOiAvLyDmnZDotKjlupPlvJXnlKhcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVBhcnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsTGliTmFtZSA9IGxpbmVQYXJ0c1sxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a6e6ZmF5bqU55So5Lit6ZyA6KaB5Yqg6L295bm26Kej5p6Q5a+55bqU55qELm10bOaWh+S7tlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg5Y+R546w5p2Q6LSo5bqT5byV55SoOiAke21hdGVyaWFsTGliTmFtZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndXNlbXRsJzogLy8g5L2/55So5p2Q6LSoXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVQYXJ0cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgPSBsaW5lUGFydHNbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIneWni+WMluadkOi0qOiusOW9le+8iOWunumZheS9v+eUqOaXtumcgOimgeS7ji5tdGzmlofku7bliqDovb3lrozmlbTkv6Hmga/vvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQubWF0ZXJpYWxzW2N1cnJlbnRNYXRlcmlhbF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQubWF0ZXJpYWxzW2N1cnJlbnRNYXRlcmlhbF0gPSB7IG5hbWU6IGN1cnJlbnRNYXRlcmlhbCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOWPr+S7pea3u+WKoOabtOWkmk9CSuagvOW8j+WFs+mUruWtl+eahOWkhOeQhlxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAvLyDlv73nlaXkuI3mlK/mjIHnmoTlhbPplK7lrZdcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuino+aekOWQjueahOaooeWei+aVsOaNrui9rOaNouS4ukpTT07lrZfnrKbkuLJcclxuICAgICAqIEBwYXJhbSBtb2RlbCBPQkrmqKHlnovmlbDmja5cclxuICAgICAqIEByZXR1cm5zIEpTT07lrZfnrKbkuLJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0b0pTT04obW9kZWw6IE9CSk1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobW9kZWwsIG51bGwsIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5qih5Z6L57uf6K6h5L+h5oGvXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgT0JK5qih5Z6L5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyDnu5/orqHkv6Hmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNb2RlbFN0YXRzKG1vZGVsOiBPQkpNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZUNvdW50ID0gbW9kZWwudGV4dHVyZUNvb3Jkcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsQ291bnQgPSBtb2RlbC52ZXJ0ZXhOb3JtYWxzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBmYWNlc1dpdGhUZXh0dXJlcyA9IG1vZGVsLmZhY2VzLmZpbHRlcihmYWNlID0+IGZhY2UudGV4dHVyZUluZGljZXMpLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBmYWNlc1dpdGhOb3JtYWxzID0gbW9kZWwuZmFjZXMuZmlsdGVyKGZhY2UgPT4gZmFjZS5ub3JtYWxJbmRpY2VzKS5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBgXHJcbuaooeWei+e7n+iuoeS/oeaBrzpcclxuLSDpobbngrnmlbA6ICR7bW9kZWwudmVydGljZXMubGVuZ3RofVxyXG4tIOe6ueeQhuWdkOagh+aVsDogJHt0ZXh0dXJlQ291bnR9XHJcbi0g5rOV57q/5ZCR6YeP5pWwOiAke25vcm1hbENvdW50fVxyXG4tIOmdouaVsDogJHttb2RlbC5mYWNlcy5sZW5ndGh9XHJcbi0g5bim57q555CG55qE6Z2iOiAke2ZhY2VzV2l0aFRleHR1cmVzfVxyXG4tIOW4puazlee6v+eahOmdojogJHtmYWNlc1dpdGhOb3JtYWxzfVxyXG4tIOadkOi0qOaVsDogJHtPYmplY3Qua2V5cyhtb2RlbC5tYXRlcmlhbHMpLmxlbmd0aH1cclxuICAgICAgICBgLnRyaW0oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmqjOivgeino+aekOaVsOaNrueahOWujOaVtOaAp1xyXG4gICAgICogQHBhcmFtIG1vZGVsIE9CSuaooeWei+aVsOaNrlxyXG4gICAgICogQHJldHVybnMg6aqM6K+B57uT5p6c5raI5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdmFsaWRhdGVNb2RlbChtb2RlbDogT0JKTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgLy8g5qOA5p+l6Z2i57Si5byV5piv5ZCm6LaK55WMXHJcbiAgICAgICAgZm9yIChjb25zdCBmYWNlIG9mIG1vZGVsLmZhY2VzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdmVydGV4SW5kZXggb2YgZmFjZS52ZXJ0ZXhJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4SW5kZXggPCAwIHx8IHZlcnRleEluZGV4ID49IG1vZGVsLnZlcnRpY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGDpobbngrnntKLlvJXotornlYw6ICR7dmVydGV4SW5kZXh9ICjmnIDlpKc6ICR7bW9kZWwudmVydGljZXMubGVuZ3RoIC0gMX0pYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmYWNlLnRleHR1cmVJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRleEluZGV4IG9mIGZhY2UudGV4dHVyZUluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGV4SW5kZXggPCAwIHx8IHRleEluZGV4ID49IG1vZGVsLnRleHR1cmVDb29yZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGDnurnnkIblnZDmoIfntKLlvJXotornlYw6ICR7dGV4SW5kZXh9ICjmnIDlpKc6ICR7bW9kZWwudGV4dHVyZUNvb3Jkcy5sZW5ndGggLSAxfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmYWNlLm5vcm1hbEluZGljZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9ybWFsSW5kZXggb2YgZmFjZS5ub3JtYWxJbmRpY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vcm1hbEluZGV4IDwgMCB8fCBub3JtYWxJbmRleCA+PSBtb2RlbC52ZXJ0ZXhOb3JtYWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChg5rOV57q/57Si5byV6LaK55WMOiAke25vcm1hbEluZGV4fSAo5pyA5aSnOiAke21vZGVsLnZlcnRleE5vcm1hbHMubGVuZ3RoIC0gMX0pYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXJyb3JzLmxlbmd0aCA+IDAgXHJcbiAgICAgICAgICAgID8gYOWPkeeOsCAke2Vycm9ycy5sZW5ndGh9IOS4qumUmeivrzpcXG4ke2Vycm9ycy5qb2luKCdcXG4nKX1gXHJcbiAgICAgICAgICAgIDogJ+aooeWei+aVsOaNrumqjOivgemAmui/hyc7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vTG9nZ2VyXCI7XHJcbmltcG9ydCB7IFNjZW5lTWFuYWdlciB9IGZyb20gXCIuL1NjZW5lL1NjZW5lTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBSYXN0ZXJpemF0aW9uUGlwZWxpbmUgfSBmcm9tIFwiLi9SYXN0ZXJpemF0aW9uUGlwZWxpbmVcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBBc3NldExvYWRlciB9IGZyb20gXCIuL1V0aWxzL0Fzc2V0TG9hZGVyXCI7XHJcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ29tcG9uZW50L0NhbWVyYVwiO1xyXG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gXCIuL0NvbXBvbmVudC9SZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tIFwiLi9Db21wb25lbnQvTWVzaFJlbmRlcmVyXCI7XHJcbmltcG9ydCB7IE9ialJvdGF0ZSB9IGZyb20gXCIuL0NvbXBvbmVudC9PYmpSb3RhdGVcIjtcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBDYW1lcmFDb250cm9sbGVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L0NhbWVyYUNvbnRyb2xsZXJcIjtcclxuXHJcbi8vIOW9k0RPTeWGheWuueWKoOi9veWujOaIkOWQjuaJp+ihjFxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8g6I635Y+WY2FudmFz5YWD57Sg5ZKMMkTmuLLmn5PkuIrkuIvmlodcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIC8vIOiuvue9rmNhbnZhc+WwuuWvuFxyXG4gICAgY2FudmFzLndpZHRoID0gQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IENvbmZpZy5jYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgLy8g6K6+572u5paH5pys5qC35byPXHJcbiAgICBjdHguZm9udCA9ICdBcmlhbCc7XHJcbiAgICBjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xyXG5cclxuICAgIC8vIOWIm+W7uuWbvuWDj+aVsOaNruWvueixoVxyXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YShDb25maWcuY2FudmFzV2lkdGgsIENvbmZpZy5jYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFJhc3Rlcml6YXRpb25QaXBlbGluZSh1aW50MzJWaWV3KTtcclxuXHJcbiAgICAvLyDliJ3lp4vljJbovpPlhaXns7vnu59cclxuICAgIElucHV0LmluaXRpYWxpemUoKTtcclxuICAgIFxyXG4gICAgSW5pdFNjZW5lKCk7XHJcbiAgICBcclxuICAgIC8vIOa4suafk+WHveaVsFxyXG4gICAgZnVuY3Rpb24gbWFpbkxvb3AoKSB7XHJcbiAgICAgICAgLy8g5pu05paw6L6T5YWl54q25oCBXHJcbiAgICAgICAgSW5wdXQudXBkYXRlKCk7XHJcbiAgICAgICAgLy8g5aSE55CG6YC76L6RXHJcbiAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgLy8g5riy5p+TXHJcbiAgICAgICAgUmVuZGVyKHBpcGVsaW5lKTtcclxuICAgICAgICAvLyDlsIblm77lg4/mlbDmja7nu5jliLbliLBjYW52YXPkuIpcclxuICAgICAgICBjdHgucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgLy8g6K+35rGC5LiL5LiA5bin5Yqo55S7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxuICAgICAgICAvLyDlsY/luZXovpPlh7rml6Xlv5dcclxuICAgICAgICBMb2dnZXIucHJpbnRMb2dzKGN0eCk7XHJcbiAgICB9XHJcbiAgICAvLyDlvIDlp4vliqjnlLvlvqrnjq9cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gSW5pdFNjZW5lKCkge1xyXG4gICAgLy8g5Yid5aeL5YyW5Zy65pmvXHJcbiAgICBjb25zdCBtYWluU2NlbmUgPSBTY2VuZU1hbmFnZXIuaW5zdGFuY2UuY3JlYXRlU2NlbmUoXCJNYWluU2NlbmVcIik7XHJcbiAgICBTY2VuZU1hbmFnZXIuaW5zdGFuY2Uuc2V0QWN0aXZlU2NlbmUobWFpblNjZW5lKTtcclxuXHJcbiAgICAvLyDnm7jmnLpcclxuICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBHYW1lT2JqZWN0KFwiY2FtZXJhXCIpO1xyXG4gICAgbWFpblNjZW5lLmFkZEdhbWVPYmplY3QoY2FtZXJhKTtcclxuICAgIGNhbWVyYS5hZGRDb21wb25lbnQoQ2FtZXJhKTtcclxuICAgIC8vY2FtZXJhLmFkZENvbXBvbmVudChDYW1lcmFDb250cm9sbGVyKTtcclxuXHJcbiAgICBsZXQgbGVlOiBHYW1lT2JqZWN0O1xyXG4gICAgLy8g5Yqg6L295qih5Z6LXHJcbiAgICBBc3NldExvYWRlci5sb2FkTW9kZWwoJ2xlZScsICdyZXNvdXJjZXMvYXNzZXRzL21lc2hlcy9sZWUub2JqJykudGhlbigobW9kZWwpID0+IHtcclxuICAgICAgICBsZWUgPSBuZXcgR2FtZU9iamVjdChcImxlZVwiKTtcclxuICAgICAgICBsZWUudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMik7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBsZWUuYWRkQ29tcG9uZW50KE1lc2hSZW5kZXJlcik7XHJcbiAgICAgICAgcmVuZGVyZXIubWVzaCA9IG1vZGVsO1xyXG4gICAgICAgIGxlZS5hZGRDb21wb25lbnQoT2JqUm90YXRlKTtcclxuICAgICAgICBtYWluU2NlbmUuYWRkR2FtZU9iamVjdChsZWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgQXNzZXRMb2FkZXIubG9hZE1vZGVsKCdjdWJlJywgJ3Jlc291cmNlcy9jdWJlLm9iaicpLnRoZW4oKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3ViZSA9IG5ldyBHYW1lT2JqZWN0KFwiY3ViZVwiKTtcclxuICAgICAgICBjdWJlLnRyYW5zZm9ybS5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDIsIDAsIDApO1xyXG4gICAgICAgIGN1YmUudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjMoMC4xLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBjdWJlLmFkZENvbXBvbmVudChNZXNoUmVuZGVyZXIpO1xyXG4gICAgICAgIHJlbmRlcmVyLm1lc2ggPSBtb2RlbDtcclxuICAgICAgICBjdWJlLmFkZENvbXBvbmVudChPYmpSb3RhdGUpO1xyXG4gICAgICAgIGN1YmUudHJhbnNmb3JtLnNldFBhcmVudChsZWUudHJhbnNmb3JtLCBmYWxzZSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gVXBkYXRlKCkge1xyXG4gICAgLy8g5L2/55So5Zy65pmv55qEdXBkYXRl5pa55rOV5pu05paw5omA5pyJ5ri45oiP5a+56LGhXHJcbiAgICBTY2VuZU1hbmFnZXIuaW5zdGFuY2UuZ2V0QWN0aXZlU2NlbmUoKT8udXBkYXRlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJlbmRlcihwaXBlbGluZTogUmFzdGVyaXphdGlvblBpcGVsaW5lKSB7XHJcbiAgICBwaXBlbGluZS5DbGVhcihDb2xvci5CTEFDSyk7XHJcblxyXG4gICAgLy8g6I635Y+W5Zy65pmv5Lit55qE5omA5pyJ5qC55ri45oiP5a+56LGh5bm25riy5p+TXHJcbiAgICBjb25zdCByb290T2JqZWN0cyA9IFNjZW5lTWFuYWdlci5pbnN0YW5jZS5nZXRBY3RpdmVTY2VuZSgpPy5nZXRSb290R2FtZU9iamVjdHMoKTtcclxuICAgIGlmIChyb290T2JqZWN0cykge1xyXG4gICAgICAgIGZvciAoY29uc3QgZ2FtZU9iamVjdCBvZiByb290T2JqZWN0cykge1xyXG4gICAgICAgICAgICAvLyDmmL7lvI/mjIflrprnsbvlnovlj4LmlbBcclxuICAgICAgICAgICAgY29uc3QgcmVuZGVycyA9IGdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oUmVuZGVyZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlbmRlciBvZiByZW5kZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBwaXBlbGluZS5EcmF3T2JqZWN0KHJlbmRlcik7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKHJlbmRlci5nYW1lT2JqZWN0Lm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
