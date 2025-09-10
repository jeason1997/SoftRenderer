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
        //camera.transform.rotation = new Quaternion(new Vector3(45, 0, 0));
        camera.transform.position = new Vector3(0, 0, -3);
        scene.addGameObject(camera);
        camera.addComponent(Camera);
        camera.addComponent(CameraController);

        // AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then((model) => {
        //     const obj = new GameObject("female02");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });

        // AssetLoader.loadModel('resources/cube.obj').then((model) => {
        //     const obj = new GameObject("cube");
        //     obj.transform.position = Vector3.RIGHT;
        //     const renderer = obj.addComponent(MeshRenderer);
        //     renderer.mesh = model;
        //     //cube.transform.setParent(obj.transform, false);
        //     scene.addGameObject(obj);
        // });

        AssetLoader.loadModel('resources/models/bunny2.obj', 10).then((model) => {
            const obj = new GameObject("bunny");
            //obj.transform.position = Vector3.RIGHT;
            const renderer = obj.addComponent(MeshRenderer);
            renderer.mesh = model;
            scene.addGameObject(obj);
        });

        // AssetLoader.loadModel('resources/assets/meshes/lee.obj').then((model) => {
        //     const obj = new GameObject("lee");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     renderer.mesh = model;
        //     scene.addGameObject(obj);
        // });
    }
}