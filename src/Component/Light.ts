import { Color } from "../Math/Color";
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
}