import { OBJModel } from "./Model";
import { Transform } from "./Transfrom";

export class GameObject {
    public name: string;
    public model: OBJModel;
    public transform: Transform;

    constructor(name: string) {
        this.name = name;
        this.transform = new Transform(name);
    }
}