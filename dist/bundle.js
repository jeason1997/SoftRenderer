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
        this.canvasWidthHalf = canvasWidth >> 1;
        this.canvasHeightHalf = canvasHeight >> 1;
        this.aspectRatio = canvasWidth / canvasHeight;
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
        if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
            return;
        }
        this.uint32View[y * this.canvasWidth + x] = color;
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
        var viewportHeight = 1 / this.aspectRatio;
        // 将投影坐标映射到Canvas像素坐标
        // X坐标：从 [-viewportWidth/2, viewportWidth/2] 映射到 [0, canvasWidth]
        // Y坐标：从 [-viewportHeight/2, viewportHeight/2] 映射到 [0, canvasHeight] (注意Y轴方向)
        var canvasX = ((point.x + viewportWidth / 2) / viewportWidth) * this.canvasWidth;
        var canvasY = this.canvasHeight - (((point.y + viewportHeight / 2) / viewportHeight) * this.canvasHeight); // Canvas的Y轴通常是向下的
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
        var cosX = Math.cos(transform.rotation.x);
        var sinX = Math.sin(transform.rotation.x);
        var cosY = Math.cos(transform.rotation.y);
        var sinY = Math.sin(transform.rotation.y);
        var cosZ = Math.cos(transform.rotation.z);
        var sinZ = Math.sin(transform.rotation.z);
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
    Renderer.prototype.DrawObject = function (obj, drawWireframe) {
        if (drawWireframe === void 0) { drawWireframe = false; }
        var model = obj.model;
        var vertices = model.vertices;
        var vertexColors = model.vertexColors;
        var triangles = model.triangles;
        var projectedVertices = new Array(vertices.length);
        for (var i = 0; i < vertices.length; i++) {
            var vertice = vertices[i].clone();
            // 先变换
            this.ApplyTransform(vertice, obj.transform);
            // 再投影
            projectedVertices[i] = this.ProjectVertex(vertice);
            // 再视口映射
            this.ViewportToCanvas(projectedVertices[i]);
        }
        // 最后绘制三角形到屏幕上
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
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
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
var canvasHeight = 600;
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
        new Vector3_1.Vector3(-0.5, -0.5, -0.5),
        new Vector3_1.Vector3(-0.5, 0.5, -0.5),
        new Vector3_1.Vector3(0.5, 0.5, -0.5),
        new Vector3_1.Vector3(0.5, -0.5, -0.5),
        new Vector3_1.Vector3(-0.5, -0.5, 0.5),
        new Vector3_1.Vector3(-0.5, 0.5, 0.5),
        new Vector3_1.Vector3(0.5, 0.5, 0.5),
        new Vector3_1.Vector3(0.5, -0.5, 0.5) // Original (-1, -0.5, 6) -> (-1+1.5, -0.5+0, 6-5.5)
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
    cubeInstance.transform.position = new Vector3_1.Vector3(0, 0, 3);
    cubeInstance.transform.rotation = new Vector3_1.Vector3(350, 50, 0);
    cubeInstance.transform.scale = new Vector3_1.Vector3(1, 1, 1);
    cubeInstance.shader = true;
    instances.push(cubeInstance);
    var cubeInstance2 = new Model_1.Instance();
    cubeInstance2.model = model;
    cubeInstance2.transform = new Model_1.Transform();
    cubeInstance2.transform.position = new Vector3_1.Vector3(1, 1, 3);
    cubeInstance2.transform.rotation = new Vector3_1.Vector3(0, 0, 0);
    cubeInstance2.transform.scale = new Vector3_1.Vector3(0.5, 0.5, 0.5);
    cubeInstance2.shader = false;
    instances.push(cubeInstance2);
}
function Update() {
    for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
        var instance = instances_1[_i];
        // 让物体在所有轴上旋转
        instance.transform.rotation.x += 0.01;
        instance.transform.rotation.y += 0.02;
        instance.transform.rotation.z += 0.015;
        // 使用sin函数实现缩放在0.9到1.1之间循环
        // const scaleOffset = Math.sin(Date.now() * 0.002) * 0.1 + 1;
        // instance.transform.scale.x = scaleOffset;
        // instance.transform.scale.y = scaleOffset;
        // instance.transform.scale.z = scaleOffset;
    }
}
function Render(renderer) {
    renderer.Clear(Color_1.Color.BLACK);
    for (var _i = 0, instances_2 = instances; _i < instances_2.length; _i++) {
        var instance = instances_2[_i];
        renderer.DrawObject(instance, !instance.shader);
    }
    // 画三角形
    // renderer.DrawTriangleFilledWithVertexColor(0, 0, 100, 100, Input.mouseX, Input.mouseY, Color.RED, Color.GREEN, Color.BLUE);
}
},{"./Color":1,"./Input":2,"./Model":3,"./Renderer":4,"./Vector3":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sb3IudHMiLCJzcmMvSW5wdXQudHMiLCJzcmMvTW9kZWwudHMiLCJzcmMvUmVuZGVyZXIudHMiLCJzcmMvVmVjdG9yMi50cyIsInNyYy9WZWN0b3IzLnRzIiwic3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7SUFrQkksZUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFlO1FBQWYsa0JBQUEsRUFBQSxPQUFlO1FBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVNLHdCQUFRLEdBQWY7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVhLGdCQUFVLEdBQXhCLFVBQXlCLE1BQWM7UUFDbkMsT0FBTyxJQUFJLEtBQUssQ0FDWixNQUFNLEdBQUcsSUFBSSxFQUNiLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFDcEIsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUNyQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQ3hCLENBQUM7SUFDTixDQUFDO0lBbkNzQixXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FB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USxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLFNBQVM7UUFDVCxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM1QyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsU0FBUztRQUNULElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVDLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxVQUFVO1FBQ1YsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDN0MsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJ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QyxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ1osQ0FBQztJQUVGLElBQU0sWUFBWSxHQUFHLElBQUksZ0JBQVEsRUFBRSxDQUFDO0lBQ3BDLFlBQVksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQzNCLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBUyxFQUFFLENBQUM7SUFDekMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDM0IsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUU3QixJQUFNLGFBQWEsR0FBRyxJQUFJLGdCQUFRLEVBQUUsQ0FBQztJQUNyQyxhQUFhLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUM1QixhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQVMsRUFBRSxDQUFDO0lBQzFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGFBQWEsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNELGFBQWEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQzdCLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO1FBQTdCLElBQU0sUUFBUSxrQkFBQTtRQUNmLGFBQWE7UUFDYixRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDdEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztRQUV2QywwQkFBMEI7UUFDMUIsOERBQThEO1FBQzlELDRDQUE0QztRQUM1Qyw0Q0FBNEM7UUFDNUMsNENBQTRDO0tBQy9DO0FBQ0wsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLFFBQWtCO0lBQzlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTVCLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO1FBQTdCLElBQU0sUUFBUSxrQkFBQTtRQUNmLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ25EO0lBRUQsT0FBTztJQUNQLDhIQUE4SDtBQUNsSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgV0hJVEUgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxBQ0sgPSBuZXcgQ29sb3IoMCwgMCwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR1JBWSA9IG5ldyBDb2xvcigxMjgsIDEyOCwgMTI4KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRUQgPSBuZXcgQ29sb3IoMjU1LCAwLCAwKS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkVFTiA9IG5ldyBDb2xvcigwLCAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMVUUgPSBuZXcgQ29sb3IoMCwgMCwgMjU1KS5Ub1VpbnQzMigpO1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBZRUxMT1cgPSBuZXcgQ29sb3IoMjU1LCAyNTUsIDApLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENZQU4gPSBuZXcgQ29sb3IoMCwgMjU1LCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BR0VOVEEgPSBuZXcgQ29sb3IoMjU1LCAwLCAyNTUpLlRvVWludDMyKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE9SQU5HRSA9IG5ldyBDb2xvcigyNTUsIDE2NSwgMCkuVG9VaW50MzIoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFVSUExFID0gbmV3IENvbG9yKDEyOCwgMCwgMTI4KS5Ub1VpbnQzMigpO1xyXG5cclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyID0gMjU1KSB7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVG9VaW50MzIoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmEgPDwgMjQpIHwgKHRoaXMuYiA8PCAxNikgfCAodGhpcy5nIDw8IDgpIHwgdGhpcy5yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgRnJvbVVpbnQzMih1aW50MzI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoXHJcbiAgICAgICAgICAgIHVpbnQzMiAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gOCkgJiAweEZGLFxyXG4gICAgICAgICAgICAodWludDMyID4+IDE2KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICh1aW50MzIgPj4gMjQpICYgMHhGRlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgSW5wdXQge1xyXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZVg6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlWTogbnVtYmVyID0gMDtcclxufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kZWwge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyB2ZXJ0aWNlczogVmVjdG9yM1tdO1xyXG4gICAgcHVibGljIHZlcnRleENvbG9yczogbnVtYmVyW107XHJcbiAgICBwdWJsaWMgdHJpYW5nbGVzOiBudW1iZXJbXVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcclxuICAgIHB1YmxpYyBwb3NpdGlvbjogVmVjdG9yMztcclxuICAgIHB1YmxpYyByb3RhdGlvbjogVmVjdG9yMztcclxuICAgIHB1YmxpYyBzY2FsZTogVmVjdG9yMztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlIHtcclxuICAgIHB1YmxpYyBtb2RlbDogTW9kZWw7XHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtOiBUcmFuc2Zvcm07XHJcbiAgICBwdWJsaWMgc2hhZGVyOiBib29sZWFuO1xyXG59IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZSwgVHJhbnNmb3JtIH0gZnJvbSBcIi4vTW9kZWxcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1ZlY3RvcjJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XHJcbiAgICBwcml2YXRlIGNhbnZhc1dpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGNhbnZhc0hlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYW52YXNXaWR0aEhhbGY6IG51bWJlcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzSGVpZ2h0SGFsZjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3BlY3RSYXRpbzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB1aW50MzJWaWV3OiBVaW50MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aW50MzJWaWV3OiBVaW50MzJBcnJheSwgY2FudmFzV2lkdGg6IG51bWJlciwgY2FudmFzSGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSB1aW50MzJWaWV3O1xyXG4gICAgICAgIHRoaXMuY2FudmFzV2lkdGggPSBjYW52YXNXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNhbnZhc0hlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhc1dpZHRoSGFsZiA9IGNhbnZhc1dpZHRoID4+IDE7XHJcbiAgICAgICAgdGhpcy5jYW52YXNIZWlnaHRIYWxmID0gY2FudmFzSGVpZ2h0ID4+IDE7XHJcbiAgICAgICAgdGhpcy5hc3BlY3RSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiDln7rnoYDnu5jliLbmjqXlj6NcclxuXHJcbiAgICBwdWJsaWMgQ2xlYXIoY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOS9v+eUqCBmaWxsIOaWueazleabv+S7o+W+queOr++8jOaAp+iDveabtOWlvVxyXG4gICAgICAgIHRoaXMudWludDMyVmlldy5maWxsKGNvbG9yKTtcclxuICAgICAgICAvLyDmiJbogIXkvb/nlKjlvqrnjq/vvIzkvYbmgKfog73ovoPlt65cclxuICAgICAgICAvLyBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2FudmFzV2lkdGg7IHgrKykge1xyXG4gICAgICAgIC8vICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuY2FudmFzSGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuU2V0UGl4ZWwoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3UGl4ZWwoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDnu5jliLbliLDlsY/luZXkuIrnmoTlg4/ntKDlupTor6XmmK/mlbTmlbDnmoRcclxuICAgICAgICAvLyDkvJjljJY6IOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4ID0gKHggfCAwKTtcclxuICAgICAgICB5ID0gKHkgfCAwKTtcclxuICAgICAgICAvLyB4ID0gTWF0aC5mbG9vcih4KTtcclxuICAgICAgICAvLyB5ID0gTWF0aC5mbG9vcih5KTtcclxuXHJcbiAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gdGhpcy5jYW52YXNXaWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWludDMyVmlld1t5ICogdGhpcy5jYW52YXNXaWR0aCArIHhdID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERyYXdMaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICAvLyDlj5bmlbRcclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuXHJcbiAgICAgICAgY29uc3QgZHggPSB4MiAtIHgxO1xyXG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcclxuXHJcbiAgICAgICAgLy8g5Li65L2V6KaB5Yy65YiG5pac546H5piv5ZCm5YGP5rC05bmz6L+Y5piv5Z6C55u05ZGi77yf5Zug5Li65aaC5p6c5LiN5Yy65YiG77yM5L6L5aaC5b2T5pac546H5aSn5LqOMeaXtu+8jOS8muWvvOiHtOebtOe6v+e7mOWItuS4jei/nue7re+8jOWboOS4unnkvJrot7Plj5jvvIzogIzkuI3mmK/ov57nu63nmoTlop7liqDjgIJcclxuICAgICAgICAvLyDlj6rmnInmlpznjofliJrlpb3kuLox5pe277yMeOi3n3nmiY3mmK/ov57nu63lkIzmraXoh6rlop7nmoTvvIx4KzHvvIzliJl55LmfKzFcclxuICAgICAgICAvLyDmiYDku6XvvIzlvZPmlpznjoflpKfkuo4x5pe277yM5oiR5Lus6ZyA6KaB5L2/55SoeeS9nOS4uuW+queOr+WPmOmHj++8jOiAjOW9k+aWnOeOh+Wwj+S6jjHml7bvvIzmiJHku6zpnIDopoHkvb/nlKh45L2c5Li65b6q546v5Y+Y6YeP44CCXHJcbiAgICAgICAgLy8g5Li+5Liq5p6B56uv5L6L5a2Q77yM5b2T5pac546H5Li6MOaXtu+8jOebtOe6v+WwseaYr+S4gOadoeWeguebtOebtOe6v++8jOWmguaenOi/meaXtuWAmei/mOeUqHjkvZzkuLrlvqrnjq/lj5jph4/vvIzliJnkvJrlr7zoh7Tov5nmnaHnm7Tnur/kuIrmiYDmnIl554K56YO95a+55bqU5LiA5LiqeO+8jOS5n+WwseaYr+ivtOi/meadoee6v+WPmOaIkOS4gOS4queCueS6huOAglxyXG5cclxuICAgICAgICAvLyDmlpznjoflsI/kuo4x77yM55u057q/5YGP5rC05bmz5oOF5Ya177yM5L2/55SoeOS9nOS4uuW+queOr+WPmOmHj1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiBNYXRoLmFicyhkeSkpIHtcclxuICAgICAgICAgICAgLy8g5LiL6Z2i55qE5b6q546v57uY5Yi25Ye95pWw5piv5LuO5bem5b6A5Y+z55qE77yM6L+Z6YeM6KaB56Gu5L+d57uT5p2f54K55Zyo5byA5aeL54K555qE5Y+z6L65XHJcbiAgICAgICAgICAgIGlmICh4MiA8IHgxKSBbeDEsIHkxLCB4MiwgeTJdID0gW3gyLCB5MiwgeDEsIHkxXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaWnOeOh1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZHkgLyBkeDtcclxuICAgICAgICAgICAgLy8g5oiq6Led77yIeT1heCti77yMYj15LWF477yJXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGIgPSB5MSAtIGEgKiB4MTtcclxuICAgICAgICAgICAgbGV0IHkgPSB5MTtcclxuICAgICAgICAgICAgLy8g57uY5Yi255u057q/XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICAvLyDnm7Tnur/lhazlvI95PWF4K2LvvIzov5nph4zkuI3lv4XorqHnrpfov5nkuKrlhazlvI/vvIzlm6DkuLrlvZN45YqgMeiHquWinuaXtu+8jHnkuZ/kvJrliqBh77yM5omA5Lul5Y+v5Lul55u05o6l55SoeSth5Luj5pu/YXgrYu+8jOeul+aYr+S4gOS4quaAp+iDveS8mOWMlueCuVxyXG4gICAgICAgICAgICAgICAgLy8geSA9IGEgKiB4ICsgYjtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5oiWXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHlzID0gdGhpcy5JbnRlcnBvbGF0ZSh4MSwgeTEsIHgyLCB5Mik7XHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5c1t4IC0geDFdLCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5pac546H5aSn5LqOMe+8jOebtOe6v+WBj+WeguebtOaDheWGte+8jOS9v+eUqHnkvZzkuLrlvqrnjq/lj5jph49cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHkyIDwgeTEpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYSA9IGR4IC8gZHk7XHJcbiAgICAgICAgICAgIGxldCB4ID0geDE7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaIllxyXG4gICAgICAgICAgICAvLyBjb25zdCB4cyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MiwgeDIpO1xyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5EcmF3UGl4ZWwoeHNbeSAtIHkxXSwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRHJhd0xpbmUoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLkRyYXdMaW5lKHgyLCB5MiwgeDMsIHkzLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5EcmF3TGluZSh4MywgeTMsIHgxLCB5MSwgY29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEcmF3VHJpYW5nbGVGaWxsZWQoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG4gICAgICAgIC8vIOazqO+8muS7peS4i+aPkOWIsOeahOmVv+i+ue+8jOeJueaMh3novbTot6jluqbmnIDplb/nmoTovrnvvIzogIzkuI3mmK/lrp7pmYXkuIrnmoTovrnplb9cclxuXHJcbiAgICAgICAgLy8g5a6e6ZmF57uY5Yi25Yiw5bGP5bmV5LiK55qE54K577yM5b+F6aG75piv5pW05pWw77yM5Y+W5pW05LiA5LiL44CC5L2/55So5L2N6L+Q566X5Luj5pu/TWF0aC5mbG9vcu+8jOaPkOWNh+aAp+iDvVxyXG4gICAgICAgIHgxID0geDEgfCAwO1xyXG4gICAgICAgIHkxID0geTEgfCAwO1xyXG4gICAgICAgIHgyID0geDIgfCAwO1xyXG4gICAgICAgIHkyID0geTIgfCAwO1xyXG4gICAgICAgIHgzID0geDMgfCAwO1xyXG4gICAgICAgIHkzID0geTMgfCAwO1xyXG5cclxuICAgICAgICAvLyDlr7nngrnov5vooYzmjpLluo/vvIzkvb/lvpd5MTw9eTI8PXkz77yM5Y2z5Y+v56Gu5a6a5LiJ6KeS5b2i55qE6ZW/6L655Li6TDEz77yMTDEy5ZKMTDIz5YiZ5piv5Y+m5aSW5Lik5p2h55+t6L65XHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5Ml0gPSBbeDIsIHkyLCB4MSwgeTFdO1xyXG4gICAgICAgIGlmICh5MSA+IHkzKSBbeDEsIHkxLCB4MywgeTNdID0gW3gzLCB5MywgeDEsIHkxXTtcclxuICAgICAgICBpZiAoeTIgPiB5MykgW3gyLCB5MiwgeDMsIHkzXSA9IFt4MywgeTMsIHgyLCB5Ml07XHJcblxyXG4gICAgICAgIC8vIOiOt+WPljPmnaHovrnnmoTngrnlnZDmoIflkIjpm4ZcclxuICAgICAgICBjb25zdCBwMTIgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTIsIHgyKTtcclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMTMgPSB0aGlzLkludGVycG9sYXRlKHkxLCB4MSwgeTMsIHgzKTtcclxuXHJcbiAgICAgICAgLy8g5ou85ZCI5Lik5p2h55+t6L655Li65LiA5p2h6ZW/6L6577yI5YWI56e76Zmk56ys5LiA5p2h6L6555qE5pyA5ZCO5LiA5Liq5pWw5o2u77yM6YG/5YWN6YeN5aSN77yJXHJcbiAgICAgICAgLy8g546w5Zyo5Y+Y5oiQMuadoemVv+i+ue+8jEwxM+WSjEwxMjNcclxuICAgICAgICBwMTIucG9wKCk7XHJcbiAgICAgICAgY29uc3QgcDEyMyA9IHAxMi5jb25jYXQocDIzKTtcclxuXHJcbiAgICAgICAgLy8g5Yik5patTDEz5ZKMTDEyM+WTquadoemVv+i+ueaYr+W3puWTquadoeaYr+WPs++8jOmDveWPluaVsOe7hOS4remXtOeahOeCue+8jOWIpOaWreiwgeW3puiwgeWPs+WNs+WPr+OAglxyXG4gICAgICAgIC8vIOS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICAvLyBjb25zdCBtID0gTWF0aC5mbG9vcihwMTIzLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG0gPSAocDEyMy5sZW5ndGggPj4gMSkgfCAwO1xyXG4gICAgICAgIGxldCBwTGVmdCA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHBSaWdodCA9IHAxMztcclxuICAgICAgICBpZiAocDEzW21dIDwgcDEyM1ttXSkge1xyXG4gICAgICAgICAgICBwTGVmdCA9IHAxMztcclxuICAgICAgICAgICAgcFJpZ2h0ID0gcDEyMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuawtOW5s+e6v+autVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MzsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwTGVmdFt5IC0geTFdOyB4IDw9IHBSaWdodFt5IC0geTFdOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKFxyXG4gICAgICAgIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsXHJcbiAgICAgICAgeDI6IG51bWJlciwgeTI6IG51bWJlcixcclxuICAgICAgICB4MzogbnVtYmVyLCB5MzogbnVtYmVyLFxyXG4gICAgICAgIGNvbG9yMTogbnVtYmVyLCBjb2xvcjI6IG51bWJlciwgY29sb3IzOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIOWunumZhee7mOWItuWIsOWxj+W5leS4iueahOeCue+8jOW/hemhu+aYr+aVtOaVsO+8jOWPluaVtOS4gOS4i+OAguS9v+eUqOS9jei/kOeul+S7o+abv01hdGguZmxvb3LvvIzmj5DljYfmgKfog71cclxuICAgICAgICB4MSA9IHgxIHwgMDtcclxuICAgICAgICB5MSA9IHkxIHwgMDtcclxuICAgICAgICB4MiA9IHgyIHwgMDtcclxuICAgICAgICB5MiA9IHkyIHwgMDtcclxuICAgICAgICB4MyA9IHgzIHwgMDtcclxuICAgICAgICB5MyA9IHkzIHwgMDtcclxuXHJcbiAgICAgICAgLy8g5a+554K55oyJWeWdkOagh+aOkuW6j++8jOehruS/nXkxIDw9IHkyIDw9IHkzXHJcbiAgICAgICAgaWYgKHkxID4geTIpIFt4MSwgeTEsIHgyLCB5MiwgY29sb3IxLCBjb2xvcjJdID0gW3gyLCB5MiwgeDEsIHkxLCBjb2xvcjIsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkxID4geTMpIFt4MSwgeTEsIHgzLCB5MywgY29sb3IxLCBjb2xvcjNdID0gW3gzLCB5MywgeDEsIHkxLCBjb2xvcjMsIGNvbG9yMV07XHJcbiAgICAgICAgaWYgKHkyID4geTMpIFt4MiwgeTIsIHgzLCB5MywgY29sb3IyLCBjb2xvcjNdID0gW3gzLCB5MywgeDIsIHkyLCBjb2xvcjMsIGNvbG9yMl07XHJcblxyXG4gICAgICAgIC8vIOaPkOWPllJHQuWIhumHj1xyXG4gICAgICAgIGNvbnN0IGMxID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjEpO1xyXG4gICAgICAgIGNvbnN0IGMyID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjIpO1xyXG4gICAgICAgIGNvbnN0IGMzID0gQ29sb3IuRnJvbVVpbnQzMihjb2xvcjMpO1xyXG5cclxuICAgICAgICAvLyDmj5LlgLzlh73mlbDvvIzpopzoibIx5LiO6aKc6ImyMuWcqGQxLWQy55qE6IyD5Zu05YaF5Z2H5YyA5o+S5YC8XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVDb2xvciA9IChkMTogbnVtYmVyLCByMTogbnVtYmVyLCBnMTogbnVtYmVyLCBiMTogbnVtYmVyLCBhMTogbnVtYmVyLFxyXG4gICAgICAgICAgICBkMjogbnVtYmVyLCByMjogbnVtYmVyLCBnMjogbnVtYmVyLCBiMjogbnVtYmVyLCBhMjogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOmihOWIhumFjeaVsOe7hOWkp+Wwj1xyXG4gICAgICAgICAgICAvLyDkvb/nlKjkvY3ov5Dnrpfku6Pmm79NYXRoLmZsb29y5ZKMTWF0aC5hYnPvvIzmj5DljYfmgKfog71cclxuICAgICAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGQyIC0gZDEpKTtcclxuICAgICAgICAgICAgY29uc3QgZHggPSAoKGQyID4gZDEgPyBkMiAtIGQxIDogZDEgLSBkMikgfCAwKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAvLyDorqHnrpfmraXplb9cclxuICAgICAgICAgICAgY29uc3QgaW52RGVsdGEgPSAxIC8gKGQyIC0gZDEpO1xyXG4gICAgICAgICAgICBjb25zdCByU3RlcCA9IChyMiAtIHIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBnU3RlcCA9IChnMiAtIGcxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBiU3RlcCA9IChiMiAtIGIxKSAqIGludkRlbHRhO1xyXG4gICAgICAgICAgICBjb25zdCBhU3RlcCA9IChhMiAtIGExKSAqIGludkRlbHRhO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSByMSwgZyA9IGcxLCBiID0gYjEsIGEgPSBhMTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZHg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0geyByLCBnLCBiLCBhIH07XHJcbiAgICAgICAgICAgICAgICByICs9IHJTdGVwO1xyXG4gICAgICAgICAgICAgICAgZyArPSBnU3RlcDtcclxuICAgICAgICAgICAgICAgIGIgKz0gYlN0ZXA7XHJcbiAgICAgICAgICAgICAgICBhICs9IGFTdGVwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g5o+S5YC85LiJ5p2h6L6555qE5Z2Q5qCH5ZKM6aKc6ImyXHJcbiAgICAgICAgY29uc3QgcDEyID0gdGhpcy5JbnRlcnBvbGF0ZSh5MSwgeDEsIHkyLCB4Mik7XHJcbiAgICAgICAgY29uc3QgcDEyQ29sb3JzID0gaW50ZXJwb2xhdGVDb2xvcih5MSwgYzEuciwgYzEuZywgYzEuYiwgYzEuYSwgeTIsIGMyLnIsIGMyLmcsIGMyLmIsIGMyLmEpO1xyXG5cclxuICAgICAgICBjb25zdCBwMjMgPSB0aGlzLkludGVycG9sYXRlKHkyLCB4MiwgeTMsIHgzKTtcclxuICAgICAgICBjb25zdCBwMjNDb2xvcnMgPSBpbnRlcnBvbGF0ZUNvbG9yKHkyLCBjMi5yLCBjMi5nLCBjMi5iLCBjMi5hLCB5MywgYzMuciwgYzMuZywgYzMuYiwgYzMuYSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHAxMyA9IHRoaXMuSW50ZXJwb2xhdGUoeTEsIHgxLCB5MywgeDMpO1xyXG4gICAgICAgIGNvbnN0IHAxM0NvbG9ycyA9IGludGVycG9sYXRlQ29sb3IoeTEsIGMxLnIsIGMxLmcsIGMxLmIsIGMxLmEsIHkzLCBjMy5yLCBjMy5nLCBjMy5iLCBjMy5hKTtcclxuXHJcbiAgICAgICAgLy8g5ZCI5bm25Lik5p2h55+t6L65XHJcbiAgICAgICAgcDEyLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHAxMjMgPSBwMTIuY29uY2F0KHAyMyk7XHJcbiAgICAgICAgY29uc3QgcDEyM0NvbG9ycyA9IHAxMkNvbG9ycy5jb25jYXQocDIzQ29sb3JzKTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5bem5Y+z6L6555WMXHJcbiAgICAgICAgLy8gY29uc3QgbSA9IE1hdGguZmxvb3IocDEyMy5sZW5ndGggLyAyKTtcclxuICAgICAgICBjb25zdCBtID0gKHAxMjMubGVuZ3RoID4+IDEpIHwgMDtcclxuICAgICAgICBsZXQgbGVmdFBvaW50cyA9IHAxMjM7XHJcbiAgICAgICAgbGV0IHJpZ2h0UG9pbnRzID0gcDEzO1xyXG4gICAgICAgIGxldCBsZWZ0Q29sb3JzID0gcDEyM0NvbG9ycztcclxuICAgICAgICBsZXQgcmlnaHRDb2xvcnMgPSBwMTNDb2xvcnM7XHJcblxyXG4gICAgICAgIGlmIChwMTNbbV0gPCBwMTIzW21dKSB7XHJcbiAgICAgICAgICAgIGxlZnRQb2ludHMgPSBwMTM7XHJcbiAgICAgICAgICAgIHJpZ2h0UG9pbnRzID0gcDEyMztcclxuICAgICAgICAgICAgbGVmdENvbG9ycyA9IHAxM0NvbG9ycztcclxuICAgICAgICAgICAgcmlnaHRDb2xvcnMgPSBwMTIzQ29sb3JzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g57uY5Yi25rC05bmz57q/5q6177yM5bm26L+b6KGM6aKc6Imy5o+S5YC8XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkzOyB5KyspIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0geSAtIHkxO1xyXG4gICAgICAgICAgICBjb25zdCB4U3RhcnQgPSBsZWZ0UG9pbnRzW2lkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHhFbmQgPSByaWdodFBvaW50c1tpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVmdENvbG9yID0gbGVmdENvbG9yc1tpZHhdO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodENvbG9yID0gcmlnaHRDb2xvcnNbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmihOiuoeeul+minOiJsuW3ruWAvFxyXG4gICAgICAgICAgICBjb25zdCByRGlmZiA9IHJpZ2h0Q29sb3IuciAtIGxlZnRDb2xvci5yO1xyXG4gICAgICAgICAgICBjb25zdCBnRGlmZiA9IHJpZ2h0Q29sb3IuZyAtIGxlZnRDb2xvci5nO1xyXG4gICAgICAgICAgICBjb25zdCBiRGlmZiA9IHJpZ2h0Q29sb3IuYiAtIGxlZnRDb2xvci5iO1xyXG4gICAgICAgICAgICBjb25zdCBhRGlmZiA9IHJpZ2h0Q29sb3IuYSAtIGxlZnRDb2xvci5hO1xyXG5cclxuICAgICAgICAgICAgLy8g5q2l6ZW/5ZKM6aKc6Imy5aKe6YePXHJcbiAgICAgICAgICAgIGNvbnN0IGludkxlbmd0aCA9IDEgLyAoKHhFbmQgLSB4U3RhcnQpICsgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJTdGVwID0gckRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGdTdGVwID0gZ0RpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTdGVwID0gYkRpZmYgKiBpbnZMZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTdGVwID0gYURpZmYgKiBpbnZMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyDliJ3lp4vpopzoibLlgLxcclxuICAgICAgICAgICAgbGV0IHIgPSBsZWZ0Q29sb3IucjtcclxuICAgICAgICAgICAgbGV0IGcgPSBsZWZ0Q29sb3IuZztcclxuICAgICAgICAgICAgbGV0IGIgPSBsZWZ0Q29sb3IuYjtcclxuICAgICAgICAgICAgbGV0IGEgPSBsZWZ0Q29sb3IuYTtcclxuXHJcbiAgICAgICAgICAgIC8vIOawtOW5s+aWueWQkeminOiJsuaPkuWAvFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDw9IHhFbmQ7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmluYWxDb2xvciA9ICgoYSB8IDApIDw8IDI0KSB8ICgoYiB8IDApIDw8IDE2KSB8ICgoZyB8IDApIDw8IDgpIHwgKHIgfCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuRHJhd1BpeGVsKHgsIHksIGZpbmFsQ29sb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOe0r+WKoOminOiJsuWAvFxyXG4gICAgICAgICAgICAgICAgciArPSByU3RlcDtcclxuICAgICAgICAgICAgICAgIGcgKz0gZ1N0ZXA7XHJcbiAgICAgICAgICAgICAgICBiICs9IGJTdGVwO1xyXG4gICAgICAgICAgICAgICAgYSArPSBhU3RlcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5oqV5b2x55u45YWzXHJcblxyXG4gICAgLy8g5bCG6KeG5Y+j5LiK55qE5YaF5a655pig5bCE5Yiw5a6e6ZmF5bGP5bmV5LiKXHJcbiAgICBwdWJsaWMgVmlld3BvcnRUb0NhbnZhcyhwb2ludDogVmVjdG9yMikge1xyXG4gICAgICAgIC8vIOWBh+iuvuinhuWPo+WuveW6puS4ujHkuKrljZXkvY1cclxuICAgICAgICAvLyDlm6DkuLphc3BlY3RSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h077yMXHJcbiAgICAgICAgLy8g5omA5Lul6KeG5Y+j6auY5bqmID0gMSAvIGFzcGVjdFJhdGlvID0gY2FudmFzSGVpZ2h0IC8gY2FudmFzV2lkdGhcclxuICAgICAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gMTtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IDEgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG5cclxuICAgICAgICAvLyDlsIbmipXlvbHlnZDmoIfmmKDlsITliLBDYW52YXPlg4/ntKDlnZDmoIdcclxuICAgICAgICAvLyBY5Z2Q5qCH77ya5LuOIFstdmlld3BvcnRXaWR0aC8yLCB2aWV3cG9ydFdpZHRoLzJdIOaYoOWwhOWIsCBbMCwgY2FudmFzV2lkdGhdXHJcbiAgICAgICAgLy8gWeWdkOagh++8muS7jiBbLXZpZXdwb3J0SGVpZ2h0LzIsIHZpZXdwb3J0SGVpZ2h0LzJdIOaYoOWwhOWIsCBbMCwgY2FudmFzSGVpZ2h0XSAo5rOo5oSPWei9tOaWueWQkSlcclxuICAgICAgICBjb25zdCBjYW52YXNYID0gKChwb2ludC54ICsgdmlld3BvcnRXaWR0aCAvIDIpIC8gdmlld3BvcnRXaWR0aCkgKiB0aGlzLmNhbnZhc1dpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSB0aGlzLmNhbnZhc0hlaWdodCAtICgoKHBvaW50LnkgKyB2aWV3cG9ydEhlaWdodCAvIDIpIC8gdmlld3BvcnRIZWlnaHQpICogdGhpcy5jYW52YXNIZWlnaHQpOyAvLyBDYW52YXPnmoRZ6L206YCa5bi45piv5ZCR5LiL55qEXHJcbiAgICAgICAgcG9pbnQueCA9IGNhbnZhc1g7XHJcbiAgICAgICAgcG9pbnQueSA9IGNhbnZhc1k7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YCP6KeG5oqV5b2x77yM5bCGM0TlnLrmma/nmoTlnZDmoIfovazmjaLkuLoyROWxj+W5leWdkOagh++8jOaKleWwhOWIsOinhuWPo+S4ilxyXG4gICAgcHVibGljIFByb2plY3RWZXJ0ZXgodmVydGV4OiBWZWN0b3IzKTogVmVjdG9yMiB7XHJcbiAgICAgICAgLy8g5YGH6K6+6KeG54K55Yiw6L+R6KOB6Z2i77yI6KeG5Y+j77yJ55qE6Led56a75pivZO+8jOinhuWPo+eahOWuveaYrzFcclxuICAgICAgICAvLyDmoLnmja7kuInop5Llh73mlbDmnInvvJp0YW4oZm92LzIpID0gKDAuNSAvIGQpXHJcbiAgICAgICAgLy8g5omA5Lul77yaZCA9IDAuNSAvIHRhbihmb3YvMilcclxuICAgICAgICBjb25zdCBmb3ZEZWdyZWVzID0gNjA7XHJcbiAgICAgICAgY29uc3QgZm92UmFkaWFucyA9IGZvdkRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MCk7IC8vIOWwhuinkuW6pui9rOaNouS4uuW8p+W6plxyXG4gICAgICAgIGNvbnN0IGQgPSAwLjUgLyBNYXRoLnRhbihmb3ZSYWRpYW5zIC8gMik7XHJcblxyXG4gICAgICAgIC8vIOmAj+inhuWFrOW8j++8jOWBh+iuvuinhueCueS9jee9rigwLDAp77yM6KeG54K55Yiw6KeG5Y+j6Led56a75Li6ZO+8jOWcuuaZr+mHjOeahOeCueS4ulAoeCx5LHop77yM5oqV5bCE5Yiw6KeG5Y+j5LiK55qE54K55Li6UCcoeCx5KVxyXG4gICAgICAgIC8vIOWImeagueaNruebuOS8vOS4ieinkuW9ouacie+8mnogLyBkID0geCAvIHgnID0geSAvIHkn77yM5Y+v5b6X5Yiw77yaXHJcbiAgICAgICAgLy8geCcgPSAoZCAqIHgpIC8gelxyXG4gICAgICAgIC8vIHknID0gKGQgKiB5KSAvIHpcclxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uWCA9IChkICogdmVydGV4LngpIC8gdmVydGV4Lno7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvblkgPSAoZCAqIHZlcnRleC55KSAvIHZlcnRleC56O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIocHJvamVjdGlvblgsIHByb2plY3Rpb25ZKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5Y+Y5o2iXHJcblxyXG4gICAgcHVibGljIEFwcGx5VHJhbnNmb3JtKHZlcnRleDogVmVjdG9yMywgdHJhbnNmb3JtOiBUcmFuc2Zvcm0pIHtcclxuICAgICAgICAvLyDlv4XpobvkuKXmoLzlronoo4XlhYjnvKnmlL7lkI7ml4vovazlkI7lubPnp7vnmoTpobrluo9cclxuICAgICAgICB0aGlzLlNjYWxlVmVydGV4KHZlcnRleCwgdHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLlJvdGF0ZVZlcnRleCh2ZXJ0ZXgsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5UcmFuc2xhdGVWZXJ0ZXgodmVydGV4LCB0cmFuc2Zvcm0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTY2FsZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKj0gdHJhbnNmb3JtLnNjYWxlLng7XHJcbiAgICAgICAgdmVydGV4LnkgKj0gdHJhbnNmb3JtLnNjYWxlLnk7XHJcbiAgICAgICAgdmVydGV4LnogKj0gdHJhbnNmb3JtLnNjYWxlLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJvdGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgY29zWCA9IE1hdGguY29zKHRyYW5zZm9ybS5yb3RhdGlvbi54KTtcclxuICAgICAgICBjb25zdCBzaW5YID0gTWF0aC5zaW4odHJhbnNmb3JtLnJvdGF0aW9uLngpO1xyXG4gICAgICAgIGNvbnN0IGNvc1kgPSBNYXRoLmNvcyh0cmFuc2Zvcm0ucm90YXRpb24ueSk7XHJcbiAgICAgICAgY29uc3Qgc2luWSA9IE1hdGguc2luKHRyYW5zZm9ybS5yb3RhdGlvbi55KTtcclxuICAgICAgICBjb25zdCBjb3NaID0gTWF0aC5jb3ModHJhbnNmb3JtLnJvdGF0aW9uLnopO1xyXG4gICAgICAgIGNvbnN0IHNpblogPSBNYXRoLnNpbih0cmFuc2Zvcm0ucm90YXRpb24ueik7XHJcbiAgICAgICAgLy8g5YWI57uVWui9tOaXi+i9rFxyXG4gICAgICAgIGNvbnN0IHggPSB2ZXJ0ZXgueCAqIGNvc1ogLSB2ZXJ0ZXgueSAqIHNpblo7XHJcbiAgICAgICAgY29uc3QgeSA9IHZlcnRleC54ICogc2luWiArIHZlcnRleC55ICogY29zWjtcclxuICAgICAgICB2ZXJ0ZXgueCA9IHg7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5O1xyXG4gICAgICAgIC8vIOWGjee7lVnovbTml4vovaxcclxuICAgICAgICBjb25zdCB6ID0gdmVydGV4LnogKiBjb3NZIC0gdmVydGV4LnggKiBzaW5ZO1xyXG4gICAgICAgIGNvbnN0IHgyID0gdmVydGV4LnogKiBzaW5ZICsgdmVydGV4LnggKiBjb3NZO1xyXG4gICAgICAgIHZlcnRleC56ID0gejtcclxuICAgICAgICB2ZXJ0ZXgueCA9IHgyO1xyXG4gICAgICAgIC8vIOacgOWQjue7lVjovbTml4vovaxcclxuICAgICAgICBjb25zdCB5MiA9IHZlcnRleC55ICogY29zWCAtIHZlcnRleC56ICogc2luWDtcclxuICAgICAgICBjb25zdCB6MiA9IHZlcnRleC55ICogc2luWCArIHZlcnRleC56ICogY29zWDtcclxuICAgICAgICB2ZXJ0ZXgueSA9IHkyO1xyXG4gICAgICAgIHZlcnRleC56ID0gejI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFRyYW5zbGF0ZVZlcnRleCh2ZXJ0ZXg6IFZlY3RvcjMsIHRyYW5zZm9ybTogVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmVydGV4LnggKz0gdHJhbnNmb3JtLnBvc2l0aW9uLng7XHJcbiAgICAgICAgdmVydGV4LnkgKz0gdHJhbnNmb3JtLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdmVydGV4LnogKz0gdHJhbnNmb3JtLnBvc2l0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOe7mOWItueJqeS9k1xyXG5cclxuICAgIHB1YmxpYyBEcmF3T2JqZWN0KG9iajogSW5zdGFuY2UsIGRyYXdXaXJlZnJhbWU6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gb2JqLm1vZGVsO1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbW9kZWwudmVydGljZXM7XHJcbiAgICAgICAgY29uc3QgdmVydGV4Q29sb3JzID0gbW9kZWwudmVydGV4Q29sb3JzO1xyXG4gICAgICAgIGNvbnN0IHRyaWFuZ2xlcyA9IG1vZGVsLnRyaWFuZ2xlcztcclxuXHJcbiAgICAgICAgY29uc3QgcHJvamVjdGVkVmVydGljZXMgPSBuZXcgQXJyYXkodmVydGljZXMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCB2ZXJ0aWNlID0gdmVydGljZXNbaV0uY2xvbmUoKTtcclxuICAgICAgICAgICAgLy8g5YWI5Y+Y5o2iXHJcbiAgICAgICAgICAgIHRoaXMuQXBwbHlUcmFuc2Zvcm0odmVydGljZSwgb2JqLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIC8vIOWGjeaKleW9sVxyXG4gICAgICAgICAgICBwcm9qZWN0ZWRWZXJ0aWNlc1tpXSA9IHRoaXMuUHJvamVjdFZlcnRleCh2ZXJ0aWNlKTtcclxuICAgICAgICAgICAgLy8g5YaN6KeG5Y+j5pig5bCEXHJcbiAgICAgICAgICAgIHRoaXMuVmlld3BvcnRUb0NhbnZhcyhwcm9qZWN0ZWRWZXJ0aWNlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmnIDlkI7nu5jliLbkuInop5LlvaLliLDlsY/luZXkuIpcclxuICAgICAgICBmb3IgKGNvbnN0IHRyaWFuZ2xlIG9mIHRyaWFuZ2xlcykge1xyXG4gICAgICAgICAgICBjb25zdCBbdjEsIHYyLCB2M10gPSB0cmlhbmdsZTtcclxuICAgICAgICAgICAgY29uc3QgcDEgPSBwcm9qZWN0ZWRWZXJ0aWNlc1t2MV07XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0gcHJvamVjdGVkVmVydGljZXNbdjJdO1xyXG4gICAgICAgICAgICBjb25zdCBwMyA9IHByb2plY3RlZFZlcnRpY2VzW3YzXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOe6v+ahhuaooeW8j++8jOaaguS4jeaUr+aMgemhtueCueiJslxyXG4gICAgICAgICAgICBpZiAoZHJhd1dpcmVmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5EcmF3VHJpYW5nbGUocDEueCwgcDEueSwgcDIueCwgcDIueSwgcDMueCwgcDMueSwgQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8g6I635Y+W6aG254K56aKc6ImyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvcjEgPSB2ZXJ0ZXhDb2xvcnNbdjFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IyID0gdmVydGV4Q29sb3JzW3YyXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yMyA9IHZlcnRleENvbG9yc1t2M107XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g57uY5Yi25bim6aG254K56aKc6Imy55qE5LiJ6KeS5b2iXHJcbiAgICAgICAgICAgICAgICB0aGlzLkRyYXdUcmlhbmdsZUZpbGxlZFdpdGhWZXJ0ZXhDb2xvcihcclxuICAgICAgICAgICAgICAgICAgICBwMS54LCBwMS55LFxyXG4gICAgICAgICAgICAgICAgICAgIHAyLngsIHAyLnksXHJcbiAgICAgICAgICAgICAgICAgICAgcDMueCwgcDMueSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjEsIGNvbG9yMiwgY29sb3IzXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlt6Xlhbflh73mlbBcclxuXHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8g57q/5oCn5o+S5YC8XHJcbiAgICAvLy8g5Lyg5YWlMuS4queCue+8jOi/lOWbnuWug+S7rOe7hOaIkOe6v+auteeahOaPkuWAvOOAglxyXG4gICAgLy8vIOimgeaxgu+8mlxyXG4gICAgLy8vIDEuIOimgeWFiOeul+WHuuebtOe6v+WBj+awtOW5s+i/mOaYr+WeguebtO+8jOWmguaenOaYr+WBj+awtOW5s++8iOaWnOeOh+Wwj+S6jjHvvInvvIzliJnku6V45Li65b6q546v77yM5Lyg5YWl6aG65bqP5pivKHgxLHkxLHgyLHkyKe+8jOWPjeS5i+WmguaenOebtOe6v+WBj+WeguebtO+8jOWImeaYryh5MSx4MSx5Mix4MilcclxuICAgIC8vLyAyLiDlkIzml7bopoHnoa7kv53nur/mrrXngrnnmoTmlrnlkJHmmK/ku47lt6blvoDlj7PmiJbku47kuIrlvoDkuIvvvIzkvovlpoLnur/mrrXmmK/lgY/msLTlubPnmoTor53vvIzopoHnoa7kv514Mj54Me+8jOWmguaenOaYr+WBj+WeguebtOeahOivne+8jOimgeehruS/nXkyPnkxXHJcbiAgICAvLy8g5Li+5Liq5L6L5a2Q77yaXHJcbiAgICAvLy8g54K5KDAsIDAp5ZKMKDIsMSnvvIzkvKDlhaXnmoTlj4LmlbDmmK8oMCwgMCwgMiwgMSnvvIzov5Tlm57nmoTmmK8oKDItMCkrMT0zKeS4quWAvO+8jOi/meS6m+WAvOaYr+S7jigwLTEp5Lit6Ze05o+S5YC855qE77yM5Y2zKDAsIDAuNSwgMSlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBwcml2YXRlIEludGVycG9sYXRlKGExOiBudW1iZXIsIGIxOiBudW1iZXIsIGEyOiBudW1iZXIsIGIyOiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgLy8g6aKE5YiG6YWN5pWw57uE5aSn5bCP5Lul6YG/5YWN5Yqo5oCB5omp5a65XHJcbiAgICAgICAgLy8gY29uc3QgZHggPSBNYXRoLmFicyhNYXRoLmZsb29yKGEyIC0gYTEpKTtcclxuICAgICAgICBjb25zdCBkeCA9ICgoYTIgPiBhMSA/IGEyIC0gYTEgOiBhMSAtIGEyKSB8IDApO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEFycmF5KGR4ICsgMSk7XHJcbiAgICAgICAgY29uc3QgYSA9IChiMiAtIGIxKSAvIChhMiAtIGExKTtcclxuICAgICAgICBsZXQgZCA9IGIxO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkeDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlW2ldID0gZDtcclxuICAgICAgICAgICAgZCArPSBhO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbn0iLCJleHBvcnQgY2xhc3MgVmVjdG9yMiB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBWZWN0b3IzIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHo6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueiA9IHo7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsb25lKCk6IFZlY3RvcjMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZSwgTW9kZWwsIFRyYW5zZm9ybSB9IGZyb20gXCIuL01vZGVsXCI7XHJcbmltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCIuL1ZlY3RvcjNcIjtcclxuXHJcbi8vIOeUu+W4g+WwuuWvuFxyXG5jb25zdCBjYW52YXNXaWR0aCA9IDQwMDtcclxuY29uc3QgY2FudmFzSGVpZ2h0ID0gNjAwO1xyXG5cclxuLy8g5a+56LGh5YiX6KGoXHJcbmNvbnN0IGluc3RhbmNlczogSW5zdGFuY2VbXSA9IFtdO1xyXG5cclxuLy8g5b2TRE9N5YaF5a655Yqg6L295a6M5oiQ5ZCO5omn6KGMXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAvLyDojrflj5ZjYW52YXPlhYPntKDlkowyROa4suafk+S4iuS4i+aWh1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgLy8g6K6+572uY2FudmFz5bC65a+4XHJcbiAgICBjYW52YXMud2lkdGggPSBjYW52YXNXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgLy8g5Yib5bu65Zu+5YOP5pWw5o2u5a+56LGhXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguY3JlYXRlSW1hZ2VEYXRhKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xyXG4gICAgLy8g5Yib5bu6MzLkvY3ml6DnrKblj7fmlbTlnovmlbDnu4Top4blm77vvIznlKjkuo7nm7TmjqXmk43kvZzlg4/ntKDmlbDmja5cclxuICAgIGNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcclxuXHJcbiAgICAvLyDliJvlu7rmuLLmn5Plmajlrp7kvotcclxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKHVpbnQzMlZpZXcsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xyXG5cclxuICAgIEluaXQoKTtcclxuXHJcbiAgICAvLyDmuLLmn5Plh73mlbBcclxuICAgIGZ1bmN0aW9uIG1haW5Mb29wKCkge1xyXG4gICAgICAgIC8vIOWkhOeQhumAu+i+kVxyXG4gICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIC8vIOa4suafk1xyXG4gICAgICAgIFJlbmRlcihyZW5kZXJlcik7XHJcbiAgICAgICAgLy8g5bCG5Zu+5YOP5pWw5o2u57uY5Yi25YiwY2FudmFz5LiKXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgIC8vIOivt+axguS4i+S4gOW4p+WKqOeUu1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbiAgICB9XHJcbiAgICAvLyDlvIDlp4vliqjnlLvlvqrnjq9cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbn0pO1xyXG5cclxuLy8g6I635Y+W6byg5qCH5LqL5Lu2XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgLy8g6I635Y+W6byg5qCH55u45a+55LqOY2FudmFz55qE5Z2Q5qCHXHJcbiAgICBjb25zdCByZWN0ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgSW5wdXQubW91c2VYID0gbW91c2VYO1xyXG4gICAgSW5wdXQubW91c2VZID0gbW91c2VZO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgbW9kZWwubmFtZSA9IFwi56uL5pa55L2TXCI7XHJcbiAgICBtb2RlbC52ZXJ0aWNlcyA9IFtcclxuICAgICAgICBuZXcgVmVjdG9yMygtMC41LCAtMC41LCAtMC41KSwgLy8gT3JpZ2luYWwgKC0yLCAtMC41LCA1KSAtPiAoLTIrMS41LCAtMC41KzAsIDUtNS41KVxyXG4gICAgICAgIG5ldyBWZWN0b3IzKC0wLjUsIDAuNSwgLTAuNSksIC8vIE9yaWdpbmFsICgtMiwgIDAuNSwgNSkgLT4gKC0yKzEuNSwgMC41KzAsIDUtNS41KVxyXG4gICAgICAgIG5ldyBWZWN0b3IzKDAuNSwgMC41LCAtMC41KSwgLy8gT3JpZ2luYWwgKC0xLCAgMC41LCA1KSAtPiAoLTErMS41LCAwLjUrMCwgNS01LjUpXHJcbiAgICAgICAgbmV3IFZlY3RvcjMoMC41LCAtMC41LCAtMC41KSwgLy8gT3JpZ2luYWwgKC0xLCAtMC41LCA1KSAtPiAoLTErMS41LCAtMC41KzAsIDUtNS41KVxyXG4gICAgICAgIG5ldyBWZWN0b3IzKC0wLjUsIC0wLjUsIDAuNSksIC8vIE9yaWdpbmFsICgtMiwgLTAuNSwgNikgLT4gKC0yKzEuNSwgLTAuNSswLCA2LTUuNSlcclxuICAgICAgICBuZXcgVmVjdG9yMygtMC41LCAwLjUsIDAuNSksIC8vIE9yaWdpbmFsICgtMiwgIDAuNSwgNikgLT4gKC0yKzEuNSwgMC41KzAsIDYtNS41KVxyXG4gICAgICAgIG5ldyBWZWN0b3IzKDAuNSwgMC41LCAwLjUpLCAvLyBPcmlnaW5hbCAoLTEsICAwLjUsIDYpIC0+ICgtMSsxLjUsIDAuNSswLCA2LTUuNSlcclxuICAgICAgICBuZXcgVmVjdG9yMygwLjUsIC0wLjUsIDAuNSkgIC8vIE9yaWdpbmFsICgtMSwgLTAuNSwgNikgLT4gKC0xKzEuNSwgLTAuNSswLCA2LTUuNSlcclxuICAgIF07XHJcbiAgICBtb2RlbC52ZXJ0ZXhDb2xvcnMgPSBbXHJcbiAgICAgICAgQ29sb3IuUkVELFxyXG4gICAgICAgIENvbG9yLkdSRUVOLFxyXG4gICAgICAgIENvbG9yLkJMVUUsXHJcbiAgICAgICAgQ29sb3IuWUVMTE9XLFxyXG4gICAgICAgIENvbG9yLk1BR0VOVEEsXHJcbiAgICAgICAgQ29sb3IuQ1lBTixcclxuICAgICAgICBDb2xvci5XSElURSxcclxuICAgICAgICBDb2xvci5PUkFOR0UsXHJcbiAgICBdO1xyXG4gICAgbW9kZWwudHJpYW5nbGVzID0gW1xyXG4gICAgICAgIFswLCAxLCAyXSxcclxuICAgICAgICBbMCwgMiwgM10sXHJcbiAgICAgICAgWzQsIDUsIDZdLFxyXG4gICAgICAgIFs0LCA2LCA3XSxcclxuICAgICAgICBbMCwgNCwgN10sXHJcbiAgICAgICAgWzAsIDcsIDNdLFxyXG4gICAgICAgIFsxLCA1LCA2XSxcclxuICAgICAgICBbMSwgNiwgMl0sXHJcbiAgICAgICAgWzAsIDQsIDVdLFxyXG4gICAgICAgIFswLCA1LCAxXSxcclxuICAgICAgICBbMiwgNiwgN10sXHJcbiAgICAgICAgWzIsIDcsIDNdLFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBjdWJlSW5zdGFuY2UgPSBuZXcgSW5zdGFuY2UoKTtcclxuICAgIGN1YmVJbnN0YW5jZS5tb2RlbCA9IG1vZGVsO1xyXG4gICAgY3ViZUluc3RhbmNlLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgIGN1YmVJbnN0YW5jZS50cmFuc2Zvcm0ucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAzKTtcclxuICAgIGN1YmVJbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24gPSBuZXcgVmVjdG9yMygzNTAsIDUwLCAwKTtcclxuICAgIGN1YmVJbnN0YW5jZS50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yMygxLCAxLCAxKTtcclxuICAgIGN1YmVJbnN0YW5jZS5zaGFkZXIgPSB0cnVlO1xyXG4gICAgaW5zdGFuY2VzLnB1c2goY3ViZUluc3RhbmNlKTtcclxuXHJcbiAgICBjb25zdCBjdWJlSW5zdGFuY2UyID0gbmV3IEluc3RhbmNlKCk7XHJcbiAgICBjdWJlSW5zdGFuY2UyLm1vZGVsID0gbW9kZWw7XHJcbiAgICBjdWJlSW5zdGFuY2UyLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgIGN1YmVJbnN0YW5jZTIudHJhbnNmb3JtLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMSwgMSwgMyk7XHJcbiAgICBjdWJlSW5zdGFuY2UyLnRyYW5zZm9ybS5yb3RhdGlvbiA9IG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgY3ViZUluc3RhbmNlMi50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yMygwLjUsIDAuNSwgMC41KTtcclxuICAgIGN1YmVJbnN0YW5jZTIuc2hhZGVyID0gZmFsc2U7XHJcbiAgICBpbnN0YW5jZXMucHVzaChjdWJlSW5zdGFuY2UyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gVXBkYXRlKCkge1xyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICAvLyDorqnniankvZPlnKjmiYDmnInovbTkuIrml4vovaxcclxuICAgICAgICBpbnN0YW5jZS50cmFuc2Zvcm0ucm90YXRpb24ueCArPSAwLjAxO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zZm9ybS5yb3RhdGlvbi55ICs9IDAuMDI7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNmb3JtLnJvdGF0aW9uLnogKz0gMC4wMTU7XHJcblxyXG4gICAgICAgIC8vIOS9v+eUqHNpbuWHveaVsOWunueOsOe8qeaUvuWcqDAuOeWIsDEuMeS5i+mXtOW+queOr1xyXG4gICAgICAgIC8vIGNvbnN0IHNjYWxlT2Zmc2V0ID0gTWF0aC5zaW4oRGF0ZS5ub3coKSAqIDAuMDAyKSAqIDAuMSArIDE7XHJcbiAgICAgICAgLy8gaW5zdGFuY2UudHJhbnNmb3JtLnNjYWxlLnggPSBzY2FsZU9mZnNldDtcclxuICAgICAgICAvLyBpbnN0YW5jZS50cmFuc2Zvcm0uc2NhbGUueSA9IHNjYWxlT2Zmc2V0O1xyXG4gICAgICAgIC8vIGluc3RhbmNlLnRyYW5zZm9ybS5zY2FsZS56ID0gc2NhbGVPZmZzZXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJlbmRlcihyZW5kZXJlcjogUmVuZGVyZXIpIHtcclxuICAgIHJlbmRlcmVyLkNsZWFyKENvbG9yLkJMQUNLKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xyXG4gICAgICAgIHJlbmRlcmVyLkRyYXdPYmplY3QoaW5zdGFuY2UsICFpbnN0YW5jZS5zaGFkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeUu+S4ieinkuW9olxyXG4gICAgLy8gcmVuZGVyZXIuRHJhd1RyaWFuZ2xlRmlsbGVkV2l0aFZlcnRleENvbG9yKDAsIDAsIDEwMCwgMTAwLCBJbnB1dC5tb3VzZVgsIElucHV0Lm1vdXNlWSwgQ29sb3IuUkVELCBDb2xvci5HUkVFTiwgQ29sb3IuQkxVRSk7XHJcbn0iXX0=
