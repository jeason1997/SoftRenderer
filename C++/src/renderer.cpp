#include "renderer.h"

Renderer::Renderer(int width, int height)
    : width(width), height(height)
{
    framebuffer.resize(width * height);
}

void Renderer::clear(const Color &color)
{
    // 清除整个帧缓冲区
    std::fill(framebuffer.begin(), framebuffer.end(), color);
}

void Renderer::clear(const Color &color, int x, int y, int rectWidth, int rectHeight)
{
    // 将矩形范围限制在帧缓冲区边界内
    int xStart = std::max(0, x);
    int yStart = std::max(0, y);
    int xEnd = std::min(width, x + rectWidth);
    int yEnd = std::min(height, y + rectHeight);

    // 清除指定范围内的帧缓冲区
    for (int j = yStart; j < yEnd; ++j)
    {
        for (int i = xStart; i < xEnd; ++i)
        {
            framebuffer[j * width + i] = color;
        }
    }
}

void Renderer::drawPoint(int x, int y, const Color &color)
{
    if (x >= 0 && x < width && y >= 0 && y < height)
    {
        framebuffer[y * width + x] = color;
    }
}

void Renderer::drawLine(int x1, int y1, const Color &c1, int x2, int y2, const Color &c2)
{
    int dx = abs(x2 - x1);     // 计算x轴方向的差值
    int dy = abs(y2 - y1);     // 计算y轴方向的差值
    int sx = x1 < x2 ? 1 : -1; // 根据x1和x2的大小决定x方向的步进值
    int sy = y1 < y2 ? 1 : -1; // 根据y1和y2的大小决定y方向的步进值
    int err = dx - dy;         // 初始化误差值

    int length = std::max(dx, dy); // 计算线段的长度
    int currentStep = 0;

    while (true)
    {
        float t = static_cast<float>(currentStep) / length;           // 计算插值因子
        Color interpolatedColor = Color::interpolateColor(c1, c2, t); // 插值颜色
        drawPoint(x1, y1, interpolatedColor);                         // 绘制当前点

        // 如果已经到达终点，退出循环
        if (x1 == x2 && y1 == y2)
            break;

        // 计算2倍的误差值
        int e2 = err * 2;
        // 如果误差值足够大，可以沿x方向移动
        if (e2 > -dy)
        {
            err -= dy;
            x1 += sx;
        }
        // 如果误差值足够小，可以沿y方向移动
        if (e2 < dx)
        {
            err += dx;
            y1 += sy;
        }
        currentStep++;
    }
}

void Renderer::drawTriangle(Vector3 p1, Vector3 p2, Vector3 p3, Color c1, Color c2, Color c3)
{
    // 排序顶点：按y坐标对顶点排序，以便我们从最低的y值开始处理三角形。这将确保我们可以从下到上逐行填充三角形。假设排序后顶点为(x1,y1)、(x2,y2)、(x3,y3)，其中y1<=y2<=y3。
    if (p2.y < p1.y)
    {
        std::swap(p1, p2);
        std::swap(c1, c2);
    }
    if (p3.y < p1.y)
    {
        std::swap(p1, p3);
        std::swap(c1, c3);
    }
    if (p3.y < p2.y)
    {
        std::swap(p2, p3);
        std::swap(c2, c3);
    }

    // 从 p1 到 p3 逐行扫描，填充三角形
    for (int y = std::ceil(p1.y); y <= std::ceil(p3.y); ++y)
    {
        // 处理 p1 到 p2 和 p1 到 p3 之间的扫描线
        if (y < p2.y)
        {
            // 计算 p1 到 p2 和 p1 到 p3 之间的插值 x 坐标
            float x1 = interpolateXAtY(p1, p2, y);
            float x2 = interpolateXAtY(p1, p3, y);
            // 计算颜色插值
            Color color1 = interpolateColorAtY(p1, c1, p2, c2, y);
            Color color2 = interpolateColorAtY(p1, c1, p3, c3, y);
            // 确保 x1 在 x2 的左边
            if (x1 > x2)
            {
                std::swap(x1, x2);
                std::swap(color1, color2);
            }
            // 绘制扫描线
            drawLine(std::round(x1), y, color1, std::round(x2), y, color2);
        }
        // 处理 p2 到 p3 和 p1 到 p3 之间的扫描线
        else
        {
            float x1 = interpolateXAtY(p2, p3, y);
            float x2 = interpolateXAtY(p1, p3, y);
            Color color1 = interpolateColorAtY(p2, c2, p3, c3, y);
            Color color2 = interpolateColorAtY(p1, c1, p3, c3, y);
            if (x1 > x2)
            {
                std::swap(x1, x2);
                std::swap(color1, color2);
            }
            drawLine(std::round(x1), y, color1, std::round(x2), y, color2);
        }
    }
}

float Renderer::interpolateXAtY(const Vector3 &p1, const Vector3 &p2, float y)
{
    if (p1.y == p2.y)
        return p1.x;
    return p1.x + (p2.x - p1.x) * (y - p1.y) / (p2.y - p1.y);
}

Color Renderer::interpolateColorAtY(const Vector3 &p1, const Color &c1, const Vector3 &p2, const Color &c2, float y)
{
    if (p1.y == p2.y)
        return c1;
    float t = (y - p1.y) / (p2.y - p1.y);
    return c1 * (1 - t) + c2 * t;
}

const std::vector<Color> &Renderer::getFramebuffer() const
{
    return framebuffer;
}