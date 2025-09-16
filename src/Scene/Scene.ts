import { GameObject } from "../Core/GameObject";

export class Scene {
    public name: string;
    private rootGameObject: GameObject;

    constructor(name: string) {
        this.name = name;
        this.rootGameObject = new GameObject("root");
    }

    public getRootGameObject(): GameObject {
        return this.rootGameObject;
    }

    public update(): void {
        if (this.rootGameObject) {
            this.rootGameObject.startComponents();
            this.rootGameObject.updateComponents();
        }
    }
}