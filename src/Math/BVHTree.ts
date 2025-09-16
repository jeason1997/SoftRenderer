import { GameObject } from "../Core/GameObject";
import { Vector3 } from "../Math/Vector3";
import { Bounds } from "./Bounds";

// BVH节点类
class BVHNode {
    public bounds: Bounds;
    public gameObject: GameObject | null = null;
    public left: BVHNode | null = null;
    public right: BVHNode | null = null;
    public isLeaf: boolean = false;

    constructor(bounds: Bounds) {
        this.bounds = bounds;
    }
}

// BVH树类
export class BVHTree {
    private root: BVHNode | null = null;
    private maxObjectsPerNode: number = 8; // 每个节点最大对象数量
    private maxDepth: number = 16; // 最大深度

    /**
     * 构建BVH树
     */
    public build(sceneObjects: GameObject[]): void {
        if (sceneObjects.length === 0) {
            this.root = null;
            return;
        }

        // 计算所有对象的包围盒
        const boundsList: Bounds[] = [];
        for (const obj of sceneObjects) {
            const bounds = this.calculateObjectBounds(obj);
            if (bounds) {
                boundsList.push(bounds);
            }
        }

        // 构建BVH树
        this.root = this.buildRecursive(boundsList, sceneObjects, 0);
    }

    /**
     * 递归构建BVH节点
     */
    private buildRecursive(
        boundsList: Bounds[], 
        objects: GameObject[], 
        depth: number
    ): BVHNode {
        // 终止条件：对象数量少或达到最大深度
        if (objects.length <= this.maxObjectsPerNode || depth >= this.maxDepth) {
            const node = new BVHNode(this.calculateCombinedBounds(boundsList));
            node.gameObject = objects.length === 1 ? objects[0] : null;
            node.isLeaf = true;
            return node;
        }

        // 选择分割轴（选择方差最大的轴）
        const axis = this.selectSplitAxis(boundsList);
        
        // 按选中轴排序对象
        const sorted = this.sortObjectsByAxis(objects, boundsList, axis);
        
        // 分割点（中位数分割）
        const mid = Math.floor(objects.length / 2);
        
        const leftBounds = boundsList.slice(0, mid);
        const rightBounds = boundsList.slice(mid);
        const leftObjects = objects.slice(0, mid);
        const rightObjects = objects.slice(mid);

        // 创建内部节点
        const node = new BVHNode(this.calculateCombinedBounds(boundsList));
        node.left = this.buildRecursive(leftBounds, leftObjects, depth + 1);
        node.right = this.buildRecursive(rightBounds, rightObjects, depth + 1);
        node.isLeaf = false;

        return node;
    }

    /**
     * 射线检测 - 找到所有相交对象
     */
    public raycast(rayOrigin: Vector3, rayDirection: Vector3, maxDistance: number = Infinity): GameObject[] {
        const results: GameObject[] = [];
        if (this.root) {
            this.raycastRecursive(this.root, rayOrigin, rayDirection, maxDistance, results);
        }
        return results;
    }

    /**
     * 递归射线检测
     */
    private raycastRecursive(
        node: BVHNode, 
        rayOrigin: Vector3, 
        rayDirection: Vector3, 
        maxDistance: number, 
        results: GameObject[]
    ): void {
        if (!node.bounds.intersectsRay(rayOrigin, rayDirection, maxDistance)) {
            return;
        }

        if (node.isLeaf) {
            if (node.gameObject) {
                results.push(node.gameObject);
            }
            return;
        }

        if (node.left) {
            this.raycastRecursive(node.left, rayOrigin, rayDirection, maxDistance, results);
        }
        if (node.right) {
            this.raycastRecursive(node.right, rayOrigin, rayDirection, maxDistance, results);
        }
    }

    /**
     * 计算对象包围盒
     */
    public calculateObjectBounds(obj: GameObject): Bounds | null {
        // 这里需要实现具体的包围盒计算逻辑
        // 可以根据对象的变换和渲染组件来计算实际包围盒
        const transform = obj.transform;
        if (!transform) return null;

        const position = transform.worldPosition;
        const scale = transform.worldScale;
        
        // 简单实现：假设每个对象都是单位立方体，根据变换缩放和平移
        const halfSize = new Vector3(0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z);
        return new Bounds(
            position.subtract(halfSize),
            position.add(halfSize)
        );
    }

    /**
     * 计算多个包围盒的合并包围盒
     */
    private calculateCombinedBounds(boundsList: Bounds[]): Bounds {
        if (boundsList.length === 0) {
            return new Bounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
        }

        let min = boundsList[0].min.clone();
        let max = boundsList[0].max.clone();

        for (let i = 1; i < boundsList.length; i++) {
            min = Vector3.min(min, boundsList[i].min);
            max = Vector3.max(max, boundsList[i].max);
        }

        return new Bounds(min, max);
    }

    /**
     * 选择最佳分割轴
     */
    private selectSplitAxis(boundsList: Bounds[]): number {
        // 计算每个轴的方差，选择方差最大的轴
        const variances = this.calculateAxisVariances(boundsList);
        let bestAxis = 0;
        let maxVariance = variances[0];

        for (let i = 1; i < 3; i++) {
            if (variances[i] > maxVariance) {
                maxVariance = variances[i];
                bestAxis = i;
            }
        }

        return bestAxis;
    }

    /**
     * 计算各轴方差
     */
    private calculateAxisVariances(boundsList: Bounds[]): number[] {
        const centers: Vector3[] = [];
        for (const bounds of boundsList) {
            centers.push(bounds.center);
        }

        const variances = [0, 0, 0];
        for (let axis = 0; axis < 3; axis++) {
            const mean = centers.reduce((sum, center) => sum + center.getComponent(axis), 0) / centers.length;
            variances[axis] = centers.reduce((sum, center) => {
                const diff = center.getComponent(axis) - mean;
                return sum + diff * diff;
            }, 0) / centers.length;
        }

        return variances;
    }

    /**
     * 按指定轴排序对象
     */
    private sortObjectsByAxis(
        objects: GameObject[], 
        boundsList: Bounds[], 
        axis: number
    ): GameObject[] {
        const sortedIndices = boundsList
            .map((bounds, index) => ({
                index,
                center: bounds.center.getComponent(axis)
            }))
            .sort((a, b) => a.center - b.center)
            .map(item => item.index);

        return sortedIndices.map(index => objects[index]);
    }
}