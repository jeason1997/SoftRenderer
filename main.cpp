#define UNICODE
#define _UNICODE
#define SCREEN_WIDTH 800
#define SCREEN_HEIGHT 600
#define STB_IMAGE_WRITE_IMPLEMENTATION

#include <windows.h>
#include <d3d9.h>
#include <vector>
#include <sstream>
#include "renderer.h"
#include "renderer.h"
#include "stb_image_write.h"

LPDIRECT3D9 d3d = nullptr;
LPDIRECT3DDEVICE9 d3ddev = nullptr;

// 定义窗口过程函数
LRESULT CALLBACK WindowProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hWnd, message, wParam, lParam);
}

// 初始化 DirectX
void initD3D(HWND hWnd)
{
    d3d = Direct3DCreate9(D3D_SDK_VERSION);
    D3DPRESENT_PARAMETERS d3dpp = {};
    d3dpp.Windowed = TRUE;
    d3dpp.SwapEffect = D3DSWAPEFFECT_DISCARD;
    d3dpp.hDeviceWindow = hWnd;
    d3d->CreateDevice(D3DADAPTER_DEFAULT, D3DDEVTYPE_HAL, hWnd, D3DCREATE_SOFTWARE_VERTEXPROCESSING, &d3dpp, &d3ddev);
}

// 初始化窗口
HWND initWindow(HINSTANCE hInstance, int nCmdShow)
{
    WNDCLASSEX wc = {};
    wc.cbSize = sizeof(WNDCLASSEX);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = L"WindowClass"; // 改为宽字符类型
    RegisterClassEx(&wc);

    // 标题栏也会占用尺寸，所以这里要校正下真实的窗口大小，避免实际画布偏小
    RECT rect = {0, 0, SCREEN_WIDTH, SCREEN_HEIGHT};
    AdjustWindowRect(&rect, WS_OVERLAPPEDWINDOW, FALSE);
    int windowWidth = rect.right - rect.left;
    int windowHeight = rect.bottom - rect.top;

    HWND hWnd = CreateWindowExW(
        0,
        L"WindowClass",
        L"DirectX 9 Window",
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, windowWidth, windowHeight,
        nullptr,
        nullptr,
        hInstance,
        nullptr);
    ShowWindow(hWnd, nCmdShow);

    return hWnd;
}

// 渲染帧
void renderFrame(const std::vector<Color> &framebuffer, int posX, int posY, int width, int height)
{
    // 创建纹理
    IDirect3DTexture9 *texture = nullptr;
    d3ddev->CreateTexture(width, height, 1, D3DUSAGE_DYNAMIC, D3DFMT_X8R8G8B8, D3DPOOL_DEFAULT, &texture, NULL);

    // 锁定纹理进行写入
    D3DLOCKED_RECT lockedRect;
    texture->LockRect(0, &lockedRect, NULL, 0);
    BYTE *pBits = (BYTE *)lockedRect.pBits;

    // 将 framebuffer 数据拷贝到纹理
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            int index = y * width + x;
            int offset = y * lockedRect.Pitch + x * 4;
            pBits[offset + 0] = framebuffer[index].b;
            pBits[offset + 1] = framebuffer[index].g;
            pBits[offset + 2] = framebuffer[index].r;
            pBits[offset + 3] = framebuffer[index].a;
        }
    }

    // 解锁纹理
    texture->UnlockRect(0);

    // 设置纹理
    d3ddev->SetTexture(0, texture);
    d3ddev->SetFVF(D3DFVF_XYZRHW | D3DFVF_TEX1);

    // 定义顶点结构体
    struct Vertex
    {
        float x, y, z, rhw;
        float u, v;
    };

    // 定义顶点数据，注意这里的顶点位置是屏幕坐标，纹理坐标是纹理的对应位置
    Vertex vertices[] = {
        {(float)posX, (float)posY, 0.0f, 1.0f, 0.0f, 0.0f},
        {(float)(posX + width), (float)posY, 0.0f, 1.0f, 1.0f, 0.0f},
        {(float)posX, (float)(posY + height), 0.0f, 1.0f, 0.0f, 1.0f},
        {(float)(posX + width), (float)(posY + height), 0.0f, 1.0f, 1.0f, 1.0f}};

    // 绘制纹理到屏幕
    d3ddev->DrawPrimitiveUP(D3DPT_TRIANGLESTRIP, 2, vertices, sizeof(Vertex));

    // 释放纹理
    if (texture)
        texture->Release();
}

// 释放 DirectX 资源
void cleanD3D()
{
    if (d3ddev)
        d3ddev->Release();
    if (d3d)
        d3d->Release();
}

// 保存帧缓冲区到图片文件
void saveToFile(const std::vector<Color> &framebuffer, const int width, const int height, const std::string &filename)
{
    std::vector<uint8_t> image;
     // 每个像素4个字节（RGBA）
    image.reserve(width * height * 4);

    for (const auto &color : framebuffer)
    {
        image.push_back(color.r);
        image.push_back(color.g);
        image.push_back(color.b);
        image.push_back(color.a);
    }

    stbi_write_png(filename.c_str(), width, height, 4, image.data(), width * 4);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    HWND hWnd = initWindow(hInstance, nCmdShow);
    initD3D(hWnd);

    MSG msg = {};
    Renderer renderer1(400, 200);
    Renderer renderer2(100, 100);
    while (msg.message != WM_QUIT)
    {
        if (PeekMessage(&msg, nullptr, 0, 0, PM_REMOVE))
        {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
        else
        {
            d3ddev->BeginScene();
            d3ddev->Clear(0, NULL, D3DCLEAR_TARGET, D3DCOLOR_XRGB(0, 0, 0), 1.0f, 0);

            // 清屏为黑色
            renderer1.clear(Color(0, 0, 0, 0));
            renderer1.drawTriangle(Vector3(0, 0), Vector3(400, 0), Vector3(200, 200), Color::Red, Color::Green, Color::Blue);
            renderFrame(renderer1.getFramebuffer(), 100, 100, renderer1.getWidth(), renderer1.getHeight());

            renderer2.clear(Color(255, 255, 0, 128));
            renderer2.drawTriangle(Vector3(0, 0), Vector3(100, 0), Vector3(50, 100), Color::Red, Color::Green, Color::Blue);
            renderFrame(renderer2.getFramebuffer(), 100, 350, renderer2.getWidth(), renderer2.getHeight());

            d3ddev->EndScene();
            d3ddev->Present(NULL, NULL, NULL, NULL);
        }
    }

    saveToFile(renderer1.getFramebuffer(), renderer1.getWidth(), renderer1.getHeight(), "renderer1.png");
    saveToFile(renderer2.getFramebuffer(), renderer2.getWidth(), renderer2.getHeight(), "renderer2.png");

    cleanD3D();
    return 0;
}