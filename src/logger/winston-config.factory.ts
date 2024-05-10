// Copyright 2019-2022 Afiniti, Inc.

import { ConfigService } from '@nestjs/config';
import { transports as winstonTransports, format } from 'winston';

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
            //
            new winstonTransports.Console(),
            new winstonTransports.File({ filename: 'error.log', level: 'error' }),
            // new winston.transports.File({ filename: 'combined.log' }),
        ],
        exitOnError: false
    };
};