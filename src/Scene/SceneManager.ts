import { Scene } from "./Scene";

export class SceneManager {
    private scenes: Map<string, Scene> = new Map<string, Scene>();
    private activeScene: Scene | null = null;

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

    public loadScene(data: any) {
        if (!data.name || !data.initfun) {
            return;
        }

        // 初始化场景
        const mainScene = this.createScene(data.name);
        data.initfun(mainScene);
        this.setActiveScene(mainScene);
    }
}