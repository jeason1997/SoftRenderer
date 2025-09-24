import { Renderer } from "./Renderer";
import { Mesh } from "../Resources/Mesh";
import { Gizmo } from "../Utils/Gizmo";
import { Color } from "../Math/Color";
import { Vector3 } from "../Math/Vector3";

export class MeshRenderer extends Renderer {
    public mesh: Mesh | null = null;

    public render(): void {
    }

    public onDestroy(): void {
        super.onDestroy();
        // 清理资源
        this.mesh = null;
    }

    // public onDrawGizmos(): void {
    //     Gizmo.matrix = this.transform.localToWorldMatrix;
    //     Gizmo.DrawAxis(Vector3.ZERO, 0.1);
    // }
}