import { Camera } from "../Component/Camera";
import { Engine } from "../Core/Engine";
import { Color } from "../Math/Color";
import { TransformTools } from "../Math/TransformTools";
import { Vector2 } from "../Math/Vector2";
import { Vector3 } from "../Math/Vector3";

enum LogType {
    Info,
    Warning,
    Error,
}

interface ILog {
    message: string;
    type: LogType;
    duration: number;
}

interface ILine {
    start: Vector2;
    end: Vector2;
    color: Color;
    duration: number;
}

export class Debug {
    private static logs: ILog[] = [];
    private static lines: ILine[] = [];

    private static readonly logColors = {
        [LogType.Info]: 'white',
        [LogType.Warning]: 'orange',
        [LogType.Error]: 'red'
    };

    static PrintLogs() {
        for (let i = 0; i < this.logs.length; i++) {
            const log = this.logs[i];
            Engine.context.fillStyle = Debug.logColors[log.type];
            Engine.context.fillText(log.message, 10, 20 + i * 15);
        }
        this.logs = [];
    }

    static GetDebugLines() {
        const lines = this.lines;
        this.lines = [];
        return lines;
    }

    static Log(message: string, duration?: number) {
        this.push(message, LogType.Info, duration);
    }

    static LogWarning(message: string, duration?: number) {
        this.push(message, LogType.Warning, duration);
    }

    static LogError(message: string, duration?: number) {
        this.push(message, LogType.Error, duration);
    }

    static DrawLine(start: Vector2, end: Vector2, color: Color, duration?: number) {
        const line: ILine = {
            start,
            end,
            color,
            duration: duration ?? 0,
        }
        this.lines.push(line);
    }

    static DrawLine3D(start: Vector3, end: Vector3, color: Color, duration?: number) {
        const a = TransformTools.WorldToScreenPos(start, Camera.mainCamera).screen;
        const b = TransformTools.WorldToScreenPos(end, Camera.mainCamera).screen;
        this.DrawLine(a, b, color, duration);
    }

    private static push(message: string, type: LogType, duration?: number) {
        const log: ILog = {
            message,
            type,
            duration: duration ?? 0,
        }
        this.logs.push(log);
    }
}