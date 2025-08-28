import { Vector3 } from "./Math/Vector3";
import { OBJModel } from "./Utils/ObjParser";

export interface Transform {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
}

export class Instance {
    public model: OBJModel;
    public transform: Transform;
}