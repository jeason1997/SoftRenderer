#include "color.h"

// 预制颜色的定义
const Color Color::White = Color(255, 255, 255);
const Color Color::Black = Color(0, 0, 0);
const Color Color::Red = Color(255, 0, 0);
const Color Color::Green = Color(0, 255, 0);
const Color Color::Blue = Color(0, 0, 255);
const Color Color::Cyan = Color(0, 255, 255);
const Color Color::Yellow = Color(255, 255, 0);
const Color Color::Magenta = Color(255, 0, 255);
const Color Color::Gray = Color(128, 128, 128);

Color Color::operator*(float t) const
{
    // 对每个通道进行乘法运算，并确保结果不超过255
    return {static_cast<uint8_t>(r * t),
            static_cast<uint8_t>(g * t),
            static_cast<uint8_t>(b * t),
            static_cast<uint8_t>(a * t)};
}

Color Color::operator+(const Color &c) const
{
    //TODO:这个算法明显不对，两个透明度255的颜色相加，透明度反而变成254了
    //  对每个通道进行相加，并确保结果不超过255
    return {static_cast<uint8_t>(r + c.r),
            static_cast<uint8_t>(g + c.g),
            static_cast<uint8_t>(b + c.b),
            static_cast<uint8_t>(a + c.a)};
}

Color Color::interpolateColor(const Color &c1, const Color &c2, float t)
{
    uint8_t r = static_cast<uint8_t>(c1.r + t * (c2.r - c1.r));
    uint8_t g = static_cast<uint8_t>(c1.g + t * (c2.g - c1.g));
    uint8_t b = static_cast<uint8_t>(c1.b + t * (c2.b - c1.b));
    uint8_t a = static_cast<uint8_t>(c1.a + t * (c2.a - c1.a));
    return Color(r, g, b, a);
}