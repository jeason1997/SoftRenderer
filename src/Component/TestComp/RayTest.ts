import { Engine } from "../../Core/Engine";
import { Input } from "../../Core/Input";
import { Color } from "../../Math/Color";
import { TransformTools } from "../../Math/TransformTools";
import { Vector3 } from "../../Math/Vector3";
import { Debug } from "../../Utils/Debug";
import { Camera } from "../Camera";
import { Collider } from "../Collider";
import { Component } from "../Component";

interface Line {
    start: Vector3;
    end: Vector3;
}

export class RayTest extends Component {
    private _lines: Line[] = [];

    public onUpdate(): void {
        // 鼠标左键发射射线
        if (Input.GetMouseButtonDown(0)) {
            const ray = TransformTools.ScreenToWorldPosRaycast(Input.mousePosition, Camera.mainCamera);
            const hitInfo = Engine.physics.Raycast(ray);
            if (hitInfo) {
                if (hitInfo.collider) {
                    this._lines.push({
                        start: ray.origin,
                        end: hitInfo.point,
                    });
                    const scale = hitInfo.collider.transform.scale;
                    hitInfo.collider.transform.scale = scale.multiplyScalar(0.9);
                    // hitInfo.collider.gameObject.removeComponentInstance(hitInfo.collider);
                    // console.log(hit.toString());
                }
            }
        }

        this._lines.forEach(line => {
            // Debug.DrawLine3D(line.start, line.end, Color.RED);
        });
    }
}