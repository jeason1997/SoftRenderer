#ifndef VECTOR3_H
#define VECTOR3_H

// 定义三维向量结构
struct Vector3
{
    int x, y, z;

    Vector3(int x = 0, int y = 0, int z = 0)
        : x(x), y(y), z(z) {}
};

#endif // VECTOR3_H