#ifndef COLOR_H
#define COLOR_H

#include <cstdint>

// 定义颜色结构
struct Color
{
    uint8_t r, g, b, a;

    Color(uint8_t red = 0, uint8_t green = 0, uint8_t blue = 0, uint8_t alpha = 255)
        : r(red), g(green), b(blue), a(alpha) {}

    Color operator*(float t) const;
    Color operator+(const Color &c) const;

    // 颜色线性插值
    static Color interpolateColor(const Color &c1, const Color &c2, float t);

    // 预制颜色
    static const Color White;
    static const Color Black;
    static const Color Red;
    static const Color Green;
    static const Color Blue;
    static const Color Cyan;
    static const Color Yellow;
    static const Color Magenta;
    static const Color Gray;
};

#endif // COLOR_H