#include "Vector3.h"
#include <sstream>

// 构造函数实现
Vector3::Vector3() : x(0), y(0), z(0) {
    simd = _mm_set_ps(0, z, y, x);  // SIMD 初始化（x,y,z,0）
}

Vector3::Vector3(float x, float y, float z) : x(x), y(y), z(z) {
    simd = _mm_set_ps(0, z, y, x);  // 低3位存储 x,y,z（_mm_set_ps 顺序为 w,z,y,x）
}

Vector3::Vector3(const Vector2& v) : x(v.x), y(v.y), z(0) {
    simd = _mm_set_ps(0, z, y, x);
}

Vector3::Vector3(const Vector4& v) : x(v.x), y(v.y), z(v.z) {
    simd = _mm_set_ps(0, z, y, x);
}

// 成员方法：修改当前向量
Vector3& Vector3::add(const Vector3& v) {
    simd = _mm_add_ps(simd, v.simd);  // SIMD 并行加法
    x = _mm_cvtss_f32(simd);          // 从 SIMD 寄存器更新 x（最低位）
    y = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(1,1,1,1)));  // 提取 y
    z = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(2,2,2,2)));  // 提取 z
    return *this;
}

Vector3& Vector3::subtract(const Vector3& v) {
    simd = _mm_sub_ps(simd, v.simd);  // SIMD 并行减法
    x = _mm_cvtss_f32(simd);
    y = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(1,1,1,1)));
    z = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(2,2,2,2)));
    return *this;
}

Vector3& Vector3::multiply(const Vector3& v) {
    simd = _mm_mul_ps(simd, v.simd);  // SIMD 并行乘法
    x = _mm_cvtss_f32(simd);
    y = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(1,1,1,1)));
    z = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(2,2,2,2)));
    return *this;
}

Vector3& Vector3::divide(float d) {
    __m128 scalar = _mm_set1_ps(d);   // 将标量扩展为 SIMD 向量（d,d,d,d）
    simd = _mm_div_ps(simd, scalar);  // 并行除法
    x = _mm_cvtss_f32(simd);
    y = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(1,1,1,1)));
    z = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(2,2,2,2)));
    return *this;
}

Vector3& Vector3::multiplyScalar(float s) {
    __m128 scalar = _mm_set1_ps(s);   // 标量扩展为 SIMD 向量
    simd = _mm_mul_ps(simd, scalar);  // 并行乘法
    x = _mm_cvtss_f32(simd);
    y = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(1,1,1,1)));
    z = _mm_cvtss_f32(_mm_shuffle_ps(simd, simd, _MM_SHUFFLE(2,2,2,2)));
    return *this;
}

Vector3& Vector3::negate() {
    return multiplyScalar(-1.0f);
}

Vector3& Vector3::normalize() {
    float len = magnitude();
    if (len == 0) {
        x = y = z = 0;
        simd = _mm_set_ps(0, 0, 0, 0);
        return *this;
    }
    return divide(len);
}

// 成员方法：计算结果
float Vector3::dot(const Vector3& v) const {
    return Vector3::dot(*this, v);
}

Vector3 Vector3::cross(const Vector3& v) const {
    return Vector3::cross(*this, v);
}

float Vector3::magnitude() const {
    return std::sqrt(sqrMagnitude());
}

float Vector3::sqrMagnitude() const {
    return Vector3::dot(*this, *this);
}

// 分量访问
float Vector3::getComponent(int index) const {
    switch (index) {
        case 0: return x;
        case 1: return y;
        case 2: return z;
        default: throw std::invalid_argument("Invalid component index (must be 0,1,2)");
    }
}

void Vector3::setComponent(int index, float value) {
    switch (index) {
        case 0: x = value; break;
        case 1: y = value; break;
        case 2: z = value; break;
        default: throw std::invalid_argument("Invalid component index (must be 0,1,2)");
    }
    simd = _mm_set_ps(0, z, y, x);  // 更新 SIMD 寄存器
}

// 工具方法
Vector3 Vector3::clone() const {
    return Vector3(x, y, z);
}

bool Vector3::equals(const Vector3& v) const {
    return x == v.x && y == v.y && z == v.z;
}

std::string Vector3::toString() const {
    std::stringstream ss;
    ss << "[" << x << ", " << y << ", " << z << "]";
    return ss.str();
}

// 静态方法：向量运算
Vector3 Vector3::add(const Vector3& v1, const Vector3& v2) {
    __m128 res = _mm_add_ps(v1.simd, v2.simd);
    return Vector3(
        _mm_cvtss_f32(res),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(1,1,1,1))),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(2,2,2,2)))
    );
}

