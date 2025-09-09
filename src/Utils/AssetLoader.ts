import { Mesh } from "../Renderer/Mesh";
import { Dictionary } from "./Dictionary";
import { OBJParser } from "./ObjParser";

export class AssetLoader {
    private static fileCache: Dictionary = new Dictionary();

    public static loadImageFile(fileName: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve) => {

            if (AssetLoader.fileCache.has(fileName)) {
                resolve(AssetLoader.fileCache.get(fileName));
            } else {
                var image = new Image();
                if (!image) {
                    console.error('Failed to create the image object');
                    return;
                }

                // Register the event handler to be called on loading an image
                image.onload = function () {
                    AssetLoader.fileCache.set(fileName, image);
                    resolve(image);
                };

                // 跨区请求
                image.crossOrigin = "";

                // Tell the browser to load an image
                image.src = fileName;
            }
        });
    }

    public static loadTextFile(fileName: string): Promise<string> {
        return new Promise<string>(function (resolve) {

            if (AssetLoader.fileCache.has(fileName)) {
                resolve(AssetLoader.fileCache.get(fileName));
            }
            else {
                var request = new XMLHttpRequest();

                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            AssetLoader.fileCache.set(fileName, request.responseText);
                            resolve(request.responseText);
                        }
                        else {
                            resolve("");
                        }
                    }
                };

                //这里不要开启异步，设置为false，否则容易卡在readyState = 1，原因不明
                request.open("GET", fileName, false);
                request.send();
            }
        });
    }

    public static async loadModel(modelPath: string, scale: number = 1): Promise<Mesh | null> {
        let model: Mesh | null = null;
        var objDoc = await AssetLoader.loadTextFile(modelPath);
        if (objDoc != null) {
            model = OBJParser.parse(objDoc, scale);
        }
        return model;
    }
}