import { Engine } from "./Engine";

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

export class Logger {
    private static logs: ILog[] = [];

    private static readonly logColors = {
        [LogType.Info]: 'white',
        [LogType.Warning]: 'orange',
        [LogType.Error]: 'red'
    };

    static printLogs() {
        for (let i = 0; i < this.logs.length; i++) {
            const log = this.logs[i];
            Engine.context.fillStyle = Logger.logColors[log.type];
            Engine.context.fillText(log.message, 10, 20 + i * 15);
        }
        this.logs = [];
    }

    static log(message: string, duration?: number) {
        this.push(message, LogType.Info, duration);
    }

    static warning(message: string, duration?: number) {
        this.push(message, LogType.Warning, duration);
    }

    static error(message: string, duration?: number) {
        this.push(message, LogType.Error, duration);
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