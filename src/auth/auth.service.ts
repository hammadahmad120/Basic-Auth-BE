import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInResponse } from './dto/signInResponse.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/dto/user.dto';
import { registerRequest } from './dto/registerRequest.dto';

@Injectable()
export class AuthService {
  private errorCodes = {
    invalidEmailOrPassword: 'INVALID_EMAIL_OR_PASSWORD',
  };

  constructor(
    private configService: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<SignInResponse> {
    const user = await this.usersService.authenticateUser(email, pass);
    if (!user) {
      throw new BadRequestException(
        'Invalid email or password',
        this.errorCodes.invalidEmailOrPassword,
      );
    }
    const { id, ...result } = user;
    const payload = { sub: id, email: result.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId: id,
      ...result,
      accessToken,
    };
  }

  async registerUser(registerDto: registerRequest): Promise<User> {
    return await this.usersService.createUser(registerDto);
  }

  async getLoggedInUser(email: string): Promise<User> {
    return await this.usersService.getUserByEmail(email);
  }
}
