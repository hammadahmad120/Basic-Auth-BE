import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigFactory } from './logger/winston-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get<string>('MONGODB_HOST'),
        port: configService.get<number>('MONGODB_PORT'),
        database: configService.get<string>('MONGODB_NAME'),
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: WinstonConfigFactory,
      inject: [ConfigService],
  }),
    UserModule,
    AuthModule,
    LoggerModule
  ],
})
export class AppModule {}
