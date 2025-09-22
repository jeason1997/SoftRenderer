import { BoxCollider } from "../Component/BoxCollider";
import { Camera, CameraClearFlags } from "../Component/Camera";
import { CameraController } from "../Component/TestComp/CameraController";
import { Component } from "../Component/Component";
import { Light } from "../Component/Light";
import { MeshRenderer } from "../Component/MeshRenderer";
import { RayTest } from "../Component/TestComp/RayTest";
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
import { LitShader } from "../Shader/LitShader";
import { Scene } from "./Scene";
import { ObjRotate } from "../Component/TestComp/ObjRotate";
import { ObjAutoRotate } from "../Component/TestComp/ObjAutoRotate";
import { Shader } from "../Shader/Shader";

export const MainScene = {
    name: "MainScene",
    initfun: async (scene: Scene) => {
        // 相机
        const cameraObj = await createObj({
            name: "camera",
            position: new Vector3(0, 0, -5),
            rotation: new Quaternion(new Vector3(0, 0, 0)),
            components: [Camera, CameraController, RayTest]
        });

        // 灯
        const lightObj = await createObj({
            name: "light",
            rotation: new Quaternion(new Vector3(-45, 180, 0)),
            components: [Light]
        });
        const light = lightObj.getComponent(Light);
        if (light) {
            Light.sunLight = light;
        }

        // AssetLoader.loadModel('resources/female02/female02.obj', 0.01).then((model) => {
        //     const obj = new GameObject("female02");
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        //     scene.addGameObject(obj);
        // });

        const panelObj = await createObj({
            name: "panel",
            scale: Vector3.ONE.multiplyScalar(1.5),
            modelPath: 'resources/panel.obj',
            texture: Texture.NoiseTexture(),
            components: [BoxCollider, Rigidbody]
        });
        const panelBody = panelObj.getComponent(Rigidbody);
        if (panelBody) panelBody.isKinematic = true;

        // const cubeObj = await createObj({
        //     name: "cube",
        //     position: new Vector3(0, 2.5, 0),
        //     rotation: Quaternion.angleAxis(45, Vector3.UP),
        //     scale: Vector3.ONE.multiplyScalar(0.5),
        //     modelPath: 'resources/cube.obj',
        //     texture: Texture.CheckerboardTexture(),
        //     components: [Rigidbody, BoxCollider]
        // });

        const spheresObj = await createObj({
            name: "spheres",
            position: new Vector3(0, 1.5, 1.5),
            modelPath: 'resources/spheres.obj',
            texture: Texture.CheckerboardTexture(),
            //components: [Rigidbody, SphereCollider]
            components: [ObjAutoRotate]
        });

        // Resources.loadAsync<Mesh>('resources/models/bunny2.obj').then((model) => {
        //     const obj = new GameObject("bunny");
        //     obj.transform.position = new Vector3(0, 0.5, 0);
        //     obj.transform.scale = Vector3.ONE.multiplyScalar(10);
        //     const renderer = obj.addComponent(MeshRenderer);
        //     if (renderer) renderer.mesh = model;
        //     obj.addComponent(ObjRotate);
        // });

        const toukuiObj = await createObj({
            name: "toukui",
            scale: Vector3.ONE.multiplyScalar(0.1),
            modelPath: 'resources/toukui/Construction_Helmet.obj',
            texture: "resources/toukui/Construction_Helmet_M_Helmet_BaseColor.png",
            components: [ObjRotate]
        });
        spheresObj.transform.setParent(toukuiObj.transform);
    }
}

interface CreateObjConfig {
    name: string;
    position?: Vector3;
    rotation?: Quaternion;
    scale?: Vector3;
    modelPath?: string;
    texture?: string | Texture;
    shader?: Shader;
    components?: (new (gameObject: GameObject) => Component)[];
}

async function createObj(config: CreateObjConfig): Promise<GameObject> {
    const obj = new GameObject(config.name);
    obj.transform.position = config.position || Vector3.ZERO;
    obj.transform.rotation = config.rotation || Quaternion.identity;
    obj.transform.scale = config.scale || Vector3.ONE;

    if (config.modelPath) {
        const model = await Resources.loadAsync<Mesh>(config.modelPath);
        const renderer = obj.addComponent(MeshRenderer);
        if (renderer) {
            renderer.mesh = model;
            const mat = renderer.material;
            mat.shader = config.shader || new LitShader();
            mat.setVector4('mainTextureST', new Vector4(0, 0, 1, 1));
            if (typeof config.texture === 'string') {
                const t = await Resources.loadAsync<Texture>(config.texture);
                if(t) mat.setTexture('mainTexture', t);
            }
            else if (config.texture) {
                mat.setTexture('mainTexture', config.texture);
            }
        }
    }

    if (config.components && config.components.length > 0) {
        for (const ComponentClass of config.components) {
            try {
                obj.addComponent(ComponentClass);
            } catch (error) {
                console.error(`Failed to add component ${ComponentClass.name}:`, error);
            }
        }
    }

    return obj;
}