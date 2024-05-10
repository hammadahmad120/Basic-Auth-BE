// Copyright 2019-2022 Afiniti, Inc.

import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly configService: ConfigService,
    ) {}

    log(level:string, message: any, ...meta: any[]) {
        this.logger.log(level, `${message}`, ...meta);
    }

    error(message: any, ...meta: any[]){
        this.logger.error(`${message}`, ...meta);
    }

    warn(message: any, ...meta: any[]){
        this.logger.warn(`${message}`, ...meta);
    }

    info(message: any, ...meta: any[]) {
        this.logger.info(`${message}`, ...meta);
    }

    http(message: any, ...meta: any[]) {
        this.logger.http(`${message}`, ...meta);
    }

    verbose(message: any, ...meta: any[]) {
        this.logger.verbose(`${message}`, ...meta);
    }

    debug(message: any, ...meta: any[]) {
        this.logger.debug(`${message}`, ...meta);
    }

    silly(message: any, ...meta: any[]) {
        this.logger.silly(`${message}`, ...meta);
    }

}