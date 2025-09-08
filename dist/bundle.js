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
},{"../Color":1,"../Engine":8,"../Math/Vector4":17,"./Component":4}],3:[function(require,module,exports){
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
        _this.dragSpeed = 0.3;
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
        // WSADQE+SHIFT相机移动以及加速
        this._velocity.x = -Input_1.Input.GetAxis(Input_1.InputAxis.Horizontal);
        this._velocity.z = Input_1.Input.GetAxis(Input_1.InputAxis.Vertical);
        this._velocity.y = Input_1.Input.GetKey(Input_1.Input.KeyCode.Q) ? -1 : Input_1.Input.GetKey(Input_1.Input.KeyCode.E) ? 1 : 0;
        this._speedScale = Input_1.Input.GetKey(Input_1.Input.KeyCode.Shift) ? this.moveSpeedShiftScale : 1;
        // 鼠标中键相机拖动
        if (Input_1.Input.GetMouseButton(1)) {
            var moveDelta = Input_1.Input.mouseDelta;
            //TODO:这里应该是托多少就移动多少，而不是乘一个系数
            this._velocity.x += moveDelta.x * this.dragSpeed;
            this._velocity.y += moveDelta.y * this.dragSpeed;
        }
        // 鼠标滚轮相机缩放
        var scrollDelta = -Input_1.Input.mouseScrollDelta.y * this.moveSpeed * 0.1;
        var pos = this.transform.rotation.transformQuat(Vector3_1.Vector3.FORWARD);
        this._position = this.scaleAndAdd(this.transform.position, pos, scrollDelta);
        // 鼠标右键相机旋转
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
        // ALT+鼠标左键相机绕中心点旋转
        if (Input_1.Input.GetKey(Input_1.Input.KeyCode.Alt) && Input_1.Input.GetMouseButton(0)) {
            var moveDelta = Input_1.Input.mouseDelta;
        }
    };
    CameraController.prototype.scaleAndAdd = function (a, b, scale) {
        var out = new Vector3_1.Vector3();
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
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
    return CameraController;
}(Component_1.Component));
exports.CameraController = CameraController;
},{"../Engine":8,"../Input":10,"../Math/Quaternion":14,"../Math/Vector3":16,"./Component":4}],4:[function(require,module,exports){
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
},{"./Renderer":7}],6:[function(require,module,exports){
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
        _this.angleX = 0;
        _this.angleY = 0;
        return _this;
    }
    ObjRotate.prototype.update = function () {
        // // 键盘输入
        // const horizontalInput = Input.GetAxis(InputAxis.Horizontal);
        // const verticalInput = Input.GetAxis(InputAxis.Vertical);
        // this.angleX += verticalInput;
        // this.angleY += horizontalInput;
        // this.transform.rotation = new Quaternion(new Vector3(this.angleX, this.angleY, 0));
        // // 鼠标滚轮
        // if (Input.mouseScrollDelta.y !== 0) {
        //     // 缩放
        //     const zoomFactor = Input.mouseScrollDelta.y > 0 ? 0.9 : 1.1;
        //     const sacle = this.transform.scale;
        //     sacle.multiply(zoomFactor);
        //     this.transform.scale = sacle;
        // }
        this.transform.rotation = new Quaternion_1.Quaternion(new Vector3_1.Vector3(this.angleX, this.angleY, 0));
        this.angleY += 1;
    };
    return ObjRotate;
}(Component_1.Component));
exports.ObjRotate = ObjRotate;
},{"../Math/Quaternion":14,"../Math/Vector3":16,"./Component":4}],7:[function(require,module,exports){
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
},{"./Component":4}],8:[function(require,module,exports){
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
},{"./Input":10,"./RasterizationPipeline":19,"./Scene/MainScene":20,"./Scene/SceneManager":22}],9:[function(require,module,exports){
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
},{"./Transfrom":23}],10:[function(require,module,exports){
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
},{"./Math/Vector2":15}],11:[function(require,module,exports){
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
},{"./Engine":8}],12:[function(require,module,exports){
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
},{"./Vector3":16}],13:[function(require,module,exports){
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
},{"./Quaternion":14,"./Vector3":16,"./Vector4":17}],14:[function(require,module,exports){
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
},{"./Matrix4x4":13,"./Vector3":16}],15:[function(require,module,exports){
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
},{"./Vector3":16,"./Vector4":17}],16:[function(require,module,exports){
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
},{"./Vector2":15,"./Vector4":17}],17:[function(require,module,exports){
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
},{"./Vector2":15,"./Vector3":16}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{"./Color":1,"./Component/Camera":2,"./Component/Renderer":7,"./Engine":8,"./Logger":11,"./Math/Vector2":15,"./Math/Vector3":16,"./Math/Vector4":17}],20:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.MainScene = void 0;
var Camera_1 = require("../Component/Camera");
var CameraController_1 = require("../Component/CameraController");
var MeshRenderer_1 = require("../Component/MeshRenderer");
var ObjRotate_1 = require("../Component/ObjRotate");
var GameObject_1 = require("../GameObject");
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
var AssetLoader_1 = require("../Utils/AssetLoader");
exports.MainScene = {
    name: "MainScene",
    initfun: function (scene) {
        // 相机
        var camera = new GameObject_1.GameObject("camera");
        camera.transform.rotation = new Quaternion_1.Quaternion(new Vector3_1.Vector3(45, 0, 0));
        camera.transform.position = new Vector3_1.Vector3(0, 3, -3);
        scene.addGameObject(camera);
        camera.addComponent(Camera_1.Camera);
        camera.addComponent(CameraController_1.CameraController);
        var obj;
        // 加载模型
        AssetLoader_1.AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then(function (model) {
            obj = new GameObject_1.GameObject("female02");
            var renderer = obj.addComponent(MeshRenderer_1.MeshRenderer);
            renderer.mesh = model;
            obj.addComponent(ObjRotate_1.ObjRotate);
            scene.addGameObject(obj);
        });
        AssetLoader_1.AssetLoader.loadModel('resources/cube.obj').then(function (model) {
            var cube = new GameObject_1.GameObject("cube");
            cube.transform.position = new Vector3_1.Vector3(2, 0, 0);
            cube.transform.scale = new Vector3_1.Vector3(0.1, 0.1, 0.1);
            var renderer = cube.addComponent(MeshRenderer_1.MeshRenderer);
            renderer.mesh = model;
            cube.transform.setParent(obj.transform, false);
        });
    }
};
},{"../Component/Camera":2,"../Component/CameraController":3,"../Component/MeshRenderer":5,"../Component/ObjRotate":6,"../GameObject":9,"../Math/Quaternion":14,"../Math/Vector3":16,"../Utils/AssetLoader":24}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{"./Scene":21}],23:[function(require,module,exports){
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
},{"./Math/Matrix4x4":13,"./Math/Quaternion":14,"./Math/Vector3":16,"./Math/Vector4":17}],24:[function(require,module,exports){
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
},{"./Dictionary":25,"./ObjParser.ts":26}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
        mesh.material = []; // 初始化材质数组
        // 临时存储OBJ文件中的原始数据（索引从1开始）
        var tempVertices = [];
        var tempUvs = [];
        var tempNormals = [];
        // 顶点索引映射表：用于去重 (格式: "vIndex/vtIndex/vnIndex" => 合并后的索引)
        var vertexMap = new Map();
        // 材质相关变量
        var currentMaterial = ""; // 当前使用的材质名称
        var materialSet = new Set(); // 用于收集所有唯一材质
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
                case 'mtllib': // 材质库引用（暂存材质库文件名，实际加载需额外实现）
                    // 这里可以记录材质库文件路径，用于后续加载材质
                    // 示例: const mtlPath = data.join(' ');
                    break;
                case 'usemtl': // 使用材质
                    if (data.length > 0) {
                        currentMaterial = data.join(' '); // 支持带空格的材质名
                        materialSet.add(currentMaterial);
                        if (currentSubMesh) {
                            currentSubMesh.material = currentMaterial; // 关联材质
                        }
                    }
                    break;
                case 'g': // 处理组指令，创建新的子网格
                    // 结算当前子网格
                    if (currentSubMesh) {
                        currentSubMesh.vertexCount = mesh.vertices.length - currentSubMesh.firstVertex;
                        currentSubMesh.indexCount = mesh.triangles.length - currentSubMesh.indexStart;
                    }
                    // 创建新子网格并继承当前材质
                    currentSubMesh = new Mesh_2.SubMesh();
                    currentSubMesh.firstVertex = mesh.vertices.length;
                    currentSubMesh.indexStart = mesh.triangles.length;
                    currentSubMesh.vertexCount = 0;
                    currentSubMesh.indexCount = 0;
                    currentSubMesh.bounds = new Bounds_1.Bounds();
                    currentSubMesh.material = currentMaterial; // 继承当前材质
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
                        currentSubMesh.material = currentMaterial; // 使用当前材质
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
                            // 创建唯一标识键 (处理可能的负数索引和默认值)
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
        // 收集所有材质到mesh.material数组
        mesh.material = Array.from(materialSet);
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
},{"../Math/Bounds":12,"../Math/Vector2":15,"../Math/Vector3":16,"../Math/Vector4":17,"../Mesh":18}],27:[function(require,module,exports){
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
},{"./Engine":8,"./Logger":11}]},{},[27])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvQ29tcG9uZW50L0NhbWVyYS50cyIsInNyYy9Db21wb25lbnQvQ2FtZXJhQ29udHJvbGxlci50cyIsInNyYy9Db21wb25lbnQvQ29tcG9uZW50LnRzIiwic3JjL0NvbXBvbmVudC9NZXNoUmVuZGVyZXIudHMiLCJzcmMvQ29tcG9uZW50L09ialJvdGF0ZS50cyIsInNyYy9Db21wb25lbnQvUmVuZGVyZXIudHMiLCJzcmMvRW5naW5lLnRzIiwic3JjL0dhbWVPYmplY3QudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTG9nZ2VyLnRzIiwic3JjL01hdGgvQm91bmRzLnRzIiwic3JjL01hdGgvTWF0cml4NHg0LnRzIiwic3JjL01hdGgvUXVhdGVybmlvbi50cyIsInNyYy9NYXRoL1ZlY3RvcjIudHMiLCJzcmMvTWF0aC9WZWN0b3IzLnRzIiwic3JjL01hdGgvVmVjdG9yNC50cyIsInNyYy9NZXNoLnRzIiwic3JjL1Jhc3Rlcml6YXRpb25QaXBlbGluZS50cyIsInNyYy9TY2VuZS9NYWluU2NlbmUudHMiLCJzcmMvU2NlbmUvU2NlbmUudHMiLCJzcmMvU2NlbmUvU2NlbmVNYW5hZ2VyLnRzIiwic3JjL1RyYW5zZnJvbS50cyIsInNyYy9VdGlscy9Bc3NldExvYWRlci50cyIsInNyYy9VdGlscy9EaWN0aW9uYXJ5LnRzIiwic3JjL1V0aWxzL09ialBhcnNlci50cyIsInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBO0lBa0JJLGVBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBZTtRQUFmLGtCQUFBLEVBQUEsT0FBZTtRQUN4RCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENB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LENBQUM7UUFDbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxtQ0FBZSxHQUF0QixVQUF1QixDQUFVO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTSxnQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUU3QixnREFBZ0Q7SUFDaEQsZ0dBQWdHO0lBQ2hHLGdEQUFnRDtJQUVoRCxtRkFBbUY7SUFDbkYsSUFBSTtJQUVHLDZCQUFTLEdBQWhCO1FBQ0ksc0JBQXNCO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7UUFDN0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsMkJBQTJCO1lBQ3ZDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNKO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFDSSxpRUFBaUU7UUFDakUsZ0NBQWdDO1FBQ2hDLGdEQUFnRDtRQUNoRCxZQUFZO1FBRVosSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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UUFFdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVMsR0FBaEI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMs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LENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNqRixJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDJCQUFPLEdBQWQ7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXRCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNuQyxJQUFNLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ25DLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM1RCxlQUFlO1NBQ2xCO1FBRUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDNUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUM1RCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBRTNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxpQ0FBYSxHQUFwQjtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsMEJBQTBCO1FBQzFCLE9BQU8sSUFBSSxZQUFZLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0seUJBQUssR0FBWjtRQUNJLE9BQU8sSUFBSSxTQUFTLENBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2pCLENBQUM7SUFDTixDQUFDO0lBRUQ7O09BRUc7SUFFVyxzQkFBWSxHQUExQixVQUEyQixHQUFZLEVBQUUsSUFBZ0IsRUFBRSxLQUFjO1FBQ3JFLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QyxtREFBbUQ7UUFDbkQsaURBQWlEO1FBQ2pELDBEQUEwRDtRQUMxRCx3REFBd0Q7UUFDeEQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRWEsNEJBQWtCLEdBQWhDLFVBQWlDLEdBQVk7UUFDekMsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLHFDQUEyQixHQUF6QyxVQUEwQyxDQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFD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QUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QixLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQzlCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2QsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNULENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ1QsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRWEsd0JBQWMsR0FBNUIsVUFBNkIsQ0FBVTtRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FB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UyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUlELDBCQUFRLEdBQVI7UUFDSSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxPQUFPLEVBQUU7WUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDBCQUFRLEdBQWYsVUFBZ0IsQ0FBUztRQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFD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QUMsRUFBRSxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLGFBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMzQztpQkFDSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkUsSUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZFLElBQU0sUUFBUSxHQUFHLElBQUksYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2RSxJQUFJLENBQUMsaUNBQWlDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM1RztpQkFDSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDeEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMzRixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMvRixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMvRiw4QkFBOEI7Z0JBQzlCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2xELElBQU0sUUFBUSxHQUFHLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQy9DLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLElBQU0sUUFBUSxHQUFHLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQy9DLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLElBQU0sUUFBUSxHQUFHLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxD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QUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVqQyxhQUFhO1lBQ2IsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFN0IsWUFBWTtZQUNaLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXZCLFFBQVE7WUFDUixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUV2QixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUV2QixTQUFTO1lBQ1QsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXZCLFNBQVM7WUFDVCxJQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwQyxJQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxJQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxJQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVuQyxTQUFTO1lBQ1QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFakIsVUFBVTtZQUNWLElBQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLElBQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLElBQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5DLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBRUQsYUFBYTtRQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQix3QkFBd0I7WUFDeEIsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLGlCQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXhGLHVCQUF1QjtZQUN2QixJQUFNLFVBQVUsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVFLGdCQUFnQjtZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksaUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUMvRTtJQUNMLENBQUM7SUFDTCxnQkFBQztBQUFELENBaFNBLEFBZ1NDLElBQUE7QUFoU1ksOEJBQVM7Ozs7QUNQdEIsbUNBQWtDO0FBQ2xDLG1DQUFrQztBQUVsQyxnQkFBZ0I7QUFDaEIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBQzFDLFFBQVE7SUFDUixlQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxNQUFNO0lBQ04sU0FBUyxRQUFRO1FBQ2IsT0FBTztRQUNQLGVBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixLQUFLO1FBQ0wsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLFNBQVM7UUFDVCxlQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsVUFBVTtRQUNWLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxTQUFTO0lBQ1QscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBXSElURSA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTEFDSyA9IG5ldyBDb2xvcigwLCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkFZID0gbmV3IENvbG9yKDEyOCwgMTI4LCAxMjgpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFRCA9IG5ldyBDb2xvcigyNTUsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSRUVOID0gbmV3IENvbG9yKDAsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxVRSA9IG5ldyBDb2xvcigwLCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFlFTExPVyA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1lBTiA9IG5ldyBDb2xvcigwLCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFHRU5UQSA9IG5ldyBDb2xvcigyNTUsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT1JBTkdFID0gbmV3IENvbG9yKDI1NSwgMTY1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVVJQTEUgPSBuZXcgQ29sb3IoMTI4LCAwLCAxMjgpLlRvVWludDMyKCk7XHJcblxyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG4gICAgcHVibGljIGE6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgPSAyNTUpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBUb1VpbnQzMigpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuYSA8PCAyNCkgfCAodGhpcy5iIDw8IDE2KSB8ICh0aGlzLmcgPDwgOCkgfCB0aGlzLnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGcm9tVWludDMyKHVpbnQzMjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgdWludDMyICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiA4KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMTYpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAyNCkgJiAweEZGXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4uL0NvbG9yXCI7XHJcbmltcG9ydCB7IEVuZ2luZUNvbmZpZyB9IGZyb20gXCIuLi9FbmdpbmVcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFDbGVhckZsYWdzIHtcclxuICAgIE5PTkUgPSAwLFxyXG4gICAgQUxMID0gMTYzODQgfCAyNTYsXHJcbiAgICBDb2xvciA9IDE2Mzg0LCAgLy9nbC5DT0xPUl9CVUZGRVJfQklUXHJcbiAgICBEZXB0aCA9IDI1NiwgICAgLy9nbC5ERVBUSF9CVUZGRVJfQklUXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIHN0YXRpYyBtYWluQ2FtZXJhOiBDYW1lcmE7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBjYW1lcmFzOiBBcnJheTxDYW1lcmE+ID0gbmV3IEFycmF5PENhbWVyYT4oKTtcclxuXHJcbiAgICBwdWJsaWMgYmFja0dyb3VuZENvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigwLjI3LCAwLjI3LCAwLjI3LCAxLjApO1xyXG4gICAgcHVibGljIGZvZ0NvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigwLjI3LCAwLjI3LCAwLjI3LCAxLjApO1xyXG4gICAgcHVibGljIGNsZWFyRmxhZ3M6IENhbWVyYUNsZWFyRmxhZ3MgPSBDYW1lcmFDbGVhckZsYWdzLkNvbG9yIHwgQ2FtZXJhQ2xlYXJGbGFncy5EZXB0aDtcclxuICAgIHB1YmxpYyBuZWFyQ2xpcDogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBmYXJDbGlwOiBudW1iZXIgPSAxMjg7XHJcbiAgICBwdWJsaWMgZm92OiBudW1iZXIgPSA2MDtcclxuICAgIHB1YmxpYyBkZXB0aDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyB2aWV3UG9ydDogVmVjdG9yNCA9IG5ldyBWZWN0b3I0KDAsIDAsIDEsIDEpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYXNwZWN0KCk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHYgPSB0aGlzLnZpZXdQb3J0O1xyXG4gICAgICAgIHJldHVybiAodi56ICogRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoKSAvICh2LncgKiBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXdha2UoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKENhbWVyYS5tYWluQ2FtZXJhID09IG51bGwpIHtcclxuICAgICAgICAgICAgQ2FtZXJhLm1haW5DYW1lcmEgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBDYW1lcmEuY2FtZXJhcy5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gQ2FtZXJhLmNhbWVyYXMuaW5kZXhPZih0aGlzLCAwKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBDYW1lcmEuY2FtZXJhcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKENhbWVyYS5tYWluQ2FtZXJhID09IHRoaXMpIHtcclxuICAgICAgICAgICAgaWYgKENhbWVyYS5jYW1lcmFzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBDYW1lcmEubWFpbkNhbWVyYSA9IENhbWVyYS5jYW1lcmFzWzBdO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBDYW1lcmEubWFpbkNhbWVyYSA9IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIENhbWVyYTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vRW5naW5lXCI7XHJcbmltcG9ydCB7IElucHV0LCBJbnB1dEF4aXMgfSBmcm9tIFwiLi4vSW5wdXRcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuLi9NYXRoL1F1YXRlcm5pb25cIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhQ29udHJvbGxlciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgbW92ZVNwZWVkID0gMC41O1xyXG4gICAgcHVibGljIG1vdmVTcGVlZFNoaWZ0U2NhbGUgPSAyLjU7XHJcbiAgICBwdWJsaWMgZHJhZ1NwZWVkID0gMC4zO1xyXG4gICAgcHVibGljIGRhbXAgPSAwLjI7XHJcbiAgICBwdWJsaWMgcm90YXRlU3BlZWQgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgX2V1bGVyID0gbmV3IFZlY3RvcjMoKTtcclxuICAgIHByaXZhdGUgX3ZlbG9jaXR5ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IFZlY3RvcjMoKTtcclxuICAgIHByaXZhdGUgX3NwZWVkU2NhbGUgPSAxO1xyXG4gICAgcHJpdmF0ZSBfcm90YXRlQ2FtZXJhID0gZmFsc2U7XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5fZXVsZXIgPSB0aGlzLnRyYW5zZm9ybS5yb3RhdGlvbi5ldWxlckFuZ2xlcztcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMudHJhbnNmb3JtLnBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUlucHV0KCkge1xyXG4gICAgICAgIC8vIFdTQURRRStTSElGVOebuOacuuenu+WKqOS7peWPiuWKoOmAn1xyXG4gICAgICAgIHRoaXMuX3ZlbG9jaXR5LnggPSAtSW5wdXQuR2V0QXhpcyhJbnB1dEF4aXMuSG9yaXpvbnRhbCk7XHJcbiAgICAgICAgdGhpcy5fdmVsb2NpdHkueiA9IElucHV0LkdldEF4aXMoSW5wdXRBeGlzLlZlcnRpY2FsKTtcclxuICAgICAgICB0aGlzLl92ZWxvY2l0eS55ID0gSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuUSkgPyAtMSA6IElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLkUpID8gMSA6IDA7XHJcbiAgICAgICAgdGhpcy5fc3BlZWRTY2FsZSA9IElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLlNoaWZ0KSA/IHRoaXMubW92ZVNwZWVkU2hpZnRTY2FsZSA6IDE7XHJcblxyXG4gICAgICAgIC8vIOm8oOagh+S4remUruebuOacuuaLluWKqFxyXG4gICAgICAgIGlmIChJbnB1dC5HZXRNb3VzZUJ1dHRvbigxKSkge1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSBJbnB1dC5tb3VzZURlbHRhO1xyXG4gICAgICAgICAgICAvL1RPRE866L+Z6YeM5bqU6K+l5piv5omY5aSa5bCR5bCx56e75Yqo5aSa5bCR77yM6ICM5LiN5piv5LmY5LiA5Liq57O75pWwXHJcbiAgICAgICAgICAgIHRoaXMuX3ZlbG9jaXR5LnggKz0gbW92ZURlbHRhLnggKiB0aGlzLmRyYWdTcGVlZDtcclxuICAgICAgICAgICAgdGhpcy5fdmVsb2NpdHkueSArPSBtb3ZlRGVsdGEueSAqIHRoaXMuZHJhZ1NwZWVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6byg5qCH5rua6L2u55u45py657yp5pS+XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsRGVsdGEgPSAtSW5wdXQubW91c2VTY3JvbGxEZWx0YS55ICogdGhpcy5tb3ZlU3BlZWQgKiAwLjE7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uLnRyYW5zZm9ybVF1YXQoVmVjdG9yMy5GT1JXQVJEKTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMuc2NhbGVBbmRBZGQodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24sIHBvcywgc2Nyb2xsRGVsdGEpO1xyXG5cclxuICAgICAgICAvLyDpvKDmoIflj7PplK7nm7jmnLrml4vovaxcclxuICAgICAgICBpZiAoSW5wdXQuR2V0TW91c2VCdXR0b25Eb3duKDIpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0ZUNhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChJbnB1dC5HZXRNb3VzZUJ1dHRvblVwKDIpKSB7XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5leGl0UG9pbnRlckxvY2spIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG4gICAgICAgICAgICB0aGlzLl9yb3RhdGVDYW1lcmEgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0ZUNhbWVyYSkge1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSBJbnB1dC5tb3VzZURlbHRhO1xyXG4gICAgICAgICAgICB0aGlzLl9ldWxlci55IC09IG1vdmVEZWx0YS54ICogdGhpcy5yb3RhdGVTcGVlZCAqIDAuMTtcclxuICAgICAgICAgICAgdGhpcy5fZXVsZXIueCArPSBtb3ZlRGVsdGEueSAqIHRoaXMucm90YXRlU3BlZWQgKiAwLjE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBTFQr6byg5qCH5bem6ZSu55u45py657uV5Lit5b+D54K55peL6L2sXHJcbiAgICAgICAgaWYoSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuQWx0KSAmJiBJbnB1dC5HZXRNb3VzZUJ1dHRvbigwKSkge1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSBJbnB1dC5tb3VzZURlbHRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzY2FsZUFuZEFkZChhOiBWZWN0b3IzLCBiOiBWZWN0b3IzLCBzY2FsZTogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIG91dCA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKyBiLnggKiBzY2FsZTtcclxuICAgICAgICBvdXQueSA9IGEueSArIGIueSAqIHNjYWxlO1xyXG4gICAgICAgIG91dC56ID0gYS56ICsgYi56ICogc2NhbGU7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJbnB1dCgpO1xyXG5cclxuICAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgICAgIHZhciB2ID0gdGhpcy50cmFuc2Zvcm0ucm90YXRpb24udHJhbnNmb3JtUXVhdCh0aGlzLl92ZWxvY2l0eSk7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB0aGlzLnNjYWxlQW5kQWRkKHRoaXMuX3Bvc2l0aW9uLCB2LCB0aGlzLm1vdmVTcGVlZCAqIHRoaXMuX3NwZWVkU2NhbGUpO1xyXG4gICAgICAgIHYgPSBWZWN0b3IzLmxlcnAodGhpcy50cmFuc2Zvcm0ucG9zaXRpb24sIHRoaXMuX3Bvc2l0aW9uLCBFbmdpbmUuZGVsdGFUaW1lIC8gdGhpcy5kYW1wKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5wb3NpdGlvbiA9IHY7XHJcblxyXG4gICAgICAgIC8vIHJvdGF0aW9uXHJcbiAgICAgICAgdmFyIHEgPSBuZXcgUXVhdGVybmlvbihuZXcgVmVjdG9yMyh0aGlzLl9ldWxlci54LCB0aGlzLl9ldWxlci55LCB0aGlzLl9ldWxlci56KSk7XHJcbiAgICAgICAgcSA9IFF1YXRlcm5pb24uc2xlcnAodGhpcy50cmFuc2Zvcm0ucm90YXRpb24sIHEsIEVuZ2luZS5kZWx0YVRpbWUgLyB0aGlzLmRhbXApO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtLnJvdGF0aW9uID0gcTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vVHJhbnNmcm9tXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyByZWFkb25seSBnYW1lT2JqZWN0OiBHYW1lT2JqZWN0O1xyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHRyYW5zZm9ybSgpOiBUcmFuc2Zvcm0ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVPYmplY3QudHJhbnNmb3JtO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgZW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkVuYWJsZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25EaXNhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3QgPSBnYW1lT2JqZWN0O1xyXG4gICAgICAgIHRoaXMuYXdha2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlJ/lkb3lkajmnJ/mlrnms5VcclxuICAgIC8vIOW9k+e7hOS7tuiiq+WIm+W7uuaXtuiwg+eUqFxyXG4gICAgcHVibGljIGF3YWtlKCk6IHZvaWQge31cclxuICAgIFxyXG4gICAgLy8g5Zyo5ZCv55So57uE5Lu255qE56ys5LiA5bin6LCD55SoXHJcbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDmr4/luKfmm7TmlrDliY3osIPnlKhcclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDmr4/luKfmm7TmlrDlkI7osIPnlKhcclxuICAgIC8vcHVibGljIGxhdGVVcGRhdGUoKTogdm9pZCB7fVxyXG4gICAgXHJcbiAgICAvLyDlvZPnu4Tku7booqvlkK/nlKjml7bosIPnlKhcclxuICAgIHB1YmxpYyBvbkVuYWJsZSgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOW9k+e7hOS7tuiiq+emgeeUqOaXtuiwg+eUqFxyXG4gICAgcHVibGljIG9uRGlzYWJsZSgpOiB2b2lkIHt9XHJcbiAgICBcclxuICAgIC8vIOW9k+e7hOS7tuiiq+mUgOavgeaXtuiwg+eUqFxyXG4gICAgcHVibGljIG9uRGVzdHJveSgpOiB2b2lkIHt9XHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gXCIuL1JlbmRlcmVyXCI7XHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tIFwiLi4vTWVzaFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc2hSZW5kZXJlciBleHRlbmRzIFJlbmRlcmVyIHtcclxuICAgIHByaXZhdGUgX21lc2g6IE1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvLyDnvZHmoLzlsZ7mgKdcclxuICAgIHB1YmxpYyBnZXQgbWVzaCgpOiBNZXNoIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtZXNoKHZhbHVlOiBNZXNoIHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX21lc2ggPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5a6e546w5riy5p+T5pa55rOVXHJcbiAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOa4suafk+mAu+i+keWwhueUsVJhc3Rlcml6YXRpb25QaXBlbGluZeiwg+eUqFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgLy8g5riF55CG6LWE5rqQXHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IG51bGw7XHJcbiAgICAgICAgc3VwZXIubWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSW5wdXQsIElucHV0QXhpcyB9IGZyb20gXCIuLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4uL01hdGgvUXVhdGVybmlvblwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPYmpSb3RhdGUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHJpdmF0ZSBhbmdsZVggPSAwO1xyXG4gICAgcHJpdmF0ZSBhbmdsZVkgPSAwO1xyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gLy8g6ZSu55uY6L6T5YWlXHJcbiAgICAgICAgLy8gY29uc3QgaG9yaXpvbnRhbElucHV0ID0gSW5wdXQuR2V0QXhpcyhJbnB1dEF4aXMuSG9yaXpvbnRhbCk7XHJcbiAgICAgICAgLy8gY29uc3QgdmVydGljYWxJbnB1dCA9IElucHV0LkdldEF4aXMoSW5wdXRBeGlzLlZlcnRpY2FsKTtcclxuICAgICAgICAvLyB0aGlzLmFuZ2xlWCArPSB2ZXJ0aWNhbElucHV0O1xyXG4gICAgICAgIC8vIHRoaXMuYW5nbGVZICs9IGhvcml6b250YWxJbnB1dDtcclxuICAgICAgICAvLyB0aGlzLnRyYW5zZm9ybS5yb3RhdGlvbiA9IG5ldyBRdWF0ZXJuaW9uKG5ldyBWZWN0b3IzKHRoaXMuYW5nbGVYLCB0aGlzLmFuZ2xlWSwgMCkpO1xyXG5cclxuICAgICAgICAvLyAvLyDpvKDmoIfmu5rova5cclxuICAgICAgICAvLyBpZiAoSW5wdXQubW91c2VTY3JvbGxEZWx0YS55ICE9PSAwKSB7XHJcbiAgICAgICAgLy8gICAgIC8vIOe8qeaUvlxyXG4gICAgICAgIC8vICAgICBjb25zdCB6b29tRmFjdG9yID0gSW5wdXQubW91c2VTY3JvbGxEZWx0YS55ID4gMCA/IDAuOSA6IDEuMTtcclxuICAgICAgICAvLyAgICAgY29uc3Qgc2FjbGUgPSB0aGlzLnRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAvLyAgICAgc2FjbGUubXVsdGlwbHkoem9vbUZhY3Rvcik7XHJcbiAgICAgICAgLy8gICAgIHRoaXMudHJhbnNmb3JtLnNjYWxlID0gc2FjbGU7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5yb3RhdGlvbiA9IG5ldyBRdWF0ZXJuaW9uKG5ldyBWZWN0b3IzKHRoaXMuYW5nbGVYLCB0aGlzLmFuZ2xlWSwgMCkpO1xyXG4gICAgICAgIHRoaXMuYW5nbGVZICs9IDE7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tIFwiLi4vTWF0ZXJpYWxcIjtcclxuaW1wb3J0IHsgQm91bmRzIH0gZnJvbSBcIi4uL01hdGgvQm91bmRzXCI7XHJcblxyXG4vLyBSZW5kZXJlcuaYr+aJgOaciea4suafk+e7hOS7tueahOWfuuexu1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHJpdmF0ZSBfYm91bmRzOiBCb3VuZHM7XHJcbiAgICBwcml2YXRlIF9tYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3NvcnRpbmdMYXllcklEOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfc29ydGluZ09yZGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY2FzdFNoYWRvd3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSBfcmVjZWl2ZVNoYWRvd3M6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8vIOadkOi0qOWxnuaAp1xyXG4gICAgcHVibGljIGdldCBtYXRlcmlhbCgpOiBNYXRlcmlhbCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldCBtYXRlcmlhbCh2YWx1ZTogTWF0ZXJpYWwgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5o6S5bqP5bGCSURcclxuICAgIHB1YmxpYyBnZXQgc29ydGluZ0xheWVySUQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZ0xheWVySUQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXQgc29ydGluZ0xheWVySUQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NvcnRpbmdMYXllcklEID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOaOkuW6j+mhuuW6j1xyXG4gICAgcHVibGljIGdldCBzb3J0aW5nT3JkZXIoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZ09yZGVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0IHNvcnRpbmdPcmRlcih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc29ydGluZ09yZGVyID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5piv5ZCm5oqV5bCE6Zi05b2xXHJcbiAgICBwdWJsaWMgZ2V0IGNhc3RTaGFkb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYXN0U2hhZG93cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNhc3RTaGFkb3dzKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fY2FzdFNoYWRvd3MgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmmK/lkKbmjqXmlLbpmLTlvbFcclxuICAgIHB1YmxpYyBnZXQgcmVjZWl2ZVNoYWRvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY2VpdmVTaGFkb3dzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcmVjZWl2ZVNoYWRvd3ModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9yZWNlaXZlU2hhZG93cyA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDmmK/lkKblupTor6XooqvmuLLmn5NcclxuICAgIHB1YmxpYyBnZXQgc2hvdWxkUmVuZGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuYWJsZWQgJiYgdGhpcy5nYW1lT2JqZWN0LmFjdGl2ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g5riy5p+T5pa55rOV77yM5a2Q57G76ZyA6KaB5a6e546wXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyKCk6IHZvaWQ7XHJcbn0iLCJpbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL0lucHV0XCI7XHJcbmltcG9ydCB7IFJhc3Rlcml6YXRpb25QaXBlbGluZSB9IGZyb20gXCIuL1Jhc3Rlcml6YXRpb25QaXBlbGluZVwiO1xyXG5pbXBvcnQgeyBNYWluU2NlbmUgfSBmcm9tIFwiLi9TY2VuZS9NYWluU2NlbmVcIjtcclxuaW1wb3J0IHsgU2NlbmVNYW5hZ2VyIH0gZnJvbSBcIi4vU2NlbmUvU2NlbmVNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5naW5lIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2NlbmVNYW5hZ2VyOiBTY2VuZU1hbmFnZXIgPSBuZXcgU2NlbmVNYW5hZ2VyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHB1YmxpYyBzdGF0aWMgZGVsdGFUaW1lOiBudW1iZXIgPSAxIC8gNjA7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBpcGVsaW5lOiBSYXN0ZXJpemF0aW9uUGlwZWxpbmU7XHJcbiAgICBwdWJsaWMgc3RhdGljIGltYWdlRGF0YTogSW1hZ2VEYXRhO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgSW5pdCgpIHtcclxuICAgICAgICAvLyDojrflj5ZjYW52YXPlhYPntKDlkowyROa4suafk+S4iuS4i+aWh1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgICAgIC8vIOiuvue9rmNhbnZhc+WwuuWvuFxyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IEVuZ2luZUNvbmZpZy5jYW52YXNIZWlnaHQ7XHJcbiAgICAgICAgLy8g6K6+572u5paH5pys5qC35byPXHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSAnQXJpYWwnO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcblxyXG4gICAgICAgIC8vIOWIm+W7uuWbvuWDj+aVsOaNruWvueixoVxyXG4gICAgICAgIHRoaXMuaW1hZ2VEYXRhID0gRW5naW5lLmNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aCwgRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICAgICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgICAgICBjb25zdCB1aW50MzJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KHRoaXMuaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuICAgICAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gbmV3IFJhc3Rlcml6YXRpb25QaXBlbGluZSh1aW50MzJWaWV3KTtcclxuXHJcbiAgICAgICAgLy8g5Yid5aeL5YyW5Zy65pmvXHJcbiAgICAgICAgdGhpcy5zY2VuZU1hbmFnZXIubG9hZFNjZW5lKE1haW5TY2VuZSk7XHJcbiAgICAgICAgLy8g5Yid5aeL5YyW6L6T5YWl57O757ufXHJcbiAgICAgICAgSW5wdXQuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgVXBkYXRlKCkge1xyXG4gICAgICAgIC8vIOS9v+eUqOWcuuaZr+eahHVwZGF0ZeaWueazleabtOaWsOaJgOaciea4uOaIj+WvueixoVxyXG4gICAgICAgIHRoaXMuc2NlbmVNYW5hZ2VyLmdldEFjdGl2ZVNjZW5lKCk/LnVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOabtOaWsOi+k+WFpeeKtuaAgSjms6jvvJrovpPlhaXlt7Lnu4/nlLFXRULlvJXmk47lnKjmr4/luKflvIDlp4vkuYvliY3ojrflj5bkuobvvIzov5nph4zmmK/mm7TmlrDovpPlhaXnmoTkuIrkuIDluKfnirbmgIEpXHJcbiAgICAgICAgSW5wdXQudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBSZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5waXBlbGluZS5SZW5kZXIoKTtcclxuICAgICAgICAvLyDlsIblm77lg4/mlbDmja7nu5jliLbliLBjYW52YXPkuIpcclxuICAgICAgICB0aGlzLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVuZ2luZUNvbmZpZyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhc1dpZHRoOiBudW1iZXIgPSA0MDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhc0hlaWdodDogbnVtYmVyID0gNDAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWxmQ2FudmFzV2lkdGg6IG51bWJlciA9IEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aCA+PiAxO1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWxmQ2FudmFzSGVpZ2h0OiBudW1iZXIgPSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0ID4+IDE7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFzcGVjdFJhdGlvOiBudW1iZXIgPSBFbmdpbmVDb25maWcuY2FudmFzV2lkdGggLyBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0O1xyXG59IiwiaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4vVHJhbnNmcm9tXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudC9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL01hdGgvVmVjdG9yM1wiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU9iamVjdCB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG4gICAgcHVibGljIHRhZzogc3RyaW5nID0gXCJVbnRhZ2dlZFwiOyAvLyDmt7vliqDmoIfnrb7lsZ7mgKdcclxuICAgIHB1YmxpYyBsYXllcjogbnVtYmVyID0gMDsgLy8g6buY6K6k5bGCXHJcblxyXG4gICAgcHJpdmF0ZSBjb21wb25lbnRzOiBDb21wb25lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzdGFydGVkQ29tcG9uZW50czogU2V0PENvbXBvbmVudD4gPSBuZXcgU2V0PENvbXBvbmVudD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLy8g6K6+572u5ri45oiP5a+56LGh55qE5r+A5rS754q25oCBXHJcbiAgICBwdWJsaWMgc2V0IGFjdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmUgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgLy8g5aSE55CG57uE5Lu255qE5ZCv55SoL+emgeeUqFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vbkVuYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub25EaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDmo4Dmn6XmuLjmiI/lr7nosaHmmK/lkKblpITkuo7mtLvliqjnirbmgIHvvIjogIPomZHniLblr7nosaHvvIlcclxuICAgIHB1YmxpYyBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIOajgOafpeeItuWvueixoeeahOa/gOa0u+eKtuaAgVxyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRyYW5zZm9ybS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRHYW1lT2JqZWN0ID0gcGFyZW50LmdhbWVPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRHYW1lT2JqZWN0ICYmICFwYXJlbnRHYW1lT2JqZWN0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDosIPnlKjmiYDmnInnu4Tku7bnmoRTdGFydOaWueazle+8iOWmguaenOWwmuacquiwg+eUqO+8iVxyXG4gICAgcHVibGljIHN0YXJ0Q29tcG9uZW50cygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnRlZENvbXBvbmVudHMuaGFzKGNvbXBvbmVudCkgJiYgY29tcG9uZW50LmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydGVkQ29tcG9uZW50cy5hZGQoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YCS5b2S6LCD55So5a2Q5a+56LGh55qEc3RhcnRDb21wb25lbnRzXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZ2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZ2FtZU9iamVjdC5zdGFydENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDmm7TmlrDmiYDmnInnu4Tku7ZcclxuICAgIHB1YmxpYyB1cGRhdGVDb21wb25lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDpgJLlvZLosIPnlKjlrZDlr7nosaHnmoR1cGRhdGVDb21wb25lbnRzXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZ2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZ2FtZU9iamVjdC51cGRhdGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5re75Yqg57uE5Lu2XHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IHsgbmV3KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiBUIH0pOiBUIHtcclxuICAgICAgICB2YXIgY29tcCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgIGlmIChjb21wID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29tcCA9IG5ldyBjb21wb25lbnRUeXBlKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5oyH5a6a57G75Z6L55qE57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IFQgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgYXMgVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bmiYDmnInmjIflrprnsbvlnovnmoTnu4Tku7ZcclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzPFQgZXh0ZW5kcyBDb21wb25lbnQ+KGNvbXBvbmVudFR5cGU6IEZ1bmN0aW9uICYgeyBwcm90b3R5cGU6IFQgfSk6IFRbXSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNvbXBvbmVudCBhcyBUKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluWtkOiKgueCueS4iueahOe7hOS7tlxyXG4gICAgcHVibGljIGdldENvbXBvbmVudEluQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWFiOajgOafpeiHqui6q1xyXG4gICAgICAgIGNvbnN0IGNvbXAgPSB0aGlzLmdldENvbXBvbmVudChjb21wb25lbnRUeXBlKTtcclxuICAgICAgICBpZiAoY29tcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YGN5Y6G5omA5pyJ5a2Q6IqC54K5XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnRyYW5zZm9ybS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEdhbWVPYmplY3QgPSBjaGlsZC5nYW1lT2JqZWN0O1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRHYW1lT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZENvbXAgPSBjaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50KGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkQ29tcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkQ29tcDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyDpgJLlvZLmo4Dmn6XlrZDoioLngrnnmoTlrZDoioLngrlcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZXBDaGlsZENvbXAgPSBjaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWVwQ2hpbGRDb21wICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVlcENoaWxkQ29tcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5a2Q6IqC54K55LiK55qE5omA5pyJ57uE5Lu2XHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4oY29tcG9uZW50VHlwZTogRnVuY3Rpb24gJiB7IHByb3RvdHlwZTogVCB9KTogVFtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDmt7vliqDoh6rouqvnmoTnu4Tku7ZcclxuICAgICAgICByZXN1bHQucHVzaCguLi50aGlzLmdldENvbXBvbmVudHMoY29tcG9uZW50VHlwZSkpO1xyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInlrZDoioLngrlcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMudHJhbnNmb3JtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIC8vIOWBh+iuvuavj+S4qlRyYW5zZm9ybemDveacieWvueW6lOeahEdhbWVPYmplY3RcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHYW1lT2JqZWN0ID0gY2hpbGQuZ2FtZU9iamVjdDtcclxuICAgICAgICAgICAgaWYgKGNoaWxkR2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgLy8g6YCS5b2S6I635Y+W5a2Q6IqC54K555qE5omA5pyJ57uE5Lu2XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZEdhbWVPYmplY3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY29tcG9uZW50VHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOenu+mZpOe7hOS7tlxyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pihjb21wb25lbnRUeXBlOiBGdW5jdGlvbiAmIHsgcHJvdG90eXBlOiBUIH0pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuY29tcG9uZW50cy5maW5kSW5kZXgoY29tcG9uZW50ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2luZGV4XTtcclxuICAgICAgICAgICAgY29tcG9uZW50Lm9uRGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4flkI3np7Dmn6Xmib5HYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmQobmFtZTogc3RyaW5nKTogR2FtZU9iamVjdCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIC8vIOi/memcgOimgeS4gOS4quWFqOWxgOeahEdhbWVPYmplY3Tms6jlhozooahcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrpgJrov4fmoIfnrb7mn6Xmib7nrKzkuIDkuKpHYW1lT2JqZWN0XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRXaXRoVGFnKHRhZzogc3RyaW5nKTogR2FtZU9iamVjdCB8IG51bGwge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIC8vIOi/memcgOimgeS4gOS4quagh+etvuezu+e7n1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8mumAmui/h+agh+etvuafpeaJvuaJgOaciUdhbWVPYmplY3RcclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZEdhbWVPYmplY3RzV2l0aFRhZyh0YWc6IHN0cmluZyk6IEdhbWVPYmplY3RbXSB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmdmeaAgeaWueazle+8muafpeaJvueJueWumuexu+Wei+eahOesrOS4gOS4que7hOS7tlxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kT2JqZWN0T2ZUeXBlPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IG5ldyAoLi4uYXJnczogYW55W10pID0+IFQpOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgLy8g5a6e546w5p+l5om+6YC76L6RXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Z2Z5oCB5pa55rOV77ya5p+l5om+54m55a6a57G75Z6L55qE5omA5pyJ57uE5Lu2XHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRPYmplY3RzT2ZUeXBlPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IG5ldyAoLi4uYXJnczogYW55W10pID0+IFQpOiBUW10ge1xyXG4gICAgICAgIC8vIOWunueOsOafpeaJvumAu+i+kVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpnZnmgIHmlrnms5XvvJrlrp7kvovljJbmuLjmiI/lr7nosaFcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFudGlhdGUob3JpZ2luYWw6IEdhbWVPYmplY3QsIHBvc2l0aW9uPzogVmVjdG9yMywgcm90YXRpb24/OiBRdWF0ZXJuaW9uKTogR2FtZU9iamVjdCB7XHJcbiAgICAgICAgLy8g5Yib5bu65paw55qE5ri45oiP5a+56LGhXHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgR2FtZU9iamVjdChvcmlnaW5hbC5uYW1lKTtcclxuXHJcbiAgICAgICAgLy8g5aSN5Yi25bGe5oCnXHJcbiAgICAgICAgY2xvbmUudGFnID0gb3JpZ2luYWwudGFnO1xyXG4gICAgICAgIGNsb25lLmxheWVyID0gb3JpZ2luYWwubGF5ZXI7XHJcbiAgICAgICAgY2xvbmUuYWN0aXZlID0gb3JpZ2luYWwuYWN0aXZlO1xyXG5cclxuICAgICAgICAvLyDorr7nva7kvY3nva7lkozml4vovazvvIjlpoLmnpzmj5DkvpvvvIlcclxuICAgICAgICBpZiAocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgY2xvbmUudHJhbnNmb3JtLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocm90YXRpb24pIHtcclxuICAgICAgICAgICAgY2xvbmUudHJhbnNmb3JtLnJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlpI3liLbnu4Tku7bvvIjov5npnIDopoHkuIDkuKrmt7HluqblpI3liLbmnLrliLbvvIlcclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmUgOavgea4uOaIj+WvueixoVxyXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgLy8g6LCD55So5omA5pyJ57uE5Lu255qEb25EZXN0cm955pa55rOVXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5vbkRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6L+Z6YeM5Y+v5Lul5re75Yqg5LuO5Zy65pmv5Lit56e76Zmk5ri45oiP5a+56LGh55qE6YC76L6RXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXQge1xyXG4gICAgLy8g6ZSu55uY54q25oCBXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXJyZW50S2V5czogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcclxuICAgIHByaXZhdGUgc3RhdGljIHByZXZpb3VzS2V5czogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcclxuXHJcbiAgICAvLyDpvKDmoIfnirbmgIFcclxuICAgIHByaXZhdGUgc3RhdGljIGN1cnJlbnRNb3VzZUJ1dHRvbnM6IGJvb2xlYW5bXSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlXTsgLy8g5bem44CB5Lit44CB5Y+z6ZSuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcmV2aW91c01vdXNlQnV0dG9uczogYm9vbGVhbltdID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2VdO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVBvc2l0aW9uOiBWZWN0b3IyID0gVmVjdG9yMi5aRVJPO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZURlbHRhOiBWZWN0b3IyID0gVmVjdG9yMi5aRVJPO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVNjcm9sbERlbHRhOiBWZWN0b3IyID0gVmVjdG9yMi5aRVJPO1xyXG5cclxuICAgIC8vIOinpuaRuOeKtuaAgVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdG91Y2hlczogVG91Y2hbXSA9IFtdO1xyXG5cclxuICAgIC8vIOaMiemUruW4uOmHj1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBLZXlDb2RlID0ge1xyXG4gICAgICAgIC8vIOWtl+avjemUrlxyXG4gICAgICAgIEE6ICdLZXlBJywgQjogJ0tleUInLCBDOiAnS2V5QycsIEQ6ICdLZXlEJywgRTogJ0tleUUnLCBGOiAnS2V5RicsIEc6ICdLZXlHJyxcclxuICAgICAgICBIOiAnS2V5SCcsIEk6ICdLZXlJJywgSjogJ0tleUonLCBLOiAnS2V5SycsIEw6ICdLZXlMJywgTTogJ0tleU0nLCBOOiAnS2V5TicsXHJcbiAgICAgICAgTzogJ0tleU8nLCBQOiAnS2V5UCcsIFE6ICdLZXlRJywgUjogJ0tleVInLCBTOiAnS2V5UycsIFQ6ICdLZXlUJywgVTogJ0tleVUnLFxyXG4gICAgICAgIFY6ICdLZXlWJywgVzogJ0tleVcnLCBYOiAnS2V5WCcsIFk6ICdLZXlZJywgWjogJ0tleVonLFxyXG5cclxuICAgICAgICAvLyDmlbDlrZfplK5cclxuICAgICAgICBBbHBoYTA6ICdEaWdpdDAnLCBBbHBoYTE6ICdEaWdpdDEnLCBBbHBoYTI6ICdEaWdpdDInLCBBbHBoYTM6ICdEaWdpdDMnLCBBbHBoYTQ6ICdEaWdpdDQnLFxyXG4gICAgICAgIEFscGhhNTogJ0RpZ2l0NScsIEFscGhhNjogJ0RpZ2l0NicsIEFscGhhNzogJ0RpZ2l0NycsIEFscGhhODogJ0RpZ2l0OCcsIEFscGhhOTogJ0RpZ2l0OScsXHJcblxyXG4gICAgICAgIC8vIOWKn+iDvemUrlxyXG4gICAgICAgIEYxOiAnRjEnLCBGMjogJ0YyJywgRjM6ICdGMycsIEY0OiAnRjQnLCBGNTogJ0Y1JywgRjY6ICdGNicsXHJcbiAgICAgICAgRjc6ICdGNycsIEY4OiAnRjgnLCBGOTogJ0Y5JywgRjEwOiAnRjEwJywgRjExOiAnRjExJywgRjEyOiAnRjEyJyxcclxuXHJcbiAgICAgICAgLy8g54m55q6K6ZSuXHJcbiAgICAgICAgU3BhY2U6ICdTcGFjZScsXHJcbiAgICAgICAgRW50ZXI6ICdFbnRlcicsXHJcbiAgICAgICAgVGFiOiAnVGFiJyxcclxuICAgICAgICBFc2NhcGU6ICdFc2NhcGUnLFxyXG4gICAgICAgIEJhY2tzcGFjZTogJ0JhY2tzcGFjZScsXHJcbiAgICAgICAgU2hpZnQ6ICdTaGlmdExlZnQnLFxyXG4gICAgICAgIENvbnRyb2w6ICdDb250cm9sTGVmdCcsXHJcbiAgICAgICAgQWx0OiAnQWx0TGVmdCcsXHJcbiAgICAgICAgQ2Fwc0xvY2s6ICdDYXBzTG9jaycsXHJcblxyXG4gICAgICAgIC8vIOaWueWQkemUrlxyXG4gICAgICAgIFVwQXJyb3c6ICdBcnJvd1VwJyxcclxuICAgICAgICBEb3duQXJyb3c6ICdBcnJvd0Rvd24nLFxyXG4gICAgICAgIExlZnRBcnJvdzogJ0Fycm93TGVmdCcsXHJcbiAgICAgICAgUmlnaHRBcnJvdzogJ0Fycm93UmlnaHQnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDliJ3lp4vljJbovpPlhaXns7vnu59cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyDplK7nm5jkuovku7ZcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0LmN1cnJlbnRLZXlzLnNldChldmVudC5jb2RlLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgSW5wdXQuY3VycmVudEtleXMuc2V0KGV2ZW50LmNvZGUsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g6byg5qCH5LqL5Lu2XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gPj0gMCAmJiBldmVudC5idXR0b24gPCAzKSB7XHJcbiAgICAgICAgICAgICAgICBJbnB1dC5jdXJyZW50TW91c2VCdXR0b25zW2V2ZW50LmJ1dHRvbl0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA+PSAwICYmIGV2ZW50LmJ1dHRvbiA8IDMpIHtcclxuICAgICAgICAgICAgICAgIElucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNbZXZlbnQuYnV0dG9uXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIElucHV0Lm1vdXNlUG9zaXRpb24ueCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICAgICAgICAgIElucHV0Lm1vdXNlUG9zaXRpb24ueSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcclxuICAgICAgICAgICAgSW5wdXQubW91c2VEZWx0YS54ID0gZXZlbnQubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICBJbnB1dC5tb3VzZURlbHRhLnkgPSBldmVudC5tb3ZlbWVudFk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0Lm1vdXNlU2Nyb2xsRGVsdGEueSA9IGV2ZW50LmRlbHRhWTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsZW5kJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC5tb3VzZVNjcm9sbERlbHRhLnkgPSAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDop6bmkbjkuovku7ZcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIElucHV0LnVwZGF0ZVRvdWNoZXMoZXZlbnQudG91Y2hlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC51cGRhdGVUb3VjaGVzKGV2ZW50LnRvdWNoZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC51cGRhdGVUb3VjaGVzKGV2ZW50LnRvdWNoZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBJbnB1dC51cGRhdGVUb3VjaGVzKGV2ZW50LnRvdWNoZXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOabtOaWsOi+k+WFpeeKtuaAge+8iOWcqOavj+W4p+W8gOWni+aXtuiwg+eUqO+8iVxyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy8g5pu05paw6ZSu55uY54q25oCBXHJcbiAgICAgICAgSW5wdXQucHJldmlvdXNLZXlzID0gbmV3IE1hcChJbnB1dC5jdXJyZW50S2V5cyk7XHJcblxyXG4gICAgICAgIC8vIOabtOaWsOm8oOagh+eKtuaAgVxyXG4gICAgICAgIElucHV0LnByZXZpb3VzTW91c2VCdXR0b25zID0gWy4uLklucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNdO1xyXG5cclxuICAgICAgICAvLyDlpI3kvY3pvKDmoIfmu5rova5cclxuICAgICAgICBJbnB1dC5tb3VzZVNjcm9sbERlbHRhLnkgPSAwO1xyXG5cclxuICAgICAgICAvLyDlpI3kvY3pvKDmoIfnp7vliqhcclxuICAgICAgICBJbnB1dC5tb3VzZURlbHRhLnggPSAwO1xyXG4gICAgICAgIElucHV0Lm1vdXNlRGVsdGEueSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIOmUruebmOi+k+WFpeajgOa1i1xyXG5cclxuICAgIC8vIOajgOafpeaMiemUruaYr+WQpuiiq+aMieS4i++8iOaMgee7reinpuWPke+8iVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRLZXkoa2V5Q29kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIElucHV0LmN1cnJlbnRLZXlzLmdldChrZXlDb2RlKSA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmo4Dmn6XmjInplK7mmK/lkKblnKjlvZPliY3luKfooqvmjInkuIvvvIjku4XkuIDluKfop6blj5HvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0S2V5RG93bihrZXlDb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gSW5wdXQuY3VycmVudEtleXMuZ2V0KGtleUNvZGUpID09PSB0cnVlICYmIElucHV0LnByZXZpb3VzS2V5cy5nZXQoa2V5Q29kZSkgIT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5qOA5p+l5oyJ6ZSu5piv5ZCm5Zyo5b2T5YmN5bin6KKr6YeK5pS+77yI5LuF5LiA5bin6Kem5Y+R77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEtleVVwKGtleUNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBJbnB1dC5jdXJyZW50S2V5cy5nZXQoa2V5Q29kZSkgIT09IHRydWUgJiYgSW5wdXQucHJldmlvdXNLZXlzLmdldChrZXlDb2RlKSA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bmjIflrprovbTlkJHnmoTovpPlhaXlgLxcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0QXhpcyhheGlzOiBJbnB1dEF4aXMpOiBudW1iZXIge1xyXG4gICAgICAgIHN3aXRjaCAoYXhpcykge1xyXG4gICAgICAgICAgICBjYXNlIElucHV0QXhpcy5Ib3Jpem9udGFsOlxyXG4gICAgICAgICAgICAgICAgLy8g5rC05bmz6L20IEEvRCDmiJYg5bem5Y+z5pa55ZCR6ZSuXHJcbiAgICAgICAgICAgICAgICBpZiAoSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuRCkgfHwgSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuUmlnaHRBcnJvdykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5BKSB8fCBJbnB1dC5HZXRLZXkoSW5wdXQuS2V5Q29kZS5MZWZ0QXJyb3cpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIElucHV0QXhpcy5WZXJ0aWNhbDpcclxuICAgICAgICAgICAgICAgIC8vIOWeguebtOi9tCBXL1Mg5oiWIOS4iuS4i+aWueWQkemUrlxyXG4gICAgICAgICAgICAgICAgaWYgKElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLlcpIHx8IElucHV0LkdldEtleShJbnB1dC5LZXlDb2RlLlVwQXJyb3cpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuUykgfHwgSW5wdXQuR2V0S2V5KElucHV0LktleUNvZGUuRG93bkFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOm8oOagh+i+k+WFpeajgOa1i1xyXG5cclxuICAgIC8vIOajgOafpem8oOagh+aMiemSruaYr+WQpuiiq+aMieS4i++8iOaMgee7reinpuWPke+8iVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRNb3VzZUJ1dHRvbihidXR0b246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBidXR0b24gPj0gMCAmJiBidXR0b24gPCAzID8gSW5wdXQuY3VycmVudE1vdXNlQnV0dG9uc1tidXR0b25dIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5qOA5p+l6byg5qCH5oyJ6ZKu5piv5ZCm5Zyo5b2T5YmN5bin6KKr5oyJ5LiL77yI5LuF5LiA5bin6Kem5Y+R77yJXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldE1vdXNlQnV0dG9uRG93bihidXR0b246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBidXR0b24gPj0gMCAmJiBidXR0b24gPCAzID9cclxuICAgICAgICAgICAgKElucHV0LmN1cnJlbnRNb3VzZUJ1dHRvbnNbYnV0dG9uXSAmJiAhSW5wdXQucHJldmlvdXNNb3VzZUJ1dHRvbnNbYnV0dG9uXSkgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmo4Dmn6XpvKDmoIfmjInpkq7mmK/lkKblnKjlvZPliY3luKfooqvph4rmlL7vvIjku4XkuIDluKfop6blj5HvvIlcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0TW91c2VCdXR0b25VcChidXR0b246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBidXR0b24gPj0gMCAmJiBidXR0b24gPCAzID9cclxuICAgICAgICAgICAgKCFJbnB1dC5jdXJyZW50TW91c2VCdXR0b25zW2J1dHRvbl0gJiYgSW5wdXQucHJldmlvdXNNb3VzZUJ1dHRvbnNbYnV0dG9uXSkgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g6Kem5pG46L6T5YWl5qOA5rWLXHJcblxyXG4gICAgLy8g5pu05paw6Kem5pG454q25oCBXHJcbiAgICBwcml2YXRlIHN0YXRpYyB1cGRhdGVUb3VjaGVzKHRvdWNoTGlzdDogVG91Y2hMaXN0KTogdm9pZCB7XHJcbiAgICAgICAgSW5wdXQudG91Y2hlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoID0gdG91Y2hMaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgICAgICBJbnB1dC50b3VjaGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZmluZ2VySWQ6IHRvdWNoLmlkZW50aWZpZXIsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogdG91Y2guY2xpZW50WSAtIHJlY3QudG9wXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVsdGFQb3NpdGlvbjogeyB4OiAwLCB5OiAwIH0sIC8vIOeugOWMluWunueOsO+8jOWunumZheW6lOivpei3n+i4quWJjeS4gOW4p+S9jee9rlxyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFRvdWNoUGhhc2UuTW92ZWQsIC8vIOeugOWMluWunueOsFxyXG4gICAgICAgICAgICAgICAgdGFwQ291bnQ6IDEgLy8g566A5YyW5a6e546wXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bmjIflrprntKLlvJXnmoTop6bmkbhcclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0VG91Y2goaW5kZXg6IG51bWJlcik6IFRvdWNoIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBJbnB1dC50b3VjaGVzLmxlbmd0aCA/IElucHV0LnRvdWNoZXNbaW5kZXhdIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bop6bmkbjmlbDph49cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHRvdWNoQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gSW5wdXQudG91Y2hlcy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbn1cclxuXHJcbi8vIOi9tOWQkeaemuS4vlxyXG5leHBvcnQgZW51bSBJbnB1dEF4aXMge1xyXG4gICAgSG9yaXpvbnRhbCxcclxuICAgIFZlcnRpY2FsLFxyXG59XHJcblxyXG4vLyDop6bmkbjpmLbmrrXmnprkuL5cclxuZXhwb3J0IGVudW0gVG91Y2hQaGFzZSB7XHJcbiAgICBCZWdhbixcclxuICAgIE1vdmVkLFxyXG4gICAgU3RhdGlvbmFyeSxcclxuICAgIEVuZGVkLFxyXG4gICAgQ2FuY2VsZWRcclxufVxyXG5cclxuLy8g6Kem5pG45L+h5oGv5o6l5Y+jXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG91Y2gge1xyXG4gICAgZmluZ2VySWQ6IG51bWJlcjtcclxuICAgIHBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcbiAgICBkZWx0YVBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcbiAgICBwaGFzZTogVG91Y2hQaGFzZTtcclxuICAgIHRhcENvdW50OiBudW1iZXI7XHJcbn0iLCJpbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9FbmdpbmVcIjtcclxuXHJcbmVudW0gTG9nVHlwZSB7XHJcbiAgICBJbmZvLFxyXG4gICAgV2FybmluZyxcclxuICAgIEVycm9yLFxyXG59XHJcblxyXG5pbnRlcmZhY2UgSUxvZyB7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBMb2dUeXBlO1xyXG4gICAgZHVyYXRpb246IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dzOiBJTG9nW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBsb2dDb2xvcnMgPSB7XHJcbiAgICAgICAgW0xvZ1R5cGUuSW5mb106ICd3aGl0ZScsXHJcbiAgICAgICAgW0xvZ1R5cGUuV2FybmluZ106ICdvcmFuZ2UnLFxyXG4gICAgICAgIFtMb2dUeXBlLkVycm9yXTogJ3JlZCdcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHByaW50TG9ncygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSB0aGlzLmxvZ3NbaV07XHJcbiAgICAgICAgICAgIEVuZ2luZS5jb250ZXh0LmZpbGxTdHlsZSA9IExvZ2dlci5sb2dDb2xvcnNbbG9nLnR5cGVdO1xyXG4gICAgICAgICAgICBFbmdpbmUuY29udGV4dC5maWxsVGV4dChsb2cubWVzc2FnZSwgMTAsIDIwICsgaSAqIDE1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvZyhtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UsIExvZ1R5cGUuSW5mbywgZHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB3YXJuaW5nKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnB1c2gobWVzc2FnZSwgTG9nVHlwZS5XYXJuaW5nLCBkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnB1c2gobWVzc2FnZSwgTG9nVHlwZS5FcnJvciwgZHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHB1c2gobWVzc2FnZTogc3RyaW5nLCB0eXBlOiBMb2dUeXBlLCBkdXJhdGlvbj86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxvZzogSUxvZyA9IHtcclxuICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uID8/IDAsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9ncy5wdXNoKGxvZyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xuXG5leHBvcnQgY2xhc3MgQm91bmRzIHtcbiAgICBtaW46IFZlY3RvcjM7XG4gICAgbWF4OiBWZWN0b3IzO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG1pbjogVmVjdG9yMywgbWF4OiBWZWN0b3IzKTtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobWluPzogVmVjdG9yMywgbWF4PzogVmVjdG9yMykge1xuICAgICAgICB0aGlzLm1pbiA9IG1pbiB8fCBWZWN0b3IzLlpFUk87XG4gICAgICAgIHRoaXMubWF4ID0gbWF4IHx8IFZlY3RvcjMuWkVSTztcbiAgICB9XG5cbiAgICBnZXRDZW50ZXIoKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICh0aGlzLm1pbi54ICsgdGhpcy5tYXgueCkgLyAyLFxuICAgICAgICAgICAgKHRoaXMubWluLnkgKyB0aGlzLm1heC55KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5taW4ueiArIHRoaXMubWF4LnopIC8gMlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldEhhbGZFeHRlbnRzKCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAodGhpcy5tYXgueCAtIHRoaXMubWluLngpIC8gMixcbiAgICAgICAgICAgICh0aGlzLm1heC55IC0gdGhpcy5taW4ueSkgLyAyLFxuICAgICAgICAgICAgKHRoaXMubWF4LnogLSB0aGlzLm1pbi56KSAvIDJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzZXRNaW4obWluOiBWZWN0b3IzKSB7XG4gICAgICAgIHRoaXMubWluID0gbWluO1xuICAgIH1cblxuICAgIHNldE1heChtYXg6IFZlY3RvcjMpIHtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb21Qb2ludHMocG9pbnRzOiBWZWN0b3IzW10pOiBCb3VuZHMge1xuICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG5ldyBCb3VuZHMoKTtcblxuICAgICAgICBsZXQgbWluID0gbmV3IFZlY3RvcjMocG9pbnRzWzBdLngsIHBvaW50c1swXS55LCBwb2ludHNbMF0ueik7XG4gICAgICAgIGxldCBtYXggPSBuZXcgVmVjdG9yMyhwb2ludHNbMF0ueCwgcG9pbnRzWzBdLnksIHBvaW50c1swXS56KTtcblxuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcG9pbnRzKSB7XG4gICAgICAgICAgICBtaW4ueCA9IE1hdGgubWluKG1pbi54LCBwLngpO1xuICAgICAgICAgICAgbWluLnkgPSBNYXRoLm1pbihtaW4ueSwgcC55KTtcbiAgICAgICAgICAgIG1pbi56ID0gTWF0aC5taW4obWluLnosIHAueik7XG5cbiAgICAgICAgICAgIG1heC54ID0gTWF0aC5tYXgobWF4LngsIHAueCk7XG4gICAgICAgICAgICBtYXgueSA9IE1hdGgubWF4KG1heC55LCBwLnkpO1xuICAgICAgICAgICAgbWF4LnogPSBNYXRoLm1heChtYXgueiwgcC56KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWBh+iuvkJvdW5kc+aciW1pbuWSjG1heOWxnuaAp1xuICAgICAgICBjb25zdCBib3VuZHMgPSBuZXcgQm91bmRzKCk7XG4gICAgICAgIGJvdW5kcy5taW4gPSBtaW47XG4gICAgICAgIGJvdW5kcy5tYXggPSBtYXg7XG4gICAgICAgIHJldHVybiBib3VuZHM7XG4gICAgfVxufVxuXG4vKipcbiAqIOi9tOWvuem9kOWMheWbtOebkiAoQUFCQilcbiAqIOacgOeugOWNleeahOWMheWbtOebku+8jOi+ueS4juWdkOagh+i9tOW5s+ihjFxuICovXG5jbGFzcyBBQUJCIHtcbiAgICBtaW46IFZlY3RvcjM7XG4gICAgbWF4OiBWZWN0b3IzO1xuXG4gICAgY29uc3RydWN0b3IobWluOiBWZWN0b3IzLCBtYXg6IFZlY3RvcjMpIHtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7jumhtueCueWIl+ihqOeUn+aIkEFBQkJcbiAgICAgKiBAcGFyYW0gdmVydGljZXMg5LiJ57u06aG254K55pWw57uEXG4gICAgICogQHJldHVybnMg55Sf5oiQ55qEQUFCQlxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVmVydGljZXModmVydGljZXM6IFZlY3RvcjNbXSk6IEFBQkIge1xuICAgICAgICBpZiAodmVydGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLpobbngrnmlbDnu4TkuI3og73kuLrnqbpcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDliJ3lp4vljJZtaW7lkoxtYXjkuLrnrKzkuIDkuKrpobbngrnnmoTlgLxcbiAgICAgICAgY29uc3QgbWluID0gdmVydGljZXNbMF0uY2xvbmUoKTtcbiAgICAgICAgY29uc3QgbWF4ID0gdmVydGljZXNbMF0uY2xvbmUoKTtcblxuICAgICAgICAvLyDpgY3ljobmiYDmnInpobbngrnvvIzmib7liLDmnIDlsI/lkozmnIDlpKflgLxcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZlcnRpY2VzKSB7XG4gICAgICAgICAgICBtaW4ueCA9IE1hdGgubWluKG1pbi54LCB2LngpO1xuICAgICAgICAgICAgbWluLnkgPSBNYXRoLm1pbihtaW4ueSwgdi55KTtcbiAgICAgICAgICAgIG1pbi56ID0gTWF0aC5taW4obWluLnosIHYueik7XG5cbiAgICAgICAgICAgIG1heC54ID0gTWF0aC5tYXgobWF4LngsIHYueCk7XG4gICAgICAgICAgICBtYXgueSA9IE1hdGgubWF4KG1heC55LCB2LnkpO1xuICAgICAgICAgICAgbWF4LnogPSBNYXRoLm1heChtYXgueiwgdi56KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgQUFCQihtaW4sIG1heCk7XG4gICAgfVxuXG4gICAgLyoqIOiOt+WPlkFBQkLnmoTkuK3lv4PngrkgKi9cbiAgICBnZXRDZW50ZXIoKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICh0aGlzLm1pbi54ICsgdGhpcy5tYXgueCkgLyAyLFxuICAgICAgICAgICAgKHRoaXMubWluLnkgKyB0aGlzLm1heC55KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5taW4ueiArIHRoaXMubWF4LnopIC8gMlxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKiDojrflj5ZBQUJC55qE5Y2K6L656ZW/ICovXG4gICAgZ2V0SGFsZkV4dGVudHMoKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICh0aGlzLm1heC54IC0gdGhpcy5taW4ueCkgLyAyLFxuICAgICAgICAgICAgKHRoaXMubWF4LnkgLSB0aGlzLm1pbi55KSAvIDIsXG4gICAgICAgICAgICAodGhpcy5tYXgueiAtIHRoaXMubWluLnopIC8gMlxuICAgICAgICApO1xuICAgIH1cbn1cblxuLyoqXG4gKiDlrprlkJHljIXlm7Tnm5IgKE9CQilcbiAqIOWPr+S7pemaj+eJqeS9k+aXi+i9rO+8jOi+ueS4jueJqeS9k+iHqui6q+WdkOagh+ezu+Wvuem9kFxuICovXG5jbGFzcyBPQkIge1xuICAgIGNlbnRlcjogVmVjdG9yMzsgICAgICAgICAgLy8g5Lit5b+D54K5XG4gICAgYXhlczogW1ZlY3RvcjMsIFZlY3RvcjMsIFZlY3RvcjNdOyAgLy8g5LiJ5Liq5q2j5Lqk55qE6L205ZCR6YePXG4gICAgZXh0ZW50czogVmVjdG9yMzsgICAgICAgICAvLyDmr4/kuKrovbTmlrnlkJHkuIrnmoTljYrplb/luqZcblxuICAgIGNvbnN0cnVjdG9yKGNlbnRlcjogVmVjdG9yMywgYXhlczogW1ZlY3RvcjMsIFZlY3RvcjMsIFZlY3RvcjNdLCBleHRlbnRzOiBWZWN0b3IzKSB7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgICAgICB0aGlzLmF4ZXMgPSBheGVzO1xuICAgICAgICB0aGlzLmV4dGVudHMgPSBleHRlbnRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7jumhtueCueWIl+ihqOeUn+aIkE9CQu+8iOS9v+eUqFBDQeS4u+aIkOWIhuWIhuaekO+8iVxuICAgICAqIOeul+azleaAnei3r++8mumAmui/h+iuoeeul+mhtueCueeahOWNj+aWueW3ruefqemYteaJvuWIsOS4u+aWueWQkeS9nOS4uk9CQueahOi9tFxuICAgICAqIEBwYXJhbSB2ZXJ0aWNlcyDkuInnu7TpobbngrnmlbDnu4RcbiAgICAgKiBAcmV0dXJucyDnlJ/miJDnmoRPQkJcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVZlcnRpY2VzKHZlcnRpY2VzOiBWZWN0b3IzW10pOiBPQkIge1xuICAgICAgICBpZiAodmVydGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLpobbngrnmlbDnu4TkuI3og73kuLrnqbpcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiDorqHnrpfkuK3lv4PngrnvvIjlubPlnYflgLzvvIlcbiAgICAgICAgY29uc3QgY2VudGVyID0gT0JCLmNhbGN1bGF0ZUNlbnRyb2lkKHZlcnRpY2VzKTtcblxuICAgICAgICAvLyAyLiDorqHnrpfljY/mlrnlt67nn6npmLVcbiAgICAgICAgY29uc3QgY292YXJpYW5jZSA9IE9CQi5jYWxjdWxhdGVDb3ZhcmlhbmNlTWF0cml4KHZlcnRpY2VzLCBjZW50ZXIpO1xuXG4gICAgICAgIC8vIDMuIOiuoeeul+WNj+aWueW3ruefqemYteeahOeJueW+geWQkemHj++8iOS4u+aIkOWIhu+8ie+8jOS9nOS4uk9CQueahOi9tFxuICAgICAgICBjb25zdCBlaWdlbnZlY3RvcnMgPSBPQkIuY2FsY3VsYXRlRWlnZW52ZWN0b3JzKGNvdmFyaWFuY2UpO1xuXG4gICAgICAgIC8vIOehruS/nei9tOaYr+WNleS9jeWQkemHj1xuICAgICAgICBjb25zdCBheGVzOiBbVmVjdG9yMywgVmVjdG9yMywgVmVjdG9yM10gPSBbXG4gICAgICAgICAgICBlaWdlbnZlY3RvcnNbMF0ubXVsdGlwbHkoMSAvIGVpZ2VudmVjdG9yc1swXS5tYWduaXR1ZGUpLFxuICAgICAgICAgICAgZWlnZW52ZWN0b3JzWzFdLm11bHRpcGx5KDEgLyBlaWdlbnZlY3RvcnNbMV0ubWFnbml0dWRlKSxcbiAgICAgICAgICAgIGVpZ2VudmVjdG9yc1syXS5tdWx0aXBseSgxIC8gZWlnZW52ZWN0b3JzWzJdLm1hZ25pdHVkZSlcbiAgICAgICAgXTtcblxuICAgICAgICAvLyA0LiDorqHnrpfmr4/kuKrovbTmlrnlkJHkuIrnmoTmnIDlpKflu7bkvLjvvIjljYrplb/luqbvvIlcbiAgICAgICAgY29uc3QgZXh0ZW50cyA9IE9CQi5jYWxjdWxhdGVFeHRlbnRzKHZlcnRpY2VzLCBjZW50ZXIsIGF4ZXMpO1xuXG4gICAgICAgIHJldHVybiBuZXcgT0JCKGNlbnRlciwgYXhlcywgZXh0ZW50cyk7XG4gICAgfVxuXG4gICAgLyoqIOiuoeeul+mhtueCueeahOS4reW/g+eCue+8iOi0qOW/g++8iSAqL1xuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZUNlbnRyb2lkKHZlcnRpY2VzOiBWZWN0b3IzW10pOiBWZWN0b3IzIHtcbiAgICAgICAgY29uc3Qgc3VtID0gbmV3IFZlY3RvcjMoKTtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZlcnRpY2VzKSB7XG4gICAgICAgICAgICBzdW0ueCArPSB2Lng7XG4gICAgICAgICAgICBzdW0ueSArPSB2Lnk7XG4gICAgICAgICAgICBzdW0ueiArPSB2Lno7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bS5tdWx0aXBseSgxIC8gdmVydGljZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKiog6K6h566X5Y2P5pa55beu55+p6Zi1ICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlQ292YXJpYW5jZU1hdHJpeCh2ZXJ0aWNlczogVmVjdG9yM1tdLCBjZW50cm9pZDogVmVjdG9yMyk6IG51bWJlcltdW10ge1xuICAgICAgICAvLyDliJ3lp4vljJYzeDPljY/mlrnlt67nn6npmLVcbiAgICAgICAgY29uc3QgY292ID0gW1xuICAgICAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICAgICAgWzAsIDAsIDBdXG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZlcnRpY2VzKSB7XG4gICAgICAgICAgICAvLyDorqHnrpfpobbngrnnm7jlr7nkuo7otKjlv4PnmoTlgY/np7tcbiAgICAgICAgICAgIGNvbnN0IHggPSB2LnggLSBjZW50cm9pZC54O1xuICAgICAgICAgICAgY29uc3QgeSA9IHYueSAtIGNlbnRyb2lkLnk7XG4gICAgICAgICAgICBjb25zdCB6ID0gdi56IC0gY2VudHJvaWQuejtcblxuICAgICAgICAgICAgLy8g57Sv56ev5Y2P5pa55beu5YC8XG4gICAgICAgICAgICBjb3ZbMF1bMF0gKz0geCAqIHg7XG4gICAgICAgICAgICBjb3ZbMF1bMV0gKz0geCAqIHk7XG4gICAgICAgICAgICBjb3ZbMF1bMl0gKz0geCAqIHo7XG4gICAgICAgICAgICBjb3ZbMV1bMV0gKz0geSAqIHk7XG4gICAgICAgICAgICBjb3ZbMV1bMl0gKz0geSAqIHo7XG4gICAgICAgICAgICBjb3ZbMl1bMl0gKz0geiAqIHo7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDlr7nnp7Dnn6npmLXvvIzloavlhYXkuIvkuInop5Lpg6jliIZcbiAgICAgICAgY292WzFdWzBdID0gY292WzBdWzFdO1xuICAgICAgICBjb3ZbMl1bMF0gPSBjb3ZbMF1bMl07XG4gICAgICAgIGNvdlsyXVsxXSA9IGNvdlsxXVsyXTtcblxuICAgICAgICAvLyDpmaTku6XpobbngrnmlbDph48tMe+8iOaXoOWBj+S8sOiuoe+8iVxuICAgICAgICBjb25zdCBuID0gdmVydGljZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb3ZbaV1bal0gLz0gKG4gLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3Y7XG4gICAgfVxuXG4gICAgLyoqIOiuoeeul+WNj+aWueW3ruefqemYteeahOeJueW+geWQkemHj++8iOeugOWMluWunueOsO+8iSAqL1xuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZUVpZ2VudmVjdG9ycyhjb3Y6IG51bWJlcltdW10pOiBbVmVjdG9yMywgVmVjdG9yMywgVmVjdG9yM10ge1xuICAgICAgICAvLyDov5nph4zkvb/nlKjnroDljJbnmoTnibnlvoHlkJHph4/orqHnrpfmlrnms5VcbiAgICAgICAgLy8g5a6e6ZmF5bqU55So5Lit5Y+v6IO96ZyA6KaB5pu057K+56Gu55qE566X5rOV77yI5aaCSmFjb2Jp6L+t5Luj5rOV77yJXG5cbiAgICAgICAgLy8g5a+55LqO5ryU56S655uu55qE77yM5oiR5Lus6L+U5Zue5LiJ5Liq5q2j5Lqk5ZCR6YeP77yI5a6e6ZmF6aG555uu5Lit6ZyA5pu/5o2i5Li655yf5a6e54m55b6B5ZCR6YeP6K6h566X77yJXG4gICAgICAgIC8vIOazqOaEj++8mui/meWPquaYr+WNoOS9jeWunueOsO+8jOecn+WunuWcuuaZr+mcgOimgeato+ehruiuoeeul+eJueW+geWQkemHj1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmV3IFZlY3RvcjMoMSwgMCwgMCksICAvLyDlgYforr5Y6L205Li656ys5LiA5Li75oiQ5YiGXG4gICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSwgIC8vIOWBh+iuvlnovbTkuLrnrKzkuozkuLvmiJDliIZcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIDEpICAgLy8g5YGH6K6+Wui9tOS4uuesrOS4ieS4u+aIkOWIhlxuICAgICAgICBdO1xuICAgIH1cblxuICAgIC8qKiDorqHnrpfmr4/kuKrovbTmlrnlkJHkuIrnmoTljYrplb/luqYgKi9cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVFeHRlbnRzKFxuICAgICAgICB2ZXJ0aWNlczogVmVjdG9yM1tdLFxuICAgICAgICBjZW50ZXI6IFZlY3RvcjMsXG4gICAgICAgIGF4ZXM6IFtWZWN0b3IzLCBWZWN0b3IzLCBWZWN0b3IzXVxuICAgICk6IFZlY3RvcjMge1xuICAgICAgICBsZXQgZXh0ZW50WCA9IDA7XG4gICAgICAgIGxldCBleHRlbnRZID0gMDtcbiAgICAgICAgbGV0IGV4dGVudFogPSAwO1xuXG4gICAgICAgIC8vIOWvueavj+S4qui9tOiuoeeul+mhtueCueWcqOivpei9tOS4iueahOaKleW9seiMg+WbtFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXhpcyA9IGF4ZXNbaV07XG4gICAgICAgICAgICBsZXQgbWluID0gSW5maW5pdHk7XG4gICAgICAgICAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmVydGljZXMpIHtcbiAgICAgICAgICAgICAgICAvLyDorqHnrpfpobbngrnnm7jlr7nkuo7kuK3lv4PngrnnmoTlkJHph49cbiAgICAgICAgICAgICAgICBjb25zdCBkaXIgPSB2LnN1YnRyYWN0KGNlbnRlcik7XG4gICAgICAgICAgICAgICAgLy8g6K6h566X5Zyo5b2T5YmN6L205LiK55qE5oqV5b2xXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvaiA9IFZlY3RvcjMuZG90KGRpciwgYXhpcyk7XG5cbiAgICAgICAgICAgICAgICBtaW4gPSBNYXRoLm1pbihtaW4sIHByb2opO1xuICAgICAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgcHJvaik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWNiumVv+W6puWPluacgOWkp+e7neWvueWAvFxuICAgICAgICAgICAgY29uc3QgZXh0ZW50ID0gTWF0aC5tYXgoTWF0aC5hYnMobWluKSwgTWF0aC5hYnMobWF4KSk7XG5cbiAgICAgICAgICAgIC8vIOebtOaOpei1i+WAvOe7meWvueW6lOWIhumHj1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIGV4dGVudFggPSBleHRlbnQ7XG4gICAgICAgICAgICBlbHNlIGlmIChpID09PSAxKSBleHRlbnRZID0gZXh0ZW50O1xuICAgICAgICAgICAgZWxzZSBleHRlbnRaID0gZXh0ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKGV4dGVudFgsIGV4dGVudFksIGV4dGVudFopO1xuICAgIH1cbn1cblxuLyoqXG4gKiDnkIPkvZPljIXlm7Tnm5JcbiAqIOeUqOeQg+W/g+WSjOWNiuW+hOihqOekuueahOeugOWMluWMheWbtOS9k1xuICovXG5jbGFzcyBTcGhlcmUge1xuICAgIGNlbnRlcjogVmVjdG9yMztcbiAgICByYWRpdXM6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGNlbnRlcjogVmVjdG9yMywgcmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7jumhtueCueWIl+ihqOeUn+aIkOeQg+S9k+WMheWbtOebklxuICAgICAqIOeul+azleaAnei3r++8muWFiOiuoeeul+aJgOaciemhtueCueeahOS4reW/g+eCue+8jOWGjeaJvuWIsOemu+S4reW/g+eCueacgOi/nOeahOmhtueCueS9nOS4uuWNiuW+hFxuICAgICAqIEBwYXJhbSB2ZXJ0aWNlcyDkuInnu7TpobbngrnmlbDnu4RcbiAgICAgKiBAcmV0dXJucyDnlJ/miJDnmoTnkIPkvZNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVZlcnRpY2VzKHZlcnRpY2VzOiBWZWN0b3IzW10pOiBTcGhlcmUge1xuICAgICAgICBpZiAodmVydGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLpobbngrnmlbDnu4TkuI3og73kuLrnqbpcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiDorqHnrpfkuK3lv4PngrnvvIjlubPlnYflgLzvvIlcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlY3RvcjMoKTtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZlcnRpY2VzKSB7XG4gICAgICAgICAgICBjZW50ZXIueCArPSB2Lng7XG4gICAgICAgICAgICBjZW50ZXIueSArPSB2Lnk7XG4gICAgICAgICAgICBjZW50ZXIueiArPSB2Lno7XG4gICAgICAgIH1cbiAgICAgICAgY2VudGVyLnggLz0gdmVydGljZXMubGVuZ3RoO1xuICAgICAgICBjZW50ZXIueSAvPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgIGNlbnRlci56IC89IHZlcnRpY2VzLmxlbmd0aDtcblxuICAgICAgICAvLyAyLiDmib7liLDnprvkuK3lv4PngrnmnIDov5znmoTpobbngrnvvIzlhbbot53nprvljbPkuLrljYrlvoRcbiAgICAgICAgbGV0IG1heERpc3RhbmNlU3F1YXJlZCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2ZXJ0aWNlcykge1xuICAgICAgICAgICAgY29uc3QgZHggPSB2LnggLSBjZW50ZXIueDtcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gdi55IC0gY2VudGVyLnk7XG4gICAgICAgICAgICBjb25zdCBkeiA9IHYueiAtIGNlbnRlci56O1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VTcXVhcmVkID0gZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6O1xuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2VTcXVhcmVkID4gbWF4RGlzdGFuY2VTcXVhcmVkKSB7XG4gICAgICAgICAgICAgICAgbWF4RGlzdGFuY2VTcXVhcmVkID0gZGlzdGFuY2VTcXVhcmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmFkaXVzID0gTWF0aC5zcXJ0KG1heERpc3RhbmNlU3F1YXJlZCk7XG4gICAgICAgIHJldHVybiBuZXcgU3BoZXJlKGNlbnRlciwgcmFkaXVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDku45BQUJC55Sf5oiQ55CD5L2T5YyF5Zu055uSXG4gICAgICogQHBhcmFtIGFhYmIg6L205a+56b2Q5YyF5Zu055uSXG4gICAgICogQHJldHVybnMg55Sf5oiQ55qE55CD5L2TXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BQUJCKGFhYmI6IEFBQkIpOiBTcGhlcmUge1xuICAgICAgICBjb25zdCBjZW50ZXIgPSBhYWJiLmdldENlbnRlcigpO1xuICAgICAgICBjb25zdCBoYWxmRXh0ZW50cyA9IGFhYmIuZ2V0SGFsZkV4dGVudHMoKTtcbiAgICAgICAgLy8g5Y2K5b6E5piv5LuO5Lit5b+D5Yiw6KeS6JC955qE6Led56a7XG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IGhhbGZFeHRlbnRzLm1hZ25pdHVkZTtcbiAgICAgICAgcmV0dXJuIG5ldyBTcGhlcmUoY2VudGVyLCByYWRpdXMpO1xuICAgIH1cbn1cblxuLy8g56S65L6L55So5rOVXG5mdW5jdGlvbiBleGFtcGxlVXNhZ2UoKSB7XG4gICAgLy8g5Yib5bu65LiA5Lqb56S65L6L6aG254K5XG4gICAgY29uc3QgdmVydGljZXMgPSBbXG4gICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIDApLFxuICAgICAgICBuZXcgVmVjdG9yMygxLCAwLCAwKSxcbiAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIDEpLFxuICAgICAgICBuZXcgVmVjdG9yMygxLCAxLCAxKVxuICAgIF07XG5cbiAgICAvLyDnlJ/miJBBQUJCXG4gICAgY29uc3QgYWFiYiA9IEFBQkIuZnJvbVZlcnRpY2VzKHZlcnRpY2VzKTtcbiAgICBjb25zb2xlLmxvZyhcIkFBQkI6XCIpO1xuICAgIGNvbnNvbGUubG9nKFwiICBNaW46XCIsIGAoJHthYWJiLm1pbi54fSwgJHthYWJiLm1pbi55fSwgJHthYWJiLm1pbi56fSlgKTtcbiAgICBjb25zb2xlLmxvZyhcIiAgTWF4OlwiLCBgKCR7YWFiYi5tYXgueH0sICR7YWFiYi5tYXgueX0sICR7YWFiYi5tYXguen0pYCk7XG5cbiAgICAvLyDnlJ/miJBPQkJcbiAgICBjb25zdCBvYmIgPSBPQkIuZnJvbVZlcnRpY2VzKHZlcnRpY2VzKTtcbiAgICBjb25zb2xlLmxvZyhcIlxcbk9CQjpcIik7XG4gICAgY29uc29sZS5sb2coXCIgIENlbnRlcjpcIiwgYCgke29iYi5jZW50ZXIueH0sICR7b2JiLmNlbnRlci55fSwgJHtvYmIuY2VudGVyLnp9KWApO1xuICAgIGNvbnNvbGUubG9nKFwiICBFeHRlbnRzOlwiLCBgKCR7b2JiLmV4dGVudHMueH0sICR7b2JiLmV4dGVudHMueX0sICR7b2JiLmV4dGVudHMuen0pYCk7XG5cbiAgICAvLyDnlJ/miJDnkIPkvZNcbiAgICBjb25zdCBzcGhlcmUgPSBTcGhlcmUuZnJvbVZlcnRpY2VzKHZlcnRpY2VzKTtcbiAgICBjb25zb2xlLmxvZyhcIlxcblNwaGVyZTpcIik7XG4gICAgY29uc29sZS5sb2coXCIgIENlbnRlcjpcIiwgYCgke3NwaGVyZS5jZW50ZXIueH0sICR7c3BoZXJlLmNlbnRlci55fSwgJHtzcGhlcmUuY2VudGVyLnp9KWApO1xuICAgIGNvbnNvbGUubG9nKFwiICBSYWRpdXM6XCIsIHNwaGVyZS5yYWRpdXMpO1xufVxuIiwiaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgUXVhdGVybmlvbiB9IGZyb20gXCIuL1F1YXRlcm5pb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXg0eDQge1xyXG5cclxuICAgIHB1YmxpYyBtYXRyaXg6IEFycmF5PEFycmF5PG51bWJlcj4+ID0gbmV3IEFycmF5PEFycmF5PG51bWJlcj4+KCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29sdW1uMDogVmVjdG9yNCwgY29sdW1uMTogVmVjdG9yNCwgY29sdW1uMjogVmVjdG9yNCwgY29sdW1uMzogVmVjdG9yNCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgPSBhcmd1bWVudHNbaV0gYXMgVmVjdG9yNDtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2ldID0gbmV3IEFycmF5PG51bWJlcj4odi54LCB2LnksIHYueiwgdi53KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2ldID0gbmV3IEFycmF5PG51bWJlcj4oMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRleCDooYxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFJvdyhpbmRleDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLm1hdHJpeFtpbmRleF07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KGNbMF0sIGNbMV0sIGNbMl0sIGNbM10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg5YiXXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb2x1bW4oaW5kZXg6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCh0aGlzLm1hdHJpeFswXVtpbmRleF0sIHRoaXMubWF0cml4WzFdW2luZGV4XSwgdGhpcy5tYXRyaXhbMl1baW5kZXhdLCB0aGlzLm1hdHJpeFszXVtpbmRleF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTZXRSb3coaW5kZXg6IG51bWJlciwgcm93OiBWZWN0b3I0KSB7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzBdID0gcm93Lng7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzFdID0gcm93Lnk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzJdID0gcm93Lno7XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbaW5kZXhdWzNdID0gcm93Lnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldENvbHVtbihpbmRleDogbnVtYmVyLCBjb2x1bW46IFZlY3RvcjQpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeFswXVtpbmRleF0gPSBjb2x1bW4ueDtcclxuICAgICAgICB0aGlzLm1hdHJpeFsxXVtpbmRleF0gPSBjb2x1bW4ueTtcclxuICAgICAgICB0aGlzLm1hdHJpeFsyXVtpbmRleF0gPSBjb2x1bW4uejtcclxuICAgICAgICB0aGlzLm1hdHJpeFszXVtpbmRleF0gPSBjb2x1bW4udztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkobTogTWF0cml4NHg0KTogTWF0cml4NHg0IHtcclxuICAgICAgICBsZXQgbGhzID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHJocyA9IG0ubWF0cml4O1xyXG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgTWF0cml4NHg0KCkubWF0cml4O1xyXG5cclxuICAgICAgICBtYXRyaXhbMF1bMF0gPSBsaHNbMF1bMF0gKiByaHNbMF1bMF0gKyBsaHNbMF1bMV0gKiByaHNbMV1bMF0gKyBsaHNbMF1bMl0gKiByaHNbMl1bMF0gKyBsaHNbMF1bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzBdWzFdID0gbGhzWzBdWzBdICogcmhzWzBdWzFdICsgbGhzWzBdWzFdICogcmhzWzFdWzFdICsgbGhzWzBdWzJdICogcmhzWzJdWzFdICsgbGhzWzBdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFswXVsyXSA9IGxoc1swXVswXSAqIHJoc1swXVsyXSArIGxoc1swXVsxXSAqIHJoc1sxXVsyXSArIGxoc1swXVsyXSAqIHJoc1syXVsyXSArIGxoc1swXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbMF1bM10gPSBsaHNbMF1bMF0gKiByaHNbMF1bM10gKyBsaHNbMF1bMV0gKiByaHNbMV1bM10gKyBsaHNbMF1bMl0gKiByaHNbMl1bM10gKyBsaHNbMF1bM10gKiByaHNbM11bM107XHJcbiAgICAgICAgbWF0cml4WzFdWzBdID0gbGhzWzFdWzBdICogcmhzWzBdWzBdICsgbGhzWzFdWzFdICogcmhzWzFdWzBdICsgbGhzWzFdWzJdICogcmhzWzJdWzBdICsgbGhzWzFdWzNdICogcmhzWzNdWzBdO1xyXG4gICAgICAgIG1hdHJpeFsxXVsxXSA9IGxoc1sxXVswXSAqIHJoc1swXVsxXSArIGxoc1sxXVsxXSAqIHJoc1sxXVsxXSArIGxoc1sxXVsyXSAqIHJoc1syXVsxXSArIGxoc1sxXVszXSAqIHJoc1szXVsxXTtcclxuICAgICAgICBtYXRyaXhbMV1bMl0gPSBsaHNbMV1bMF0gKiByaHNbMF1bMl0gKyBsaHNbMV1bMV0gKiByaHNbMV1bMl0gKyBsaHNbMV1bMl0gKiByaHNbMl1bMl0gKyBsaHNbMV1bM10gKiByaHNbM11bMl07XHJcbiAgICAgICAgbWF0cml4WzFdWzNdID0gbGhzWzFdWzBdICogcmhzWzBdWzNdICsgbGhzWzFdWzFdICogcmhzWzFdWzNdICsgbGhzWzFdWzJdICogcmhzWzJdWzNdICsgbGhzWzFdWzNdICogcmhzWzNdWzNdO1xyXG4gICAgICAgIG1hdHJpeFsyXVswXSA9IGxoc1syXVswXSAqIHJoc1swXVswXSArIGxoc1syXVsxXSAqIHJoc1sxXVswXSArIGxoc1syXVsyXSAqIHJoc1syXVswXSArIGxoc1syXVszXSAqIHJoc1szXVswXTtcclxuICAgICAgICBtYXRyaXhbMl1bMV0gPSBsaHNbMl1bMF0gKiByaHNbMF1bMV0gKyBsaHNbMl1bMV0gKiByaHNbMV1bMV0gKyBsaHNbMl1bMl0gKiByaHNbMl1bMV0gKyBsaHNbMl1bM10gKiByaHNbM11bMV07XHJcbiAgICAgICAgbWF0cml4WzJdWzJdID0gbGhzWzJdWzBdICogcmhzWzBdWzJdICsgbGhzWzJdWzFdICogcmhzWzFdWzJdICsgbGhzWzJdWzJdICogcmhzWzJdWzJdICsgbGhzWzJdWzNdICogcmhzWzNdWzJdO1xyXG4gICAgICAgIG1hdHJpeFsyXVszXSA9IGxoc1syXVswXSAqIHJoc1swXVszXSArIGxoc1syXVsxXSAqIHJoc1sxXVszXSArIGxoc1syXVsyXSAqIHJoc1syXVszXSArIGxoc1syXVszXSAqIHJoc1szXVszXTtcclxuICAgICAgICBtYXRyaXhbM11bMF0gPSBsaHNbM11bMF0gKiByaHNbMF1bMF0gKyBsaHNbM11bMV0gKiByaHNbMV1bMF0gKyBsaHNbM11bMl0gKiByaHNbMl1bMF0gKyBsaHNbM11bM10gKiByaHNbM11bMF07XHJcbiAgICAgICAgbWF0cml4WzNdWzFdID0gbGhzWzNdWzBdICogcmhzWzBdWzFdICsgbGhzWzNdWzFdICogcmhzWzFdWzFdICsgbGhzWzNdWzJdICogcmhzWzJdWzFdICsgbGhzWzNdWzNdICogcmhzWzNdWzFdO1xyXG4gICAgICAgIG1hdHJpeFszXVsyXSA9IGxoc1szXVswXSAqIHJoc1swXVsyXSArIGxoc1szXVsxXSAqIHJoc1sxXVsyXSArIGxoc1szXVsyXSAqIHJoc1syXVsyXSArIGxoc1szXVszXSAqIHJoc1szXVsyXTtcclxuICAgICAgICBtYXRyaXhbM11bM10gPSBsaHNbM11bMF0gKiByaHNbMF1bM10gKyBsaHNbM11bMV0gKiByaHNbMV1bM10gKyBsaHNbM11bMl0gKiByaHNbMl1bM10gKyBsaHNbM11bM10gKiByaHNbM11bM107XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVZlY3RvcjModjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgVmVjdG9yMygpO1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHJlcy54ID0gbVswXVswXSAqIHYueCArIG1bMF1bMV0gKiB2LnkgKyBtWzBdWzJdICogdi56O1xyXG4gICAgICAgIHJlcy55ID0gbVsxXVswXSAqIHYueCArIG1bMV1bMV0gKiB2LnkgKyBtWzFdWzJdICogdi56O1xyXG4gICAgICAgIHJlcy56ID0gbVsyXVswXSAqIHYueCArIG1bMl1bMV0gKiB2LnkgKyBtWzJdWzJdICogdi56O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVZlY3RvcjQodjogVmVjdG9yNCk6IFZlY3RvcjQge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgVmVjdG9yNCgpO1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHJlcy54ID0gbVswXVswXSAqIHYueCArIG1bMF1bMV0gKiB2LnkgKyBtWzBdWzJdICogdi56ICsgbVswXVszXSAqIHYudztcclxuICAgICAgICByZXMueSA9IG1bMV1bMF0gKiB2LnggKyBtWzFdWzFdICogdi55ICsgbVsxXVsyXSAqIHYueiArIG1bMV1bM10gKiB2Lnc7XHJcbiAgICAgICAgcmVzLnogPSBtWzJdWzBdICogdi54ICsgbVsyXVsxXSAqIHYueSArIG1bMl1bMl0gKiB2LnogKyBtWzJdWzNdICogdi53O1xyXG4gICAgICAgIHJlcy53ID0gbVszXVswXSAqIHYueCArIG1bM11bMV0gKiB2LnkgKyBtWzNdWzJdICogdi56ICsgbVszXVszXSAqIHYudztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VHJhbnNsYXRlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKG1bMF1bM10sIG1bMV1bM10sIG1bMl1bM10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRSb3RhdGUoKTogVmVjdG9yMyB7XHJcbiAgICAvLyAgICAgbGV0IG1hdCA9IHRoaXMubWF0cml4O1xyXG5cclxuICAgIC8vICAgICBsZXQgeCA9IE1hdGguYXRhbjIobWF0WzFdWzJdLCBtYXRbMl1bMl0pO1xyXG4gICAgLy8gICAgIGxldCB5ID0gTWF0aC5hdGFuMigtbWF0WzBdWzJdLCBNYXRoLnNxcnQobWF0WzFdWzJdICogbWF0WzFdWzJdICsgbWF0WzJdWzJdICogbWF0WzJdWzJdKSk7XHJcbiAgICAvLyAgICAgbGV0IHogPSBNYXRoLmF0YW4yKG1hdFswXVsxXSwgbWF0WzBdWzBdKTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHggLyBNYXRoLlBJICogMTgwLCB5IC8gTWF0aC5QSSAqIDE4MCwgeiAvIE1hdGguUEkgKiAxODApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSb3RhdGUoKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgLy/kuIDlrpropoHojrflj5bnuq/lh4DnmoTml4vovaznn6npmLXvvIzljbPljrvpmaTnvKnmlL7lgI3njodcclxuICAgICAgICBsZXQgbWF0ID0gdGhpcy5nZXRSb3RhdGVNYXRyaXgoKS5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHEgPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgICAgICB2YXIgdHJhY2UgPSBtYXRbMF1bMF0gKyBtYXRbMV1bMV0gKyBtYXRbMl1bMl07IC8vIEkgcmVtb3ZlZCArIDEuMGY7IHNlZSBkaXNjdXNzaW9uIHdpdGggRXRoYW5cclxuICAgICAgICB2YXIgcyA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0cmFjZSA+IDApIHsvLyBJIGNoYW5nZWQgTV9FUFNJTE9OIHRvIDBcclxuICAgICAgICAgICAgcyA9IDAuNSAvIE1hdGguc3FydCh0cmFjZSArIDEuMCk7XHJcbiAgICAgICAgICAgIHEudyA9IDAuMjUgLyBzO1xyXG4gICAgICAgICAgICBxLnggPSAobWF0WzJdWzFdIC0gbWF0WzFdWzJdKSAqIHM7XHJcbiAgICAgICAgICAgIHEueSA9IChtYXRbMF1bMl0gLSBtYXRbMl1bMF0pICogcztcclxuICAgICAgICAgICAgcS56ID0gKG1hdFsxXVswXSAtIG1hdFswXVsxXSkgKiBzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtYXRbMF1bMF0gPiBtYXRbMV1bMV0gJiYgbWF0WzBdWzBdID4gbWF0WzJdWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG1hdFswXVswXSAtIG1hdFsxXVsxXSAtIG1hdFsyXVsyXSk7XHJcbiAgICAgICAgICAgICAgICBxLncgPSAobWF0WzJdWzFdIC0gbWF0WzFdWzJdKSAvIHM7XHJcbiAgICAgICAgICAgICAgICBxLnggPSAwLjI1ICogcztcclxuICAgICAgICAgICAgICAgIHEueSA9IChtYXRbMF1bMV0gKyBtYXRbMV1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueiA9IChtYXRbMF1bMl0gKyBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRbMV1bMV0gPiBtYXRbMl1bMl0pIHtcclxuICAgICAgICAgICAgICAgIHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbWF0WzFdWzFdIC0gbWF0WzBdWzBdIC0gbWF0WzJdWzJdKTtcclxuICAgICAgICAgICAgICAgIHEudyA9IChtYXRbMF1bMl0gLSBtYXRbMl1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueCA9IChtYXRbMF1bMV0gKyBtYXRbMV1bMF0pIC8gcztcclxuICAgICAgICAgICAgICAgIHEueSA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gKG1hdFsxXVsyXSArIG1hdFsyXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtYXRbMl1bMl0gLSBtYXRbMF1bMF0gLSBtYXRbMV1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcS53ID0gKG1hdFsxXVswXSAtIG1hdFswXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS54ID0gKG1hdFswXVsyXSArIG1hdFsyXVswXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS55ID0gKG1hdFsxXVsyXSArIG1hdFsyXVsxXSkgLyBzO1xyXG4gICAgICAgICAgICAgICAgcS56ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSb3RhdGVNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9kZXYvc3JjL21hdGgvTWF0cml4NC5qc1xyXG4gICAgICAgIC8v5Zug5Li65peL6L2s55+p6Zi15q+U6L6D54m55q6K77yM5pyJ5pe25YCZ6KaB5Y2V54us5aSE55CG77yM5omA5pyJ5oul5pyJ5LiA5Liq5o+Q5Y+W5pa55rOVXHJcbiAgICAgICAgLy/mj5Dlj5bmlrnlvI/lvojnroDljZXvvIzlhYjojrflj5bnvKnmlL7lgLzvvIznhLblkI7liKnnlKjojrflj5bnvKnmlL7lgLznmoTljp/nkIbvvIzpgIblkJHpmaTljrvnvKnmlL7lgLzvvIzlsLHlvpfliLDnuq/lh4DnmoTml4vovaznn6npmLVcclxuICAgICAgICAvL+atpOaWueazleS4jeaUr+aMgeWPjeWwhOefqemYtVxyXG5cclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIHZhciB0ZSA9IG1hdC5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcy5tYXRyaXg7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuZ2V0U2NhbGUoKTtcclxuICAgICAgICB2YXIgc2NhbGVYID0gMSAvIHNjYWxlLng7XHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IDEgLyBzY2FsZS55O1xyXG4gICAgICAgIHZhciBzY2FsZVogPSAxIC8gc2NhbGUuejtcclxuXHJcbiAgICAgICAgdGVbMF1bMF0gPSBtZVswXVswXSAqIHNjYWxlWDtcclxuICAgICAgICB0ZVsxXVswXSA9IG1lWzFdWzBdICogc2NhbGVYO1xyXG4gICAgICAgIHRlWzJdWzBdID0gbWVbMl1bMF0gKiBzY2FsZVg7XHJcbiAgICAgICAgdGVbM11bMF0gPSAwO1xyXG5cclxuICAgICAgICB0ZVswXVsxXSA9IG1lWzBdWzFdICogc2NhbGVZO1xyXG4gICAgICAgIHRlWzFdWzFdID0gbWVbMV1bMV0gKiBzY2FsZVk7XHJcbiAgICAgICAgdGVbMl1bMV0gPSBtZVsyXVsxXSAqIHNjYWxlWTtcclxuICAgICAgICB0ZVszXVsxXSA9IDA7XHJcblxyXG4gICAgICAgIHRlWzBdWzJdID0gbWVbMF1bMl0gKiBzY2FsZVo7XHJcbiAgICAgICAgdGVbMV1bMl0gPSBtZVsxXVsyXSAqIHNjYWxlWjtcclxuICAgICAgICB0ZVsyXVsyXSA9IG1lWzJdWzJdICogc2NhbGVaO1xyXG4gICAgICAgIHRlWzNdWzJdID0gMDtcclxuXHJcbiAgICAgICAgdGVbMF1bM10gPSAwO1xyXG4gICAgICAgIHRlWzFdWzNdID0gMDtcclxuICAgICAgICB0ZVsyXVszXSA9IDA7XHJcbiAgICAgICAgdGVbM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFdWxlckFuZ2xlcygpOiBWZWN0b3IzIHtcclxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9kZXYvc3JjL21hdGgvTWF0cml4NC5qc1xyXG4gICAgICAgIC8v5LuO5peL6L2s55+p6Zi16YeM6I635Y+W5qyn5ouJ6KeSXHJcbiAgICAgICAgLy/lv4XpobvmmK/nuq/lh4DnmoTml4vovaznn6npmLVcclxuXHJcbiAgICAgICAgdmFyIGFuZ2xlID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRlID0gdGhpcy5nZXRSb3RhdGVNYXRyaXgoKS5tYXRyaXg7XHJcbiAgICAgICAgdmFyIG0xMSA9IHRlWzBdWzBdLCBtMTIgPSB0ZVswXVsxXSwgbTEzID0gdGVbMF1bMl07XHJcbiAgICAgICAgdmFyIG0yMSA9IHRlWzFdWzBdLCBtMjIgPSB0ZVsxXVsxXSwgbTIzID0gdGVbMV1bMl07XHJcbiAgICAgICAgdmFyIG0zMSA9IHRlWzJdWzBdLCBtMzIgPSB0ZVsyXVsxXSwgbTMzID0gdGVbMl1bMl07XHJcblxyXG4gICAgICAgIG0xMyA9IG0xMyA+IDEgPyAxIDogbTEzO1xyXG4gICAgICAgIG0xMyA9IG0xMyA8IC0xID8gLTEgOiBtMTM7XHJcbiAgICAgICAgYW5nbGUueSA9IE1hdGguYXNpbihtMTMpO1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMobTEzKSA8IDAuOTk5OTk5OSkge1xyXG4gICAgICAgICAgICBhbmdsZS54ID0gTWF0aC5hdGFuMigtbTIzLCBtMzMpO1xyXG4gICAgICAgICAgICBhbmdsZS56ID0gTWF0aC5hdGFuMigtbTEyLCBtMTEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuZ2xlLnggPSBNYXRoLmF0YW4yKG0zMiwgbTIyKTtcclxuICAgICAgICAgICAgYW5nbGUueiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoYW5nbGUueCAvIE1hdGguUEkgKiAxODAsIGFuZ2xlLnkgLyBNYXRoLlBJICogMTgwLCBhbmdsZS56IC8gTWF0aC5QSSAqIDE4MCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5tYXRyaXg7XHJcbiAgICAgICAgbGV0IHYgPSBuZXcgVmVjdG9yMygpO1xyXG5cclxuICAgICAgICB2LnggPSBNYXRoLnNxcnQobVswXVswXSAqIG1bMF1bMF0gKyBtWzFdWzBdICogbVsxXVswXSArIG1bMl1bMF0gKiBtWzJdWzBdKTtcclxuICAgICAgICB2LnkgPSBNYXRoLnNxcnQobVswXVsxXSAqIG1bMF1bMV0gKyBtWzFdWzFdICogbVsxXVsxXSArIG1bMl1bMV0gKiBtWzJdWzFdKTtcclxuICAgICAgICB2LnogPSBNYXRoLnNxcnQobVswXVsyXSAqIG1bMF1bMl0gKyBtWzFdWzJdICogbVsxXVsyXSArIG1bMl1bMl0gKiBtWzJdWzJdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zcG9zZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtMSA9IHRoaXMubWF0cml4O1xyXG4gICAgICAgIHZhciBtMiA9IG5ldyBNYXRyaXg0eDQoKS5tYXRyaXg7XHJcblxyXG4gICAgICAgIG0yWzBdWzBdID0gbTFbMF1bMF07IG0yWzBdWzFdID0gbTFbMV1bMF07IG0yWzBdWzJdID0gbTFbMl1bMF07IG0yWzBdWzNdID0gbTFbM11bMF07XHJcbiAgICAgICAgbTJbMV1bMF0gPSBtMVswXVsxXTsgbTJbMV1bMV0gPSBtMVsxXVsxXTsgbTJbMV1bMl0gPSBtMVsyXVsxXTsgbTJbMV1bM10gPSBtMVszXVsxXTtcclxuICAgICAgICBtMlsyXVswXSA9IG0xWzBdWzJdOyBtMlsyXVsxXSA9IG0xWzFdWzJdOyBtMlsyXVsyXSA9IG0xWzJdWzJdOyBtMlsyXVszXSA9IG0xWzNdWzJdO1xyXG4gICAgICAgIG0yWzNdWzBdID0gbTFbMF1bM107IG0yWzNdWzFdID0gbTFbMV1bM107IG0yWzNdWzJdID0gbTFbMl1bM107IG0yWzNdWzNdID0gbTFbM11bM107XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbTI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZShwb3M6IFZlY3RvcjMpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCBtID0gTWF0cml4NHg0LmdldFRyYW5zbGF0ZU1hdHJpeChwb3MpO1xyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbS5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZShxOiBRdWF0ZXJuaW9uKTogTWF0cml4NHg0O1xyXG4gICAgcHVibGljIHJvdGF0ZShldWxlckFuZ2xlczogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgcm90YXRlKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBNYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgcm90YXRlKCkge1xyXG4gICAgICAgIGxldCBtID0gbmV3IE1hdHJpeDR4NCgpO1xyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgUXVhdGVybmlvbikge1xyXG4gICAgICAgICAgICBtID0gTWF0cml4NHg0LmdldFJvdGF0ZU1hdHJpeEJ5UXVhdGVybmlvbihhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIG0gPSBNYXRyaXg0eDQuZ2V0Um90YXRlTWF0cml4QnlFdWxlckFuZ2xlcyhhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUoczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBNYXRyaXg0eDQuZ2V0U2NhbGVNYXRyaXgocyk7XHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtLm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9va0F0KHRhcmdldDogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgLy8gdG9kb1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8v6L2s5o2i5Yiw5pGE5b2x5py655yL5ZCR55qE55+p6Zi16YeMXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtVG9Mb29rQXRTcGFjZShleWU6IFZlY3RvcjMsIHRhcmdldFBvaW50OiBWZWN0b3IzLCB1cDogVmVjdG9yMyA9IFZlY3RvcjMuVVApOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIC8v5LuO5ZOq6YeM55yL5ZCR5ZOq6YeM77yM5Lmf5Y+v5Lul55CG6Kej5Li65pGE5b2x5py66KeG6KeS77yM5Y2z6KeC5a+f56m66Ze0XHJcbiAgICAgICAgLy/oi6XopoHlj5jmjaLliLDmkYTlvbHmnLrnqbrpl7TvvIzlj6/ku6XlgYforr7mlbTkuKrop4Llr5/nqbrpl7Tku6XmkYTlvbHmnLrkvY3kuo7kuJbnlYzlnZDmoIfljp/ngrnvvIznhLblkI7lsIbmiYDmnInniankvZPmnJ3mkYTlvbHmnLrljp/lhYjlnKjkuJbnlYznqbrpl7TkuK3nmoTkvY3nva7lj43lkJHnp7vliqjljbPlj69cclxuICAgICAgICAvL+WcqOe6uOS4iueUu+S4i+WbvuWwsea4heaZsOS6hlxyXG5cclxuICAgICAgICAvL+eUseS6jum7mOiupOefqemYteaYr1NSVOmhuuW6j+e7hOaIkOeahOWPmOaNouepuumXtO+8jOimgemAhuWQke+8jOWImeaYr1RSU+eahOmhuuW6j++8jOWNs+WFiOenu+WKqOWQjuaXi+i9rFxyXG4gICAgICAgIC8vMS7lkJHlj43mlrnlkJHlubPnp7tcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShuZXcgVmVjdG9yMygtZXllLngsIC1leWUueSwgLWV5ZS56KSk7XHJcblxyXG4gICAgICAgIC8vMi7lkJHlj43mlrnlkJHml4vovaxcclxuICAgICAgICAvL+WFiOiOt+WPluaRhOW9seS4lueVjOmDqOWdkOagh+i9tFxyXG4gICAgICAgIHZhciB6QXhpcyA9IFZlY3RvcjMuZGlmZmVyZW5jZShleWUsIHRhcmdldFBvaW50KS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvL+WboOS4uuaIkeS7rOaYr+WPs+aJi+ezu+e7n++8jOimgeaxgljvvIzliJnlv4Xpobt65LmYeVxyXG4gICAgICAgIHZhciB4QXhpcyA9IFZlY3RvcjMuY3Jvc3ModXAsIHpBeGlzKS5ub3JtYWxpemUoKTtcclxuICAgICAgICB2YXIgeUF4aXMgPSBWZWN0b3IzLmNyb3NzKHpBeGlzLCB4QXhpcykubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy/mnoTlu7rmkYTlvbHmnLrlj43mlrnlkJHml4vovaznn6npmLVcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdHJpeDR4NChcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoeEF4aXMpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCh5QXhpcyksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KHpBeGlzKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSkpO1xyXG5cclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdC5tdWx0aXBseSh0aGlzKS5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZydXN0dW0obGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IHJsID0gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBjb25zdCB0YiA9ICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgY29uc3QgZm4gPSAoZmFyIC0gbmVhcilcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KChuZWFyICogMikgLyBybCwgMCwgKHJpZ2h0ICsgbGVmdCkgLyBybCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIChuZWFyICogMikgLyB0YiwgKHRvcCArIGJvdHRvbSkgLyB0YiwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0oZmFyICsgbmVhcikgLyBmbiwgLShmYXIgKiBuZWFyICogMikgLyBmbiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0xLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3J0aG9ncmFwaGljKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogTWF0cml4NHg0IHtcclxuICAgICAgICBjb25zdCBybCA9IChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgY29uc3QgdGIgPSAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGNvbnN0IGZuID0gKGZhciAtIG5lYXIpXHJcblxyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgyIC8gcmwsIDAsIDAsIC0obGVmdCArIHJpZ2h0KSAvIHJsKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjQoMCwgMiAvIHRiLCAwLCAtKHRvcCArIGJvdHRvbSkgLyB0YiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0yIC8gZm4sIC0oZmFyICsgbmVhcikgLyBmbiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIDAsIDEpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXQubXVsdGlwbHkodGhpcykubWF0cml4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwZXJzcGVjdGl2ZShmb3Y6IG51bWJlciwgYXNwZWN0OiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGNvbnN0IGhmb3YgPSBmb3YgLyAxODAgKiBNYXRoLlBJIC8gMjtcclxuICAgICAgICBjb25zdCB0YW4gPSBNYXRoLnRhbihoZm92KTtcclxuXHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXRyaXg0eDQoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDEgLyAoYXNwZWN0ICogdGFuKSwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDEgLyB0YW4sIDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yNCgwLCAwLCAtKGZhciArIG5lYXIpIC8gKGZhciAtIG5lYXIpLCAtKDIgKiBmYXIgKiBuZWFyKSAvIChmYXIgLSBuZWFyKSksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3I0KDAsIDAsIC0xLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0Lm11bHRpcGx5KHRoaXMpLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW52ZXJzZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBtYXQgPSB0aGlzLm1hdHJpeDtcclxuXHJcbiAgICAgICAgY29uc3QgYTAwID0gbWF0WzBdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEwMSA9IG1hdFswXVsxXTtcclxuICAgICAgICBjb25zdCBhMDIgPSBtYXRbMF1bMl07XHJcbiAgICAgICAgY29uc3QgYTAzID0gbWF0WzBdWzNdO1xyXG4gICAgICAgIGNvbnN0IGExMCA9IG1hdFsxXVswXTtcclxuICAgICAgICBjb25zdCBhMTEgPSBtYXRbMV1bMV07XHJcbiAgICAgICAgY29uc3QgYTEyID0gbWF0WzFdWzJdO1xyXG4gICAgICAgIGNvbnN0IGExMyA9IG1hdFsxXVszXTtcclxuICAgICAgICBjb25zdCBhMjAgPSBtYXRbMl1bMF07XHJcbiAgICAgICAgY29uc3QgYTIxID0gbWF0WzJdWzFdO1xyXG4gICAgICAgIGNvbnN0IGEyMiA9IG1hdFsyXVsyXTtcclxuICAgICAgICBjb25zdCBhMjMgPSBtYXRbMl1bM107XHJcbiAgICAgICAgY29uc3QgYTMwID0gbWF0WzNdWzBdO1xyXG4gICAgICAgIGNvbnN0IGEzMSA9IG1hdFszXVsxXTtcclxuICAgICAgICBjb25zdCBhMzIgPSBtYXRbM11bMl07XHJcbiAgICAgICAgY29uc3QgYTMzID0gbWF0WzNdWzNdO1xyXG5cclxuICAgICAgICBjb25zdCBkZXQwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMFxyXG4gICAgICAgIGNvbnN0IGRldDAxID0gYTAwICogYTEyIC0gYTAyICogYTEwXHJcbiAgICAgICAgY29uc3QgZGV0MDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTBcclxuICAgICAgICBjb25zdCBkZXQwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMVxyXG4gICAgICAgIGNvbnN0IGRldDA0ID0gYTAxICogYTEzIC0gYTAzICogYTExXHJcbiAgICAgICAgY29uc3QgZGV0MDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTJcclxuICAgICAgICBjb25zdCBkZXQwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMFxyXG4gICAgICAgIGNvbnN0IGRldDA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwXHJcbiAgICAgICAgY29uc3QgZGV0MDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzBcclxuICAgICAgICBjb25zdCBkZXQwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGRldDEwID0gYTIxICogYTMzIC0gYTIzICogYTMxXHJcbiAgICAgICAgY29uc3QgZGV0MTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzJcclxuXHJcbiAgICAgICAgbGV0IGRldCA9IChkZXQwMCAqIGRldDExIC0gZGV0MDEgKiBkZXQxMCArIGRldDAyICogZGV0MDkgKyBkZXQwMyAqIGRldDA4IC0gZGV0MDQgKiBkZXQwNyArIGRldDA1ICogZGV0MDYpO1xyXG5cclxuICAgICAgICBpZiAoIWRldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTWF0cml4NHg0IGludmVyc2UgZmFpbGVkLCBkZXRlcm1pbmFudCBpcyAwXCIpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuXHJcbiAgICAgICAgbWF0WzBdWzBdID0gKGExMSAqIGRldDExIC0gYTEyICogZGV0MTAgKyBhMTMgKiBkZXQwOSkgKiBkZXRcclxuICAgICAgICBtYXRbMF1bMV0gPSAoLWEwMSAqIGRldDExICsgYTAyICogZGV0MTAgLSBhMDMgKiBkZXQwOSkgKiBkZXRcclxuICAgICAgICBtYXRbMF1bMl0gPSAoYTMxICogZGV0MDUgLSBhMzIgKiBkZXQwNCArIGEzMyAqIGRldDAzKSAqIGRldFxyXG4gICAgICAgIG1hdFswXVszXSA9ICgtYTIxICogZGV0MDUgKyBhMjIgKiBkZXQwNCAtIGEyMyAqIGRldDAzKSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVswXSA9ICgtYTEwICogZGV0MTEgKyBhMTIgKiBkZXQwOCAtIGExMyAqIGRldDA3KSAqIGRldFxyXG4gICAgICAgIG1hdFsxXVsxXSA9IChhMDAgKiBkZXQxMSAtIGEwMiAqIGRldDA4ICsgYTAzICogZGV0MDcpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzJdID0gKC1hMzAgKiBkZXQwNSArIGEzMiAqIGRldDAyIC0gYTMzICogZGV0MDEpICogZGV0XHJcbiAgICAgICAgbWF0WzFdWzNdID0gKGEyMCAqIGRldDA1IC0gYTIyICogZGV0MDIgKyBhMjMgKiBkZXQwMSkgKiBkZXRcclxuICAgICAgICBtYXRbMl1bMF0gPSAoYTEwICogZGV0MTAgLSBhMTEgKiBkZXQwOCArIGExMyAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVsxXSA9ICgtYTAwICogZGV0MTAgKyBhMDEgKiBkZXQwOCAtIGEwMyAqIGRldDA2KSAqIGRldFxyXG4gICAgICAgIG1hdFsyXVsyXSA9IChhMzAgKiBkZXQwNCAtIGEzMSAqIGRldDAyICsgYTMzICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzJdWzNdID0gKC1hMjAgKiBkZXQwNCArIGEyMSAqIGRldDAyIC0gYTIzICogZGV0MDApICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzBdID0gKC1hMTAgKiBkZXQwOSArIGExMSAqIGRldDA3IC0gYTEyICogZGV0MDYpICogZGV0XHJcbiAgICAgICAgbWF0WzNdWzFdID0gKGEwMCAqIGRldDA5IC0gYTAxICogZGV0MDcgKyBhMDIgKiBkZXQwNikgKiBkZXRcclxuICAgICAgICBtYXRbM11bMl0gPSAoLWEzMCAqIGRldDAzICsgYTMxICogZGV0MDEgLSBhMzIgKiBkZXQwMCkgKiBkZXRcclxuICAgICAgICBtYXRbM11bM10gPSAoYTIwICogZGV0MDMgLSBhMjEgKiBkZXQwMSArIGEyMiAqIGRldDAwKSAqIGRldFxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9GbG9hdDMyTGlzdCgpOiBGbG9hdDMyTGlzdCB7XHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLm1hdHJpeDtcclxuICAgICAgICAvL+eUseS6jk9wZW5HTOaYr+WIl+W6j+WtmOWCqO+8jOaJgOS7pemcgOimgei9rOe9ruS4gOS4i+efqemYtVxyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgbVswXVswXSwgbVsxXVswXSwgbVsyXVswXSwgbVszXVswXSxcclxuICAgICAgICAgICAgbVswXVsxXSwgbVsxXVsxXSwgbVsyXVsxXSwgbVszXVsxXSxcclxuICAgICAgICAgICAgbVswXVsyXSwgbVsxXVsyXSwgbVsyXVsyXSwgbVszXVsyXSxcclxuICAgICAgICAgICAgbVswXVszXSwgbVsxXVszXSwgbVsyXVszXSwgbVszXVszXVxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4NHg0KFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygwKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRSb3coMSksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Um93KDIpLFxyXG4gICAgICAgICAgICB0aGlzLmdldFJvdygzKSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgU1RBVElDIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUUlNNYXRyaXgocG9zOiBWZWN0b3IzLCBxdWF0OiBRdWF0ZXJuaW9uLCBzY2FsZTogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHRtID0gTWF0cml4NHg0LmdldFRyYW5zbGF0ZU1hdHJpeChwb3MpO1xyXG4gICAgICAgIGxldCBybSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24ocXVhdCk7XHJcbiAgICAgICAgbGV0IHNtID0gTWF0cml4NHg0LmdldFNjYWxlTWF0cml4KHNjYWxlKTtcclxuXHJcbiAgICAgICAgLy/lv4XpobvkuKXmoLzmjInnhaflhYhTY2FsZe+8jOWGjVJvdGF0Ze+8jOWGjVRyYW5zbGF0ZeeahOmhuuW6j++8jOWQpuWImeW+l+WIsOeahOe7k+aenOiCr+WumuaYr+S4jea7oeaEj+eahFxyXG4gICAgICAgIC8v5L6L5aaC5pyJ5LiA5LiqMVgx5q2j5pa55b2i5Zyo5Y6f54K577yM5oiR5Lus5oOz6KaB5b6X5Yiw5LiA5LiqMVgy77yM5bm25LiU5pac5ZCRNDXCsO+8jOiAjOS4lOemu+WdkOagh+WOn+eCuTHkuKrljZXkvY3lpIRcclxuICAgICAgICAvL+WmguaenOWFiOaXi+i9rO+8jOWGjee8qeaUvueahOivne+8jOaXi+i9rOaWueWQkeaYr+WvueS6hu+8jOS9huaYr+aIkeS7rOaYr+WwhuaXi+i9rOWQjjQ1wrDnmoTmraPmlrnlvaLnmoRZ6L205ouJ5Ly4MuWAje+8jOW+l+WIsOeahOaYr+S4gOS4quiiq+aLiemVv+eahOiPseW9olxyXG4gICAgICAgIC8v5aaC5p6c5YWI5bmz56e777yM5YaN5peL6L2s55qE6K+d77yM5Zug5Li65oiR5Lus5peL6L2s6YO95piv57uV552A5Z2Q5qCH5Y6f54K555qE77yM57uT5p6c6Ieq54S25piv5q2j5pa55b2i5LiN5piv6Ieq6Lqr5peL6L2sNDXCsO+8jOiAjOaYr+e7leedgOWOn+eCueaXi+i9rFxyXG4gICAgICAgIHJldHVybiB0bS5tdWx0aXBseShybS5tdWx0aXBseShzbSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VHJhbnNsYXRlTWF0cml4KHBvczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSAxOyBtWzBdWzFdID0gMDsgbVswXVsyXSA9IDA7IG1bMF1bM10gPSBwb3MueDtcclxuICAgICAgICBtWzFdWzBdID0gMDsgbVsxXVsxXSA9IDE7IG1bMV1bMl0gPSAwOyBtWzFdWzNdID0gcG9zLnk7XHJcbiAgICAgICAgbVsyXVswXSA9IDA7IG1bMl1bMV0gPSAwOyBtWzJdWzJdID0gMTsgbVsyXVszXSA9IHBvcy56O1xyXG4gICAgICAgIG1bM11bMF0gPSAwOyBtWzNdWzFdID0gMDsgbVszXVsyXSA9IDA7IG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Um90YXRlTWF0cml4QnlRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24pOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbGV0IG0gPSByZXN1bHQubWF0cml4O1xyXG5cclxuICAgICAgICBsZXQgbnVtID0gcS54ICogMjtcclxuICAgICAgICBsZXQgbnVtMiA9IHEueSAqIDI7XHJcbiAgICAgICAgbGV0IG51bTMgPSBxLnogKiAyO1xyXG4gICAgICAgIGxldCBudW00ID0gcS54ICogbnVtO1xyXG4gICAgICAgIGxldCBudW01ID0gcS55ICogbnVtMjtcclxuICAgICAgICBsZXQgbnVtNiA9IHEueiAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTcgPSBxLnggKiBudW0yO1xyXG4gICAgICAgIGxldCBudW04ID0gcS54ICogbnVtMztcclxuICAgICAgICBsZXQgbnVtOSA9IHEueSAqIG51bTM7XHJcbiAgICAgICAgbGV0IG51bTEwID0gcS53ICogbnVtO1xyXG4gICAgICAgIGxldCBudW0xMSA9IHEudyAqIG51bTI7XHJcbiAgICAgICAgbGV0IG51bTEyID0gcS53ICogbnVtMztcclxuXHJcbiAgICAgICAgbVswXVswXSA9IDEgLSAobnVtNSArIG51bTYpO1xyXG4gICAgICAgIG1bMV1bMF0gPSBudW03ICsgbnVtMTI7XHJcbiAgICAgICAgbVsyXVswXSA9IG51bTggLSBudW0xMTtcclxuICAgICAgICBtWzNdWzBdID0gMDtcclxuICAgICAgICBtWzBdWzFdID0gbnVtNyAtIG51bTEyO1xyXG4gICAgICAgIG1bMV1bMV0gPSAxIC0gKG51bTQgKyBudW02KTtcclxuICAgICAgICBtWzJdWzFdID0gbnVtOSArIG51bTEwO1xyXG4gICAgICAgIG1bM11bMV0gPSAwO1xyXG4gICAgICAgIG1bMF1bMl0gPSBudW04ICsgbnVtMTE7XHJcbiAgICAgICAgbVsxXVsyXSA9IG51bTkgLSBudW0xMDtcclxuICAgICAgICBtWzJdWzJdID0gMSAtIChudW00ICsgbnVtNSk7XHJcbiAgICAgICAgbVszXVsyXSA9IDA7XHJcbiAgICAgICAgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVszXSA9IDA7XHJcbiAgICAgICAgbVsyXVszXSA9IDA7XHJcbiAgICAgICAgbVszXVszXSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGU6IFZlY3RvcjMsIG9yZGVyOiBzdHJpbmcgPSBcIlhZWlwiKTogTWF0cml4NHg0IHtcclxuICAgICAgICAvL+mAmui/h+asp+aLieinkuiOt+WPluaXi+i9rOefqemYtVxyXG4gICAgICAgIC8v5YWI5YiG5Yir6I635Y+WWFla6L205LiK55qE5peL6L2s55+p6Zi177yM54S25ZCO5ZCI5bm26LW35p2lXHJcbiAgICAgICAgLy/ms6jmhI/vvJrml4vovazovbTnmoTpobrluo/lhYjlkI7kuI3lkIzvvIzkvJrlh7rnjrDkuI3lkIznmoTnu5PmnpzvvIzlm6DmraTlv4XpobvopoHmjIflrprml4vovazpobrluo9cclxuICAgICAgICAvL2h0dHA6Ly9wbGFubmluZy5jcy51aXVjLmVkdS9ub2RlMTAyLmh0bWxcclxuICAgICAgICAvL2h0dHBzOi8vdGhyZWVqcy5vcmcvZG9jcy8jYXBpL2VuL21hdGgvRXVsZXIub3JkZXJcclxuICAgICAgICB2YXIgeCA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoZS54LCBWZWN0b3IzLlJJR0hUKTtcclxuICAgICAgICB2YXIgeSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoZS55LCBWZWN0b3IzLlVQKTtcclxuICAgICAgICB2YXIgeiA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUF4aXMoZS56LCBWZWN0b3IzLkZPUldBUkQpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG9yZGVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYWVpcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHkubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWFpZXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geS5tdWx0aXBseSh6Lm11bHRpcGx5KHgpKTtcclxuICAgICAgICAgICAgY2FzZSBcIllYWlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHoubXVsdGlwbHkoeC5tdWx0aXBseSh5KSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJZWlhcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB4Lm11bHRpcGx5KHoubXVsdGlwbHkoeSkpO1xyXG4gICAgICAgICAgICBjYXNlIFwiWlhZXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geS5tdWx0aXBseSh4Lm11bHRpcGx5KHopKTtcclxuICAgICAgICAgICAgY2FzZSBcIlpZWFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHgubXVsdGlwbHkoeS5tdWx0aXBseSh6KSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUm90YXRpb24gb3JkZXIgZXJyb3IsIG11c3QgYmUgc2ltaWxhciB0byAnWFlaJ1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB6Lm11bHRpcGx5KHkubXVsdGlwbHkoeCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJvdGF0ZU1hdHJpeEJ5QXhpcyhhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgb3V0ID0gbmV3IE1hdHJpeDR4NCgpO1xyXG4gICAgICAgIHZhciBtID0gb3V0Lm1hdHJpeDtcclxuICAgICAgICB2YXIgeCA9IGF4aXMueCwgeSA9IGF4aXMueSwgeiA9IGF4aXMuejtcclxuICAgICAgICB2YXIgbGVuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICAgICAgdmFyIHMgPSAwLCBjID0gMCwgdCA9IDA7XHJcblxyXG4gICAgICAgIGFuZ2xlID0gTWF0aC5QSSAqIGFuZ2xlIC8gMTgwO1xyXG4gICAgICAgIGxlbiA9IDEgLyBsZW47XHJcbiAgICAgICAgeCAqPSBsZW47XHJcbiAgICAgICAgeSAqPSBsZW47XHJcbiAgICAgICAgeiAqPSBsZW47XHJcbiAgICAgICAgcyA9IE1hdGguc2luKGFuZ2xlKTtcclxuICAgICAgICBjID0gTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgIHQgPSAxIC0gYztcclxuICAgICAgICBtWzBdWzBdID0geCAqIHggKiB0ICsgYztcclxuICAgICAgICBtWzFdWzBdID0geSAqIHggKiB0ICsgeiAqIHM7XHJcbiAgICAgICAgbVsyXVswXSA9IHogKiB4ICogdCAtIHkgKiBzO1xyXG4gICAgICAgIG1bM11bMF0gPSAwO1xyXG4gICAgICAgIG1bMF1bMV0gPSB4ICogeSAqIHQgLSB6ICogcztcclxuICAgICAgICBtWzFdWzFdID0geSAqIHkgKiB0ICsgYztcclxuICAgICAgICBtWzJdWzFdID0geiAqIHkgKiB0ICsgeCAqIHM7XHJcbiAgICAgICAgbVszXVsxXSA9IDA7XHJcbiAgICAgICAgbVswXVsyXSA9IHggKiB6ICogdCArIHkgKiBzO1xyXG4gICAgICAgIG1bMV1bMl0gPSB5ICogeiAqIHQgLSB4ICogcztcclxuICAgICAgICBtWzJdWzJdID0geiAqIHogKiB0ICsgYztcclxuICAgICAgICBtWzNdWzJdID0gMDtcclxuICAgICAgICBtWzBdWzNdID0gMDtcclxuICAgICAgICBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzNdID0gMDtcclxuICAgICAgICBtWzNdWzNdID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U2NhbGVNYXRyaXgoczogVmVjdG9yMyk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXg0eDQoKTtcclxuICAgICAgICBsZXQgbSA9IHJlc3VsdC5tYXRyaXg7XHJcblxyXG4gICAgICAgIG1bMF1bMF0gPSBzLng7IG1bMF1bMV0gPSAwOyBtWzBdWzJdID0gMDsgbVswXVszXSA9IDA7XHJcbiAgICAgICAgbVsxXVswXSA9IDA7IG1bMV1bMV0gPSBzLnk7IG1bMV1bMl0gPSAwOyBtWzFdWzNdID0gMDtcclxuICAgICAgICBtWzJdWzBdID0gMDsgbVsyXVsxXSA9IDA7IG1bMl1bMl0gPSBzLno7IG1bMl1bM10gPSAwO1xyXG4gICAgICAgIG1bM11bMF0gPSAwOyBtWzNdWzFdID0gMDsgbVszXVsyXSA9IDA7IG1bM11bM10gPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlkZW50aXR5KCk6IE1hdHJpeDR4NCB7XHJcbiAgICAgICAgbGV0IG0gPSBuZXcgTWF0cml4NHg0KCk7XHJcbiAgICAgICAgbS5tYXRyaXhbMF1bMF0gPSAxO1xyXG4gICAgICAgIG0ubWF0cml4WzFdWzFdID0gMTtcclxuICAgICAgICBtLm1hdHJpeFsyXVsyXSA9IDE7XHJcbiAgICAgICAgbS5tYXRyaXhbM11bM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBtO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgTWF0cml4NHg0IH0gZnJvbSBcIi4vTWF0cml4NHg0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVhdGVybmlvbiB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoYW5nbGU6IG51bWJlciwgYXhpczogVmVjdG9yMyk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZXVsZXI6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGVBcm91bmQoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5ldWxlckFuZ2xlcyA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZXVsZXJBbmdsZXMoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeVF1YXRlcm5pb24odGhpcykuZ2V0RXVsZXJBbmdsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGV1bGVyQW5nbGVzKGU6IFZlY3RvcjMpIHtcclxuICAgICAgICB2YXIgcSA9IE1hdHJpeDR4NC5nZXRSb3RhdGVNYXRyaXhCeUV1bGVyQW5nbGVzKGUpLmdldFJvdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMudyA9IHEudztcclxuICAgICAgICB0aGlzLnggPSBxLng7XHJcbiAgICAgICAgdGhpcy55ID0gcS55O1xyXG4gICAgICAgIHRoaXMueiA9IHEuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlQXJvdW5kKGFuZ2xlOiBudW1iZXIsIGF4aXM6IFZlY3RvcjMpOiBRdWF0ZXJuaW9uIHtcclxuICAgICAgICBsZXQgcSA9IFF1YXRlcm5pb24uYW5nbGVBeGlzKGFuZ2xlLCBheGlzKTtcclxuICAgICAgICB0aGlzLnggPSBxLng7XHJcbiAgICAgICAgdGhpcy55ID0gcS55O1xyXG4gICAgICAgIHRoaXMueiA9IHEuejtcclxuICAgICAgICB0aGlzLncgPSBxLnc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEB6aCDlkJHph4/lm5vlhYPmlbDkuZjms5VcclxuICAgICovXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtUXVhdChhOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy8gYmVuY2htYXJrczogaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi10cmFuc2Zvcm0tVmVjMy1pbXBsZW1lbnRhdGlvbnNcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgbGV0IHEgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xyXG4gICAgICAgIGNvbnN0IGl4ID0gcS53ICogYS54ICsgcS55ICogYS56IC0gcS56ICogYS55O1xyXG4gICAgICAgIGNvbnN0IGl5ID0gcS53ICogYS55ICsgcS56ICogYS54IC0gcS54ICogYS56O1xyXG4gICAgICAgIGNvbnN0IGl6ID0gcS53ICogYS56ICsgcS54ICogYS55IC0gcS55ICogYS54O1xyXG4gICAgICAgIGNvbnN0IGl3ID0gLXEueCAqIGEueCAtIHEueSAqIGEueSAtIHEueiAqIGEuejtcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxyXG4gICAgICAgIG91dC54ID0gaXggKiBxLncgKyBpdyAqIC1xLnggKyBpeSAqIC1xLnogLSBpeiAqIC1xLnk7XHJcbiAgICAgICAgb3V0LnkgPSBpeSAqIHEudyArIGl3ICogLXEueSArIGl6ICogLXEueCAtIGl4ICogLXEuejtcclxuICAgICAgICBvdXQueiA9IGl6ICogcS53ICsgaXcgKiAtcS56ICsgaXggKiAtcS55IC0gaXkgKiAtcS54O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbih0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWbm+WFg+aVsOeQg+mdouaPkuWAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNsZXJwKGE6IFF1YXRlcm5pb24sIGI6IFF1YXRlcm5pb24sIHQ6IG51bWJlcik6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6XHJcbiAgICAgICAgLy8gICAgaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi1zbGVycC1pbXBsZW1lbnRhdGlvbnNcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIGxldCBzY2FsZTAgPSAwO1xyXG4gICAgICAgIGxldCBzY2FsZTEgPSAwO1xyXG5cclxuICAgICAgICAvLyBjYWxjIGNvc2luZVxyXG4gICAgICAgIGxldCBjb3NvbSA9IGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgICAgICAvLyBhZGp1c3Qgc2lnbnMgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAgICBpZiAoY29zb20gPCAwLjApIHtcclxuICAgICAgICAgICAgY29zb20gPSAtY29zb207XHJcbiAgICAgICAgICAgIGIueCA9IC1iLng7XHJcbiAgICAgICAgICAgIGIueSA9IC1iLnk7XHJcbiAgICAgICAgICAgIGIueiA9IC1iLno7XHJcbiAgICAgICAgICAgIGIudyA9IC1iLnc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBjb2VmZmljaWVudHNcclxuICAgICAgICBpZiAoKDEuMCAtIGNvc29tKSA+IDAuMDAwMDAxKSB7XHJcbiAgICAgICAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKVxyXG4gICAgICAgICAgICBjb25zdCBvbWVnYSA9IE1hdGguYWNvcyhjb3NvbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbm9tID0gTWF0aC5zaW4ob21lZ2EpO1xyXG4gICAgICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICAgICAgc2NhbGUxID0gTWF0aC5zaW4odCAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFwiZnJvbVwiIGFuZCBcInRvXCIgcXVhdGVybmlvbnMgYXJlIHZlcnkgY2xvc2VcclxuICAgICAgICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xyXG4gICAgICAgICAgICBzY2FsZTEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXHJcbiAgICAgICAgb3V0LnggPSBzY2FsZTAgKiBhLnggKyBzY2FsZTEgKiBiLng7XHJcbiAgICAgICAgb3V0LnkgPSBzY2FsZTAgKiBhLnkgKyBzY2FsZTEgKiBiLnk7XHJcbiAgICAgICAgb3V0LnogPSBzY2FsZTAgKiBhLnogKyBzY2FsZTEgKiBiLno7XHJcbiAgICAgICAgb3V0LncgPSBzY2FsZTAgKiBhLncgKyBzY2FsZTEgKiBiLnc7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkb3QoYTogUXVhdGVybmlvbiwgYjogUXVhdGVybmlvbik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlQXhpcyhhbmdsZTogbnVtYmVyLCBheGlzOiBWZWN0b3IzKTogUXVhdGVybmlvbiB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgICAgIGFuZ2xlID0gTWF0aC5QSSAqIGFuZ2xlIC8gMTgwO1xyXG4gICAgICAgIGFuZ2xlICo9IDAuNTtcclxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XHJcblxyXG4gICAgICAgIHJlcy54ID0gYXhpcy54ICogc2luO1xyXG4gICAgICAgIHJlcy55ID0gYXhpcy55ICogc2luO1xyXG4gICAgICAgIHJlcy56ID0gYXhpcy56ICogc2luO1xyXG4gICAgICAgIHJlcy53ID0gTWF0aC5jb3MoYW5nbGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlkZW50aXR5KCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbigwLCAwLCAwLCAxKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9WZWN0b3I0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yMiB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGdldCB3aWR0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy54OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjMpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHY6IFZlY3RvcjQpXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjMpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3I0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3IyKTogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWN0b3IyO1xyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3IyKTogVmVjdG9yMjtcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjI7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgLT0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkoZDogbnVtYmVyKTogVmVjdG9yMiB7XHJcbiAgICAgICAgdGhpcy54ICo9IGQ7XHJcbiAgICAgICAgdGhpcy55ICo9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpdmlkZShkOiBudW1iZXIpOiBWZWN0b3IyIHtcclxuICAgICAgICB0aGlzLnggLz0gZDtcclxuICAgICAgICB0aGlzLnkgLz0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUodjogVmVjdG9yMik6IFZlY3RvcjIge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChWZWN0b3IyLmRvdCh0aGlzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzcXJNYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gVmVjdG9yMi5kb3QodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICBBRERJVElPTkFMIEZVTkNUSU9OU1xyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGNsb25lKCk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3IyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIsIHQ6IG51bWJlcik6IFZlY3RvcjIge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlKHYxOiBWZWN0b3IyLCB2MjogVmVjdG9yMik6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHggPSB2Mi54IC0gdjEueDtcclxuICAgICAgICB2YXIgeSA9IHYyLnkgLSB2MS55O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMiwgdjI6IFZlY3RvcjIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMi5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKC0xLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgLTEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IzIHtcclxuXHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yMik7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodjogVmVjdG9yNClcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIFZlY3RvcjQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMF0uejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIE9QRVJBVElPTlMgT04gVkVDVE9SXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWRkKHY6IFZlY3RvcjMpOiBWZWN0b3IzO1xyXG4gICAgcHVibGljIGFkZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjdG9yMztcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCArPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiArPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh2OiBWZWN0b3IzKTogVmVjdG9yMztcclxuICAgIHB1YmxpYyBzdWJ0cmFjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjdG9yMztcclxuICAgIHN1YnRyYWN0KCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAtPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLnogLT0gYXJndW1lbnRzWzBdLno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjMpOiBWZWN0b3IzIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmVnYXRlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLm1hZ25pdHVkZTtcclxuXHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb3QodjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuZG90KHRoaXMsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcm9zcyh2OiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuY3Jvc3ModGhpcywgdik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjMuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IzLmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHModjogVmVjdG9yMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB2LnggPT0gdGhpcy54ICYmIHYueSA9PSB0aGlzLnkgJiYgdi56ID09IHRoaXMuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIl1cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBGVU5DVElPTlNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycCh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMsIHQ6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciB2ID0gbmV3IFZlY3RvcjMoKTtcclxuICAgICAgICB2LnggPSB2MS54ICsgdCAqICh2Mi54IC0gdjEueCk7XHJcbiAgICAgICAgdi55ID0gdjEueSArIHQgKiAodjIueSAtIHYxLnkpO1xyXG4gICAgICAgIHYueiA9IHYxLnogKyB0ICogKHYyLnogLSB2MS56KTtcclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5KHY6IFZlY3RvcjMsIHM6IG51bWJlcik6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh2LnggKiBzLCB2LnkgKiBzLCB2LnogKiBzKTtcclxuICAgIH0gXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhZGQodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHYxLnggKyB2Mi54LCB2MS55ICsgdjIueSwgdjEueiArIHYyLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3VidHJhY3QodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHYxLnggLSB2Mi54LCB2MS55IC0gdjIueSwgdjEueiAtIHYyLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3Jvc3ModjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogVmVjdG9yMyB7XHJcbiAgICAgICAgdmFyIHggPSB2MS55ICogdjIueiAtIHYxLnogKiB2Mi55O1xyXG4gICAgICAgIHZhciB5ID0gdjEueiAqIHYyLnggLSB2MS54ICogdjIuejtcclxuICAgICAgICB2YXIgeiA9IHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLng7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHgsIHksIHopO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UodjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgeCA9IHYyLnggLSB2MS54O1xyXG4gICAgICAgIHZhciB5ID0gdjIueSAtIHYxLnk7XHJcbiAgICAgICAgdmFyIHogPSB2Mi56IC0gdjEuejtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaWZmZXJlbmNlKHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIHZhciBkZXN0ID0gbmV3IFZlY3RvcjMoKTtcclxuXHJcbiAgICAgICAgZGVzdC54ID0gdjEueCAtIHYyLnhcclxuICAgICAgICBkZXN0LnkgPSB2MS55IC0gdjIueVxyXG4gICAgICAgIGRlc3QueiA9IHYxLnogLSB2Mi56XHJcblxyXG4gICAgICAgIHJldHVybiBkZXN0XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjdG9yMy5kb3QodjEsIHYyKSAvICh2MS5tYWduaXR1ZGUgKiB2Mi5tYWduaXR1ZGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIFNUQVRJQyBWQVJJQUJMRVNcclxuICAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgUklHSFQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IExFRlQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKC0xLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBVUCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgMSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRE9XTigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjMoMCwgLTEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEZPUldBUkQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEJBQ0soKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKDAsIDAsIC0xKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9WZWN0b3IyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yNCB7XHJcblxyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHIoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldCBnKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnk7IH1cclxuICAgIHB1YmxpYyBnZXQgYigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy56OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGEoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudzsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmVjdG9yMygpOiBWZWN0b3IzIHsgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMpOyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IyKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzKTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih2OiBWZWN0b3IzLCB3OiBudW1iZXIpO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXS54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yMykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHMubGVuZ3RoID09IDIgPyBhcmd1bWVudHNbMV0gOiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBPUEVSQVRJT05TIE9OIFZFQ1RPUlxyXG4gICAgICovXHJcblxyXG4gICAgcHVibGljIGFkZCh2OiBWZWN0b3I0KTogVmVjdG9yNDtcclxuICAgIHB1YmxpYyBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjdG9yNDtcclxuICAgIGFkZCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggKz0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgKz0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56ICs9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53ICs9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1YnRyYWN0KHY6IFZlY3RvcjQpOiBWZWN0b3I0O1xyXG4gICAgcHVibGljIHN1YnRyYWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlY3RvcjQ7XHJcbiAgICBzdWJ0cmFjdCgpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgVmVjdG9yNCkge1xyXG4gICAgICAgICAgICB0aGlzLnggLT0gYXJndW1lbnRzWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMueSAtPSBhcmd1bWVudHNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLncgLT0gYXJndW1lbnRzWzBdLnc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy55IC09IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdGhpcy56IC09IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgdGhpcy53IC09IGFyZ3VtZW50c1szXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5KGQ6IG51bWJlcik6IFZlY3RvcjQge1xyXG4gICAgICAgIHRoaXMueCAqPSBkO1xyXG4gICAgICAgIHRoaXMueSAqPSBkO1xyXG4gICAgICAgIHRoaXMueiAqPSBkO1xyXG4gICAgICAgIHRoaXMudyAqPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXZpZGUoZDogbnVtYmVyKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdGhpcy54IC89IGQ7XHJcbiAgICAgICAgdGhpcy55IC89IGQ7XHJcbiAgICAgICAgdGhpcy56IC89IGQ7XHJcbiAgICAgICAgdGhpcy53IC89IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHY6IFZlY3RvcjQpOiBWZWN0b3I0IHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgdGhpcy56ICo9IHYuejtcclxuICAgICAgICB0aGlzLncgKj0gdi53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZWdhdGUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubWFnbml0dWRlO1xyXG5cclxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFZlY3RvcjQuZG90KHRoaXMsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNxck1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBWZWN0b3I0LmRvdCh0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgIEFERElUSU9OQUwgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKTogVmVjdG9yNCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyh2OiBWZWN0b3I0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHYueCA9PSB0aGlzLnggJiYgdi55ID09IHRoaXMueSAmJiB2LnogPT0gdGhpcy56ICYmIHYudyA9PSB0aGlzLnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56ICsgXCIsIFwiICsgdGhpcy53ICsgXCJdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgRlVOQ1RJT05TXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAodjE6IFZlY3RvcjQsIHYyOiBWZWN0b3I0LCB0OiBudW1iZXIpOiBWZWN0b3I0IHtcclxuICAgICAgICB2YXIgdiA9IG5ldyBWZWN0b3I0KCk7XHJcbiAgICAgICAgdi54ID0gdjEueCArIHQgKiAodjIueCAtIHYxLngpO1xyXG4gICAgICAgIHYueSA9IHYxLnkgKyB0ICogKHYyLnkgLSB2MS55KTtcclxuICAgICAgICB2LnogPSB2MS56ICsgdCAqICh2Mi56IC0gdjEueik7XHJcbiAgICAgICAgdi53ID0gdjEudyArIHQgKiAodjIudyAtIHYxLncpO1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90KHYxOiBWZWN0b3I0LCB2MjogVmVjdG9yNCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLnogKyB2MS53ICogdjIudyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSh2MTogVmVjdG9yNCwgdjI6IFZlY3RvcjQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yNC5kb3QodjEsIHYyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICBTVEFUSUMgVkFSSUFCTEVTXHJcbiAgICAgKi9cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBaRVJPKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yNCgwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBPTkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3I0KDEsIDEsIDEsIDEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQm91bmRzIH0gZnJvbSBcIi4vTWF0aC9Cb3VuZHNcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL01hdGgvVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNoIHtcclxuICAgIGJvdW5kczogQm91bmRzW107ICAgICAgICAgICAgICAgICAgICAgICAvLyDljIXlm7Tnm5JcclxuICAgIG1hdGVyaWFsOiBzdHJpbmdbXTsgICAgICAgICAgICAgICAgICAgICAvLyDmnZDotKhcclxuICAgIHRyaWFuZ2xlczogbnVtYmVyW107ICAgICAgICAgICAgICAgICAgICAvLyDkuInop5LlvaJcclxuICAgIHZlcnRpY2VzOiBWZWN0b3IzW107ICAgICAgICAgICAgICAgICAgICAvLyDpobbngrlcclxuICAgIHV2OiBWZWN0b3IyW107ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVVlxyXG4gICAgbm9ybWFsczogVmVjdG9yM1tdOyAgICAgICAgICAgICAgICAgICAgIC8vIOazlee6v1xyXG4gICAgdGFuZ2VudHM6IFZlY3RvcjRbXTsgICAgICAgICAgICAgICAgICAgIC8vIOWIh+e6v++8jOWPr+S7juaooeWei+S4reiOt+WPluaIlumAmui/h+azlee6v+iuoeeul+W+l+WIsFxyXG4gICAgc3ViTWVzaGVzOiBTdWJNZXNoW107ICAgICAgICAgICAgICAgICAgIC8vIOWtkOe9keagvFxyXG5cclxuICAgIC8vIOajgOafpee9keagvOaYr+WQpuacieaViFxyXG4gICAgcHVibGljIGNoZWNrVmFsaWQoKTogQm9vbGVhbiB7XHJcbiAgICAgICAgLy8g5qOA5p+l5a6a54K55pWw44CBdXbmlbDjgIHms5Xnur/mlbDph4/mmK/lkKbkuI3kuLrpm7blubbkuJTnm7jnrYnvvIzlkIzml7bkuInop5LlvaLmlbDph4/lupTor6XmmK/kuInnmoTlgI3mlbBcclxuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNlcy5sZW5ndGggIT09IDBcclxuICAgICAgICAgICAgJiYgdGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IHRoaXMudXYubGVuZ3RoXHJcbiAgICAgICAgICAgICYmIHRoaXMudmVydGljZXMubGVuZ3RoID09PSB0aGlzLm5vcm1hbHMubGVuZ3RoXHJcbiAgICAgICAgICAgICYmIHRoaXMudHJpYW5nbGVzLmxlbmd0aCAhPT0gMFxyXG4gICAgICAgICAgICAmJiB0aGlzLnRyaWFuZ2xlcy5sZW5ndGggJSAzID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmHjeaWsOiuoeeul+WMheWbtOebklxyXG4gICAgcHVibGljIHJlY2FsY3VsYXRlQm91bmRzKCkge1xyXG4gICAgICAgIC8vVE9ET1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3ViTWVzaCB7XHJcbiAgICB2ZXJ0ZXhDb3VudDogbnVtYmVyO1xyXG4gICAgZmlyc3RWZXJ0ZXg6IG51bWJlcjtcclxuICAgIGluZGV4Q291bnQ6IG51bWJlcjtcclxuICAgIGluZGV4U3RhcnQ6IG51bWJlcjtcclxuICAgIGJvdW5kczogQm91bmRzO1xyXG4gICAgbWF0ZXJpYWw6IHN0cmluZztcclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL01hdGgvVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IFZlY3RvcjQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4vVHJhbnNmcm9tXCI7XHJcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vQ29tcG9uZW50L1JlbmRlcmVyXCI7XHJcbmltcG9ydCB7IE1lc2hSZW5kZXJlciB9IGZyb20gXCIuL0NvbXBvbmVudC9NZXNoUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ29tcG9uZW50L0NhbWVyYVwiO1xyXG5pbXBvcnQgeyBFbmdpbmUsIEVuZ2luZUNvbmZpZyB9IGZyb20gXCIuL0VuZ2luZVwiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9Mb2dnZXJcIjtcclxuXHJcbmVudW0gRHJhd01vZGUge1xyXG4gICAgV2lyZWZyYW1lLFxyXG4gICAgUG9pbnQsXHJcbiAgICBVVixcclxuICAgIE5vcm1hbCxcclxuICAgIFNoYWRlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmFzdGVyaXphdGlvblBpcGVsaW5lIHtcclxuICAgIHB1YmxpYyBkcmF3TW9kZTogRHJhd01vZGUgPSBEcmF3TW9kZS5VVjtcclxuICAgIHByaXZhdGUgdWludDMyVmlldzogVWludDMyQXJyYXk7XHJcblxyXG4gICAgY29uc3RydWN0b3IodWludDMyVmlldzogVWludDMyQXJyYXkpIHtcclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSB1aW50MzJWaWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBSZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5DbGVhcihDb2xvci5CTEFDSyk7XHJcblxyXG4gICAgICAgIC8vIOiOt+WPluWcuuaZr+S4reeahOaJgOacieaguea4uOaIj+WvueixoeW5tua4suafk1xyXG4gICAgICAgIGNvbnN0IHJvb3RPYmplY3RzID0gRW5naW5lLnNjZW5lTWFuYWdlci5nZXRBY3RpdmVTY2VuZSgpPy5nZXRSb290R2FtZU9iamVjdHMoKTtcclxuICAgICAgICBpZiAocm9vdE9iamVjdHMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBnYW1lT2JqZWN0IG9mIHJvb3RPYmplY3RzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDmmL7lvI/mjIflrprnsbvlnovlj4LmlbBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbmRlcnMgPSBnYW1lT2JqZWN0LmdldENvbXBvbmVudHNJbkNoaWxkcmVuKFJlbmRlcmVyKTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcmVuZGVyIG9mIHJlbmRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkRyYXdPYmplY3QocmVuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIubG9nKHJlbmRlci5nYW1lT2JqZWN0Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiDln7rnoYDnu5jliLbmjqXlj6NcclxuXHJcbiAgICBwdWJsaWMgQ2xlYXIoY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOS9v+eUqCBmaWxsIOaWueazleabv+S7o+W+queOr++8jOaAp+iDveabtOWlvVxyXG4gICAgICAgIHRoaXMudWludDMyVmlldy5maWxsKGNvbG9yKTtcclxuICAgICAgICAvLyDmiJbogIXkvb/nlKjlvqrnjq/vvIzkvYbmgKfog73ovoPlt65cclxuICAgICAgICAvLyBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2FudmFzV2lkdGg7IHgrKykge1xyXG4gICAgICAgIC8vICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuY2FudmFzSGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuU2V0UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3UGl4ZWwoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDnu5jliLbliLDlsY/luZXkuIrnmoTlg4/ntKDlupTor6XmmK/mlbTmlbDnmoRcclxuICAgICAgICAvLyDkvJjljJY6IOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4ID0gKHggfCAwKTtcclxuICAgICAgICB5ID0gKHkgfCAwKTtcclxuICAgICAgICAvLyB4ID0gTWF0aC5mbG9vcih4KTtcclxuICAgICAgICAvLyB5ID0gTWF0aC5mbG9vcih5KTtcclxuXHJcbiAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoIHx8IHkgPCAwIHx8IHkgPj0gRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXdbeSAqIEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aCArIHhdID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdMaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDkvb/nlKjkvY3ov5DnrpfkvJjljJbovrnnlYzmo4Dmn6VcclxuICAgICAgICAvLyDnlLvnur/liY3opoHov5vooYzovrnmo4Dmn6XvvIznoa7kv53nur/nmoTkuKTnq6/ngrnpg73lnKjlsY/luZXlhoXvvIzlpoLmnpznur/nmoTojIPlm7Tlvojplb/lubbkuJTkuI3lnKjlsY/luZXojIPlm7TlhoXvvIzpg73ov5vooYzorqHnrpfkvJrpgKDmiJDmtarotLnlpKfph4/nmoTotYTmupDvvIzoo4HliarmjonotoXlh7rnmoTpg6jliIZcclxuICAgICAgICBjb25zdCB3ID0gRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGggPSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0O1xyXG4gICAgICAgIGlmICgoKHgxIHwgeTEpIDwgMCkgfHwgKHgxID49IHcpIHx8ICh5MSA+PSBoKSB8fCAoKHgyIHwgeTIpIDwgMCkgfHwgKHgyID49IHcpIHx8ICh5MiA+PSBoKSkge1xyXG4gICAgICAgICAgICAvL1RPRE866KOB5Ymq5o6J6LaF5Ye65bGP5bmV55qE6YOo5YiGXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWPluaVtFxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG5cclxuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XHJcbiAgICAgICAgY29uc3QgZHkgPSB5MiAtIHkxO1xyXG5cclxuICAgICAgICAvLyDkuLrkvZXopoHljLrliIbmlpznjofmmK/lkKblgY/msLTlubPov5jmmK/lnoLnm7TlkaLvvJ/lm6DkuLrlpoLmnpzkuI3ljLrliIbvvIzkvovlpoLlvZPmlpznjoflpKfkuo4x5pe277yM5Lya5a+86Ie055u057q/57uY5Yi25LiN6L+e57ut77yM5Zug5Li6eeS8mui3s+WPmO+8jOiAjOS4jeaYr+i/nue7reeahOWinuWKoOOAglxyXG4gICAgICAgIC8vIOWPquacieaWnOeOh+WImuWlveS4ujHml7bvvIx46LefeeaJjeaYr+i/nue7reWQjOatpeiHquWinueahO+8jHgrMe+8jOWImXnkuZ8rMVxyXG4gICAgICAgIC8vIOaJgOS7pe+8jOW9k+aWnOeOh+Wkp+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh55L2c5Li65b6q546v5Y+Y6YeP77yM6ICM5b2T5pac546H5bCP5LqOMeaXtu+8jOaIkeS7rOmcgOimgeS9v+eUqHjkvZzkuLrlvqrnjq/lj5jph4/jgIJcclxuICAgICAgICAvLyDkuL7kuKrmnoHnq6/kvovlrZDvvIzlvZPmlpznjofkuLow5pe277yM55u057q/5bCx5piv5LiA5p2h5Z6C55u055u057q/77yM5aaC5p6c6L+Z5pe25YCZ6L+Y55SoeOS9nOS4uuW+queOr+WPmOmHj++8jOWImeS8muWvvOiHtOi/meadoeebtOe6v+S4iuaJgOaciXnngrnpg73lr7nlupTkuIDkuKp477yM5Lmf5bCx5piv6K+06L+Z5p2h57q/5Y+Y5oiQ5LiA5Liq54K55LqG44CCXHJcblxyXG4gICAgICAgIC8vIOaWnOeOh+Wwj+S6jjHvvIznm7Tnur/lgY/msLTlubPmg4XlhrXvvIzkvb/nlKh45L2c5Li65b6q546v5Y+Y6YePXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA+IE1hdGguYWJzKGR5KSkge1xyXG4gICAgICAgICAgICAvLyDkuIvpnaLnmoTlvqrnjq/nu5jliLblh73mlbDmmK/ku47lt6blvoDlj7PnmoTvvIzov5nph4zopoHnoa7kv53nu5PmnZ/ngrnlnKjlvIDlp4vngrnnmoTlj7PovrlcclxuICAgICAgICAgICAgaWYgKHgyIDwgeDEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgLy8g5pac546HXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkeSAvIGR4O1xyXG4gICAgICAgICAgICAvLyDmiKrot53vvIh5PWF4K2LvvIxiPXktYXjvvIlcclxuICAgICAgICAgICAgLy8gY29uc3QgYiA9IHkxIC0gYSAqIHgxO1xyXG4gICAgICAgICAgICBsZXQgeSA9IHkxO1xyXG4gICAgICAgICAgICAvLyDnu5jliLbnm7Tnur9cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIC8vIOebtOe6v+WFrOW8j3k9YXgrYu+8jOi/memHjOS4jeW/heiuoeeul+i/meS4quWFrOW8j++8jOWboOS4uuW9k3jliqAx6Ieq5aKe5pe277yMeeS5n+S8muWKoGHvvIzmiYDku6Xlj6/ku6Xnm7TmjqXnlKh5K2Hku6Pmm79heCti77yM566X5piv5LiA5Liq5oCn6IO95LyY5YyW54K5XHJcbiAgICAgICAgICAgICAgICAvLyB5ID0gYSAqIHggKyBiO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiJZcclxuICAgICAgICAgICAgLy8gY29uc3QgeXMgPSB0aGlzLkludGVycG9sYXRlKHgxLCB5MSwgeDIsIHkyKTtcclxuICAgICAgICAgICAgLy8gZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuRHJhd1BpeGVsKHgsIHlzW3ggLSB4MV0sIGNvbG9yKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmlpznjoflpKfkuo4x77yM55u057q/5YGP5Z6C55u05oOF5Ya177yM5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoeTIgPCB5MSkgW3gxLCB5MSwgeDIsIHkyXSA9IFt4MiwgeTIsIHgxLCB5MV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhID0gZHggLyBkeTtcclxuICAgICAgICAgICAgbGV0IHggPSB4MTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHhzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4c1t5IC0geTFdLCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDIsIHkyLCB4MywgeTMsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgzLCB5MywgeDEsIHkxLCBjb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZUZpbGxlZCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8g5rOo77ya5Lul5LiL5o+Q5Yiw55qE6ZW/6L6577yM54m55oyHeei9tOi3qOW6puacgOmVv+eahOi+ue+8jOiAjOS4jeaYr+WunumZheS4iueahOi+uemVv1xyXG5cclxuICAgICAgICAvLyDnlLvkuInop5LlvaLliY3opoHov5vooYzovrnmo4Dmn6XvvIznoa7kv53kuInop5LlvaLnmoTkuInkuKrngrnpg73lnKjlsY/luZXlhoXvvIzlpoLmnpzmnInngrnotoXlh7rlsY/luZXojIPlm7TvvIzliJnoo4HliarvvIzlubbnlJ/miJDmlrDnmoTkuInop5LlvaJcclxuICAgICAgICBjb25zdCB3ID0gRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGggPSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0O1xyXG4gICAgICAgIGlmICgoKHgxIHwgeTEpIDwgMCkgfHwgKHgxID49IHcpIHx8ICh5MSA+PSBoKSB8fCAoKHgyIHwgeTIpIDwgMCkgfHwgKHgyID49IHcpIHx8ICh5MiA+PSBoKSB8fCAoKHgzIHwgeTMpIDwgMCkgfHwgKHgzID49IHcpIHx8ICh5MyA+PSBoKSkge1xyXG4gICAgICAgICAgICAvL1RPRE866KOB5Ymq5o6J6LaF5Ye65bGP5bmV55qE6YOo5YiGXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWunumZhee7mOWItuWIsOWxj+W5leS4iueahOeCue+8jOW/hemhu+aYr+aVtOaVsO+8jOWPluaVtOS4gOS4i+OAguS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuICAgICAgICB4MyA9IHgzIHwgMDtcclxuICAgICAgICB5MyA9IHkzIHwgMDtcclxuXHJcbiAgICAgICAgLy8g5a+554K56L+b6KGM5o6S5bqP77yM5L2/5b6XeTE8PXkyPD15M++8jOWNs+WPr+ehruWumuS4ieinkuW9oueahOmVv+i+ueS4ukwxM++8jEwxMuWSjEwyM+WImeaYr+WPpuWkluS4pOadoeefrei+uVxyXG4gICAgICAgIGlmICh5MSA+IHkyKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzXSA9IFt4MywgeTMsIHgxLCB5MV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5M10gPSBbeDMsIHkzLCB4MiwgeTJdO1xyXG5cclxuICAgICAgICAvLyDojrflj5Yz5p2h6L6555qE54K55Z2Q5qCH5ZCI6ZuGXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDIzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MiwgeDIsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcblxyXG4gICAgICAgIC8vIOaLvOWQiOS4pOadoeefrei+ueS4uuS4gOadoemVv+i+ue+8iOWFiOenu+mZpOesrOS4gOadoei+ueeahOacgOWQjuS4gOS4quaVsOaNru+8jOmBv+WFjemHjeWkje+8iVxyXG4gICAgICAgIC8vIOeOsOWcqOWPmOaIkDLmnaHplb/ovrnvvIxMMTPlkoxMMTIzXHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcblxyXG4gICAgICAgIC8vIOWIpOaWrUwxM+WSjEwxMjPlk6rmnaHplb/ovrnmmK/lt6blk6rmnaHmmK/lj7PvvIzpg73lj5bmlbDnu4TkuK3pl7TnmoTngrnvvIzliKTmlq3osIHlt6bosIHlj7PljbPlj6/jgIJcclxuICAgICAgICAvLyDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y77yM5o+Q5Y2H5oCn6IO9XHJcbiAgICAgICAgLy8gY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBjb25zdCBtID0gKHAxMjMubGVuZ3RoID4+IDEpIHwgMDtcclxuICAgICAgICBsZXQgcExlZnQgPSBwMTIzO1xyXG4gICAgICAgIGxldCBwUmlnaHQgPSBwMTM7XHJcbiAgICAgICAgaWYgKHAxM1ttXSA8IHAxMjNbbV0pIHtcclxuICAgICAgICAgICAgcExlZnQgPSBwMTM7XHJcbiAgICAgICAgICAgIHBSaWdodCA9IHAxMjM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu5jliLbmsLTlubPnur/mrrVcclxuICAgICAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTM7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gcExlZnRbeSAtIHkxXTsgeCA8PSBwUmlnaHRbeSAtIHkxXTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcihcclxuICAgICAgICB4MTogbnVtYmVyLCB5MTogbnVtYmVyLFxyXG4gICAgICAgIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsXHJcbiAgICAgICAgeDM6IG51bWJlciwgeTM6IG51bWJlcixcclxuICAgICAgICBjb2xvcjE6IG51bWJlciwgY29sb3IyOiBudW1iZXIsIGNvbG9yMzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyDnlLvkuInop5LlvaLliY3opoHov5vooYzovrnmo4Dmn6XvvIznoa7kv53kuInop5LlvaLnmoTkuInkuKrngrnpg73lnKjlsY/luZXlhoXvvIzlpoLmnpzmnInngrnotoXlh7rlsY/luZXojIPlm7TvvIzliJnoo4HliarvvIzlubbnlJ/miJDmlrDnmoTkuInop5LlvaJcclxuICAgICAgICBjb25zdCB3ID0gRW5naW5lQ29uZmlnLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGggPSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0O1xyXG4gICAgICAgIGlmICgoKHgxIHwgeTEpIDwgMCkgfHwgKHgxID49IHcpIHx8ICh5MSA+PSBoKSB8fCAoKHgyIHwgeTIpIDwgMCkgfHwgKHgyID49IHcpIHx8ICh5MiA+PSBoKSB8fCAoKHgzIHwgeTMpIDwgMCkgfHwgKHgzID49IHcpIHx8ICh5MyA+PSBoKSkge1xyXG4gICAgICAgICAgICAvL1RPRE866KOB5Ymq5o6J6LaF5Ye65bGP5bmV55qE6YOo5YiGXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWunumZhee7mOWItuWIsOWxj+W5leS4iueahOeCue+8jOW/hemhu+aYr+aVtOaVsO+8jOWPluaVtOS4gOS4i+OAguS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuICAgICAgICB4MyA9IHgzIHwgMDtcclxuICAgICAgICB5MyA9IHkzIHwgMDtcclxuXHJcbiAgICAgICAgLy8g5a+554K55oyJWeWdkOagh+aOkuW6j++8jOehruS/nXkxIDw9IHkyIDw9IHkzXHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5MiwgY29sb3IxLCBjb2xvcjJdID0gW3gyLCB5MiwgeDEsIHkxLCBjb2xvcjIsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5MywgY29sb3IxLCBjb2xvcjNdID0gW3gzLCB5MywgeDEsIHkxLCBjb2xvcjMsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5MywgY29sb3IyLCBjb2xvcjNdID0gW3gzLCB5MywgeDIsIHkyLCBjb2xvcjMsIGNvbG9yMl07XHJcblxyXG4gICAgICAgIC8vIOaPkOWPllJHQuWIhumHj1xyXG4gICAgICAgIGNvbnN0IGMxID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjEpO1xyXG4gICAgICAgIGNvbnN0IGMyID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjIpO1xyXG4gICAgICAgIGNvbnN0IGMzID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjMpO1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzlh73mlbDvvIzpopzoibIx5LiO6aKc6ImyMuWcqGQxLWQy55qE6IyD5Zu05YaF5Z2H5YyA5o+S5YC8XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVDb2xvciA9IChkMTogbnVtYmVyLCByMTogbnVtYmVyLCBnMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMTogbnVtYmVyLFxyXG4gICAgICAgICAgICBkMjogbnVtYmVyLCByMjogbnVtYmVyLCBnMjogbnVtYmVyLCBiMjogbnVtYmVyLCBhMjogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj1xyXG4gICAgICAgICAgICAvLyDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y5ZKMTWF0aC5hYnPvvIzmj5DljYfmgKfog71cclxuICAgICAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGQyIC0gZDEpKTtcclxuICAgICAgICAgICAgY29uc3QgZHggPSAoKGQyID4gZDEgPyBkMiAtIGQxIDogZDEgLSBkMikgfCAwKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfmraXplb9cclxuICAgICAgICAgICAgY29uc3QgaW52RGVsdGEgPSAxIC8gKGQyIC0gZDEpO1xyXG4gICAgICAgICAgICBjb25zdCByU3RlcCA9IChyMiAtIHIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBnU3RlcCA9IChnMiAtIGcxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBiU3RlcCA9IChiMiAtIGIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBhU3RlcCA9IChhMiAtIGExKSAqIGludkRlbHRhO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSByMSwgZyA9IGcxLCBiID0gYjEsIGEgPSBhMTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0geyByLCBnLCBiLCBhIH07XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85LiJ5p2h6L6555qE5Z2Q5qCH5ZKM6aKc6ImyXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDEyQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEpO1xyXG5cclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMjNDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkyLCBjMi5yLCBjMi5nLCBjMi5iLCBjMi5hLCB5MywgYzMuciwgYzMuZywgYzMuYiwgYzMuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTEsIGMxLnIsIGMxLmcsIGMxLmIsIGMxLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgLy8g5ZCI5bm25Lik5p2h55+t6L65XHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcbiAgICAgICAgY29uc3QgcDEyM0NvbG9ycyA9IHAxMkNvbG9ycy5jb25jYXQocDIzQ29sb3JzKTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5bem5Y+z6L6555WMXHJcbiAgICAgICAgLy8gY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBjb25zdCBtID0gKHAxMjMubGVuZ3RoID4+IDEpIHwgMDtcclxuICAgICAgICBsZXQgbGVmdFBvaW50cyA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHJpZ2h0UG9pbnRzID0gcDEzO1xyXG4gICAgICAgIGxldCBsZWZ0Q29sb3JzID0gcDEyM0NvbG9ycztcclxuICAgICAgICBsZXQgcmlnaHRDb2xvcnMgPSBwMTNDb2xvcnM7XHJcblxyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIGxlZnRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgICAgIHJpZ2h0UG9pbnRzID0gcDEyMztcclxuICAgICAgICAgICAgbGVmdENvbG9ycyA9IHAxM0NvbG9ycztcclxuICAgICAgICAgICAgcmlnaHRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q6177yM5bm26L+b6KGM6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0geSAtIHkxO1xyXG4gICAgICAgICAgICBjb25zdCB4U3RhcnQgPSBsZWZ0UG9pbnRzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHhFbmQgPSByaWdodFBvaW50c1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVmdENvbG9yID0gbGVmdENvbG9yc1tpZHhdO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodENvbG9yID0gcmlnaHRDb2xvcnNbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmihOiuoeeul+minOiJsuW3ruWAvFxyXG4gICAgICAgICAgICBjb25zdCByRGlmZiA9IHJpZ2h0Q29sb3IuciAtIGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBjb25zdCBnRGlmZiA9IHJpZ2h0Q29sb3IuZyAtIGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBjb25zdCBiRGlmZiA9IHJpZ2h0Q29sb3IuYiAtIGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBjb25zdCBhRGlmZiA9IHJpZ2h0Q29sb3IuYSAtIGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5q2l6ZW/5ZKM6aKc6Imy5aKe6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGludkxlbmd0aCA9IDEgLyAoKHhFbmQgLSB4U3RhcnQpICsgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gckRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gZ0RpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gYkRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gYURpZmYgKiBpbnZMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyDliJ3lp4vpopzoibLlgLxcclxuICAgICAgICAgICAgbGV0IHIgPSBsZWZ0Q29sb3IucjtcclxuICAgICAgICAgICAgbGV0IGcgPSBsZWZ0Q29sb3IuZztcclxuICAgICAgICAgICAgbGV0IGIgPSBsZWZ0Q29sb3IuYjtcclxuICAgICAgICAgICAgbGV0IGEgPSBsZWZ0Q29sb3IuYTtcclxuXHJcbiAgICAgICAgICAgIC8vIOawtOW5s+aWueWQkeminOiJsuaPkuWAvFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDw9IHhFbmQ7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmluYWxDb2xvciA9ICgoYSB8IDApIDw8IDI0KSB8ICgoYiB8IDApIDw8IDE2KSB8ICgoZyB8IDApIDw8IDgpIHwgKHIgfCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGZpbmFsQ29sb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOe0r+WKoOminOiJsuWAvFxyXG4gICAgICAgICAgICAgICAgciArPSByU3RlcDtcclxuICAgICAgICAgICAgICAgIGcgKz0gZ1N0ZXA7XHJcbiAgICAgICAgICAgICAgICBiICs9IGJTdGVwO1xyXG4gICAgICAgICAgICAgICAgYSArPSBhU3RlcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5oqV5b2x55u45YWzXHJcblxyXG4gICAgLy8g5bCG6KeG5Y+j5LiK55qE5YaF5a655pig5bCE5Yiw5a6e6ZmF5bGP5bmV5LiKXHJcbiAgICBwdWJsaWMgVmlld3BvcnRUb0NhbnZhcyhwb2ludDogVmVjdG9yMikge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhuWPo+WuveW6puS4ujHkuKrljZXkvY1cclxuICAgICAgICAvLyDlm6DkuLphc3BlY3RSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h077yMXHJcbiAgICAgICAgLy8g5omA5Lul6KeG5Y+j6auY5bqmID0gMSAvIGFzcGVjdFJhdGlvID0gY2FudmFzSGVpZ2h0IC8gY2FudmFzV2lkdGhcclxuICAgICAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gMTtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IDEgLyBFbmdpbmVDb25maWcuYXNwZWN0UmF0aW87XHJcblxyXG4gICAgICAgIC8vIOWwhuaKleW9seWdkOagh+aYoOWwhOWIsENhbnZhc+WDj+e0oOWdkOagh1xyXG4gICAgICAgIC8vIFjlnZDmoIfvvJrku44gWy12aWV3cG9ydFdpZHRoLzIsIHZpZXdwb3J0V2lkdGgvMl0g5pig5bCE5YiwIFswLCBjYW52YXNXaWR0aF1cclxuICAgICAgICAvLyBZ5Z2Q5qCH77ya5LuOIFstdmlld3BvcnRIZWlnaHQvMiwgdmlld3BvcnRIZWlnaHQvMl0g5pig5bCE5YiwIFswLCBjYW52YXNIZWlnaHRdICjms6jmhI9Z6L205pa55ZCRKVxyXG4gICAgICAgIGNvbnN0IGNhbnZhc1ggPSAoKHBvaW50LnggKyB2aWV3cG9ydFdpZHRoIC8gMikgLyB2aWV3cG9ydFdpZHRoKSAqIEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgICAgICBjb25zdCBjYW52YXNZID0gRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodCAtICgoKHBvaW50LnkgKyB2aWV3cG9ydEhlaWdodCAvIDIpIC8gdmlld3BvcnRIZWlnaHQpICogRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodCk7IC8vIENhbnZhc+eahFnovbTpgJrluLjmmK/lkJHkuIvnmoRcclxuICAgICAgICBwb2ludC54ID0gY2FudmFzWDtcclxuICAgICAgICBwb2ludC55ID0gY2FudmFzWTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDpgI/op4bmipXlvbHvvIzlsIYzROWcuuaZr+eahOWdkOagh+i9rOaNouS4ujJE5bGP5bmV5Z2Q5qCH77yM5oqV5bCE5Yiw6KeG5Y+j5LiKXHJcbiAgICBwdWJsaWMgUHJvamVjdFZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMpOiBWZWN0b3IyIHtcclxuICAgICAgICAvLyDlgYforr7op4bngrnliLDov5Hoo4HpnaLvvIjop4blj6PvvInnmoTot53nprvmmK9k77yM6KeG5Y+j55qE5a695pivMVxyXG4gICAgICAgIC8vIOagueaNruS4ieinkuWHveaVsOacie+8mnRhbihmb3YvMikgPSAoMC41IC8gZClcclxuICAgICAgICAvLyDmiYDku6XvvJpkID0gMC41IC8gdGFuKGZvdi8yKVxyXG4gICAgICAgIGNvbnN0IGZvdkRlZ3JlZXMgPSA2MDtcclxuICAgICAgICBjb25zdCBmb3ZSYWRpYW5zID0gZm92RGVncmVlcyAqIChNYXRoLlBJIC8gMTgwKTsgLy8g5bCG6KeS5bqm6L2s5o2i5Li65byn5bqmXHJcbiAgICAgICAgY29uc3QgZCA9IDAuNSAvIE1hdGgudGFuKGZvdlJhZGlhbnMgLyAyKTtcclxuXHJcbiAgICAgICAgLy8g6YCP6KeG5YWs5byP77yM5YGH6K6+6KeG54K55L2N572uKDAsMCnvvIzop4bngrnliLDop4blj6Pot53nprvkuLpk77yM5Zy65pmv6YeM55qE54K55Li6UCh4LHkseinvvIzmipXlsITliLDop4blj6PkuIrnmoTngrnkuLpQJyh4LHkpXHJcbiAgICAgICAgLy8g5YiZ5qC55o2u55u45Ly85LiJ6KeS5b2i5pyJ77yaeiAvIGQgPSB4IC8geCcgPSB5IC8geSfvvIzlj6/lvpfliLDvvJpcclxuICAgICAgICAvLyB4JyA9IChkICogeCkgLyB6XHJcbiAgICAgICAgLy8geScgPSAoZCAqIHkpIC8gelxyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb25YID0gKGQgKiB2ZXJ0ZXgueCkgLyB2ZXJ0ZXguejtcclxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uWSA9IChkICogdmVydGV4LnkpIC8gdmVydGV4Lno7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihwcm9qZWN0aW9uWCwgcHJvamVjdGlvblkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlj5jmjaJcclxuXHJcbiAgICBwdWJsaWMgT2JqZWN0VG9DbGlwUG9zKHZlcnRleDogVmVjdG9yMyk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vVE9ET1xyXG4gICAgICAgIHJldHVybiBWZWN0b3IzLlpFUk87XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIE9iamVjdFRvV29ybGROb3JtYWwobm9ybWFsOiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFZlY3RvcjMge1xyXG4gICAgICAgIC8vIOiOt+WPluaooeWei+efqemYte+8iOWxgOmDqOWIsOS4lueVjOepuumXtOeahOWPmOaNouefqemYte+8iVxyXG4gICAgICAgIGNvbnN0IG1vZGVsTWF0cml4ID0gdHJhbnNmb3JtLmxvY2FsVG9Xb3JsZE1hdHJpeDtcclxuXHJcbiAgICAgICAgLy8g6K6h566X5qih5Z6L55+p6Zi155qE6YCG6L2s572u55+p6Zi1XHJcbiAgICAgICAgLy8g6YCG6L2s572u55+p6Zi15Y+v5Lul56Gu5L+d5rOV57q/5Zyo6Z2e5Z2H5YyA57yp5pS+5pe25LuN54S25L+d5oyB5LiO6KGo6Z2i5Z6C55u0XHJcbiAgICAgICAgY29uc3QgaW52ZXJzZVRyYW5zcG9zZU1vZGVsID0gbW9kZWxNYXRyaXguY2xvbmUoKS5pbnZlcnNlKCkudHJhbnNwb3NlKCk7XHJcblxyXG4gICAgICAgIC8vIOS9v+eUqOmAhui9rOe9ruefqemYteWPmOaNouazlee6v+WQkemHj++8iOW/veeVpeW5s+enu+WIhumHj++8jOWPquW6lOeUqOaXi+i9rOWSjOe8qeaUvueahOmAhuWPmOaNou+8iVxyXG4gICAgICAgIGNvbnN0IHdvcmxkTm9ybWFsID0gaW52ZXJzZVRyYW5zcG9zZU1vZGVsLm11bHRpcGx5VmVjdG9yMyhub3JtYWwpO1xyXG5cclxuICAgICAgICAvLyDlvZLkuIDljJbnu5PmnpzvvIznoa7kv53ms5Xnur/kv53mjIHljZXkvY3plb/luqZcclxuICAgICAgICByZXR1cm4gd29ybGROb3JtYWwubm9ybWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIOmhtueCueWkhOeQhumYtuaute+8muaooeWei+epuumXtCDihpLvvIjmqKHlnovnn6npmLXpmLXvvInihpIg5LiW55WM56m66Ze0IOKGku+8iOinhuWbvuefqemYte+8ieKGkiDop4Llr5/nqbrpl7Qg4oaS77yI5oqV5b2x55+p6Zi177yJ4oaSIOijgeWJquepuumXtCDihpLvvIjpgI/op4bpmaTms5XvvInihpIgTkRDIOepuumXtCDihpLvvIjop4blj6Plj5jmjaLvvInihpIg5bGP5bmV56m66Ze0IOKGkiDlhYnmoIXljJbmuLLmn5NcclxuICAgICAqL1xyXG4gICAgcHVibGljIFZlcnRleFByb2Nlc3NpbmdTdGFnZSh2ZXJ0aWNlczogVmVjdG9yM1tdLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IGNsaXBTcGFjZVZlcnRpY2VzID0gbmV3IEFycmF5KHZlcnRpY2VzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIC8vIOaehOW7uk1WUOefqemYtVxyXG4gICAgICAgIGNvbnN0IG1vZGVsTWF0cml4ID0gdHJhbnNmb3JtLmxvY2FsVG9Xb3JsZE1hdHJpeDtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBDYW1lcmEubWFpbkNhbWVyYTtcclxuICAgICAgICBjb25zdCBjYW1lcmFGb3J3YXJkID0gY2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVVwID0gY2FtZXJhLnRyYW5zZm9ybS51cDtcclxuICAgICAgICAvLyDmnoTlu7rkuIDkuKrlhYjmnJ3mkYTlvbHmnLrlj43mlrnlkJHnp7vliqjvvIzlho3lj43mlrnlkJHml4vovaznmoTnn6npmLXvvIzlhbblrp7lvpfliLDnmoTkuZ/lsLHmmK/kuIrpnaLmkYTlvbHmnLrnmoTkuJbnlYzlnZDmoIfnn6npmLVcclxuICAgICAgICBjb25zdCBtb2RlbFZpZXdNYXRyaXggPSBtb2RlbE1hdHJpeC5jbG9uZSgpLnRyYW5zZm9ybVRvTG9va0F0U3BhY2UoY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbiwgY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbi5hZGQoY2FtZXJhRm9yd2FyZCksIGNhbWVyYVVwKTtcclxuICAgICAgICBjb25zdCBtdnBNYXRyaXggPSBtb2RlbFZpZXdNYXRyaXgucGVyc3BlY3RpdmUoY2FtZXJhLmZvdiwgY2FtZXJhLmFzcGVjdCwgY2FtZXJhLm5lYXJDbGlwLCBjYW1lcmEuZmFyQ2xpcCk7XHJcblxyXG4gICAgICAgIC8vIDEuIE1WUOWPmOaNouWIsOijgeWJquepuumXtFxyXG4gICAgICAgIC8vIOaooeWei+epuumXtCAtPiDkuJbnlYznqbrpl7QgLT4g6KeC5a+f56m66Ze0IC0+IOijgeWJquepuumXtFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRpY2UgPSB2ZXJ0aWNlc1tpXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBsZXQgdiA9IG12cE1hdHJpeC5tdWx0aXBseVZlY3RvcjQobmV3IFZlY3RvcjQodmVydGljZSwgMSkpO1xyXG4gICAgICAgICAgICBjbGlwU3BhY2VWZXJ0aWNlc1tpXSA9IHY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAyLiDpgI/op4bpmaTms5XvvJrlsIboo4Hliarnqbrpl7TlnZDmoIfovazmjaLkuLrmoIflh4borr7lpIflnZDmoIfvvIhOREPvvIlcclxuICAgICAgICAvLyDoo4Hliarnqbrpl7QgLT4g5qCH5YeG5YyW6K6+5aSH5Z2Q5qCH77yITkRDIOepuumXtO+8iVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdiA9IGNsaXBTcGFjZVZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyB35YiG6YeP5piv6YCP6KeG5oqV5b2x5Lqn55Sf55qE77yM55So5LqO6YCP6KeG6Zmk5rOVXHJcbiAgICAgICAgICAgIGNvbnN0IHcgPSB2Lnc7IC8vIOWBh+iuvuS9oOeahFZlY3RvcjQvVmVjdG9yM+WunueOsOS4re+8jOm9kOasoeWdkOagh3flrZjlgqjlnKh35bGe5oCn5Lit44CC5aaC5p6c5rKh5pyJ77yM6ZyA6KaB56Gu5L+dTVZQ5Y+Y5o2i5pe25aSE55CG5LqG6b2Q5qyh5Z2Q5qCH44CCXHJcbiAgICAgICAgICAgIC8vIOWmguaenOayoeacieaYvuW8j+eahHfliIbph4/vvIzkuJRtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3Iz6L+U5Zue55qE5pivVmVjdG9yM++8jOmCo+S5iOmAmuW4uOiupOS4unc9Me+8iOato+S6pOaKleW9se+8ieaIluiAhemcgOimgeS7juWPmOaNouefqemYteS4reiAg+iZkemAj+inhlxyXG5cclxuICAgICAgICAgICAgLy8g6L+b6KGM6YCP6KeG6Zmk5rOV77yaeHl65YiG5Yir6Zmk5Luld1xyXG4gICAgICAgICAgICAvLyDms6jmhI/vvJrlpoLmnpzkvaDnmoTnn6npmLXkuZjms5XmsqHmnInlpITnkIbpvZDmrKHlnZDmoIfvvIjljbPov5Tlm57nmoR2ZXJ0aWNl5piv5LiJ57u05ZCR6YeP77yJ77yM6YKj5LmI5b6I5Y+v6IO95L2g55qE5Y+Y5o2i5rKh5pyJ5YyF5ZCr6YCP6KeG5oqV5b2x5Lqn55Sf55qEd+WIhumHj+OAglxyXG4gICAgICAgICAgICAvLyDlgYforr7kvaDnmoRtdnBNYXRyaXgubXVsdGlwbHlWZWN0b3Iz56Gu5a6e6L+U5Zue5LqG5YyF5ZCr6b2Q5qyh5Z2Q5qCH55qEVmVjdG9yNO+8jOaIluiAheacieS4gOS4qui/lOWbnlZlY3RvcjTnmoTmlrnms5XjgIJcclxuICAgICAgICAgICAgLy8g6L+Z6YeM5YGH6K6+IHByb2plY3RlZFZlcnRpY2VzIOS4reWtmOWCqOeahOaYryBWZWN0b3I077yM5oiW6ICF6Iez5bCR5pyJIHgsIHksIHosIHcg5bGe5oCn44CCXHJcblxyXG4gICAgICAgICAgICAvLyDlpoLmnpzmgqjnmoTlrp7njrDkuK3vvIznu4/ov4fpgI/op4bmipXlvbHnn6npmLXlj5jmjaLlkI7vvIzpobbngrnlt7Lnu4/mmK/kuIDkuKrpvZDmrKHlnZDmoIfvvIh4LCB5LCB6LCB377yJ77yM5YiZ6ZyA6KaB5Lul5LiL6Zmk5rOV77yaXHJcbiAgICAgICAgICAgIHYueCA9IHYueCAvIHc7XHJcbiAgICAgICAgICAgIHYueSA9IHYueSAvIHc7XHJcbiAgICAgICAgICAgIHYueiA9IHYueiAvIHc7IC8vIOWvueS6jua3seW6puS/oeaBr++8jOWPr+iDvei/mOmcgOimgei/m+S4gOatpeWkhOeQhu+8jOS9huWxj+W5leaYoOWwhOmAmuW4uOS4u+imgeWFs+azqHgseVxyXG4gICAgICAgICAgICAvLyDnu4/ov4fpgI/op4bpmaTms5XlkI7vvIzlnZDmoIfkvY3kuo7moIflh4borr7lpIflnZDmoIfvvIhOREPvvInnqbrpl7TvvIzpgJrluLh4LCB5LCB66IyD5Zu05ZyoWy0xLCAxXe+8iE9wZW5HTOmjjuagvO+8ieaIllswLCAxXe+8iERpcmVjdFjpo47moLzvvInkuYvpl7TjgIJcclxuICAgICAgICAgICAgLy8g5YGH6K6+5oiR5Lus55qETkRD5pivWy0xLCAxXeiMg+WbtOOAglxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMy4g6KeG5Y+j5Y+Y5o2i77ya5bCGTkRD5Z2Q5qCH5pig5bCE5Yiw5bGP5bmV5Z2Q5qCHXHJcbiAgICAgICAgLy8g5qCH5YeG5YyW6K6+5aSH5Z2Q5qCH77yITkRDIOepuumXtO+8iSAtPiDlsY/luZXnqbrpl7RcclxuICAgICAgICAvLyDojrflj5bnlLvluIPvvIjmiJbop4blj6PvvInnmoTlrr3luqblkozpq5jluqZcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IG5ldyBBcnJheShjbGlwU3BhY2VWZXJ0aWNlcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcFNwYWNlVmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbmRjID0gY2xpcFNwYWNlVmVydGljZXNbaV07IC8vIOatpOaXtm5kY+W6lOivpeaYr+e7j+i/h+mAj+inhumZpOazleWQjueahE5EQ+WdkOagh1xyXG5cclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeOS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuV2lkdGhdXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblggPSAoKG5kYy54ICsgMSkgLyAyKSAqIEVuZ2luZUNvbmZpZy5jYW52YXNXaWR0aDtcclxuICAgICAgICAgICAgLy8g5bCGTkRD55qEeeS7jlstMSwgMV3mmKDlsITliLBbMCwgc2NyZWVuSGVpZ2h0XeOAguazqOaEj+Wxj+W5leWdkOagh+mAmuW4uHnlkJHkuIvkuLrmraPvvIzogIxOREPnmoR55ZCR5LiK5Li65q2j77yM5omA5Lul6ZyA6KaB57+76L2sXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblkgPSBFbmdpbmVDb25maWcuY2FudmFzSGVpZ2h0IC0gKCgobmRjLnkgKyAxKSAvIDIpICogRW5naW5lQ29uZmlnLmNhbnZhc0hlaWdodCk7XHJcbiAgICAgICAgICAgIC8vIHrliIbph4/pgJrluLjnlKjkuo7mt7HluqbmtYvor5XvvIzov5nph4zmiJHku6zlj6rlhbPlv4PlsY/luZV4LHlcclxuICAgICAgICAgICAgLy8g5aaC5p6c5L2g55qETkRDeuiMg+WbtOaYr1stMSwxXeS4lOmcgOimgeaYoOWwhOWIsFswLDFd77yI5L6L5aaCV2ViR1BV5p+Q5Lqb5oOF5Ya177yJ77yM5Y+v5Lul57G75Ly85aSE55CG77yaY29uc3Qgc2NyZWVuWiA9IChuZGMueiArIDEpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHNjcmVlblZlcnRpY2VzW2ldID0geyB4OiBzY3JlZW5YLCB5OiBzY3JlZW5ZIH07IC8vIOWtmOWCqOWxj+W5leWdkOagh1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNjcmVlblZlcnRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiDnroDljZXlj5jmjaLpmLbmrrXvvJrmsqHmnInpgJrov4fnn6npmLXorqHnrpfvvIzogIzmmK/nroDljZXnmoTnm7jkvLzkuInop5LlvaLljp/nkIbvvIzkuInop5Llh73mlbDnrpflh7pNVlDlj5jmjaLot5/lsY/luZXmmKDlsITvvIznkIbop6PotbfmnaXmr5TovoPnroDljZXvvIzkvYbmr4/kuKrpobbngrnpg73nu4/ov4fku47lpLTliLDlsL7nmoTorqHnrpfvvIzmr5TovoPogJfmgKfog71cclxuICAgICAqL1xyXG4gICAgcHVibGljIEVhc3lWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2UodmVydGljZXM6IFZlY3RvcjNbXSwgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBjbGlwU3BhY2VWZXJ0aWNlcyA9IG5ldyBBcnJheSh2ZXJ0aWNlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyDnroDljZXlj5jmjaJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCB2ZXJ0aWNlID0gdmVydGljZXNbaV0uY2xvbmUoKTtcclxuICAgICAgICAgICAgLy8g5YWI5Y+Y5o2i77yM5b+F6aG75Lil5qC85oyJ54Wn5YWI57yp5pS+77yM5YaN5peL6L2s77yM5YaN5bmz56e7XHJcbiAgICAgICAgICAgIHRoaXMuU2NhbGVWZXJ0ZXgodmVydGljZSwgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdGhpcy5Sb3RhdGVWZXJ0ZXgodmVydGljZSwgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdGhpcy5UcmFuc2xhdGVWZXJ0ZXgodmVydGljZSwgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgLy8g5YaN5oqV5b2xXHJcbiAgICAgICAgICAgIGNsaXBTcGFjZVZlcnRpY2VzW2ldID0gdGhpcy5Qcm9qZWN0VmVydGV4KHZlcnRpY2UpO1xyXG4gICAgICAgICAgICAvLyDlho3op4blj6PmmKDlsIRcclxuICAgICAgICAgICAgdGhpcy5WaWV3cG9ydFRvQ2FudmFzKGNsaXBTcGFjZVZlcnRpY2VzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbGlwU3BhY2VWZXJ0aWNlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2NhbGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZlcnRleC54ICo9IHRyYW5zZm9ybS5zY2FsZS54O1xyXG4gICAgICAgIHZlcnRleC55ICo9IHRyYW5zZm9ybS5zY2FsZS55O1xyXG4gICAgICAgIHZlcnRleC56ICo9IHRyYW5zZm9ybS5zY2FsZS56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBSb3RhdGVWZXJ0ZXgodmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IGV1bGVyQW5nbGVzID0gdHJhbnNmb3JtLnJvdGF0aW9uLmV1bGVyQW5nbGVzO1xyXG5cclxuICAgICAgICBjb25zdCBjb3NYID0gTWF0aC5jb3MoZXVsZXJBbmdsZXMueCk7XHJcbiAgICAgICAgY29uc3Qgc2luWCA9IE1hdGguc2luKGV1bGVyQW5nbGVzLngpO1xyXG4gICAgICAgIGNvbnN0IGNvc1kgPSBNYXRoLmNvcyhldWxlckFuZ2xlcy55KTtcclxuICAgICAgICBjb25zdCBzaW5ZID0gTWF0aC5zaW4oZXVsZXJBbmdsZXMueSk7XHJcbiAgICAgICAgY29uc3QgY29zWiA9IE1hdGguY29zKGV1bGVyQW5nbGVzLnopO1xyXG4gICAgICAgIGNvbnN0IHNpblogPSBNYXRoLnNpbihldWxlckFuZ2xlcy56KTtcclxuICAgICAgICAvLyDlhYjnu5Va6L205peL6L2sXHJcbiAgICAgICAgY29uc3QgeCA9IHZlcnRleC54ICogY29zWiAtIHZlcnRleC55ICogc2luWjtcclxuICAgICAgICBjb25zdCB5ID0gdmVydGV4LnggKiBzaW5aICsgdmVydGV4LnkgKiBjb3NaO1xyXG4gICAgICAgIHZlcnRleC54ID0geDtcclxuICAgICAgICB2ZXJ0ZXgueSA9IHk7XHJcbiAgICAgICAgLy8g5YaN57uVWei9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHogPSB2ZXJ0ZXgueiAqIGNvc1kgLSB2ZXJ0ZXgueCAqIHNpblk7XHJcbiAgICAgICAgY29uc3QgeDIgPSB2ZXJ0ZXgueiAqIHNpblkgKyB2ZXJ0ZXgueCAqIGNvc1k7XHJcbiAgICAgICAgdmVydGV4LnogPSB6O1xyXG4gICAgICAgIHZlcnRleC54ID0geDI7XHJcbiAgICAgICAgLy8g5pyA5ZCO57uVWOi9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHkyID0gdmVydGV4LnkgKiBjb3NYIC0gdmVydGV4LnogKiBzaW5YO1xyXG4gICAgICAgIGNvbnN0IHoyID0gdmVydGV4LnkgKiBzaW5YICsgdmVydGV4LnogKiBjb3NYO1xyXG4gICAgICAgIHZlcnRleC55ID0geTI7XHJcbiAgICAgICAgdmVydGV4LnogPSB6MjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVHJhbnNsYXRlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2ZXJ0ZXgueCArPSB0cmFuc2Zvcm0ucG9zaXRpb24ueDtcclxuICAgICAgICB2ZXJ0ZXgueSArPSB0cmFuc2Zvcm0ucG9zaXRpb24ueTtcclxuICAgICAgICB2ZXJ0ZXgueiArPSB0cmFuc2Zvcm0ucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5YmU6Zmk6KOB5YmqXHJcblxyXG4gICAgLy8g6KeG6ZSl5L2T5YmU6ZmkXHJcbiAgICBwdWJsaWMgRnJ1c3R1bUN1bGxpbmcoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOiDjOmdouWJlOmZpFxyXG4gICAgcHVibGljIEJhY2tmYWNlQ3VsbGluZygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YGu5oyh5YmU6ZmkXHJcbiAgICBwdWJsaWMgT2NjbHVzaW9uQ3VsbGluZygpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENsaXBUcmlhbmdsZSh0cmlhbmdsZTogVmVjdG9yM1tdKSB7XHJcbiAgICAgICAgLy8gMS7orqHnrpfkuInop5LlvaLnmoTkuK3lv4NcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgKHRyaWFuZ2xlWzBdLnggKyB0cmlhbmdsZVsxXS54ICsgdHJpYW5nbGVbMl0ueCkgLyAzLFxyXG4gICAgICAgICAgICAodHJpYW5nbGVbMF0ueSArIHRyaWFuZ2xlWzFdLnkgKyB0cmlhbmdsZVsyXS55KSAvIDMsXHJcbiAgICAgICAgICAgICh0cmlhbmdsZVswXS56ICsgdHJpYW5nbGVbMV0ueiArIHRyaWFuZ2xlWzJdLnopIC8gM1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOe7mOWItueJqeS9k1xyXG5cclxuICAgIHB1YmxpYyBEcmF3T2JqZWN0KHJlbmRlcmVyOiBSZW5kZXJlcikge1xyXG4gICAgICAgIGNvbnN0IG1lc2ggPSAocmVuZGVyZXIgYXMgTWVzaFJlbmRlcmVyKS5tZXNoO1xyXG4gICAgICAgIGlmICghbWVzaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0cmlhbmdsZXMgPSBtZXNoLnRyaWFuZ2xlcztcclxuXHJcbiAgICAgICAgLy8gMS7liZTpmaRcclxuICAgICAgICB0aGlzLkZydXN0dW1DdWxsaW5nKCk7XHJcbiAgICAgICAgdGhpcy5CYWNrZmFjZUN1bGxpbmcoKTtcclxuICAgICAgICB0aGlzLk9jY2x1c2lvbkN1bGxpbmcoKTtcclxuXHJcbiAgICAgICAgLy8gMi7lj5jmjaJcclxuICAgICAgICAvLyBNVlDlj5jmjaJcclxuICAgICAgICBjb25zdCBzY3JlZW5WZXJ0aWNlcyA9IHRoaXMuVmVydGV4UHJvY2Vzc2luZ1N0YWdlKG1lc2gudmVydGljZXMsIHJlbmRlcmVyLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgLy8g566A5Y2VTVZQ5Y+Y5o2iXHJcbiAgICAgICAgLy8gY29uc3Qgc2NyZWVuVmVydGljZXMgPSB0aGlzLkVhc3lWZXJ0ZXhQcm9jZXNzaW5nU3RhZ2Uob2JqKTtcclxuXHJcbiAgICAgICAgLy8gMy7oo4HliapcclxuXHJcbiAgICAgICAgLy8gNC7lhYnmoIXljJbkuI7lg4/ntKDnu5jnlLtcclxuICAgICAgICAvLyDmnIDlkI7nu5jliLbkuInop5LlvaLliLDlsY/luZXkuIpcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWFuZ2xlcy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICBjb25zdCBwMSA9IHNjcmVlblZlcnRpY2VzW3RyaWFuZ2xlc1tpXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0gc2NyZWVuVmVydGljZXNbdHJpYW5nbGVzW2kgKyAxXV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAzID0gc2NyZWVuVmVydGljZXNbdHJpYW5nbGVzW2kgKyAyXV07XHJcblxyXG4gICAgICAgICAgICAvLyDnur/moYbmqKHlvI/vvIzmmoLkuI3mlK/mjIHpobbngrnoibJcclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhd01vZGUgPT09IERyYXdNb2RlLldpcmVmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGUocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZHJhd01vZGUgPT09IERyYXdNb2RlLlBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbChwMS54LCBwMS55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbChwMi54LCBwMi55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbChwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuVVYpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAxX3V2ID0gbWVzaC51dlt0cmlhbmdsZXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDJfdXYgPSBtZXNoLnV2W3RyaWFuZ2xlc1tpICsgMV1dO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDNfdXYgPSBtZXNoLnV2W3RyaWFuZ2xlc1tpICsgMl1dO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDFfY29sb3IgPSBuZXcgQ29sb3IocDFfdXYueCAqIDI1NSwgcDFfdXYueSAqIDI1NSwgMCkuVG9VaW50MzIoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAyX2NvbG9yID0gbmV3IENvbG9yKHAyX3V2LnggKiAyNTUsIHAyX3V2LnkgKiAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwM19jb2xvciA9IG5ldyBDb2xvcihwM191di54ICogMjU1LCBwM191di55ICogMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGVGaWxsZWRXaXRoVmVydGV4Q29sb3IocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgcDFfY29sb3IsIHAyX2NvbG9yLCBwM19jb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuTm9ybWFsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMV9ub3JtYWwgPSB0aGlzLk9iamVjdFRvV29ybGROb3JtYWwobWVzaC5ub3JtYWxzW3RyaWFuZ2xlc1tpXV0sIHJlbmRlcmVyLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMl9ub3JtYWwgPSB0aGlzLk9iamVjdFRvV29ybGROb3JtYWwobWVzaC5ub3JtYWxzW3RyaWFuZ2xlc1tpICsgMV1dLCByZW5kZXJlci50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDNfbm9ybWFsID0gdGhpcy5PYmplY3RUb1dvcmxkTm9ybWFsKG1lc2gubm9ybWFsc1t0cmlhbmdsZXNbaSArIDJdXSwgcmVuZGVyZXIudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIC8vIOWwhuazlee6v+WIhumHj+S7jiBbLTEsIDFdIOaYoOWwhOWIsCBbMCwgMjU1XVxyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSBNYXRoLmZsb29yKChwMV9ub3JtYWwueCArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGxldCBnID0gTWF0aC5mbG9vcigocDFfbm9ybWFsLnkgKyAxKSAqIDAuNSAqIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYiA9IE1hdGguZmxvb3IoKHAxX25vcm1hbC56ICsgMSkgKiAwLjUgKiAyNTUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDFfY29sb3IgPSBuZXcgQ29sb3IociwgZywgYikuVG9VaW50MzIoKTtcclxuICAgICAgICAgICAgICAgIHIgPSBNYXRoLmZsb29yKChwMl9ub3JtYWwueCArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGcgPSBNYXRoLmZsb29yKChwMl9ub3JtYWwueSArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGIgPSBNYXRoLmZsb29yKChwMl9ub3JtYWwueiArIDEpICogMC41ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAyX2NvbG9yID0gbmV3IENvbG9yKHIsIGcsIGIpLlRvVWludDMyKCk7XHJcbiAgICAgICAgICAgICAgICByID0gTWF0aC5mbG9vcigocDNfbm9ybWFsLnggKyAxKSAqIDAuNSAqIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBnID0gTWF0aC5mbG9vcigocDNfbm9ybWFsLnkgKyAxKSAqIDAuNSAqIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBiID0gTWF0aC5mbG9vcigocDNfbm9ybWFsLnogKyAxKSAqIDAuNSAqIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwM19jb2xvciA9IG5ldyBDb2xvcihyLCBnLCBiKS5Ub1VpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGVGaWxsZWRXaXRoVmVydGV4Q29sb3IocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgcDFfY29sb3IsIHAyX2NvbG9yLCBwM19jb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcmF3TW9kZSA9PT0gRHJhd01vZGUuU2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZUZpbGxlZChwMS54LCBwMS55LCBwMi54LCBwMi55LCBwMy54LCBwMy55LCBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOW3peWFt+WHveaVsFxyXG5cclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyDnur/mgKfmj5LlgLxcclxuICAgIC8vLyDkvKDlhaUy5Liq54K577yM6L+U5Zue5a6D5Lus57uE5oiQ57q/5q6155qE5o+S5YC844CCXHJcbiAgICAvLy8g6KaB5rGC77yaXHJcbiAgICAvLy8gMS4g6KaB5YWI566X5Ye655u057q/5YGP5rC05bmz6L+Y5piv5Z6C55u077yM5aaC5p6c5piv5YGP5rC05bmz77yI5pac546H5bCP5LqOMe+8ie+8jOWImeS7pXjkuLrlvqrnjq/vvIzkvKDlhaXpobrluo/mmK8oeDEseTEseDIseTIp77yM5Y+N5LmL5aaC5p6c55u057q/5YGP5Z6C55u077yM5YiZ5pivKHkxLHgxLHkyLHgyKVxyXG4gICAgLy8vIDIuIOWQjOaXtuimgeehruS/nee6v+auteeCueeahOaWueWQkeaYr+S7juW3puW+gOWPs+aIluS7juS4iuW+gOS4i++8jOS+i+Wmgue6v+auteaYr+WBj+awtOW5s+eahOivne+8jOimgeehruS/nXgyPngx77yM5aaC5p6c5piv5YGP5Z6C55u055qE6K+d77yM6KaB56Gu5L+deTI+eTFcclxuICAgIC8vLyDkuL7kuKrkvovlrZDvvJpcclxuICAgIC8vLyDngrkoMCwgMCnlkowoMiwxKe+8jOS8oOWFpeeahOWPguaVsOaYrygwLCAwLCAyLCAxKe+8jOi/lOWbnueahOaYrygoMi0wKSsxPTMp5Liq5YC877yM6L+Z5Lqb5YC85piv5LuOKDAtMSnkuK3pl7Tmj5LlgLznmoTvvIzljbMoMCwgMC41LCAxKVxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIHByaXZhdGUgSW50ZXJwb2xhdGUoYTE6IG51bWJlciwgYjE6IG51bWJlciwgYTI6IG51bWJlciwgYjI6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgICAgICAvLyDpooTliIbphY3mlbDnu4TlpKflsI/ku6Xpgb/lhY3liqjmgIHmianlrrlcclxuICAgICAgICAvLyBjb25zdCBkeCA9IE1hdGguYWJzKE1hdGguZmxvb3IoYTIgLSBhMSkpO1xyXG4gICAgICAgIGNvbnN0IGR4ID0gKChhMiA+IGExID8gYTIgLSBhMSA6IGExIC0gYTIpIHwgMCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuICAgICAgICBjb25zdCBhID0gKGIyIC0gYjEpIC8gKGEyIC0gYTEpO1xyXG4gICAgICAgIGxldCBkID0gYjE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGR4OyBpKyspIHtcclxuICAgICAgICAgICAgdmFsdWVbaV0gPSBkO1xyXG4gICAgICAgICAgICBkICs9IGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxufSIsImltcG9ydCB7IENhbWVyYSB9IGZyb20gXCIuLi9Db21wb25lbnQvQ2FtZXJhXCI7XHJcbmltcG9ydCB7IENhbWVyYUNvbnRyb2xsZXIgfSBmcm9tIFwiLi4vQ29tcG9uZW50L0NhbWVyYUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgTWVzaFJlbmRlcmVyIH0gZnJvbSBcIi4uL0NvbXBvbmVudC9NZXNoUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgT2JqUm90YXRlIH0gZnJvbSBcIi4uL0NvbXBvbmVudC9PYmpSb3RhdGVcIjtcclxuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFF1YXRlcm5pb24gfSBmcm9tIFwiLi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XHJcbmltcG9ydCB7IEFzc2V0TG9hZGVyIH0gZnJvbSBcIi4uL1V0aWxzL0Fzc2V0TG9hZGVyXCI7XHJcbmltcG9ydCB7IFNjZW5lIH0gZnJvbSBcIi4vU2NlbmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBNYWluU2NlbmUgPSB7XHJcbiAgICBuYW1lOiBcIk1haW5TY2VuZVwiLFxyXG4gICAgaW5pdGZ1bjogKHNjZW5lOiBTY2VuZSkgPT4ge1xyXG4gICAgICAgIC8vIOebuOaculxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBHYW1lT2JqZWN0KFwiY2FtZXJhXCIpO1xyXG4gICAgICAgIGNhbWVyYS50cmFuc2Zvcm0ucm90YXRpb24gPSBuZXcgUXVhdGVybmlvbihuZXcgVmVjdG9yMyg0NSwgMCwgMCkpO1xyXG4gICAgICAgIGNhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAzLCAtMyk7XHJcbiAgICAgICAgc2NlbmUuYWRkR2FtZU9iamVjdChjYW1lcmEpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoQ2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuYWRkQ29tcG9uZW50KENhbWVyYUNvbnRyb2xsZXIpO1xyXG5cclxuICAgICAgICBsZXQgb2JqOiBHYW1lT2JqZWN0O1xyXG4gICAgICAgIC8vIOWKoOi9veaooeWei1xyXG4gICAgICAgIEFzc2V0TG9hZGVyLmxvYWRNb2RlbCgncmVzb3VyY2VzL2ZlbWFsZTAyL2ZlbWFsZTAyLm9iaicsIDAuMDEpLnRoZW4oKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgIG9iaiA9IG5ldyBHYW1lT2JqZWN0KFwiZmVtYWxlMDJcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVyID0gb2JqLmFkZENvbXBvbmVudChNZXNoUmVuZGVyZXIpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5tZXNoID0gbW9kZWw7XHJcbiAgICAgICAgICAgIG9iai5hZGRDb21wb25lbnQoT2JqUm90YXRlKTtcclxuICAgICAgICAgICAgc2NlbmUuYWRkR2FtZU9iamVjdChvYmopO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBBc3NldExvYWRlci5sb2FkTW9kZWwoJ3Jlc291cmNlcy9jdWJlLm9iaicpLnRoZW4oKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1YmUgPSBuZXcgR2FtZU9iamVjdChcImN1YmVcIik7XHJcbiAgICAgICAgICAgIGN1YmUudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMiwgMCwgMCk7XHJcbiAgICAgICAgICAgIGN1YmUudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjMoMC4xLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVyID0gY3ViZS5hZGRDb21wb25lbnQoTWVzaFJlbmRlcmVyKTtcclxuICAgICAgICAgICAgcmVuZGVyZXIubWVzaCA9IG1vZGVsO1xyXG4gICAgICAgICAgICBjdWJlLnRyYW5zZm9ybS5zZXRQYXJlbnQob2JqLnRyYW5zZm9ybSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuLi9HYW1lT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NlbmUge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcm9vdEdhbWVPYmplY3RzOiBHYW1lT2JqZWN0W10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGFkZEdhbWVPYmplY3QoZ2FtZU9iamVjdDogR2FtZU9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucm9vdEdhbWVPYmplY3RzLnB1c2goZ2FtZU9iamVjdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyByZW1vdmVHYW1lT2JqZWN0KGdhbWVPYmplY3Q6IEdhbWVPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucm9vdEdhbWVPYmplY3RzLmluZGV4T2YoZ2FtZU9iamVjdCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RHYW1lT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFJvb3RHYW1lT2JqZWN0cygpOiBHYW1lT2JqZWN0W10ge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5yb290R2FtZU9iamVjdHNdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIOabtOaWsOaJgOacieaguea4uOaIj+WvueixoeWPiuWFtuWtkOWvueixoVxyXG4gICAgICAgIGZvciAoY29uc3QgZ2FtZU9iamVjdCBvZiB0aGlzLnJvb3RHYW1lT2JqZWN0cykge1xyXG4gICAgICAgICAgICBnYW1lT2JqZWN0LnN0YXJ0Q29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICBnYW1lT2JqZWN0LnVwZGF0ZUNvbXBvbmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTY2VuZSB9IGZyb20gXCIuL1NjZW5lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NlbmVNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc2NlbmVzOiBNYXA8c3RyaW5nLCBTY2VuZT4gPSBuZXcgTWFwPHN0cmluZywgU2NlbmU+KCk7XHJcbiAgICBwcml2YXRlIGFjdGl2ZVNjZW5lOiBTY2VuZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTY2VuZShuYW1lOiBzdHJpbmcpOiBTY2VuZSB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmUgPSBuZXcgU2NlbmUobmFtZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMuc2V0KG5hbWUsIHNjZW5lKTtcclxuICAgICAgICByZXR1cm4gc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNjZW5lKG5hbWU6IHN0cmluZyk6IFNjZW5lIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2VuZXMuZ2V0KG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBY3RpdmVTY2VuZShzY2VuZTogU2NlbmUgfCBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNjZW5lID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZFNjZW5lID0gdGhpcy5zY2VuZXMuZ2V0KHNjZW5lKTtcclxuICAgICAgICAgICAgaWYgKGZvdW5kU2NlbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBmb3VuZFNjZW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QWN0aXZlU2NlbmUoKTogU2NlbmUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVTY2VuZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlQWN0aXZlU2NlbmUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlU2NlbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWRTY2VuZShkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoIWRhdGEubmFtZSB8fCAhZGF0YS5pbml0ZnVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMluWcuuaZr1xyXG4gICAgICAgIGNvbnN0IG1haW5TY2VuZSA9IHRoaXMuY3JlYXRlU2NlbmUoZGF0YS5uYW1lKTtcclxuICAgICAgICBkYXRhLmluaXRmdW4obWFpblNjZW5lKTtcclxuICAgICAgICB0aGlzLnNldEFjdGl2ZVNjZW5lKG1haW5TY2VuZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgeyBNYXRyaXg0eDQgfSBmcm9tIFwiLi9NYXRoL01hdHJpeDR4NFwiO1xyXG5pbXBvcnQgeyBRdWF0ZXJuaW9uIH0gZnJvbSBcIi4vTWF0aC9RdWF0ZXJuaW9uXCI7XHJcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yNFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdDogR2FtZU9iamVjdDtcclxuICAgIHB1YmxpYyByZWFkb25seSBjaGlsZHJlbjogQXJyYXk8VHJhbnNmb3JtPjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnQ6IFRyYW5zZm9ybSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFBvczogVmVjdG9yMztcclxuICAgIHByaXZhdGUgX3RlbXBSb3Q6IFF1YXRlcm5pb247XHJcbiAgICBwcml2YXRlIF90ZW1wU2NhbGU6IFZlY3RvcjM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZU9iamVjdDogR2FtZU9iamVjdCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdCA9IGdhbWVPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBBcnJheTxUcmFuc2Zvcm0+KCk7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl90ZW1wUG9zID0gVmVjdG9yMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuX3RlbXBSb3QgPSBRdWF0ZXJuaW9uLmlkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuX3RlbXBTY2FsZSA9IFZlY3RvcjMuT05FO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VsZk1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHJldHVybiBNYXRyaXg0eDQuZ2V0VFJTTWF0cml4KHRoaXMuX3RlbXBQb3MsIHRoaXMuX3RlbXBSb3QsIHRoaXMuX3RlbXBTY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBsb2NhbFRvV29ybGRNYXRyaXgoKTogTWF0cml4NHg0IHtcclxuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5sb2NhbFRvV29ybGRNYXRyaXggOiBNYXRyaXg0eDQuaWRlbnRpdHk7XHJcbiAgICAgICAgcmV0dXJuIHAubXVsdGlwbHkodGhpcy5zZWxmTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkVG9Mb2NhbE1hdHJpeCgpOiBNYXRyaXg0eDQge1xyXG4gICAgICAgIHZhciBwID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LndvcmxkVG9Mb2NhbE1hdHJpeCA6IE1hdHJpeDR4NC5pZGVudGl0eTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxmTWF0cml4LmludmVyc2UoKS5tdWx0aXBseShwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeCh4OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeSh5OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueSA9IHk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHooKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgeih6OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueiA9IHo7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGZvcndhcmQoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLy/miJHku6zopoHlvpfliLDnmoTmmK/kuIDkuKrmlrnlkJHvvIzlm6DmraTkuI3pnIDopoHkvY3nva7kv6Hmga/vvIzlsIbpvZDmrKHlnZDmoIfnmoR36K6+572u5Li6MO+8jOaKm+W8g+aOieWdkOagh+S/oeaBr1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5GT1JXQVJELCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHVwKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1dvcmxkU3BhY2UoVmVjdG9yMy5VUCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByaWdodCgpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Xb3JsZFNwYWNlKFZlY3RvcjMuUklHSFQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24oKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBQb3MuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHBvc2l0aW9uKHBvczogVmVjdG9yMykge1xyXG4gICAgICAgIHRoaXMuX3RlbXBQb3MgPSBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFBvc2l0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRUcmFuc2xhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uKCk6IFF1YXRlcm5pb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUm90LmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByb3RhdGlvbihxOiBRdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgdGhpcy5fdGVtcFJvdCA9IHE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFJvdGF0aW9uKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRFdWxlckFuZ2xlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NhbGUoKTogVmVjdG9yMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBTY2FsZS5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2NhbGUoczogVmVjdG9yMykge1xyXG4gICAgICAgIHRoaXMuX3RlbXBTY2FsZSA9IHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZFNjYWxlKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5nZXRTY2FsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFyZW50KCk6IFRyYW5zZm9ybSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFBhcmVudChwYXJlbnQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCAmJiBwYXJlbnQgIT0gdGhpcyAmJiBwYXJlbnQgIT0gdGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgLy/pmLLmraLlh7rnjrDvvJrniLboioLngrnmmK/lvZPliY3oioLngrnnmoTlrZDoioLngrnvvIzlsIblrZDoioLnmoTorr7nva7kuLroh6rlt7HnmoTniLboioLngrnvvIzkvJrmrbvlvqrnjq9cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5oYXNQYXJlbnQodGhpcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2V0IHBhcmVudCwgdGhpcyBub2RlIGlzIHRoZSBwYXJlbnQgbm9kZSdzIHBhcmVudC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN6IqC54K55pyJ54i26IqC54K577yM6KaB5YWI56e76Zmk5pen55qEXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcywgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocGFyZW50ID09IG51bGwgJiYgdGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB3b3JsZFBvc2l0aW9uU3RheXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+iKgueCuXDmmK/lkKbmmK/lvZPliY3oioLngrnnmoTkuIrnuqdcclxuICAgIHB1YmxpYyBoYXNQYXJlbnQocDogVHJhbnNmb3JtKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLnBhcmVudCA9PSBwKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5oYXNQYXJlbnQocCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRDaGlsZChjaGlsZDogVHJhbnNmb3JtLCB3b3JsZFBvc2l0aW9uU3RheXM6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQgIT0gdGhpcyAmJiAhdGhpcy5jaGlsZHJlbi5pbmNsdWRlcyhjaGlsZCkpIHtcclxuICAgICAgICAgICAgLy/pmLLmraLlh7rnjrDvvJpjaGlsZOiKgueCueaYr+W9k+WJjeiKgueCueeahOeItuiKgueCue+8jOWwhueItuiKgueahOiuvue9ruS4uuiHquW3seeahOWtkOiKgueCue+8jOS8muatu+W+queOr1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQYXJlbnQoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjaGlsZCwgdGhpcyBub2RlIGlzIHRoZSBjaGlsZCBub2RlJ3MgY2hpbGQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WmguaenOWtkOiKgueCueacieaXp+eahOeItuiKgueCue+8jOimgeWFiOenu+mZpFxyXG4gICAgICAgICAgICBpZiAoY2hpbGQucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCwgd29ybGRQb3NpdGlvblN0YXlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAod29ybGRQb3NpdGlvblN0YXlzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S/neeVmeWOn+S4lueVjOWdkOagh+S9jee9ru+8jOWFiOacneeItuiKgueCueeahOWPmOaNoueahOWPjeaWueWQkeenu+WKqO+8jOeEtuWQjuWGjea3u+WKoOi/m+WOu++8jOWwseiDveS/neaMgeS4lueVjOWdkOagh+S4jeWPmFxyXG4gICAgICAgICAgICAgICAgLy/ljbPlj5jmjaLliLDniLboioLngrnnmoTpgIbnn6npmLXph4xcclxuICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHkoY2hpbGQuc2VsZk1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFBvcyA9IG0uZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFJvdCA9IG0uZ2V0Um90YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5fdGVtcFNjYWxlID0gbS5nZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlQ2hpbGQoY2hpbGQ6IFRyYW5zZm9ybSwgd29ybGRQb3NpdGlvblN0YXlzOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCwgMCk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAod29ybGRQb3NpdGlvblN0YXlzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+S/neeVmeS4lueVjOWdkOagh++8jOebtOaOpeWwhuacrOWcsOWdkOagh+etieWQjOS6juW9k+WJjeS4lueVjOWdkOagh+WNs+WPr1xyXG4gICAgICAgICAgICAgICAgdmFyIG0gPSB0aGlzLmxvY2FsVG9Xb3JsZE1hdHJpeC5tdWx0aXBseShjaGlsZC5zZWxmTWF0cml4KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUG9zID0gbS5nZXRUcmFuc2xhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wUm90ID0gbS5nZXRSb3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl90ZW1wU2NhbGUgPSBtLmdldFNjYWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbnZlcnRUb05vZGVTcGFjZSh2OiBWZWN0b3IzLCB3OiBudW1iZXIgPSAxKTogVmVjdG9yMyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKuWwhuafkOS4quWdkOagh+i9rOWIsOiHquW3seeahOWxgOmDqOepuumXtO+8jOS+i+WmguW9k+WJjeeahOWxgOmDqOWdkOagh+WOn+eCueWcqOS4lueVjOWdkOagh+eahO+8iDHvvIwx77yJ5aSEXHJcbiAgICAgICAgICrngrlw5Zyo5LiW55WM5Z2Q5qCH77yIMu+8jDHvvInlpITvvIzpgqPkuYjlsIbngrlw55u45a+55LqO5b2T5YmN5bGA6YOo5Z2Q5qCH57O755qE5L2N572u5bCx5piv77yIMu+8jDHvvIkt77yIMe+8jDHvvIk9IO+8iDHvvIwgMO+8iVxyXG4gICAgICAgICAq5Y2z5bCG54K5cOWPjeWQkeWPmOaNouW9k+WJjeeahOefqemYtSBcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZFRvTG9jYWxNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Xb3JsZFNwYWNlKHY6IFZlY3RvcjMsIHc6IG51bWJlciA9IDEpOiBWZWN0b3IzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFRvV29ybGRNYXRyaXgubXVsdGlwbHlWZWN0b3I0KG5ldyBWZWN0b3I0KHYsIHcpKS52ZWN0b3IzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95KGRlc3Ryb3lDaGlsZHJlbjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoZGVzdHJveUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KGRlc3Ryb3lDaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNZXNoIH0gZnJvbSBcIi4uL01lc2hcIjtcclxuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gXCIuL0RpY3Rpb25hcnlcIjtcclxuaW1wb3J0IHsgT0JKUGFyc2VyIH0gZnJvbSBcIi4vT2JqUGFyc2VyLnRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXNzZXRMb2FkZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZmlsZUNhY2hlOiBEaWN0aW9uYXJ5ID0gbmV3IERpY3Rpb25hcnkoKTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRJbWFnZUZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PigocmVzb2x2ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5oYXMoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5nZXQoZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgdGhlIGltYWdlIG9iamVjdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgb24gbG9hZGluZyBhbiBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFzc2V0TG9hZGVyLmZpbGVDYWNoZS5zZXQoZmlsZU5hbWUsIGltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6Leo5Yy66K+35rGCXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5jcm9zc09yaWdpbiA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGVsbCB0aGUgYnJvd3NlciB0byBsb2FkIGFuIGltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBmaWxlTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZFRleHRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmhhcyhmaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQXNzZXRMb2FkZXIuZmlsZUNhY2hlLmdldChmaWxlTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NldExvYWRlci5maWxlQ2FjaGUuc2V0KGZpbGVOYW1lLCByZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5LiN6KaB5byA5ZCv5byC5q2l77yM6K6+572u5Li6ZmFsc2XvvIzlkKbliJnlrrnmmJPljaHlnKhyZWFkeVN0YXRlID0gMe+8jOWOn+WboOS4jeaYjlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIGZpbGVOYW1lLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9hZE1vZGVsKG1vZGVsUGF0aDogc3RyaW5nLCBzY2FsZTogbnVtYmVyID0gMSk6IFByb21pc2U8TWVzaCB8IG51bGw+IHtcclxuICAgICAgICBsZXQgbW9kZWw6IE1lc2ggfCBudWxsID0gbnVsbDtcclxuICAgICAgICB2YXIgb2JqRG9jID0gYXdhaXQgQXNzZXRMb2FkZXIubG9hZFRleHRGaWxlKG1vZGVsUGF0aCk7XHJcbiAgICAgICAgaWYgKG9iakRvYyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsID0gT0JKUGFyc2VyLnBhcnNlKG9iakRvYywgc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgRGljdGlvbmFyeSB7XHJcblxyXG4gIGl0ZW1zOiBvYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pdGVtcykubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgaGFzKGtleTogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xyXG4gIH1cclxuXHJcbiAgc2V0KGtleTogYW55LCB2YWw6IGFueSkge1xyXG4gICAgdGhpcy5pdGVtc1trZXldID0gdmFsO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlKGtleTogYW55KTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5oYXMoa2V5KSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5pdGVtc1trZXldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGtleTogYW55KTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLmhhcyhrZXkpID8gdGhpcy5pdGVtc1trZXldIDogdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0ge307XHJcbiAgfVxyXG5cclxuICB2YWx1ZXMoKTogYW55W10ge1xyXG4gICAgbGV0IHZhbHVlczogYW55W10gPSBbXTtcclxuICAgIGZvciAobGV0IGsgaW4gdGhpcy5pdGVtcykge1xyXG4gICAgICBpZiAodGhpcy5oYXMoaykpIHtcclxuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLml0ZW1zW2tdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9XHJcblxyXG4gIGZvckVhY2goZnVuKSB7XHJcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuaXRlbXMpIHtcclxuICAgICAgZnVuKGssIHRoaXMuaXRlbXNba10pO1xyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCB7IE1lc2ggfSBmcm9tIFwiLi4vTWVzaFwiO1xyXG5pbXBvcnQgeyBTdWJNZXNoIH0gZnJvbSBcIi4uL01lc2hcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjNcIjtcclxuaW1wb3J0IHsgVmVjdG9yNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcjRcIjtcclxuaW1wb3J0IHsgQm91bmRzIH0gZnJvbSBcIi4uL01hdGgvQm91bmRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT0JKUGFyc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6QT0JK5paH5Lu25YaF5a655bm255Sf5oiQTWVzaOWvueixoVxyXG4gICAgICogQHBhcmFtIGNvbnRlbnQgT0JK5paH5Lu255qE5paH5pys5YaF5a65XHJcbiAgICAgKiBAcGFyYW0gc2NhbGUg5qih5Z6L57yp5pS+5q+U5L6L77yM6buY6K6kMS4wXHJcbiAgICAgKiBAcmV0dXJucyDop6PmnpDlkI7nmoRNZXNo5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBwYXJzZShjb250ZW50OiBzdHJpbmcsIHNjYWxlOiBudW1iZXIgPSAxKTogTWVzaCB7XHJcbiAgICAgICAgY29uc3QgbWVzaCA9IG5ldyBNZXNoKCk7XHJcbiAgICAgICAgbWVzaC52ZXJ0aWNlcyA9IFtdO1xyXG4gICAgICAgIG1lc2gudXYgPSBbXTtcclxuICAgICAgICBtZXNoLm5vcm1hbHMgPSBbXTtcclxuICAgICAgICBtZXNoLnRhbmdlbnRzID0gW107XHJcbiAgICAgICAgbWVzaC50cmlhbmdsZXMgPSBbXTtcclxuICAgICAgICBtZXNoLmJvdW5kcyA9IFtdO1xyXG4gICAgICAgIG1lc2guc3ViTWVzaGVzID0gW107XHJcbiAgICAgICAgbWVzaC5tYXRlcmlhbCA9IFtdOyAvLyDliJ3lp4vljJbmnZDotKjmlbDnu4RcclxuXHJcbiAgICAgICAgLy8g5Li05pe25a2Y5YKoT0JK5paH5Lu25Lit55qE5Y6f5aeL5pWw5o2u77yI57Si5byV5LuOMeW8gOWni++8iVxyXG4gICAgICAgIGNvbnN0IHRlbXBWZXJ0aWNlczogVmVjdG9yM1tdID0gW107XHJcbiAgICAgICAgY29uc3QgdGVtcFV2czogVmVjdG9yMltdID0gW107XHJcbiAgICAgICAgY29uc3QgdGVtcE5vcm1hbHM6IFZlY3RvcjNbXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDpobbngrnntKLlvJXmmKDlsITooajvvJrnlKjkuo7ljrvph40gKOagvOW8jzogXCJ2SW5kZXgvdnRJbmRleC92bkluZGV4XCIgPT4g5ZCI5bm25ZCO55qE57Si5byVKVxyXG4gICAgICAgIGNvbnN0IHZlcnRleE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcblxyXG4gICAgICAgIC8vIOadkOi0qOebuOWFs+WPmOmHj1xyXG4gICAgICAgIGxldCBjdXJyZW50TWF0ZXJpYWwgPSBcIlwiOyAvLyDlvZPliY3kvb/nlKjnmoTmnZDotKjlkI3np7BcclxuICAgICAgICBjb25zdCBtYXRlcmlhbFNldCA9IG5ldyBTZXQ8c3RyaW5nPigpOyAvLyDnlKjkuo7mlLbpm4bmiYDmnInllK/kuIDmnZDotKhcclxuXHJcbiAgICAgICAgLy8g5oyJ6KGM5YiG5Ymy5YaF5a655bm25aSE55CGXHJcbiAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRTdWJNZXNoOiBTdWJNZXNoIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltbWVkTGluZSA9IGxpbmUudHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIXRyaW1tZWRMaW5lIHx8IHRyaW1tZWRMaW5lLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIOi3s+i/h+epuuihjOWSjOazqOmHilxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWRMaW5lLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBwYXJ0c1swXTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHBhcnRzLnNsaWNlKDEpO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd2JzogLy8g6aG254K55Z2Q5qCHICh4LCB5LCB6KSAtIOW6lOeUqOe8qeaUvlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBWZXJ0aWNlcy5wdXNoKG5ldyBWZWN0b3IzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzBdKSAqIHNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzFdKSAqIHNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzJdKSAqIHNjYWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd2dCc6IC8vIOe6ueeQhuWdkOaghyAodSwgdilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wVXZzLnB1c2gobmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGRhdGFbMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSAtIHBhcnNlRmxvYXQoZGF0YVsxXSkgLy8g57+76L2sVui9tFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndm4nOiAvLyDms5Xnur8gKHgsIHksIHopXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE5vcm1hbHMucHVzaChuZXcgVmVjdG9yMyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoZGF0YVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGRhdGFbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChkYXRhWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbXRsbGliJzogLy8g5p2Q6LSo5bqT5byV55So77yI5pqC5a2Y5p2Q6LSo5bqT5paH5Lu25ZCN77yM5a6e6ZmF5Yqg6L296ZyA6aKd5aSW5a6e546w77yJXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6L+Z6YeM5Y+v5Lul6K6w5b2V5p2Q6LSo5bqT5paH5Lu26Lev5b6E77yM55So5LqO5ZCO57ut5Yqg6L295p2Q6LSoXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g56S65L6LOiBjb25zdCBtdGxQYXRoID0gZGF0YS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndXNlbXRsJzogLy8g5L2/55So5p2Q6LSoXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgPSBkYXRhLmpvaW4oJyAnKTsgLy8g5pSv5oyB5bim56m65qC855qE5p2Q6LSo5ZCNXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsU2V0LmFkZChjdXJyZW50TWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTdWJNZXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5tYXRlcmlhbCA9IGN1cnJlbnRNYXRlcmlhbDsgLy8g5YWz6IGU5p2Q6LSoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZyc6IC8vIOWkhOeQhue7hOaMh+S7pO+8jOWIm+W7uuaWsOeahOWtkOe9keagvFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7k+eul+W9k+WJjeWtkOe9keagvFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3ViTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC52ZXJ0ZXhDb3VudCA9IG1lc2gudmVydGljZXMubGVuZ3RoIC0gY3VycmVudFN1Yk1lc2guZmlyc3RWZXJ0ZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLmluZGV4Q291bnQgPSBtZXNoLnRyaWFuZ2xlcy5sZW5ndGggLSBjdXJyZW50U3ViTWVzaC5pbmRleFN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7rmlrDlrZDnvZHmoLzlubbnu6fmib/lvZPliY3mnZDotKhcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaCA9IG5ldyBTdWJNZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2guZmlyc3RWZXJ0ZXggPSBtZXNoLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5pbmRleFN0YXJ0ID0gbWVzaC50cmlhbmdsZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5pbmRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaC5ib3VuZHMgPSBuZXcgQm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2gubWF0ZXJpYWwgPSBjdXJyZW50TWF0ZXJpYWw7IC8vIOe7p+aJv+W9k+WJjeadkOi0qFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc2guc3ViTWVzaGVzLnB1c2goY3VycmVudFN1Yk1lc2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2YnOiAvLyDpnaJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPCAzKSBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yid5aeL5YyW5b2T5YmN5a2Q572R5qC877yI5aaC5p6c5rKh5pyJ77yJXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50U3ViTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViTWVzaCA9IG5ldyBTdWJNZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLmZpcnN0VmVydGV4ID0gbWVzaC52ZXJ0aWNlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLmluZGV4U3RhcnQgPSBtZXNoLnRyaWFuZ2xlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2guaW5kZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdWJNZXNoLmJvdW5kcyA9IG5ldyBCb3VuZHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1Yk1lc2gubWF0ZXJpYWwgPSBjdXJyZW50TWF0ZXJpYWw7IC8vIOS9v+eUqOW9k+WJjeadkOi0qFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoLnN1Yk1lc2hlcy5wdXNoKGN1cnJlbnRTdWJNZXNoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhumdoueahOmhtueCueaVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2VWZXJ0aWNlcyA9IGRhdGEubWFwKHZlcnRleFN0ciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSB2ZXJ0ZXhTdHIuc3BsaXQoJy8nKS5tYXAoaWR4ID0+IHBhcnNlSW50KGlkeCkgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2OiBpbmRpY2VzWzBdIC0gMSwgLy8g6L2s5o2i5Li6MOWfuue0ouW8lVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdnQ6IGluZGljZXNbMV0gLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm46IGluZGljZXNbMl0gLSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhuS4ieinkuW9ouWMluWSjOmhtueCueWOu+mHjVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgZmFjZVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFswLCBpIC0gMSwgaV0uZm9yRWFjaChpZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB2LCB2dCwgdm4gfSA9IGZhY2VWZXJ0aWNlc1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuWUr+S4gOagh+ivhumUriAo5aSE55CG5Y+v6IO955qE6LSf5pWw57Si5byV5ZKM6buY6K6k5YC8KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7diA+PSAwID8gdiA6IC0xfS8ke3Z0ID49IDAgPyB2dCA6IC0xfS8ke3ZuID49IDAgPyB2biA6IC0xfWA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleE1hcC5oYXMoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkjeeUqOW3suWtmOWcqOeahOmhtueCuee0ouW8lVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gudHJpYW5nbGVzLnB1c2godmVydGV4TWFwLmdldChrZXkpISk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa3u+WKoOaWsOmhtueCueaVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0luZGV4ID0gbWVzaC52ZXJ0aWNlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4TWFwLnNldChrZXksIG5ld0luZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6aG254K55pWw5o2uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzaC52ZXJ0aWNlcy5wdXNoKHYgPj0gMCAmJiB2IDwgdGVtcFZlcnRpY2VzLmxlbmd0aCA/IHRlbXBWZXJ0aWNlc1t2XSA6IG5ldyBWZWN0b3IzKDAsIDAsIDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVVbmlbDmja5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNoLnV2LnB1c2godnQgPj0gMCAmJiB2dCA8IHRlbXBVdnMubGVuZ3RoID8gdGVtcFV2c1t2dF0gOiBuZXcgVmVjdG9yMigwLCAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOazlee6v+aVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gubm9ybWFscy5wdXNoKHZuID49IDAgJiYgdm4gPCB0ZW1wTm9ybWFscy5sZW5ndGggPyB0ZW1wTm9ybWFsc1t2bl0gOiBuZXcgVmVjdG9yMygwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWFiOWIneWni+WMluWIh+e6v+S4uumbtuWQkemHj++8jOWQjue7reS8muiuoeeul1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gudGFuZ2VudHMucHVzaChuZXcgVmVjdG9yNCgwLCAwLCAwLCAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa3u+WKoOe0ouW8lVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gudHJpYW5nbGVzLnB1c2gobmV3SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOabtOaWsOWtkOe9keagvOS/oeaBr1xyXG4gICAgICAgIG1lc2guc3ViTWVzaGVzLmZvckVhY2goc3ViTWVzaCA9PiB7XHJcbiAgICAgICAgICAgIHN1Yk1lc2gudmVydGV4Q291bnQgPSBtZXNoLnZlcnRpY2VzLmxlbmd0aCAtIHN1Yk1lc2guZmlyc3RWZXJ0ZXg7XHJcbiAgICAgICAgICAgIHN1Yk1lc2guaW5kZXhDb3VudCA9IG1lc2gudHJpYW5nbGVzLmxlbmd0aCAtIHN1Yk1lc2guaW5kZXhTdGFydDtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+WtkOe9keagvOWMheWbtOebklxyXG4gICAgICAgICAgICBjb25zdCBzdWJWZXJ0aWNlcyA9IG1lc2gudmVydGljZXMuc2xpY2UoXHJcbiAgICAgICAgICAgICAgICBzdWJNZXNoLmZpcnN0VmVydGV4LFxyXG4gICAgICAgICAgICAgICAgc3ViTWVzaC5maXJzdFZlcnRleCArIHN1Yk1lc2gudmVydGV4Q291bnRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgc3ViTWVzaC5ib3VuZHMgPSBCb3VuZHMuZnJvbVBvaW50cyhzdWJWZXJ0aWNlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOaUtumbhuaJgOacieadkOi0qOWIsG1lc2gubWF0ZXJpYWzmlbDnu4RcclxuICAgICAgICBtZXNoLm1hdGVyaWFsID0gQXJyYXkuZnJvbShtYXRlcmlhbFNldCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+WIh+e6v+WQkemHj1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVGFuZ2VudHMobWVzaCk7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+aVtOS9k+WMheWbtOebklxyXG4gICAgICAgIG1lc2guYm91bmRzID0gbWVzaC5zdWJNZXNoZXMubWFwKHNtID0+IHNtLmJvdW5kcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6h566X572R5qC855qE5YiH57q/5ZCR6YePXHJcbiAgICAgKiDln7rkuo7pobbngrnkvY3nva7jgIFVVuWSjOS4ieinkuW9oue0ouW8leiuoeeul1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVUYW5nZW50cyhtZXNoOiBNZXNoKSB7XHJcbiAgICAgICAgaWYgKG1lc2gudmVydGljZXMubGVuZ3RoID09PSAwIHx8IG1lc2gudHJpYW5nbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyDkuLTml7bmlbDnu4TlrZjlgqjmr4/kuKrpobbngrnnmoTliIfnur/orqHnrpfmlbDmja5cclxuICAgICAgICBjb25zdCB0YW4xID0gbmV3IEFycmF5KG1lc2gudmVydGljZXMubGVuZ3RoKS5maWxsKDApLm1hcCgoKSA9PiBuZXcgVmVjdG9yMygwLCAwLCAwKSk7XHJcbiAgICAgICAgY29uc3QgdGFuMiA9IG5ldyBBcnJheShtZXNoLnZlcnRpY2VzLmxlbmd0aCkuZmlsbCgwKS5tYXAoKCkgPT4gbmV3IFZlY3RvcjMoMCwgMCwgMCkpO1xyXG5cclxuICAgICAgICAvLyDpgY3ljobmiYDmnInkuInop5LlvaJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gudHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkwID0gbWVzaC50cmlhbmdsZXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGkxID0gbWVzaC50cmlhbmdsZXNbaSArIDFdO1xyXG4gICAgICAgICAgICBjb25zdCBpMiA9IG1lc2gudHJpYW5nbGVzW2kgKyAyXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiOt+WPluS4ieinkuW9oueahOS4ieS4qumhtueCuVxyXG4gICAgICAgICAgICBjb25zdCB2MCA9IG1lc2gudmVydGljZXNbaTBdO1xyXG4gICAgICAgICAgICBjb25zdCB2MSA9IG1lc2gudmVydGljZXNbaTFdO1xyXG4gICAgICAgICAgICBjb25zdCB2MiA9IG1lc2gudmVydGljZXNbaTJdO1xyXG5cclxuICAgICAgICAgICAgLy8g6I635Y+W5a+55bqU55qEVVblnZDmoIdcclxuICAgICAgICAgICAgY29uc3QgdzAgPSBtZXNoLnV2W2kwXTtcclxuICAgICAgICAgICAgY29uc3QgdzEgPSBtZXNoLnV2W2kxXTtcclxuICAgICAgICAgICAgY29uc3QgdzIgPSBtZXNoLnV2W2kyXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+i+ueWQkemHj1xyXG4gICAgICAgICAgICBjb25zdCB4MSA9IHYxLnggLSB2MC54O1xyXG4gICAgICAgICAgICBjb25zdCB5MSA9IHYxLnkgLSB2MC55O1xyXG4gICAgICAgICAgICBjb25zdCB6MSA9IHYxLnogLSB2MC56O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeDIgPSB2Mi54IC0gdjAueDtcclxuICAgICAgICAgICAgY29uc3QgeTIgPSB2Mi55IC0gdjAueTtcclxuICAgICAgICAgICAgY29uc3QgejIgPSB2Mi56IC0gdjAuejtcclxuXHJcbiAgICAgICAgICAgIC8vIOiuoeeul1VW5beu5YC8XHJcbiAgICAgICAgICAgIGNvbnN0IHMxID0gdzEueCAtIHcwLng7XHJcbiAgICAgICAgICAgIGNvbnN0IHQxID0gdzEueSAtIHcwLnk7XHJcbiAgICAgICAgICAgIGNvbnN0IHMyID0gdzIueCAtIHcwLng7XHJcbiAgICAgICAgICAgIGNvbnN0IHQyID0gdzIueSAtIHcwLnk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfliIfnur/lkJHph49cclxuICAgICAgICAgICAgY29uc3QgciA9IDEuMCAvIChzMSAqIHQyIC0gczIgKiB0MSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gKHQyICogeDEgLSB0MSAqIHgyKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gKHQyICogeTEgLSB0MSAqIHkyKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IHR6ID0gKHQyICogejEgLSB0MSAqIHoyKSAqIHI7XHJcblxyXG4gICAgICAgICAgICAvLyDntK/liqDliIfnur/mlbDmja5cclxuICAgICAgICAgICAgdGFuMVtpMF0ueCArPSB0eDtcclxuICAgICAgICAgICAgdGFuMVtpMF0ueSArPSB0eTtcclxuICAgICAgICAgICAgdGFuMVtpMF0ueiArPSB0ejtcclxuXHJcbiAgICAgICAgICAgIHRhbjFbaTFdLnggKz0gdHg7XHJcbiAgICAgICAgICAgIHRhbjFbaTFdLnkgKz0gdHk7XHJcbiAgICAgICAgICAgIHRhbjFbaTFdLnogKz0gdHo7XHJcblxyXG4gICAgICAgICAgICB0YW4xW2kyXS54ICs9IHR4O1xyXG4gICAgICAgICAgICB0YW4xW2kyXS55ICs9IHR5O1xyXG4gICAgICAgICAgICB0YW4xW2kyXS56ICs9IHR6O1xyXG5cclxuICAgICAgICAgICAgLy8g6K6h566X5Ymv5YiH57q/5ZCR6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGJ4ID0gKHMxICogeDIgLSBzMiAqIHgxKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5ID0gKHMxICogeTIgLSBzMiAqIHkxKSAqIHI7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ6ID0gKHMxICogejIgLSBzMiAqIHoxKSAqIHI7XHJcblxyXG4gICAgICAgICAgICB0YW4yW2kwXS54ICs9IGJ4O1xyXG4gICAgICAgICAgICB0YW4yW2kwXS55ICs9IGJ5O1xyXG4gICAgICAgICAgICB0YW4yW2kwXS56ICs9IGJ6O1xyXG5cclxuICAgICAgICAgICAgdGFuMltpMV0ueCArPSBieDtcclxuICAgICAgICAgICAgdGFuMltpMV0ueSArPSBieTtcclxuICAgICAgICAgICAgdGFuMltpMV0ueiArPSBiejtcclxuXHJcbiAgICAgICAgICAgIHRhbjJbaTJdLnggKz0gYng7XHJcbiAgICAgICAgICAgIHRhbjJbaTJdLnkgKz0gYnk7XHJcbiAgICAgICAgICAgIHRhbjJbaTJdLnogKz0gYno7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDorqHnrpfmnIDnu4jliIfnur/lubbop4TojIPljJZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gudmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbiA9IG1lc2gubm9ybWFsc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgdCA9IHRhbjFbaV07XHJcblxyXG4gICAgICAgICAgICAvLyDmraPkuqTljJbliIfnur/vvIhHcmFtLVNjaG1pZHTov4fnqIvvvIlcclxuICAgICAgICAgICAgY29uc3QgdGFuZ2VudCA9IFZlY3RvcjMuc3VidHJhY3QodCwgVmVjdG9yMy5tdWx0aXBseShuLCBWZWN0b3IzLmRvdChuLCB0KSkpLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g6K6h566X5YiH57q/5pa55ZCR77yIIGhhbmRlZG5lc3Mg77yJXHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRlZG5lc3MgPSBWZWN0b3IzLmRvdChWZWN0b3IzLmNyb3NzKG4sIHQpLCB0YW4yW2ldKSA8IDAuMCA/IC0xIDogMTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWtmOWCqOWIh+e6v++8iHfliIbph4/ooajnpLrmlrnlkJHvvIlcclxuICAgICAgICAgICAgbWVzaC50YW5nZW50c1tpXSA9IG5ldyBWZWN0b3I0KHRhbmdlbnQueCwgdGFuZ2VudC55LCB0YW5nZW50LnosIGhhbmRlZG5lc3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi9FbmdpbmVcIjtcclxuXHJcbi8vIOW9k0RPTeWGheWuueWKoOi9veWujOaIkOWQjuaJp+ihjFxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8g5Yid5aeL5YyW5byV5pOOXHJcbiAgICBFbmdpbmUuSW5pdCgpO1xyXG5cclxuICAgIC8vIOS4u+W+queOr1xyXG4gICAgZnVuY3Rpb24gbWFpbkxvb3AoKSB7XHJcbiAgICAgICAgLy8g5aSE55CG6YC76L6RXHJcbiAgICAgICAgRW5naW5lLlVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIEVuZ2luZS5SZW5kZXIoKTtcclxuICAgICAgICAvLyDlsY/luZXovpPlh7rml6Xlv5dcclxuICAgICAgICBMb2dnZXIucHJpbnRMb2dzKCk7XHJcbiAgICAgICAgLy8g6K+35rGC5LiL5LiA5bin5Yqo55S7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxuICAgIH1cclxuICAgIC8vIOW8gOWni+WKqOeUu+W+queOr1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxufSk7Il19
