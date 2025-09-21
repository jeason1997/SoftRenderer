import { Light } from "../Component/Light";
import { RenderSettings } from "../Core/Setting";
import { Color } from "../Math/Color";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";
import { Vector4 } from "../Math/Vector4";
import { Texture } from "../Resources/Texture";
import { Shader } from "./Shader";

export class LitShader extends Shader {
    public mainTexture: Texture;
    public viewDirection: Vector3;

    public vertexShader(): Vector4 {
        this.attr = {
            uv: new Vector2(),
            normal: new Vector3(),
        };

        // const modelMatrix = transform.localToWorldMatrix;
        // const viewMatrix = camera.getViewMatrix();
        // const projectionMatrix = camera.getProjectionMatrix();
        // const mvpMatrix = projectionMatrix.multiply(viewMatrix).multiply(modelMatrix);

        // 另一种构建mv矩阵的方式
        // 构建一个先朝摄影机反方向移动，再反方向旋转的矩阵，其实得到的也就是上面摄影机的世界坐标矩阵
        // const cameraForward = camera.transform.forward;
        // const cameraUp = camera.transform.up;
        // const modelViewMatrix = modelMatrix.clone().transformToLookAtSpace(camera.transform.position, camera.transform.position.add(cameraForward), cameraUp);
        // const mvpMatrix = modelViewMatrix.perspective(camera.fov, camera.aspect, camera.nearClip, camera.farClip);

        // 要把Vec3转为齐次坐标点，即w=1
        //return mvpMatrix.multiplyVector4(new Vector4(vertex, 1));
        return Vector4.ZERO;
    }

    // 光照计算
    public fragmentShader(): number {
        const uv = this.attr.uv as Vector2;
        const normal = this.attr.normal as Vector3;

        const surfaceColor = this.mainTexture.Sample(uv.u, uv.v);

        const light = Light.sunLight;
        const ambientLight = RenderSettings.ambientLight;

        // 高光系数，值越大高光越集中
        const shininess: number = 100

        // 确保法向量归一化
        const normalizedNormal = normal.normalize();
        const lightDirection = light.transform.forward.normalize();
        const normalizedViewDir = this.viewDirection.negate().normalize();

        // 计算漫反射（半兰伯特）部分
        const dotProduct = Math.max(0, Vector3.dot(normalizedNormal, lightDirection)) * 0.5 + 0.5;

        // 计算高光（Phong）部分
        // 1. 计算反射光方向 = 2*(法向量·光源方向)*法向量 - 光源方向
        const reflectDir = normalizedNormal.clone()
            .multiplyScalar(2 * Vector3.dot(normalizedNormal, lightDirection))
            .subtract(lightDirection)
            .normalize();

        // 2. 计算反射方向与视角方向的点积
        const specDot = Math.max(0, Vector3.dot(reflectDir, normalizedViewDir));

        // 3. 计算高光因子（使用高光系数控制高光范围）
        const specularFactor = Math.pow(specDot, shininess);

        // 4. 计算高光颜色（通常使用光源颜色，可添加高光强度参数）
        const specularIntensity = 0.5; // 高光强度
        const specularR = Math.round(light.color.r * specularIntensity * specularFactor);
        const specularG = Math.round(light.color.g * specularIntensity * specularFactor);
        const specularB = Math.round(light.color.b * specularIntensity * specularFactor);

        // 提取表面颜色的RGBA通道
        const rgba = Color.FromUint32(surfaceColor);

        // 计算漫反射颜色
        const diffR = Math.round(rgba.r * (light.color.r / 255) * light.intensity * dotProduct);
        const diffG = Math.round(rgba.g * (light.color.g / 255) * light.intensity * dotProduct);
        const diffB = Math.round(rgba.b * (light.color.b / 255) * light.intensity * dotProduct);

        // 合并所有光照贡献（环境光 + 漫反射 + 高光）
        const totalR = ambientLight.r + diffR + specularR;
        const totalG = ambientLight.g + diffG + specularG;
        const totalB = ambientLight.b + diffB + specularB;

        // 确保颜色值在0-255范围内
        const clampedR = Math.min(255, Math.max(0, totalR));
        const clampedG = Math.min(255, Math.max(0, totalG));
        const clampedB = Math.min(255, Math.max(0, totalB));

        // 组合成32位颜色值（保留原始Alpha）
        return (rgba.a << 24) | (clampedB << 16) | (clampedG << 8) | clampedR;
    }
}