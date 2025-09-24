import { Quaternion } from "../../Math/Quaternion";
import { Vector2 } from "../../Math/Vector2";
import { Vector3 } from "../../Math/Vector3";
import { Debug } from "../../Utils/Debug";
import { Camera } from "../Camera";
import { Component } from "../Component";

export class BillBoard extends Component {
    public onUpdate(): void {
        const camera = Camera.mainCamera;
        if (!camera) return;

        const cameraPosition = camera.transform.worldPosition;
        const worldPosition = this.transform.worldPosition;
        const direction = cameraPosition.subtract(worldPosition);

        // 计算水平平面上的角度
        const horizontalDir = new Vector2(direction.x, direction.z).normalize();
        let angle = Math.atan2(horizontalDir.y, horizontalDir.x) * 180 / Math.PI;

        this.transform.rotation = Quaternion.angleAxis(-angle + 90, Vector3.UP);
    }
}