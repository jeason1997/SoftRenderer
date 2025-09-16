import { Camera } from "../Component/Camera";
import { Renderer } from "../Component/Renderer";
import { GameObject } from "../Core/GameObject";
import { BVHTree } from "../Math/BVHTree";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";

export class Scene {
    public name: string;
    private rootGameObject: GameObject;
    private bvhTree: BVHTree;
    private needsRebuild: boolean = true;

    constructor(name: string) {
        this.name = name;
        this.rootGameObject = new GameObject("root");
        this.bvhTree = new BVHTree();
    }

    public getRootGameObject(): GameObject {
        return this.rootGameObject;
    }

    public update(): void {
        if (this.rootGameObject) {
            this.rootGameObject.startComponents();
            this.rootGameObject.updateComponents();
        }

        // 需要时重建BVH
        if (this.needsRebuild) {
            this.rebuildBVH();
            this.needsRebuild = false;
        }
    }

    /**
     * 标记需要重建BVH
     */
    public markDirty(): void {
        this.needsRebuild = true;
    }

    /**
     * 重建BVH树
     */
    private rebuildBVH(): void {
        const allObjects = this.collectAllObjects(this.rootGameObject);
        this.bvhTree.build(allObjects);
    }

    /**
     * 收集场景中所有对象
     */
    private collectAllObjects(root: GameObject): GameObject[] {
        const objects: GameObject[] = [];
        this.traverseGameObjects(root, objects);
        return objects;
    }

    /**
     * 遍历游戏对象树
     */
    private traverseGameObjects(node: GameObject, collection: GameObject[]): void {
        if (node.getComponent(Renderer)) {
            collection.push(node);
        }

        const children = node.transform.children;
        for (const child of children) {
            this.traverseGameObjects(child.gameObject, collection);
        }
    }

    /**
     * 射线检测接口
     */
    public raycast(rayOrigin: Vector3, rayDirection: Vector3, maxDistance: number = Infinity): GameObject[] {
        return this.bvhTree.raycast(rayOrigin, rayDirection, maxDistance);
    }

    /**
     * 点击屏幕选取最前面对象
     */
    public pickObject(screenX: number, screenY: number, camera: Camera): GameObject | null {
        // 将屏幕坐标转换为世界空间射线
        const ray = TransformTools.ScreenToWorldPosRaycast(new Vector2(screenX, screenY), camera);

        // 进行射线检测
        const hitObjects = this.raycast(ray.origin, ray.direction);

        if (hitObjects.length === 0) {
            return null;
        }

        // 找到距离最近的对象
        let closestObject: GameObject | null = null;
        let closestDistance = Infinity;

        for (const obj of hitObjects) {
            const distance = this.calculateHitDistance(obj, ray.origin, ray.direction);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestObject = obj;
            }
        }

        return closestObject;
    }

    /**
     * 计算命中距离（需要根据具体对象形状实现）
     */
    private calculateHitDistance(obj: GameObject, rayOrigin: Vector3, rayDirection: Vector3): number {
        // 这里需要实现具体的射线与对象相交检测
        // 可以使用对象的包围盒或更精确的网格相交检测
        const bounds = this.bvhTree.calculateObjectBounds(obj);
        if (bounds) {
            return bounds.rayIntersectDistance(rayOrigin, rayDirection);
        }
        return Infinity;
    }
}