import { CharacterService } from '@app/character/character.service';
import { TeamService } from '@app/team/team.service';
import { UserService } from '@app/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Character } from '@app/character/character.entity';
import { Team } from '@app/team/team.entity';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, Team, Character]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
