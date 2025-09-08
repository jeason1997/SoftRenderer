export class GLSLToTSConverter {
    private code: string;

    constructor(glslCode: string) {
        this.code = glslCode;
    }

    // 主转换方法
    convert(): string {
        let tsCode = "// 转换自GLSL的TypeScript代码\n";
        tsCode += "// 原始GLSL代码转换为TypeScript类型和模拟实现\n\n";

        // 处理#define指令
        tsCode += this.convertDefines() + "\n";

        // 处理结构体
        tsCode += this.convertStructs() + "\n";

        // 处理变量和uniforms
        tsCode += this.convertVariables() + "\n";

        // 处理函数
        tsCode += this.convertFunctions() + "\n";

        return tsCode;
    }

    // 转换#define指令为TypeScript常量
    private convertDefines(): string {
        const defineRegex = /#define\s+(\w+)\s+(\w+)/g;
        let result = "// 常量定义\n";
        let match;

        while ((match = defineRegex.exec(this.code)) !== null) {
            result += `export const ${match[1]} = ${match[2]};\n`;
        }

        return result;
    }

    // 转换结构体为TypeScript接口
    private convertStructs(): string {
        const structRegex = /struct\s+(\w+)\s*\{([\s\S]*?)\};/g;
        let result = "// 结构体定义\n";
        let match;

        while ((match = structRegex.exec(this.code)) !== null) {
            const structName = match[1];
            const structBody = match[2];

            result += `export interface ${structName} {\n`;

            // 解析结构体成员
            const memberRegex = /(\w+)\s+(\w+)\s*[;,\n]/g;
            let memberMatch;

            while ((memberMatch = memberRegex.exec(structBody)) !== null) {
                const type = this.convertType(memberMatch[1]);
                const name = memberMatch[2];
                result += `    ${name}: ${type};\n`;
            }

            result += "}\n\n";
        }

        return result;
    }

    // 转换变量声明
    private convertVariables(): string {
        const varRegex = /(uniform|attribute|varying)\s+(\w+)\s+(\w+)(\s*\[\s*(\w+)\s*\])?\s*;/g;
        let result = "// 变量定义\n";
        let match;

        while ((match = varRegex.exec(this.code)) !== null) {
            const qualifier = match[1];
            const type = this.convertType(match[2]);
            let name = match[3];
            const arraySize = match[5];

            // 处理数组
            let tsType = type;
            if (arraySize) {
                tsType = `Array<${type}>`;
                name += ` (数组大小: ${arraySize})`;
            }

            result += `// ${qualifier} - ${name}: ${tsType}\n`;
            result += `export const ${name}: ${tsType} = ${this.getDefaultValue(type, arraySize)};\n\n`;
        }

        return result;
    }

    // 转换函数
    private convertFunctions(): string {
        const funcRegex = /(\w+)\s+(\w+)\s*\(([\s\S]*?)\)\s*\{([\s\S]*?)\}/g;
        let result = "// 函数定义\n";
        let match;

        while ((match = funcRegex.exec(this.code)) !== null) {
            const returnType = this.convertType(match[1]);
            const funcName = match[2];
            const params = match[3];
            const body = match[4];

            // 转换参数
            let tsParams = "";
            const paramRegex = /(\w+)\s+(\w+)/g;
            let paramMatch;
            const paramsArray: string[] = [];

            while ((paramMatch = paramRegex.exec(params)) !== null) {
                const paramType = this.convertType(paramMatch[1]);
                const paramName = paramMatch[2];
                paramsArray.push(`${paramName}: ${paramType}`);
            }

            tsParams = paramsArray.join(", ");

            // 简单转换函数体（仅作为示例，实际转换会更复杂）
            let tsBody = body
                .replace(/vec2/g, "Vector2")
                .replace(/vec3/g, "Vector3")
                .replace(/vec4/g, "Vector4")
                .replace(/\./g, ".")
                .replace(/clamp/g, "Math.clamp")
                .replace(/pow/g, "Math.pow")
                .replace(/length/g, "(v: Vector3) => Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z)")
                .replace(/normalize/g, "(v: Vector3) => { const len = length(v); return {x: v.x/len, y: v.y/len, z: v.z/len}; }");

            result += `export function ${funcName}(${tsParams}): ${returnType} {\n`;
            result += `    // 转换后的函数体\n`;
            result += `    ${tsBody.replace(/\n/g, "\n    ")}\n`;
            result += "}\n\n";
        }

        return result;
    }

    // 转换GLSL类型为TypeScript类型
    private convertType(glslType: string): string {
        switch (glslType) {
            case "float": return "number";
            case "int": return "number";
            case "bool": return "boolean";
            case "vec2": return "Vector2";
            case "vec3": return "Vector3";
            case "vec4": return "Vector4";
            case "mat3": return "Matrix3";
            case "mat4": return "Matrix4";
            case "sampler2D": return "Texture2D";
            default: return glslType; // 对于结构体等类型直接使用原名
        }
    }

    // 获取类型的默认值
    private getDefaultValue(type: string, arraySize?: string): string {
        if (arraySize) {
            return `new Array(${arraySize}).fill(${this.getDefaultValue(type)})`;
        }

        switch (type) {
            case "number": return "0";
            case "boolean": return "false";
            case "Vector2": return "{x: 0, y: 0}";
            case "Vector3": return "{x: 0, y: 0, z: 0}";
            case "Vector4": return "{x: 0, y: 0, z: 0, w: 0}";
            case "Matrix3": return "new Array(9).fill(0)";
            case "Matrix4": return "new Array(16).fill(0)";
            case "Texture2D": return "null";
            default: return "null";
        }
    }
}

// 输入提供的GLSL代码
const glslCode = `
attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_UV;

uniform mat4 u_MVPMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_InverseTransposeModelMatrix;

varying vec2 v_UV;
varying float v_Dist;
varying vec3 v_Normal;
varying vec3 v_Position;


void main()
{
    //模型视图空间矩阵变换
    gl_Position =  u_MVPMatrix * a_Position;
    v_UV = a_UV;
    v_Dist = gl_Position.w;
    v_Position = (u_ModelMatrix * a_Position).xyz;
    // 将本地法线转换到世界坐标，要用逆转置模型矩阵，确保模型缩放后法线依旧保持垂直
    v_Normal = normalize(mat3(u_InverseTransposeModelMatrix) * a_Normal);
}`;

export function test() {
    // 执行转换
    const converter = new GLSLToTSConverter(glslCode);
    const tsCode = converter.convert();

    // 输出转换结果（在实际使用中，你可能会将其写入文件）
    console.log("转换完成的TypeScript代码:\n");
    console.log(tsCode);
}