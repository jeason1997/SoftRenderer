import { BoxCollider } from "../Component/BoxCollider";
import { Camera } from "../Component/Camera";
import { CameraController } from "../Component/CameraController";
import { MeshRenderer } from "../Component/MeshRenderer";
import { ObjRotate } from "../Component/ObjRotate";
import { Rigidbody } from "../Component/RigidBody";
import { SphereCollider } from "../Component/SphereCollider";
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
        camera.transform.rotation = new Quaternion(new Vector3(30, 0, 0));
        camera.transform.position = new Vector3(0, 3, -5);
        scene.addGameObject(camera);
        camera.addComponent(Camera);
        camera.addComponent(CameraController);

        // AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then((model) => {
        //     const obj = new GameObject("female02");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });

        AssetLoader.loadModel('resources/cube.obj').then((model) => {
            const obj = new GameObject("cube");
            obj.transform.position = new Vector3(0, 2.5, 0);
            obj.transform.rotation = Quaternion.angleAxis(45, Vector3.UP);
            obj.transform.scale = Vector3.ONE.multiply(0.5);
            obj.addComponent(Rigidbody);
            obj.addComponent(BoxCollider);
            // obj.addComponent(ObjRotate);
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
            scene.addGameObject(obj);
        });

        AssetLoader.loadModel('resources/spheres.obj').then((model) => {
            const obj = new GameObject("spheres");
            obj.transform.position = new Vector3(0.1, 1.5, 0);
            const body = obj.addComponent(Rigidbody);
            obj.addComponent(SphereCollider);
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
            scene.addGameObject(obj);
        });

        AssetLoader.loadModel('resources/panel.obj').then((model) => {
            const obj = new GameObject("panel");
            obj.transform.scale = Vector3.ONE.multiply(1.5);
            const collider = obj.addComponent(BoxCollider);
            const body = obj.addComponent(Rigidbody);
            if (body) body.isKinematic = true;
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
            scene.addGameObject(obj);
        });

        // AssetLoader.loadModel('resources/models/bunny2.obj', 10).then((model) => {
        //     const obj = new GameObject("bunny");
        //     obj.transform.position = new Vector3(0, 0.5, 0);
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });

        // AssetLoader.loadModel('resources/assets/meshes/lee.obj').then((model) => {
        //     const obj = new GameObject("lee");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });
    }
}