import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Instance, Transform } from "../Model";
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

    /*
    public static loadModelFile(fileName: string): Promise<OBJDoc> {
        return new Promise<OBJDoc>((resolve) => {

            if (AssetLoader.fileCache.has(fileName)) {
                resolve(AssetLoader.fileCache.get(fileName));
            }
            else {
                var request = new XMLHttpRequest();
                request.onreadystatechange = async function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            var objDoc = new OBJDoc(fileName);
                            var result = await objDoc.parse(request.responseText, 1, false);

                            if (!result) {
                                console.error("OBJ file parsing error: " + fileName);
                                return;
                            }

                            AssetLoader.fileCache.set(fileName, objDoc);
                            resolve(objDoc);
                        }
                        else {
                            resolve(null);
                        }
                    }
                };

                //这里不要开启异步，设置为false，否则容易卡在readyState = 1，原因不明
                request.open("GET", fileName, false);
                request.send();
            }
        });
    }
    */
   
    public static async loadInstanceFromModel(name: string, modelPath: string, scale: number = 1, reverse: boolean = false): Promise<Instance> {
        var instance = new Instance();
        instance.name = name;
        instance.transform = new Transform(name);
        instance.transform.position = Vector3.ZERO;
        instance.transform.rotation = Quaternion.identity;
        instance.transform.scale = Vector3.ONE;

        var objDoc = await AssetLoader.loadTextFile(modelPath);
        if (objDoc != null) {
            const model = OBJParser.parseOBJ(objDoc);
            instance.model = model;

            // 输出统计信息
            console.log(OBJParser.getModelStats(model));

            // var objs = objDoc.getObjs(scale, reverse);
            // objs.forEach(async obj => {
            //     //todo:临死写死，只加载漫反射贴图
            //     // if (obj.material != null && obj.material.map_Kd != null) {
            //     //     render.material.createTexture(obj.material.map_Kd);
            //     // }
            //     var model = new Model();
            //     model.name = name;
            //     model.vertices = obj.vertices;
            //     model.indices = obj.indices;
            //     model.uvs = obj.uvs;
            //     model.normals = obj.normals;
            //     instance.model.push(model);
            // });
        }
        return instance;
    }
}