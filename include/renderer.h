#ifndef RENDERER_H
#define RENDERER_H

#include <vector>
#include <cmath>
#include "vector3.h"
#include "color.h"

// 渲染器类声明
class Renderer
{
public:
    Renderer(int width, int height);

    int getWidth() const { return width; }
    int getHeight() const { return height; }

    // 清屏
    void clear(const Color &color);
    // 清除指定区域屏幕
    void clear(const Color &color, int x, int y, int rectWidth, int rectHeight);
    // 绘制点
    void drawPoint(int x, int y, const Color &color);
    // 绘制线（使用Bresenham算法）:Bresenham算法是一种用于绘制直线的高效算法，具有不涉及浮点运算和除法运算的优点。它主要基于逐步累加误差来决定下一个像素点的位置，从而画出近似的直线。
    void drawLine(int x1, int y1, const Color &c1, int x2, int y2, const Color &c2);
    // 绘制三角形：为了实现基于顶点颜色插值的三角形填充，我们可以使用扫描线算法。在每条扫描线上，我们根据左右边界插值颜色，然后在扫描线内部进行颜色插值。
    void drawTriangle(Vector3 p1, Vector3 p2, Vector3 p3, Color c1, Color c2, Color c3);
    // 获取只读的 framebuffer
    const std::vector<Color> &getFramebuffer() const;

private:
    int width, height;
    std::vector<Color> framebuffer;

    // 在给定y值下，根据线性插值计算x坐标
    float interpolateXAtY(const Vector3 &p1, const Vector3 &p2, float y);
    // 在给定y值下，根据线性插值计算颜色
    Color interpolateColorAtY(const Vector3 &p1, const Color &c1, const Vector3 &p2, const Color &c2, float y);
};

#endif // RENDERER_H