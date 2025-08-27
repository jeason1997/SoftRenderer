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
exports.Instance = exports.Transform = exports.Model = void 0;
var Model = /** @class */ (function () {
    function Model() {
    }
    return Model;
}());
exports.Model = Model;
var Transform = /** @class */ (function () {
    function Transform() {
    }
    return Transform;
}());
exports.Transform = Transform;
var Instance = /** @class */ (function () {
    function Instance() {
    }
    return Instance;
}());
exports.Instance = Instance;
},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Renderer = void 0;
var Color_1 = require("./Color");
var Vector2_1 = require("./Vector2");
var Renderer = /** @class */ (function () {
    function Renderer(uint32View, canvasWidth, canvasHeight) {
        this.uint32View = uint32View;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
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
        this.uint32View[Math.floor(y) * this.canvasWidth + Math.floor(x)] = color;
    };
    Renderer.prototype.DrawLine = function (x1, y1, x2, y2, color) {
        var _a, _b;
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
        var m = Math.floor(p123.length / 2);
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
            var dx = Math.abs(Math.floor(d2 - d1));
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
        var m = Math.floor(p123.length / 2);
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
    Renderer.prototype.ViewportToCanvas = function (x, y) {
        return {
            x: x * this.canvasWidth,
            y: y * this.canvasHeight
        };
    };
    Renderer.prototype.ProjectVertex = function (vertex) {
        return new Vector2_1.Vector2(vertex.x, vertex.y);
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
        var cosX = Math.cos(transform.rotation.x);
        var sinX = Math.sin(transform.rotation.x);
        var cosY = Math.cos(transform.rotation.y);
        var sinY = Math.sin(transform.rotation.y);
        var cosZ = Math.cos(transform.rotation.z);
        var sinZ = Math.sin(transform.rotation.z);
    };
    Renderer.prototype.TranslateVertex = function (vertex, transform) {
        vertex.x += transform.position.x;
        vertex.y += transform.position.y;
        vertex.z += transform.position.z;
    };
    //#endregion
    //#region 绘制物体
    Renderer.prototype.DrawObject = function (vertices, vertexColors, triangles, drawWireframe) {
        if (drawWireframe === void 0) { drawWireframe = false; }
        // 投影
        var projectedVertices = new Array(vertices.length);
        for (var i = 0; i < vertices.length; i++) {
            projectedVertices[i] = this.ProjectVertex(vertices[i]);
        }
        // 绘制三角形
        for (var _i = 0, triangles_1 = triangles; _i < triangles_1.length; _i++) {
            var triangle = triangles_1[_i];
            var v1 = triangle[0], v2 = triangle[1], v3 = triangle[2];
            var p1 = projectedVertices[v1];
            var p2 = projectedVertices[v2];
            var p3 = projectedVertices[v3];
            // 线框模式，暂不支持顶点色
            if (drawWireframe) {
                this.DrawTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, Color_1.Color.WHITE);
            }
            else {
                // 获取顶点颜色
                var color1 = vertexColors[v1];
                var color2 = vertexColors[v2];
                var color3 = vertexColors[v3];
                // 绘制带顶点颜色的三角形
                this.DrawTriangleFilledWithVertexColor(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, color1, color2, color3);
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
        var dx = Math.abs(Math.floor(a2 - a1));
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
},{"./Color":1,"./Vector2":5}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Vector2 = void 0;
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2;
}());
exports.Vector2 = Vector2;
},{}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Vector3 = void 0;
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vector3;
}());
exports.Vector3 = Vector3;
},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Color_1 = require("./Color");
var Input_1 = require("./Input");
var Model_1 = require("./Model");
var Renderer_1 = require("./Renderer");
var Vector3_1 = require("./Vector3");
// 画布尺寸
var canvasWidth = 400;
var canvasHeight = 400;
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
    var model = new Model_1.Model();
    model.name = "立方体";
    model.vertices = [
        new Vector3_1.Vector3(-50, -50, -50),
        new Vector3_1.Vector3(-50, 50, -50),
        new Vector3_1.Vector3(50, 50, -50),
        new Vector3_1.Vector3(50, -50, -50),
        new Vector3_1.Vector3(-50, -50, 50),
        new Vector3_1.Vector3(-50, 50, 50),
        new Vector3_1.Vector3(50, 50, 50),
        new Vector3_1.Vector3(50, -50, 50),
    ];
    model.vertexColors = [
        Color_1.Color.RED,
        Color_1.Color.GREEN,
        Color_1.Color.BLUE,
        Color_1.Color.YELLOW,
        Color_1.Color.MAGENTA,
        Color_1.Color.CYAN,
        Color_1.Color.WHITE,
        Color_1.Color.ORANGE,
    ];
    model.triangles = [
        [0, 1, 2],
        [0, 2, 3],
        [4, 5, 6],
        [4, 6, 7],
        [0, 4, 7],
        [0, 7, 3],
        [1, 5, 6],
        [1, 6, 2],
        [0, 4, 5],
        [0, 5, 1],
        [2, 6, 7],
        [2, 7, 3],
    ];
    var cubeInstance = new Model_1.Instance();
    cubeInstance.model = model;
    cubeInstance.transform = new Model_1.Transform();
    cubeInstance.transform.position = new Vector3_1.Vector3(0, 0, 0);
    cubeInstance.transform.rotation = new Vector3_1.Vector3(0, 0, 0);
    cubeInstance.transform.scale = new Vector3_1.Vector3(1, 1, 1);
    instances.push(cubeInstance);
}
function Update() {
}
function Render(renderer) {
    renderer.Clear(Color_1.Color.BLACK);
    for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
        var instance = instances_1[_i];
        renderer.DrawObject(instance.model.vertices, instance.model.vertexColors, instance.model.triangles);
    }
    // 画三角形
    renderer.DrawTriangleFilledWithVertexColor(200, 200, 300, 100, Input_1.Input.mouseX, Input_1.Input.mouseY, Color_1.Color.RED, Color_1.Color.GREEN, Color_1.Color.BLUE);
}
},{"./Color":1,"./Input":2,"./Model":3,"./Renderer":4,"./Vector3":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTW9kZWwudHMiLCJzcmMvUmVuZGVyZXIudHMiLCJzcmMvVmVjdG9yMi50cyIsInNyYy9WZWN0b3IzLnRzIiwic3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7SUFrQkksZUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFlO1FBQWYsa0JBQUEsRUFBQSxPQUFlO1FBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVNLHdCQUFRLEdBQWY7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDbkMsT0FBTyxJQUFJLEtBQUssQ0FDWixNQUFNLEdBQUcsSUFBSSxFQUNiLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFDcEIsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUNyQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQ3hCLENBQUM7SUFDTixDQUFDO0lBbkNzQixXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FB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RUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0YsU0FBUztRQUNULEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNWLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUvQyxTQUFTO1FBQ1QsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUM7UUFDdEIsSUFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzVCLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQztR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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdISVRFID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMQUNLID0gbmV3IENvbG9yKDAsIDAsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSQVkgPSBuZXcgQ29sb3IoMTI4LCAxMjgsIDEyOCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVEID0gbmV3IENvbG9yKDI1NSwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JFRU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTFVFID0gbmV3IENvbG9yKDAsIDAsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgWUVMTE9XID0gbmV3IENvbG9yKDI1NSwgMjU1LCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDWUFOID0gbmV3IENvbG9yKDAsIDI1NSwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQUdFTlRBID0gbmV3IENvbG9yKDI1NSwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBPUkFOR0UgPSBuZXcgQ29sb3IoMjU1LCAxNjUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBVUlBMRSA9IG5ldyBDb2xvcigxMjgsIDAsIDEyOCkuVG9VaW50MzIoKTtcclxuXHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlciA9IDI1NSkge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRvVWludDMyKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5hIDw8IDI0KSB8ICh0aGlzLmIgPDwgMTYpIHwgKHRoaXMuZyA8PCA4KSB8IHRoaXMucjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZyb21VaW50MzIodWludDMyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICB1aW50MzIgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDgpICYgMHhGRixcclxuICAgICAgICAgICAgKHVpbnQzMiA+PiAxNikgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDI0KSAmIDB4RkZcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIElucHV0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VYOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVk6IG51bWJlciA9IDA7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vZGVsIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdmVydGljZXM6IFZlY3RvcjNbXTtcclxuICAgIHB1YmxpYyB2ZXJ0ZXhDb2xvcnM6IG51bWJlcltdO1xyXG4gICAgcHVibGljIHRyaWFuZ2xlczogbnVtYmVyW11bXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICBwdWJsaWMgcG9zaXRpb246IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgcm90YXRpb246IFZlY3RvcjM7XHJcbiAgICBwdWJsaWMgc2NhbGU6IFZlY3RvcjM7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0YW5jZSB7XHJcbiAgICBwdWJsaWMgbW9kZWw6IE1vZGVsO1xyXG4gICAgcHVibGljIHRyYW5zZm9ybTogVHJhbnNmb3JtO1xyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9Nb2RlbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vVmVjdG9yMlwiO1xyXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcIi4vVmVjdG9yM1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcclxuICAgIHByaXZhdGUgY2FudmFzV2lkdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgY2FudmFzSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHVpbnQzMlZpZXc6IFVpbnQzMkFycmF5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVpbnQzMlZpZXc6IFVpbnQzMkFycmF5LCBjYW52YXNXaWR0aDogbnVtYmVyLCBjYW52YXNIZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudWludDMyVmlldyA9IHVpbnQzMlZpZXc7XHJcbiAgICAgICAgdGhpcy5jYW52YXNXaWR0aCA9IGNhbnZhc1dpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiDln7rnoYDnu5jliLbmjqXlj6NcclxuXHJcbiAgICBwdWJsaWMgQ2xlYXIoY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOS9v+eUqCBmaWxsIOaWueazleabv+S7o+W+queOr++8jOaAp+iDveabtOWlvVxyXG4gICAgICAgIHRoaXMudWludDMyVmlldy5maWxsKGNvbG9yKTtcclxuICAgICAgICAvLyDmiJbogIXkvb/nlKjlvqrnjq/vvIzkvYbmgKfog73ovoPlt65cclxuICAgICAgICAvLyBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2FudmFzV2lkdGg7IHgrKykge1xyXG4gICAgICAgIC8vICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuY2FudmFzSGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuU2V0UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3UGl4ZWwoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXdbTWF0aC5mbG9vcih5KSAqIHRoaXMuY2FudmFzV2lkdGggKyBNYXRoLmZsb29yKHgpXSA9IGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3TGluZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZHggPSB4MiAtIHgxO1xyXG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcclxuXHJcbiAgICAgICAgLy8g5Li65L2V6KaB5Yy65YiG5pac546H5piv5ZCm5YGP5rC05bmz6L+Y5piv5Z6C55u05ZGi77yf5Zug5Li65aaC5p6c5LiN5Yy65YiG77yM5L6L5aaC5b2T5pac546H5aSn5LqOMeaXtu+8jOS8muWvvOiHtOebtOe6v+e7mOWItuS4jei/nue7re+8jOWboOS4unnkvJrot7Plj5jvvIzogIzkuI3mmK/ov57nu63nmoTlop7liqDjgIJcclxuICAgICAgICAvLyDlj6rmnInmlpznjofliJrlpb3kuLox5pe277yMeOi3n3nmiY3mmK/ov57nu63lkIzmraXoh6rlop7nmoTvvIx4KzHvvIzliJl55LmfKzFcclxuICAgICAgICAvLyDmiYDku6XvvIzlvZPmlpznjoflpKfkuo4x5pe277yM5oiR5Lus6ZyA6KaB5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj++8jOiAjOW9k+aWnOeOh+Wwj+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh45L2c5Li65b6q546v5Y+Y6YeP44CCXHJcbiAgICAgICAgLy8g5Li+5Liq5p6B56uv5L6L5a2Q77yM5b2T5pac546H5Li6MOaXtu+8jOebtOe6v+WwseaYr+S4gOadoeWeguebtOebtOe6v++8jOWmguaenOi/meaXtuWAmei/mOeUqHjkvZzkuLrlvqrnjq/lj5jph4/vvIzliJnkvJrlr7zoh7Tov5nmnaHnm7Tnur/kuIrmiYDmnIl554K56YO95a+55bqU5LiA5LiqeO+8jOS5n+WwseaYr+ivtOi/meadoee6v+WPmOaIkOS4gOS4queCueS6huOAglxyXG5cclxuICAgICAgICAvLyDmlpznjoflsI/kuo4x77yM55u057q/5YGP5rC05bmz5oOF5Ya177yM5L2/55SoeOS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiBNYXRoLmFicyhkeSkpIHtcclxuICAgICAgICAgICAgLy8g5LiL6Z2i55qE5b6q546v57uY5Yi25Ye95pWw5piv5LuO5bem5b6A5Y+z55qE77yM6L+Z6YeM6KaB56Gu5L+d57uT5p2f54K55Zyo5byA5aeL54K555qE5Y+z6L65XHJcbiAgICAgICAgICAgIGlmICh4MiA8IHgxKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaWnOeOh1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZHkgLyBkeDtcclxuICAgICAgICAgICAgLy8g5oiq6Led77yIeT1heCti77yMYj15LWF477yJXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGIgPSB5MSAtIGEgKiB4MTtcclxuICAgICAgICAgICAgbGV0IHkgPSB5MTtcclxuICAgICAgICAgICAgLy8g57uY5Yi255u057q/XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICAvLyDnm7Tnur/lhazlvI95PWF4K2LvvIzov5nph4zkuI3lv4XorqHnrpfov5nkuKrlhazlvI/vvIzlm6DkuLrlvZN45YqgMeiHquWinuaXtu+8jHnkuZ/kvJrliqBh77yM5omA5Lul5Y+v5Lul55u05o6l55SoeSth5Luj5pu/YXgrYu+8jOeul+aYr+S4gOS4quaAp+iDveS8mOWMlueCuVxyXG4gICAgICAgICAgICAgICAgLy8geSA9IGEgKiB4ICsgYjtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHlzID0gdGhpcy5JbnRlcnBvbGF0ZSh4MSwgeTEsIHgyLCB5Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5c1t4IC0geDFdLCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5pac546H5aSn5LqOMe+8jOebtOe6v+WBj+WeguebtOaDheWGte+8jOS9v+eUqHnkvZzkuLrlvqrnjq/lj5jph49cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHkyIDwgeTEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYSA9IGR4IC8gZHk7XHJcbiAgICAgICAgICAgIGxldCB4ID0geDE7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaIllxyXG4gICAgICAgICAgICAvLyBjb25zdCB4cyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5EcmF3UGl4ZWwoeHNbeSAtIHkxXSwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgyLCB5MiwgeDMsIHkzLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MywgeTMsIHgxLCB5MSwgY29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWQoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOazqO+8muS7peS4i+aPkOWIsOeahOmVv+i+ue+8jOeJueaMh3novbTot6jluqbmnIDplb/nmoTovrnvvIzogIzkuI3mmK/lrp7pmYXkuIrnmoTovrnplb9cclxuXHJcbiAgICAgICAgLy8g5a+554K56L+b6KGM5o6S5bqP77yM5L2/5b6XeTE8PXkyPD15M++8jOWNs+WPr+ehruWumuS4ieinkuW9oueahOmVv+i+ueS4ukwxM++8jEwxMuWSjEwyM+WImeaYr+WPpuWkluS4pOadoeefrei+uVxyXG4gICAgICAgIGlmICh5MSA+IHkyKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTEgPiB5MykgW3gxLCB5MSwgeDMsIHkzXSA9IFt4MywgeTMsIHgxLCB5MV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5M10gPSBbeDMsIHkzLCB4MiwgeTJdO1xyXG5cclxuICAgICAgICAvLyDojrflj5Yz5p2h6L6555qE54K55Z2Q5qCH5ZCI6ZuGXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDIzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MiwgeDIsIHkzLCB4Myk7XHJcbiAgICAgICAgY29uc3QgcDEzID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkzLCB4Myk7XHJcblxyXG4gICAgICAgIC8vIOaLvOWQiOS4pOadoeefrei+ueS4uuS4gOadoemVv+i+ue+8iOWFiOenu+mZpOesrOS4gOadoei+ueeahOacgOWQjuS4gOS4quaVsOaNru+8jOmBv+WFjemHjeWkje+8iVxyXG4gICAgICAgIC8vIOeOsOWcqOWPmOaIkDLmnaHplb/ovrnvvIxMMTPlkoxMMTIzXHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcblxyXG4gICAgICAgIC8vIOWIpOaWrUwxM+WSjEwxMjPlk6rmnaHplb/ovrnmmK/lt6blk6rmnaHmmK/lj7PvvIzpg73lj5bmlbDnu4TkuK3pl7TnmoTngrnvvIzliKTmlq3osIHlt6bosIHlj7PljbPlj6/jgIJcclxuICAgICAgICBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGxldCBwTGVmdCA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHBSaWdodCA9IHAxMztcclxuICAgICAgICBpZiAocDEzW21dIDwgcDEyM1ttXSkge1xyXG4gICAgICAgICAgICBwTGVmdCA9IHAxMztcclxuICAgICAgICAgICAgcFJpZ2h0ID0gcDEyMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuawtOW5s+e6v+autVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MzsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwTGVmdFt5IC0geTFdOyB4IDw9IHBSaWdodFt5IC0geTFdOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKFxyXG4gICAgICAgIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsXHJcbiAgICAgICAgeDI6IG51bWJlciwgeTI6IG51bWJlcixcclxuICAgICAgICB4MzogbnVtYmVyLCB5MzogbnVtYmVyLFxyXG4gICAgICAgIGNvbG9yMTogbnVtYmVyLCBjb2xvcjI6IG51bWJlciwgY29sb3IzOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIOWvueeCueaMiVnlnZDmoIfmjpLluo/vvIznoa7kv515MSA8PSB5MiA8PSB5M1xyXG4gICAgICAgIGlmICh5MSA+IHkyKSBbeDEsIHkxLCB4MiwgeTIsIGNvbG9yMSwgY29sb3IyXSA9IFt4MiwgeTIsIHgxLCB5MSwgY29sb3IyLCBjb2xvcjFdO1xyXG4gICAgICAgIGlmICh5MSA+IHkzKSBbeDEsIHkxLCB4MywgeTMsIGNvbG9yMSwgY29sb3IzXSA9IFt4MywgeTMsIHgxLCB5MSwgY29sb3IzLCBjb2xvcjFdO1xyXG4gICAgICAgIGlmICh5MiA+IHkzKSBbeDIsIHkyLCB4MywgeTMsIGNvbG9yMiwgY29sb3IzXSA9IFt4MywgeTMsIHgyLCB5MiwgY29sb3IzLCBjb2xvcjJdO1xyXG5cclxuICAgICAgICAvLyDmj5Dlj5ZSR0LliIbph49cclxuICAgICAgICBjb25zdCBjMSA9IENvbG9yLkZyb21VaW50MzIoY29sb3IxKTtcclxuICAgICAgICBjb25zdCBjMiA9IENvbG9yLkZyb21VaW50MzIoY29sb3IyKTtcclxuICAgICAgICBjb25zdCBjMyA9IENvbG9yLkZyb21VaW50MzIoY29sb3IzKTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85Ye95pWw77yM6aKc6ImyMeS4juminOiJsjLlnKhkMS1kMueahOiMg+WbtOWGheWdh+WMgOaPkuWAvFxyXG4gICAgICAgIGNvbnN0IGludGVycG9sYXRlQ29sb3IgPSAoZDE6IG51bWJlciwgcjE6IG51bWJlciwgZzE6IG51bWJlciwgYjE6IG51bWJlciwgYTE6IG51bWJlcixcclxuICAgICAgICAgICAgZDI6IG51bWJlciwgcjI6IG51bWJlciwgZzI6IG51bWJlciwgYjI6IG51bWJlciwgYTI6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAvLyDpooTliIbphY3mlbDnu4TlpKflsI9cclxuICAgICAgICAgICAgY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGQyIC0gZDEpKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfmraXplb9cclxuICAgICAgICAgICAgY29uc3QgaW52RGVsdGEgPSAxIC8gKGQyIC0gZDEpO1xyXG4gICAgICAgICAgICBjb25zdCByU3RlcCA9IChyMiAtIHIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBnU3RlcCA9IChnMiAtIGcxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBiU3RlcCA9IChiMiAtIGIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBhU3RlcCA9IChhMiAtIGExKSAqIGludkRlbHRhO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSByMSwgZyA9IGcxLCBiID0gYjEsIGEgPSBhMTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0geyByLCBnLCBiLCBhIH07XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85LiJ5p2h6L6555qE5Z2Q5qCH5ZKM6aKc6ImyXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDEyQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEpO1xyXG5cclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMjNDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkyLCBjMi5yLCBjMi5nLCBjMi5iLCBjMi5hLCB5MywgYzMuciwgYzMuZywgYzMuYiwgYzMuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTEsIGMxLnIsIGMxLmcsIGMxLmIsIGMxLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgLy8g5ZCI5bm25Lik5p2h55+t6L65XHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcbiAgICAgICAgY29uc3QgcDEyM0NvbG9ycyA9IHAxMkNvbG9ycy5jb25jYXQocDIzQ29sb3JzKTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5bem5Y+z6L6555WMXHJcbiAgICAgICAgY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBsZXQgbGVmdFBvaW50cyA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHJpZ2h0UG9pbnRzID0gcDEzO1xyXG4gICAgICAgIGxldCBsZWZ0Q29sb3JzID0gcDEyM0NvbG9ycztcclxuICAgICAgICBsZXQgcmlnaHRDb2xvcnMgPSBwMTNDb2xvcnM7XHJcblxyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIGxlZnRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgICAgIHJpZ2h0UG9pbnRzID0gcDEyMztcclxuICAgICAgICAgICAgbGVmdENvbG9ycyA9IHAxM0NvbG9ycztcclxuICAgICAgICAgICAgcmlnaHRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q6177yM5bm26L+b6KGM6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0geSAtIHkxO1xyXG4gICAgICAgICAgICBjb25zdCB4U3RhcnQgPSBsZWZ0UG9pbnRzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHhFbmQgPSByaWdodFBvaW50c1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVmdENvbG9yID0gbGVmdENvbG9yc1tpZHhdO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodENvbG9yID0gcmlnaHRDb2xvcnNbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmihOiuoeeul+minOiJsuW3ruWAvFxyXG4gICAgICAgICAgICBjb25zdCByRGlmZiA9IHJpZ2h0Q29sb3IuciAtIGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBjb25zdCBnRGlmZiA9IHJpZ2h0Q29sb3IuZyAtIGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBjb25zdCBiRGlmZiA9IHJpZ2h0Q29sb3IuYiAtIGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBjb25zdCBhRGlmZiA9IHJpZ2h0Q29sb3IuYSAtIGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5q2l6ZW/5ZKM6aKc6Imy5aKe6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGludkxlbmd0aCA9IDEgLyAoKHhFbmQgLSB4U3RhcnQpICsgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gckRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gZ0RpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gYkRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gYURpZmYgKiBpbnZMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyDliJ3lp4vpopzoibLlgLxcclxuICAgICAgICAgICAgbGV0IHIgPSBsZWZ0Q29sb3IucjtcclxuICAgICAgICAgICAgbGV0IGcgPSBsZWZ0Q29sb3IuZztcclxuICAgICAgICAgICAgbGV0IGIgPSBsZWZ0Q29sb3IuYjtcclxuICAgICAgICAgICAgbGV0IGEgPSBsZWZ0Q29sb3IuYTtcclxuXHJcbiAgICAgICAgICAgIC8vIOawtOW5s+aWueWQkeminOiJsuaPkuWAvFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDw9IHhFbmQ7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmluYWxDb2xvciA9ICgoYSB8IDApIDw8IDI0KSB8ICgoYiB8IDApIDw8IDE2KSB8ICgoZyB8IDApIDw8IDgpIHwgKHIgfCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGZpbmFsQ29sb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOe0r+WKoOminOiJsuWAvFxyXG4gICAgICAgICAgICAgICAgciArPSByU3RlcDtcclxuICAgICAgICAgICAgICAgIGcgKz0gZ1N0ZXA7XHJcbiAgICAgICAgICAgICAgICBiICs9IGJTdGVwO1xyXG4gICAgICAgICAgICAgICAgYSArPSBhU3RlcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5oqV5b2x55u45YWzXHJcblxyXG4gICAgcHVibGljIFZpZXdwb3J0VG9DYW52YXMoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiB4ICogdGhpcy5jYW52YXNXaWR0aCxcclxuICAgICAgICAgICAgeTogeSAqIHRoaXMuY2FudmFzSGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBQcm9qZWN0VmVydGV4KHZlcnRleDogVmVjdG9yMyk6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih2ZXJ0ZXgueCwgdmVydGV4LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlj5jmjaJcclxuXHJcbiAgICBwdWJsaWMgQXBwbHlUcmFuc2Zvcm0odmVydGV4OiBWZWN0b3IzLCB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG4gICAgICAgIC8vIOW/hemhu+S4peagvOWuieijheWFiOe8qeaUvuWQjuaXi+i9rOWQjuW5s+enu+eahOmhuuW6j1xyXG4gICAgICAgIHRoaXMuU2NhbGVWZXJ0ZXgodmVydGV4LCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMuUm90YXRlVmVydGV4KHZlcnRleCwgdHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLlRyYW5zbGF0ZVZlcnRleCh2ZXJ0ZXgsIHRyYW5zZm9ybSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNjYWxlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2ZXJ0ZXgueCAqPSB0cmFuc2Zvcm0uc2NhbGUueDtcclxuICAgICAgICB2ZXJ0ZXgueSAqPSB0cmFuc2Zvcm0uc2NhbGUueTtcclxuICAgICAgICB2ZXJ0ZXgueiAqPSB0cmFuc2Zvcm0uc2NhbGUuejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUm90YXRlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBjb3NYID0gTWF0aC5jb3ModHJhbnNmb3JtLnJvdGF0aW9uLngpO1xyXG4gICAgICAgIGNvbnN0IHNpblggPSBNYXRoLnNpbih0cmFuc2Zvcm0ucm90YXRpb24ueCk7XHJcbiAgICAgICAgY29uc3QgY29zWSA9IE1hdGguY29zKHRyYW5zZm9ybS5yb3RhdGlvbi55KTtcclxuICAgICAgICBjb25zdCBzaW5ZID0gTWF0aC5zaW4odHJhbnNmb3JtLnJvdGF0aW9uLnkpO1xyXG4gICAgICAgIGNvbnN0IGNvc1ogPSBNYXRoLmNvcyh0cmFuc2Zvcm0ucm90YXRpb24ueik7XHJcbiAgICAgICAgY29uc3Qgc2luWiA9IE1hdGguc2luKHRyYW5zZm9ybS5yb3RhdGlvbi56KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVHJhbnNsYXRlVmVydGV4KHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2ZXJ0ZXgueCArPSB0cmFuc2Zvcm0ucG9zaXRpb24ueDtcclxuICAgICAgICB2ZXJ0ZXgueSArPSB0cmFuc2Zvcm0ucG9zaXRpb24ueTtcclxuICAgICAgICB2ZXJ0ZXgueiArPSB0cmFuc2Zvcm0ucG9zaXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g57uY5Yi254mp5L2TXHJcblxyXG4gICAgcHVibGljIERyYXdPYmplY3QodmVydGljZXM6IFZlY3RvcjNbXSwgdmVydGV4Q29sb3JzOiBudW1iZXJbXSwgdHJpYW5nbGVzOiBudW1iZXJbXVtdLCBkcmF3V2lyZWZyYW1lOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAvLyDmipXlvbFcclxuICAgICAgICBjb25zdCBwcm9qZWN0ZWRWZXJ0aWNlcyA9IG5ldyBBcnJheSh2ZXJ0aWNlcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcHJvamVjdGVkVmVydGljZXNbaV0gPSB0aGlzLlByb2plY3RWZXJ0ZXgodmVydGljZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDnu5jliLbkuInop5LlvaJcclxuICAgICAgICBmb3IgKGNvbnN0IHRyaWFuZ2xlIG9mIHRyaWFuZ2xlcykge1xyXG4gICAgICAgICAgICBjb25zdCBbdjEsIHYyLCB2M10gPSB0cmlhbmdsZTtcclxuICAgICAgICAgICAgY29uc3QgcDEgPSBwcm9qZWN0ZWRWZXJ0aWNlc1t2MV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0gcHJvamVjdGVkVmVydGljZXNbdjJdO1xyXG4gICAgICAgICAgICBjb25zdCBwMyA9IHByb2plY3RlZFZlcnRpY2VzW3YzXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOe6v+ahhuaooeW8j++8jOaaguS4jeaUr+aMgemhtueCueiJslxyXG4gICAgICAgICAgICBpZiAoZHJhd1dpcmVmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGUocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8g6I635Y+W6aG254K56aKc6ImyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvcjEgPSB2ZXJ0ZXhDb2xvcnNbdjFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IyID0gdmVydGV4Q29sb3JzW3YyXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yMyA9IHZlcnRleENvbG9yc1t2M107XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g57uY5Yi25bim6aG254K56aKc6Imy55qE5LiJ6KeS5b2iXHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcihcclxuICAgICAgICAgICAgICAgICAgICBwMS54LCBwMS55LFxyXG4gICAgICAgICAgICAgICAgICAgIHAyLngsIHAyLnksXHJcbiAgICAgICAgICAgICAgICAgICAgcDMueCwgcDMueSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IyLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yM1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5bel5YW35Ye95pWwXHJcblxyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIOe6v+aAp+aPkuWAvFxyXG4gICAgLy8vIOS8oOWFpTLkuKrngrnvvIzov5Tlm57lroPku6znu4TmiJDnur/mrrXnmoTmj5LlgLzjgIJcclxuICAgIC8vLyDopoHmsYLvvJpcclxuICAgIC8vLyAxLiDopoHlhYjnrpflh7rnm7Tnur/lgY/msLTlubPov5jmmK/lnoLnm7TvvIzlpoLmnpzmmK/lgY/msLTlubPvvIjmlpznjoflsI/kuo4x77yJ77yM5YiZ5LuleOS4uuW+queOr++8jOS8oOWFpemhuuW6j+aYryh4MSx5MSx4Mix5MinvvIzlj43kuYvlpoLmnpznm7Tnur/lgY/lnoLnm7TvvIzliJnmmK8oeTEseDEseTIseDIpXHJcbiAgICAvLy8gMi4g5ZCM5pe26KaB56Gu5L+d57q/5q6154K555qE5pa55ZCR5piv5LuO5bem5b6A5Y+z5oiW5LuO5LiK5b6A5LiL77yM5L6L5aaC57q/5q615piv5YGP5rC05bmz55qE6K+d77yM6KaB56Gu5L+deDI+eDHvvIzlpoLmnpzmmK/lgY/lnoLnm7TnmoTor53vvIzopoHnoa7kv515Mj55MVxyXG4gICAgLy8vIOS4vuS4quS+i+WtkO+8mlxyXG4gICAgLy8vIOeCuSgwLCAwKeWSjCgyLDEp77yM5Lyg5YWl55qE5Y+C5pWw5pivKDAsIDAsIDIsIDEp77yM6L+U5Zue55qE5pivKCgyLTApKzE9MynkuKrlgLzvvIzov5nkupvlgLzmmK/ku44oMC0xKeS4remXtOaPkuWAvOeahO+8jOWNsygwLCAwLjUsIDEpXHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgcHJpdmF0ZSBJbnRlcnBvbGF0ZShhMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMjogbnVtYmVyLCBiMjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj+S7pemBv+WFjeWKqOaAgeaJqeWuuVxyXG4gICAgICAgIGNvbnN0IGR4ID0gTWF0aC5hYnMoTWF0aC5mbG9vcihhMiAtIGExKSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgQXJyYXkoZHggKyAxKTtcclxuICAgICAgICBjb25zdCBhID0gKGIyIC0gYjEpIC8gKGEyIC0gYTEpO1xyXG4gICAgICAgIGxldCBkID0gYjE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGR4OyBpKyspIHtcclxuICAgICAgICAgICAgdmFsdWVbaV0gPSBkO1xyXG4gICAgICAgICAgICBkICs9IGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxufSIsImV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgejogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy56ID0gejtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZSwgTW9kZWwsIFRyYW5zZm9ybSB9IGZyb20gXCIuL01vZGVsXCI7XHJcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuXHJcbi8vIOeUu+W4g+WwuuWvuFxyXG5jb25zdCBjYW52YXNXaWR0aCA9IDQwMDtcclxuY29uc3QgY2FudmFzSGVpZ2h0ID0gNDAwO1xyXG5cclxuLy8g5a+56LGh5YiX6KGoXHJcbmNvbnN0IGluc3RhbmNlczogSW5zdGFuY2VbXSA9IFtdO1xyXG5cclxuLy8g5b2TRE9N5YaF5a655Yqg6L295a6M5oiQ5ZCO5omn6KGMXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAvLyDojrflj5ZjYW52YXPlhYPntKDlkowyROa4suafk+S4iuS4i+aWh1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgLy8g6K6+572uY2FudmFz5bC65a+4XHJcbiAgICBjYW52YXMud2lkdGggPSBjYW52YXNXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgLy8g5Yib5bu65Zu+5YOP5pWw5o2u5a+56LGhXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguY3JlYXRlSW1hZ2VEYXRhKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKHVpbnQzMlZpZXcsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xyXG5cclxuICAgIEluaXQoKTtcclxuXHJcbiAgICAvLyDmuLLmn5Plh73mlbBcclxuICAgIGZ1bmN0aW9uIG1haW5Mb29wKCkge1xyXG4gICAgICAgIC8vIOWkhOeQhumAu+i+kVxyXG4gICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIFJlbmRlcihyZW5kZXJlcik7XHJcbiAgICAgICAgLy8g5bCG5Zu+5YOP5pWw5o2u57uY5Yi25YiwY2FudmFz5LiKXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgIC8vIOivt+axguS4i+S4gOW4p+WKqOeUu1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbiAgICB9XHJcbiAgICAvLyDlvIDlp4vliqjnlLvlvqrnjq9cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbn0pO1xyXG5cclxuLy8g6I635Y+W6byg5qCH5LqL5Lu2XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgLy8g6I635Y+W6byg5qCH55u45a+55LqOY2FudmFz55qE5Z2Q5qCHXHJcbiAgICBjb25zdCByZWN0ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgSW5wdXQubW91c2VYID0gbW91c2VYO1xyXG4gICAgSW5wdXQubW91c2VZID0gbW91c2VZO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgbW9kZWwubmFtZSA9IFwi56uL5pa55L2TXCI7XHJcbiAgICBtb2RlbC52ZXJ0aWNlcyA9IFtcclxuICAgICAgICBuZXcgVmVjdG9yMygtNTAsIC01MCwgLTUwKSxcclxuICAgICAgICBuZXcgVmVjdG9yMygtNTAsIDUwLCAtNTApLFxyXG4gICAgICAgIG5ldyBWZWN0b3IzKDUwLCA1MCwgLTUwKSxcclxuICAgICAgICBuZXcgVmVjdG9yMyg1MCwgLTUwLCAtNTApLFxyXG4gICAgICAgIG5ldyBWZWN0b3IzKC01MCwgLTUwLCA1MCksXHJcbiAgICAgICAgbmV3IFZlY3RvcjMoLTUwLCA1MCwgNTApLFxyXG4gICAgICAgIG5ldyBWZWN0b3IzKDUwLCA1MCwgNTApLFxyXG4gICAgICAgIG5ldyBWZWN0b3IzKDUwLCAtNTAsIDUwKSxcclxuICAgIF07XHJcbiAgICBtb2RlbC52ZXJ0ZXhDb2xvcnMgPSBbXHJcbiAgICAgICAgQ29sb3IuUkVELFxyXG4gICAgICAgIENvbG9yLkdSRUVOLFxyXG4gICAgICAgIENvbG9yLkJMVUUsXHJcbiAgICAgICAgQ29sb3IuWUVMTE9XLFxyXG4gICAgICAgIENvbG9yLk1BR0VOVEEsXHJcbiAgICAgICAgQ29sb3IuQ1lBTixcclxuICAgICAgICBDb2xvci5XSElURSxcclxuICAgICAgICBDb2xvci5PUkFOR0UsXHJcbiAgICBdO1xyXG4gICAgbW9kZWwudHJpYW5nbGVzID0gW1xyXG4gICAgICAgIFswLCAxLCAyXSxcclxuICAgICAgICBbMCwgMiwgM10sXHJcbiAgICAgICAgWzQsIDUsIDZdLFxyXG4gICAgICAgIFs0LCA2LCA3XSxcclxuICAgICAgICBbMCwgNCwgN10sXHJcbiAgICAgICAgWzAsIDcsIDNdLFxyXG4gICAgICAgIFsxLCA1LCA2XSxcclxuICAgICAgICBbMSwgNiwgMl0sXHJcbiAgICAgICAgWzAsIDQsIDVdLFxyXG4gICAgICAgIFswLCA1LCAxXSxcclxuICAgICAgICBbMiwgNiwgN10sXHJcbiAgICAgICAgWzIsIDcsIDNdLFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBjdWJlSW5zdGFuY2UgPSBuZXcgSW5zdGFuY2UoKTtcclxuICAgIGN1YmVJbnN0YW5jZS5tb2RlbCA9IG1vZGVsO1xyXG4gICAgY3ViZUluc3RhbmNlLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgIGN1YmVJbnN0YW5jZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIGN1YmVJbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuICAgIGN1YmVJbnN0YW5jZS50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yMygxLCAxLCAxKTtcclxuICAgIGluc3RhbmNlcy5wdXNoKGN1YmVJbnN0YW5jZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFVwZGF0ZSgpIHtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJlbmRlcihyZW5kZXJlcjogUmVuZGVyZXIpIHtcclxuICAgIHJlbmRlcmVyLkNsZWFyKENvbG9yLkJMQUNLKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xyXG4gICAgICAgIHJlbmRlcmVyLkRyYXdPYmplY3QoXHJcbiAgICAgICAgICAgIGluc3RhbmNlLm1vZGVsLnZlcnRpY2VzLFxyXG4gICAgICAgICAgICBpbnN0YW5jZS5tb2RlbC52ZXJ0ZXhDb2xvcnMsXHJcbiAgICAgICAgICAgIGluc3RhbmNlLm1vZGVsLnRyaWFuZ2xlcyxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeUu+S4ieinkuW9olxyXG4gICAgcmVuZGVyZXIuRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKDIwMCwgMjAwLCAzMDAsIDEwMCwgSW5wdXQubW91c2VYLCBJbnB1dC5tb3VzZVksIENvbG9yLlJFRCwgQ29sb3IuR1JFRU4sIENvbG9yLkJMVUUpO1xyXG59Il19
