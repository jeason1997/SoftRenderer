import { Mesh } from "./Mesh";
import { OBJParser } from "../Utils/ObjParser";
import { Texture } from "./Texture";

export class Resources {
    private static fileCache: Map<string, any> = new Map();
    private static loadingPromises: Map<string, Promise<any>> = new Map();

    /**
     * 异步加载资源，模仿Unity的Resources.LoadAsync
     * @param fileName 资源路径
     * @returns 包含资源的Promise
     */
    public static async loadAsync<T>(fileName: string): Promise<T | null> {
        // 检查缓存
        if (Resources.fileCache.has(fileName)) {
            return Promise.resolve(Resources.fileCache.get(fileName) as T);
        }

        // 检查是否正在加载，避免重复请求
        if (Resources.loadingPromises.has(fileName)) {
            return Resources.loadingPromises.get(fileName) as Promise<T>;
        }

        // 确定资源类型并加载
        let promise: Promise<T | null>;

        if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            // 加载纹理
            promise = Resources.loadTextureAsync(fileName) as Promise<T | null>;
        } else if (fileName.endsWith('.obj')) {
            // 加载模型
            promise = Resources.loadModelAsync(fileName) as Promise<T | null>;
        } else if (fileName.endsWith('.txt') || fileName.endsWith('.json') || fileName.endsWith('.xml')) {
            // 加载文本
            promise = Resources.loadTextAsync(fileName) as Promise<T | null>;
        } else {
            console.error(`不支持的资源类型: ${fileName}`);
            return Promise.resolve(null);
        }

        // 存储加载中的Promise
        Resources.loadingPromises.set(fileName, promise);

        // 等待加载完成并更新缓存
        const result = await promise;
        if (result) {
            Resources.fileCache.set(fileName, result);
        }

        // 移除加载中标记
        Resources.loadingPromises.delete(fileName);

        return result;
    }

    // /**
    //  * 同步加载资源（仅支持已缓存的资源）
    //  * @param fileName 资源路径
    //  * @returns 资源实例或null
    //  */
    // public static load<T>(fileName: string): T | null {
    //     if (Resources.fileCache.has(fileName)) {
    //         return Resources.fileCache.get(fileName) as T;
    //     }

    //     console.warn(`资源 ${fileName} 未缓存，无法同步加载。请先使用loadAsync加载。`);
    //     return null;
    // }

    /**
     * 卸载未使用的资源，模仿Unity的UnloadUnusedAssets
     */
    public static unloadUnusedAssets(): void {
        // 实际项目中应该有引用计数机制
        // 这里简化处理，仅清除所有缓存
        Resources.fileCache.clear();
        console.log("已卸载所有未使用的资源");
    }

    /**
     * 卸载特定资源
     * @param fileName 资源路径
     */
    public static unloadAsset(fileName: string): void {
        if (Resources.fileCache.has(fileName)) {
            Resources.fileCache.delete(fileName);
            console.log(`已卸载资源: ${fileName}`);
        }

        if (Resources.loadingPromises.has(fileName)) {
            Resources.loadingPromises.delete(fileName);
        }
    }

    /**
     * 加载纹理资源
     */
    private static async loadTextureAsync(fileName: string): Promise<Texture | null> {
        try {
            const img = await Resources.loadImageFile(fileName);

            // 1. 获取图片原始尺寸
            const imgWidth = img.width;
            const imgHeight = img.height;

            // 2. 创建【临时Canvas】（内存中，不显示到页面）
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) {
                console.error('无法创建临时Canvas上下文');
                return null;
            }

            // 3. 让临时Canvas尺寸与图片原始尺寸完全一致（关键：确保像素无失真）
            tempCanvas.width = imgWidth;
            tempCanvas.height = imgHeight;

            // 4. 仅在临时Canvas上绘制图片，web的图必须先加载到canvas才能读取它的数据
            tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight); // 0,0是绘制起点，后两个参数是绘制尺寸（与图片一致）

            // 5. 提取图片的ImageData（此时已获取完整像素数据，无需依赖业务Canvas）
            const imageData = tempCtx.getImageData(0, 0, imgWidth, imgHeight);
            const pixelData = imageData.data; // 核心：Uint8ClampedArray类型的像素数组，每个像素占4位（RGBA）

            const texture = new Texture();
            texture.width = imgWidth;
            texture.height = imgHeight;
            texture.data = pixelData;
            return texture;
        } catch (error) {
            console.error(`加载纹理失败: ${fileName}`, error);
            return null;
        }
    }

    /**
     * 加载图片文件（内部使用）
     */
    private static loadImageFile(fileName: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            if (Resources.fileCache.has(fileName)) {
                resolve(Resources.fileCache.get(fileName));
                return;
            }

            const image = new Image();
            if (!image) {
                reject(new Error('无法创建图片对象'));
                return;
            }

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                reject(new Error(`无法加载图片: ${fileName}`));
            };

            // 跨域设置
            image.crossOrigin = "anonymous";
            image.src = fileName;
        });
    }

    /**
     * 加载文本文件
     */
    private static loadTextAsync(fileName: string): Promise<string | null> {
        return new Promise<string | null>((resolve) => {
            if (Resources.fileCache.has(fileName)) {
                resolve(Resources.fileCache.get(fileName));
                return;
            }

            const request = new XMLHttpRequest();

            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        const text = request.responseText;
                        resolve(text);
                    } else {
                        console.error(`加载文本失败: ${fileName}, 状态码: ${request.status}`);
                        resolve(null);
                    }
                }
            };

            // 使用异步加载以避免阻塞
            request.open("GET", fileName, true);
            request.send();
        });
    }

    /**
     * 加载模型文件
     */
    private static async loadModelAsync(modelPath: string, scale: number = 1): Promise<Mesh | null> {
        try {
            const objDoc = await Resources.loadTextAsync(modelPath);
            if (!objDoc) {
                return null;
            }

            const mesh = OBJParser.parse(objDoc, scale);
            return mesh;
        } catch (error) {
            console.error(`加载模型失败: ${modelPath}`, error);
            return null;
        }
    }
}
