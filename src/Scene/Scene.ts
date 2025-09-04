import { GameObject } from "../GameObject";

export class Scene {
    public name: string;
    private rootGameObjects: GameObject[] = [];
    
    constructor(name: string) {
        this.name = name;
    }
    
    public addGameObject(gameObject: GameObject): void {
        this.rootGameObjects.push(gameObject);
    }
    
    public removeGameObject(gameObject: GameObject): void {
        const index = this.rootGameObjects.indexOf(gameObject);
        if (index !== -1) {
            this.rootGameObjects.splice(index, 1);
        }
    }
    
    public getRootGameObjects(): GameObject[] {
        return [...this.rootGameObjects];
    }
    
    public update(): void {
        // 更新所有根游戏对象及其子对象
        for (const gameObject of this.rootGameObjects) {
            gameObject.startComponents();
            gameObject.updateComponents();
        }
    }
}