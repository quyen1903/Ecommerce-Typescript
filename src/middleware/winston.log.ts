import { createLogger, format, transports }  from 'winston'
const { combine, timestamp, printf, align } = format;

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
        align(),
        printf(info=> `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or higher to `error.log`
        //   (i.e., error, fatal, but not other levels)
        new transports.Console,
        new transports.File({ dirname: 'logs',filename: 'test.log' }),
        //
        // - Write all logs with importance level of `info` or higher to `combined.log`
        //   (i.e., fatal, error, warn, and info, but not trace)
    ],
});