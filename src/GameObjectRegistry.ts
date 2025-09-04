import { GameObject } from "./GameObject";

export class GameObjectRegistry {
    private static instance: GameObjectRegistry;
    private gameObjects: Map<string, GameObject> = new Map<string, GameObject>();
    private taggedGameObjects: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    
    private constructor() {}
    
    public static getInstance(): GameObjectRegistry {
        if (!GameObjectRegistry.instance) {
            GameObjectRegistry.instance = new GameObjectRegistry();
        }
        return GameObjectRegistry.instance;
    }
    
    public registerGameObject(gameObject: GameObject): void {
        // 按名称注册
        this.gameObjects.set(gameObject.name, gameObject);
        
        // 按标签注册
        if (!this.taggedGameObjects.has(gameObject.tag)) {
            this.taggedGameObjects.set(gameObject.tag, []);
        }
        this.taggedGameObjects.get(gameObject.tag)?.push(gameObject);
    }
    
    public unregisterGameObject(gameObject: GameObject): void {
        // 从名称注册表中移除
        this.gameObjects.delete(gameObject.name);
        
        // 从标签注册表中移除
        const taggedObjects = this.taggedGameObjects.get(gameObject.tag);
        if (taggedObjects) {
            const index = taggedObjects.indexOf(gameObject);
            if (index !== -1) {
                taggedObjects.splice(index, 1);
            }
        }
    }
    
    public findByName(name: string): GameObject | undefined {
        return this.gameObjects.get(name);
    }
    
    public findByTag(tag: string): GameObject | undefined {
        const taggedObjects = this.taggedGameObjects.get(tag);
        return taggedObjects && taggedObjects.length > 0 ? taggedObjects[0] : undefined;
    }
    
    public findAllByTag(tag: string): GameObject[] {
        return this.taggedGameObjects.get(tag) || [];
    }
    
    public getAllGameObjects(): GameObject[] {
        return Array.from(this.gameObjects.values());
    }
}