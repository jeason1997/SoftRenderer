import { BoxCollider } from "../Component/BoxCollider";
import { Camera, CameraClearFlags } from "../Component/Camera";
import { CameraController } from "../Component/CameraController";
import { Light } from "../Component/Light";
import { MeshRenderer } from "../Component/MeshRenderer";
import { ObjRotate } from "../Component/ObjRotate";
import { RayTest } from "../Component/RayTest";
import { Rigidbody } from "../Component/RigidBody";
import { SphereCollider } from "../Component/SphereCollider";
import { Engine } from "../Core/Engine";
import { GameObject } from "../Core/GameObject";
import { Color } from "../Math/Color";
import { Quaternion } from "../Math/Quaternion";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Material } from "../Resources/Material";
import { Mesh } from "../Resources/Mesh";
import { Resources } from "../Resources/Resources";
import { Texture } from "../Resources/Texture";
import { Scene } from "./Scene";

export const MainScene = {
    name: "MainScene",
    initfun: async (scene: Scene) => {
        // 相机
        const cameraGo = new GameObject("camera");
        cameraGo.transform.rotation = new Quaternion(new Vector3(0, 0, 0));
        cameraGo.transform.position = new Vector3(0, 0, -5);
        const camera = cameraGo.addComponent(Camera);
        cameraGo.addComponent(CameraController);
        cameraGo.addComponent(RayTest);
        if (camera) {
            camera.clearFlags = CameraClearFlags.Color;
            camera.depth = 0;
        }

        // 灯
        const lightGo = new GameObject("light");
        lightGo.transform.rotation = new Quaternion(new Vector3(-45, 180, 0));
        const light = lightGo.addComponent(Light);
        if (light) {
            Light.sunLight = light;
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

        // Resources.loadAsync<Mesh>('resources/cube.obj').then(async (model) => {
        //     const obj = new GameObject("cube");
        //     obj.transform.position = new Vector3(0, 2.5, 0);
        //     obj.transform.rotation = Quaternion.angleAxis(45, Vector3.UP);
        //     obj.transform.scale = Vector3.ONE.multiplyScalar(0.5);
        //     obj.addComponent(Rigidbody);
        //     obj.addComponent(BoxCollider);
        //     //obj.addComponent(ObjRotate);
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) {
        //         renderer.mesh = model;
        //         const mat = renderer.material = new Material("cube");
        //         mat.mainTexture = Texture.CheckerboardTexture();
        //     }
        // });

        Resources.loadAsync<Mesh>('resources/spheres.obj').then((model) => {
            const obj = new GameObject("spheres");
            obj.transform.position = new Vector3(0, 1.5, 1.5);
            // obj.addComponent(Rigidbody);
            // obj.addComponent(SphereCollider);
            const renderer = obj.addComponent(MeshRenderer);
            if (renderer) {
                renderer.mesh = model;
                const mat = renderer.material = new Material("spheres");
                mat.mainTexture = Texture.CheckerboardTexture();
            }
            //obj.transform.setParent(p_obj.transform);
        });

        const model = await Resources.loadAsync<Mesh>('resources/panel.obj');
        const obj = new GameObject("panel");
        obj.transform.scale = Vector3.ONE.multiplyScalar(1.5);
        obj.addComponent(ObjRotate);
        // obj.addComponent(BoxCollider);
        // const body = obj.addComponent(Rigidbody);
        // if (body) body.isKinematic = true;
        const renderer = obj.addComponent(MeshRenderer);
        if (renderer) {
            renderer.mesh = model;
            const mat = renderer.material = new Material("panel");
            mat.mainTexture = Texture.CheckerboardTexture();
        }

        // Resources.loadAsync<Mesh>('resources/models/bunny2.obj').then((model) => {
        //     const obj = new GameObject("bunny");
        //     obj.transform.position = new Vector3(0, 0.5, 0);
        //     obj.transform.scale = Vector3.ONE.multiplyScalar(10);
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        // });

        // Resources.loadAsync<Mesh>('resources/toukui/Construction_Helmet.obj').then((model) => {
        //     const obj = new GameObject("toukui");
        //     obj.transform.scale = Vector3.ONE.multiplyScalar(0.1);
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) {
        //         renderer.mesh = model;
        //         const mat = renderer.material = new Material("toukui");
        //         Resources.loadAsync<Texture>('resources/toukui/Construction_Helmet_M_Helmet_BaseColor.png').then((texture) => {
        //             mat.mainTexture = texture;
        //         });
        //     }
        //     obj.addComponent(ObjRotate);
        // });
    }
}