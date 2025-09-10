(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = exports.CameraClearFlags = void 0;
var Color_1 = require("../Utils/Color");
var Engine_1 = require("../Core/Engine");
var Vector4_1 = require("../Math/Vector4");
var Component_1 = require("./Component");
var Matrix4x4_1 = require("../Math/Matrix4x4");
var Time_1 = require("../Core/Time");
var CameraClearFlags;
(function (CameraClearFlags) {
    CameraClearFlags[CameraClearFlags["NONE"] = 0] = "NONE";
    CameraClearFlags[CameraClearFlags["ALL"] = 16640] = "ALL";
    CameraClearFlags[CameraClearFlags["Color"] = 16384] = "Color";
    CameraClearFlags[CameraClearFlags["Depth"] = 256] = "Depth";
})(CameraClearFlags || (exports.CameraClearFlags = CameraClearFlags = {}));
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
        _this.timer = 0;
        _this.counter = 0;
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
        this.transform.forward;
    };
    Camera.prototype.update = function () {
        if (Time_1.Time.time - this.timer >= 1) {
            this.timer = Time_1.Time.time;
            this.counter++;
        }
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
    Camera.prototype.getViewMatrix = function () {
        // 1. 获取相机的世界变换矩阵
        var worldMatrix = this.transform.localToWorldMatrix;
        // 2. 计算逆矩阵（世界空间 → 视图空间）
        var viewMatrix = worldMatrix.clone().invert();
        return viewMatrix;
    };
    Camera.prototype.getProjectionMatrix = function () {
        return Matrix4x4_1.Matrix4x4.perspective(this.fov, this.aspect, this.nearClip, this.farClip);
    };
    Camera.cameras = new Array();
    return Camera;
}(Component_1.Component));
exports.Camera = Camera;

},{"../Core/Engine":6,"../Core/Time":9,"../Math/Matrix4x4":12,"../Math/Vector4":16,"../Utils/Color":23,"./Component":3}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraController = void 0;
var Engine_1 = require("../Core/Engine");
var Input_1 = require("../Core/Input");
var Time_1 = require("../Core/Time");
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
        var scrollDelta = Input_1.Input.mouseScrollDelta.y * this.moveSpeed * 0.1;
        var pos = this.transform.rotation.transformQuat(Vector3_1.Vector3.BACK);
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
            this._euler.y += moveDelta.x * this.rotateSpeed * 0.1;
            this._euler.x += moveDelta.y * this.rotateSpeed * 0.1;
        }
        // ALT+鼠标左键相机绕中心点旋转
        if (Input_1.Input.GetKey(Input_1.Input.KeyCode.Alt) && Input_1.Input.GetMouseButton(0)) {
            var moveDelta = Input_1.Input.mouseDelta;
            this._euler.y -= moveDelta.x * this.rotateSpeed * 0.1;
            this._euler.x += moveDelta.y * this.rotateSpeed * 0.1;
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
        v = Vector3_1.Vector3.lerp(this.transform.position, this._position, Time_1.Time.deltaTime / this.damp);
        this.transform.position = v;
        // rotation
        var q = new Quaternion_1.Quaternion(new Vector3_1.Vector3(this._euler.x, this._euler.y, this._euler.z));
        q = Quaternion_1.Quaternion.slerp(this.transform.rotation, q, Time_1.Time.deltaTime / this.damp);
        this.transform.rotation = q;
    };
    return CameraController;
}(Component_1.Component));
exports.CameraController = CameraController;

},{"../Core/Engine":6,"../Core/Input":8,"../Core/Time":9,"../Math/Quaternion":13,"../Math/Vector3":15,"./Component":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
        _super.prototype.onDestroy.call(this);
        // 清理资源
        this._mesh = null;
    };
    return MeshRenderer;
}(Renderer_1.Renderer));
exports.MeshRenderer = MeshRenderer;

},{"./Renderer":5}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var Component_1 = require("./Component");
var Bounds_1 = require("../Math/Bounds");
// Renderer是所有渲染组件的基类
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._bounds = new Bounds_1.Bounds();
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
    Renderer.prototype.onDestroy = function () {
        // 清理资源
        this._material = null;
    };
    return Renderer;
}(Component_1.Component));
exports.Renderer = Renderer;

},{"../Math/Bounds":11,"./Component":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineConfig = exports.Engine = void 0;
var Input_1 = require("./Input");
var RasterizationPipeline_1 = require("../Renderer/RasterizationPipeline");
var MainScene_1 = require("../Scene/MainScene");
var SceneManager_1 = require("../Scene/SceneManager");
var Logger_1 = require("../Utils/Logger");
var Time_1 = require("./Time");
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
    Engine.Loop = function () {
        Logger_1.Logger.log(Math.floor(1 / Time_1.Time.deltaTime).toString());
        // 1. 更新时间数据：判断当前帧是否需要执行（受 maxFps 影响）
        var shouldExecuteFrame = Time_1.Time.updateFrame();
        // if (!shouldExecuteFrame) {
        //     return;
        // }
        // 2. 固定更新（对应 Unity FixedUpdate，例如物理引擎、AI逻辑）
        Time_1.Time.updateFixedTime(function () {
            Engine.FixedUpdate(); // 你的固定逻辑更新（如物理碰撞、技能CD）
        });
        // 3. 普通逻辑更新（对应 Unity Update，受 deltaTime 影响）
        Engine.Update(); // 例如：角色移动（速度 * Time.deltaTime 确保帧率无关）
        // 4. 更新输入状态(注：输入已经由WEB引擎在每帧开始之前获取了，这里是更新输入的上一帧状态)
        Input_1.Input.update();
        // 5. 渲染
        Engine.Render();
        // 6. 屏幕输出日志
        Logger_1.Logger.printLogs();
    };
    Engine.Update = function () {
        var _a;
        // 使用场景的update方法更新所有游戏对象
        (_a = this.sceneManager.getActiveScene()) === null || _a === void 0 ? void 0 : _a.update();
    };
    Engine.FixedUpdate = function () {
    };
    Engine.Render = function () {
        this.pipeline.Render();
        // 将图像数据绘制到canvas上
        this.context.putImageData(this.imageData, 0, 0);
    };
    Engine.sceneManager = new SceneManager_1.SceneManager();
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

},{"../Renderer/RasterizationPipeline":18,"../Scene/MainScene":19,"../Scene/SceneManager":21,"../Utils/Logger":25,"./Input":8,"./Time":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
var Transform_1 = require("./Transform");
var GameObject = /** @class */ (function () {
    function GameObject(name) {
        this.tag = "Untagged"; // 添加标签属性
        this.layer = 0; // 默认层
        this.components = [];
        this.startedComponents = new Set();
        this._active = true;
        this.name = name;
        this.transform = new Transform_1.Transform(this);
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

},{"./Transform":10}],8:[function(require,module,exports){
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchPhase = exports.InputAxis = exports.Input = void 0;
var Vector2_1 = require("../Math/Vector2");
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
        Input.previousMouseButtons = __spreadArray([], Input.currentMouseButtons, true);
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
                deltaPosition: { x: 0, y: 0 }, // 简化实现，实际应该跟踪前一帧位置
                phase: TouchPhase.Moved, // 简化实现
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
        RightArrow: 'ArrowRight',
    };
    return Input;
}());
exports.Input = Input;
// 轴向枚举
var InputAxis;
(function (InputAxis) {
    InputAxis[InputAxis["Horizontal"] = 0] = "Horizontal";
    InputAxis[InputAxis["Vertical"] = 1] = "Vertical";
})(InputAxis || (exports.InputAxis = InputAxis = {}));
// 触摸阶段枚举
var TouchPhase;
(function (TouchPhase) {
    TouchPhase[TouchPhase["Began"] = 0] = "Began";
    TouchPhase[TouchPhase["Moved"] = 1] = "Moved";
    TouchPhase[TouchPhase["Stationary"] = 2] = "Stationary";
    TouchPhase[TouchPhase["Ended"] = 3] = "Ended";
    TouchPhase[TouchPhase["Canceled"] = 4] = "Canceled";
})(TouchPhase || (exports.TouchPhase = TouchPhase = {}));

},{"../Math/Vector2":14}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
/**
 * 模仿 Unity Time 类：提供时间管理、帧率控制、时间缩放等核心功能
 * 核心特性：
 * 1. deltaTime：上一帧到当前帧的时间间隔（受 timeScale 影响）
 * 2. unscaledDeltaTime：不受 timeScale 影响的原始帧间隔
 * 3. time：游戏启动到现在的总时间（受 timeScale 影响）
 * 4. fixedTime：固定时间步长的累计时间（用于物理/固定逻辑更新）
 * 5. timeScale：时间缩放系数（0=暂停，1=正常，>1=加速，<1=减速）
 */
