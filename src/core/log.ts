import { type Log as Interface } from '@vendor';
import Settings from '@core/settings';
import { BaseLogger } from 'tslog';

export default class Log extends BaseLogger<any> implements Interface {
    constructor(settings?: Settings) {
        settings = settings || new Settings();
        super(
            {
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
            },
            null,
            5
        );
    }

    info(data: { message: string; extra?: object | null }) {
        const args: any[] = [data.message];
        if (data.extra != null) args.push(data.extra);

        super.log(3, 'INFO', ...args);
    }

    warning(data: { message: string; error?: Error | unknown; extra?: object | null }) {
        const args: any[] = [data.message];
        if (data.extra != null) args.push(data.extra);
        if (data.error) args.push(data.error);

        super.log(4, 'WARN', ...args);
    }

    error(data: { message?: string | null; error: Error | unknown; extra?: object | null }) {
        const args: any[] = [data.error];
        if (data.extra != null) args.unshift(data.extra);
        if (data.message) args.unshift(data.message);

        super.log(5, 'ERROR', ...args);
    }

    fatal(data: { message?: string | null; error: Error | unknown; extra?: object | null }) {
        const args: any[] = [];
        if (data.message) args.push(data.message);
        if (data.extra != null) args.push(data.extra);
        if (data.error) args.push(data.error);

        super.log(6, 'FATAL', ...args);
    }

    fatalOnError(data: { message?: string | null; error?: Error | unknown; extra?: object | null }) {
        if (data.error) {
            const args: any[] = [data.error];
            if (data.extra != null) args.unshift(data.extra);
            if (data.message) args.unshift(data.message);

            super.log(6, 'FATAL', ...args);
        }
    }
}
