module Log {
    var LOG_LEVEL: LogLevel = LogLevel.Info;
    export enum LogLevel {
        Error, Warning, Info, Debug
    }

    export function error(message: any) {
        log(LogLevel.Error, message);
    }

    export function warning(message: any) {
        log(LogLevel.Warning, message);
    }

    export function info(message: any) {
        log(LogLevel.Info, message);
    }

    export function debug(message: any) {
        log(LogLevel.Debug, message);
    }

    function log(level: LogLevel, message: any) {
        if (level <= LOG_LEVEL) {
            console.log(message);
        }
    }
}
