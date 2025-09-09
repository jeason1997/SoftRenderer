import { Camera } from "../Component/Camera";
import { CameraController } from "../Component/CameraController";
import { MeshRenderer } from "../Component/MeshRenderer";
import { ObjRotate } from "../Component/ObjRotate";
import { GameObject } from "../Core/GameObject";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { AssetLoader } from "../Utils/AssetLoader";
import { Scene } from "./Scene";

export const MainScene = {
    name: "MainScene",
    initfun: (scene: Scene) => {
        // 相机
        const camera = new GameObject("camera");
        camera.transform.rotation = new Quaternion(new Vector3(45, 0, 0));
        camera.transform.position = new Vector3(0, 3, -3);
        scene.addGameObject(camera);
        camera.addComponent(Camera);
        camera.addComponent(CameraController);

        let obj: GameObject;
        // 加载模型
        AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then((model) => {
            obj = new GameObject("female02");
            const renderer = obj.addComponent(MeshRenderer);
            renderer.mesh = model;
            obj.addComponent(ObjRotate);
            scene.addGameObject(obj);
        });

        AssetLoader.loadModel('resources/cube.obj').then((model) => {
            const cube = new GameObject("cube");
            cube.transform.position = new Vector3(2, 0, 0);
            cube.transform.scale = new Vector3(0.1, 0.1, 0.1);
            const renderer = cube.addComponent(MeshRenderer);
            renderer.mesh = model;
            cube.transform.setParent(obj.transform, false);
        });
    }
}