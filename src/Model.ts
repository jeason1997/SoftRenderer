import { Vector3 } from "./Vector3";

export class Model {
    public name: string;
    public vertices: Vector3[];
    public vertexColors: number[];
    public triangles: number[][];
}

export class Transform {
    public position: Vector3;
    public rotation: Vector3;
    public scale: Vector3;
}

export class Instance {
    public model: Model;
    public transform: Transform;
}