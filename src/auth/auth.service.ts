import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import globalErrorCodes from 'constants/globalErrorCodes';
import { UserService } from 'src/user/user.service';
import { SignInResponse } from './dto/signInResponse.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private usersService: UserService,
        private jwtService: JwtService
        ) {}

    async signIn(email: string, pass: string): Promise<SignInResponse> {
        const user = await this.usersService.getUserByEmail(email);
        if (!user || user.password !== pass) {
          throw new UnauthorizedException("Invalid email or password", globalErrorCodes.invalidEmailOrPassowrd);
        }
        const { password,id, ...result } = user;
        const payload = { sub: id, email: result.email };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            userId: id,
            ...result,
            accessToken
        };
      }
}
