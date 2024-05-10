// Copyright 2019-2022 Afiniti, Inc.

import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService]
    
})
export class LoggerModule {}
