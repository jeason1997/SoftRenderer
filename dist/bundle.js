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
var Engine_1 = require("../Engine");
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
            return (v.z * Engine_1.EngineConfig.canvasWidth) / (v.w * Engine_1.EngineConfig.canvasHeight);
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
},{"../Color":1,"../Engine":7,"../Math/Vector4":16,"./Component":4}],3:[function(require,module,exports){
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
exports.CameraController = void 0;
var Engine_1 = require("../Engine");
var Input_1 = require("../Input");
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
var Component_1 = require("./Component");
var CameraController = /** @class */ (function (_super) {
    __extends(CameraController, _super);
    function CameraController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.moveSpeed = 0.5;
        _this.moveSpeedShiftScale = 2.5;
        _this.damp = 0.2;
        _this.rotateSpeed = 1;
        _this._euler = new Vector3_1.Vector3();
        _this._velocity = new Vector3_1.Vector3();
        _this._position = new Vector3_1.Vector3();
        _this._speedScale = 1;
        _this._rotateCamera = false;
        return _this;
    }
    CameraController.prototype.start = function () {
        this._euler = this.transform.rotation.eulerAngles;
        this._position = this.transform.position;
    };
    CameraController.prototype.updateInput = function () {
        // 相机移动以及加速
        var v = this._velocity;
        v.x = -Input_1.Input.GetAxis(Input_1.InputAxis.Horizontal);
        v.z = Input_1.Input.GetAxis(Input_1.InputAxis.Vertical);
        v.y = Input_1.Input.GetKey(Input_1.Input.KeyCode.Q) ? -1 : Input_1.Input.GetKey(Input_1.Input.KeyCode.E) ? 1 : 0;
        this._speedScale = Input_1.Input.GetKey(Input_1.Input.KeyCode.Shift) ? this.moveSpeedShiftScale : 1;
        // 相机缩放
        var scrollDelta = -Input_1.Input.mouseScrollDelta.y * this.moveSpeed * 0.1;
        var pos = this.transform.rotation.transformQuat(Vector3_1.Vector3.FORWARD);
        this._position = this.scaleAndAdd(this.transform.position, pos, scrollDelta);
        if (Input_1.Input.GetMouseButtonDown(2)) {
            Engine_1.Engine.canvas.requestPointerLock();
            this._rotateCamera = true;
        }
        if (Input_1.Input.GetMouseButtonUp(2)) {
            if (document.exitPointerLock)
                document.exitPointerLock();
            this._rotateCamera = false;
        }
        if (this._rotateCamera) {
            var moveDelta = Input_1.Input.mouseDelta;
            this._euler.y -= moveDelta.x * this.rotateSpeed * 0.1;
            this._euler.x += moveDelta.y * this.rotateSpeed * 0.1;
        }
    };
    CameraController.prototype.update = function () {
        this.updateInput();
        // position
        var v = this.transform.rotation.transformQuat(this._velocity);
        this._position = this.scaleAndAdd(this._position, v, this.moveSpeed * this._speedScale);
        v = Vector3_1.Vector3.lerp(this.transform.position, this._position, Engine_1.Engine.deltaTime / this.damp);
        this.transform.position = v;
        // rotation
        var q = new Quaternion_1.Quaternion(new Vector3_1.Vector3(this._euler.x, this._euler.y, this._euler.z));
        q = Quaternion_1.Quaternion.slerp(this.transform.rotation, q, Engine_1.Engine.deltaTime / this.damp);
        this.transform.rotation = q;
    };
    CameraController.prototype.scaleAndAdd = function (a, b, scale) {
        var out = new Vector3_1.Vector3();
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    };
    return CameraController;
}(Component_1.Component));
exports.CameraController = CameraController;
},{"../Engine":7,"../Input":9,"../Math/Quaternion":13,"../Math/Vector3":15,"./Component":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./Renderer":6}],6:[function(require,module,exports){
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
        _this._castShadows = true;
        _this._receiveShadows = true;
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
    Object.defineProperty(Renderer.prototype, "castShadows", {
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
    Object.defineProperty(Renderer.prototype, "receiveShadows", {
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
},{"./Component":4}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.EngineConfig = exports.Engine = void 0;
var Input_1 = require("./Input");
var RasterizationPipeline_1 = require("./RasterizationPipeline");
var MainScene_1 = require("./Scene/MainScene");
var SceneManager_1 = require("./Scene/SceneManager");
var Engine = /** @class */ (function () {
    function Engine() {
    }
    Engine.Init = function () {
        // 获取canvas元素和2D渲染上下文
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        // 设置canvas尺寸
        this.canvas.width = EngineConfig.canvasWidth;
        this.canvas.height = EngineConfig.canvasHeight;
        // 设置文本样式
        this.context.font = 'Arial';
        this.context.textAlign = 'left';
        // 创建图像数据对象
        this.imageData = Engine.context.createImageData(EngineConfig.canvasWidth, EngineConfig.canvasHeight);
        // 创建32位无符号整型数组视图，用于直接操作像素数据
        var uint32View = new Uint32Array(this.imageData.data.buffer);
        // 创建渲染器实例
        this.pipeline = new RasterizationPipeline_1.RasterizationPipeline(uint32View);
        // 初始化场景
        this.sceneManager.loadScene(MainScene_1.MainScene);
        // 初始化输入系统
        Input_1.Input.initialize();
    };
    Engine.Update = function () {
        var _a;
        // 使用场景的update方法更新所有游戏对象
        (_a = this.sceneManager.getActiveScene()) === null || _a === void 0 ? void 0 : _a.update();
        // 更新输入状态(注：输入已经由WEB引擎在每帧开始之前获取了，这里是更新输入的上一帧状态)
        Input_1.Input.update();
    };
    Engine.Render = function () {
        this.pipeline.Render();
        // 将图像数据绘制到canvas上
        this.context.putImageData(this.imageData, 0, 0);
    };
    Engine.sceneManager = new SceneManager_1.SceneManager();
    Engine.deltaTime = 1 / 60;
    return Engine;
}());
exports.Engine = Engine;
var EngineConfig = /** @class */ (function () {
    function EngineConfig() {
    }
    EngineConfig.canvasWidth = 400;
    EngineConfig.canvasHeight = 400;
    EngineConfig.halfCanvasWidth = EngineConfig.canvasWidth >> 1;
    EngineConfig.halfCanvasHeight = EngineConfig.canvasHeight >> 1;
    EngineConfig.aspectRatio = EngineConfig.canvasWidth / EngineConfig.canvasHeight;
    return EngineConfig;
}());
exports.EngineConfig = EngineConfig;
},{"./Input":9,"./RasterizationPipeline":18,"./Scene/MainScene":19,"./Scene/SceneManager":21}],8:[function(require,module,exports){
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
},{"./Transfrom":22}],9:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.TouchPhase = exports.InputAxis = exports.Input = void 0;
var Vector2_1 = require("./Math/Vector2");
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
            Input.mousePosition.x = event.clientX - rect.left;
            Input.mousePosition.y = event.clientY - rect.top;
            Input.mouseDelta.x = event.movementX;
            Input.mouseDelta.y = event.movementY;
        });
        document.addEventListener('wheel', function (event) {
            Input.mouseScrollDelta.y = event.deltaY;
        });
        document.addEventListener('scrollend', function () {
            Input.mouseScrollDelta.y = 0;
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
        // 复位鼠标滚轮
        Input.mouseScrollDelta.y = 0;
        // 复位鼠标移动
        Input.mouseDelta.x = 0;
        Input.mouseDelta.y = 0;
    };
    //#region 键盘输入检测
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
    // 获取指定轴向的输入值
    Input.GetAxis = function (axis) {
        switch (axis) {
            case InputAxis.Horizontal:
                // 水平轴 A/D 或 左右方向键
                if (Input.GetKey(Input.KeyCode.D) || Input.GetKey(Input.KeyCode.RightArrow)) {
                    return 1;
                }
                if (Input.GetKey(Input.KeyCode.A) || Input.GetKey(Input.KeyCode.LeftArrow)) {
                    return -1;
                }
                return 0;
            case InputAxis.Vertical:
                // 垂直轴 W/S 或 上下方向键
                if (Input.GetKey(Input.KeyCode.W) || Input.GetKey(Input.KeyCode.UpArrow)) {
                    return 1;
                }
                if (Input.GetKey(Input.KeyCode.S) || Input.GetKey(Input.KeyCode.DownArrow)) {
                    return -1;
                }
                return 0;
            default:
                return 0;
        }
    };
    //#endregion
    //#region 鼠标输入检测
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
    //#endregion
    //#region 触摸输入检测
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
    Input.mousePosition = Vector2_1.Vector2.ZERO;
    Input.mouseDelta = Vector2_1.Vector2.ZERO;
    Input.mouseScrollDelta = Vector2_1.Vector2.ZERO;
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
// 轴向枚举
var InputAxis;
(function (InputAxis) {
    InputAxis[InputAxis["Horizontal"] = 0] = "Horizontal";
    InputAxis[InputAxis["Vertical"] = 1] = "Vertical";
})(InputAxis = exports.InputAxis || (exports.InputAxis = {}));
// 触摸阶段枚举
var TouchPhase;
(function (TouchPhase) {
    TouchPhase[TouchPhase["Began"] = 0] = "Began";
    TouchPhase[TouchPhase["Moved"] = 1] = "Moved";
    TouchPhase[TouchPhase["Stationary"] = 2] = "Stationary";
    TouchPhase[TouchPhase["Ended"] = 3] = "Ended";
    TouchPhase[TouchPhase["Canceled"] = 4] = "Canceled";
})(TouchPhase = exports.TouchPhase || (exports.TouchPhase = {}));
},{"./Math/Vector2":14}],10:[function(require,module,exports){
"use strict";
var _a;
exports.__esModule = true;
exports.Logger = void 0;
var Engine_1 = require("./Engine");
var LogType;
(function (LogType) {
    LogType[LogType["Info"] = 0] = "Info";
    LogType[LogType["Warning"] = 1] = "Warning";
    LogType[LogType["Error"] = 2] = "Error";
})(LogType || (LogType = {}));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.printLogs = function () {
        for (var i = 0; i < this.logs.length; i++) {
            var log = this.logs[i];
            Engine_1.Engine.context.fillStyle = Logger.logColors[log.type];
            Engine_1.Engine.context.fillText(log.message, 10, 20 + i * 15);
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
},{"./Engine":7}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Bounds = void 0;
var Vector3_1 = require("./Vector3");
var Bounds = /** @class */ (function () {
    function Bounds(min, max) {
        this.min = min || Vector3_1.Vector3.ZERO;
        this.max = max || Vector3_1.Vector3.ZERO;
    }
    Bounds.prototype.getCenter = function () {
        return new Vector3_1.Vector3((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, (this.min.z + this.max.z) / 2);
    };
    Bounds.prototype.getHalfExtents = function () {
        return new Vector3_1.Vector3((this.max.x - this.min.x) / 2, (this.max.y - this.min.y) / 2, (this.max.z - this.min.z) / 2);
    };
    Bounds.prototype.setMin = function (min) {
        this.min = min;
    };
    Bounds.prototype.setMax = function (max) {
        this.max = max;
    };
    Bounds.fromPoints = function (points) {
        if (points.length === 0)
            return new Bounds();
        var min = new Vector3_1.Vector3(points[0].x, points[0].y, points[0].z);
        var max = new Vector3_1.Vector3(points[0].x, points[0].y, points[0].z);
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            min.x = Math.min(min.x, p.x);
            min.y = Math.min(min.y, p.y);
            min.z = Math.min(min.z, p.z);
            max.x = Math.max(max.x, p.x);
            max.y = Math.max(max.y, p.y);
            max.z = Math.max(max.z, p.z);
        }
        // 假设Bounds有min和max属性
        var bounds = new Bounds();
        bounds.min = min;
        bounds.max = max;
        return bounds;
    };
    return Bounds;
}());
exports.Bounds = Bounds;
/**
 * 轴对齐包围盒 (AABB)
 * 最简单的包围盒，边与坐标轴平行
 */
var AABB = /** @class */ (function () {
    function AABB(min, max) {
        this.min = min;
        this.max = max;
    }
    /**
     * 从顶点列表生成AABB
     * @param vertices 三维顶点数组
     * @returns 生成的AABB
     */
    AABB.fromVertices = function (vertices) {
        if (vertices.length === 0) {
            throw new Error("顶点数组不能为空");
        }
        // 初始化min和max为第一个顶点的值
        var min = vertices[0].clone();
        var max = vertices[0].clone();
        // 遍历所有顶点，找到最小和最大值
        for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
            var v = vertices_1[_i];
            min.x = Math.min(min.x, v.x);
            min.y = Math.min(min.y, v.y);
            min.z = Math.min(min.z, v.z);
            max.x = Math.max(max.x, v.x);
            max.y = Math.max(max.y, v.y);
            max.z = Math.max(max.z, v.z);
        }
        return new AABB(min, max);
    };
    /** 获取AABB的中心点 */
    AABB.prototype.getCenter = function () {
        return new Vector3_1.Vector3((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, (this.min.z + this.max.z) / 2);
    };
    /** 获取AABB的半边长 */
    AABB.prototype.getHalfExtents = function () {
        return new Vector3_1.Vector3((this.max.x - this.min.x) / 2, (this.max.y - this.min.y) / 2, (this.max.z - this.min.z) / 2);
    };
    return AABB;
}());
/**
 * 定向包围盒 (OBB)
 * 可以随物体旋转，边与物体自身坐标系对齐
 */
var OBB = /** @class */ (function () {
    function OBB(center, axes, extents) {
        this.center = center;
        this.axes = axes;
        this.extents = extents;
    }
    /**
     * 从顶点列表生成OBB（使用PCA主成分分析）
     * 算法思路：通过计算顶点的协方差矩阵找到主方向作为OBB的轴
     * @param vertices 三维顶点数组
     * @returns 生成的OBB
     */
    OBB.fromVertices = function (vertices) {
        if (vertices.length === 0) {
            throw new Error("顶点数组不能为空");
        }
        // 1. 计算中心点（平均值）
        var center = OBB.calculateCentroid(vertices);
        // 2. 计算协方差矩阵
        var covariance = OBB.calculateCovarianceMatrix(vertices, center);
        // 3. 计算协方差矩阵的特征向量（主成分），作为OBB的轴
        var eigenvectors = OBB.calculateEigenvectors(covariance);
        // 确保轴是单位向量
        var axes = [
            eigenvectors[0].multiply(1 / eigenvectors[0].magnitude),
            eigenvectors[1].multiply(1 / eigenvectors[1].magnitude),
            eigenvectors[2].multiply(1 / eigenvectors[2].magnitude)
        ];
        // 4. 计算每个轴方向上的最大延伸（半长度）
        var extents = OBB.calculateExtents(vertices, center, axes);
        return new OBB(center, axes, extents);
    };
    /** 计算顶点的中心点（质心） */
    OBB.calculateCentroid = function (vertices) {
        var sum = new Vector3_1.Vector3();
        for (var _i = 0, vertices_2 = vertices; _i < vertices_2.length; _i++) {
            var v = vertices_2[_i];
            sum.x += v.x;
            sum.y += v.y;
            sum.z += v.z;
        }
        return sum.multiply(1 / vertices.length);
    };
    /** 计算协方差矩阵 */
    OBB.calculateCovarianceMatrix = function (vertices, centroid) {
        // 初始化3x3协方差矩阵
        var cov = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        for (var _i = 0, vertices_3 = vertices; _i < vertices_3.length; _i++) {
            var v = vertices_3[_i];
            // 计算顶点相对于质心的偏移
            var x = v.x - centroid.x;
            var y = v.y - centroid.y;
            var z = v.z - centroid.z;
            // 累积协方差值
            cov[0][0] += x * x;
            cov[0][1] += x * y;
            cov[0][2] += x * z;
            cov[1][1] += y * y;
            cov[1][2] += y * z;
            cov[2][2] += z * z;
        }
        // 对称矩阵，填充下三角部分
        cov[1][0] = cov[0][1];
        cov[2][0] = cov[0][2];
        cov[2][1] = cov[1][2];
        // 除以顶点数量-1（无偏估计）
        var n = vertices.length;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                cov[i][j] /= (n - 1);
            }
        }
        return cov;
    };
    /** 计算协方差矩阵的特征向量（简化实现） */
    OBB.calculateEigenvectors = function (cov) {
        // 这里使用简化的特征向量计算方法
        // 实际应用中可能需要更精确的算法（如Jacobi迭代法）
        // 对于演示目的，我们返回三个正交向量（实际项目中需替换为真实特征向量计算）
        // 注意：这只是占位实现，真实场景需要正确计算特征向量
        return [
            new Vector3_1.Vector3(1, 0, 0),
            new Vector3_1.Vector3(0, 1, 0),
            new Vector3_1.Vector3(0, 0, 1) // 假设Z轴为第三主成分
        ];
    };
    /** 计算每个轴方向上的半长度 */
    OBB.calculateExtents = function (vertices, center, axes) {
        var extentX = 0;
        var extentY = 0;
        var extentZ = 0;
        // 对每个轴计算顶点在该轴上的投影范围
        for (var i = 0; i < 3; i++) {
            var axis = axes[i];
            var min = Infinity;
            var max = -Infinity;
            for (var _i = 0, vertices_4 = vertices; _i < vertices_4.length; _i++) {
                var v = vertices_4[_i];
                // 计算顶点相对于中心点的向量
                var dir = v.subtract(center);
                // 计算在当前轴上的投影
                var proj = Vector3_1.Vector3.dot(dir, axis);
                min = Math.min(min, proj);
                max = Math.max(max, proj);
            }
            // 半长度取最大绝对值
            var extent = Math.max(Math.abs(min), Math.abs(max));
            // 直接赋值给对应分量
            if (i === 0)
                extentX = extent;
            else if (i === 1)
                extentY = extent;
            else
                extentZ = extent;
        }
        return new Vector3_1.Vector3(extentX, extentY, extentZ);
    };
    return OBB;
}());
/**
 * 球体包围盒
 * 用球心和半径表示的简化包围体
 */
var Sphere = /** @class */ (function () {
    function Sphere(center, radius) {
        this.center = center;
        this.radius = radius;
    }
    /**
     * 从顶点列表生成球体包围盒
     * 算法思路：先计算所有顶点的中心点，再找到离中心点最远的顶点作为半径
     * @param vertices 三维顶点数组
     * @returns 生成的球体
     */
    Sphere.fromVertices = function (vertices) {
        if (vertices.length === 0) {
            throw new Error("顶点数组不能为空");
        }
        // 1. 计算中心点（平均值）
        var center = new Vector3_1.Vector3();
        for (var _i = 0, vertices_5 = vertices; _i < vertices_5.length; _i++) {
            var v = vertices_5[_i];
            center.x += v.x;
            center.y += v.y;
            center.z += v.z;
        }
        center.x /= vertices.length;
        center.y /= vertices.length;
        center.z /= vertices.length;
        // 2. 找到离中心点最远的顶点，其距离即为半径
        var maxDistanceSquared = 0;
        for (var _a = 0, vertices_6 = vertices; _a < vertices_6.length; _a++) {
            var v = vertices_6[_a];
            var dx = v.x - center.x;
            var dy = v.y - center.y;
            var dz = v.z - center.z;
            var distanceSquared = dx * dx + dy * dy + dz * dz;
            if (distanceSquared > maxDistanceSquared) {
                maxDistanceSquared = distanceSquared;
            }
        }
        var radius = Math.sqrt(maxDistanceSquared);
        return new Sphere(center, radius);
    };
    /**
     * 从AABB生成球体包围盒
     * @param aabb 轴对齐包围盒
     * @returns 生成的球体
     */
    Sphere.fromAABB = function (aabb) {
        var center = aabb.getCenter();
        var halfExtents = aabb.getHalfExtents();
        // 半径是从中心到角落的距离
        var radius = halfExtents.magnitude;
        return new Sphere(center, radius);
    };
    return Sphere;
}());
// 示例用法
function exampleUsage() {
    // 创建一些示例顶点
    var vertices = [
        new Vector3_1.Vector3(0, 0, 0),
        new Vector3_1.Vector3(1, 0, 0),
        new Vector3_1.Vector3(0, 1, 0),
        new Vector3_1.Vector3(0, 0, 1),
        new Vector3_1.Vector3(1, 1, 1)
    ];
    // 生成AABB
    var aabb = AABB.fromVertices(vertices);
    console.log("AABB:");
    console.log("  Min:", "(" + aabb.min.x + ", " + aabb.min.y + ", " + aabb.min.z + ")");
    console.log("  Max:", "(" + aabb.max.x + ", " + aabb.max.y + ", " + aabb.max.z + ")");
    // 生成OBB
    var obb = OBB.fromVertices(vertices);
    console.log("\nOBB:");
    console.log("  Center:", "(" + obb.center.x + ", " + obb.center.y + ", " + obb.center.z + ")");
    console.log("  Extents:", "(" + obb.extents.x + ", " + obb.extents.y + ", " + obb.extents.z + ")");
    // 生成球体
    var sphere = Sphere.fromVertices(vertices);
    console.log("\nSphere:");
    console.log("  Center:", "(" + sphere.center.x + ", " + sphere.center.y + ", " + sphere.center.z + ")");
    console.log("  Radius:", sphere.radius);
}
},{"./Vector3":15}],12:[function(require,module,exports){
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
},{"./Quaternion":13,"./Vector3":15,"./Vector4":16}],13:[function(require,module,exports){
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
},{"./Matrix4x4":12,"./Vector3":15}],14:[function(require,module,exports){
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
},{"./Vector3":15,"./Vector4":16}],15:[function(require,module,exports){
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
    Vector3.prototype.dot = function (v) {
        return Vector3.dot(this, v);
    };
    Vector3.prototype.cross = function (v) {
        return Vector3.cross(this, v);
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
    Vector3.multiply = function (v, s) {
        return new Vector3(v.x * s, v.y * s, v.z * s);
    };
    Vector3.add = function (v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    };
    Vector3.subtract = function (v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
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
},{"./Vector2":14,"./Vector4":16}],16:[function(require,module,exports){
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
},{"./Vector2":14,"./Vector3":15}],17:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.SubMesh = exports.Mesh = void 0;
var Mesh = /** @class */ (function () {
    function Mesh() {
    }
    // 检查网格是否有效
    Mesh.prototype.checkValid = function () {
        // 检查定点数、uv数、法线数量是否不为零并且相等，同时三角形数量应该是三的倍数
        return this.vertices.length !== 0
            && this.vertices.length === this.uv.length
            && this.vertices.length === this.normals.length
            && this.triangles.length !== 0
            && this.triangles.length % 3 === 0;
    };
    // 重新计算包围盒
    Mesh.prototype.recalculateBounds = function () {
        //TODO
    };
    return Mesh;
}());
exports.Mesh = Mesh;
var SubMesh = /** @class */ (function () {
    function SubMesh() {
    }
    return SubMesh;
}());
exports.SubMesh = SubMesh;
},{}],18:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.RasterizationPipeline = void 0;
var Color_1 = require("./Color");
var Vector2_1 = require("./Math/Vector2");
var Vector3_1 = require("./Math/Vector3");
var Vector4_1 = require("./Math/Vector4");
var Renderer_1 = require("./Component/Renderer");
var Camera_1 = require("./Component/Camera");
var Engine_1 = require("./Engine");
var Logger_1 = require("./Logger");
var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["Wireframe"] = 0] = "Wireframe";
    DrawMode[DrawMode["Point"] = 1] = "Point";
    DrawMode[DrawMode["UV"] = 2] = "UV";
    DrawMode[DrawMode["Normal"] = 3] = "Normal";
    DrawMode[DrawMode["Shader"] = 4] = "Shader";
})(DrawMode || (DrawMode = {}));
var RasterizationPipeline = /** @class */ (function () {
    function RasterizationPipeline(uint32View) {
        this.drawMode = DrawMode.UV;
        this.uint32View = uint32View;
    }
    RasterizationPipeline.prototype.Render = function () {
        var _a;
        this.Clear(Color_1.Color.BLACK);
        // 获取场景中的所有根游戏对象并渲染
        var rootObjects = (_a = Engine_1.Engine.sceneManager.getActiveScene()) === null || _a === void 0 ? void 0 : _a.getRootGameObjects();
        if (rootObjects) {
            for (var _i = 0, rootObjects_1 = rootObjects; _i < rootObjects_1.length; _i++) {
                var gameObject = rootObjects_1[_i];
                // 显式指定类型参数
                var renders = gameObject.getComponentsInChildren(Renderer_1.Renderer);
                for (var _b = 0, renders_1 = renders; _b < renders_1.length; _b++) {
                    var render = renders_1[_b];
                    this.DrawObject(render);
                    Logger_1.Logger.log(render.gameObject.name);
                }
            }
        }
    };
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
        if (x < 0 || x >= Engine_1.EngineConfig.canvasWidth || y < 0 || y >= Engine_1.EngineConfig.canvasHeight) {
            return;
        }
        this.uint32View[y * Engine_1.EngineConfig.canvasWidth + x] = color;
    };
    RasterizationPipeline.prototype.DrawLine = function (x1, y1, x2, y2, color) {
        var _a, _b;
        // 使用位运算优化边界检查
        // 画线前要进行边检查，确保线的两端点都在屏幕内，如果线的范围很长并且不在屏幕范围内，都进行计算会造成浪费大量的资源，裁剪掉超出的部分
        var w = Engine_1.EngineConfig.canvasWidth;
        var h = Engine_1.EngineConfig.canvasHeight;
        if (((x1 | y1) < 0) || (x1 >= w) || (y1 >= h) || ((x2 | y2) < 0) || (x2 >= w) || (y2 >= h)) {
            //TODO:裁剪掉超出屏幕的部分
            return;
        }
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
        // 画三角形前要进行边检查，确保三角形的三个点都在屏幕内，如果有点超出屏幕范围，则裁剪，并生成新的三角形
        var w = Engine_1.EngineConfig.canvasWidth;
        var h = Engine_1.EngineConfig.canvasHeight;
        if (((x1 | y1) < 0) || (x1 >= w) || (y1 >= h) || ((x2 | y2) < 0) || (x2 >= w) || (y2 >= h) || ((x3 | y3) < 0) || (x3 >= w) || (y3 >= h)) {
            //TODO:裁剪掉超出屏幕的部分
            return;
        }
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
        // 画三角形前要进行边检查，确保三角形的三个点都在屏幕内，如果有点超出屏幕范围，则裁剪，并生成新的三角形
        var w = Engine_1.EngineConfig.canvasWidth;
        var h = Engine_1.EngineConfig.canvasHeight;
        if (((x1 | y1) < 0) || (x1 >= w) || (y1 >= h) || ((x2 | y2) < 0) || (x2 >= w) || (y2 >= h) || ((x3 | y3) < 0) || (x3 >= w) || (y3 >= h)) {
            //TODO:裁剪掉超出屏幕的部分
            return;
        }
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
        var viewportHeight = 1 / Engine_1.EngineConfig.aspectRatio;
        // 将投影坐标映射到Canvas像素坐标
        // X坐标：从 [-viewportWidth/2, viewportWidth/2] 映射到 [0, canvasWidth]
        // Y坐标：从 [-viewportHeight/2, viewportHeight/2] 映射到 [0, canvasHeight] (注意Y轴方向)
        var canvasX = ((point.x + viewportWidth / 2) / viewportWidth) * Engine_1.EngineConfig.canvasWidth;
        var canvasY = Engine_1.EngineConfig.canvasHeight - (((point.y + viewportHeight / 2) / viewportHeight) * Engine_1.EngineConfig.canvasHeight); // Canvas的Y轴通常是向下的
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
    RasterizationPipeline.prototype.ObjectToClipPos = function (vertex) {
        //TODO
        return Vector3_1.Vector3.ZERO;
    };
    RasterizationPipeline.prototype.ObjectToWorldNormal = function (normal, transform) {
        // 获取模型矩阵（局部到世界空间的变换矩阵）
        var modelMatrix = transform.localToWorldMatrix;
        // 计算模型矩阵的逆转置矩阵
        // 逆转置矩阵可以确保法线在非均匀缩放时仍然保持与表面垂直
        var inverseTransposeModel = modelMatrix.clone().inverse().transpose();
        // 使用逆转置矩阵变换法线向量（忽略平移分量，只应用旋转和缩放的逆变换）
        var worldNormal = inverseTransposeModel.multiplyVector3(normal);
        // 归一化结果，确保法线保持单位长度
        return worldNormal.normalize();
    };
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
            var screenX_1 = ((ndc.x + 1) / 2) * Engine_1.EngineConfig.canvasWidth;
            // 将NDC的y从[-1, 1]映射到[0, screenHeight]。注意屏幕坐标通常y向下为正，而NDC的y向上为正，所以需要翻转
            var screenY_1 = Engine_1.EngineConfig.canvasHeight - (((ndc.y + 1) / 2) * Engine_1.EngineConfig.canvasHeight);
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
        var mesh = renderer.mesh;
        if (!mesh) {
            return;
        }
        var triangles = mesh.triangles;
        // 1.剔除
        this.FrustumCulling();
        this.BackfaceCulling();
        this.OcclusionCulling();
        // 2.变换
        // MVP变换
        var screenVertices = this.VertexProcessingStage(mesh.vertices, renderer.transform);
        // 简单MVP变换
        // const screenVertices = this.EasyVertexProcessingStage(obj);
        // 3.裁剪
        // 4.光栅化与像素绘画
        // 最后绘制三角形到屏幕上
        for (var i = 0; i < triangles.length; i += 3) {
            var p1 = screenVertices[triangles[i]];
            var p2 = screenVertices[triangles[i + 1]];
            var p3 = screenVertices[triangles[i + 2]];
            // 线框模式，暂不支持顶点色
            if (this.drawMode === DrawMode.Wireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
            }
            else if (this.drawMode === DrawMode.Point) {
                this.DrawPixel(p1.x, p1.y, Color_1.Color.WHITE);
                this.DrawPixel(p2.x, p2.y, Color_1.Color.WHITE);
                this.DrawPixel(p3.x, p3.y, Color_1.Color.WHITE);
            }
            else if (this.drawMode === DrawMode.UV) {
                var p1_uv = mesh.uv[triangles[i]];
                var p2_uv = mesh.uv[triangles[i + 1]];
                var p3_uv = mesh.uv[triangles[i + 2]];
                var p1_color = new Color_1.Color(p1_uv.x * 255, p1_uv.y * 255, 0).ToUint32();
                var p2_color = new Color_1.Color(p2_uv.x * 255, p2_uv.y * 255, 0).ToUint32();
                var p3_color = new Color_1.Color(p3_uv.x * 255, p3_uv.y * 255, 0).ToUint32();
                this.DrawTriangleFilledWithVertexColor(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p1_color, p2_color, p3_color);
            }
            else if (this.drawMode === DrawMode.Normal) {
                var p1_normal = this.ObjectToWorldNormal(mesh.normals[triangles[i]], renderer.transform);
                var p2_normal = this.ObjectToWorldNormal(mesh.normals[triangles[i + 1]], renderer.transform);
                var p3_normal = this.ObjectToWorldNormal(mesh.normals[triangles[i + 2]], renderer.transform);
                // 将法线分量从 [-1, 1] 映射到 [0, 255]
                var r = Math.floor((p1_normal.x + 1) * 0.5 * 255);
                var g = Math.floor((p1_normal.y + 1) * 0.5 * 255);
                var b = Math.floor((p1_normal.z + 1) * 0.5 * 255);
                var p1_color = new Color_1.Color(r, g, b).ToUint32();
                r = Math.floor((p2_normal.x + 1) * 0.5 * 255);
                g = Math.floor((p2_normal.y + 1) * 0.5 * 255);
                b = Math.floor((p2_normal.z + 1) * 0.5 * 255);
                var p2_color = new Color_1.Color(r, g, b).ToUint32();
                r = Math.floor((p3_normal.x + 1) * 0.5 * 255);
                g = Math.floor((p3_normal.y + 1) * 0.5 * 255);
                b = Math.floor((p3_normal.z + 1) * 0.5 * 255);
                var p3_color = new Color_1.Color(r, g, b).ToUint32();
                this.DrawTriangleFilledWithVertexColor(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p1_color, p2_color, p3_color);
            }
            else if (this.drawMode === DrawMode.Shader) {
                this.DrawTriangleFilled(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
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
},{"./Color":1,"./Component/Camera":2,"./Component/Renderer":6,"./Engine":7,"./Logger":10,"./Math/Vector2":14,"./Math/Vector3":15,"./Math/Vector4":16}],19:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.MainScene = void 0;
var Camera_1 = require("../Component/Camera");
var CameraController_1 = require("../Component/CameraController");
var MeshRenderer_1 = require("../Component/MeshRenderer");
var GameObject_1 = require("../GameObject");
var Vector3_1 = require("../Math/Vector3");
var AssetLoader_1 = require("../Utils/AssetLoader");
exports.MainScene = {
    name: "MainScene",
    initfun: function (scene) {
        // 相机
        var camera = new GameObject_1.GameObject("camera");
        scene.addGameObject(camera);
        camera.addComponent(Camera_1.Camera);
        camera.addComponent(CameraController_1.CameraController);
        var obj;
        // 加载模型
        AssetLoader_1.AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then(function (model) {
            obj = new GameObject_1.GameObject("male02");
            obj.transform.position = new Vector3_1.Vector3(0, 0, 2);
            var renderer = obj.addComponent(MeshRenderer_1.MeshRenderer);
            renderer.mesh = model;
            //lee.addComponent(ObjRotate);
            scene.addGameObject(obj);
        });
        AssetLoader_1.AssetLoader.loadModel('resources/cube.obj').then(function (model) {
            var cube = new GameObject_1.GameObject("cube");
            cube.transform.position = new Vector3_1.Vector3(2, 0, 0);
            cube.transform.scale = new Vector3_1.Vector3(0.1, 0.1, 0.1);
            var renderer = cube.addComponent(MeshRenderer_1.MeshRenderer);
            renderer.mesh = model;
            //cube.addComponent(ObjRotate);
            cube.transform.setParent(obj.transform, false);
        });
    }
};
},{"../Component/Camera":2,"../Component/CameraController":3,"../Component/MeshRenderer":5,"../GameObject":8,"../Math/Vector3":15,"../Utils/AssetLoader":23}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.SceneManager = void 0;
var Scene_1 = require("./Scene");
var SceneManager = /** @class */ (function () {
    function SceneManager() {
        this.scenes = new Map();
        this.activeScene = null;
    }
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
    SceneManager.prototype.loadScene = function (data) {
        if (!data.name || !data.initfun) {
            return;
        }
        // 初始化场景
        var mainScene = this.createScene(data.name);
        data.initfun(mainScene);
        this.setActiveScene(mainScene);
    };
    return SceneManager;
}());
exports.SceneManager = SceneManager;
},{"./Scene":20}],22:[function(require,module,exports){
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
},{"./Math/Matrix4x4":12,"./Math/Quaternion":13,"./Math/Vector3":15,"./Math/Vector4":16}],23:[function(require,module,exports){
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
var ObjParser_ts_1 = require("./ObjParser.ts");
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
    AssetLoader.loadModel = function (modelPath, scale) {
        if (scale === void 0) { scale = 1; }
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
                            model = ObjParser_ts_1.OBJParser.parse(objDoc, scale);
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
},{"./Dictionary":24,"./ObjParser.ts":25}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.OBJParser = void 0;
var Mesh_1 = require("../Mesh");
var Mesh_2 = require("../Mesh");
var Vector2_1 = require("../Math/Vector2");
var Vector3_1 = require("../Math/Vector3");
var Vector4_1 = require("../Math/Vector4");
var Bounds_1 = require("../Math/Bounds");
var OBJParser = /** @class */ (function () {
    function OBJParser() {
    }
    /**
     * 解析OBJ文件内容并生成Mesh对象
     * @param content OBJ文件的文本内容
     * @param scale 模型缩放比例，默认1.0
     * @returns 解析后的Mesh对象
     */
    OBJParser.parse = function (content, scale) {
        if (scale === void 0) { scale = 1; }
        var mesh = new Mesh_1.Mesh();
        mesh.vertices = [];
        mesh.uv = [];
        mesh.normals = [];
        mesh.tangents = [];
        mesh.triangles = [];
        mesh.bounds = [];
        mesh.subMeshes = [];
        // 临时存储OBJ文件中的原始数据（索引从1开始）
        var tempVertices = [];
        var tempUvs = [];
        var tempNormals = [];
        // 顶点索引映射表：用于去重 (格式: "vIndex/vtIndex/vnIndex" => 合并后的索引)
        var vertexMap = new Map();
        // 按行分割内容并处理
        var lines = content.split(/\r?\n/);
        var currentSubMesh = null;
        var _loop_1 = function (line) {
            var trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                return "continue";
            }
            var parts = trimmedLine.split(/\s+/);
            var type = parts[0];
            var data = parts.slice(1);
            switch (type) {
                case 'v': // 顶点坐标 (x, y, z) - 应用缩放
                    if (data.length >= 3) {
                        tempVertices.push(new Vector3_1.Vector3(parseFloat(data[0]) * scale, parseFloat(data[1]) * scale, parseFloat(data[2]) * scale));
                    }
                    break;
                case 'vt': // 纹理坐标 (u, v)
                    if (data.length >= 2) {
                        tempUvs.push(new Vector2_1.Vector2(parseFloat(data[0]), 1 - parseFloat(data[1]) // 翻转V轴
                        ));
                    }
                    break;
                case 'vn': // 法线 (x, y, z)
                    if (data.length >= 3) {
                        tempNormals.push(new Vector3_1.Vector3(parseFloat(data[0]), parseFloat(data[1]), parseFloat(data[2])));
                    }
                    break;
                case 'g': // 处理组指令，创建新的子网格
                    // 结算当前子网格
                    if (currentSubMesh) {
                        currentSubMesh.vertexCount = mesh.vertices.length - currentSubMesh.firstVertex;
                        currentSubMesh.indexCount = mesh.triangles.length - currentSubMesh.indexStart;
                    }
                    // 创建新子网格
                    currentSubMesh = new Mesh_2.SubMesh();
                    currentSubMesh.firstVertex = mesh.vertices.length;
                    currentSubMesh.indexStart = mesh.triangles.length;
                    currentSubMesh.vertexCount = 0;
                    currentSubMesh.indexCount = 0;
                    currentSubMesh.bounds = new Bounds_1.Bounds();
                    mesh.subMeshes.push(currentSubMesh);
                    break;
                case 'f': // 面
                    if (data.length < 3)
                        break;
                    // 初始化当前子网格（如果没有）
                    if (!currentSubMesh) {
                        currentSubMesh = new Mesh_2.SubMesh();
                        currentSubMesh.firstVertex = mesh.vertices.length;
                        currentSubMesh.indexStart = mesh.triangles.length;
                        currentSubMesh.vertexCount = 0;
                        currentSubMesh.indexCount = 0;
                        currentSubMesh.bounds = new Bounds_1.Bounds();
                        mesh.subMeshes.push(currentSubMesh);
                    }
                    // 处理面的顶点数据
                    var faceVertices_1 = data.map(function (vertexStr) {
                        var indices = vertexStr.split('/').map(function (idx) { return parseInt(idx) || 0; });
                        return {
                            v: indices[0] - 1,
                            vt: indices[1] - 1,
                            vn: indices[2] - 1
                        };
                    });
                    // 处理三角形化和顶点去重
                    for (var i = 2; i < faceVertices_1.length; i++) {
                        [0, i - 1, i].forEach(function (idx) {
                            var _a = faceVertices_1[idx], v = _a.v, vt = _a.vt, vn = _a.vn;
                            // 创建唯一标识键
                            var key = (v >= 0 ? v : -1) + "/" + (vt >= 0 ? vt : -1) + "/" + (vn >= 0 ? vn : -1);
                            if (vertexMap.has(key)) {
                                // 复用已存在的顶点索引
                                mesh.triangles.push(vertexMap.get(key));
                            }
                            else {
                                // 添加新顶点数据
                                var newIndex = mesh.vertices.length;
                                vertexMap.set(key, newIndex);
                                // 顶点数据
                                mesh.vertices.push(v >= 0 && v < tempVertices.length ? tempVertices[v] : new Vector3_1.Vector3(0, 0, 0));
                                // UV数据
                                mesh.uv.push(vt >= 0 && vt < tempUvs.length ? tempUvs[vt] : new Vector2_1.Vector2(0, 0));
                                // 法线数据
                                mesh.normals.push(vn >= 0 && vn < tempNormals.length ? tempNormals[vn] : new Vector3_1.Vector3(0, 0, 1));
                                // 先初始化切线为零向量，后续会计算
                                mesh.tangents.push(new Vector4_1.Vector4(0, 0, 0, 1));
                                // 添加索引
                                mesh.triangles.push(newIndex);
                            }
                        });
                    }
                    break;
            }
        };
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            _loop_1(line);
        }
        // 更新子网格信息
        mesh.subMeshes.forEach(function (subMesh) {
            subMesh.vertexCount = mesh.vertices.length - subMesh.firstVertex;
            subMesh.indexCount = mesh.triangles.length - subMesh.indexStart;
            // 计算子网格包围盒
            var subVertices = mesh.vertices.slice(subMesh.firstVertex, subMesh.firstVertex + subMesh.vertexCount);
            subMesh.bounds = Bounds_1.Bounds.fromPoints(subVertices);
        });
        // 计算切线向量
        this.calculateTangents(mesh);
        // 计算整体包围盒
        mesh.bounds = mesh.subMeshes.map(function (sm) { return sm.bounds; });
        return mesh;
    };
    /**
     * 计算网格的切线向量
     * 基于顶点位置、UV和三角形索引计算
     */
    OBJParser.calculateTangents = function (mesh) {
        if (mesh.vertices.length === 0 || mesh.triangles.length === 0)
            return;
        // 临时数组存储每个顶点的切线计算数据
        var tan1 = new Array(mesh.vertices.length).fill(0).map(function () { return new Vector3_1.Vector3(0, 0, 0); });
        var tan2 = new Array(mesh.vertices.length).fill(0).map(function () { return new Vector3_1.Vector3(0, 0, 0); });
        // 遍历所有三角形
        for (var i = 0; i < mesh.triangles.length; i += 3) {
            var i0 = mesh.triangles[i];
            var i1 = mesh.triangles[i + 1];
            var i2 = mesh.triangles[i + 2];
            // 获取三角形的三个顶点
            var v0 = mesh.vertices[i0];
            var v1 = mesh.vertices[i1];
            var v2 = mesh.vertices[i2];
            // 获取对应的UV坐标
            var w0 = mesh.uv[i0];
            var w1 = mesh.uv[i1];
            var w2 = mesh.uv[i2];
            // 计算边向量
            var x1 = v1.x - v0.x;
            var y1 = v1.y - v0.y;
            var z1 = v1.z - v0.z;
            var x2 = v2.x - v0.x;
            var y2 = v2.y - v0.y;
            var z2 = v2.z - v0.z;
            // 计算UV差值
            var s1 = w1.x - w0.x;
            var t1 = w1.y - w0.y;
            var s2 = w2.x - w0.x;
            var t2 = w2.y - w0.y;
            // 计算切线向量
            var r = 1.0 / (s1 * t2 - s2 * t1);
            var tx = (t2 * x1 - t1 * x2) * r;
            var ty = (t2 * y1 - t1 * y2) * r;
            var tz = (t2 * z1 - t1 * z2) * r;
            // 累加切线数据
            tan1[i0].x += tx;
            tan1[i0].y += ty;
            tan1[i0].z += tz;
            tan1[i1].x += tx;
            tan1[i1].y += ty;
            tan1[i1].z += tz;
            tan1[i2].x += tx;
            tan1[i2].y += ty;
            tan1[i2].z += tz;
            // 计算副切线向量
            var bx = (s1 * x2 - s2 * x1) * r;
            var by = (s1 * y2 - s2 * y1) * r;
            var bz = (s1 * z2 - s2 * z1) * r;
            tan2[i0].x += bx;
            tan2[i0].y += by;
            tan2[i0].z += bz;
            tan2[i1].x += bx;
            tan2[i1].y += by;
            tan2[i1].z += bz;
            tan2[i2].x += bx;
            tan2[i2].y += by;
            tan2[i2].z += bz;
        }
        // 计算最终切线并规范化
        for (var i = 0; i < mesh.vertices.length; i++) {
            var n = mesh.normals[i];
            var t = tan1[i];
            // 正交化切线（Gram-Schmidt过程）
            var tangent = Vector3_1.Vector3.subtract(t, Vector3_1.Vector3.multiply(n, Vector3_1.Vector3.dot(n, t))).normalize();
            // 计算切线方向（ handedness ）
            var handedness = Vector3_1.Vector3.dot(Vector3_1.Vector3.cross(n, t), tan2[i]) < 0.0 ? -1 : 1;
            // 存储切线（w分量表示方向）
            mesh.tangents[i] = new Vector4_1.Vector4(tangent.x, tangent.y, tangent.z, handedness);
        }
    };
    return OBJParser;
}());
exports.OBJParser = OBJParser;
},{"../Math/Bounds":11,"../Math/Vector2":14,"../Math/Vector3":15,"../Math/Vector4":16,"../Mesh":17}],26:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Logger_1 = require("./Logger");
var Engine_1 = require("./Engine");
// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化引擎
    Engine_1.Engine.Init();
    // 主循环
    function mainLoop() {
        // 处理逻辑
        Engine_1.Engine.Update();
        // 渲染
        Engine_1.Engine.Render();
        // 屏幕输出日志
        Logger_1.Logger.printLogs();
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});
},{"./Engine":7,"./Logger":10}]},{},[26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvQ29tcG9uZW50L0NhbWVyYS50cyIsInNyYy9Db21wb25lbnQvQ2FtZXJhQ29udHJvbGxlci50cyIsInNyYy9Db21wb25lbnQvQ29tcG9uZW50LnRzIiwic3JjL0NvbXBvbmVudC9NZXNoUmVuZGVyZXIudHMiLCJzcmMvQ29tcG9uZW50L1JlbmRlcmVyLnRzIiwic3JjL0VuZ2luZS50cyIsInNyYy9HYW1lT2JqZWN0LnRzIiwic3JjL0lucHV0LnRzIiwic3JjL0xvZ2dlci50cyIsInNyYy9NYXRoL0JvdW5kcy50cyIsInNyYy9NYXRoL01hdHJpeDR4NC50cyIsInNyYy9NYXRoL1F1YXRlcm5pb24udHMiLCJzcmMvTWF0aC9WZWN0b3IyLnRzIiwic3JjL01hdGgvVmVjdG9yMy50cyIsInNyYy9NYXRoL1ZlY3RvcjQudHMiLCJzcmMvTWVzaC50cyIsInNyYy9SYXN0ZXJpemF0aW9uUGlwZWxpbmUudHMiLCJzcmMvU2NlbmUvTWFpblNjZW5lLnRzIiwic3JjL1NjZW5lL1NjZW5lLnRzIiwic3JjL1NjZW5lL1NjZW5lTWFuYWdlci50cyIsInNyYy9UcmFuc2Zyb20udHMiLCJzcmMvVXRpbHMvQXNzZXRMb2FkZXIudHMiLCJzcmMvVXRpbHMvRGljdGlvbmFyeS50cyIsInNyYy9VdGlscy9PYmpQYXJzZXIudHMiLCJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTtJQWtCSSxlQUFZLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQWU7UUFBZixrQkFBQSxFQUFBLE9BQWU7UUFDeEQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxD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QyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdHLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEQsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsQ0FBVTtRQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXBCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdB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RyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEQsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckM7aUJBQU07Z0JBQ0gsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7YUFDbEI7U0FDSjtRQUVELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLG1DQUFlLEdBQXRCO1FBQ0ksaUVBQWlFO1FBQ2pFLGdDQUFnQztRQUNoQyxnREFBZ0Q7UUFDaEQsWUFBWTtRQUVaLElBQUksR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDMUIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXJCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUViLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFD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R0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNFLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLDZCQUFTLEdBQWhCO1FBQ0ksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUVoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxD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QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQzNCLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSwyQkFBTyxHQUFkO1FBQ0ksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFFbkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRTFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7WUFDNUQsZUFBZTtTQUNsQjtRQUVELEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBRWhCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUUzRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0saUNBQWEsR0FBcEI7UUFDSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLDBCQUEwQjtRQUMxQixPQUFPLElBQUksWUFBWSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMs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QyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5ELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFYSxxQ0FBMkIsR0FBekMsVUFBMEMsQ0FBYTtRQUNuRCxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FB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QUFDLENBQUM7UUFFeEIsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUM5QixHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNkLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ1QsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVhLHdCQUFjLEdBQTVCLFVBQTZCLENBQVU7UUFDbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELHNCQUFrQixxQkFBUTthQUExQjtZQUNJLElBQUksQ0FBQyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLE1B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Q0FBQztRQUViLHVCQUF1QjtRQUN2QixJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlDLGtDQUFrQztRQUNsQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFD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Q0FBQztRQUNsQixDQUFDLENBQUM7UUFFRixjQUFjO1FBQ2QsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFB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LFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZFLElBQU0sUUFBUSxHQUFHLElBQUksYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2RSxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkUsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDNUc7aUJBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3hDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDM0YsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0YsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0YsOEJBQThCO2dCQUM5QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRCxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM1RztpQkFDSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDeEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLGFBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1RTtTQUNKO0lBQ0wsQ0FBQztJQUVELFlBQVk7SUFFWixjQUFjO0lBRWQsYUFBYTtJQUNiLFFBQVE7SUFDUixzQkFBc0I7SUFDdEIsT0FBTztJQUNQLHNGQUFzRjtJQUN0RixrRUFBa0U7SUFDbEUsU0FBUztJQUNULG1GQUFtRjtJQUNuRixjQUFjO0lBQ04sMkNBQVcsR0FBbkIsVUFBb0IsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtRQUM5RCxpQkFBaUI7UUFDakIsNENBQTRDO1FBQzVDLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVYLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDVjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFHTCw0QkFBQztBQUFELENBdG5CQSxBQXNuQkMsSUFBQTtBQXRuQlksc0RBQXFCOzs7OztBQ25CbEMsOENBQTZDO0FBQzdDLGtFQUFpRTtBQUNqRSwwREFBeUQ7QUFDekQsNENBQTJDO0FBQzNDLDJDQUEwQztBQUMxQyxvREFBbUQ7QUFHdEMsUUFBQSxTQUFTLEdBQUc7SUFDckIsSUFBSSxFQUFFLFdBQVc7SUFDakIsT0FBTyxFQUFFLFVBQUMsS0FBWTtRQUNsQixLQUFLO1FBQ0wsSUFBTSxNQUFNLEdBQUcsSUFBSSx1QkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFNLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsWUFBWSxDQUFDLG1DQUFnQixDQUFDLENBQUM7UUFFdEMsSUFBSSxHQUFlLENBQUM7UUFDcEIsT0FBTztRQUNQLHlCQUFXLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUs7WUFDdEUsR0FBRyxHQUFHLElBQUksdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLDJCQUFZLENBQUMsQ0FBQztZQUNoRCxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUN0Qiw4QkFBOEI7WUFDOUIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILHlCQUFXLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSztZQUNuRCxJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQywyQkFBWSxDQUFDLENBQUM7WUFDakQsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDdEIsK0JBQStCO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQTs7Ozs7Ozs7Ozs7O0FDcENEO0lBSUksZUFBWSxJQUFZO1FBRmhCLG9CQUFlLEdBQWlCLEVBQUUsQ0FBQztRQUd2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNkJBQWEsR0FBcEIsVUFBcUIsVUFBc0I7UUFDdkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLGdDQUFnQixHQUF2QixVQUF3QixVQUFzQjtRQUMxQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2RCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN6QztJQUNMLENBQUM7SUFFTSxrQ0FBa0IsR0FBekI7UUFDSSxzQkFBVyxJQUFJLENBQUMsZUFBZSxFQUFFO0lBQ3JDLENBQUM7SUFFTSxzQkFBTSxHQUFiO1FBQ0ksaUJBQWlCO1FBQ2pCLEtBQXlCLFVBQW9CLEVBQXBCLEtBQUEsSUFBSSxDQUFDLGVBQWUsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0IsRUFBRTtZQUExQyxJQUFNLFVBQVUsU0FBQTtZQUNqQixVQUFVLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDN0IsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBQ0wsWUFBQztBQUFELENBOUJBLEFBOEJDLElBQUE7QUE5Qlksc0JBQUs7Ozs7O0FDRmxCLGlDQUFnQztBQUVoQztJQUFBO1FBQ1ksV0FBTSxHQUF1QixJQUFJLEdBQUcsRUFBaUIsQ0FBQztRQUN0RCxnQkFBVyxHQUFpQixJQUFJLENBQUM7SUEyQzdDLENBQUM7SUF6Q1Usa0NBQVcsR0FBbEIsVUFBbUIsSUFBWTtRQUMzQixJQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLCtCQUFRLEdBQWYsVUFBZ0IsSUFBWTtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxxQ0FBYyxHQUFyQixVQUFzQixLQUFxQjtRQUN2QyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUMzQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxJQUFJLFVBQVUsRUFBRTtnQkFDWixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQzthQUNqQztTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUM1QjtJQUNMLENBQUM7SUFFTSxxQ0FBYyxHQUFyQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRU0sd0NBQWlCLEdBQXhCO1FBQ0ksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDN0I7SUFDTCxDQUFDO0lBRU0sZ0NBQVMsR0FBaEIsVUFBaUIsSUFBUztRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsT0FBTztTQUNWO1FBRUQsUUFBUTtRQUNSLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQTdDQSxBQTZDQyxJQUFBO0FBN0NZLG9DQUFZOzs7OztBQ0R6Qiw4Q0FBNkM7QUFDN0MsZ0RBQStDO0FBQy9DLDBDQUF5QztBQUN6QywwQ0FBeUM7QUFFekM7SUFTSSxtQkFBWSxVQUFzQjtRQUwxQixZQUFPLEdBQXFCLElBQUksQ0FBQztRQU1yQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLHVCQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUM7SUFDbEMsQ0FBQztJQUVELHNCQUFXLGlDQUFVO2FBQXJCO1lBQ0ksT0FBTyxxQkFBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7OztPQUFBO0lBRUQsc0JBQVcseUNBQWtCO2FBQTdCO1lBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLHFCQUFTLENBQUMsUUFBUSxDQUFDO1lBQ2xGLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx5Q0FBa0I7YUFBN0I7WUFDSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMscUJBQVMsQ0FBQyxRQUFRLENBQUM7WUFDbEYsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdCQUFDO2FBQVo7WUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7YUFFRCxVQUFhLENBQVM7WUFDbEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN4QixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUM7OztPQU5BO0lBUUQsc0JBQVcsd0JBQUM7YUFBWjtZQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQzthQUVELFVBQWEsQ0FBUztZQUNsQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDeEIsQ0FBQzs7O09BTkE7SUFRRCxzQkFBVyx3QkFBQzthQUFaO1lBQ0ksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO2FBRUQsVUFBYSxDQUFTO1lBQ2xCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDeEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUN4QixDQUFDOzs7T0FOQTtJQVFELHNCQUFXLDhCQUFPO2FBQWxCO1lBQ0ksMkNBQTJDO1lBQzNDLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7OztPQUFBO0lBRUQsc0JBQVcseUJBQUU7YUFBYjtZQUNJLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsNEJBQUs7YUFBaEI7WUFDSSxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtCQUFRO2FBQW5CO1lBQ0ksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2pDLENBQUM7YUFFRCxVQUFvQixHQUFZO1lBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUM7OztPQUpBO0lBTUQsc0JBQVcsb0NBQWE7YUFBeEI7WUFDSSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtCQUFRO2FBQW5CO1lBQ0ksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2pDLENBQUM7YUFFRCxVQUFvQixDQUFhO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7OztPQUpBO0lBTUQsc0JBQVcsb0NBQWE7YUFBeEI7WUFDSSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNwRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDRCQUFLO2FBQWhCO1lBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25DLENBQUM7YUFFRCxVQUFpQixDQUFVO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7OztPQUpBO0lBTUQsc0JBQVcsaUNBQVU7YUFBckI7WUFDSSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFNO2FBQWpCO1lBQ0ksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7OztPQUFBO0lBRU0sNkJBQVMsR0FBaEIsVUFBaUIsTUFBaUIsRUFBRSxrQkFBa0M7UUFBbEMsbUNBQUEsRUFBQSx5QkFBa0M7UUFDbEUsSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDM0Qsc0NBQXNDO1lBQ3RDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO2dCQUM5RSxPQUFPO2FBQ1Y7WUFFRCxtQkFBbUI7WUFDbkIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7YUFDckQ7WUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQzdDO2FBQ0ksSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ3JEO0lBQ0wsQ0FBQztJQUVELGVBQWU7SUFDUiw2QkFBUyxHQUFoQixVQUFpQixDQUFZO1FBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJO1lBQ25CLE9BQU8sS0FBSyxDQUFDO2FBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUM7O1lBRVosT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU8sNEJBQVEsR0FBaEIsVUFBaUIsS0FBZ0IsRUFBRSxrQkFBa0M7UUFBbEMsbUNBQUEsRUFBQSx5QkFBa0M7UUFDakUsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNsRSwwQ0FBMEM7WUFDMUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7Z0JBQzNFLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1lBRUQsa0JBQWtCO1lBQ2xCLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7Z0JBQ3RCLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2FBQ3ZEO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFFckIsSUFBSSxrQkFBa0IsRUFBRTtnQkFDcEIsNkNBQTZDO2dCQUM3QyxjQUFjO2dCQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMzRCxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ25DO1lBRUQsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTywrQkFBVyxHQUFuQixVQUFvQixLQUFnQixFQUFFLGtCQUFrQztRQUFsQyxtQ0FBQSxFQUFBLHlCQUFrQztRQUNwRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFNUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFFWixJQUFJLGtCQUFrQixFQUFFO2dCQUNwQiwyQkFBMkI7Z0JBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMzRCxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ25DO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sc0NBQWtCLEdBQXpCLFVBQTBCLENBQVUsRUFBRSxDQUFhO1FBQWIsa0JBQUEsRUFBQSxLQUFhO1FBQy9DOzs7O1dBSUc7UUFDSCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM5RSxDQUFDO0lBRU0sdUNBQW1CLEdBQTFCLFVBQTJCLENBQVUsRUFBRSxDQUFhO1FBQWIsa0JBQUEsRUFBQSxLQUFhO1FBQ2hELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzlFLENBQUM7SUFFTSwyQkFBTyxHQUFkLFVBQWUsZUFBK0I7UUFBOUMsaUJBV0M7UUFYYyxnQ0FBQSxFQUFBLHNCQUErQjtRQUMxQyxJQUFJLGVBQWUsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7Z0JBQ3ZCLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7U0FDTjthQUNJO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO2dCQUN2QixLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQTVOQSxBQTROQyxJQUFBO0FBNU5ZLDhCQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0x0QiwyQ0FBMEM7QUFDMUMsK0NBQTJDO0FBRTNDO0lBQUE7SUFrRUEsQ0FBQztJQS9EaUIseUJBQWEsR0FBM0IsVUFBNEIsUUFBZ0I7UUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBbUIsVUFBQyxPQUFPO1lBRXpDLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNO2dCQUNILElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUNuRCxPQUFPO2lCQUNWO2dCQUVELDhEQUE4RDtnQkFDOUQsS0FBSyxDQUFDLE1BQU0sR0FBRztvQkFDWCxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDO2dCQUVGLE9BQU87Z0JBQ1AsS0FBSyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBRXZCLG9DQUFvQztnQkFDcEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7YUFDeEI7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFYSx3QkFBWSxHQUExQixVQUEyQixRQUFnQjtRQUN2QyxPQUFPLElBQUksT0FBTyxDQUFTLFVBQVUsT0FBTztZQUV4QyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNyQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUNoRDtpQkFDSTtnQkFDRCxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUVuQyxPQUFPLENBQUMsa0JBQWtCLEdBQUc7b0JBQ3pCLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7d0JBQzFCLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7NEJBQ3hCLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQzFELE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7eUJBQ2pDOzZCQUNJOzRCQUNELE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDZjtxQkFDSjtnQkFDTCxDQUFDLENBQUM7Z0JBRUYsNkNBQTZDO2dCQUM3QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3JDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNsQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVtQixxQkFBUyxHQUE3QixVQUE4QixTQUFpQixFQUFFLEtBQWlCO1FBQWpCLHNCQUFBLEVBQUEsU0FBaUI7Ozs7Ozt3QkFDMUQsS0FBSyxHQUFnQixJQUFJLENBQUM7d0JBQ2pCLHFCQUFNLFdBQVcsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUE7O3dCQUFsRCxNQUFNLEdBQUcsU0FBeUM7d0JBQ3RELElBQUksTUFBTSxJQUFJLElBQUksRUFBRTs0QkFDaEIsS0FBSyxHQUFHLHdCQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDMUM7d0JBQ0Qsc0JBQU8sS0FBSyxFQUFDOzs7O0tBQ2hCO0lBaEVjLHFCQUFTLEdBQWUsSUFBSSx1QkFBVSxFQUFFLENBQUM7SUFpRTVELGtCQUFDO0NBbEVELEFBa0VDLElBQUE7QUFsRVksa0NBQVc7Ozs7O0FDSnhCO0lBSUU7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsc0JBQUksNkJBQUs7YUFBVDtZQUNFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hDLENBQUM7OztPQUFBO0lBRUQsd0JBQUcsR0FBSCxVQUFJLEdBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCx3QkFBRyxHQUFILFVBQUksR0FBUSxFQUFFLEdBQVE7UUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDeEIsQ0FBQztJQUVELHFCQUFBLFFBQU0sQ0FBQSxHQUFOLFVBQU8sR0FBUTtRQUNiLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCx3QkFBRyxHQUFILFVBQUksR0FBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3JELENBQUM7SUFFRCwwQkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFDRSxJQUFJLE1BQU0sR0FBVSxFQUFFLENBQUM7UUFDdkIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1QjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELDRCQUFPLEdBQVAsVUFBUSxHQUFHO1FBQ1QsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FsREEsQUFrREMsSUFBQTtBQWxEWSxnQ0FBVTs7Ozs7QUNBdkIsZ0NBQStCO0FBQy9CLGdDQUFrQztBQUNsQywyQ0FBMEM7QUFDMUMsMkNBQTBDO0FBQzFDLDJDQUEwQztBQUMxQyx5Q0FBd0M7QUFFeEM7SUFBQTtJQXNRQSxDQUFDO0lBclFHOzs7OztPQUtHO0lBQ0ksZUFBSyxHQUFaLFVBQWEsT0FBZSxFQUFFLEtBQWlCO1FBQWpCLHNCQUFBLEVBQUEsU0FBaUI7UUFDM0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXBCLDBCQUEwQjtRQUMxQixJQUFNLFlBQVksR0FBYyxFQUFFLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO1FBQzlCLElBQU0sV0FBVyxHQUFjLEVBQUUsQ0FBQztRQUVsQyx3REFBd0Q7UUFDeEQsSUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFFNUMsWUFBWTtRQUNaLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxjQUFjLEdBQW1CLElBQUksQ0FBQztnQ0FFL0IsSUFBSTtZQUNYLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7O2FBRWhEO1lBRUQsSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1QixRQUFRLElBQUksRUFBRTtnQkFDVixLQUFLLEdBQUcsRUFBRSx3QkFBd0I7b0JBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ2xCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBTyxDQUN6QixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUMzQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUMzQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUM5QixDQUFDLENBQUM7cUJBQ047b0JBQ0QsTUFBTTtnQkFFVixLQUFLLElBQUksRUFBRSxjQUFjO29CQUNyQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO3dCQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQU8sQ0FDcEIsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNuQixDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87eUJBQ2xDLENBQUMsQ0FBQztxQkFDTjtvQkFDRCxNQUFNO2dCQUVWLEtBQUssSUFBSSxFQUFFLGVBQWU7b0JBQ3RCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ2xCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBTyxDQUN4QixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ25CLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDbkIsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0QixDQUFDLENBQUM7cUJBQ047b0JBQ0QsTUFBTTtnQkFFVixLQUFLLEdBQUcsRUFBRSxnQkFBZ0I7b0JBQ3RCLFVBQVU7b0JBQ1YsSUFBSSxjQUFjLEVBQUU7d0JBQ2hCLGNBQWMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQzt3QkFDL0UsY0FBYyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO3FCQUNqRjtvQkFDRCxTQUFTO29CQUNULGNBQWMsR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO29CQUMvQixjQUFjLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO29CQUNsRCxjQUFjLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO29CQUNsRCxjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztvQkFDL0IsY0FBYyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQzlCLGNBQWMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3BDLE1BQU07Z0JBRVYsS0FBSyxHQUFHLEVBQUUsSUFBSTtvQkFDVixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQzt3QkFBRSxNQUFNO29CQUUzQixpQkFBaUI7b0JBQ2pCLElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQ2pCLGNBQWMsR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO3dCQUMvQixjQUFjLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNsRCxjQUFjLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO3dCQUNsRCxjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQzt3QkFDL0IsY0FBYyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7d0JBQzlCLGNBQWMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQzt3QkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7cUJBQ3ZDO29CQUVELFdBQVc7b0JBQ1gsSUFBTSxjQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVM7d0JBQ25DLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO3dCQUNwRSxPQUFPOzRCQUNILENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs0QkFDakIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOzRCQUNsQixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQ3JCLENBQUM7b0JBQ04sQ0FBQyxDQUFDLENBQUM7b0JBRUgsY0FBYztvQkFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDMUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHOzRCQUNmLElBQUEsS0FBZ0IsY0FBWSxDQUFDLEdBQUcsQ0FBQyxFQUEvQixDQUFDLE9BQUEsRUFBRSxFQUFFLFFBQUEsRUFBRSxFQUFFLFFBQXNCLENBQUM7NEJBRXhDLFVBQVU7NEJBQ1YsSUFBTSxHQUFHLEdBQUcsQ0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDOzRCQUUzRSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0NBQ3BCLGFBQWE7Z0NBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDOzZCQUM1QztpQ0FBTTtnQ0FDSCxVQUFVO2dDQUNWLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dDQUN0QyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FFN0IsT0FBTztnQ0FDUCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBRS9GLE9BQU87Z0NBQ1AsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBRS9FLE9BQU87Z0NBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUUvRixtQkFBbUI7Z0NBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUU1QyxPQUFPO2dDQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZCQUNqQzt3QkFDTCxDQUFDLENBQUMsQ0FBQztxQkFDTjtvQkFDRCxNQUFNO2FBQ2I7O1FBbEhMLEtBQW1CLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO1lBQW5CLElBQU0sSUFBSSxjQUFBO29CQUFKLElBQUk7U0FtSGQ7UUFFRCxVQUFVO1FBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQzFCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUNqRSxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFFaEUsV0FBVztZQUNYLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUNuQyxPQUFPLENBQUMsV0FBVyxFQUNuQixPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQzVDLENBQUM7WUFDRixPQUFPLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTO1FBQ1QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLFVBQVU7UUFDVixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLE1BQU0sRUFBVCxDQUFTLENBQUMsQ0FBQztRQUVsRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ1ksMkJBQWlCLEdBQWhDLFVBQWlDLElBQVU7UUFDdkMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU87UUFFdEUsb0JBQW9CO1FBQ3BCLElBQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUNyRixJQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFFckYsVUFBVTtRQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9DLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFakMsYUFBYTtZQUNiLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTdCLFlBQVk7WUFDWixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV2QixRQUFRO1lBQ1IsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFdkIsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFdkIsU0FBUztZQUNULElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUV2QixTQUFTO1lBQ1QsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDcEMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFbkMsU0FBUztZQUNULElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FB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QixTQUFTO1FBQ1QsZUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25CLFVBQVU7UUFDVixxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsU0FBUztJQUNULHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgV0hJVEUgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxBQ0sgPSBuZXcgQ29sb3IoMCwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JBWSA9IG5ldyBDb2xvcigxMjgsIDEyOCwgMTI4KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRUQgPSBuZXcgQ29sb3IoMjU1LCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkVFTiA9IG5ldyBDb2xvcigwLCAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMVUUgPSBuZXcgQ29sb3IoMCwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBZRUxMT1cgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENZQU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BR0VOVEEgPSBuZXcgQ29sb3IoMjU1LCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE9SQU5HRSA9IG5ldyBDb2xvcigyNTUsIDE2NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFVSUExFID0gbmV3IENvbG9yKDEyOCwgMCwgMTI4KS5Ub1VpbnQzMigpO1xyXG5cclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyID0gMjU1KSB7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVG9VaW50MzIoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmEgPDwgMjQpIHwgKHRoaXMuYiA8PCAxNikgfCAodGhpcy5nIDw8IDgpIHwgdGhpcy5yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgRnJvbVVpbnQzMih1aW50MzI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoXHJcbiAgICAgICAgICAgIHVpbnQzMiAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gOCkgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDE2KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMjQpICYgMHhGRlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBFbmdpbmVDb25maWcgfSBmcm9tIFwiLi4vRW5naW5lXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGVudW0gQ2FtZXJhQ2xlYXJGbGFncyB7XHJcbiAgICBOT05FID0gMCxcclxuICAgIEFMTCA9IDE2Mzg0IHwgMjU2LFxyXG4gICAgQ29sb3IgPSAxNjM4NCwgIC8vZ2wuQ09MT1JfQlVGRkVSX0JJVFxyXG4gICAgRGVwdGggPSAyNTYsICAgIC8vZ2wuREVQVEhfQlVGRkVSX0JJVFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbWFpbkNhbWVyYTogQ2FtZXJhO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FtZXJhczogQXJyYXk8Q2FtZXJhPiA9IG5ldyBBcnJheTxDYW1lcmE+KCk7XHJcblxyXG4gICAgcHVibGljIGJhY2tHcm91bmRDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMC4yNywgMC4yNywgMC4yNywgMS4wKTtcclxuICAgIHB1YmxpYyBmb2dDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMC4yNywgMC4yNywgMC4yNywgMS4wKTtcclxuICAgIHB1YmxpYyBjbGVhckZsYWdzOiBDYW1lcmFDbGVhckZsYWdzID0gQ2FtZXJhQ2xlYXJGbGFncy5Db2xvciB8IENhbWVyYUNsZWFyRmxhZ3MuRGVwdGg7XHJcbiAgICBwdWJsaWMgbmVhckNsaXA6IG51bWJlciA9IDE7XHJcbiAgICBwdWJsaWMgZmFyQ2xpcDogbnVtYmVyID0gMTI4O1xyXG4gICAgcHVibGljIGZvdjogbnVtYmVyID0gNjA7XHJcbiAgICBwdWJsaWMgZGVwdGg6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdmlld1BvcnQ6IFZlY3RvcjQgPSBuZXcgVmVjdG9yNCgwLCAwLCAxLCAxKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFzcGVjdCgpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB2ID0gdGhpcy52aWV3UG9ydDtcclxuICAgICAgICByZXR1cm4gKHYueiAqIEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aCkgLyAodi53ICogRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF3YWtlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChDYW1lcmEubWFpbkNhbWVyYSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIENhbWVyYS5tYWluQ2FtZXJhID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQ2FtZXJhLmNhbWVyYXMucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95KCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IENhbWVyYS5jYW1lcmFzLmluZGV4T2YodGhpcywgMCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgQ2FtZXJhLmNhbWVyYXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChDYW1lcmEubWFpbkNhbWVyYSA9PSB0aGlzKSB7XHJcbiAgICAgICAgICAgIGlmIChDYW1lcmEuY2FtZXJhcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSBDYW1lcmEuY2FtZXJhc1swXTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBDYW1lcmE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uL0VuZ2luZVwiO1xyXG5pbXBvcnQgeyBJbnB1dCwgSW5wdXRBeGlzIH0gZnJvbSBcIi4uL0lucHV0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbWVyYUNvbnRyb2xsZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIG1vdmVTcGVlZCA9IDAuNTtcclxuICAgIHB1YmxpYyBtb3ZlU3BlZWRTaGlmdFNjYWxlID0gMi41O1xyXG4gICAgcHVibGljIGRhbXAgPSAwLjI7XHJcbiAgICBwdWJsaWMgcm90YXRlU3BlZWQgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgX2V1bGVyID0gbmV3IFZlY3RvcjMoKTtcclxuICAgIHByaXZhdGUgX3ZlbG9jaXR5ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IFZlY3RvcjMoKTtcclxuICAgIHByaXZhdGUgX3NwZWVkU2NhbGUgPSAxO1xyXG4gICAgcHJpdmF0ZSBfcm90YXRlQ2FtZXJhID0gZmFsc2U7XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5fZXVsZXIgPSB0aGlzLnRyYW5zZm9ybS5yb3RhdGlvbi5ldWxlckFuZ2xlcztcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUlucHV0KCkge1xyXG4gICAgICAgIC8vIOebuOacuuenu+WKqOS7peWPiuWKoOmAn1xyXG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLl92ZWxvY2l0eTtcclxuICAgICAgICB2LnggPSAtSW5wdXQuR2V0QXhpcyhJbnB1dEF4aXMuSG9yaXpvbnRhbCk7XHJcbiAgICAgICAgdi56ID0gSW5wdXQuR2V0QXhpcyhJbnB1dEF4aXMuVmVydGljYWwpO1xyXG4gICAgICAgIHYueSA9IElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLlEpID8gLTEgOiBJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5FKSA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMuX3NwZWVkU2NhbGUgPSBJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5TaGlmdCkgPyB0aGlzLm1vdmVTcGVlZFNoaWZ0U2NhbGUgOiAxO1xyXG5cclxuICAgICAgICAvLyDnm7jmnLrnvKnmlL5cclxuICAgICAgICBjb25zdCBzY3JvbGxEZWx0YSA9IC1JbnB1dC5tb3VzZVNjcm9sbERlbHRhLnkgKiB0aGlzLm1vdmVTcGVlZCAqIDAuMTtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy50cmFuc2Zvcm0ucm90YXRpb24udHJhbnNmb3JtUXVhdChWZWN0b3IzLkZPUldBUkQpO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5zY2FsZUFuZEFkZCh0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbiwgcG9zLCBzY3JvbGxEZWx0YSk7XHJcblxyXG4gICAgICAgIGlmIChJbnB1dC5HZXRNb3VzZUJ1dHRvbkRvd24oMikpIHtcclxuICAgICAgICAgICAgRW5naW5lLmNhbnZhcy5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICAgICAgdGhpcy5fcm90YXRlQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKElucHV0LkdldE1vdXNlQnV0dG9uVXAoMikpIHtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaykgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0ZUNhbWVyYSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fcm90YXRlQ2FtZXJhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdmVEZWx0YSA9IElucHV0Lm1vdXNlRGVsdGE7XHJcbiAgICAgICAgICAgIHRoaXMuX2V1bGVyLnkgLT0gbW92ZURlbHRhLnggKiB0aGlzLnJvdGF0ZVNwZWVkICogMC4xO1xyXG4gICAgICAgICAgICB0aGlzLl9ldWxlci54ICs9IG1vdmVEZWx0YS55ICogdGhpcy5yb3RhdGVTcGVlZCAqIDAuMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlSW5wdXQoKTtcclxuXHJcbiAgICAgICAgLy8gcG9zaXRpb25cclxuICAgICAgICB2YXIgdiA9IHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uLnRyYW5zZm9ybVF1YXQodGhpcy5fdmVsb2NpdHkpO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5zY2FsZUFuZEFkZCh0aGlzLl9wb3NpdGlvbiwgdiwgdGhpcy5tb3ZlU3BlZWQgKiB0aGlzLl9zcGVlZFNjYWxlKTtcclxuICAgICAgICB2ID0gVmVjdG9yMy5sZXJwKHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uLCB0aGlzLl9wb3NpdGlvbiwgRW5naW5lLmRlbHRhVGltZSAvIHRoaXMuZGFtcCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0ucG9zaXRpb24gPSB2O1xyXG5cclxuICAgICAgICAvLyByb3RhdGlvblxyXG4gICAgICAgIHZhciBxID0gbmV3IFF1YXRlcm5pb24obmV3IFZlY3RvcjModGhpcy5fZXVsZXIueCwgdGhpcy5fZXVsZXIueSwgdGhpcy5fZXVsZXIueikpO1xyXG4gICAgICAgIHEgPSBRdWF0ZXJuaW9uLnNsZXJwKHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uLCBxLCBFbmdpbmUuZGVsdGFUaW1lIC8gdGhpcy5kYW1wKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5yb3RhdGlvbiA9IHE7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVBbmRBZGQoYTogVmVjdG9yMywgYjogVmVjdG9yMywgc2NhbGU6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBvdXQgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIG91dC54ID0gYS54ICsgYi54ICogc2NhbGU7XHJcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnkgKiBzY2FsZTtcclxuICAgICAgICBvdXQueiA9IGEueiArIGIueiAqIHNjYWxlO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4uL1RyYW5zZnJvbVwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdDogR2FtZU9iamVjdDtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCB0cmFuc2Zvcm0oKTogVHJhbnNmb3JtIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nYW1lT2JqZWN0LnRyYW5zZm9ybTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfZW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25FbmFibGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uRGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0ID0gZ2FtZU9iamVjdDtcclxuICAgICAgICB0aGlzLmF3YWtlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55Sf5ZG95ZGo5pyf5pa55rOVXHJcbiAgICAvLyDlvZPnu4Tku7booqvliJvlu7rml7bosIPnlKhcclxuICAgIHB1YmxpYyBhd2FrZSgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOWcqOWQr+eUqOe7hOS7tueahOesrOS4gOW4p+iwg+eUqFxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5q+P5bin5pu05paw5YmN6LCD55SoXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5q+P5bin5pu05paw5ZCO6LCD55SoXHJcbiAgICAvL3B1YmxpYyBsYXRlVXBkYXRlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5b2T57uE5Lu26KKr5ZCv55So5pe26LCD55SoXHJcbiAgICBwdWJsaWMgb25FbmFibGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDlvZPnu4Tku7booqvnpoHnlKjml7bosIPnlKhcclxuICAgIHB1YmxpYyBvbkRpc2FibGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDlvZPnu4Tku7booqvplIDmr4Hml7bosIPnlKhcclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKTogdm9pZCB7fVxyXG59IiwiaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBNZXNoIH0gZnJvbSBcIi4uL01lc2hcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNoUmVuZGVyZXIgZXh0ZW5kcyBSZW5kZXJlciB7XHJcbiAgICBwcml2YXRlIF9tZXNoOiBNZXNoIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8g572R5qC85bGe5oCnXHJcbiAgICBwdWJsaWMgZ2V0IG1lc2goKTogTWVzaCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgbWVzaCh2YWx1ZTogTWVzaCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9tZXNoID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOWunueOsOa4suafk+aWueazlVxyXG4gICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcclxuICAgICAgICAvLyDmuLLmn5PpgLvovpHlsIbnlLFSYXN0ZXJpemF0aW9uUGlwZWxpbmXosIPnlKhcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOa4heeQhui1hOa6kFxyXG4gICAgICAgIHRoaXMuX21lc2ggPSBudWxsO1xyXG4gICAgICAgIHN1cGVyLm1hdGVyaWFsID0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gXCIuLi9NYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBCb3VuZHMgfSBmcm9tIFwiLi4vTWF0aC9Cb3VuZHNcIjtcclxuXHJcbi8vIFJlbmRlcmVy5piv5omA5pyJ5riy5p+T57uE5Lu255qE5Z+657G7XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBwcml2YXRlIF9ib3VuZHM6IEJvdW5kcztcclxuICAgIHByaXZhdGUgX21hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfc29ydGluZ0xheWVySUQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9zb3J0aW5nT3JkZXI6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jYXN0U2hhZG93czogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9yZWNlaXZlU2hhZG93czogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLy8g5p2Q6LSo5bGe5oCnXHJcbiAgICBwdWJsaWMgZ2V0IG1hdGVyaWFsKCk6IE1hdGVyaWFsIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdGVyaWFsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0IG1hdGVyaWFsKHZhbHVlOiBNYXRlcmlhbCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmjpLluo/lsYJJRFxyXG4gICAgcHVibGljIGdldCBzb3J0aW5nTGF5ZXJJRCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3J0aW5nTGF5ZXJJRDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldCBzb3J0aW5nTGF5ZXJJRCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc29ydGluZ0xheWVySUQgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5o6S5bqP6aG65bqPXHJcbiAgICBwdWJsaWMgZ2V0IHNvcnRpbmdPcmRlcigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3J0aW5nT3JkZXI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXQgc29ydGluZ09yZGVyKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zb3J0aW5nT3JkZXIgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmmK/lkKbmipXlsITpmLTlvbFcclxuICAgIHB1YmxpYyBnZXQgY2FzdFNoYWRvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc3RTaGFkb3dzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY2FzdFNoYWRvd3ModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9jYXN0U2hhZG93cyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOaYr+WQpuaOpeaUtumYtOW9sVxyXG4gICAgcHVibGljIGdldCByZWNlaXZlU2hhZG93cygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVjZWl2ZVNoYWRvd3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByZWNlaXZlU2hhZG93cyh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3JlY2VpdmVTaGFkb3dzID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOaYr+WQpuW6lOivpeiiq+a4suafk1xyXG4gICAgcHVibGljIGdldCBzaG91bGRSZW5kZXIoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5hYmxlZCAmJiB0aGlzLmdhbWVPYmplY3QuYWN0aXZlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmuLLmn5Pmlrnms5XvvIzlrZDnsbvpnIDopoHlrp7njrBcclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5kZXIoKTogdm9pZDtcclxufSIsImltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vSW5wdXRcIjtcclxuaW1wb3J0IHsgUmFzdGVyaXphdGlvblBpcGVsaW5lIH0gZnJvbSBcIi4vUmFzdGVyaXphdGlvblBpcGVsaW5lXCI7XHJcbmltcG9ydCB7IE1haW5TY2VuZSB9IGZyb20gXCIuL1NjZW5lL01haW5TY2VuZVwiO1xyXG5pbXBvcnQgeyBTY2VuZU1hbmFnZXIgfSBmcm9tIFwiLi9TY2VuZS9TY2VuZU1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmdpbmUge1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2VuZU1hbmFnZXI6IFNjZW5lTWFuYWdlciA9IG5ldyBTY2VuZU1hbmFnZXIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHVibGljIHN0YXRpYyBkZWx0YVRpbWU6IG51bWJlciA9IDEgLyA2MDtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGlwZWxpbmU6IFJhc3Rlcml6YXRpb25QaXBlbGluZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaW1hZ2VEYXRhOiBJbWFnZURhdGE7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBJbml0KCkge1xyXG4gICAgICAgIC8vIOiOt+WPlmNhbnZhc+WFg+e0oOWSjDJE5riy5p+T5LiK5LiL5paHXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAgICAgLy8g6K6+572uY2FudmFz5bC65a+4XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSBFbmdpbmVDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodDtcclxuICAgICAgICAvLyDorr7nva7mlofmnKzmoLflvI9cclxuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9ICdBcmlhbCc7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnRleHRBbGlnbiA9ICdsZWZ0JztcclxuXHJcbiAgICAgICAgLy8g5Yib5bu65Zu+5YOP5pWw5o2u5a+56LGhXHJcbiAgICAgICAgdGhpcy5pbWFnZURhdGEgPSBFbmdpbmUuY29udGV4dC5jcmVhdGVJbWFnZURhdGEoRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoLCBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0KTtcclxuICAgICAgICAvLyDliJvlu7ozMuS9jeaXoOespuWPt+aVtOWei+aVsOe7hOinhuWbvu+8jOeUqOS6juebtOaOpeaTjeS9nOWDj+e0oOaVsOaNrlxyXG4gICAgICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkodGhpcy5pbWFnZURhdGEuZGF0YS5idWZmZXIpO1xyXG4gICAgICAgIC8vIOWIm+W7uua4suafk+WZqOWunuS+i1xyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBuZXcgUmFzdGVyaXphdGlvblBpcGVsaW5lKHVpbnQzMlZpZXcpO1xyXG5cclxuICAgICAgICAvLyDliJ3lp4vljJblnLrmma9cclxuICAgICAgICB0aGlzLnNjZW5lTWFuYWdlci5sb2FkU2NlbmUoTWFpblNjZW5lKTtcclxuICAgICAgICAvLyDliJ3lp4vljJbovpPlhaXns7vnu59cclxuICAgICAgICBJbnB1dC5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8g5L2/55So5Zy65pmv55qEdXBkYXRl5pa55rOV5pu05paw5omA5pyJ5ri45oiP5a+56LGhXHJcbiAgICAgICAgdGhpcy5zY2VuZU1hbmFnZXIuZ2V0QWN0aXZlU2NlbmUoKT8udXBkYXRlKCk7XHJcbiAgICAgICAgLy8g5pu05paw6L6T5YWl54q25oCBKOazqO+8mui+k+WFpeW3sue7j+eUsVdFQuW8leaTjuWcqOavj+W4p+W8gOWni+S5i+WJjeiOt+WPluS6hu+8jOi/memHjOaYr+abtOaWsOi+k+WFpeeahOS4iuS4gOW4p+eKtuaAgSlcclxuICAgICAgICBJbnB1dC51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIFJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLnBpcGVsaW5lLlJlbmRlcigpO1xyXG4gICAgICAgIC8vIOWwhuWbvuWDj+aVsOaNrue7mOWItuWIsGNhbnZhc+S4ilxyXG4gICAgICAgIHRoaXMuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5pbWFnZURhdGEsIDAsIDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW5naW5lQ29uZmlnIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FudmFzV2lkdGg6IG51bWJlciA9IDQwMDtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FudmFzSGVpZ2h0OiBudW1iZXIgPSA0MDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGhhbGZDYW52YXNXaWR0aDogbnVtYmVyID0gRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoID4+IDE7XHJcbiAgICBwdWJsaWMgc3RhdGljIGhhbGZDYW52YXNIZWlnaHQ6IG51bWJlciA9IEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQgPj4gMTtcclxuICAgIHB1YmxpYyBzdGF0aWMgYXNwZWN0UmF0aW86IG51bWJlciA9IEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aCAvIEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQ7XHJcbn0iLCJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zyb21cIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50L0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lT2JqZWN0IHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtOiBUcmFuc2Zvcm07XHJcbiAgICBwdWJsaWMgdGFnOiBzdHJpbmcgPSBcIlVudGFnZ2VkXCI7IC8vIOa3u+WKoOagh+etvuWxnuaAp1xyXG4gICAgcHVibGljIGxheWVyOiBudW1iZXIgPSAwOyAvLyDpu5jorqTlsYJcclxuXHJcbiAgICBwcml2YXRlIGNvbXBvbmVudHM6IENvbXBvbmVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHN0YXJ0ZWRDb21wb25lbnRzOiBTZXQ8Q29tcG9uZW50PiA9IG5ldyBTZXQ8Q29tcG9uZW50PigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FjdGl2ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAvLyDorr7nva7muLjmiI/lr7nosaHnmoTmv4DmtLvnirbmgIFcclxuICAgIHB1YmxpYyBzZXQgYWN0aXZlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fYWN0aXZlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAvLyDlpITnkIbnu4Tku7bnmoTlkK/nlKgv56aB55SoXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm9uRW5hYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vbkRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIOajgOafpea4uOaIj+WvueixoeaYr+WQpuWkhOS6jua0u+WKqOeKtuaAge+8iOiAg+iZkeeItuWvueixoe+8iVxyXG4gICAgcHVibGljIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hY3RpdmUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8g5qOA5p+l54i25a+56LGh55qE5r+A5rS754q25oCBXHJcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMudHJhbnNmb3JtLnBhcmVudDtcclxuICAgICAgICB3aGlsZSAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEdhbWVPYmplY3QgPSBwYXJlbnQuZ2FtZU9iamVjdDtcclxuICAgICAgICAgICAgaWYgKHBhcmVudEdhbWVPYmplY3QgJiYgIXBhcmVudEdhbWVPYmplY3QuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiwg+eUqOaJgOaciee7hOS7tueahFN0YXJ05pa55rOV77yI5aaC5p6c5bCa5pyq6LCD55So77yJXHJcbiAgICBwdWJsaWMgc3RhcnRDb21wb25lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGFydGVkQ29tcG9uZW50cy5oYXMoY29tcG9uZW50KSAmJiBjb21wb25lbnQuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ZWRDb21wb25lbnRzLmFkZChjb21wb25lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDpgJLlvZLosIPnlKjlrZDlr7nosaHnmoRzdGFydENvbXBvbmVudHNcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5nYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5nYW1lT2JqZWN0LnN0YXJ0Q29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOabtOaWsOaJgOaciee7hOS7tlxyXG4gICAgcHVibGljIHVwZGF0ZUNvbXBvbmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOmAkuW9kuiwg+eUqOWtkOWvueixoeeahHVwZGF0ZUNvbXBvbmVudHNcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5nYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5nYW1lT2JqZWN0LnVwZGF0ZUNvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDmt7vliqDnu4Tku7ZcclxuICAgIHB1YmxpYyBhZGRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogeyBuZXcoZ2FtZU9iamVjdDogR2FtZU9iamVjdCk6IFQgfSk6IFQge1xyXG4gICAgICAgIHZhciBjb21wID0gdGhpcy5nZXRDb21wb25lbnQoY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgaWYgKGNvbXAgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb21wID0gbmV3IGNvbXBvbmVudFR5cGUodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKGNvbXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tcDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bmjIflrprnsbvlnovnmoTnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogVCB8IG51bGwge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgY29tcG9uZW50VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCBhcyBUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluaJgOacieaMh+Wumuexu+Wei+eahOe7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudHM8VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogVFtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgY29tcG9uZW50VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY29tcG9uZW50IGFzIFQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5a2Q6IqC54K55LiK55qE57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50SW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBGdW5jdGlvbiAmIHsgcHJvdG90eXBlOiBUIH0pOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5YWI5qOA5p+l6Ieq6LqrXHJcbiAgICAgICAgY29uc3QgY29tcCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgIGlmIChjb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR2FtZU9iamVjdCA9IGNoaWxkLmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZEdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkQ29tcCA9IGNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnQoY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRDb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRDb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOmAkuW9kuajgOafpeWtkOiKgueCueeahOWtkOiKgueCuVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVlcENoaWxkQ29tcCA9IGNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlZXBDaGlsZENvbXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2hpbGRDb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blrZDoioLngrnkuIrnmoTmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzSW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBGdW5jdGlvbiAmIHsgcHJvdG90eXBlOiBUIH0pOiBUW10ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVFtdID0gW107XHJcblxyXG4gICAgICAgIC8vIOa3u+WKoOiHqui6q+eahOe7hOS7tlxyXG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLnRoaXMuZ2V0Q29tcG9uZW50cyhjb21wb25lbnRUeXBlKSk7XHJcblxyXG4gICAgICAgIC8vIOmBjeWOhuaJgOacieWtkOiKgueCuVxyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy50cmFuc2Zvcm0uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgLy8g5YGH6K6+5q+P5LiqVHJhbnNmb3Jt6YO95pyJ5a+55bqU55qER2FtZU9iamVjdFxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEdhbWVPYmplY3QgPSBjaGlsZC5nYW1lT2JqZWN0O1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyDpgJLlvZLojrflj5blrZDoioLngrnnmoTmiYDmnInnu4Tku7ZcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKC4uLmNoaWxkR2FtZU9iamVjdC5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihjb21wb25lbnRUeXBlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g56e76Zmk57uE5Lu2XHJcbiAgICBwdWJsaWMgcmVtb3ZlQ29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb21wb25lbnRzLmZpbmRJbmRleChjb21wb25lbnQgPT4gY29tcG9uZW50IGluc3RhbmNlb2YgY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBjb21wb25lbnQub25EZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8mumAmui/h+WQjeensOafpeaJvkdhbWVPYmplY3RcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZChuYW1lOiBzdHJpbmcpOiBHYW1lT2JqZWN0IHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgLy8g6L+Z6ZyA6KaB5LiA5Liq5YWo5bGA55qER2FtZU9iamVjdOazqOWGjOihqFxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8mumAmui/h+agh+etvuafpeaJvuesrOS4gOS4qkdhbWVPYmplY3RcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZFdpdGhUYWcodGFnOiBzdHJpbmcpOiBHYW1lT2JqZWN0IHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgLy8g6L+Z6ZyA6KaB5LiA5Liq5qCH562+57O757ufXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya6YCa6L+H5qCH562+5p+l5om+5omA5pyJR2FtZU9iamVjdFxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kR2FtZU9iamVjdHNXaXRoVGFnKHRhZzogc3RyaW5nKTogR2FtZU9iamVjdFtdIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya5p+l5om+54m55a6a57G75Z6L55qE56ys5LiA5Liq57uE5Lu2XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRPYmplY3RPZlR5cGU8VCBleHRlbmRzIENvbXBvbmVudD4odHlwZTogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IFQgfCBudWxsIHtcclxuICAgICAgICAvLyDlrp7njrDmn6Xmib7pgLvovpFcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrmn6Xmib7nibnlrprnsbvlnovnmoTmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZE9iamVjdHNPZlR5cGU8VCBleHRlbmRzIENvbXBvbmVudD4odHlwZTogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IFRbXSB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8muWunuS+i+WMlua4uOaIj+WvueixoVxyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW50aWF0ZShvcmlnaW5hbDogR2FtZU9iamVjdCwgcG9zaXRpb24/OiBWZWN0b3IzLCByb3RhdGlvbj86IFF1YXRlcm5pb24pOiBHYW1lT2JqZWN0IHtcclxuICAgICAgICAvLyDliJvlu7rmlrDnmoTmuLjmiI/lr7nosaFcclxuICAgICAgICBjb25zdCBjbG9uZSA9IG5ldyBHYW1lT2JqZWN0KG9yaWdpbmFsLm5hbWUpO1xyXG5cclxuICAgICAgICAvLyDlpI3liLblsZ7mgKdcclxuICAgICAgICBjbG9uZS50YWcgPSBvcmlnaW5hbC50YWc7XHJcbiAgICAgICAgY2xvbmUubGF5ZXIgPSBvcmlnaW5hbC5sYXllcjtcclxuICAgICAgICBjbG9uZS5hY3RpdmUgPSBvcmlnaW5hbC5hY3RpdmU7XHJcblxyXG4gICAgICAgIC8vIOiuvue9ruS9jee9ruWSjOaXi+i9rO+8iOWmguaenOaPkOS+m++8iVxyXG4gICAgICAgIGlmIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBjbG9uZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyb3RhdGlvbikge1xyXG4gICAgICAgICAgICBjbG9uZS50cmFuc2Zvcm0ucm90YXRpb24gPSByb3RhdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWkjeWItue7hOS7tu+8iOi/memcgOimgeS4gOS4qua3seW6puWkjeWItuacuuWItu+8iVxyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6ZSA5q+B5ri45oiP5a+56LGhXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDosIPnlKjmiYDmnInnu4Tku7bnmoRvbkRlc3Ryb3nmlrnms5VcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50Lm9uRGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDov5nph4zlj6/ku6Xmt7vliqDku47lnLrmma/kuK3np7vpmaTmuLjmiI/lr7nosaHnmoTpgLvovpFcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dCB7XHJcbiAgICAvLyDplK7nm5jnirbmgIFcclxuICAgIHByaXZhdGUgc3RhdGljIGN1cnJlbnRLZXlzOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJldmlvdXNLZXlzOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xyXG5cclxuICAgIC8vIOm8oOagh+eKtuaAgVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudE1vdXNlQnV0dG9uczogYm9vbGVhbltdID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2VdOyAvLyDlt6bjgIHkuK3jgIHlj7PplK5cclxuICAgIHByaXZhdGUgc3RhdGljIHByZXZpb3VzTW91c2VCdXR0b25zOiBib29sZWFuW10gPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlUG9zaXRpb246IFZlY3RvcjIgPSBWZWN0b3IyLlpFUk87XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlRGVsdGE6IFZlY3RvcjIgPSBWZWN0b3IyLlpFUk87XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlU2Nyb2xsRGVsdGE6IFZlY3RvcjIgPSBWZWN0b3IyLlpFUk87XHJcblxyXG4gICAgLy8g6Kem5pG454q25oCBXHJcbiAgICBwcml2YXRlIHN0YXRpYyB0b3VjaGVzOiBUb3VjaFtdID0gW107XHJcblxyXG4gICAgLy8g5oyJ6ZSu5bi46YePXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtleUNvZGUgPSB7XHJcbiAgICAgICAgLy8g5a2X5q+N6ZSuXHJcbiAgICAgICAgQTogJ0tleUEnLCBCOiAnS2V5QicsIEM6ICdLZXlDJywgRDogJ0tleUQnLCBFOiAnS2V5RScsIEY6ICdLZXlGJywgRzogJ0tleUcnLFxyXG4gICAgICAgIEg6ICdLZXlIJywgSTogJ0tleUknLCBKOiAnS2V5SicsIEs6ICdLZXlLJywgTDogJ0tleUwnLCBNOiAnS2V5TScsIE46ICdLZXlOJyxcclxuICAgICAgICBPOiAnS2V5TycsIFA6ICdLZXlQJywgUTogJ0tleVEnLCBSOiAnS2V5UicsIFM6ICdLZXlTJywgVDogJ0tleVQnLCBVOiAnS2V5VScsXHJcbiAgICAgICAgVjogJ0tleVYnLCBXOiAnS2V5VycsIFg6ICdLZXlYJywgWTogJ0tleVknLCBaOiAnS2V5WicsXHJcblxyXG4gICAgICAgIC8vIOaVsOWtl+mUrlxyXG4gICAgICAgIEFscGhhMDogJ0RpZ2l0MCcsIEFscGhhMTogJ0RpZ2l0MScsIEFscGhhMjogJ0RpZ2l0MicsIEFscGhhMzogJ0RpZ2l0MycsIEFscGhhNDogJ0RpZ2l0NCcsXHJcbiAgICAgICAgQWxwaGE1OiAnRGlnaXQ1JywgQWxwaGE2OiAnRGlnaXQ2JywgQWxwaGE3OiAnRGlnaXQ3JywgQWxwaGE4OiAnRGlnaXQ4JywgQWxwaGE5OiAnRGlnaXQ5JyxcclxuXHJcbiAgICAgICAgLy8g5Yqf6IO96ZSuXHJcbiAgICAgICAgRjE6ICdGMScsIEYyOiAnRjInLCBGMzogJ0YzJywgRjQ6ICdGNCcsIEY1OiAnRjUnLCBGNjogJ0Y2JyxcclxuICAgICAgICBGNzogJ0Y3JywgRjg6ICdGOCcsIEY5OiAnRjknLCBGMTA6ICdGMTAnLCBGMTE6ICdGMTEnLCBGMTI6ICdGMTInLFxyXG5cclxuICAgICAgICAvLyDnibnmrorplK5cclxuICAgICAgICBTcGFjZTogJ1NwYWNlJyxcclxuICAgICAgICBFbnRlcjogJ0VudGVyJyxcclxuICAgICAgICBUYWI6ICdUYWInLFxyXG4gICAgICAgIEVzY2FwZTogJ0VzY2FwZScsXHJcbiAgICAgICAgQmFja3NwYWNlOiAnQmFja3NwYWNlJyxcclxuICAgICAgICBTaGlmdDogJ1NoaWZ0TGVmdCcsXHJcbiAgICAgICAgQ29udHJvbDogJ0NvbnRyb2xMZWZ0JyxcclxuICAgICAgICBBbHQ6ICdBbHRMZWZ0JyxcclxuICAgICAgICBDYXBzTG9jazogJ0NhcHNMb2NrJyxcclxuXHJcbiAgICAgICAgLy8g5pa55ZCR6ZSuXHJcbiAgICAgICAgVXBBcnJvdzogJ0Fycm93VXAnLFxyXG4gICAgICAgIERvd25BcnJvdzogJ0Fycm93RG93bicsXHJcbiAgICAgICAgTGVmdEFycm93OiAnQXJyb3dMZWZ0JyxcclxuICAgICAgICBSaWdodEFycm93OiAnQXJyb3dSaWdodCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIOWIneWni+WMlui+k+WFpeezu+e7n1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOmUruebmOS6i+S7tlxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQuY3VycmVudEtleXMuc2V0KGV2ZW50LmNvZGUsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC5jdXJyZW50S2V5cy5zZXQoZXZlbnQuY29kZSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDpvKDmoIfkuovku7ZcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA+PSAwICYmIGV2ZW50LmJ1dHRvbiA8IDMpIHtcclxuICAgICAgICAgICAgICAgIElucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNbZXZlbnQuYnV0dG9uXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID49IDAgJiYgZXZlbnQuYnV0dG9uIDwgMykge1xyXG4gICAgICAgICAgICAgICAgSW5wdXQuY3VycmVudE1vdXNlQnV0dG9uc1tldmVudC5idXR0b25dID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgSW5wdXQubW91c2VQb3NpdGlvbi54ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgICAgICAgICAgSW5wdXQubW91c2VQb3NpdGlvbi55ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgICAgICAgICBJbnB1dC5tb3VzZURlbHRhLnggPSBldmVudC5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIElucHV0Lm1vdXNlRGVsdGEueSA9IGV2ZW50Lm1vdmVtZW50WTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQubW91c2VTY3JvbGxEZWx0YS55ID0gZXZlbnQuZGVsdGFZO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGxlbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0Lm1vdXNlU2Nyb2xsRGVsdGEueSA9IDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOinpuaRuOS6i+S7tlxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQudXBkYXRlVG91Y2hlcyhldmVudC50b3VjaGVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0LnVwZGF0ZVRvdWNoZXMoZXZlbnQudG91Y2hlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0LnVwZGF0ZVRvdWNoZXMoZXZlbnQudG91Y2hlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0LnVwZGF0ZVRvdWNoZXMoZXZlbnQudG91Y2hlcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5pu05paw6L6T5YWl54q25oCB77yI5Zyo5q+P5bin5byA5aeL5pe26LCD55So77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmm7TmlrDplK7nm5jnirbmgIFcclxuICAgICAgICBJbnB1dC5wcmV2aW91c0tleXMgPSBuZXcgTWFwKElucHV0LmN1cnJlbnRLZXlzKTtcclxuXHJcbiAgICAgICAgLy8g5pu05paw6byg5qCH54q25oCBXHJcbiAgICAgICAgSW5wdXQucHJldmlvdXNNb3VzZUJ1dHRvbnMgPSBbLi4uSW5wdXQuY3VycmVudE1vdXNlQnV0dG9uc107XHJcblxyXG4gICAgICAgIC8vIOWkjeS9jem8oOagh+a7mui9rlxyXG4gICAgICAgIElucHV0Lm1vdXNlU2Nyb2xsRGVsdGEueSA9IDA7XHJcblxyXG4gICAgICAgIC8vIOWkjeS9jem8oOagh+enu+WKqFxyXG4gICAgICAgIElucHV0Lm1vdXNlRGVsdGEueCA9IDA7XHJcbiAgICAgICAgSW5wdXQubW91c2VEZWx0YS55ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24g6ZSu55uY6L6T5YWl5qOA5rWLXHJcblxyXG4gICAgLy8g5qOA5p+l5oyJ6ZSu5piv5ZCm6KKr5oyJ5LiL77yI5oyB57ut6Kem5Y+R77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEtleShrZXlDb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gSW5wdXQuY3VycmVudEtleXMuZ2V0KGtleUNvZGUpID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOajgOafpeaMiemUruaYr+WQpuWcqOW9k+WJjeW4p+iiq+aMieS4i++8iOS7heS4gOW4p+inpuWPke+8iVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRLZXlEb3duKGtleUNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBJbnB1dC5jdXJyZW50S2V5cy5nZXQoa2V5Q29kZSkgPT09IHRydWUgJiYgSW5wdXQucHJldmlvdXNLZXlzLmdldChrZXlDb2RlKSAhPT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmo4Dmn6XmjInplK7mmK/lkKblnKjlvZPliY3luKfooqvph4rmlL7vvIjku4XkuIDluKfop6blj5HvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0S2V5VXAoa2V5Q29kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIElucHV0LmN1cnJlbnRLZXlzLmdldChrZXlDb2RlKSAhPT0gdHJ1ZSAmJiBJbnB1dC5wcmV2aW91c0tleXMuZ2V0KGtleUNvZGUpID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluaMh+Wumui9tOWQkeeahOi+k+WFpeWAvFxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRBeGlzKGF4aXM6IElucHV0QXhpcyk6IG51bWJlciB7XHJcbiAgICAgICAgc3dpdGNoIChheGlzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgSW5wdXRBeGlzLkhvcml6b250YWw6XHJcbiAgICAgICAgICAgICAgICAvLyDmsLTlubPovbQgQS9EIOaIliDlt6blj7PmlrnlkJHplK5cclxuICAgICAgICAgICAgICAgIGlmIChJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5EKSB8fCBJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5SaWdodEFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLkEpIHx8IElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLkxlZnRBcnJvdykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgSW5wdXRBeGlzLlZlcnRpY2FsOlxyXG4gICAgICAgICAgICAgICAgLy8g5Z6C55u06L20IFcvUyDmiJYg5LiK5LiL5pa55ZCR6ZSuXHJcbiAgICAgICAgICAgICAgICBpZiAoSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuVykgfHwgSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuVXBBcnJvdykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5TKSB8fCBJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5Eb3duQXJyb3cpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g6byg5qCH6L6T5YWl5qOA5rWLXHJcblxyXG4gICAgLy8g5qOA5p+l6byg5qCH5oyJ6ZKu5piv5ZCm6KKr5oyJ5LiL77yI5oyB57ut6Kem5Y+R77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldE1vdXNlQnV0dG9uKGJ1dHRvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbiA+PSAwICYmIGJ1dHRvbiA8IDMgPyBJbnB1dC5jdXJyZW50TW91c2VCdXR0b25zW2J1dHRvbl0gOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmo4Dmn6XpvKDmoIfmjInpkq7mmK/lkKblnKjlvZPliY3luKfooqvmjInkuIvvvIjku4XkuIDluKfop6blj5HvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0TW91c2VCdXR0b25Eb3duKGJ1dHRvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbiA+PSAwICYmIGJ1dHRvbiA8IDMgP1xyXG4gICAgICAgICAgICAoSW5wdXQuY3VycmVudE1vdXNlQnV0dG9uc1tidXR0b25dICYmICFJbnB1dC5wcmV2aW91c01vdXNlQnV0dG9uc1tidXR0b25dKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOajgOafpem8oOagh+aMiemSruaYr+WQpuWcqOW9k+WJjeW4p+iiq+mHiuaUvu+8iOS7heS4gOW4p+inpuWPke+8iVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRNb3VzZUJ1dHRvblVwKGJ1dHRvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbiA+PSAwICYmIGJ1dHRvbiA8IDMgP1xyXG4gICAgICAgICAgICAoIUlucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNbYnV0dG9uXSAmJiBJbnB1dC5wcmV2aW91c01vdXNlQnV0dG9uc1tidXR0b25dKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDop6bmkbjovpPlhaXmo4DmtYtcclxuXHJcbiAgICAvLyDmm7TmlrDop6bmkbjnirbmgIFcclxuICAgIHByaXZhdGUgc3RhdGljIHVwZGF0ZVRvdWNoZXModG91Y2hMaXN0OiBUb3VjaExpc3QpOiB2b2lkIHtcclxuICAgICAgICBJbnB1dC50b3VjaGVzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSB0b3VjaExpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgICAgIElucHV0LnRvdWNoZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBmaW5nZXJJZDogdG91Y2guaWRlbnRpZmllcixcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICB5OiB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3BcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWx0YVBvc2l0aW9uOiB7IHg6IDAsIHk6IDAgfSwgLy8g566A5YyW5a6e546w77yM5a6e6ZmF5bqU6K+l6Lef6Liq5YmN5LiA5bin5L2N572uXHJcbiAgICAgICAgICAgICAgICBwaGFzZTogVG91Y2hQaGFzZS5Nb3ZlZCwgLy8g566A5YyW5a6e546wXHJcbiAgICAgICAgICAgICAgICB0YXBDb3VudDogMSAvLyDnroDljJblrp7njrBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluaMh+Wumue0ouW8leeahOinpuaRuFxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRUb3VjaChpbmRleDogbnVtYmVyKTogVG91Y2ggfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IElucHV0LnRvdWNoZXMubGVuZ3RoID8gSW5wdXQudG91Y2hlc1tpbmRleF0gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluinpuaRuOaVsOmHj1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgdG91Y2hDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBJbnB1dC50b3VjaGVzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxufVxyXG5cclxuLy8g6L205ZCR5p6a5Li+XHJcbmV4cG9ydCBlbnVtIElucHV0QXhpcyB7XHJcbiAgICBIb3Jpem9udGFsLFxyXG4gICAgVmVydGljYWwsXHJcbn1cclxuXHJcbi8vIOinpuaRuOmYtuauteaemuS4vlxyXG5leHBvcnQgZW51bSBUb3VjaFBoYXNlIHtcclxuICAgIEJlZ2FuLFxyXG4gICAgTW92ZWQsXHJcbiAgICBTdGF0aW9uYXJ5LFxyXG4gICAgRW5kZWQsXHJcbiAgICBDYW5jZWxlZFxyXG59XHJcblxyXG4vLyDop6bmkbjkv6Hmga/mjqXlj6NcclxuZXhwb3J0IGludGVyZmFjZSBUb3VjaCB7XHJcbiAgICBmaW5nZXJJZDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcclxuICAgIGRlbHRhUG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcclxuICAgIHBoYXNlOiBUb3VjaFBoYXNlO1xyXG4gICAgdGFwQ291bnQ6IG51bWJlcjtcclxufSIsImltcG9ydCB7IEVuZ2luZSB9IGZyb20gXCIuL0VuZ2luZVwiO1xyXG5cclxuZW51bSBMb2dUeXBlIHtcclxuICAgIEluZm8sXHJcbiAgICBXYXJuaW5nLFxyXG4gICAgRXJyb3IsXHJcbn1cclxuXHJcbmludGVyZmFjZSBJTG9nIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHR5cGU6IExvZ1R5cGU7XHJcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGxvZ3M6IElMb2dbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGxvZ0NvbG9ycyA9IHtcclxuICAgICAgICBbTG9nVHlwZS5JbmZvXTogJ3doaXRlJyxcclxuICAgICAgICBbTG9nVHlwZS5XYXJuaW5nXTogJ29yYW5nZScsXHJcbiAgICAgICAgW0xvZ1R5cGUuRXJyb3JdOiAncmVkJ1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgcHJpbnRMb2dzKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IHRoaXMubG9nc1tpXTtcclxuICAgICAgICAgICAgRW5naW5lLmNvbnRleHQuZmlsbFN0eWxlID0gTG9nZ2VyLmxvZ0NvbG9yc1tsb2cudHlwZV07XHJcbiAgICAgICAgICAgIEVuZ2luZS5jb250ZXh0LmZpbGxUZXh0KGxvZy5tZXNzYWdlLCAxMCwgMjAgKyBpICogMTUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9nKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnB1c2gobWVzc2FnZSwgTG9nVHlwZS5JbmZvLCBkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHdhcm5pbmcobWVzc2FnZTogc3RyaW5nLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucHVzaChtZXNzYWdlLCBMb2dUeXBlLldhcm5pbmcsIGR1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucHVzaChtZXNzYWdlLCBMb2dUeXBlLkVycm9yLCBkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHVzaChtZXNzYWdlOiBzdHJpbmcsIHR5cGU6IExvZ1R5cGUsIGR1cmF0aW9uPzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbG9nOiBJTG9nID0ge1xyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gPz8gMCxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dzLnB1c2gobG9nKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XG5cbmV4cG9ydCBjbGFzcyBCb3VuZHMge1xuICAgIG1pbjogVmVjdG9yMztcbiAgICBtYXg6IFZlY3RvcjM7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobWluOiBWZWN0b3IzLCBtYXg6IFZlY3RvcjMpO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihtaW4/OiBWZWN0b3IzLCBtYXg/OiBWZWN0b3IzKSB7XG4gICAgICAgIHRoaXMubWluID0gbWluIHx8IFZlY3RvcjMuWkVSTztcbiAgICAgICAgdGhpcy5tYXggPSBtYXggfHwgVmVjdG9yMy5aRVJPO1xuICAgIH1cblxuICAgIGdldENlbnRlcigpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgKHRoaXMubWluLnggKyB0aGlzLm1heC54KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5taW4ueSArIHRoaXMubWF4LnkpIC8gMixcbiAgICAgICAgICAgICh0aGlzLm1pbi56ICsgdGhpcy5tYXgueikgLyAyXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0SGFsZkV4dGVudHMoKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICh0aGlzLm1heC54IC0gdGhpcy5taW4ueCkgLyAyLFxuICAgICAgICAgICAgKHRoaXMubWF4LnkgLSB0aGlzLm1pbi55KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5tYXgueiAtIHRoaXMubWluLnopIC8gMlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNldE1pbihtaW46IFZlY3RvcjMpIHtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgfVxuXG4gICAgc2V0TWF4KG1heDogVmVjdG9yMykge1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbVBvaW50cyhwb2ludHM6IFZlY3RvcjNbXSk6IEJvdW5kcyB7XG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoID09PSAwKSByZXR1cm4gbmV3IEJvdW5kcygpO1xuXG4gICAgICAgIGxldCBtaW4gPSBuZXcgVmVjdG9yMyhwb2ludHNbMF0ueCwgcG9pbnRzWzBdLnksIHBvaW50c1swXS56KTtcbiAgICAgICAgbGV0IG1heCA9IG5ldyBWZWN0b3IzKHBvaW50c1swXS54LCBwb2ludHNbMF0ueSwgcG9pbnRzWzBdLnopO1xuXG4gICAgICAgIGZvciAoY29uc3QgcCBvZiBwb2ludHMpIHtcbiAgICAgICAgICAgIG1pbi54ID0gTWF0aC5taW4obWluLngsIHAueCk7XG4gICAgICAgICAgICBtaW4ueSA9IE1hdGgubWluKG1pbi55LCBwLnkpO1xuICAgICAgICAgICAgbWluLnogPSBNYXRoLm1pbihtaW4ueiwgcC56KTtcblxuICAgICAgICAgICAgbWF4LnggPSBNYXRoLm1heChtYXgueCwgcC54KTtcbiAgICAgICAgICAgIG1heC55ID0gTWF0aC5tYXgobWF4LnksIHAueSk7XG4gICAgICAgICAgICBtYXgueiA9IE1hdGgubWF4KG1heC56LCBwLnopO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5YGH6K6+Qm91bmRz5pyJbWlu5ZKMbWF45bGe5oCnXG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IG5ldyBCb3VuZHMoKTtcbiAgICAgICAgYm91bmRzLm1pbiA9IG1pbjtcbiAgICAgICAgYm91bmRzLm1heCA9IG1heDtcbiAgICAgICAgcmV0dXJuIGJvdW5kcztcbiAgICB9XG59XG5cbi8qKlxuICog6L205a+56b2Q5YyF5Zu055uSIChBQUJCKVxuICog5pyA566A5Y2V55qE5YyF5Zu055uS77yM6L655LiO5Z2Q5qCH6L205bmz6KGMXG4gKi9cbmNsYXNzIEFBQkIge1xuICAgIG1pbjogVmVjdG9yMztcbiAgICBtYXg6IFZlY3RvcjM7XG5cbiAgICBjb25zdHJ1Y3RvcihtaW46IFZlY3RvcjMsIG1heDogVmVjdG9yMykge1xuICAgICAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LuO6aG254K55YiX6KGo55Sf5oiQQUFCQlxuICAgICAqIEBwYXJhbSB2ZXJ0aWNlcyDkuInnu7TpobbngrnmlbDnu4RcbiAgICAgKiBAcmV0dXJucyDnlJ/miJDnmoRBQUJCXG4gICAgICovXG4gICAgc3RhdGljIGZyb21WZXJ0aWNlcyh2ZXJ0aWNlczogVmVjdG9yM1tdKTogQUFCQiB7XG4gICAgICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIumhtueCueaVsOe7hOS4jeiDveS4uuepulwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWIneWni+WMlm1pbuWSjG1heOS4uuesrOS4gOS4qumhtueCueeahOWAvFxuICAgICAgICBjb25zdCBtaW4gPSB2ZXJ0aWNlc1swXS5jbG9uZSgpO1xuICAgICAgICBjb25zdCBtYXggPSB2ZXJ0aWNlc1swXS5jbG9uZSgpO1xuXG4gICAgICAgIC8vIOmBjeWOhuaJgOaciemhtueCue+8jOaJvuWIsOacgOWwj+WSjOacgOWkp+WAvFxuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmVydGljZXMpIHtcbiAgICAgICAgICAgIG1pbi54ID0gTWF0aC5taW4obWluLngsIHYueCk7XG4gICAgICAgICAgICBtaW4ueSA9IE1hdGgubWluKG1pbi55LCB2LnkpO1xuICAgICAgICAgICAgbWluLnogPSBNYXRoLm1pbihtaW4ueiwgdi56KTtcblxuICAgICAgICAgICAgbWF4LnggPSBNYXRoLm1heChtYXgueCwgdi54KTtcbiAgICAgICAgICAgIG1heC55ID0gTWF0aC5tYXgobWF4LnksIHYueSk7XG4gICAgICAgICAgICBtYXgueiA9IE1hdGgubWF4KG1heC56LCB2LnopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBQUJCKG1pbiwgbWF4KTtcbiAgICB9XG5cbiAgICAvKiog6I635Y+WQUFCQueahOS4reW/g+eCuSAqL1xuICAgIGdldENlbnRlcigpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgKHRoaXMubWluLnggKyB0aGlzLm1heC54KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5taW4ueSArIHRoaXMubWF4LnkpIC8gMixcbiAgICAgICAgICAgICh0aGlzLm1pbi56ICsgdGhpcy5tYXgueikgLyAyXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIOiOt+WPlkFBQkLnmoTljYrovrnplb8gKi9cbiAgICBnZXRIYWxmRXh0ZW50cygpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgKHRoaXMubWF4LnggLSB0aGlzLm1pbi54KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5tYXgueSAtIHRoaXMubWluLnkpIC8gMixcbiAgICAgICAgICAgICh0aGlzLm1heC56IC0gdGhpcy5taW4ueikgLyAyXG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vKipcbiAqIOWumuWQkeWMheWbtOebkiAoT0JCKVxuICog5Y+v5Lul6ZqP54mp5L2T5peL6L2s77yM6L655LiO54mp5L2T6Ieq6Lqr5Z2Q5qCH57O75a+56b2QXG4gKi9cbmNsYXNzIE9CQiB7XG4gICAgY2VudGVyOiBWZWN0b3IzOyAgICAgICAgICAvLyDkuK3lv4PngrlcbiAgICBheGVzOiBbVmVjdG9yMywgVmVjdG9yMywgVmVjdG9yM107ICAvLyDkuInkuKrmraPkuqTnmoTovbTlkJHph49cbiAgICBleHRlbnRzOiBWZWN0b3IzOyAgICAgICAgIC8vIOavj+S4qui9tOaWueWQkeS4iueahOWNiumVv+W6plxuXG4gICAgY29uc3RydWN0b3IoY2VudGVyOiBWZWN0b3IzLCBheGVzOiBbVmVjdG9yMywgVmVjdG9yMywgVmVjdG9yM10sIGV4dGVudHM6IFZlY3RvcjMpIHtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgICAgIHRoaXMuYXhlcyA9IGF4ZXM7XG4gICAgICAgIHRoaXMuZXh0ZW50cyA9IGV4dGVudHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LuO6aG254K55YiX6KGo55Sf5oiQT0JC77yI5L2/55SoUENB5Li75oiQ5YiG5YiG5p6Q77yJXG4gICAgICog566X5rOV5oCd6Lev77ya6YCa6L+H6K6h566X6aG254K555qE5Y2P5pa55beu55+p6Zi15om+5Yiw5Li75pa55ZCR5L2c5Li6T0JC55qE6L20XG4gICAgICogQHBhcmFtIHZlcnRpY2VzIOS4iee7tOmhtueCueaVsOe7hFxuICAgICAqIEByZXR1cm5zIOeUn+aIkOeahE9CQlxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVmVydGljZXModmVydGljZXM6IFZlY3RvcjNbXSk6IE9CQiB7XG4gICAgICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIumhtueCueaVsOe7hOS4jeiDveS4uuepulwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDEuIOiuoeeul+S4reW/g+eCue+8iOW5s+Wdh+WAvO+8iVxuICAgICAgICBjb25zdCBjZW50ZXIgPSBPQkIuY2FsY3VsYXRlQ2VudHJvaWQodmVydGljZXMpO1xuXG4gICAgICAgIC8vIDIuIOiuoeeul+WNj+aWueW3ruefqemYtVxuICAgICAgICBjb25zdCBjb3ZhcmlhbmNlID0gT0JCLmNhbGN1bGF0ZUNvdmFyaWFuY2VNYXRyaXgodmVydGljZXMsIGNlbnRlcik7XG5cbiAgICAgICAgLy8gMy4g6K6h566X5Y2P5pa55beu55+p6Zi155qE54m55b6B5ZCR6YeP77yI5Li75oiQ5YiG77yJ77yM5L2c5Li6T0JC55qE6L20XG4gICAgICAgIGNvbnN0IGVpZ2VudmVjdG9ycyA9IE9CQi5jYWxjdWxhdGVFaWdlbnZlY3RvcnMoY292YXJpYW5jZSk7XG5cbiAgICAgICAgLy8g56Gu5L+d6L205piv5Y2V5L2N5ZCR6YePXG4gICAgICAgIGNvbnN0IGF4ZXM6IFtWZWN0b3IzLCBWZWN0b3IzLCBWZWN0b3IzXSA9IFtcbiAgICAgICAgICAgIGVpZ2VudmVjdG9yc1swXS5tdWx0aXBseSgxIC8gZWlnZW52ZWN0b3JzWzBdLm1hZ25pdHVkZSksXG4gICAgICAgICAgICBlaWdlbnZlY3RvcnNbMV0ubXVsdGlwbHkoMSAvIGVpZ2VudmVjdG9yc1sxXS5tYWduaXR1ZGUpLFxuICAgICAgICAgICAgZWlnZW52ZWN0b3JzWzJdLm11bHRpcGx5KDEgLyBlaWdlbnZlY3RvcnNbMl0ubWFnbml0dWRlKVxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIDQuIOiuoeeul+avj+S4qui9tOaWueWQkeS4iueahOacgOWkp+W7tuS8uO+8iOWNiumVv+W6pu+8iVxuICAgICAgICBjb25zdCBleHRlbnRzID0gT0JCLmNhbGN1bGF0ZUV4dGVudHModmVydGljZXMsIGNlbnRlciwgYXhlcyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBPQkIoY2VudGVyLCBheGVzLCBleHRlbnRzKTtcbiAgICB9XG5cbiAgICAvKiog6K6h566X6aG254K555qE5Lit5b+D54K577yI6LSo5b+D77yJICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlQ2VudHJvaWQodmVydGljZXM6IFZlY3RvcjNbXSk6IFZlY3RvcjMge1xuICAgICAgICBjb25zdCBzdW0gPSBuZXcgVmVjdG9yMygpO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmVydGljZXMpIHtcbiAgICAgICAgICAgIHN1bS54ICs9IHYueDtcbiAgICAgICAgICAgIHN1bS55ICs9IHYueTtcbiAgICAgICAgICAgIHN1bS56ICs9IHYuejtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtLm11bHRpcGx5KDEgLyB2ZXJ0aWNlcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKiDorqHnrpfljY/mlrnlt67nn6npmLUgKi9cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVDb3ZhcmlhbmNlTWF0cml4KHZlcnRpY2VzOiBWZWN0b3IzW10sIGNlbnRyb2lkOiBWZWN0b3IzKTogbnVtYmVyW11bXSB7XG4gICAgICAgIC8vIOWIneWni+WMljN4M+WNj+aWueW3ruefqemYtVxuICAgICAgICBjb25zdCBjb3YgPSBbXG4gICAgICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgICAgICBbMCwgMCwgMF1cbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmVydGljZXMpIHtcbiAgICAgICAgICAgIC8vIOiuoeeul+mhtueCueebuOWvueS6jui0qOW/g+eahOWBj+enu1xuICAgICAgICAgICAgY29uc3QgeCA9IHYueCAtIGNlbnRyb2lkLng7XG4gICAgICAgICAgICBjb25zdCB5ID0gdi55IC0gY2VudHJvaWQueTtcbiAgICAgICAgICAgIGNvbnN0IHogPSB2LnogLSBjZW50cm9pZC56O1xuXG4gICAgICAgICAgICAvLyDntK/np6/ljY/mlrnlt67lgLxcbiAgICAgICAgICAgIGNvdlswXVswXSArPSB4ICogeDtcbiAgICAgICAgICAgIGNvdlswXVsxXSArPSB4ICogeTtcbiAgICAgICAgICAgIGNvdlswXVsyXSArPSB4ICogejtcbiAgICAgICAgICAgIGNvdlsxXVsxXSArPSB5ICogeTtcbiAgICAgICAgICAgIGNvdlsxXVsyXSArPSB5ICogejtcbiAgICAgICAgICAgIGNvdlsyXVsyXSArPSB6ICogejtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWvueensOefqemYte+8jOWhq+WFheS4i+S4ieinkumDqOWIhlxuICAgICAgICBjb3ZbMV1bMF0gPSBjb3ZbMF1bMV07XG4gICAgICAgIGNvdlsyXVswXSA9IGNvdlswXVsyXTtcbiAgICAgICAgY292WzJdWzFdID0gY292WzFdWzJdO1xuXG4gICAgICAgIC8vIOmZpOS7pemhtueCueaVsOmHjy0x77yI5peg5YGP5Lyw6K6h77yJXG4gICAgICAgIGNvbnN0IG4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xuICAgICAgICAgICAgICAgIGNvdltpXVtqXSAvPSAobiAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdjtcbiAgICB9XG5cbiAgICAvKiog6K6h566X5Y2P5pa55beu55+p6Zi155qE54m55b6B5ZCR6YeP77yI566A5YyW5a6e546w77yJICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlRWlnZW52ZWN0b3JzKGNvdjogbnVtYmVyW11bXSk6IFtWZWN0b3IzLCBWZWN0b3IzLCBWZWN0b3IzXSB7XG4gICAgICAgIC8vIOi/memHjOS9v+eUqOeugOWMlueahOeJueW+geWQkemHj+iuoeeul+aWueazlVxuICAgICAgICAvLyDlrp7pmYXlupTnlKjkuK3lj6/og73pnIDopoHmm7Tnsr7noa7nmoTnrpfms5XvvIjlpoJKYWNvYmnov63ku6Pms5XvvIlcblxuICAgICAgICAvLyDlr7nkuo7mvJTnpLrnm67nmoTvvIzmiJHku6zov5Tlm57kuInkuKrmraPkuqTlkJHph4/vvIjlrp7pmYXpobnnm67kuK3pnIDmm7/mjaLkuLrnnJ/lrp7nibnlvoHlkJHph4/orqHnrpfvvIlcbiAgICAgICAgLy8g5rOo5oSP77ya6L+Z5Y+q5piv5Y2g5L2N5a6e546w77yM55yf5a6e5Zy65pmv6ZyA6KaB5q2j56Gu6K6h566X54m55b6B5ZCR6YePXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBuZXcgVmVjdG9yMygxLCAwLCAwKSwgIC8vIOWBh+iuvljovbTkuLrnrKzkuIDkuLvmiJDliIZcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLCAgLy8g5YGH6K6+Wei9tOS4uuesrOS6jOS4u+aIkOWIhlxuICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgMSkgICAvLyDlgYforr5a6L205Li656ys5LiJ5Li75oiQ5YiGXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIOiuoeeul+avj+S4qui9tOaWueWQkeS4iueahOWNiumVv+W6piAqL1xuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZUV4dGVudHMoXG4gICAgICAgIHZlcnRpY2VzOiBWZWN0b3IzW10sXG4gICAgICAgIGNlbnRlcjogVmVjdG9yMyxcbiAgICAgICAgYXhlczogW1ZlY3RvcjMsIFZlY3RvcjMsIFZlY3RvcjNdXG4gICAgKTogVmVjdG9yMyB7XG4gICAgICAgIGxldCBleHRlbnRYID0gMDtcbiAgICAgICAgbGV0IGV4dGVudFkgPSAwO1xuICAgICAgICBsZXQgZXh0ZW50WiA9IDA7XG5cbiAgICAgICAgLy8g5a+55q+P5Liq6L206K6h566X6aG254K55Zyo6K+l6L205LiK55qE5oqV5b2x6IyD5Zu0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBheGlzID0gYXhlc1tpXTtcbiAgICAgICAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgdiBvZiB2ZXJ0aWNlcykge1xuICAgICAgICAgICAgICAgIC8vIOiuoeeul+mhtueCueebuOWvueS6juS4reW/g+eCueeahOWQkemHj1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpciA9IHYuc3VidHJhY3QoY2VudGVyKTtcbiAgICAgICAgICAgICAgICAvLyDorqHnrpflnKjlvZPliY3ovbTkuIrnmoTmipXlvbFcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9qID0gVmVjdG9yMy5kb3QoZGlyLCBheGlzKTtcblxuICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKG1pbiwgcHJvaik7XG4gICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBwcm9qKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y2K6ZW/5bqm5Y+W5pyA5aSn57ud5a+55YC8XG4gICAgICAgICAgICBjb25zdCBleHRlbnQgPSBNYXRoLm1heChNYXRoLmFicyhtaW4pLCBNYXRoLmFicyhtYXgpKTtcblxuICAgICAgICAgICAgLy8g55u05o6l6LWL5YC857uZ5a+55bqU5YiG6YePXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkgZXh0ZW50WCA9IGV4dGVudDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGkgPT09IDEpIGV4dGVudFkgPSBleHRlbnQ7XG4gICAgICAgICAgICBlbHNlIGV4dGVudFogPSBleHRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoZXh0ZW50WCwgZXh0ZW50WSwgZXh0ZW50Wik7XG4gICAgfVxufVxuXG4vKipcbiAqIOeQg+S9k+WMheWbtOebklxuICog55So55CD5b+D5ZKM5Y2K5b6E6KGo56S655qE566A5YyW5YyF5Zu05L2TXG4gKi9cbmNsYXNzIFNwaGVyZSB7XG4gICAgY2VudGVyOiBWZWN0b3IzO1xuICAgIHJhZGl1czogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoY2VudGVyOiBWZWN0b3IzLCByYWRpdXM6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LuO6aG254K55YiX6KGo55Sf5oiQ55CD5L2T5YyF5Zu055uSXG4gICAgICog566X5rOV5oCd6Lev77ya5YWI6K6h566X5omA5pyJ6aG254K555qE5Lit5b+D54K577yM5YaN5om+5Yiw56a75Lit5b+D54K55pyA6L+c55qE6aG254K55L2c5Li65Y2K5b6EXG4gICAgICogQHBhcmFtIHZlcnRpY2VzIOS4iee7tOmhtueCueaVsOe7hFxuICAgICAqIEByZXR1cm5zIOeUn+aIkOeahOeQg+S9k1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVmVydGljZXModmVydGljZXM6IFZlY3RvcjNbXSk6IFNwaGVyZSB7XG4gICAgICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIumhtueCueaVsOe7hOS4jeiDveS4uuepulwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDEuIOiuoeeul+S4reW/g+eCue+8iOW5s+Wdh+WAvO+8iVxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yMygpO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmVydGljZXMpIHtcbiAgICAgICAgICAgIGNlbnRlci54ICs9IHYueDtcbiAgICAgICAgICAgIGNlbnRlci55ICs9IHYueTtcbiAgICAgICAgICAgIGNlbnRlci56ICs9IHYuejtcbiAgICAgICAgfVxuICAgICAgICBjZW50ZXIueCAvPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgIGNlbnRlci55IC89IHZlcnRpY2VzLmxlbmd0aDtcbiAgICAgICAgY2VudGVyLnogLz0gdmVydGljZXMubGVuZ3RoO1xuXG4gICAgICAgIC8vIDIuIOaJvuWIsOemu+S4reW/g+eCueacgOi/nOeahOmhtueCue+8jOWFtui3neemu+WNs+S4uuWNiuW+hFxuICAgICAgICBsZXQgbWF4RGlzdGFuY2VTcXVhcmVkID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZlcnRpY2VzKSB7XG4gICAgICAgICAgICBjb25zdCBkeCA9IHYueCAtIGNlbnRlci54O1xuICAgICAgICAgICAgY29uc3QgZHkgPSB2LnkgLSBjZW50ZXIueTtcbiAgICAgICAgICAgIGNvbnN0IGR6ID0gdi56IC0gY2VudGVyLno7XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZVNxdWFyZWQgPSBkeCAqIGR4ICsgZHkgKiBkeSArIGR6ICogZHo7XG5cbiAgICAgICAgICAgIGlmIChkaXN0YW5jZVNxdWFyZWQgPiBtYXhEaXN0YW5jZVNxdWFyZWQpIHtcbiAgICAgICAgICAgICAgICBtYXhEaXN0YW5jZVNxdWFyZWQgPSBkaXN0YW5jZVNxdWFyZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByYWRpdXMgPSBNYXRoLnNxcnQobWF4RGlzdGFuY2VTcXVhcmVkKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTcGhlcmUoY2VudGVyLCByYWRpdXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7jkFBQkLnlJ/miJDnkIPkvZPljIXlm7Tnm5JcbiAgICAgKiBAcGFyYW0gYWFiYiDovbTlr7npvZDljIXlm7Tnm5JcbiAgICAgKiBAcmV0dXJucyDnlJ/miJDnmoTnkIPkvZNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFBQkIoYWFiYjogQUFCQik6IFNwaGVyZSB7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IGFhYmIuZ2V0Q2VudGVyKCk7XG4gICAgICAgIGNvbnN0IGhhbGZFeHRlbnRzID0gYWFiYi5nZXRIYWxmRXh0ZW50cygpO1xuICAgICAgICAvLyDljYrlvoTmmK/ku47kuK3lv4PliLDop5LokL3nmoTot53nprtcbiAgICAgICAgY29uc3QgcmFkaXVzID0gaGFsZkV4dGVudHMubWFnbml0dWRlO1xuICAgICAgICByZXR1cm4gbmV3IFNwaGVyZShjZW50ZXIsIHJhZGl1cyk7XG4gICAgfVxufVxuXG4vLyDnpLrkvovnlKjms5VcbmZ1bmN0aW9uIGV4YW1wbGVVc2FnZSgpIHtcbiAgICAvLyDliJvlu7rkuIDkupvnpLrkvovpobbngrlcbiAgICBjb25zdCB2ZXJ0aWNlcyA9IFtcbiAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgMCksXG4gICAgICAgIG5ldyBWZWN0b3IzKDEsIDAsIDApLFxuICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgMSksXG4gICAgICAgIG5ldyBWZWN0b3IzKDEsIDEsIDEpXG4gICAgXTtcblxuICAgIC8vIOeUn+aIkEFBQkJcbiAgICBjb25zdCBhYWJiID0gQUFCQi5mcm9tVmVydGljZXModmVydGljZXMpO1xuICAgIGNvbnNvbGUubG9nKFwiQUFCQjpcIik7XG4gICAgY29uc29sZS5sb2coXCIgIE1pbjpcIiwgYCgke2FhYmIubWluLnh9LCAke2FhYmIubWluLnl9LCAke2FhYmIubWluLnp9KWApO1xuICAgIGNvbnNvbGUubG9nKFwiICBNYXg6XCIsIGAoJHthYWJiLm1heC54fSwgJHthYWJiLm1heC55fSwgJHthYWJiLm1heC56fSlgKTtcblxuICAgIC8vIOeUn+aIkE9CQlxuICAgIGNvbnN0IG9iYiA9IE9CQi5mcm9tVmVydGljZXModmVydGljZXMpO1xuICAgIGNvbnNvbGUubG9nKFwiXFxuT0JCOlwiKTtcbiAgICBjb25zb2xlLmxvZyhcIiAgQ2VudGVyOlwiLCBgKCR7b2JiLmNlbnRlci54fSwgJHtvYmIuY2VudGVyLnl9LCAke29iYi5jZW50ZXIuen0pYCk7XG4gICAgY29uc29sZS5sb2coXCIgIEV4dGVudHM6XCIsIGAoJHtvYmIuZXh0ZW50cy54fSwgJHtvYmIuZXh0ZW50cy55fSwgJHtvYmIuZXh0ZW50cy56fSlgKTtcblxuICAgIC8vIOeUn+aIkOeQg+S9k1xuICAgIGNvbnN0IHNwaGVyZSA9IFNwaGVyZS5mcm9tVmVydGljZXModmVydGljZXMpO1xuICAgIGNvbnNvbGUubG9nKFwiXFxuU3BoZXJlOlwiKTtcbiAgICBjb25zb2xlLmxvZyhcIiAgQ2VudGVyOlwiLCBgKCR7c3BoZXJlLmNlbnRlci54fSwgJHtzcGhlcmUuY2VudGVyLnl9LCAke3NwaGVyZS5jZW50ZXIuen0pYCk7XG4gICAgY29uc29sZS5sb2coXCIgIFJhZGl1czpcIiwgc3BoZXJlLnJhZGl1cyk7XG59XG4iLCJpbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vUXVhdGVybmlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeDR4NCB7XHJcblxyXG4gICAgcHVibGljIG1hdHJpeDogQXJyYXk8QXJyYXk8bnVtYmVyPj4gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4oKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb2x1bW4wOiBWZWN0b3I0LCBjb2x1bW4xOiBWZWN0b3I0LCBjb2x1bW4yOiBWZWN0b3I0LCBjb2x1bW4zOiBWZWN0b3I0KTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGFyZ3VtZW50c1tpXSBhcyBWZWN0b3I0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPih2LngsIHYueSwgdi56LCB2LncpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRyaXhbaV0gPSBuZXcgQXJyYXk8bnVtYmVyPigwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGV4IOihjFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Um93KGluZGV4OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgYyA9IHRoaXMubWF0cml4W2luZGV4XTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoY1swXSwgY1sxXSwgY1syXSwgY1szXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDliJdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbHVtbihpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMubWF0cml4WzBdW2luZGV4XSwgdGhpcy5tYXRyaXhbMV1baW5kZXhdLCB0aGlzLm1hdHJpeFsyXVtpbmRleF0sIHRoaXMubWF0cml4WzNdW2luZGV4XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldFJvdyhpbmRleDogbnVtYmVyLCByb3c6IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMF0gPSByb3cueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMV0gPSByb3cueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bMl0gPSByb3cuejtcclxuICAgICAgICB0aGlzLm1hdHJpeFtpbmRleF1bM10gPSByb3cudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0Q29sdW1uKGluZGV4OiBudW1iZXIsIGNvbHVtbjogVmVjdG9yNCkge1xyXG4gICAgICAgIHRoaXMubWF0cml4WzBdW2luZGV4XSA9IGNvbHVtbi54O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzFdW2luZGV4XSA9IGNvbHVtbi55O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzJdW2luZGV4XSA9IGNvbHVtbi56O1xyXG4gICAgICAgIHRoaXMubWF0cml4WzNdW2luZGV4XSA9IGNvbHVtbi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShtOiBNYXRyaXg0eDQpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBsaHMgPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgcmhzID0gbS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1hdHJpeFswXVswXSA9IGxoc1swXVswXSAqIHJoc1swXVswXSArIGxoc1swXVsxXSAqIHJoc1sxXVswXSArIGxoc1swXVsyXSAqIHJoc1syXVswXSArIGxoc1swXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMF1bMV0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMF1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzBdWzJdID0gbGhzWzBdWzBdICogcmhzWzBdWzJdICsgbGhzWzBdWzFdICogcmhzWzFdWzJdICsgbGhzWzBdWzJdICogcmhzWzJdWzJdICsgbGhzWzBdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFswXVszXSA9IGxoc1swXVswXSAqIHJoc1swXVszXSArIGxoc1swXVsxXSAqIHJoc1sxXVszXSArIGxoc1swXVsyXSAqIHJoc1syXVszXSArIGxoc1swXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbMV1bMF0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMV1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzFdWzFdID0gbGhzWzFdWzBdICogcmhzWzBdWzFdICsgbGhzWzFdWzFdICogcmhzWzFdWzFdICsgbGhzWzFdWzJdICogcmhzWzJdWzFdICsgbGhzWzFdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsyXSA9IGxoc1sxXVswXSAqIHJoc1swXVsyXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsyXSArIGxoc1sxXVsyXSAqIHJoc1syXVsyXSArIGxoc1sxXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMV1bM10gPSBsaHNbMV1bMF0gKiByaHNbMF1bM10gKyBsaHNbMV1bMV0gKiByaHNbMV1bM10gKyBsaHNbMV1bMl0gKiByaHNbMl1bM10gKyBsaHNbMV1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzJdWzBdID0gbGhzWzJdWzBdICogcmhzWzBdWzBdICsgbGhzWzJdWzFdICogcmhzWzFdWzBdICsgbGhzWzJdWzJdICogcmhzWzJdWzBdICsgbGhzWzJdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsyXVsxXSA9IGxoc1syXVswXSAqIHJoc1swXVsxXSArIGxoc1syXVsxXSAqIHJoc1sxXVsxXSArIGxoc1syXVsyXSAqIHJoc1syXVsxXSArIGxoc1syXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMl1bMl0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMl1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzJdWzNdID0gbGhzWzJdWzBdICogcmhzWzBdWzNdICsgbGhzWzJdWzFdICogcmhzWzFdWzNdICsgbGhzWzJdWzJdICogcmhzWzJdWzNdICsgbGhzWzJdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFszXVswXSA9IGxoc1szXVswXSAqIHJoc1swXVswXSArIGxoc1szXVsxXSAqIHJoc1sxXVswXSArIGxoc1szXVsyXSAqIHJoc1syXVswXSArIGxoc1szXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbM11bMV0gPSBsaHNbM11bMF0gKiByaHNbMF1bMV0gKyBsaHNbM11bMV0gKiByaHNbMV1bMV0gKyBsaHNbM11bMl0gKiByaHNbMl1bMV0gKyBsaHNbM11bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzNdWzJdID0gbGhzWzNdWzBdICogcmhzWzBdWzJdICsgbGhzWzNdWzFdICogcmhzWzFdWzJdICsgbGhzWzNdWzJdICogcmhzWzJdWzJdICsgbGhzWzNdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFszXVszXSA9IGxoc1szXVswXSAqIHJoc1swXVszXSArIGxoc1szXVsxXSAqIHJoc1sxXVszXSArIGxoc1szXVsyXSAqIHJoc1syXVszXSArIGxoc1szXVszXSAqIHJoc1szXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yMyh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnkgPSBtWzFdWzBdICogdi54ICsgbVsxXVsxXSAqIHYueSArIG1bMV1bMl0gKiB2Lno7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2Lno7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5VmVjdG9yNCh2OiBWZWN0b3I0KTogVmVjdG9yNCB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgcmVzLnggPSBtWzBdWzBdICogdi54ICsgbVswXVsxXSAqIHYueSArIG1bMF1bMl0gKiB2LnogKyBtWzBdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56ICsgbVsxXVszXSAqIHYudztcclxuICAgICAgICByZXMueiA9IG1bMl1bMF0gKiB2LnggKyBtWzJdWzFdICogdi55ICsgbVsyXVsyXSAqIHYueiArIG1bMl1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLncgPSBtWzNdWzBdICogdi54ICsgbVszXVsxXSAqIHYueSArIG1bM11bMl0gKiB2LnogKyBtWzNdWzNdICogdi53O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUcmFuc2xhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMobVswXVszXSwgbVsxXVszXSwgbVsyXVszXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFJvdGF0ZSgpOiBWZWN0b3IzIHtcclxuICAgIC8vICAgICBsZXQgbWF0ID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgLy8gICAgIGxldCB4ID0gTWF0aC5hdGFuMihtYXRbMV1bMl0sIG1hdFsyXVsyXSk7XHJcbiAgICAvLyAgICAgbGV0IHkgPSBNYXRoLmF0YW4yKC1tYXRbMF1bMl0sIE1hdGguc3FydChtYXRbMV1bMl0gKiBtYXRbMV1bMl0gKyBtYXRbMl1bMl0gKiBtYXRbMl1bMl0pKTtcclxuICAgIC8vICAgICBsZXQgeiA9IE1hdGguYXRhbjIobWF0WzBdWzFdLCBtYXRbMF1bMF0pO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gbmV3IFZlY3RvcjMoeCAvIE1hdGguUEkgKiAxODAsIHkgLyBNYXRoLlBJICogMTgwLCB6IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZSgpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICAvL+S4gOWumuimgeiOt+WPlue6r+WHgOeahOaXi+i9rOefqemYte+8jOWNs+WOu+mZpOe8qeaUvuWAjeeOh1xyXG4gICAgICAgIGxldCBtYXQgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICBsZXQgcSA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIHZhciB0cmFjZSA9IG1hdFswXVswXSArIG1hdFsxXVsxXSArIG1hdFsyXVsyXTsgLy8gSSByZW1vdmVkICsgMS4wZjsgc2VlIGRpc2N1c3Npb24gd2l0aCBFdGhhblxyXG4gICAgICAgIHZhciBzID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRyYWNlID4gMCkgey8vIEkgY2hhbmdlZCBNX0VQU0lMT04gdG8gMFxyXG4gICAgICAgICAgICBzID0gMC41IC8gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKTtcclxuICAgICAgICAgICAgcS53ID0gMC4yNSAvIHM7XHJcbiAgICAgICAgICAgIHEueCA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pICogcztcclxuICAgICAgICAgICAgcS55ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgKiBzO1xyXG4gICAgICAgICAgICBxLnogPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAqIHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hdFswXVswXSA+IG1hdFsxXVsxXSAmJiBtYXRbMF1bMF0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzBdWzBdIC0gbWF0WzFdWzFdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMl1bMV0gLSBtYXRbMV1bMl0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdFsxXVsxXSA+IG1hdFsyXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMV1bMV0gLSBtYXRbMF1bMF0gLSBtYXRbMl1bMl0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFswXVsyXSAtIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsxXSArIG1hdFsxXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFsyXVsyXSAtIG1hdFswXVswXSAtIG1hdFsxXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzFdWzBdIC0gbWF0WzBdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAobWF0WzBdWzJdICsgbWF0WzJdWzBdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnkgPSAobWF0WzFdWzJdICsgbWF0WzJdWzFdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnogPSAwLjI1ICogcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJvdGF0ZU1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/lm6DkuLrml4vovaznn6npmLXmr5TovoPnibnmrorvvIzmnInml7blgJnopoHljZXni6zlpITnkIbvvIzmiYDmnInmi6XmnInkuIDkuKrmj5Dlj5bmlrnms5VcclxuICAgICAgICAvL+aPkOWPluaWueW8j+W+iOeugOWNle+8jOWFiOiOt+WPlue8qeaUvuWAvO+8jOeEtuWQjuWIqeeUqOiOt+WPlue8qeaUvuWAvOeahOWOn+eQhu+8jOmAhuWQkemZpOWOu+e8qeaUvuWAvO+8jOWwseW+l+WIsOe6r+WHgOeahOaXi+i9rOefqemYtVxyXG4gICAgICAgIC8v5q2k5pa55rOV5LiN5pSv5oyB5Y+N5bCE55+p6Zi1XHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIHRlID0gbWF0Lm1hdHJpeDtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5nZXRTY2FsZSgpO1xyXG4gICAgICAgIHZhciBzY2FsZVggPSAxIC8gc2NhbGUueDtcclxuICAgICAgICB2YXIgc2NhbGVZID0gMSAvIHNjYWxlLnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWiA9IDEgLyBzY2FsZS56O1xyXG5cclxuICAgICAgICB0ZVswXVswXSA9IG1lWzBdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzFdWzBdID0gbWVbMV1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbMl1bMF0gPSBtZVsyXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVszXVswXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzFdID0gbWVbMF1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMV1bMV0gPSBtZVsxXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVsyXVsxXSA9IG1lWzJdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzNdWzFdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bMl0gPSBtZVswXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsxXVsyXSA9IG1lWzFdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzJdWzJdID0gbWVbMl1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbM11bMl0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVszXSA9IDA7XHJcbiAgICAgICAgdGVbMV1bM10gPSAwO1xyXG4gICAgICAgIHRlWzJdWzNdID0gMDtcclxuICAgICAgICB0ZVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEV1bGVyQW5nbGVzKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL2Rldi9zcmMvbWF0aC9NYXRyaXg0LmpzXHJcbiAgICAgICAgLy/ku47ml4vovaznn6npmLXph4zojrflj5bmrKfmi4nop5JcclxuICAgICAgICAvL+W/hemhu+aYr+e6r+WHgOeahOaXi+i9rOefqemYtVxyXG5cclxuICAgICAgICB2YXIgYW5nbGUgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2YXIgdGUgPSB0aGlzLmdldFJvdGF0ZU1hdHJpeCgpLm1hdHJpeDtcclxuICAgICAgICB2YXIgbTExID0gdGVbMF1bMF0sIG0xMiA9IHRlWzBdWzFdLCBtMTMgPSB0ZVswXVsyXTtcclxuICAgICAgICB2YXIgbTIxID0gdGVbMV1bMF0sIG0yMiA9IHRlWzFdWzFdLCBtMjMgPSB0ZVsxXVsyXTtcclxuICAgICAgICB2YXIgbTMxID0gdGVbMl1bMF0sIG0zMiA9IHRlWzJdWzFdLCBtMzMgPSB0ZVsyXVsyXTtcclxuXHJcbiAgICAgICAgbTEzID0gbTEzID4gMSA/IDEgOiBtMTM7XHJcbiAgICAgICAgbTEzID0gbTEzIDwgLTEgPyAtMSA6IG0xMztcclxuICAgICAgICBhbmdsZS55ID0gTWF0aC5hc2luKG0xMyk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyhtMTMpIDwgMC45OTk5OTk5KSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKC1tMjMsIG0zMyk7XHJcbiAgICAgICAgICAgIGFuZ2xlLnogPSBNYXRoLmF0YW4yKC1tMTIsIG0xMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5nbGUueCA9IE1hdGguYXRhbjIobTMyLCBtMjIpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhhbmdsZS54IC8gTWF0aC5QSSAqIDE4MCwgYW5nbGUueSAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnogLyBNYXRoLlBJICogMTgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICBsZXQgdiA9IG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHYueCA9IE1hdGguc3FydChtWzBdWzBdICogbVswXVswXSArIG1bMV1bMF0gKiBtWzFdWzBdICsgbVsyXVswXSAqIG1bMl1bMF0pO1xyXG4gICAgICAgIHYueSA9IE1hdGguc3FydChtWzBdWzFdICogbVswXVsxXSArIG1bMV1bMV0gKiBtWzFdWzFdICsgbVsyXVsxXSAqIG1bMl1bMV0pO1xyXG4gICAgICAgIHYueiA9IE1hdGguc3FydChtWzBdWzJdICogbVswXVsyXSArIG1bMV1bMl0gKiBtWzFdWzJdICsgbVsyXVsyXSAqIG1bMl1bMl0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNwb3NlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0xID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0yID0gbmV3IE1hdHJpeDR4NCgpLm1hdHJpeDtcclxuXHJcbiAgICAgICAgbTJbMF1bMF0gPSBtMVswXVswXTsgbTJbMF1bMV0gPSBtMVsxXVswXTsgbTJbMF1bMl0gPSBtMVsyXVswXTsgbTJbMF1bM10gPSBtMVszXVswXTtcclxuICAgICAgICBtMlsxXVswXSA9IG0xWzBdWzFdOyBtMlsxXVsxXSA9IG0xWzFdWzFdOyBtMlsxXVsyXSA9IG0xWzJdWzFdOyBtMlsxXVszXSA9IG0xWzNdWzFdO1xyXG4gICAgICAgIG0yWzJdWzBdID0gbTFbMF1bMl07IG0yWzJdWzFdID0gbTFbMV1bMl07IG0yWzJdWzJdID0gbTFbMl1bMl07IG0yWzJdWzNdID0gbTFbM11bMl07XHJcbiAgICAgICAgbTJbM11bMF0gPSBtMVswXVszXTsgbTJbM11bMV0gPSBtMVsxXVszXTsgbTJbM11bMl0gPSBtMVsyXVszXTsgbTJbM11bM10gPSBtMVszXVszXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtMjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlKHBvczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlKHE6IFF1YXRlcm5pb24pOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKGV1bGVyQW5nbGVzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyByb3RhdGUoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IE1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyByb3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IG0gPSBuZXcgTWF0cml4NHg0KCk7XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBRdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZShzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IE1hdHJpeDR4NC5nZXRTY2FsZU1hdHJpeChzKTtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG0ubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb29rQXQodGFyZ2V0OiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvLyB0b2RvXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy/ovazmjaLliLDmkYTlvbHmnLrnnIvlkJHnmoTnn6npmLXph4xcclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1Ub0xvb2tBdFNwYWNlKGV5ZTogVmVjdG9yMywgdGFyZ2V0UG9pbnQ6IFZlY3RvcjMsIHVwOiBWZWN0b3IzID0gVmVjdG9yMy5VUCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy/ku47lk6rph4znnIvlkJHlk6rph4zvvIzkuZ/lj6/ku6XnkIbop6PkuLrmkYTlvbHmnLrop4bop5LvvIzljbPop4Llr5/nqbrpl7RcclxuICAgICAgICAvL+iLpeimgeWPmOaNouWIsOaRhOW9seacuuepuumXtO+8jOWPr+S7peWBh+iuvuaVtOS4quinguWvn+epuumXtOS7peaRhOW9seacuuS9jeS6juS4lueVjOWdkOagh+WOn+eCue+8jOeEtuWQjuWwhuaJgOacieeJqeS9k+acneaRhOW9seacuuWOn+WFiOWcqOS4lueVjOepuumXtOS4reeahOS9jee9ruWPjeWQkeenu+WKqOWNs+WPr1xyXG4gICAgICAgIC8v5Zyo57q45LiK55S75LiL5Zu+5bCx5riF5pmw5LqGXHJcblxyXG4gICAgICAgIC8v55Sx5LqO6buY6K6k55+p6Zi15pivU1JU6aG65bqP57uE5oiQ55qE5Y+Y5o2i56m66Ze077yM6KaB6YCG5ZCR77yM5YiZ5pivVFJT55qE6aG65bqP77yM5Y2z5YWI56e75Yqo5ZCO5peL6L2sXHJcbiAgICAgICAgLy8xLuWQkeWPjeaWueWQkeW5s+enu1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKG5ldyBWZWN0b3IzKC1leWUueCwgLWV5ZS55LCAtZXllLnopKTtcclxuXHJcbiAgICAgICAgLy8yLuWQkeWPjeaWueWQkeaXi+i9rFxyXG4gICAgICAgIC8v5YWI6I635Y+W5pGE5b2x5LiW55WM6YOo5Z2Q5qCH6L20XHJcbiAgICAgICAgdmFyIHpBeGlzID0gVmVjdG9yMy5kaWZmZXJlbmNlKGV5ZSwgdGFyZ2V0UG9pbnQpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8v5Zug5Li65oiR5Lus5piv5Y+z5omL57O757uf77yM6KaB5rGCWO+8jOWImeW/hemhu3rkuZh5XHJcbiAgICAgICAgdmFyIHhBeGlzID0gVmVjdG9yMy5jcm9zcyh1cCwgekF4aXMpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHZhciB5QXhpcyA9IFZlY3RvcjMuY3Jvc3MoekF4aXMsIHhBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+aehOW7uuaRhOW9seacuuWPjeaWueWQkeaXi+i9rOefqemYtVxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh4QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHlBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoekF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJ1c3R1bShsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgcmwgPSAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGNvbnN0IHRiID0gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBjb25zdCBmbiA9IChmYXIgLSBuZWFyKVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoKG5lYXIgKiAyKSAvIHJsLCAwLCAocmlnaHQgKyBsZWZ0KSAvIHJsLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgKG5lYXIgKiAyKSAvIHRiLCAodG9wICsgYm90dG9tKSAvIHRiLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLShmYXIgKyBuZWFyKSAvIGZuLCAtKGZhciAqIG5lYXIgKiAyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcnRob2dyYXBoaWMobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDIgLyBybCwgMCwgMCwgLShsZWZ0ICsgcmlnaHQpIC8gcmwpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAyIC8gdGIsIDAsIC0odG9wICsgYm90dG9tKSAvIHRiKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTIgLyBmbiwgLShmYXIgKyBuZWFyKSAvIGZuKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcnNwZWN0aXZlKGZvdjogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgY29uc3QgaGZvdiA9IGZvdiAvIDE4MCAqIE1hdGguUEkgLyAyO1xyXG4gICAgICAgIGNvbnN0IHRhbiA9IE1hdGgudGFuKGhmb3YpO1xyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMSAvIChhc3BlY3QgKiB0YW4pLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMSAvIHRhbiwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyAoZmFyIC0gbmVhciksIC0oMiAqIGZhciAqIG5lYXIpIC8gKGZhciAtIG5lYXIpKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgLTEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnZlcnNlKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgICAgICBjb25zdCBhMDAgPSBtYXRbMF1bMF07XHJcbiAgICAgICAgY29uc3QgYTAxID0gbWF0WzBdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEwMiA9IG1hdFswXVsyXTtcclxuICAgICAgICBjb25zdCBhMDMgPSBtYXRbMF1bM107XHJcbiAgICAgICAgY29uc3QgYTEwID0gbWF0WzFdWzBdO1xyXG4gICAgICAgIGNvbnN0IGExMSA9IG1hdFsxXVsxXTtcclxuICAgICAgICBjb25zdCBhMTIgPSBtYXRbMV1bMl07XHJcbiAgICAgICAgY29uc3QgYTEzID0gbWF0WzFdWzNdO1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IG1hdFsyXVswXTtcclxuICAgICAgICBjb25zdCBhMjEgPSBtYXRbMl1bMV07XHJcbiAgICAgICAgY29uc3QgYTIyID0gbWF0WzJdWzJdO1xyXG4gICAgICAgIGNvbnN0IGEyMyA9IG1hdFsyXVszXTtcclxuICAgICAgICBjb25zdCBhMzAgPSBtYXRbM11bMF07XHJcbiAgICAgICAgY29uc3QgYTMxID0gbWF0WzNdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEzMiA9IG1hdFszXVsyXTtcclxuICAgICAgICBjb25zdCBhMzMgPSBtYXRbM11bM107XHJcblxyXG4gICAgICAgIGNvbnN0IGRldDAwID0gYTAwICogYTExIC0gYTAxICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAzID0gYTAxICogYTEyIC0gYTAyICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTFcclxuICAgICAgICBjb25zdCBkZXQwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMlxyXG4gICAgICAgIGNvbnN0IGRldDA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzFcclxuICAgICAgICBjb25zdCBkZXQxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMlxyXG5cclxuICAgICAgICBsZXQgZGV0ID0gKGRldDAwICogZGV0MTEgLSBkZXQwMSAqIGRldDEwICsgZGV0MDIgKiBkZXQwOSArIGRldDAzICogZGV0MDggLSBkZXQwNCAqIGRldDA3ICsgZGV0MDUgKiBkZXQwNik7XHJcblxyXG4gICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNYXRyaXg0eDQgaW52ZXJzZSBmYWlsZWQsIGRldGVybWluYW50IGlzIDBcIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG5cclxuICAgICAgICBtYXRbMF1bMF0gPSAoYTExICogZGV0MTEgLSBhMTIgKiBkZXQxMCArIGExMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsxXSA9ICgtYTAxICogZGV0MTEgKyBhMDIgKiBkZXQxMCAtIGEwMyAqIGRldDA5KSAqIGRldFxyXG4gICAgICAgIG1hdFswXVsyXSA9IChhMzEgKiBkZXQwNSAtIGEzMiAqIGRldDA0ICsgYTMzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzBdWzNdID0gKC1hMjEgKiBkZXQwNSArIGEyMiAqIGRldDA0IC0gYTIzICogZGV0MDMpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzBdID0gKC1hMTAgKiBkZXQxMSArIGExMiAqIGRldDA4IC0gYTEzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzFdID0gKGEwMCAqIGRldDExIC0gYTAyICogZGV0MDggKyBhMDMgKiBkZXQwNykgKiBkZXRcclxuICAgICAgICBtYXRbMV1bMl0gPSAoLWEzMCAqIGRldDA1ICsgYTMyICogZGV0MDIgLSBhMzMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMV1bM10gPSAoYTIwICogZGV0MDUgLSBhMjIgKiBkZXQwMiArIGEyMyAqIGRldDAxKSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVswXSA9IChhMTAgKiBkZXQxMCAtIGExMSAqIGRldDA4ICsgYTEzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzFdID0gKC1hMDAgKiBkZXQxMCArIGEwMSAqIGRldDA4IC0gYTAzICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzJdID0gKGEzMCAqIGRldDA0IC0gYTMxICogZGV0MDIgKyBhMzMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bM10gPSAoLWEyMCAqIGRldDA0ICsgYTIxICogZGV0MDIgLSBhMjMgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bMF0gPSAoLWExMCAqIGRldDA5ICsgYTExICogZGV0MDcgLSBhMTIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMV0gPSAoYTAwICogZGV0MDkgLSBhMDEgKiBkZXQwNyArIGEwMiAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFszXVsyXSA9ICgtYTMwICogZGV0MDMgKyBhMzEgKiBkZXQwMSAtIGEzMiAqIGRldDAwKSAqIGRldFxyXG4gICAgICAgIG1hdFszXVszXSA9IChhMjAgKiBkZXQwMyAtIGEyMSAqIGRldDAxICsgYTIyICogZGV0MDApICogZGV0XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0Zsb2F0MzJMaXN0KCk6IEZsb2F0MzJMaXN0IHtcclxuICAgICAgICBsZXQgbSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIC8v55Sx5LqOT3BlbkdM5piv5YiX5bqP5a2Y5YKo77yM5omA5Lul6ZyA6KaB6L2s572u5LiA5LiL55+p6Zi1XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICBtWzBdWzBdLCBtWzFdWzBdLCBtWzJdWzBdLCBtWzNdWzBdLFxyXG4gICAgICAgICAgICBtWzBdWzFdLCBtWzFdWzFdLCBtWzJdWzFdLCBtWzNdWzFdLFxyXG4gICAgICAgICAgICBtWzBdWzJdLCBtWzFdWzJdLCBtWzJdWzJdLCBtWzNdWzJdLFxyXG4gICAgICAgICAgICBtWzBdWzNdLCBtWzFdWzNdLCBtWzJdWzNdLCBtWzNdWzNdXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDApLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygxKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMiksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDMpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRSU01hdHJpeChwb3M6IFZlY3RvcjMsIHF1YXQ6IFF1YXRlcm5pb24sIHNjYWxlOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgdG0gPSBNYXRyaXg0eDQuZ2V0VHJhbnNsYXRlTWF0cml4KHBvcyk7XHJcbiAgICAgICAgbGV0IHJtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihxdWF0KTtcclxuICAgICAgICBsZXQgc20gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgoc2NhbGUpO1xyXG5cclxuICAgICAgICAvL+W/hemhu+S4peagvOaMieeFp+WFiFNjYWxl77yM5YaNUm90YXRl77yM5YaNVHJhbnNsYXRl55qE6aG65bqP77yM5ZCm5YiZ5b6X5Yiw55qE57uT5p6c6IKv5a6a5piv5LiN5ruh5oSP55qEXHJcbiAgICAgICAgLy/kvovlpoLmnInkuIDkuKoxWDHmraPmlrnlvaLlnKjljp/ngrnvvIzmiJHku6zmg7PopoHlvpfliLDkuIDkuKoxWDLvvIzlubbkuJTmlpzlkJE0NcKw77yM6ICM5LiU56a75Z2Q5qCH5Y6f54K5MeS4quWNleS9jeWkhFxyXG4gICAgICAgIC8v5aaC5p6c5YWI5peL6L2s77yM5YaN57yp5pS+55qE6K+d77yM5peL6L2s5pa55ZCR5piv5a+55LqG77yM5L2G5piv5oiR5Lus5piv5bCG5peL6L2s5ZCONDXCsOeahOato+aWueW9oueahFnovbTmi4nkvLgy5YCN77yM5b6X5Yiw55qE5piv5LiA5Liq6KKr5ouJ6ZW/55qE6I+x5b2iXHJcbiAgICAgICAgLy/lpoLmnpzlhYjlubPnp7vvvIzlho3ml4vovaznmoTor53vvIzlm6DkuLrmiJHku6zml4vovazpg73mmK/nu5XnnYDlnZDmoIfljp/ngrnnmoTvvIznu5Pmnpzoh6rnhLbmmK/mraPmlrnlvaLkuI3mmK/oh6rouqvml4vovaw0NcKw77yM6ICM5piv57uV552A5Y6f54K55peL6L2sXHJcbiAgICAgICAgcmV0dXJuIHRtLm11bHRpcGx5KHJtLm11bHRpcGx5KHNtKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUcmFuc2xhdGVNYXRyaXgocG9zOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IDE7IG1bMF1bMV0gPSAwOyBtWzBdWzJdID0gMDsgbVswXVszXSA9IHBvcy54O1xyXG4gICAgICAgIG1bMV1bMF0gPSAwOyBtWzFdWzFdID0gMTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSBwb3MueTtcclxuICAgICAgICBtWzJdWzBdID0gMDsgbVsyXVsxXSA9IDA7IG1bMl1bMl0gPSAxOyBtWzJdWzNdID0gcG9zLno7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24ocTogUXVhdGVybmlvbik6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIGxldCBudW0gPSBxLnggKiAyO1xyXG4gICAgICAgIGxldCBudW0yID0gcS55ICogMjtcclxuICAgICAgICBsZXQgbnVtMyA9IHEueiAqIDI7XHJcbiAgICAgICAgbGV0IG51bTQgPSBxLnggKiBudW07XHJcbiAgICAgICAgbGV0IG51bTUgPSBxLnkgKiBudW0yO1xyXG4gICAgICAgIGxldCBudW02ID0gcS56ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtNyA9IHEueCAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTggPSBxLnggKiBudW0zO1xyXG4gICAgICAgIGxldCBudW05ID0gcS55ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtMTAgPSBxLncgKiBudW07XHJcbiAgICAgICAgbGV0IG51bTExID0gcS53ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtMTIgPSBxLncgKiBudW0zO1xyXG5cclxuICAgICAgICBtWzBdWzBdID0gMSAtIChudW01ICsgbnVtNik7XHJcbiAgICAgICAgbVsxXVswXSA9IG51bTcgKyBudW0xMjtcclxuICAgICAgICBtWzJdWzBdID0gbnVtOCAtIG51bTExO1xyXG4gICAgICAgIG1bM11bMF0gPSAwO1xyXG4gICAgICAgIG1bMF1bMV0gPSBudW03IC0gbnVtMTI7XHJcbiAgICAgICAgbVsxXVsxXSA9IDEgLSAobnVtNCArIG51bTYpO1xyXG4gICAgICAgIG1bMl1bMV0gPSBudW05ICsgbnVtMTA7XHJcbiAgICAgICAgbVszXVsxXSA9IDA7XHJcbiAgICAgICAgbVswXVsyXSA9IG51bTggKyBudW0xMTtcclxuICAgICAgICBtWzFdWzJdID0gbnVtOSAtIG51bTEwO1xyXG4gICAgICAgIG1bMl1bMl0gPSAxIC0gKG51bTQgKyBudW01KTtcclxuICAgICAgICBtWzNdWzJdID0gMDtcclxuICAgICAgICBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzNdID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZTogVmVjdG9yMywgb3JkZXI6IHN0cmluZyA9IFwiWFlaXCIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v6YCa6L+H5qyn5ouJ6KeS6I635Y+W5peL6L2s55+p6Zi1XHJcbiAgICAgICAgLy/lhYjliIbliKvojrflj5ZYWVrovbTkuIrnmoTml4vovaznn6npmLXvvIznhLblkI7lkIjlubbotbfmnaVcclxuICAgICAgICAvL+azqOaEj++8muaXi+i9rOi9tOeahOmhuuW6j+WFiOWQjuS4jeWQjO+8jOS8muWHuueOsOS4jeWQjOeahOe7k+aenO+8jOWboOatpOW/hemhu+imgeaMh+WumuaXi+i9rOmhuuW6j1xyXG4gICAgICAgIC8vaHR0cDovL3BsYW5uaW5nLmNzLnVpdWMuZWR1L25vZGUxMDIuaHRtbFxyXG4gICAgICAgIC8vaHR0cHM6Ly90aHJlZWpzLm9yZy9kb2NzLyNhcGkvZW4vbWF0aC9FdWxlci5vcmRlclxyXG4gICAgICAgIHZhciB4ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLngsIFZlY3RvcjMuUklHSFQpO1xyXG4gICAgICAgIHZhciB5ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnksIFZlY3RvcjMuVVApO1xyXG4gICAgICAgIHZhciB6ID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhlLnosIFZlY3RvcjMuRk9SV0FSRCk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAob3JkZXIpIHtcclxuICAgICAgICAgICAgY2FzZSBcIlhZWlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYWllcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHoubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVhaXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gei5tdWx0aXBseSh4Lm11bHRpcGx5KHkpKTtcclxuICAgICAgICAgICAgY2FzZSBcIllaWFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHgubXVsdGlwbHkoei5tdWx0aXBseSh5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaWFlcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB5Lm11bHRpcGx5KHgubXVsdGlwbHkoeikpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWllYXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geC5tdWx0aXBseSh5Lm11bHRpcGx5KHopKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSb3RhdGlvbiBvcmRlciBlcnJvciwgbXVzdCBiZSBzaW1pbGFyIHRvICdYWVonXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeS5tdWx0aXBseSh4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBvdXQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgdmFyIG0gPSBvdXQubWF0cml4O1xyXG4gICAgICAgIHZhciB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xyXG4gICAgICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgICAgICB2YXIgcyA9IDAsIGMgPSAwLCB0ID0gMDtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcclxuICAgICAgICB4ICo9IGxlbjtcclxuICAgICAgICB5ICo9IGxlbjtcclxuICAgICAgICB6ICo9IGxlbjtcclxuICAgICAgICBzID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgdCA9IDEgLSBjO1xyXG4gICAgICAgIG1bMF1bMF0gPSB4ICogeCAqIHQgKyBjO1xyXG4gICAgICAgIG1bMV1bMF0gPSB5ICogeCAqIHQgKyB6ICogcztcclxuICAgICAgICBtWzJdWzBdID0geiAqIHggKiB0IC0geSAqIHM7XHJcbiAgICAgICAgbVszXVswXSA9IDA7XHJcbiAgICAgICAgbVswXVsxXSA9IHggKiB5ICogdCAtIHogKiBzO1xyXG4gICAgICAgIG1bMV1bMV0gPSB5ICogeSAqIHQgKyBjO1xyXG4gICAgICAgIG1bMl1bMV0gPSB6ICogeSAqIHQgKyB4ICogcztcclxuICAgICAgICBtWzNdWzFdID0gMDtcclxuICAgICAgICBtWzBdWzJdID0geCAqIHogKiB0ICsgeSAqIHM7XHJcbiAgICAgICAgbVsxXVsyXSA9IHkgKiB6ICogdCAtIHggKiBzO1xyXG4gICAgICAgIG1bMl1bMl0gPSB6ICogeiAqIHQgKyBjO1xyXG4gICAgICAgIG1bM11bMl0gPSAwO1xyXG4gICAgICAgIG1bMF1bM10gPSAwO1xyXG4gICAgICAgIG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTY2FsZU1hdHJpeChzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIGxldCBtID0gcmVzdWx0Lm1hdHJpeDtcclxuXHJcbiAgICAgICAgbVswXVswXSA9IHMueDsgbVswXVsxXSA9IDA7IG1bMF1bMl0gPSAwOyBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzBdID0gMDsgbVsxXVsxXSA9IHMueTsgbVsxXVsyXSA9IDA7IG1bMV1bM10gPSAwO1xyXG4gICAgICAgIG1bMl1bMF0gPSAwOyBtWzJdWzFdID0gMDsgbVsyXVsyXSA9IHMuejsgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVswXSA9IDA7IG1bM11bMV0gPSAwOyBtWzNdWzJdID0gMDsgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbSA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBtLm1hdHJpeFswXVswXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbMV1bMV0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzJdWzJdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRyaXg0eDRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWF0ZXJuaW9uIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihldWxlcjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUFyb3VuZChhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmV1bGVyQW5nbGVzID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcclxuICAgICAgICAgICAgdGhpcy53ID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBldWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbih0aGlzKS5nZXRFdWxlckFuZ2xlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZXVsZXJBbmdsZXMoZTogVmVjdG9yMykge1xyXG4gICAgICAgIHZhciBxID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5RXVsZXJBbmdsZXMoZSkuZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgdGhpcy53ID0gcS53O1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVBcm91bmQoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIGxldCBxID0gUXVhdGVybmlvbi5hbmdsZUF4aXMoYW5nbGUsIGF4aXMpO1xyXG4gICAgICAgIHRoaXMueCA9IHEueDtcclxuICAgICAgICB0aGlzLnkgPSBxLnk7XHJcbiAgICAgICAgdGhpcy56ID0gcS56O1xyXG4gICAgICAgIHRoaXMudyA9IHEudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQHpoIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxyXG4gICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1RdWF0KGE6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICAvLyBiZW5jaG1hcmtzOiBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXRyYW5zZm9ybS1WZWMzLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICBsZXQgcSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXHJcbiAgICAgICAgY29uc3QgaXggPSBxLncgKiBhLnggKyBxLnkgKiBhLnogLSBxLnogKiBhLnk7XHJcbiAgICAgICAgY29uc3QgaXkgPSBxLncgKiBhLnkgKyBxLnogKiBhLnggLSBxLnggKiBhLno7XHJcbiAgICAgICAgY29uc3QgaXogPSBxLncgKiBhLnogKyBxLnggKiBhLnkgLSBxLnkgKiBhLng7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtcS54ICogYS54IC0gcS55ICogYS55IC0gcS56ICogYS56O1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XHJcbiAgICAgICAgb3V0LnggPSBpeCAqIHEudyArIGl3ICogLXEueCArIGl5ICogLXEueiAtIGl6ICogLXEueTtcclxuICAgICAgICBvdXQueSA9IGl5ICogcS53ICsgaXcgKiAtcS55ICsgaXogKiAtcS54IC0gaXggKiAtcS56O1xyXG4gICAgICAgIG91dC56ID0gaXogKiBxLncgKyBpdyAqIC1xLnogKyBpeCAqIC1xLnkgLSBpeSAqIC1xLng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw55CD6Z2i5o+S5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2xlcnAoYTogUXVhdGVybmlvbiwgYjogUXVhdGVybmlvbiwgdDogbnVtYmVyKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgLy8gYmVuY2htYXJrczpcclxuICAgICAgICAvLyAgICBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXNsZXJwLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlMCA9IDA7XHJcbiAgICAgICAgbGV0IHNjYWxlMSA9IDA7XHJcblxyXG4gICAgICAgIC8vIGNhbGMgY29zaW5lXHJcbiAgICAgICAgbGV0IGNvc29tID0gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgICAgIC8vIGFkanVzdCBzaWducyAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgIGlmIChjb3NvbSA8IDAuMCkge1xyXG4gICAgICAgICAgICBjb3NvbSA9IC1jb3NvbTtcclxuICAgICAgICAgICAgYi54ID0gLWIueDtcclxuICAgICAgICAgICAgYi55ID0gLWIueTtcclxuICAgICAgICAgICAgYi56ID0gLWIuejtcclxuICAgICAgICAgICAgYi53ID0gLWIudztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGNvZWZmaWNpZW50c1xyXG4gICAgICAgIGlmICgoMS4wIC0gY29zb20pID4gMC4wMDAwMDEpIHtcclxuICAgICAgICAgICAgLy8gc3RhbmRhcmQgY2FzZSAoc2xlcnApXHJcbiAgICAgICAgICAgIGNvbnN0IG9tZWdhID0gTWF0aC5hY29zKGNvc29tKTtcclxuICAgICAgICAgICAgY29uc3Qgc2lub20gPSBNYXRoLnNpbihvbWVnYSk7XHJcbiAgICAgICAgICAgIHNjYWxlMCA9IE1hdGguc2luKCgxLjAgLSB0KSAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2lub207XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBxdWF0ZXJuaW9ucyBhcmUgdmVyeSBjbG9zZVxyXG4gICAgICAgICAgICAvLyAgLi4uIHNvIHdlIGNhbiBkbyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgICAgIHNjYWxlMCA9IDEuMCAtIHQ7XHJcbiAgICAgICAgICAgIHNjYWxlMSA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBmaW5hbCB2YWx1ZXNcclxuICAgICAgICBvdXQueCA9IHNjYWxlMCAqIGEueCArIHNjYWxlMSAqIGIueDtcclxuICAgICAgICBvdXQueSA9IHNjYWxlMCAqIGEueSArIHNjYWxlMSAqIGIueTtcclxuICAgICAgICBvdXQueiA9IHNjYWxlMCAqIGEueiArIHNjYWxlMSAqIGIuejtcclxuICAgICAgICBvdXQudyA9IHNjYWxlMCAqIGEudyArIHNjYWxlMSAqIGIudztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdChhOiBRdWF0ZXJuaW9uLCBiOiBRdWF0ZXJuaW9uKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5nbGVBeGlzKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFF1YXRlcm5pb24oKTtcclxuXHJcbiAgICAgICAgYW5nbGUgPSBNYXRoLlBJICogYW5nbGUgLyAxODA7XHJcbiAgICAgICAgYW5nbGUgKj0gMC41O1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmVzLnggPSBheGlzLnggKiBzaW47XHJcbiAgICAgICAgcmVzLnkgPSBheGlzLnkgKiBzaW47XHJcbiAgICAgICAgcmVzLnogPSBheGlzLnogKiBzaW47XHJcbiAgICAgICAgcmVzLncgPSBNYXRoLmNvcyhhbmdsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaWRlbnRpdHkoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdpZHRoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yNClcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjIpOiBWZWN0b3IyO1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjI7XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjIpOiBWZWN0b3IyO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMjtcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseShkOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggKj0gZDtcclxuICAgICAgICB0aGlzLnkgKj0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGl2aWRlKGQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAvPSBkO1xyXG4gICAgICAgIHRoaXMueSAvPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZSh2OiBWZWN0b3IyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjIuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IyLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMiwgdDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLngpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjIsIHYyOiBWZWN0b3IyKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhWZWN0b3IyLmRvdCh2MSwgdjIpIC8gKHYxLm1hZ25pdHVkZSAqIHYyLm1hZ25pdHVkZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBSSUdIVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgTEVGVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFVQKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBET1dOKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3I0IH0gZnJvbSBcIi4vVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xyXG5cclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3I0KVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgT1BFUkFUSU9OUyBPTiBWRUNUT1JcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhZGQodjogVmVjdG9yMyk6IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgYWRkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzO1xyXG4gICAgc3VidHJhY3QoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiAtPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgdGhpcy56ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICB0aGlzLnogLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICB0aGlzLnogKj0gdi56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRvdCh2OiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMy5kb3QodGhpcywgdik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyb3NzKHY6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMy5jcm9zcyh0aGlzLCB2KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yMy5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMywgdDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHYgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIHYueCA9IHYxLnggKyB0ICogKHYyLnggLSB2MS54KTtcclxuICAgICAgICB2LnkgPSB2MS55ICsgdCAqICh2Mi55IC0gdjEueSk7XHJcbiAgICAgICAgdi56ID0gdjEueiArIHQgKiAodjIueiAtIHYxLnopO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHkodjogVmVjdG9yMywgczogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHYueCAqIHMsIHYueSAqIHMsIHYueiAqIHMpO1xyXG4gICAgfSBcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFkZCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModjEueCArIHYyLngsIHYxLnkgKyB2Mi55LCB2MS56ICsgdjIueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzdWJ0cmFjdCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModjEueCAtIHYyLngsIHYxLnkgLSB2Mi55LCB2MS56IC0gdjIueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkgKyB2MS56ICogdjIueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcm9zcyh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB2YXIgeCA9IHYxLnkgKiB2Mi56IC0gdjEueiAqIHYyLnk7XHJcbiAgICAgICAgdmFyIHkgPSB2MS56ICogdjIueCAtIHYxLnggKiB2Mi56O1xyXG4gICAgICAgIHZhciB6ID0gdjEueCAqIHYyLnkgLSB2MS55ICogdjIueDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciB4ID0gdjIueCAtIHYxLng7XHJcbiAgICAgICAgdmFyIHkgPSB2Mi55IC0gdjEueTtcclxuICAgICAgICB2YXIgeiA9IHYyLnogLSB2MS56O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpZmZlcmVuY2UodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIGRlc3QgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICBkZXN0LnggPSB2MS54IC0gdjIueFxyXG4gICAgICAgIGRlc3QueSA9IHYxLnkgLSB2Mi55XHJcbiAgICAgICAgZGVzdC56ID0gdjEueiAtIHYyLnpcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlc3RcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhWZWN0b3IzLmRvdCh2MSwgdjIpIC8gKHYxLm1hZ25pdHVkZSAqIHYyLm1hZ25pdHVkZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIFZBUklBQkxFU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgWkVSTygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgT05FKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygxLCAxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBSSUdIVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgTEVGVCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoLTEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFVQKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAxLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBET1dOKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygwLCAtMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRk9SV0FSRCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgQkFDSygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMCwgLTEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3I0IHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgcigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy54OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGcoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueTsgfVxyXG4gICAgcHVibGljIGdldCBiKCk6IG51bWJlciB7IHJldHVybiB0aGlzLno7IH1cclxuICAgIHB1YmxpYyBnZXQgYSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy53OyB9XHJcblxyXG4gICAgcHVibGljIGdldCB2ZWN0b3IzKCk6IFZlY3RvcjMgeyByZXR1cm4gbmV3IFZlY3RvcjModGhpcyk7IH1cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50cy5sZW5ndGggPT0gMiA/IGFyZ3VtZW50c1sxXSA6IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjQpOiBWZWN0b3I0O1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiBWZWN0b3I0O1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMudyArPSBhcmd1bWVudHNbMF0udztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogKz0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgKz0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VidHJhY3QodjogVmVjdG9yNCk6IFZlY3RvcjQ7XHJcbiAgICBwdWJsaWMgc3VidHJhY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjdG9yNDtcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMudyAtPSBhcmd1bWVudHNbMF0udztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLncgLT0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgdGhpcy56ICo9IGQ7XHJcbiAgICAgICAgdGhpcy53ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICB0aGlzLnogLz0gZDtcclxuICAgICAgICB0aGlzLncgLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yNCk6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICB0aGlzLnogKj0gdi56O1xyXG4gICAgICAgIHRoaXMudyAqPSB2Lnc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5lZ2F0ZSgpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yNC5kb3QodGhpcywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3FyTWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjQuZG90KHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgQURESVRJT05BTCBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3I0IHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKHY6IFZlY3RvcjQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdi54ID09IHRoaXMueCAmJiB2LnkgPT0gdGhpcy55ICYmIHYueiA9PSB0aGlzLnogJiYgdi53ID09IHRoaXMudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIiwgXCIgKyB0aGlzLncgKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQsIHQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjQoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICB2LncgPSB2MS53ICsgdCAqICh2Mi53IC0gdjEudyk7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkgKyB2MS56ICogdjIueiArIHYxLncgKiB2Mi53KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3I0LmRvdCh2MSwgdjIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoMSwgMSwgMSwgMSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCb3VuZHMgfSBmcm9tIFwiLi9NYXRoL0JvdW5kc1wiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc2gge1xyXG4gICAgYm91bmRzOiBCb3VuZHNbXTsgICAgICAgICAgICAgICAgICAgICAgIC8vIOWMheWbtOebklxyXG4gICAgbWF0ZXJpYWw6IHN0cmluZ1tdOyAgICAgICAgICAgICAgICAgICAgIC8vIOadkOi0qFxyXG4gICAgdHJpYW5nbGVzOiBudW1iZXJbXTsgICAgICAgICAgICAgICAgICAgIC8vIOS4ieinkuW9olxyXG4gICAgdmVydGljZXM6IFZlY3RvcjNbXTsgICAgICAgICAgICAgICAgICAgIC8vIOmhtueCuVxyXG4gICAgdXY6IFZlY3RvcjJbXTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVWXHJcbiAgICBub3JtYWxzOiBWZWN0b3IzW107ICAgICAgICAgICAgICAgICAgICAgLy8g5rOV57q/XHJcbiAgICB0YW5nZW50czogVmVjdG9yNFtdOyAgICAgICAgICAgICAgICAgICAgLy8g5YiH57q/77yM5Y+v5LuO5qih5Z6L5Lit6I635Y+W5oiW6YCa6L+H5rOV57q/6K6h566X5b6X5YiwXHJcbiAgICBzdWJNZXNoZXM6IFN1Yk1lc2hbXTsgICAgICAgICAgICAgICAgICAgLy8g5a2Q572R5qC8XHJcblxyXG4gICAgLy8g5qOA5p+l572R5qC85piv5ZCm5pyJ5pWIXHJcbiAgICBwdWJsaWMgY2hlY2tWYWxpZCgpOiBCb29sZWFuIHtcclxuICAgICAgICAvLyDmo4Dmn6XlrprngrnmlbDjgIF1duaVsOOAgeazlee6v+aVsOmHj+aYr+WQpuS4jeS4uumbtuW5tuS4lOebuOetie+8jOWQjOaXtuS4ieinkuW9ouaVsOmHj+W6lOivpeaYr+S4ieeahOWAjeaVsFxyXG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRpY2VzLmxlbmd0aCAhPT0gMFxyXG4gICAgICAgICAgICAmJiB0aGlzLnZlcnRpY2VzLmxlbmd0aCA9PT0gdGhpcy51di5sZW5ndGhcclxuICAgICAgICAgICAgJiYgdGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IHRoaXMubm9ybWFscy5sZW5ndGhcclxuICAgICAgICAgICAgJiYgdGhpcy50cmlhbmdsZXMubGVuZ3RoICE9PSAwXHJcbiAgICAgICAgICAgICYmIHRoaXMudHJpYW5nbGVzLmxlbmd0aCAlIDMgPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YeN5paw6K6h566X5YyF5Zu055uSXHJcbiAgICBwdWJsaWMgcmVjYWxjdWxhdGVCb3VuZHMoKSB7XHJcbiAgICAgICAgLy9UT0RPXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdWJNZXNoIHtcclxuICAgIHZlcnRleENvdW50OiBudW1iZXI7XHJcbiAgICBmaXJzdFZlcnRleDogbnVtYmVyO1xyXG4gICAgaW5kZXhDb3VudDogbnVtYmVyO1xyXG4gICAgaW5kZXhTdGFydDogbnVtYmVyO1xyXG4gICAgYm91bmRzOiBCb3VuZHM7XHJcbiAgICBtYXRlcmlhbDogc3RyaW5nO1xyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zyb21cIjtcclxuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9Db21wb25lbnQvUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgTWVzaFJlbmRlcmVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L01lc2hSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tIFwiLi9Db21wb25lbnQvQ2FtZXJhXCI7XHJcbmltcG9ydCB7IEVuZ2luZSwgRW5naW5lQ29uZmlnIH0gZnJvbSBcIi4vRW5naW5lXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlclwiO1xyXG5cclxuZW51bSBEcmF3TW9kZSB7XHJcbiAgICBXaXJlZnJhbWUsXHJcbiAgICBQb2ludCxcclxuICAgIFVWLFxyXG4gICAgTm9ybWFsLFxyXG4gICAgU2hhZGVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSYXN0ZXJpemF0aW9uUGlwZWxpbmUge1xyXG4gICAgcHVibGljIGRyYXdNb2RlOiBEcmF3TW9kZSA9IERyYXdNb2RlLlVWO1xyXG4gICAgcHJpdmF0ZSB1aW50MzJWaWV3OiBVaW50MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aW50MzJWaWV3OiBVaW50MzJBcnJheSkge1xyXG4gICAgICAgIHRoaXMudWludDMyVmlldyA9IHVpbnQzMlZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLkNsZWFyKENvbG9yLkJMQUNLKTtcclxuXHJcbiAgICAgICAgLy8g6I635Y+W5Zy65pmv5Lit55qE5omA5pyJ5qC55ri45oiP5a+56LGh5bm25riy5p+TXHJcbiAgICAgICAgY29uc3Qgcm9vdE9iamVjdHMgPSBFbmdpbmUuc2NlbmVNYW5hZ2VyLmdldEFjdGl2ZVNjZW5lKCk/LmdldFJvb3RHYW1lT2JqZWN0cygpO1xyXG4gICAgICAgIGlmIChyb290T2JqZWN0cykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGdhbWVPYmplY3Qgb2Ygcm9vdE9iamVjdHMpIHtcclxuICAgICAgICAgICAgICAgIC8vIOaYvuW8j+aMh+Wumuexu+Wei+WPguaVsFxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVycyA9IGdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oUmVuZGVyZXIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByZW5kZXIgb2YgcmVuZGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRHJhd09iamVjdChyZW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5sb2cocmVuZGVyLmdhbWVPYmplY3QubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIOWfuuehgOe7mOWItuaOpeWPo1xyXG5cclxuICAgIHB1YmxpYyBDbGVhcihjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5L2/55SoIGZpbGwg5pa55rOV5pu/5Luj5b6q546v77yM5oCn6IO95pu05aW9XHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3LmZpbGwoY29sb3IpO1xyXG4gICAgICAgIC8vIOaIluiAheS9v+eUqOW+queOr++8jOS9huaAp+iDvei+g+W3rlxyXG4gICAgICAgIC8vIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jYW52YXNXaWR0aDsgeCsrKSB7XHJcbiAgICAgICAgLy8gICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5jYW52YXNIZWlnaHQ7IHkrKykge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5TZXRQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdQaXhlbCh4OiBudW1iZXIsIHk6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOe7mOWItuWIsOWxj+W5leS4iueahOWDj+e0oOW6lOivpeaYr+aVtOaVsOeahFxyXG4gICAgICAgIC8vIOS8mOWMljog5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHggPSAoeCB8IDApO1xyXG4gICAgICAgIHkgPSAoeSB8IDApO1xyXG4gICAgICAgIC8vIHggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIC8vIHkgPSBNYXRoLmZsb29yKHkpO1xyXG5cclxuICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBFbmdpbmVDb25maWcuY2FudmFzV2lkdGggfHwgeSA8IDAgfHwgeSA+PSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWludDMyVmlld1t5ICogRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoICsgeF0gPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd0xpbmUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S8mOWMlui+ueeVjOajgOafpVxyXG4gICAgICAgIC8vIOeUu+e6v+WJjeimgei/m+ihjOi+ueajgOafpe+8jOehruS/nee6v+eahOS4pOerr+eCuemDveWcqOWxj+W5leWGhe+8jOWmguaenOe6v+eahOiMg+WbtOW+iOmVv+W5tuS4lOS4jeWcqOWxj+W5leiMg+WbtOWGhe+8jOmDvei/m+ihjOiuoeeul+S8mumAoOaIkOa1qui0ueWkp+mHj+eahOi1hOa6kO+8jOijgeWJquaOiei2heWHuueahOmDqOWIhlxyXG4gICAgICAgIGNvbnN0IHcgPSBFbmdpbmVDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgY29uc3QgaCA9IEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQ7XHJcbiAgICAgICAgaWYgKCgoeDEgfCB5MSkgPCAwKSB8fCAoeDEgPj0gdykgfHwgKHkxID49IGgpIHx8ICgoeDIgfCB5MikgPCAwKSB8fCAoeDIgPj0gdykgfHwgKHkyID49IGgpKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzroo4HliarmjonotoXlh7rlsY/luZXnmoTpg6jliIZcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5Y+W5pW0XHJcbiAgICAgICAgeDEgPSB4MSB8IDA7XHJcbiAgICAgICAgeTEgPSB5MSB8IDA7XHJcbiAgICAgICAgeDIgPSB4MiB8IDA7XHJcbiAgICAgICAgeTIgPSB5MiB8IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGR4ID0geDIgLSB4MTtcclxuICAgICAgICBjb25zdCBkeSA9IHkyIC0geTE7XHJcblxyXG4gICAgICAgIC8vIOS4uuS9leimgeWMuuWIhuaWnOeOh+aYr+WQpuWBj+awtOW5s+i/mOaYr+WeguebtOWRou+8n+WboOS4uuWmguaenOS4jeWMuuWIhu+8jOS+i+WmguW9k+aWnOeOh+Wkp+S6jjHml7bvvIzkvJrlr7zoh7Tnm7Tnur/nu5jliLbkuI3ov57nu63vvIzlm6DkuLp55Lya6Lez5Y+Y77yM6ICM5LiN5piv6L+e57ut55qE5aKe5Yqg44CCXHJcbiAgICAgICAgLy8g5Y+q5pyJ5pac546H5Yia5aW95Li6MeaXtu+8jHjot5955omN5piv6L+e57ut5ZCM5q2l6Ieq5aKe55qE77yMeCsx77yM5YiZeeS5nysxXHJcbiAgICAgICAgLy8g5omA5Lul77yM5b2T5pac546H5aSn5LqOMeaXtu+8jOaIkeS7rOmcgOimgeS9v+eUqHnkvZzkuLrlvqrnjq/lj5jph4/vvIzogIzlvZPmlpznjoflsI/kuo4x5pe277yM5oiR5Lus6ZyA6KaB5L2/55SoeOS9nOS4uuW+queOr+WPmOmHj+OAglxyXG4gICAgICAgIC8vIOS4vuS4quaegeerr+S+i+WtkO+8jOW9k+aWnOeOh+S4ujDml7bvvIznm7Tnur/lsLHmmK/kuIDmnaHlnoLnm7Tnm7Tnur/vvIzlpoLmnpzov5nml7blgJnov5jnlKh45L2c5Li65b6q546v5Y+Y6YeP77yM5YiZ5Lya5a+86Ie06L+Z5p2h55u057q/5LiK5omA5pyJeeeCuemDveWvueW6lOS4gOS4qnjvvIzkuZ/lsLHmmK/or7Tov5nmnaHnur/lj5jmiJDkuIDkuKrngrnkuobjgIJcclxuXHJcbiAgICAgICAgLy8g5pac546H5bCP5LqOMe+8jOebtOe6v+WBj+awtOW5s+aDheWGte+8jOS9v+eUqHjkvZzkuLrlvqrnjq/lj5jph49cclxuICAgICAgICBpZiAoTWF0aC5hYnMoZHgpID4gTWF0aC5hYnMoZHkpKSB7XHJcbiAgICAgICAgICAgIC8vIOS4i+mdoueahOW+queOr+e7mOWItuWHveaVsOaYr+S7juW3puW+gOWPs+eahO+8jOi/memHjOimgeehruS/nee7k+adn+eCueWcqOW8gOWni+eCueeahOWPs+i+uVxyXG4gICAgICAgICAgICBpZiAoeDIgPCB4MSkgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcblxyXG4gICAgICAgICAgICAvLyDmlpznjodcclxuICAgICAgICAgICAgY29uc3QgYSA9IGR5IC8gZHg7XHJcbiAgICAgICAgICAgIC8vIOaIqui3ne+8iHk9YXgrYu+8jGI9eS1heO+8iVxyXG4gICAgICAgICAgICAvLyBjb25zdCBiID0geTEgLSBhICogeDE7XHJcbiAgICAgICAgICAgIGxldCB5ID0geTE7XHJcbiAgICAgICAgICAgIC8vIOe7mOWItuebtOe6v1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geDE7IHggPD0geDI7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgLy8g55u057q/5YWs5byPeT1heCti77yM6L+Z6YeM5LiN5b+F6K6h566X6L+Z5Liq5YWs5byP77yM5Zug5Li65b2TeOWKoDHoh6rlop7ml7bvvIx55Lmf5Lya5YqgYe+8jOaJgOS7peWPr+S7peebtOaOpeeUqHkrYeS7o+abv2F4K2LvvIznrpfmmK/kuIDkuKrmgKfog73kvJjljJbngrlcclxuICAgICAgICAgICAgICAgIC8vIHkgPSBhICogeCArIGI7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaIllxyXG4gICAgICAgICAgICAvLyBjb25zdCB5cyA9IHRoaXMuSW50ZXJwb2xhdGUoeDEsIHkxLCB4MiwgeTIpO1xyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCB4ID0geDE7IHggPD0geDI7IHgrKykge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeXNbeCAtIHgxXSwgY29sb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOaWnOeOh+Wkp+S6jjHvvIznm7Tnur/lgY/lnoLnm7Tmg4XlhrXvvIzkvb/nlKh55L2c5Li65b6q546v5Y+Y6YePXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh5MiA8IHkxKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkeCAvIGR5O1xyXG4gICAgICAgICAgICBsZXQgeCA9IHgxO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyBhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiJZcclxuICAgICAgICAgICAgLy8gY29uc3QgeHMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICAgICAgLy8gZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuRHJhd1BpeGVsKHhzW3kgLSB5MV0sIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgxLCB5MSwgeDIsIHkyLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MiwgeTIsIHgzLCB5MywgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDMsIHkzLCB4MSwgeTEsIGNvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDms6jvvJrku6XkuIvmj5DliLDnmoTplb/ovrnvvIznibnmjId56L206Leo5bqm5pyA6ZW/55qE6L6577yM6ICM5LiN5piv5a6e6ZmF5LiK55qE6L656ZW/XHJcblxyXG4gICAgICAgIC8vIOeUu+S4ieinkuW9ouWJjeimgei/m+ihjOi+ueajgOafpe+8jOehruS/neS4ieinkuW9oueahOS4ieS4queCuemDveWcqOWxj+W5leWGhe+8jOWmguaenOacieeCuei2heWHuuWxj+W5leiMg+WbtO+8jOWImeijgeWJqu+8jOW5tueUn+aIkOaWsOeahOS4ieinkuW9olxyXG4gICAgICAgIGNvbnN0IHcgPSBFbmdpbmVDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgY29uc3QgaCA9IEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQ7XHJcbiAgICAgICAgaWYgKCgoeDEgfCB5MSkgPCAwKSB8fCAoeDEgPj0gdykgfHwgKHkxID49IGgpIHx8ICgoeDIgfCB5MikgPCAwKSB8fCAoeDIgPj0gdykgfHwgKHkyID49IGgpIHx8ICgoeDMgfCB5MykgPCAwKSB8fCAoeDMgPj0gdykgfHwgKHkzID49IGgpKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzroo4HliarmjonotoXlh7rlsY/luZXnmoTpg6jliIZcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnov5vooYzmjpLluo/vvIzkvb/lvpd5MTw9eTI8PXkz77yM5Y2z5Y+v56Gu5a6a5LiJ6KeS5b2i55qE6ZW/6L655Li6TDEz77yMTDEy5ZKMTDIz5YiZ5piv5Y+m5aSW5Lik5p2h55+t6L65XHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MSA+IHkzKSBbeDEsIHkxLCB4MywgeTNdID0gW3gzLCB5MywgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzXSA9IFt4MywgeTMsIHgyLCB5Ml07XHJcblxyXG4gICAgICAgIC8vIOiOt+WPljPmnaHovrnnmoTngrnlnZDmoIflkIjpm4ZcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMTMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTMsIHgzKTtcclxuXHJcbiAgICAgICAgLy8g5ou85ZCI5Lik5p2h55+t6L655Li65LiA5p2h6ZW/6L6577yI5YWI56e76Zmk56ys5LiA5p2h6L6555qE5pyA5ZCO5LiA5Liq5pWw5o2u77yM6YG/5YWN6YeN5aSN77yJXHJcbiAgICAgICAgLy8g546w5Zyo5Y+Y5oiQMuadoemVv+i+ue+8jEwxM+WSjEwxMjNcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuXHJcbiAgICAgICAgLy8g5Yik5patTDEz5ZKMTDEyM+WTquadoemVv+i+ueaYr+W3puWTquadoeaYr+WPs++8jOmDveWPluaVsOe7hOS4remXtOeahOeCue+8jOWIpOaWreiwgeW3puiwgeWPs+WNs+WPr+OAglxyXG4gICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBwTGVmdCA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHBSaWdodCA9IHAxMztcclxuICAgICAgICBpZiAocDEzW21dIDwgcDEyM1ttXSkge1xyXG4gICAgICAgICAgICBwTGVmdCA9IHAxMztcclxuICAgICAgICAgICAgcFJpZ2h0ID0gcDEyMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuawtOW5s+e6v+autVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MzsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwTGVmdFt5IC0geTFdOyB4IDw9IHBSaWdodFt5IC0geTFdOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKFxyXG4gICAgICAgIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsXHJcbiAgICAgICAgeDI6IG51bWJlciwgeTI6IG51bWJlcixcclxuICAgICAgICB4MzogbnVtYmVyLCB5MzogbnVtYmVyLFxyXG4gICAgICAgIGNvbG9yMTogbnVtYmVyLCBjb2xvcjI6IG51bWJlciwgY29sb3IzOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIOeUu+S4ieinkuW9ouWJjeimgei/m+ihjOi+ueajgOafpe+8jOehruS/neS4ieinkuW9oueahOS4ieS4queCuemDveWcqOWxj+W5leWGhe+8jOWmguaenOacieeCuei2heWHuuWxj+W5leiMg+WbtO+8jOWImeijgeWJqu+8jOW5tueUn+aIkOaWsOeahOS4ieinkuW9olxyXG4gICAgICAgIGNvbnN0IHcgPSBFbmdpbmVDb25maWcuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgY29uc3QgaCA9IEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQ7XHJcbiAgICAgICAgaWYgKCgoeDEgfCB5MSkgPCAwKSB8fCAoeDEgPj0gdykgfHwgKHkxID49IGgpIHx8ICgoeDIgfCB5MikgPCAwKSB8fCAoeDIgPj0gdykgfHwgKHkyID49IGgpIHx8ICgoeDMgfCB5MykgPCAwKSB8fCAoeDMgPj0gdykgfHwgKHkzID49IGgpKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzroo4HliarmjonotoXlh7rlsY/luZXnmoTpg6jliIZcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnmjIlZ5Z2Q5qCH5o6S5bqP77yM56Gu5L+deTEgPD0geTIgPD0geTNcclxuICAgICAgICBpZiAoeTEgPiB5MikgW3gxLCB5MSwgeDIsIHkyLCBjb2xvcjEsIGNvbG9yMl0gPSBbeDIsIHkyLCB4MSwgeTEsIGNvbG9yMiwgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzLCBjb2xvcjEsIGNvbG9yM10gPSBbeDMsIHkzLCB4MSwgeTEsIGNvbG9yMywgY29sb3IxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzLCBjb2xvcjIsIGNvbG9yM10gPSBbeDMsIHkzLCB4MiwgeTIsIGNvbG9yMywgY29sb3IyXTtcclxuXHJcbiAgICAgICAgLy8g5o+Q5Y+WUkdC5YiG6YePXHJcbiAgICAgICAgY29uc3QgYzEgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMSk7XHJcbiAgICAgICAgY29uc3QgYzIgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMik7XHJcbiAgICAgICAgY29uc3QgYzMgPSBDb2xvci5Gcm9tVWludDMyKGNvbG9yMyk7XHJcblxyXG4gICAgICAgIC8vIOaPkuWAvOWHveaVsO+8jOminOiJsjHkuI7popzoibIy5ZyoZDEtZDLnmoTojIPlm7TlhoXlnYfljIDmj5LlgLxcclxuICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZUNvbG9yID0gKGQxOiBudW1iZXIsIHIxOiBudW1iZXIsIGcxOiBudW1iZXIsIGIxOiBudW1iZXIsIGExOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGQyOiBudW1iZXIsIHIyOiBudW1iZXIsIGcyOiBudW1iZXIsIGIyOiBudW1iZXIsIGEyOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCPXHJcbiAgICAgICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LlkoxNYXRoLmFic++8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgICAgICAvLyBjb25zdCBkeCA9IE1hdGguYWJzKE1hdGguZmxvb3IoZDIgLSBkMSkpO1xyXG4gICAgICAgICAgICBjb25zdCBkeCA9ICgoZDIgPiBkMSA/IGQyIC0gZDEgOiBkMSAtIGQyKSB8IDApO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+atpemVv1xyXG4gICAgICAgICAgICBjb25zdCBpbnZEZWx0YSA9IDEgLyAoZDIgLSBkMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gKHIyIC0gcjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gKGcyIC0gZzEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gKGIyIC0gYjEpICogaW52RGVsdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gKGEyIC0gYTEpICogaW52RGVsdGE7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IHIxLCBnID0gZzEsIGIgPSBiMSwgYSA9IGExO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB7IHIsIGcsIGIsIGEgfTtcclxuICAgICAgICAgICAgICAgIHIgKz0gclN0ZXA7XHJcbiAgICAgICAgICAgICAgICBnICs9IGdTdGVwO1xyXG4gICAgICAgICAgICAgICAgYiArPSBiU3RlcDtcclxuICAgICAgICAgICAgICAgIGEgKz0gYVN0ZXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzkuInmnaHovrnnmoTlnZDmoIflkozpopzoibJcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMTJDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkxLCBjMS5yLCBjMS5nLCBjMS5iLCBjMS5hLCB5MiwgYzIuciwgYzIuZywgYzIuYiwgYzIuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAyMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTIsIHgyLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAyM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTMsIGMzLnIsIGMzLmcsIGMzLmIsIGMzLmEpO1xyXG5cclxuICAgICAgICAvLyDlkIjlubbkuKTmnaHnn63ovrlcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuICAgICAgICBjb25zdCBwMTIzQ29sb3JzID0gcDEyQ29sb3JzLmNvbmNhdChwMjNDb2xvcnMpO1xyXG5cclxuICAgICAgICAvLyDnoa7lrprlt6blj7PovrnnlYxcclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBsZWZ0UG9pbnRzID0gcDEyMztcclxuICAgICAgICBsZXQgcmlnaHRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgbGV0IGxlZnRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIGxldCByaWdodENvbG9ycyA9IHAxM0NvbG9ycztcclxuXHJcbiAgICAgICAgaWYgKHAxM1ttXSA8IHAxMjNbbV0pIHtcclxuICAgICAgICAgICAgbGVmdFBvaW50cyA9IHAxMztcclxuICAgICAgICAgICAgcmlnaHRQb2ludHMgPSBwMTIzO1xyXG4gICAgICAgICAgICBsZWZ0Q29sb3JzID0gcDEzQ29sb3JzO1xyXG4gICAgICAgICAgICByaWdodENvbG9ycyA9IHAxMjNDb2xvcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu5jliLbmsLTlubPnur/mrrXvvIzlubbov5vooYzpopzoibLmj5LlgLxcclxuICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTM7IHkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB5IC0geTE7XHJcbiAgICAgICAgICAgIGNvbnN0IHhTdGFydCA9IGxlZnRQb2ludHNbaWR4XTtcclxuICAgICAgICAgICAgY29uc3QgeEVuZCA9IHJpZ2h0UG9pbnRzW2lkeF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0Q29sb3IgPSBsZWZ0Q29sb3JzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q29sb3IgPSByaWdodENvbG9yc1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgLy8g6aKE6K6h566X6aKc6Imy5beu5YC8XHJcbiAgICAgICAgICAgIGNvbnN0IHJEaWZmID0gcmlnaHRDb2xvci5yIC0gbGVmdENvbG9yLnI7XHJcbiAgICAgICAgICAgIGNvbnN0IGdEaWZmID0gcmlnaHRDb2xvci5nIC0gbGVmdENvbG9yLmc7XHJcbiAgICAgICAgICAgIGNvbnN0IGJEaWZmID0gcmlnaHRDb2xvci5iIC0gbGVmdENvbG9yLmI7XHJcbiAgICAgICAgICAgIGNvbnN0IGFEaWZmID0gcmlnaHRDb2xvci5hIC0gbGVmdENvbG9yLmE7XHJcblxyXG4gICAgICAgICAgICAvLyDmraXplb/lkozpopzoibLlop7ph49cclxuICAgICAgICAgICAgY29uc3QgaW52TGVuZ3RoID0gMSAvICgoeEVuZCAtIHhTdGFydCkgKyAxKTtcclxuICAgICAgICAgICAgY29uc3QgclN0ZXAgPSByRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgZ1N0ZXAgPSBnRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYlN0ZXAgPSBiRGlmZiAqIGludkxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYVN0ZXAgPSBhRGlmZiAqIGludkxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIOWIneWni+minOiJsuWAvFxyXG4gICAgICAgICAgICBsZXQgciA9IGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBsZXQgZyA9IGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBsZXQgYiA9IGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBsZXQgYSA9IGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5rC05bmz5pa55ZCR6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5hbENvbG9yID0gKChhIHwgMCkgPDwgMjQpIHwgKChiIHwgMCkgPDwgMTYpIHwgKChnIHwgMCkgPDwgOCkgfCAociB8IDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3UGl4ZWwoeCwgeSwgZmluYWxDb2xvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g57Sv5Yqg6aKc6Imy5YC8XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDmipXlvbHnm7jlhbNcclxuXHJcbiAgICAvLyDlsIbop4blj6PkuIrnmoTlhoXlrrnmmKDlsITliLDlrp7pmYXlsY/luZXkuIpcclxuICAgIHB1YmxpYyBWaWV3cG9ydFRvQ2FudmFzKHBvaW50OiBWZWN0b3IyKSB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG5Y+j5a695bqm5Li6MeS4quWNleS9jVxyXG4gICAgICAgIC8vIOWboOS4umFzcGVjdFJhdGlvID0gY2FudmFzV2lkdGggLyBjYW52YXNIZWlnaHTvvIxcclxuICAgICAgICAvLyDmiYDku6Xop4blj6Ppq5jluqYgPSAxIC8gYXNwZWN0UmF0aW8gPSBjYW52YXNIZWlnaHQgLyBjYW52YXNXaWR0aFxyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSAxO1xyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gMSAvIEVuZ2luZUNvbmZpZy5hc3BlY3RSYXRpbztcclxuXHJcbiAgICAgICAgLy8g5bCG5oqV5b2x5Z2Q5qCH5pig5bCE5YiwQ2FudmFz5YOP57Sg5Z2Q5qCHXHJcbiAgICAgICAgLy8gWOWdkOagh++8muS7jiBbLXZpZXdwb3J0V2lkdGgvMiwgdmlld3BvcnRXaWR0aC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc1dpZHRoXVxyXG4gICAgICAgIC8vIFnlnZDmoIfvvJrku44gWy12aWV3cG9ydEhlaWdodC8yLCB2aWV3cG9ydEhlaWdodC8yXSDmmKDlsITliLAgWzAsIGNhbnZhc0hlaWdodF0gKOazqOaEj1novbTmlrnlkJEpXHJcbiAgICAgICAgY29uc3QgY2FudmFzWCA9ICgocG9pbnQueCArIHZpZXdwb3J0V2lkdGggLyAyKSAvIHZpZXdwb3J0V2lkdGgpICogRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgocG9pbnQueSArIHZpZXdwb3J0SGVpZ2h0IC8gMikgLyB2aWV3cG9ydEhlaWdodCkgKiBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0KTsgLy8gQ2FudmFz55qEWei9tOmAmuW4uOaYr+WQkeS4i+eahFxyXG4gICAgICAgIHBvaW50LnggPSBjYW52YXNYO1xyXG4gICAgICAgIHBvaW50LnkgPSBjYW52YXNZO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmAj+inhuaKleW9se+8jOWwhjNE5Zy65pmv55qE5Z2Q5qCH6L2s5o2i5Li6MkTlsY/luZXlnZDmoIfvvIzmipXlsITliLDop4blj6PkuIpcclxuICAgIHB1YmxpYyBQcm9qZWN0VmVydGV4KHZlcnRleDogVmVjdG9yMyk6IFZlY3RvcjIge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhueCueWIsOi/keijgemdou+8iOinhuWPo++8ieeahOi3neemu+aYr2TvvIzop4blj6PnmoTlrr3mmK8xXHJcbiAgICAgICAgLy8g5qC55o2u5LiJ6KeS5Ye95pWw5pyJ77yadGFuKGZvdi8yKSA9ICgwLjUgLyBkKVxyXG4gICAgICAgIC8vIOaJgOS7pe+8mmQgPSAwLjUgLyB0YW4oZm92LzIpXHJcbiAgICAgICAgY29uc3QgZm92RGVncmVlcyA9IDYwO1xyXG4gICAgICAgIGNvbnN0IGZvdlJhZGlhbnMgPSBmb3ZEZWdyZWVzICogKE1hdGguUEkgLyAxODApOyAvLyDlsIbop5LluqbovazmjaLkuLrlvKfluqZcclxuICAgICAgICBjb25zdCBkID0gMC41IC8gTWF0aC50YW4oZm92UmFkaWFucyAvIDIpO1xyXG5cclxuICAgICAgICAvLyDpgI/op4blhazlvI/vvIzlgYforr7op4bngrnkvY3nva4oMCwwKe+8jOinhueCueWIsOinhuWPo+i3neemu+S4umTvvIzlnLrmma/ph4znmoTngrnkuLpQKHgseSx6Ke+8jOaKleWwhOWIsOinhuWPo+S4iueahOeCueS4ulAnKHgseSlcclxuICAgICAgICAvLyDliJnmoLnmja7nm7jkvLzkuInop5LlvaLmnInvvJp6IC8gZCA9IHggLyB4JyA9IHkgLyB5J++8jOWPr+W+l+WIsO+8mlxyXG4gICAgICAgIC8vIHgnID0gKGQgKiB4KSAvIHpcclxuICAgICAgICAvLyB5JyA9IChkICogeSkgLyB6XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblggPSAoZCAqIHZlcnRleC54KSAvIHZlcnRleC56O1xyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb25ZID0gKGQgKiB2ZXJ0ZXgueSkgLyB2ZXJ0ZXguejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHByb2plY3Rpb25YLCBwcm9qZWN0aW9uWSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOWPmOaNolxyXG5cclxuICAgIHB1YmxpYyBPYmplY3RUb0NsaXBQb3ModmVydGV4OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy9UT0RPXHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuWkVSTztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgT2JqZWN0VG9Xb3JsZE5vcm1hbChub3JtYWw6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy8g6I635Y+W5qih5Z6L55+p6Zi177yI5bGA6YOo5Yiw5LiW55WM56m66Ze055qE5Y+Y5o2i55+p6Zi177yJXHJcbiAgICAgICAgY29uc3QgbW9kZWxNYXRyaXggPSB0cmFuc2Zvcm0ubG9jYWxUb1dvcmxkTWF0cml4O1xyXG5cclxuICAgICAgICAvLyDorqHnrpfmqKHlnovnn6npmLXnmoTpgIbovaznva7nn6npmLVcclxuICAgICAgICAvLyDpgIbovaznva7nn6npmLXlj6/ku6Xnoa7kv53ms5Xnur/lnKjpnZ7lnYfljIDnvKnmlL7ml7bku43nhLbkv53mjIHkuI7ooajpnaLlnoLnm7RcclxuICAgICAgICBjb25zdCBpbnZlcnNlVHJhbnNwb3NlTW9kZWwgPSBtb2RlbE1hdHJpeC5jbG9uZSgpLmludmVyc2UoKS50cmFuc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgLy8g5L2/55So6YCG6L2s572u55+p6Zi15Y+Y5o2i5rOV57q/5ZCR6YeP77yI5b+955Wl5bmz56e75YiG6YeP77yM5Y+q5bqU55So5peL6L2s5ZKM57yp5pS+55qE6YCG5Y+Y5o2i77yJXHJcbiAgICAgICAgY29uc3Qgd29ybGROb3JtYWwgPSBpbnZlcnNlVHJhbnNwb3NlTW9kZWwubXVsdGlwbHlWZWN0b3IzKG5vcm1hbCk7XHJcblxyXG4gICAgICAgIC8vIOW9kuS4gOWMlue7k+aenO+8jOehruS/neazlee6v+S/neaMgeWNleS9jemVv+W6plxyXG4gICAgICAgIHJldHVybiB3b3JsZE5vcm1hbC5ub3JtYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICog6aG254K55aSE55CG6Zi25q6177ya5qih5Z6L56m66Ze0IOKGku+8iOaooeWei+efqemYtemYte+8ieKGkiDkuJbnlYznqbrpl7Qg4oaS77yI6KeG5Zu+55+p6Zi177yJ4oaSIOinguWvn+epuumXtCDihpLvvIjmipXlvbHnn6npmLXvvInihpIg6KOB5Ymq56m66Ze0IOKGku+8iOmAj+inhumZpOazle+8ieKGkiBOREMg56m66Ze0IOKGku+8iOinhuWPo+WPmOaNou+8ieKGkiDlsY/luZXnqbrpl7Qg4oaSIOWFieagheWMlua4suafk1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgVmVydGV4UHJvY2Vzc2luZ1N0YWdlKHZlcnRpY2VzOiBWZWN0b3IzW10sIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgY2xpcFNwYWNlVmVydGljZXMgPSBuZXcgQXJyYXkodmVydGljZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgLy8g5p6E5bu6TVZQ55+p6Zi1XHJcbiAgICAgICAgY29uc3QgbW9kZWxNYXRyaXggPSB0cmFuc2Zvcm0ubG9jYWxUb1dvcmxkTWF0cml4O1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IENhbWVyYS5tYWluQ2FtZXJhO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYUZvcndhcmQgPSBjYW1lcmEudHJhbnNmb3JtLmZvcndhcmQ7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhVXAgPSBjYW1lcmEudHJhbnNmb3JtLnVwO1xyXG4gICAgICAgIC8vIOaehOW7uuS4gOS4quWFiOacneaRhOW9seacuuWPjeaWueWQkeenu+WKqO+8jOWGjeWPjeaWueWQkeaXi+i9rOeahOefqemYte+8jOWFtuWunuW+l+WIsOeahOS5n+WwseaYr+S4iumdouaRhOW9seacuueahOS4lueVjOWdkOagh+efqemYtVxyXG4gICAgICAgIGNvbnN0IG1vZGVsVmlld01hdHJpeCA9IG1vZGVsTWF0cml4LmNsb25lKCkudHJhbnNmb3JtVG9Mb29rQXRTcGFjZShjYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLCBjYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLmFkZChjYW1lcmFGb3J3YXJkKSwgY2FtZXJhVXApO1xyXG4gICAgICAgIGNvbnN0IG12cE1hdHJpeCA9IG1vZGVsVmlld01hdHJpeC5wZXJzcGVjdGl2ZShjYW1lcmEuZm92LCBjYW1lcmEuYXNwZWN0LCBjYW1lcmEubmVhckNsaXAsIGNhbWVyYS5mYXJDbGlwKTtcclxuXHJcbiAgICAgICAgLy8gMS4gTVZQ5Y+Y5o2i5Yiw6KOB5Ymq56m66Ze0XHJcbiAgICAgICAgLy8g5qih5Z6L56m66Ze0IC0+IOS4lueVjOepuumXtCAtPiDop4Llr5/nqbrpl7QgLT4g6KOB5Ymq56m66Ze0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBsZXQgdmVydGljZSA9IHZlcnRpY2VzW2ldLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGxldCB2ID0gbXZwTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2ZXJ0aWNlLCAxKSk7XHJcbiAgICAgICAgICAgIGNsaXBTcGFjZVZlcnRpY2VzW2ldID0gdjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDIuIOmAj+inhumZpOazle+8muWwhuijgeWJquepuumXtOWdkOagh+i9rOaNouS4uuagh+WHhuiuvuWkh+WdkOagh++8iE5EQ++8iVxyXG4gICAgICAgIC8vIOijgeWJquepuumXtCAtPiDmoIflh4bljJborr7lpIflnZDmoIfvvIhOREMg56m66Ze077yJXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB2ID0gY2xpcFNwYWNlVmVydGljZXNbaV07XHJcbiAgICAgICAgICAgIC8vIHfliIbph4/mmK/pgI/op4bmipXlvbHkuqfnlJ/nmoTvvIznlKjkuo7pgI/op4bpmaTms5VcclxuICAgICAgICAgICAgY29uc3QgdyA9IHYudzsgLy8g5YGH6K6+5L2g55qEVmVjdG9yNC9WZWN0b3Iz5a6e546w5Lit77yM6b2Q5qyh5Z2Q5qCHd+WtmOWCqOWcqHflsZ7mgKfkuK3jgILlpoLmnpzmsqHmnInvvIzpnIDopoHnoa7kv51NVlDlj5jmjaLml7blpITnkIbkuobpvZDmrKHlnZDmoIfjgIJcclxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5pi+5byP55qEd+WIhumHj++8jOS4lG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjPov5Tlm57nmoTmmK9WZWN0b3Iz77yM6YKj5LmI6YCa5bi46K6k5Li6dz0x77yI5q2j5Lqk5oqV5b2x77yJ5oiW6ICF6ZyA6KaB5LuO5Y+Y5o2i55+p6Zi15Lit6ICD6JmR6YCP6KeGXHJcblxyXG4gICAgICAgICAgICAvLyDov5vooYzpgI/op4bpmaTms5XvvJp4eXrliIbliKvpmaTku6V3XHJcbiAgICAgICAgICAgIC8vIOazqOaEj++8muWmguaenOS9oOeahOefqemYteS5mOazleayoeacieWkhOeQhum9kOasoeWdkOagh++8iOWNs+i/lOWbnueahHZlcnRpY2XmmK/kuInnu7TlkJHph4/vvInvvIzpgqPkuYjlvojlj6/og73kvaDnmoTlj5jmjaLmsqHmnInljIXlkKvpgI/op4bmipXlvbHkuqfnlJ/nmoR35YiG6YeP44CCXHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuS9oOeahG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjPnoa7lrp7ov5Tlm57kuobljIXlkKvpvZDmrKHlnZDmoIfnmoRWZWN0b3I077yM5oiW6ICF5pyJ5LiA5Liq6L+U5ZueVmVjdG9yNOeahOaWueazleOAglxyXG4gICAgICAgICAgICAvLyDov5nph4zlgYforr4gcHJvamVjdGVkVmVydGljZXMg5Lit5a2Y5YKo55qE5pivIFZlY3RvcjTvvIzmiJbogIXoh7PlsJHmnIkgeCwgeSwgeiwgdyDlsZ7mgKfjgIJcclxuXHJcbiAgICAgICAgICAgIC8vIOWmguaenOaCqOeahOWunueOsOS4re+8jOe7j+i/h+mAj+inhuaKleW9seefqemYteWPmOaNouWQju+8jOmhtueCueW3sue7j+aYr+S4gOS4qum9kOasoeWdkOagh++8iHgsIHksIHosIHfvvInvvIzliJnpnIDopoHku6XkuIvpmaTms5XvvJpcclxuICAgICAgICAgICAgdi54ID0gdi54IC8gdztcclxuICAgICAgICAgICAgdi55ID0gdi55IC8gdztcclxuICAgICAgICAgICAgdi56ID0gdi56IC8gdzsgLy8g5a+55LqO5rex5bqm5L+h5oGv77yM5Y+v6IO96L+Y6ZyA6KaB6L+b5LiA5q2l5aSE55CG77yM5L2G5bGP5bmV5pig5bCE6YCa5bi45Li76KaB5YWz5rOoeCx5XHJcbiAgICAgICAgICAgIC8vIOe7j+i/h+mAj+inhumZpOazleWQju+8jOWdkOagh+S9jeS6juagh+WHhuiuvuWkh+WdkOagh++8iE5EQ++8ieepuumXtO+8jOmAmuW4uHgsIHksIHrojIPlm7TlnKhbLTEsIDFd77yIT3BlbkdM6aOO5qC877yJ5oiWWzAsIDFd77yIRGlyZWN0WOmjjuagvO+8ieS5i+mXtOOAglxyXG4gICAgICAgICAgICAvLyDlgYforr7miJHku6znmoROREPmmK9bLTEsIDFd6IyD5Zu044CCXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAzLiDop4blj6Plj5jmjaLvvJrlsIZOREPlnZDmoIfmmKDlsITliLDlsY/luZXlnZDmoIdcclxuICAgICAgICAvLyDmoIflh4bljJborr7lpIflnZDmoIfvvIhOREMg56m66Ze077yJIC0+IOWxj+W5leepuumXtFxyXG4gICAgICAgIC8vIOiOt+WPlueUu+W4g++8iOaIluinhuWPo++8ieeahOWuveW6puWSjOmrmOW6plxyXG4gICAgICAgIGNvbnN0IHNjcmVlblZlcnRpY2VzID0gbmV3IEFycmF5KGNsaXBTcGFjZVZlcnRpY2VzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBuZGMgPSBjbGlwU3BhY2VWZXJ0aWNlc1tpXTsgLy8g5q2k5pe2bmRj5bqU6K+l5piv57uP6L+H6YCP6KeG6Zmk5rOV5ZCO55qETkRD5Z2Q5qCHXHJcblxyXG4gICAgICAgICAgICAvLyDlsIZOREPnmoR45LuOWy0xLCAxXeaYoOWwhOWIsFswLCBzY3JlZW5XaWR0aF1cclxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuWCA9ICgobmRjLnggKyAxKSAvIDIpICogRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgICAgICAvLyDlsIZOREPnmoR55LuOWy0xLCAxXeaYoOWwhOWIsFswLCBzY3JlZW5IZWlnaHRd44CC5rOo5oSP5bGP5bmV5Z2Q5qCH6YCa5bi4eeWQkeS4i+S4uuato++8jOiAjE5EQ+eahHnlkJHkuIrkuLrmraPvvIzmiYDku6XpnIDopoHnv7vovaxcclxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuWSA9IEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQgLSAoKChuZGMueSArIDEpIC8gMikgKiBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0KTtcclxuICAgICAgICAgICAgLy8geuWIhumHj+mAmuW4uOeUqOS6jua3seW6pua1i+ivle+8jOi/memHjOaIkeS7rOWPquWFs+W/g+Wxj+W5lXgseVxyXG4gICAgICAgICAgICAvLyDlpoLmnpzkvaDnmoROREN66IyD5Zu05pivWy0xLDFd5LiU6ZyA6KaB5pig5bCE5YiwWzAsMV3vvIjkvovlpoJXZWJHUFXmn5Dkupvmg4XlhrXvvInvvIzlj6/ku6XnsbvkvLzlpITnkIbvvJpjb25zdCBzY3JlZW5aID0gKG5kYy56ICsgMSkgLyAyO1xyXG5cclxuICAgICAgICAgICAgc2NyZWVuVmVydGljZXNbaV0gPSB7IHg6IHNjcmVlblgsIHk6IHNjcmVlblkgfTsgLy8g5a2Y5YKo5bGP5bmV5Z2Q5qCHXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2NyZWVuVmVydGljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIOeugOWNleWPmOaNoumYtuaute+8muayoeaciemAmui/h+efqemYteiuoeeul++8jOiAjOaYr+eugOWNleeahOebuOS8vOS4ieinkuW9ouWOn+eQhu+8jOS4ieinkuWHveaVsOeul+WHuk1WUOWPmOaNoui3n+Wxj+W5leaYoOWwhO+8jOeQhuino+i1t+adpeavlOi+g+eugOWNle+8jOS9huavj+S4qumhtueCuemDvee7j+i/h+S7juWktOWIsOWwvueahOiuoeeul++8jOavlOi+g+iAl+aAp+iDvVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgRWFzeVZlcnRleFByb2Nlc3NpbmdTdGFnZSh2ZXJ0aWNlczogVmVjdG9yM1tdLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IGNsaXBTcGFjZVZlcnRpY2VzID0gbmV3IEFycmF5KHZlcnRpY2VzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIC8vIOeugOWNleWPmOaNolxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRpY2UgPSB2ZXJ0aWNlc1tpXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICAvLyDlhYjlj5jmjaLvvIzlv4XpobvkuKXmoLzmjInnhaflhYjnvKnmlL7vvIzlho3ml4vovazvvIzlho3lubPnp7tcclxuICAgICAgICAgICAgdGhpcy5TY2FsZVZlcnRleCh2ZXJ0aWNlLCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB0aGlzLlJvdGF0ZVZlcnRleCh2ZXJ0aWNlLCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVZlcnRleCh2ZXJ0aWNlLCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAvLyDlho3mipXlvbFcclxuICAgICAgICAgICAgY2xpcFNwYWNlVmVydGljZXNbaV0gPSB0aGlzLlByb2plY3RWZXJ0ZXgodmVydGljZSk7XHJcbiAgICAgICAgICAgIC8vIOWGjeinhuWPo+aYoOWwhFxyXG4gICAgICAgICAgICB0aGlzLlZpZXdwb3J0VG9DYW52YXMoY2xpcFNwYWNlVmVydGljZXNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsaXBTcGFjZVZlcnRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTY2FsZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKj0gdHJhbnNmb3JtLnNjYWxlLng7XHJcbiAgICAgICAgdmVydGV4LnkgKj0gdHJhbnNmb3JtLnNjYWxlLnk7XHJcbiAgICAgICAgdmVydGV4LnogKj0gdHJhbnNmb3JtLnNjYWxlLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJvdGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgZXVsZXJBbmdsZXMgPSB0cmFuc2Zvcm0ucm90YXRpb24uZXVsZXJBbmdsZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvc1ggPSBNYXRoLmNvcyhldWxlckFuZ2xlcy54KTtcclxuICAgICAgICBjb25zdCBzaW5YID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueCk7XHJcbiAgICAgICAgY29uc3QgY29zWSA9IE1hdGguY29zKGV1bGVyQW5nbGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IHNpblkgPSBNYXRoLnNpbihldWxlckFuZ2xlcy55KTtcclxuICAgICAgICBjb25zdCBjb3NaID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueik7XHJcbiAgICAgICAgY29uc3Qgc2luWiA9IE1hdGguc2luKGV1bGVyQW5nbGVzLnopO1xyXG4gICAgICAgIC8vIOWFiOe7lVrovbTml4vovaxcclxuICAgICAgICBjb25zdCB4ID0gdmVydGV4LnggKiBjb3NaIC0gdmVydGV4LnkgKiBzaW5aO1xyXG4gICAgICAgIGNvbnN0IHkgPSB2ZXJ0ZXgueCAqIHNpblogKyB2ZXJ0ZXgueSAqIGNvc1o7XHJcbiAgICAgICAgdmVydGV4LnggPSB4O1xyXG4gICAgICAgIHZlcnRleC55ID0geTtcclxuICAgICAgICAvLyDlho3nu5VZ6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeiA9IHZlcnRleC56ICogY29zWSAtIHZlcnRleC54ICogc2luWTtcclxuICAgICAgICBjb25zdCB4MiA9IHZlcnRleC56ICogc2luWSArIHZlcnRleC54ICogY29zWTtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHo7XHJcbiAgICAgICAgdmVydGV4LnggPSB4MjtcclxuICAgICAgICAvLyDmnIDlkI7nu5VY6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeTIgPSB2ZXJ0ZXgueSAqIGNvc1ggLSB2ZXJ0ZXgueiAqIHNpblg7XHJcbiAgICAgICAgY29uc3QgejIgPSB2ZXJ0ZXgueSAqIHNpblggKyB2ZXJ0ZXgueiAqIGNvc1g7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5MjtcclxuICAgICAgICB2ZXJ0ZXgueiA9IHoyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUcmFuc2xhdGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZlcnRleC54ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZlcnRleC55ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi55O1xyXG4gICAgICAgIHZlcnRleC56ICs9IHRyYW5zZm9ybS5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDliZTpmaToo4HliapcclxuXHJcbiAgICAvLyDop4bplKXkvZPliZTpmaRcclxuICAgIHB1YmxpYyBGcnVzdHVtQ3VsbGluZygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6IOM6Z2i5YmU6ZmkXHJcbiAgICBwdWJsaWMgQmFja2ZhY2VDdWxsaW5nKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyDpga7mjKHliZTpmaRcclxuICAgIHB1YmxpYyBPY2NsdXNpb25DdWxsaW5nKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ2xpcFRyaWFuZ2xlKHRyaWFuZ2xlOiBWZWN0b3IzW10pIHtcclxuICAgICAgICAvLyAxLuiuoeeul+S4ieinkuW9oueahOS4reW/g1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAodHJpYW5nbGVbMF0ueCArIHRyaWFuZ2xlWzFdLnggKyB0cmlhbmdsZVsyXS54KSAvIDMsXHJcbiAgICAgICAgICAgICh0cmlhbmdsZVswXS55ICsgdHJpYW5nbGVbMV0ueSArIHRyaWFuZ2xlWzJdLnkpIC8gMyxcclxuICAgICAgICAgICAgKHRyaWFuZ2xlWzBdLnogKyB0cmlhbmdsZVsxXS56ICsgdHJpYW5nbGVbMl0ueikgLyAzXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g57uY5Yi254mp5L2TXHJcblxyXG4gICAgcHVibGljIERyYXdPYmplY3QocmVuZGVyZXI6IFJlbmRlcmVyKSB7XHJcbiAgICAgICAgY29uc3QgbWVzaCA9IChyZW5kZXJlciBhcyBNZXNoUmVuZGVyZXIpLm1lc2g7XHJcbiAgICAgICAgaWYgKCFtZXNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRyaWFuZ2xlcyA9IG1lc2gudHJpYW5nbGVzO1xyXG5cclxuICAgICAgICAvLyAxLuWJlOmZpFxyXG4gICAgICAgIHRoaXMuRnJ1c3R1bUN1bGxpbmcoKTtcclxuICAgICAgICB0aGlzLkJhY2tmYWNlQ3VsbGluZygpO1xyXG4gICAgICAgIHRoaXMuT2NjbHVzaW9uQ3VsbGluZygpO1xyXG5cclxuICAgICAgICAvLyAyLuWPmOaNolxyXG4gICAgICAgIC8vIE1WUOWPmOaNolxyXG4gICAgICAgIGNvbnN0IHNjcmVlblZlcnRpY2VzID0gdGhpcy5WZXJ0ZXhQcm9jZXNzaW5nU3RhZ2UobWVzaC52ZXJ0aWNlcywgcmVuZGVyZXIudHJhbnNmb3JtKTtcclxuICAgICAgICAvLyDnroDljZVNVlDlj5jmjaJcclxuICAgICAgICAvLyBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IHRoaXMuRWFzeVZlcnRleFByb2Nlc3NpbmdTdGFnZShvYmopO1xyXG5cclxuICAgICAgICAvLyAzLuijgeWJqlxyXG5cclxuICAgICAgICAvLyA0LuWFieagheWMluS4juWDj+e0oOe7mOeUu1xyXG4gICAgICAgIC8vIOacgOWQjue7mOWItuS4ieinkuW9ouWIsOWxj+W5leS4ilxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAxID0gc2NyZWVuVmVydGljZXNbdHJpYW5nbGVzW2ldXTtcclxuICAgICAgICAgICAgY29uc3QgcDIgPSBzY3JlZW5WZXJ0aWNlc1t0cmlhbmdsZXNbaSArIDFdXTtcclxuICAgICAgICAgICAgY29uc3QgcDMgPSBzY3JlZW5WZXJ0aWNlc1t0cmlhbmdsZXNbaSArIDJdXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOe6v+ahhuaooeW8j++8jOaaguS4jeaUr+aMgemhtueCueiJslxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuV2lyZWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZShwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAxLngsIHAxLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAyLngsIHAyLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5VVikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDFfdXYgPSBtZXNoLnV2W3RyaWFuZ2xlc1tpXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMl91diA9IG1lc2gudXZbdHJpYW5nbGVzW2kgKyAxXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwM191diA9IG1lc2gudXZbdHJpYW5nbGVzW2kgKyAyXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMV9jb2xvciA9IG5ldyBDb2xvcihwMV91di54ICogMjU1LCBwMV91di55ICogMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDJfY29sb3IgPSBuZXcgQ29sb3IocDJfdXYueCAqIDI1NSwgcDJfdXYueSAqIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAzX2NvbG9yID0gbmV3IENvbG9yKHAzX3V2LnggKiAyNTUsIHAzX3V2LnkgKiAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcihwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBwMV9jb2xvciwgcDJfY29sb3IsIHAzX2NvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5Ob3JtYWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAxX25vcm1hbCA9IHRoaXMuT2JqZWN0VG9Xb3JsZE5vcm1hbChtZXNoLm5vcm1hbHNbdHJpYW5nbGVzW2ldXSwgcmVuZGVyZXIudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAyX25vcm1hbCA9IHRoaXMuT2JqZWN0VG9Xb3JsZE5vcm1hbChtZXNoLm5vcm1hbHNbdHJpYW5nbGVzW2kgKyAxXV0sIHJlbmRlcmVyLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwM19ub3JtYWwgPSB0aGlzLk9iamVjdFRvV29ybGROb3JtYWwobWVzaC5ub3JtYWxzW3RyaWFuZ2xlc1tpICsgMl1dLCByZW5kZXJlci50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgLy8g5bCG5rOV57q/5YiG6YeP5LuOIFstMSwgMV0g5pig5bCE5YiwIFswLCAyNTVdXHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IE1hdGguZmxvb3IoKHAxX25vcm1hbC54ICsgMSkgKiAwLjUgKiAyNTUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGcgPSBNYXRoLmZsb29yKChwMV9ub3JtYWwueSArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGxldCBiID0gTWF0aC5mbG9vcigocDFfbm9ybWFsLnogKyAxKSAqIDAuNSAqIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMV9jb2xvciA9IG5ldyBDb2xvcihyLCBnLCBiKS5Ub1VpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgciA9IE1hdGguZmxvb3IoKHAyX25vcm1hbC54ICsgMSkgKiAwLjUgKiAyNTUpO1xyXG4gICAgICAgICAgICAgICAgZyA9IE1hdGguZmxvb3IoKHAyX25vcm1hbC55ICsgMSkgKiAwLjUgKiAyNTUpO1xyXG4gICAgICAgICAgICAgICAgYiA9IE1hdGguZmxvb3IoKHAyX25vcm1hbC56ICsgMSkgKiAwLjUgKiAyNTUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDJfY29sb3IgPSBuZXcgQ29sb3IociwgZywgYikuVG9VaW50MzIoKTtcclxuICAgICAgICAgICAgICAgIHIgPSBNYXRoLmZsb29yKChwM19ub3JtYWwueCArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGcgPSBNYXRoLmZsb29yKChwM19ub3JtYWwueSArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGIgPSBNYXRoLmZsb29yKChwM19ub3JtYWwueiArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAzX2NvbG9yID0gbmV3IENvbG9yKHIsIGcsIGIpLlRvVWludDMyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcihwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBwMV9jb2xvciwgcDJfY29sb3IsIHAzX2NvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyYXdNb2RlID09PSBEcmF3TW9kZS5TaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1RyaWFuZ2xlRmlsbGVkKHAxLngsIHAxLnksIHAyLngsIHAyLnksIHAzLngsIHAzLnksIENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5bel5YW35Ye95pWwXHJcblxyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIOe6v+aAp+aPkuWAvFxyXG4gICAgLy8vIOS8oOWFpTLkuKrngrnvvIzov5Tlm57lroPku6znu4TmiJDnur/mrrXnmoTmj5LlgLzjgIJcclxuICAgIC8vLyDopoHmsYLvvJpcclxuICAgIC8vLyAxLiDopoHlhYjnrpflh7rnm7Tnur/lgY/msLTlubPov5jmmK/lnoLnm7TvvIzlpoLmnpzmmK/lgY/msLTlubPvvIjmlpznjoflsI/kuo4x77yJ77yM5YiZ5LuleOS4uuW+queOr++8jOS8oOWFpemhuuW6j+aYryh4MSx5MSx4Mix5MinvvIzlj43kuYvlpoLmnpznm7Tnur/lgY/lnoLnm7TvvIzliJnmmK8oeTEseDEseTIseDIpXHJcbiAgICAvLy8gMi4g5ZCM5pe26KaB56Gu5L+d57q/5q6154K555qE5pa55ZCR5piv5LuO5bem5b6A5Y+z5oiW5LuO5LiK5b6A5LiL77yM5L6L5aaC57q/5q615piv5YGP5rC05bmz55qE6K+d77yM6KaB56Gu5L+deDI+eDHvvIzlpoLmnpzmmK/lgY/lnoLnm7TnmoTor53vvIzopoHnoa7kv515Mj55MVxyXG4gICAgLy8vIOS4vuS4quS+i+WtkO+8mlxyXG4gICAgLy8vIOeCuSgwLCAwKeWSjCgyLDEp77yM5Lyg5YWl55qE5Y+C5pWw5pivKDAsIDAsIDIsIDEp77yM6L+U5Zue55qE5pivKCgyLTApKzE9MynkuKrlgLzvvIzov5nkupvlgLzmmK/ku44oMC0xKeS4remXtOaPkuWAvOeahO+8jOWNsygwLCAwLjUsIDEpXHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgcHJpdmF0ZSBJbnRlcnBvbGF0ZShhMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMjogbnVtYmVyLCBiMjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj+S7pemBv+WFjeWKqOaAgeaJqeWuuVxyXG4gICAgICAgIC8vIGNvbnN0IGR4ID0gTWF0aC5hYnMoTWF0aC5mbG9vcihhMiAtIGExKSk7XHJcbiAgICAgICAgY29uc3QgZHggPSAoKGEyID4gYTEgPyBhMiAtIGExIDogYTEgLSBhMikgfCAwKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBBcnJheShkeCArIDEpO1xyXG4gICAgICAgIGNvbnN0IGEgPSAoYjIgLSBiMSkgLyAoYTIgLSBhMSk7XHJcbiAgICAgICAgbGV0IGQgPSBiMTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICB2YWx1ZVtpXSA9IGQ7XHJcbiAgICAgICAgICAgIGQgKz0gYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59IiwiaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4uL0NvbXBvbmVudC9DYW1lcmFcIjtcclxuaW1wb3J0IHsgQ2FtZXJhQ29udHJvbGxlciB9IGZyb20gXCIuLi9Db21wb25lbnQvQ2FtZXJhQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tIFwiLi4vQ29tcG9uZW50L01lc2hSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQXNzZXRMb2FkZXIgfSBmcm9tIFwiLi4vVXRpbHMvQXNzZXRMb2FkZXJcIjtcclxuaW1wb3J0IHsgU2NlbmUgfSBmcm9tIFwiLi9TY2VuZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IE1haW5TY2VuZSA9IHtcclxuICAgIG5hbWU6IFwiTWFpblNjZW5lXCIsXHJcbiAgICBpbml0ZnVuOiAoc2NlbmU6IFNjZW5lKSA9PiB7XHJcbiAgICAgICAgLy8g55u45py6XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IEdhbWVPYmplY3QoXCJjYW1lcmFcIik7XHJcbiAgICAgICAgc2NlbmUuYWRkR2FtZU9iamVjdChjYW1lcmEpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoQ2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuYWRkQ29tcG9uZW50KENhbWVyYUNvbnRyb2xsZXIpO1xyXG5cclxuICAgICAgICBsZXQgb2JqOiBHYW1lT2JqZWN0O1xyXG4gICAgICAgIC8vIOWKoOi9veaooeWei1xyXG4gICAgICAgIEFzc2V0TG9hZGVyLmxvYWRNb2RlbCgncmVzb3VyY2VzL2ZlbWFsZTAyL2ZlbWFsZTAyLm9iaicsIDAuMDEpLnRoZW4oKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgIG9iaiA9IG5ldyBHYW1lT2JqZWN0KFwibWFsZTAyXCIpO1xyXG4gICAgICAgICAgICBvYmoudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMik7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVyID0gb2JqLmFkZENvbXBvbmVudChNZXNoUmVuZGVyZXIpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5tZXNoID0gbW9kZWw7XHJcbiAgICAgICAgICAgIC8vbGVlLmFkZENvbXBvbmVudChPYmpSb3RhdGUpO1xyXG4gICAgICAgICAgICBzY2VuZS5hZGRHYW1lT2JqZWN0KG9iaik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEFzc2V0TG9hZGVyLmxvYWRNb2RlbCgncmVzb3VyY2VzL2N1YmUub2JqJykudGhlbigobW9kZWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY3ViZSA9IG5ldyBHYW1lT2JqZWN0KFwiY3ViZVwiKTtcclxuICAgICAgICAgICAgY3ViZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygyLCAwLCAwKTtcclxuICAgICAgICAgICAgY3ViZS50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yMygwLjEsIDAuMSwgMC4xKTtcclxuICAgICAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBjdWJlLmFkZENvbXBvbmVudChNZXNoUmVuZGVyZXIpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5tZXNoID0gbW9kZWw7XHJcbiAgICAgICAgICAgIC8vY3ViZS5hZGRDb21wb25lbnQoT2JqUm90YXRlKTtcclxuICAgICAgICAgICAgY3ViZS50cmFuc2Zvcm0uc2V0UGFyZW50KG9iai50cmFuc2Zvcm0sIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vR2FtZU9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJvb3RHYW1lT2JqZWN0czogR2FtZU9iamVjdFtdID0gW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBhZGRHYW1lT2JqZWN0KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJvb3RHYW1lT2JqZWN0cy5wdXNoKGdhbWVPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgcmVtb3ZlR2FtZU9iamVjdChnYW1lT2JqZWN0OiBHYW1lT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJvb3RHYW1lT2JqZWN0cy5pbmRleE9mKGdhbWVPYmplY3QpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290R2FtZU9iamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSb290R2FtZU9iamVjdHMoKTogR2FtZU9iamVjdFtdIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMucm9vdEdhbWVPYmplY3RzXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmm7TmlrDmiYDmnInmoLnmuLjmiI/lr7nosaHlj4rlhbblrZDlr7nosaFcclxuICAgICAgICBmb3IgKGNvbnN0IGdhbWVPYmplY3Qgb2YgdGhpcy5yb290R2FtZU9iamVjdHMpIHtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdC5zdGFydENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdC51cGRhdGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU2NlbmUgfSBmcm9tIFwiLi9TY2VuZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcbiAgICBwcml2YXRlIHNjZW5lczogTWFwPHN0cmluZywgU2NlbmU+ID0gbmV3IE1hcDxzdHJpbmcsIFNjZW5lPigpO1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVTY2VuZTogU2NlbmUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU2NlbmUobmFtZTogc3RyaW5nKTogU2NlbmUge1xyXG4gICAgICAgIGNvbnN0IHNjZW5lID0gbmV3IFNjZW5lKG5hbWUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLnNldChuYW1lLCBzY2VuZSk7XHJcbiAgICAgICAgcmV0dXJuIHNjZW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTY2VuZShuYW1lOiBzdHJpbmcpOiBTY2VuZSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NlbmVzLmdldChuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QWN0aXZlU2NlbmUoc2NlbmU6IFNjZW5lIHwgc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzY2VuZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRTY2VuZSA9IHRoaXMuc2NlbmVzLmdldChzY2VuZSk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZFNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVNjZW5lID0gZm91bmRTY2VuZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEFjdGl2ZVNjZW5lKCk6IFNjZW5lIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlU2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFjdGl2ZVNjZW5lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVNjZW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkU2NlbmUoZGF0YTogYW55KSB7XHJcbiAgICAgICAgaWYgKCFkYXRhLm5hbWUgfHwgIWRhdGEuaW5pdGZ1bikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDliJ3lp4vljJblnLrmma9cclxuICAgICAgICBjb25zdCBtYWluU2NlbmUgPSB0aGlzLmNyZWF0ZVNjZW5lKGRhdGEubmFtZSk7XHJcbiAgICAgICAgZGF0YS5pbml0ZnVuKG1haW5TY2VuZSk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVTY2VuZShtYWluU2NlbmUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL0dhbWVPYmplY3RcIjtcclxuaW1wb3J0IHsgTWF0cml4NHg0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaXg0eDRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVPYmplY3Q6IEdhbWVPYmplY3Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IEFycmF5PFRyYW5zZm9ybT47XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50OiBUcmFuc2Zvcm0gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RlbXBQb3M6IFZlY3RvcjM7XHJcbiAgICBwcml2YXRlIF90ZW1wUm90OiBRdWF0ZXJuaW9uO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFNjYWxlOiBWZWN0b3IzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgQXJyYXk8VHJhbnNmb3JtPigpO1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdGVtcFBvcyA9IFZlY3RvcjMuWkVSTztcclxuICAgICAgICB0aGlzLl90ZW1wUm90ID0gUXVhdGVybmlvbi5pZGVudGl0eTtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBWZWN0b3IzLk9ORTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGZNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICByZXR1cm4gTWF0cml4NHg0LmdldFRSU01hdHJpeCh0aGlzLl90ZW1wUG9zLCB0aGlzLl90ZW1wUm90LCB0aGlzLl90ZW1wU2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbG9jYWxUb1dvcmxkTWF0cml4KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubG9jYWxUb1dvcmxkTWF0cml4IDogTWF0cml4NHg0LmlkZW50aXR5O1xyXG4gICAgICAgIHJldHVybiBwLm11bHRpcGx5KHRoaXMuc2VsZk1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFRvTG9jYWxNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC53b3JsZFRvTG9jYWxNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZk1hdHJpeC5pbnZlcnNlKCkubXVsdGlwbHkocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB4KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHgoeDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB5KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHkoeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB6KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHooejogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnogPSB6O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmb3J3YXJkKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8v5oiR5Lus6KaB5b6X5Yiw55qE5piv5LiA5Liq5pa55ZCR77yM5Zug5q2k5LiN6ZyA6KaB5L2N572u5L+h5oGv77yM5bCG6b2Q5qyh5Z2Q5qCH55qEd+iuvue9ruS4ujDvvIzmipvlvIPmjonlnZDmoIfkv6Hmga9cclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuRk9SV0FSRCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1cCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuVVAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmlnaHQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvV29ybGRTcGFjZShWZWN0b3IzLlJJR0hULCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUG9zLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwb3NpdGlvbihwb3M6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRQb3NpdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdGlvbigpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcFJvdC5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24ocTogUXVhdGVybmlvbikge1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbigpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wU2NhbGUuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNjYWxlKHM6IFZlY3RvcjMpIHtcclxuICAgICAgICB0aGlzLl90ZW1wU2NhbGUgPSBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRTY2FsZSgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXguZ2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBUcmFuc2Zvcm0gfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQocGFyZW50OiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAocGFyZW50ICE9IG51bGwgJiYgcGFyZW50ICE9IHRoaXMgJiYgcGFyZW50ICE9IHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77ya54i26IqC54K55piv5b2T5YmN6IqC54K555qE5a2Q6IqC54K577yM5bCG5a2Q6IqC55qE6K6+572u5Li66Ieq5bex55qE54i26IqC54K577yM5Lya5q275b6q546vXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzUGFyZW50KHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNldCBwYXJlbnQsIHRoaXMgbm9kZSBpcyB0aGUgcGFyZW50IG5vZGUncyBwYXJlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOW9k+WJjeiKgueCueacieeItuiKgueCue+8jOimgeWFiOenu+mZpOaXp+eahFxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBhcmVudCA9PSBudWxsICYmIHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/oioLngrlw5piv5ZCm5piv5b2T5YmN6IqC54K555qE5LiK57qnXHJcbiAgICBwdWJsaWMgaGFzUGFyZW50KHA6IFRyYW5zZm9ybSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgPT0gcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGFzUGFyZW50KHApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9IHRoaXMgJiYgIXRoaXMuY2hpbGRyZW4uaW5jbHVkZXMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIC8v6Ziy5q2i5Ye6546w77yaY2hpbGToioLngrnmmK/lvZPliY3oioLngrnnmoTniLboioLngrnvvIzlsIbniLboioLnmoTorr7nva7kuLroh6rlt7HnmoTlrZDoioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGFyZW50KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2hpbGQsIHRoaXMgbm9kZSBpcyB0aGUgY2hpbGQgbm9kZSdzIGNoaWxkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzlrZDoioLngrnmnInml6fnmoTniLboioLngrnvvIzopoHlhYjnp7vpmaRcclxuICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQsIHdvcmxkUG9zaXRpb25TdGF5cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnljp/kuJbnlYzlnZDmoIfkvY3nva7vvIzlhYjmnJ3niLboioLngrnnmoTlj5jmjaLnmoTlj43mlrnlkJHnp7vliqjvvIznhLblkI7lho3mt7vliqDov5vljrvvvIzlsLHog73kv53mjIHkuJbnlYzlnZDmoIfkuI3lj5hcclxuICAgICAgICAgICAgICAgIC8v5Y2z5Y+Y5o2i5Yiw54i26IqC54K555qE6YCG55+p6Zi16YeMXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5KGNoaWxkLnNlbGZNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBQb3MgPSBtLmdldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBSb3QgPSBtLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuX3RlbXBTY2FsZSA9IG0uZ2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUNoaWxkKGNoaWxkOiBUcmFuc2Zvcm0sIHdvcmxkUG9zaXRpb25TdGF5czogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQsIDApO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHdvcmxkUG9zaXRpb25TdGF5cykge1xyXG4gICAgICAgICAgICAgICAgLy/kv53nlZnkuJbnlYzlnZDmoIfvvIznm7TmjqXlsIbmnKzlnLDlnZDmoIfnrYnlkIzkuo7lvZPliY3kuJbnlYzlnZDmoIfljbPlj69cclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Ob2RlU3BhY2UodjogVmVjdG9yMywgdzogbnVtYmVyID0gMSk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICrlsIbmn5DkuKrlnZDmoIfovazliLDoh6rlt7HnmoTlsYDpg6jnqbrpl7TvvIzkvovlpoLlvZPliY3nmoTlsYDpg6jlnZDmoIfljp/ngrnlnKjkuJbnlYzlnZDmoIfnmoTvvIgx77yMMe+8ieWkhFxyXG4gICAgICAgICAq54K5cOWcqOS4lueVjOWdkOagh++8iDLvvIwx77yJ5aSE77yM6YKj5LmI5bCG54K5cOebuOWvueS6juW9k+WJjeWxgOmDqOWdkOagh+ezu+eahOS9jee9ruWwseaYr++8iDLvvIwx77yJLe+8iDHvvIwx77yJPSDvvIgx77yMIDDvvIlcclxuICAgICAgICAgKuWNs+WwhueCuXDlj43lkJHlj5jmjaLlvZPliY3nmoTnn6npmLUgXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIHRoaXMud29ybGRUb0xvY2FsTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2LCB3KSkudmVjdG9yMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29udmVydFRvV29ybGRTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxUb1dvcmxkTWF0cml4Lm11bHRpcGx5VmVjdG9yNChuZXcgVmVjdG9yNCh2LCB3KSkudmVjdG9yMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveShkZXN0cm95Q2hpbGRyZW46IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKGRlc3Ryb3lDaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveShkZXN0cm95Q2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTWVzaCB9IGZyb20gXCIuLi9NZXNoXCI7XHJcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tIFwiLi9EaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IE9CSlBhcnNlciB9IGZyb20gXCIuL09ialBhcnNlci50c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0TG9hZGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZpbGVDYWNoZTogRGljdGlvbmFyeSA9IG5ldyBEaWN0aW9uYXJ5KCk7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkSW1hZ2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4oKHJlc29sdmUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChBc3NldExvYWRlci5maWxlQ2FjaGUuaGFzKGZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShBc3NldExvYWRlci5maWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHRoZSBpbWFnZSBvYmplY3QnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIG9uIGxvYWRpbmcgYW4gaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCBpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOi3qOWMuuivt+axglxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY3Jvc3NPcmlnaW4gPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRlbGwgdGhlIGJyb3dzZXIgdG8gbG9hZCBhbiBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZU5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRUZXh0RmlsZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRMb2FkZXIuZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgcmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOS4jeimgeW8gOWQr+W8guatpe+8jOiuvue9ruS4umZhbHNl77yM5ZCm5YiZ5a655piT5Y2h5ZyocmVhZHlTdGF0ZSA9IDHvvIzljp/lm6DkuI3mmI5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRNb2RlbChtb2RlbFBhdGg6IHN0cmluZywgc2NhbGU6IG51bWJlciA9IDEpOiBQcm9taXNlPE1lc2ggfCBudWxsPiB7XHJcbiAgICAgICAgbGV0IG1vZGVsOiBNZXNoIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgdmFyIG9iakRvYyA9IGF3YWl0IEFzc2V0TG9hZGVyLmxvYWRUZXh0RmlsZShtb2RlbFBhdGgpO1xyXG4gICAgICAgIGlmIChvYmpEb2MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBtb2RlbCA9IE9CSlBhcnNlci5wYXJzZShvYmpEb2MsIHNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xyXG5cclxuICBpdGVtczogb2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSB7fTtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcclxuICAgIHRoaXMuaXRlbXNba2V5XSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuaXRlbXNba2V5XSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5pdGVtc1trXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGZ1bikge1xyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgIGZ1bihrLCB0aGlzLml0ZW1zW2tdKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyBNZXNoIH0gZnJvbSBcIi4uL01lc2hcIjtcclxuaW1wb3J0IHsgU3ViTWVzaCB9IGZyb20gXCIuLi9NZXNoXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3I0XCI7XHJcbmltcG9ydCB7IEJvdW5kcyB9IGZyb20gXCIuLi9NYXRoL0JvdW5kc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9CSlBhcnNlciB7XHJcbiAgICAvKipcclxuICAgICAqIOino+aekE9CSuaWh+S7tuWGheWuueW5tueUn+aIkE1lc2jlr7nosaFcclxuICAgICAqIEBwYXJhbSBjb250ZW50IE9CSuaWh+S7tueahOaWh+acrOWGheWuuVxyXG4gICAgICogQHBhcmFtIHNjYWxlIOaooeWei+e8qeaUvuavlOS+i++8jOm7mOiupDEuMFxyXG4gICAgICogQHJldHVybnMg6Kej5p6Q5ZCO55qETWVzaOWvueixoVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFyc2UoY29udGVudDogc3RyaW5nLCBzY2FsZTogbnVtYmVyID0gMSk6IE1lc2gge1xyXG4gICAgICAgIGNvbnN0IG1lc2ggPSBuZXcgTWVzaCgpO1xyXG4gICAgICAgIG1lc2gudmVydGljZXMgPSBbXTtcclxuICAgICAgICBtZXNoLnV2ID0gW107XHJcbiAgICAgICAgbWVzaC5ub3JtYWxzID0gW107XHJcbiAgICAgICAgbWVzaC50YW5nZW50cyA9IFtdO1xyXG4gICAgICAgIG1lc2gudHJpYW5nbGVzID0gW107XHJcbiAgICAgICAgbWVzaC5ib3VuZHMgPSBbXTtcclxuICAgICAgICBtZXNoLnN1Yk1lc2hlcyA9IFtdO1xyXG5cclxuICAgICAgICAvLyDkuLTml7blrZjlgqhPQkrmlofku7bkuK3nmoTljp/lp4vmlbDmja7vvIjntKLlvJXku44x5byA5aeL77yJXHJcbiAgICAgICAgY29uc3QgdGVtcFZlcnRpY2VzOiBWZWN0b3IzW10gPSBbXTtcclxuICAgICAgICBjb25zdCB0ZW1wVXZzOiBWZWN0b3IyW10gPSBbXTtcclxuICAgICAgICBjb25zdCB0ZW1wTm9ybWFsczogVmVjdG9yM1tdID0gW107XHJcblxyXG4gICAgICAgIC8vIOmhtueCuee0ouW8leaYoOWwhOihqO+8mueUqOS6juWOu+mHjSAo5qC85byPOiBcInZJbmRleC92dEluZGV4L3ZuSW5kZXhcIiA9PiDlkIjlubblkI7nmoTntKLlvJUpXHJcbiAgICAgICAgY29uc3QgdmVydGV4TWFwID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuXHJcbiAgICAgICAgLy8g5oyJ6KGM5YiG5Ymy5YaF5a655bm25aSE55CGXHJcbiAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRTdWJNZXNoOiBTdWJNZXNoIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltbWVkTGluZSA9IGxpbmUudHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIXRyaW1tZWRMaW5lIHx8IHRyaW1tZWRMaW5lLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIOi3s+i/h+epuuihjOWSjOazqOmHilxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWRMaW5lLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBwYXJ0c1swXTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHBhcnRzLnNsaWNlKDEpO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd2JzogLy8g6aG254K55Z2Q5qCHICh4LCB5LCB6KSAtIOW6lOeUqOe8qeaUvlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBWZXJ0aWNlcy5wdXNoKG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzBdKSAqIHNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzFdKSAqIHNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzJdKSAqIHNjYWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd2dCc6IC8vIOe6ueeQhuWdkOaghyAodSwgdilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wVXZzLnB1c2gobmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGRhdGFbMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSAtIHBhcnNlRmxvYXQoZGF0YVsxXSkgLy8g57+76L2sVui9tFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndm4nOiAvLyDms5Xnur8gKHgsIHksIHopXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE5vcm1hbHMucHVzaChuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoZGF0YVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGRhdGFbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZyc6IC8vIOWkhOeQhue7hOaMh+S7pO+8jOWIm+W7uuaWsOeahOWtkOe9keagvFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7k+eul+W9k+WJjeWtkOe9keagvFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3ViTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC52ZXJ0ZXhDb3VudCA9IG1lc2gudmVydGljZXMubGVuZ3RoIC0gY3VycmVudFN1Yk1lc2guZmlyc3RWZXJ0ZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLmluZGV4Q291bnQgPSBtZXNoLnRyaWFuZ2xlcy5sZW5ndGggLSBjdXJyZW50U3ViTWVzaC5pbmRleFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7rmlrDlrZDnvZHmoLxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaCA9IG5ldyBTdWJNZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2guZmlyc3RWZXJ0ZXggPSBtZXNoLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5pbmRleFN0YXJ0ID0gbWVzaC50cmlhbmdsZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5pbmRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5ib3VuZHMgPSBuZXcgQm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzaC5zdWJNZXNoZXMucHVzaChjdXJyZW50U3ViTWVzaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZic6IC8vIOmdolxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA8IDMpIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJblvZPliY3lrZDnvZHmoLzvvIjlpoLmnpzmsqHmnInvvIlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRTdWJNZXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoID0gbmV3IFN1Yk1lc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2guZmlyc3RWZXJ0ZXggPSBtZXNoLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2guaW5kZXhTdGFydCA9IG1lc2gudHJpYW5nbGVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2gudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5pbmRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2guYm91bmRzID0gbmV3IEJvdW5kcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoLnN1Yk1lc2hlcy5wdXNoKGN1cnJlbnRTdWJNZXNoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhumdoueahOmhtueCueaVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2VWZXJ0aWNlcyA9IGRhdGEubWFwKHZlcnRleFN0ciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSB2ZXJ0ZXhTdHIuc3BsaXQoJy8nKS5tYXAoaWR4ID0+IHBhcnNlSW50KGlkeCkgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2OiBpbmRpY2VzWzBdIC0gMSwgLy8g6L2s5o2i5Li6MOWfuue0ouW8lVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdnQ6IGluZGljZXNbMV0gLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm46IGluZGljZXNbMl0gLSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhuS4ieinkuW9ouWMluWSjOmhtueCueWOu+mHjVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgZmFjZVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFswLCBpIC0gMSwgaV0uZm9yRWFjaChpZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB2LCB2dCwgdm4gfSA9IGZhY2VWZXJ0aWNlc1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuWUr+S4gOagh+ivhumUrlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7diA+PSAwID8gdiA6IC0xfS8ke3Z0ID49IDAgPyB2dCA6IC0xfS8ke3ZuID49IDAgPyB2biA6IC0xfWA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleE1hcC5oYXMoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkjeeUqOW3suWtmOWcqOeahOmhtueCuee0ouW8lVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gudHJpYW5nbGVzLnB1c2godmVydGV4TWFwLmdldChrZXkpISk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa3u+WKoOaWsOmhtueCueaVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0luZGV4ID0gbWVzaC52ZXJ0aWNlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4TWFwLnNldChrZXksIG5ld0luZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6aG254K55pWw5o2uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzaC52ZXJ0aWNlcy5wdXNoKHYgPj0gMCAmJiB2IDwgdGVtcFZlcnRpY2VzLmxlbmd0aCA/IHRlbXBWZXJ0aWNlc1t2XSA6IG5ldyBWZWN0b3IzKDAsIDAsIDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVVbmlbDmja5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNoLnV2LnB1c2godnQgPj0gMCAmJiB2dCA8IHRlbXBVdnMubGVuZ3RoID8gdGVtcFV2c1t2dF0gOiBuZXcgVmVjdG9yMigwLCAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOazlee6v+aVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gubm9ybWFscy5wdXNoKHZuID49IDAgJiYgdm4gPCB0ZW1wTm9ybWFscy5sZW5ndGggPyB0ZW1wTm9ybWFsc1t2bl0gOiBuZXcgVmVjdG9yMygwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWFiOWIneWni+WMluWIh+e6v+S4uumbtuWQkemHj++8jOWQjue7reS8muiuoeeul1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gudGFuZ2VudHMucHVzaChuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa3u+WKoOe0ouW8lVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gudHJpYW5nbGVzLnB1c2gobmV3SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOabtOaWsOWtkOe9keagvOS/oeaBr1xyXG4gICAgICAgIG1lc2guc3ViTWVzaGVzLmZvckVhY2goc3ViTWVzaCA9PiB7XHJcbiAgICAgICAgICAgIHN1Yk1lc2gudmVydGV4Q291bnQgPSBtZXNoLnZlcnRpY2VzLmxlbmd0aCAtIHN1Yk1lc2guZmlyc3RWZXJ0ZXg7XHJcbiAgICAgICAgICAgIHN1Yk1lc2guaW5kZXhDb3VudCA9IG1lc2gudHJpYW5nbGVzLmxlbmd0aCAtIHN1Yk1lc2guaW5kZXhTdGFydDtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+WtkOe9keagvOWMheWbtOebklxyXG4gICAgICAgICAgICBjb25zdCBzdWJWZXJ0aWNlcyA9IG1lc2gudmVydGljZXMuc2xpY2UoXHJcbiAgICAgICAgICAgICAgICBzdWJNZXNoLmZpcnN0VmVydGV4LFxyXG4gICAgICAgICAgICAgICAgc3ViTWVzaC5maXJzdFZlcnRleCArIHN1Yk1lc2gudmVydGV4Q291bnRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgc3ViTWVzaC5ib3VuZHMgPSBCb3VuZHMuZnJvbVBvaW50cyhzdWJWZXJ0aWNlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+WIh+e6v+WQkemHj1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVGFuZ2VudHMobWVzaCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+aVtOS9k+WMheWbtOebklxyXG4gICAgICAgIG1lc2guYm91bmRzID0gbWVzaC5zdWJNZXNoZXMubWFwKHNtID0+IHNtLmJvdW5kcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6h566X572R5qC855qE5YiH57q/5ZCR6YePXHJcbiAgICAgKiDln7rkuo7pobbngrnkvY3nva7jgIFVVuWSjOS4ieinkuW9oue0ouW8leiuoeeul1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVUYW5nZW50cyhtZXNoOiBNZXNoKSB7XHJcbiAgICAgICAgaWYgKG1lc2gudmVydGljZXMubGVuZ3RoID09PSAwIHx8IG1lc2gudHJpYW5nbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyDkuLTml7bmlbDnu4TlrZjlgqjmr4/kuKrpobbngrnnmoTliIfnur/orqHnrpfmlbDmja5cclxuICAgICAgICBjb25zdCB0YW4xID0gbmV3IEFycmF5KG1lc2gudmVydGljZXMubGVuZ3RoKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgVmVjdG9yMygwLCAwLCAwKSk7XHJcbiAgICAgICAgY29uc3QgdGFuMiA9IG5ldyBBcnJheShtZXNoLnZlcnRpY2VzLmxlbmd0aCkuZmlsbCgwKS5tYXAoKCkgPT4gbmV3IFZlY3RvcjMoMCwgMCwgMCkpO1xyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInkuInop5LlvaJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gudHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkwID0gbWVzaC50cmlhbmdsZXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGkxID0gbWVzaC50cmlhbmdsZXNbaSArIDFdO1xyXG4gICAgICAgICAgICBjb25zdCBpMiA9IG1lc2gudHJpYW5nbGVzW2kgKyAyXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiOt+WPluS4ieinkuW9oueahOS4ieS4qumhtueCuVxyXG4gICAgICAgICAgICBjb25zdCB2MCA9IG1lc2gudmVydGljZXNbaTBdO1xyXG4gICAgICAgICAgICBjb25zdCB2MSA9IG1lc2gudmVydGljZXNbaTFdO1xyXG4gICAgICAgICAgICBjb25zdCB2MiA9IG1lc2gudmVydGljZXNbaTJdO1xyXG5cclxuICAgICAgICAgICAgLy8g6I635Y+W5a+55bqU55qEVVblnZDmoIdcclxuICAgICAgICAgICAgY29uc3QgdzAgPSBtZXNoLnV2W2kwXTtcclxuICAgICAgICAgICAgY29uc3QgdzEgPSBtZXNoLnV2W2kxXTtcclxuICAgICAgICAgICAgY29uc3QgdzIgPSBtZXNoLnV2W2kyXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+i+ueWQkemHj1xyXG4gICAgICAgICAgICBjb25zdCB4MSA9IHYxLnggLSB2MC54O1xyXG4gICAgICAgICAgICBjb25zdCB5MSA9IHYxLnkgLSB2MC55O1xyXG4gICAgICAgICAgICBjb25zdCB6MSA9IHYxLnogLSB2MC56O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeDIgPSB2Mi54IC0gdjAueDtcclxuICAgICAgICAgICAgY29uc3QgeTIgPSB2Mi55IC0gdjAueTtcclxuICAgICAgICAgICAgY29uc3QgejIgPSB2Mi56IC0gdjAuejtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul1VW5beu5YC8XHJcbiAgICAgICAgICAgIGNvbnN0IHMxID0gdzEueCAtIHcwLng7XHJcbiAgICAgICAgICAgIGNvbnN0IHQxID0gdzEueSAtIHcwLnk7XHJcbiAgICAgICAgICAgIGNvbnN0IHMyID0gdzIueCAtIHcwLng7XHJcbiAgICAgICAgICAgIGNvbnN0IHQyID0gdzIueSAtIHcwLnk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfliIfnur/lkJHph49cclxuICAgICAgICAgICAgY29uc3QgciA9IDEuMCAvIChzMSAqIHQyIC0gczIgKiB0MSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gKHQyICogeDEgLSB0MSAqIHgyKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gKHQyICogeTEgLSB0MSAqIHkyKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IHR6ID0gKHQyICogejEgLSB0MSAqIHoyKSAqIHI7XHJcblxyXG4gICAgICAgICAgICAvLyDntK/liqDliIfnur/mlbDmja5cclxuICAgICAgICAgICAgdGFuMVtpMF0ueCArPSB0eDtcclxuICAgICAgICAgICAgdGFuMVtpMF0ueSArPSB0eTtcclxuICAgICAgICAgICAgdGFuMVtpMF0ueiArPSB0ejtcclxuXHJcbiAgICAgICAgICAgIHRhbjFbaTFdLnggKz0gdHg7XHJcbiAgICAgICAgICAgIHRhbjFbaTFdLnkgKz0gdHk7XHJcbiAgICAgICAgICAgIHRhbjFbaTFdLnogKz0gdHo7XHJcblxyXG4gICAgICAgICAgICB0YW4xW2kyXS54ICs9IHR4O1xyXG4gICAgICAgICAgICB0YW4xW2kyXS55ICs9IHR5O1xyXG4gICAgICAgICAgICB0YW4xW2kyXS56ICs9IHR6O1xyXG5cclxuICAgICAgICAgICAgLy8g6K6h566X5Ymv5YiH57q/5ZCR6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGJ4ID0gKHMxICogeDIgLSBzMiAqIHgxKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5ID0gKHMxICogeTIgLSBzMiAqIHkxKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ6ID0gKHMxICogejIgLSBzMiAqIHoxKSAqIHI7XHJcblxyXG4gICAgICAgICAgICB0YW4yW2kwXS54ICs9IGJ4O1xyXG4gICAgICAgICAgICB0YW4yW2kwXS55ICs9IGJ5O1xyXG4gICAgICAgICAgICB0YW4yW2kwXS56ICs9IGJ6O1xyXG5cclxuICAgICAgICAgICAgdGFuMltpMV0ueCArPSBieDtcclxuICAgICAgICAgICAgdGFuMltpMV0ueSArPSBieTtcclxuICAgICAgICAgICAgdGFuMltpMV0ueiArPSBiejtcclxuXHJcbiAgICAgICAgICAgIHRhbjJbaTJdLnggKz0gYng7XHJcbiAgICAgICAgICAgIHRhbjJbaTJdLnkgKz0gYnk7XHJcbiAgICAgICAgICAgIHRhbjJbaTJdLnogKz0gYno7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDorqHnrpfmnIDnu4jliIfnur/lubbop4TojIPljJZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gudmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbiA9IG1lc2gubm9ybWFsc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgdCA9IHRhbjFbaV07XHJcblxyXG4gICAgICAgICAgICAvLyDmraPkuqTljJbliIfnur/vvIhHcmFtLVNjaG1pZHTov4fnqIvvvIlcclxuICAgICAgICAgICAgY29uc3QgdGFuZ2VudCA9IFZlY3RvcjMuc3VidHJhY3QodCwgVmVjdG9yMy5tdWx0aXBseShuLCBWZWN0b3IzLmRvdChuLCB0KSkpLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g6K6h566X5YiH57q/5pa55ZCR77yIIGhhbmRlZG5lc3Mg77yJXHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRlZG5lc3MgPSBWZWN0b3IzLmRvdChWZWN0b3IzLmNyb3NzKG4sIHQpLCB0YW4yW2ldKSA8IDAuMCA/IC0xIDogMTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWtmOWCqOWIh+e6v++8iHfliIbph4/ooajnpLrmlrnlkJHvvIlcclxuICAgICAgICAgICAgbWVzaC50YW5nZW50c1tpXSA9IG5ldyBWZWN0b3I0KHRhbmdlbnQueCwgdGFuZ2VudC55LCB0YW5nZW50LnosIGhhbmRlZG5lc3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9FbmdpbmVcIjtcclxuXHJcbi8vIOW9k0RPTeWGheWuueWKoOi9veWujOaIkOWQjuaJp+ihjFxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8g5Yid5aeL5YyW5byV5pOOXHJcbiAgICBFbmdpbmUuSW5pdCgpO1xyXG5cclxuICAgIC8vIOS4u+W+queOr1xyXG4gICAgZnVuY3Rpb24gbWFpbkxvb3AoKSB7XHJcbiAgICAgICAgLy8g5aSE55CG6YC76L6RXHJcbiAgICAgICAgRW5naW5lLlVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIEVuZ2luZS5SZW5kZXIoKTtcclxuICAgICAgICAvLyDlsY/luZXovpPlh7rml6Xlv5dcclxuICAgICAgICBMb2dnZXIucHJpbnRMb2dzKCk7XHJcbiAgICAgICAgLy8g6K+35rGC5LiL5LiA5bin5Yqo55S7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxuICAgIH1cclxuICAgIC8vIOW8gOWni+WKqOeUu+W+queOr1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxufSk7Il19
