enum LogType {
    Info,
    Warning,
    Error,
}

interface ILog {
    message: string;
    type: LogType;
}

export class Logger {
    private static logs: ILog[] = [];

    private static readonly logColors = {
        [LogType.Info]: 'white',
        [LogType.Warning]: 'orange',
        [LogType.Error]: 'red'
    };

    static printLogs(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.logs.length; i++) {
            const log = this.logs[i];
            ctx.fillStyle = Logger.logColors[log.type];
            ctx.fillText(log.message, 10, 20 + i * 15);
        }
        this.logs = [];
    }

    static log(message: string) {
        this.push(message, LogType.Info);
    }

    static warning(message: string) {
        this.push(message, LogType.Warning);
    }

    static error(message: string) {
        this.push(message, LogType.Error);
    }

    private static push(message: string, type: LogType) {
        const log: ILog = {
            message,
            type,
        }
        this.logs.push(log);
    }
}