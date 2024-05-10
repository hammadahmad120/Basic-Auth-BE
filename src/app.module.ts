import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: ['.env.local', '.env'],
    isGlobal: true,
}),
TypeOrmModule.forRoot({
  type: "mongodb",
  host: "127.0.0.1",
  port: 27017,
  database: "EG-App",
  synchronize: true,
  autoLoadEntities: true,
  entities: [UserEntity]
}),
UserModule,
AuthModule,
]
})
export class AppModule {}
