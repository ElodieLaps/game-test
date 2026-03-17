import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/modules/auth/auth.module';
import { CharacterModule } from '@characters/characters.module';
import { TeamModule } from '@src/modules/teams/teams.module';
import { UserModule } from '@users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from '@inventories/inventories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../modules/**/*.entity.js'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'), // to disable in production
        ssl: { rejectUnauthorized: false },
      }),
    }),
    UserModule,
    AuthModule,
    CharacterModule,
    TeamModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