var Time = /** @class */ (function () {
    function Time() {
    }
    // ========================== 核心方法（需集成到渲染循环）==========================
    /**
     * 每帧更新时间数据（必须在主循环中调用，对应 Unity 帧生命周期）
     * @returns 该帧是否需要执行（用于帧率限制）
     */
    Time.updateFrame = function () {
        // 初始化：记录第一帧时间
        if (!this.isInitialized) {
            this.lastFrameTime = performance.now();
            this.isInitialized = true;
            return true;
        }
        // 1. 计算当前帧的原始时间间隔（毫秒转秒）
        var currentTime = performance.now();
        var rawDeltaMs = currentTime - this.lastFrameTime;
        this.unscaledDeltaTime = rawDeltaMs / 1000; // 原始帧间隔（不受 timeScale 影响）
        // 2. 帧率限制逻辑：若设置 maxFps，判断是否达到目标帧间隔
        if (this.maxFps !== null) {
            var targetFrameMs = 1000 / this.maxFps; // 目标帧间隔（毫秒）
            if (rawDeltaMs < targetFrameMs) {
                return false; // 未达到目标间隔，不执行当前帧
            }
        }
        // 3. 更新受 timeScale 影响的时间属性
        this.deltaTime = this.unscaledDeltaTime * this.timeScale; // 受缩放的帧间隔
        this.time += this.deltaTime; // 总时间（受缩放）
        this.unscaledTime += this.unscaledDeltaTime; // 原始总时间（不受缩放）
        // 4. 更新固定时间步长累计（用于物理/固定更新）
        this.updateFixedTime();
        // 5. 记录当前时间，为下一帧做准备
        this.lastFrameTime = currentTime;
        return true; // 允许执行当前帧逻辑
    };
    /**
     * 固定时间步长更新（用于物理引擎、固定频率逻辑，对应 Unity FixedUpdate）
     * @param fixedUpdateCallback 固定更新回调（每累计一个 fixedDeltaTime 执行一次）
     */
    Time.updateFixedTime = function (fixedUpdateCallback) {
        // 累计原始时间（不受 timeScale 影响，确保物理更新稳定）
        var totalFixedDelta = this.unscaledDeltaTime + this.fixedTimeRemainder;
        var fixedStep = this.fixedDeltaTime;
        // 计算需要执行多少次固定更新（例如：累计 0.05 秒，固定步长 0.02 秒 → 执行 2 次，余数 0.01 秒）
        var fixedUpdateCount = Math.floor(totalFixedDelta / fixedStep);
        this.fixedTimeRemainder = totalFixedDelta % fixedStep;
        // 执行固定更新回调
        for (var i = 0; i < fixedUpdateCount; i++) {
            this.fixedTime += fixedStep; // 更新固定时间累计
            fixedUpdateCallback === null || fixedUpdateCallback === void 0 ? void 0 : fixedUpdateCallback();
        }
    };
    /**
     * 重置时间状态（用于游戏重启、场景切换）
     */
    Time.reset = function () {
        this.deltaTime = 0;
        this.unscaledDeltaTime = 0;
        this.time = 0;
        this.unscaledTime = 0;
        this.fixedTime = 0;
        this.fixedTimeRemainder = 0;
        this.lastFrameTime = performance.now();
    };
    /**
     * 暂停游戏（等价于设置 timeScale = 0）
     */
    Time.pause = function () {
        this.timeScale = 0;
    };
    /**
     * 恢复游戏正常速度（等价于设置 timeScale = 1）
     */
    Time.resume = function () {
        this.timeScale = 1;
    };
    // ========================== 静态属性（对应 Unity Time 静态接口）==========================
    /** 上一帧到当前帧的时间间隔（秒），受 timeScale 影响（暂停时为 0） */
    Time.deltaTime = 0;
    /** 上一帧到当前帧的原始时间间隔（秒），不受 timeScale 影响（暂停时仍为真实时间间隔） */
    Time.unscaledDeltaTime = 0;
    /** 游戏启动到现在的总时间（秒），受 timeScale 影响（暂停时不增加） */
    Time.time = 0;
    /** 游戏启动到现在的原始总时间（秒），不受 timeScale 影响（暂停时仍增加） */
    Time.unscaledTime = 0;
    /** 固定时间步长（秒），用于物理更新/固定逻辑更新（默认 0.02 秒 = 50 次/秒，对应 Unity fixedDeltaTime） */
    Time.fixedDeltaTime = 0.02;
    /** 固定时间步长的累计时间（秒），用于触发固定更新（对应 Unity fixedTime） */
    Time.fixedTime = 0;
    /** 时间缩放系数（0 = 暂停，1 = 正常速度，2 = 2倍速，0.5 = 0.5倍速） */
    Time.timeScale = 1;
    /** 帧率限制（默认无限制，设为 30/60 可固定帧率） */
    Time.maxFps = null;
    // ========================== 私有成员（内部计时逻辑）==========================
    /** 上一帧的时间戳（毫秒，用于计算帧间隔） */
    Time.lastFrameTime = performance.now();
    /** 固定时间步长的累计余数（避免固定更新丢失精度） */
    Time.fixedTimeRemainder = 0;
    /** 是否已初始化（确保仅启动一次计时） */
    Time.isInitialized = false;
    return Time;
}());
exports.Time = Time;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
var Matrix4x4_1 = require("../Math/Matrix4x4");
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
var Vector4_1 = require("../Math/Vector4");
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
            return this.selfMatrix.invert().multiply(p);
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

},{"../Math/Matrix4x4":12,"../Math/Quaternion":13,"../Math/Vector3":15,"../Math/Vector4":16}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            new Vector3_1.Vector3(1, 0, 0), // 假设X轴为第一主成分
            new Vector3_1.Vector3(0, 1, 0), // 假设Y轴为第二主成分
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
    console.log("  Min:", "(".concat(aabb.min.x, ", ").concat(aabb.min.y, ", ").concat(aabb.min.z, ")"));
    console.log("  Max:", "(".concat(aabb.max.x, ", ").concat(aabb.max.y, ", ").concat(aabb.max.z, ")"));
    // 生成OBB
    var obb = OBB.fromVertices(vertices);
    console.log("\nOBB:");
    console.log("  Center:", "(".concat(obb.center.x, ", ").concat(obb.center.y, ", ").concat(obb.center.z, ")"));
    console.log("  Extents:", "(".concat(obb.extents.x, ", ").concat(obb.extents.y, ", ").concat(obb.extents.z, ")"));
    // 生成球体
    var sphere = Sphere.fromVertices(vertices);
    console.log("\nSphere:");
    console.log("  Center:", "(".concat(sphere.center.x, ", ").concat(sphere.center.y, ", ").concat(sphere.center.z, ")"));
    console.log("  Radius:", sphere.radius);
}

},{"./Vector3":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    // 转置矩阵
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
    // 通过​​代数余子式法（Cofactor Method）​​ 来计算一个 4x4 方阵的逆矩阵
    Matrix4x4.prototype.invert = function () {
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
    Matrix4x4.perspective = function (fov, aspect, near, far) {
        var fovRad = fov / 180 * Math.PI;
        var tanHalfFov = Math.tan(fovRad / 2);
        var mat = new Matrix4x4(new Vector4_1.Vector4(1 / (aspect * tanHalfFov), 0, 0, 0), new Vector4_1.Vector4(0, -1 / tanHalfFov, 0, 0), new Vector4_1.Vector4(0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near)), new Vector4_1.Vector4(0, 0, -1, 0));
        return mat;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaternion = void 0;
var Vector3_1 = require("./Vector3");
var Matrix4x4_1 = require("./Matrix4x4");
var Quaternion = /** @class */ (function () {
    function Quaternion() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = exports.SubMesh = exports.Mesh = void 0;
var Bounds_1 = require("../Math/Bounds");
var Mesh = /** @class */ (function () {
    function Mesh() {
        // 调试信息
        this._debug_faceNormalLine = [];
        this.bounds = [];
        this.material = [];
        this.triangles = [];
        this.faceNormals = [];
        this.vertices = [];
        this.uv = [];
        this.normals = [];
        this.tangents = [];
        this.subMeshes = [];
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
        this.vertexCount = 0;
        this.firstVertex = 0;
        this.indexCount = 0;
        this.indexStart = 0;
        this.bounds = new Bounds_1.Bounds();
        this.material = "";
    }
    return SubMesh;
}());
exports.SubMesh = SubMesh;
var Line = /** @class */ (function () {
    function Line(start, end) {
        this.start = start;
        this.end = end;
    }
    return Line;
}());
exports.Line = Line;

},{"../Math/Bounds":11}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RasterizationPipeline = void 0;
var Color_1 = require("../Utils/Color");
var Vector2_1 = require("../Math/Vector2");
var Vector3_1 = require("../Math/Vector3");
var Vector4_1 = require("../Math/Vector4");
var Renderer_1 = require("../Component/Renderer");
var Camera_1 = require("../Component/Camera");
var Engine_1 = require("../Core/Engine");
var Logger_1 = require("../Utils/Logger");
var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["Wireframe"] = 1] = "Wireframe";
    DrawMode[DrawMode["Point"] = 2] = "Point";
    DrawMode[DrawMode["UV"] = 4] = "UV";
    DrawMode[DrawMode["Normal"] = 8] = "Normal";
    DrawMode[DrawMode["Shader"] = 16] = "Shader";
})(DrawMode || (DrawMode = {}));
var RasterizationPipeline = /** @class */ (function () {
    function RasterizationPipeline(uint32View) {
        this.drawMode = DrawMode.Wireframe;
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
    RasterizationPipeline.prototype.DrawLine = function (x1, y1, x2, y2, color1, color2) {
        var _a, _b, _c, _d;
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
        var length = Math.max(Math.abs(dx), Math.abs(dy));
        // 为何要区分斜率是否偏水平还是垂直呢？因为如果不区分，例如当斜率大于1时，会导致直线绘制不连续，因为y会跳变，而不是连续的增加。
        // 只有斜率刚好为1时，x跟y才是连续同步自增的，x+1，则y也+1
        // 所以，当斜率大于1时，我们需要使用y作为循环变量，而当斜率小于1时，我们需要使用x作为循环变量。
        // 举个极端例子，当斜率为0时，直线就是一条垂直直线，如果这时候还用x作为循环变量，则会导致这条直线上所有y点都对应一个x，也就是说这条线变成一个点了。
        // 斜率小于1，直线偏水平情况，使用x作为循环变量
        if (Math.abs(dx) > Math.abs(dy)) {
            // 下面的循环绘制函数是从左往右的，这里要确保结束点在开始点的右边
            if (x2 < x1) {
                _a = [x2, y2, x1, y1], x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
                // 同时交换颜色
                if (color2 !== undefined)
                    _b = [color2, color1], color1 = _b[0], color2 = _b[1];
            }
            // 斜率
            var a = dy / dx;
            // 截距（y=ax+b，b=y-ax）
            // const b = y1 - a * x1;
            var y = y1;
            // 绘制直线
            for (var x = x1; x <= x2; x++) {
                // 计算插值因子 (0 到 1)
                var t = length > 0 ? (x - x1) / length : 0;
                // 根据是否有第二个颜色决定使用单一颜色还是插值
                var color = color2 !== undefined ? this.interpolateColor(color1, color2, t) : color1;
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
            if (y2 < y1) {
                _c = [x2, y2, x1, y1], x1 = _c[0], y1 = _c[1], x2 = _c[2], y2 = _c[3];
                // 同时交换颜色
                if (color2 !== undefined)
                    _d = [color2, color1], color1 = _d[0], color2 = _d[1];
            }
            var a = dx / dy;
            var x = x1;
            for (var y = y1; y <= y2; y++) {
                // 计算插值因子 (0 到 1)
                var t = length > 0 ? (y - y1) / length : 0;
                // 根据是否有第二个颜色决定使用单一颜色还是插值
                var color = color2 !== undefined ? this.interpolateColor(color1, color2, t) : color1;
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
    // 将模型空间坐标转换为裁剪空间坐标（Clip Space）
    RasterizationPipeline.prototype.ObjectToClipPos = function (vertex, transform) {
        // 对顶点应用 MVP 矩阵（Model→View→Projection 矩阵的组合），计算过程为：
        // 裁剪空间坐标 = projectionMatrix × viewMatrix × modelMatrix × 模型空间顶点
        var modelMatrix = transform.localToWorldMatrix;
        var camera = Camera_1.Camera.mainCamera;
        var viewMatrix = camera.getViewMatrix();
        var projectionMatrix = camera.getProjectionMatrix();
        var mvpMatrix = projectionMatrix.multiply(viewMatrix).multiply(modelMatrix);
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        // const cameraForward = camera.transform.forward;
        // const cameraUp = camera.transform.up;
        // const modelViewMatrix = modelMatrix.clone().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        // const mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);
        return mvpMatrix.multiplyVector4(new Vector4_1.Vector4(vertex.clone(), 1));
    };
    // 将裁剪空间坐标最终转换为屏幕空间坐标（Screen Space）
    RasterizationPipeline.prototype.ClipToScreenPos = function (vertex) {
        // 执行透视除法：(x/w, y/w, z/w)，得到归一化设备坐标（NDC，范围 [-1, 1]）。
        var w = vertex.w;
        var ndcX = vertex.x / w;
        var ndcY = vertex.y / w;
        var ndcZ = vertex.z / w;
        // 经过透视除法后，坐标位于标准设备坐标（NDC）空间，通常x, y, z范围在[-1, 1]（OpenGL风格）或[0, 1]（DirectX风格）之间。
        // 将 NDC 转换为屏幕像素坐标：
        // X 轴：screenX = (xNDC + 1) * 屏幕宽度 / 2
        // Y 轴：screenY = (1 - yNDC) * 屏幕高度 / 2（注意 Y 轴翻转，因屏幕坐标系 Y 向下）
        // 将NDC的x从[-1, 1]映射到[0, screenWidth]
        var screenX = ((ndcX + 1) / 2) * Engine_1.EngineConfig.canvasWidth;
        // 将NDC的y从[-1, 1]映射到[0, screenHeight]。注意屏幕坐标通常y向下为正，而NDC的y向上为正，所以需要翻转
        var screenY = Engine_1.EngineConfig.canvasHeight - (((ndcY + 1) / 2) * Engine_1.EngineConfig.canvasHeight);
        // z分量通常用于深度测试，这里我们只关心屏幕x,y
        // 如果你的NDCz范围是[-1,1]且需要映射到[0,1]（例如WebGPU某些情况），可以类似处理：const screenZ = (ndc.z + 1) / 2;
        return new Vector2_1.Vector2(screenX, screenY);
    };
    RasterizationPipeline.prototype.ObjectToScreenPos = function (vertex, transform) {
        var clipPos = this.ObjectToClipPos(vertex, transform);
        return this.ClipToScreenPos(clipPos);
    };
    RasterizationPipeline.prototype.ObjectToWorldNormal = function (normal, transform) {
        // 获取模型矩阵（局部到世界空间的变换矩阵）
        var modelMatrix = transform.localToWorldMatrix;
        // 计算模型矩阵的逆转置矩阵
        // 逆转置矩阵可以确保法线在非均匀缩放时仍然保持与表面垂直
        var inverseTransposeModel = modelMatrix.clone().invert().transpose();
        // 使用逆转置矩阵变换法线向量（忽略平移分量，只应用旋转和缩放的逆变换）
        var worldNormal = inverseTransposeModel.multiplyVector3(normal);
        // 归一化结果，确保法线保持单位长度
        return worldNormal.normalize();
    };
    /*
     * 顶点处理阶段：模型空间 →（模型矩阵阵）→ 世界空间 →（视图矩阵）→ 观察空间 →（投影矩阵）→ 裁剪空间 →（透视除法）→ NDC 空间 →（视口变换）→ 屏幕空间 → 光栅化渲染
     */
    RasterizationPipeline.prototype.VertexProcessingStage = function (vertices, transform) {
        var outVertices = new Array(vertices.length);
        // 1. MVP变换到裁剪空间
        // 模型空间 -> 世界空间 -> 观察空间 -> 裁剪空间
        for (var i = 0; i < vertices.length; i += 1) {
            outVertices[i] = this.ObjectToClipPos(vertices[i], transform);
        }
        // 2. 透视除法：将裁剪空间坐标转换为标准设备坐标（NDC）
        // 裁剪空间 -> 标准化设备坐标（NDC 空间）
        // 3. 视口变换：将NDC坐标映射到屏幕坐标
        // 标准化设备坐标（NDC 空间） -> 屏幕空间
        for (var i = 0; i < outVertices.length; i++) {
            outVertices[i] = this.ClipToScreenPos(outVertices[i]);
        }
        return outVertices;
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
    RasterizationPipeline.prototype.BackfaceCulling = function (triangles, mesh, renderer) {
        var visibleTriangles = [];
        var faceNormals = mesh.faceNormals;
        var modelMatrix = renderer.transform.localToWorldMatrix;
        var camera = Camera_1.Camera.mainCamera;
        // 1. 计算模型视图矩阵（模型空间 → 视图空间）
        var viewMatrix = camera.getViewMatrix(); // 获取相机的视图矩阵（世界空间 → 视图空间）
        var modelViewMatrix = viewMatrix.multiply(modelMatrix); // 模型空间 → 世界空间 → 视图空间
        // 2. 计算法向量变换矩阵（模型视图矩阵的逆转置）
        var normalMatrix = modelViewMatrix.clone().invert().transpose();
        // 3. 视图空间中的相机观察方向（右手坐标系的话，Z轴指向观察者，即相机应该是看向Z轴负轴）
        var cameraViewDirection = Vector3_1.Vector3.BACK;
        for (var i = 0; i < faceNormals.length; i++) {
            var n = 10; //Camera.mainCamera.counter % 12;
            //if (i !== n) continue;
            // 原始法向量（模型空间）
            var normalModel = faceNormals[i];
            // 4. 将法向量从模型空间变换到视图空间
            var normalView = normalMatrix.multiplyVector3(normalModel);
            // 5. 计算法向量与观察方向的点积
            var dot = normalView.dot(cameraViewDirection);
            // 6. 点积 > 0 表示面向相机（可见）
            if (dot > 0) {
                visibleTriangles.push(triangles[i * 3], triangles[i * 3 + 1], triangles[i * 3 + 2]);
            }
        }
        return visibleTriangles;
    };
    // 遮挡剔除
    RasterizationPipeline.prototype.OcclusionCulling = function () {
    };
    RasterizationPipeline.prototype.ClipTriangle = function (triangle) {
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
        triangles = this.BackfaceCulling(triangles, mesh, renderer);
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
            if (this.drawMode & DrawMode.Wireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
            }
            if (this.drawMode & DrawMode.Point) {
                this.DrawPixel(p1.x, p1.y, Color_1.Color.WHITE);
                this.DrawPixel(p2.x, p2.y, Color_1.Color.WHITE);
                this.DrawPixel(p3.x, p3.y, Color_1.Color.WHITE);
            }
            if (this.drawMode & DrawMode.UV) {
                var p1_uv = mesh.uv[triangles[i]];
                var p2_uv = mesh.uv[triangles[i + 1]];
                var p3_uv = mesh.uv[triangles[i + 2]];
                var p1_color = new Color_1.Color(p1_uv.x * 255, p1_uv.y * 255, 0).ToUint32();
                var p2_color = new Color_1.Color(p2_uv.x * 255, p2_uv.y * 255, 0).ToUint32();
                var p3_color = new Color_1.Color(p3_uv.x * 255, p3_uv.y * 255, 0).ToUint32();
                this.DrawTriangleFilledWithVertexColor(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p1_color, p2_color, p3_color);
            }
            if (this.drawMode & DrawMode.Normal) {
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
            if (this.drawMode & DrawMode.Shader) {
                this.DrawTriangleFilled(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
            }
        }
        // 调试：绘制面法线
        // for (let i = 0; i < mesh._debug_faceNormalLine.length; i++) {
        //     const normal = mesh._debug_faceNormalLine[i];
        //     const start = this.ObjectToScreenPos(normal.start, renderer.transform);
        //     const end = this.ObjectToScreenPos(normal.end, renderer.transform);
        //     this.DrawLine(start.x, start.y, end.x, end.y, Color.RED, Color.GREEN);
        // }
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
    /**
     * 颜色插值辅助函数
     * @param color1 起始颜色 (32位整数，格式为0xAARRGGBB)
     * @param color2 结束颜色 (32位整数，格式为0xAARRGGBB)
     * @param t 插值因子 (0 到 1)
     * @returns 插值后的颜色
     */
    RasterizationPipeline.prototype.interpolateColor = function (color1, color2, t) {
        // 提取ARGB分量
        var a1 = (color1 >> 24) & 0xFF;
        var r1 = (color1 >> 16) & 0xFF;
        var g1 = (color1 >> 8) & 0xFF;
        var b1 = color1 & 0xFF;
        var a2 = (color2 >> 24) & 0xFF;
        var r2 = (color2 >> 16) & 0xFF;
        var g2 = (color2 >> 8) & 0xFF;
        var b2 = color2 & 0xFF;
        // 线性插值每个分量
        var a = Math.round(a1 + (a2 - a1) * t);
        var r = Math.round(r1 + (r2 - r1) * t);
        var g = Math.round(g1 + (g2 - g1) * t);
        var b = Math.round(b1 + (b2 - b1) * t);
        // 组合成32位颜色值
        return (a << 24) | (r << 16) | (g << 8) | b;
    };
    return RasterizationPipeline;
}());
exports.RasterizationPipeline = RasterizationPipeline;

},{"../Component/Camera":1,"../Component/Renderer":5,"../Core/Engine":6,"../Math/Vector2":14,"../Math/Vector3":15,"../Math/Vector4":16,"../Utils/Color":23,"../Utils/Logger":25}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainScene = void 0;
var Camera_1 = require("../Component/Camera");
var CameraController_1 = require("../Component/CameraController");
var MeshRenderer_1 = require("../Component/MeshRenderer");
var GameObject_1 = require("../Core/GameObject");
var Quaternion_1 = require("../Math/Quaternion");
var Vector3_1 = require("../Math/Vector3");
var AssetLoader_1 = require("../Utils/AssetLoader");
exports.MainScene = {
    name: "MainScene",
    initfun: function (scene) {
        // 相机
        var camera = new GameObject_1.GameObject("camera");
        camera.transform.rotation = new Quaternion_1.Quaternion(new Vector3_1.Vector3(0, 180, 0));
        camera.transform.position = new Vector3_1.Vector3(0, 0, 3);
        scene.addGameObject(camera);
        camera.addComponent(Camera_1.Camera);
        camera.addComponent(CameraController_1.CameraController);
        // AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then((model) => {
        //     const obj = new GameObject("female02");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });
        AssetLoader_1.AssetLoader.loadModel('resources/cube.obj').then(function (model) {
            var obj = new GameObject_1.GameObject("cube");
            //obj.transform.position = Vector3.BACK;
            var renderer = obj.addComponent(MeshRenderer_1.MeshRenderer);
            renderer.mesh = model;
            //cube.transform.setParent(obj.transform, false);
            scene.addGameObject(obj);
        });
        AssetLoader_1.AssetLoader.loadModel('resources/models/bunny2.obj', 10).then(function (model) {
            var obj = new GameObject_1.GameObject("bunny");
            //obj.transform.position = Vector3.RIGHT;
            var renderer = obj.addComponent(MeshRenderer_1.MeshRenderer);
            renderer.mesh = model;
            scene.addGameObject(obj);
        });
        // AssetLoader.loadModel('resources/assets/meshes/lee.obj').then((model) => {
        //     const obj = new GameObject("lee");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     renderer.mesh = model;
        //     scene.addGameObject(obj);
        // });
    }
};

},{"../Component/Camera":1,"../Component/CameraController":2,"../Component/MeshRenderer":4,"../Core/GameObject":7,"../Math/Quaternion":13,"../Math/Vector3":15,"../Utils/AssetLoader":22}],20:[function(require,module,exports){
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        return __spreadArray([], this.rootGameObjects, true);
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
Object.defineProperty(exports, "__esModule", { value: true });
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
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
    AssetLoader.loadModel = function (modelPath_1) {
        return __awaiter(this, arguments, void 0, function (modelPath, scale) {
            var model, objDoc;
            if (scale === void 0) { scale = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = null;
                        return [4 /*yield*/, AssetLoader.loadTextFile(modelPath)];
                    case 1:
                        objDoc = _a.sent();
                        if (objDoc != null) {
                            model = ObjParser_1.OBJParser.parse(objDoc, scale);
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

},{"./Dictionary":24,"./ObjParser":26}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        // 关键修复：添加索引签名 { [key: string]: any }，允许用 string 类型索引
        this.items = {}; // 直接初始化，避免“未赋值”隐患
        // 无需重复赋值，已在声明时初始化
    }
    Object.defineProperty(Dictionary.prototype, "count", {
        get: function () {
            return Object.keys(this.items).length;
        },
        enumerable: false,
        configurable: true
    });
    // 键类型统一为 string（更符合对象索引的实际场景）
    Dictionary.prototype.has = function (key) {
        // 推荐用 Object.prototype.hasOwnProperty，避免原型链污染
        return Object.prototype.hasOwnProperty.call(this.items, key);
    };
    Dictionary.prototype.set = function (key, val) {
        this.items[key] = val; // 现在 TS 能识别 key 是合法索引
    };
    // 修复逻辑：删除成功返回 true
    Dictionary.prototype.delete = function (key) {
        if (this.has(key)) {
            delete this.items[key];
            return true; // 关键修正：删除成功返回 true
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
    // 关键修复：定义 fun 的类型（key 为 string，val 为 any）
    Dictionary.prototype.forEach = function (fun) {
        for (var k in this.items) {
            if (this.has(k)) {
                fun(k, this.items[k]);
            }
        }
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;

},{}],25:[function(require,module,exports){
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Engine_1 = require("../Core/Engine");
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
            duration: duration !== null && duration !== void 0 ? duration : 0,
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

},{"../Core/Engine":6}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBJParser = void 0;
var Mesh_1 = require("../Renderer/Mesh");
var Mesh_2 = require("../Renderer/Mesh");
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
                            v: indices[0] - 1, // 转换为0基索引
                            vt: indices[1] - 1,
                            vn: indices[2] - 1
                        };
                    });
                    // 处理三角形化和顶点去重
                    for (var i = 2; i < faceVertices_1.length; i++) {
                        [0, i - 1, i].forEach(function (idx) {
                            var _a = faceVertices_1[idx], v = _a.v, vt = _a.vt, vn = _a.vn;
                            // 创建唯一标识键 (处理可能的负数索引和默认值)
                            var key = "".concat(v >= 0 ? v : -1, "/").concat(vt >= 0 ? vt : -1, "/").concat(vn >= 0 ? vn : -1);
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
        // 计算三角面的法向量
        this.calculateFaceNormals(mesh);
        return mesh;
    };
    OBJParser.calculateFaceNormals = function (mesh) {
        if (mesh.vertices.length === 0 || mesh.triangles.length === 0)
            return;
        mesh.faceNormals = [];
        mesh._debug_faceNormalLine = [];
        for (var i = 0; i < mesh.triangles.length; i += 3) {
            var i0 = mesh.triangles[i];
            var i1 = mesh.triangles[i + 1];
            var i2 = mesh.triangles[i + 2];
            var v0 = mesh.vertices[i0];
            var v1 = mesh.vertices[i1];
            var v2 = mesh.vertices[i2];
            var e1 = Vector3_1.Vector3.subtract(v1, v0);
            var e2 = Vector3_1.Vector3.subtract(v2, v0);
            var faceNormal = Vector3_1.Vector3.cross(e1, e2).normalize();
            mesh.faceNormals.push(faceNormal);
            // 调试信息
            var center = new Vector3_1.Vector3((v0.x + v1.x + v2.x) / 3, (v0.y + v1.y + v2.y) / 3, (v0.z + v1.z + v2.z) / 3);
            var end = center.clone().add(faceNormal);
            mesh._debug_faceNormalLine.push(new Mesh_1.Line(center, end));
        }
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

},{"../Math/Bounds":11,"../Math/Vector2":14,"../Math/Vector3":15,"../Math/Vector4":16,"../Renderer/Mesh":17}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = require("./Core/Engine");
// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化引擎
    Engine_1.Engine.Init();
    // 主循环
    function mainLoop() {
        Engine_1.Engine.Loop();
        // 请求下一帧动画
        requestAnimationFrame(mainLoop);
    }
    // 开始动画循环
    requestAnimationFrame(mainLoop);
});

},{"./Core/Engine":6}]},{},[27])

//# sourceMappingURL=bundle.js.map
