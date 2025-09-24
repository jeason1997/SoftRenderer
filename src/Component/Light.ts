import { Color } from "../Math/Color";
import { Vector3 } from "../Math/Vector3";
import { Gizmo } from "../Utils/Gizmo";
import { Component } from "./Component";

export enum LightType {
    Directional = 0,
    Point = 1,
    Spot = 2,
}

export enum ShadowType {
    None = 0,
    Hard = 1,
    Soft = 2,
}

export class Light extends Component {
    public static sunLight: Light;
    public type: LightType = LightType.Directional;
    public color: Color = Color.WHITE;
    public intensity: number = 1;
    public shadowType: ShadowType = ShadowType.None;

    public onDrawGizmos(): void {
        Gizmo.matrix = this.transform.localToWorldMatrix;
        Gizmo.DrawAxis(Vector3.ZERO, 0.1);
        Gizmo.color = Color.WHITE;
        Gizmo.DrawCube(Vector3.ZERO, new Vector3(0.1, 0.1, 0.5));
        Gizmo.color = Color.RED;
        Gizmo.DrawCube(new Vector3(0, 0, 0.3), Vector3.ONE.multiplyScalar(0.1));
    }
}