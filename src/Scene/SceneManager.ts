import { Scene } from "./Scene";

export class SceneManager {
    private static _instance: SceneManager;
    private scenes: Map<string, Scene> = new Map<string, Scene>();
    private activeScene: Scene | null = null;
    
    private constructor() {}
    
    public static get instance(): SceneManager {
        if (!SceneManager._instance) {
            SceneManager._instance = new SceneManager();
        }
        return SceneManager._instance;
    }
    
    public createScene(name: string): Scene {
        const scene = new Scene(name);
        this.scenes.set(name, scene);
        return scene;
    }
    
    public getScene(name: string): Scene | undefined {
        return this.scenes.get(name);
    }
    
    public setActiveScene(scene: Scene | string): void {
        if (typeof scene === 'string') {
            const foundScene = this.scenes.get(scene);
            if (foundScene) {
                this.activeScene = foundScene;
            }
        } else {
            this.activeScene = scene;
        }
    }
    
    public getActiveScene(): Scene | null {
        return this.activeScene;
    }
    
    public updateActiveScene(): void {
        if (this.activeScene) {
            this.activeScene.update();
        }
    }
}