import { createLogger, format,level, transports }  from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, align } = format; 

class MyLogger{
    logger;
    constructor(){
        const formatPrint = printf(
            ({level, message, context, requestId, timestamp, metadata})=>{
                return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
            }
        )
        this.logger = createLogger({
            format:combine(timestamp({format: 'YYYY-MM-DD hh:mm:ss'}), formatPrint),
            transports:[
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname:'src/logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format:combine(timestamp({format: 'YYYY-MM-DD hh:mm:ss'}), formatPrint),
                    level: 'info',
                }),
                new transports.DailyRotateFile({
                    dirname:'src/logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format:combine(timestamp({format: 'YYYY-MM-DD hh:mm:ss'}), formatPrint),
                    level: 'error',
                })
            ]
        })
    }
    log(message: string, params: {}){
        const logObject = Object.assign({message}, params)
        this.logger.info(logObject)
    }
    error(message: string, params: {}){
        const logObject = Object.assign({message}, params)
        this.logger.error(logObject)
    }
}
export default new MyLogger()