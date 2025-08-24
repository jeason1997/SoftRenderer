(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Renderer = void 0;
var Renderer = /** @class */ (function () {
    function Renderer(uint32View, canvasWidth, canvasHeight) {
        this.uint32View = uint32View;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    Renderer.prototype.Render = function () {
        for (var x = 0; x < this.canvasWidth; x++) {
            // 每列一种随机颜色
            var color = Math.random() * 0xFFFFFFFF;
            for (var y = 0; y < this.canvasHeight; y++) {
                this.SetPixel(x, y, color);
            }
        }
    };
    Renderer.prototype.SetPixel = function (x, y, color) {
        this.uint32View[y * this.canvasWidth + x] = color;
    };
    return Renderer;
}());
exports.Renderer = Renderer;
},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Renderer_1 = require("./Renderer");
// 画布尺寸
var canvasWidth = 400;
var canvasHeight = 400;
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
    // 渲染函数
    function render() {
        // 渲染
        renderer.Render();
        // 将图像数据绘制到canvas上
        ctx.putImageData(imageData, 0, 0);
        // 请求下一帧动画
        requestAnimationFrame(render);
    }
    // 开始动画循环
    requestAnimationFrame(render);
});
},{"./Renderer":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvUmVuZGVyZXIudHMiLCJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTtJQUtJLGtCQUFZLFVBQXVCLEVBQUUsV0FBbUIsRUFBRSxZQUFvQjtRQUMxRSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNyQyxDQUFDO0lBRU0seUJBQU0sR0FBYjtRQUNJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLFdBQVc7WUFDWCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDO1lBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDOUI7U0FDSjtJQUNMLENBQUM7SUFFTSwyQkFBUSxHQUFmLFVBQWdCLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYTtRQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUN0RCxDQUFDO0lBQ0wsZUFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUF4QlksNEJBQVE7Ozs7QUNBckIsdUNBQXNDO0FBRXRDLE9BQU87QUFDUCxJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDeEIsSUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBRXpCLGdCQUFnQjtBQUNoQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7SUFDMUMscUJBQXFCO0lBQ3JCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFzQixDQUFDO0lBQ3RFLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUE2QixDQUFDO0lBQ2hFLGFBQWE7SUFDYixNQUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztJQUMzQixNQUFNLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztJQUU3QixXQUFXO0lBQ1gsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDakUsNEJBQTRCO0lBQzVCLElBQU0sVUFBVSxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFMUQsVUFBVTtJQUNWLElBQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRXJFLE9BQU87SUFDUCxTQUFTLE1BQU07UUFDWCxLQUFLO1FBQ0wsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLGtCQUFrQjtRQUNsQixHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsVUFBVTtRQUNWLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxTQUFTO0lBQ1QscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgUmVuZGVyZXIge1xyXG4gICAgcHJpdmF0ZSBjYW52YXNXaWR0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBjYW52YXNIZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgdWludDMyVmlldzogVWludDMyQXJyYXk7XHJcblxyXG4gICAgY29uc3RydWN0b3IodWludDMyVmlldzogVWludDMyQXJyYXksIGNhbnZhc1dpZHRoOiBudW1iZXIsIGNhbnZhc0hlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51aW50MzJWaWV3ID0gdWludDMyVmlldztcclxuICAgICAgICB0aGlzLmNhbnZhc1dpZHRoID0gY2FudmFzV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXNIZWlnaHQgPSBjYW52YXNIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJlbmRlcigpIHtcclxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2FudmFzV2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAvLyDmr4/liJfkuIDnp43pmo/mnLrpopzoibJcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBNYXRoLnJhbmRvbSgpICogMHhGRkZGRkZGRjtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmNhbnZhc0hlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNldFBpeGVsKHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0UGl4ZWwoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVpbnQzMlZpZXdbeSAqIHRoaXMuY2FudmFzV2lkdGggKyB4XSA9IGNvbG9yO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5cclxuLy8g55S75biD5bC65a+4XHJcbmNvbnN0IGNhbnZhc1dpZHRoID0gNDAwO1xyXG5jb25zdCBjYW52YXNIZWlnaHQgPSA0MDA7XHJcblxyXG4vLyDlvZNET03lhoXlrrnliqDovb3lrozmiJDlkI7miafooYxcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIC8vIOiOt+WPlmNhbnZhc+WFg+e0oOWSjDJE5riy5p+T5LiK5LiL5paHXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAvLyDorr7nva5jYW52YXPlsLrlr7hcclxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodDtcclxuXHJcbiAgICAvLyDliJvlu7rlm77lg4/mlbDmja7lr7nosaFcclxuICAgIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5jcmVhdGVJbWFnZURhdGEoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XHJcbiAgICAvLyDliJvlu7ozMuS9jeaXoOespuWPt+aVtOWei+aVsOe7hOinhuWbvu+8jOeUqOS6juebtOaOpeaTjeS9nOWDj+e0oOaVsOaNrlxyXG4gICAgY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShpbWFnZURhdGEuZGF0YS5idWZmZXIpO1xyXG5cclxuICAgIC8vIOWIm+W7uua4suafk+WZqOWunuS+i1xyXG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodWludDMyVmlldywgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XHJcblxyXG4gICAgLy8g5riy5p+T5Ye95pWwXHJcbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8g5riy5p+TXHJcbiAgICAgICAgcmVuZGVyZXIuUmVuZGVyKCk7XHJcbiAgICAgICAgLy8g5bCG5Zu+5YOP5pWw5o2u57uY5Yi25YiwY2FudmFz5LiKXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgIC8vIOivt+axguS4i+S4gOW4p+WKqOeUu1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICAgfVxyXG4gICAgLy8g5byA5aeL5Yqo55S75b6q546vXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxufSk7XHJcbiJdfQ==
