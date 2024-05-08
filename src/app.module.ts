import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot({
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
  entities: [User]
}),
UserModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