Vector3 Vector3::subtract(const Vector3& v1, const Vector3& v2) {
    __m128 res = _mm_sub_ps(v1.simd, v2.simd);
    return Vector3(
        _mm_cvtss_f32(res),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(1,1,1,1))),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(2,2,2,2)))
    );
}

Vector3 Vector3::multiply(const Vector3& v1, const Vector3& v2) {
    __m128 res = _mm_mul_ps(v1.simd, v2.simd);
    return Vector3(
        _mm_cvtss_f32(res),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(1,1,1,1))),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(2,2,2,2)))
    );
}

Vector3 Vector3::divide(const Vector3& v1, const Vector3& v2) {
    __m128 res = _mm_div_ps(v1.simd, v2.simd);
    return Vector3(
        _mm_cvtss_f32(res),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(1,1,1,1))),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(2,2,2,2)))
    );
}

Vector3 Vector3::multiplyScalar(const Vector3& v1, float s) {
    __m128 scalar = _mm_set1_ps(s);
    __m128 res = _mm_mul_ps(v1.simd, scalar);
    return Vector3(
        _mm_cvtss_f32(res),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(1,1,1,1))),
        _mm_cvtss_f32(_mm_shuffle_ps(res, res, _MM_SHUFFLE(2,2,2,2)))
    );
}

Vector3 Vector3::lerp(const Vector3& v1, const Vector3& v2, float t) {
    return Vector3(
        v1.x + t * (v2.x - v1.x),
        v1.y + t * (v2.y - v1.y),
        v1.z + t * (v2.z - v1.z)
    );
}

Vector3 Vector3::reflect(const Vector3& v, const Vector3& n) {
    return subtract(v, multiplyScalar(n, 2 * dot(v, n)));
}

float Vector3::dot(const Vector3& v1, const Vector3& v2) {
    __m128 mul = _mm_mul_ps(v1.simd, v2.simd);  // (x1x2, y1y2, z1z2, 0)
    // 提取 x1x2 + y1y2 + z1z2（通过水平加法）
    __m128 shuf = _mm_shuffle_ps(mul, mul, _MM_SHUFFLE(2, 3, 0, 1));
    __m128 sum = _mm_add_ss(mul, shuf);
    shuf = _mm_shuffle_ps(sum, sum, _MM_SHUFFLE(1, 0, 3, 2));
    sum = _mm_add_ss(sum, shuf);
    return _mm_cvtss_f32(sum);
}

Vector3 Vector3::cross(const Vector3& v1, const Vector3& v2) {
    // 叉积公式：(y1z2 - z1y2, z1x2 - x1z2, x1y2 - y1x2)
    return Vector3(
        v1.y * v2.z - v1.z * v2.y,
        v1.z * v2.x - v1.x * v2.z,
        v1.x * v2.y - v1.y * v2.x
    );
}

float Vector3::distance(const Vector3& v1, const Vector3& v2) {
    return subtract(v1, v2).magnitude();
}

Vector3 Vector3::difference(const Vector3& v1, const Vector3& v2) {
    return subtract(v1, v2);
}

float Vector3::angle(const Vector3& v1, const Vector3& v2) {
    float dotProd = dot(v1, v2);
    float magProduct = v1.magnitude() * v2.magnitude();
    return std::acos(dotProd / magProduct);
}

Vector3 Vector3::normalize(const Vector3& v) {
    float len = v.magnitude();
    if (len == 0) return Vector3();
    return multiplyScalar(v, 1.0f / len);
}

Vector3 Vector3::min(const Vector3& a, const Vector3& b) {
    return Vector3(
        std::min(a.x, b.x),
        std::min(a.y, b.y),
        std::min(a.z, b.z)
    );
}

Vector3 Vector3::max(const Vector3& a, const Vector3& b) {
    return Vector3(
        std::max(a.x, b.x),
        std::max(a.y, b.y),
        std::max(a.z, b.z)
    );
}

// 静态常量定义
const Vector3 Vector3::ZERO = Vector3(0, 0, 0);
const Vector3 Vector3::ONE = Vector3(1, 1, 1);
const Vector3 Vector3::RIGHT = Vector3(1, 0, 0);
const Vector3 Vector3::LEFT = Vector3(-1, 0, 0);
const Vector3 Vector3::UP = Vector3(0, 1, 0);
const Vector3 Vector3::DOWN = Vector3(0, -1, 0);
const Vector3 Vector3::FORWARD = Vector3(0, 0, 1);
const Vector3 Vector3::BACK = Vector3(0, 0, -1);