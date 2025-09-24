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
import { ToonShader } from "../Shader/ToonShader";
import { CubeMap } from "../Resources/CubeMap";
import { RenderSettings } from "../Core/Setting";
import { ScrollTexture } from "../Component/TestComp/ScrollTexture";
import { TextureCreator } from "../Resources/TextureCreator";
import { MeshCreator } from "../Resources/MeshCreator";
import { PBRShader } from "../Shader/PBRShader";
import { AlphaCutOffShader } from "../Shader/AlphaCutOffShader";
import { BillBoard } from "../Component/TestComp/BillBoard";
import { VertexAttributes } from "../Renderer/RendererDefine";

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
            position: new Vector3(0, 3, 0),
            rotation: new Quaternion(new Vector3(0, 0, 0)),
            components: [Light, ObjRotate]
        });
        const light = lightObj.getComponent(Light);
        if (light) {
            Light.sunLight = light;
        }

        // 天空盒
        const POSITIVE_X = await Resources.loadAsync<Texture>("resources/skybox/POSITIVE_X.jpg");
        const NEGATIVE_X = await Resources.loadAsync<Texture>("resources/skybox/NEGATIVE_X.jpg");
        const POSITIVE_Y = await Resources.loadAsync<Texture>("resources/skybox/POSITIVE_Y.jpg");
        const NEGATIVE_Y = await Resources.loadAsync<Texture>("resources/skybox/NEGATIVE_Y.jpg");
        const POSITIVE_Z = await Resources.loadAsync<Texture>("resources/skybox/POSITIVE_Z.jpg");
        const NEGATIVE_Z = await Resources.loadAsync<Texture>("resources/skybox/NEGATIVE_Z.jpg");
        if (POSITIVE_X && NEGATIVE_X && POSITIVE_Y && NEGATIVE_Y && POSITIVE_Z && NEGATIVE_Z) {
            RenderSettings.skybox = new CubeMap(
                POSITIVE_X,
                NEGATIVE_X,
                POSITIVE_Y,
                NEGATIVE_Y,
                POSITIVE_Z,
                NEGATIVE_Z,
            );
        }

        // const testObj = await createObj({
        //     name: "obj",
        //     modelPath: 'resources/assets/meshes/suzanne_low.obj',
        //     components: [ObjRotate, ScrollTexture],
        // });

        // const leeObj = await createObj({
        //     name: "lee",
        //     model: 'resources/assets/meshes/lee.obj',
        //     // shader: PBRShader,
        //     shaderProp: {
        //         mainTexture: "resources/assets/textures/texture/lee.jpg",
        //         // normalTexture: "resources/assets/textures/texture/lee_normal.jpg",
        //         // gloss: 1000
        //     }
        // });

        // const female02Obj = await createObj({
        //     name: "female02",
        //     modelPath: 'resources/female02/female02.obj',
        //     modelScale: 0.01,
        //     texture: Texture.CheckerboardTexture(),
        //     components: [ObjRotate],
        // });

        // const groundObj = await createObj({
        //     name: "ground",
        //     model: MeshCreator.createPanel(),
        //     shaderProp: {
        //         mainTexture: "resources/assets/textures/texture/ancientbrick_albedo.jpg",
        //     }
        // });
        // const groundObj = panelObj.getComponent(Rigidbody);
        // if (groundObj) groundObj.isKinematic = true;

        // 随机生成20颗树，它们的位置在[-5, 5]的水平范围内随机分布
        // for (let i = 0; i < 30; i++) {
        //     const randomX = (Math.random() * 5) - 2.5;
        //     const randomZ = (Math.random() * 5) - 2.5;
        //     const randomH = 1 + (Math.random() * 0.4) - 0.2;
        //     const panelObj = await createObj({
        //         name: `tree_${i}`,
        //         position: new Vector3(randomX, 0.5 * randomH, randomZ),
        //         scale: Vector3.ONE.multiplyScalar(randomH),
        //         model: MeshCreator.createQuad(),
        //         components: [BillBoard],
        //         shader: AlphaCutOffShader,
        //         shaderProp: {
        //             mainTexture: "resources/texture/tree.png",
        //         }
        //     });
        // }

        // // 左
        // await createObj({
        //     name: "cube",
        //     position: new Vector3(-2, 0, 0),
        //     model: "resources/cube.obj",
        //     shaderProp: {
        //         baseColor: Color.YELLOW,
        //     }
        // });
        // // 右
        // await createObj({
        //     name: "cube",
        //     position: new Vector3(2, 0, 0),
        //     model: "resources/cube.obj",
        //     shaderProp: {
        //         baseColor: Color.RED,
        //     }
        // });
        // // 前
        // await createObj({
        //     name: "cube",
        //     position: new Vector3(0, 0, 2),
        //     model: "resources/cube.obj",
        //     shaderProp: {
        //         baseColor: Color.GREEN,
        //     }
        // });
        // // 后
        // await createObj({
        //     name: "cube",
        //     position: new Vector3(0, 0, -2),
        //     model: "resources/cube.obj",
        //     shaderProp: {
        //         baseColor: Color.BLUE,
        //     }
        // });

        // const spheresObj = await createObj({
        //     name: "spheres",
        //     position: new Vector3(0, 1.5, 1.5),
        //     model: "resources/sphere.obj",
        //     // components: [Rigidbody, SphereCollider]
        //     components: [ObjAutoRotate],
        //     shader: PBRShader,
        //     shaderProp: {
        //         // mainTexture: TextureCreator.CheckerboardTexture(),
        //         mainTexture: "resources/texture/Brick_Diffuse.jpg",
        //         normalTexture: "resources/texture/Brick_Normal.jpg",
        //         // mainTexture: "resources/texture/Road_Diffuse.jpg",
        //         // normalTexture: "resources/texture/Road_Normal.jpg",
        //     }
        // });

        // const bunnyObj = await createObj({
        //     name: "bunny",
        //     modelPath: 'resources/models/bunny2.obj',
        //     modelScale: 10,
        //     texture: Texture.CheckerboardTexture(),
        // });

        const toukuiObj = await createObj({
            name: "toukui",
            model: 'resources/toukui/Construction_Helmet.obj',
            modelScale: 0.1,
            components: [ObjRotate],
            shaderProp: {
                mainTexture: "resources/toukui/Construction_Helmet_M_Helmet_BaseColor.png",
                // normalTexture: "resources/toukui/Construction_Helmet_M_Helmet_Normal.png",
            }
        });
        // spheresObj.transform.setParent(toukuiObj.transform);
    }
}

