import { BoxCollider } from "../Component/BoxCollider";
import { Camera, CameraClearFlags } from "../Component/Camera";
import { CameraController } from "../Component/CameraController";
import { MeshRenderer } from "../Component/MeshRenderer";
import { ObjRotate } from "../Component/ObjRotate";
import { RayTest } from "../Component/RayTest";
import { Rigidbody } from "../Component/RigidBody";
import { SphereCollider } from "../Component/SphereCollider";
import { GameObject } from "../Core/GameObject";
import { Color } from "../Math/Color";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { AssetLoader } from "../Utils/AssetLoader";
import { Scene } from "./Scene";

export const MainScene = {
    name: "MainScene",
    initfun: (scene: Scene) => {
        // 相机
        const camera1 = new GameObject("camera");
        camera1.transform.rotation = new Quaternion(new Vector3(30, 0, 0));
        camera1.transform.position = new Vector3(0, 3, -5);
        const cma1 = camera1.addComponent(Camera);
        camera1.addComponent(CameraController);
        camera1.addComponent(RayTest);
        if (cma1) {
            cma1.clearFlags = CameraClearFlags.Color;
            cma1.depth = 0;
        }

        // const camera2 = new GameObject("camera");
        // camera2.transform.rotation = new Quaternion(new Vector3(0, 180, 0));
        // camera2.transform.position = new Vector3(0, 0, 5);
        // const cam2 = camera2.addComponent(Camera);
        // if (cam2) {
        //     cam2.backGroundColor = Color.BLACK;
        //     cam2.clearFlags = CameraClearFlags.ALL;
        //     cam2.depth = 1;
        //     cam2.viewPort = new Vector4(0, 0, 0.3, 0.3);
        // }

        // AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then((model) => {
        //     const obj = new GameObject("female02");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });

        let p_obj: GameObject;

        AssetLoader.loadModel('resources/cube.obj').then((model) => {
            const obj = new GameObject("cube");
            obj.transform.position = new Vector3(0, 1, 0);
            obj.transform.rotation = Quaternion.angleAxis(45, Vector3.UP);
            obj.transform.scale = Vector3.ONE.multiply(0.5);
            obj.addComponent(Rigidbody);
            obj.addComponent(BoxCollider);
            //obj.addComponent(ObjRotate);
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
            p_obj = obj;
        });

        AssetLoader.loadModel('resources/spheres.obj').then((model) => {
            const obj = new GameObject("spheres");
            obj.transform.position = new Vector3(0, 1.5, 1.5);
            obj.addComponent(Rigidbody);
            obj.addComponent(SphereCollider);
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
            //obj.transform.setParent(p_obj.transform);
        });

         AssetLoader.loadModel('resources/spheres.obj').then((model) => {
            const obj = new GameObject("spheres");
            obj.transform.position = new Vector3(0, 1.5, 0);
            obj.addComponent(Rigidbody);
            obj.addComponent(SphereCollider);
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
            //obj.transform.setParent(p_obj.transform);
        });

        AssetLoader.loadModel('resources/panel.obj').then((model) => {
            const obj = new GameObject("panel");
            obj.transform.scale = Vector3.ONE.multiply(1.5);
            obj.addComponent(BoxCollider);
            const body = obj.addComponent(Rigidbody);
            if (body) body.isKinematic = true;
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) renderer.mesh = model;
        });

        // AssetLoader.loadModel('resources/models/bunny2.obj', 10).then((model) => {
        //     const obj = new GameObject("bunny");
        //     obj.transform.position = new Vector3(0, 0.5, 0);
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        // });

        // AssetLoader.loadModel('resources/assets/meshes/lee.obj').then((model) => {
        //     const obj = new GameObject("lee");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        // });
    }
}