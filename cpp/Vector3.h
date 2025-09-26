#ifndef VECTOR3_H
#define VECTOR3_H

#include <xmmintrin.h>  // SSE 指令集（SIMD 支持）
#include <cmath>
#include <string>

// 前向声明
class Vector2;
class Vector4;

class Vector3 {
public:
    union {
        struct { float x, y, z; };  // 分量访问
        float data[3];              // 数组访问
        __m128 simd;                // SIMD 寄存器（前3个元素有效）
    };

    // 构造函数（与 TypeScript 对应）
    Vector3();
    Vector3(float x, float y, float z);
    Vector3(const Vector2& v);  // 从 Vector2 构造（z=0）
    Vector3(const Vector4& v);  // 从 Vector4 构造（取 x,y,z）

    // 成员方法：修改当前向量
    Vector3& add(const Vector3& v);
    Vector3& subtract(const Vector3& v);
    Vector3& multiply(const Vector3& v);
    Vector3& divide(float d);
    Vector3& multiplyScalar(float s);
    Vector3& negate();
    Vector3& normalize();

    // 成员方法：计算结果（不修改当前向量）
    float dot(const Vector3& v) const;
    Vector3 cross(const Vector3& v) const;
    float magnitude() const;
    float sqrMagnitude() const;

    // 分量访问
    float getComponent(int index) const;
    void setComponent(int index, float value);

    // 工具方法
    Vector3 clone() const;
    bool equals(const Vector3& v) const;
    std::string toString() const;

    // 静态方法：向量运算（返回新向量）
    static Vector3 add(const Vector3& v1, const Vector3& v2);
    static Vector3 subtract(const Vector3& v1, const Vector3& v2);
    static Vector3 multiply(const Vector3& v1, const Vector3& v2);
    static Vector3 divide(const Vector3& v1, const Vector3& v2);
    static Vector3 multiplyScalar(const Vector3& v1, float s);
    static Vector3 lerp(const Vector3& v1, const Vector3& v2, float t);
    static Vector3 reflect(const Vector3& v, const Vector3& n);
    static float dot(const Vector3& v1, const Vector3& v2);
    static Vector3 cross(const Vector3& v1, const Vector3& v2);
    static float distance(const Vector3& v1, const Vector3& v2);
    static Vector3 difference(const Vector3& v1, const Vector3& v2);
    static float angle(const Vector3& v1, const Vector3& v2);
    static Vector3 normalize(const Vector3& v);
    static Vector3 min(const Vector3& a, const Vector3& b);
    static Vector3 max(const Vector3& a, const Vector3& b);

    // 静态常量向量
    static const Vector3 ZERO;
    static const Vector3 ONE;
    static const Vector3 RIGHT;
    static const Vector3 LEFT;
    static const Vector3 UP;
    static const Vector3 DOWN;
    static const Vector3 FORWARD;
    static const Vector3 BACK;
};

// 前置声明的 Vector2/Vector4 简化定义（与原 TS 对应）
class Vector2 {
public:
    float x, y;
    Vector2(float x = 0, float y = 0) : x(x), y(y) {}
};

class Vector4 {
public:
    float x, y, z, w;
    Vector4(float x = 0, float y = 0, float z = 0, float w = 0) : x(x), y(y), z(z), w(w) {}
};

#endif // VECTOR3_H