interface CreateObjConfig {
    name: string;
    position?: Vector3;
    rotation?: Quaternion;
    scale?: Vector3;
    model?: string | Mesh;
    modelScale?: number;
    shader?: new (...args: any[]) => Shader;
    shaderProp?: VertexAttributes;
    components?: (new (gameObject: GameObject) => Component)[];
}

async function createObj(config: CreateObjConfig): Promise<GameObject> {
    const obj = new GameObject(config.name);
    obj.transform.position = config.position || Vector3.ZERO;
    obj.transform.rotation = config.rotation || Quaternion.identity;
    obj.transform.scale = config.scale || Vector3.ONE;

    if (config.model) {
        const model = typeof config.model === 'string' ? await Resources.loadAsync<Mesh>(config.model) : config.model;
        if (config.modelScale) model?.scale(config.modelScale);

        const renderer = obj.addComponent(MeshRenderer);
        if (renderer) {
            renderer.mesh = model;
            const mat = renderer.material;
            mat.shader = config.shader ? new config.shader() : new LitShader();
            // 设置纹理
            if (config.shaderProp) {
                for (const prop of Object.entries(config.shaderProp)) {
                    if (typeof prop[1] === 'string') {
                        const t = await Resources.loadAsync<Texture>(prop[1]);
                        if (t) mat.setTexture(prop[0], t);
                        delete config.shaderProp[prop[0]];
                    }
                }
                // 设置其他属性
                mat.setProperties(config.shaderProp);
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