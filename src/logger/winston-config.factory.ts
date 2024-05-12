import { ConfigService } from '@nestjs/config';
import { transports as winstonTransports, format } from 'winston';
import 'winston-daily-rotate-file'; 

const serviceLogFormat =  format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}:  [ ${message} ]~~`;
});

export const WinstonConfigFactory = async (configService: ConfigService) => {
    return {
        level: 'debug',
        format: format.combine(
            format(info => {
                info.level = info.level.toUpperCase();
                return info;
            })(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.prettyPrint(),
            format.splat(),
            serviceLogFormat,
        ),
        transports: [
            new winstonTransports.Console(),
            new winstonTransports.DailyRotateFile({
                filename: `logs/%DATE%-error.log`, 
                level: 'error',
                format: format.combine(format.timestamp(), format.json()),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false, // don't want to zip our logs
                maxFiles: '30d', // will keep log until they are older than 30 days
            })
            // new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
        exitOnError: false
    };
};