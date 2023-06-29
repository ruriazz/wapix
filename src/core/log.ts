import { type Log as Interface } from '@vendor';
import Settings from '@core/settings';
import { Logger } from 'tslog';

export default class Log implements Interface {
    private readonly _log: Logger<this>;

    constructor(settings?: Settings) {
        settings = settings || new Settings();

        this._log = new Logger({
            name: settings.NODE_NAME,
            prettyLogTimeZone: settings.UTC_LOG_TZ ? 'UTC' : 'local',
            prettyLogTemplate: '{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{MM}}:{{ss}}.{{ms}}\t[{{name}}][{{logLevelName}}][{{filePathWithLine}}] ',
            prettyLogStyles: {
                logLevelName: {
                    '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
                    INFO: ['bold', 'blue'],
                    WARN: ['bold', 'yellow'],
                    ERROR: ['bold', 'red'],
                    FATAL: ['bold', 'redBright'],
                },
                dateIsoStr: 'white',
                filePathWithLine: 'white',
                name: ['white', 'bold'],
                nameWithDelimiterPrefix: ['white', 'bold'],
                nameWithDelimiterSuffix: ['white', 'bold'],
                errorName: ['bold', 'bgRedBright', 'whiteBright'],
                fileName: ['yellow'],
            },
        });
    }

    info(data: { message: string; extra?: object | null }) {
        const args: any[] = [data.message];
        if (data.extra != null) args.push(data.extra);

        this._log.info(...args);
    }

    warning(data: { message: string; error?: Error | unknown; extra?: object | null }) {
        const args: any[] = [data.message];
        if (data.extra != null) args.push(data.extra);
        if (data.error) args.push(data.error);

        this._log.warn(...args);
    }

    error(data: { message?: string | null; error: Error | unknown; extra?: object | null }) {
        const args: any[] = [data.error];
        if (data.extra != null) args.unshift(data.extra);
        if (data.message) args.unshift(data.message);

        this._log.error(...args);
    }

    fatal(data: { message?: string | null; error: Error | unknown; extra?: object | null }) {
        const args: any[] = [];
        if (data.message) args.push(data.message);
        if (data.extra != null) args.push(data.extra);
        if (data.error) args.push(data.error);

        this._log.fatal(...args);
    }

    fatalOnError(data: { message?: string | null; error?: Error | unknown; extra?: object | null }) {
        if (data.error) {
            const args: any[] = [data.error];
            if (data.extra != null) args.unshift(data.extra);
            if (data.message) args.unshift(data.message);

            this._log.fatal(...args);
        }
    }
}
