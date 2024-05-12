import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { SignInResponse } from './dto/signInResponse.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/dto/user.dto';
import { registerRequest } from './dto/registerRequest.dto';
import { response } from 'express';

@Injectable()
export class AuthService {
  private errorCodes = {
    invalidEmailOrPassword: 'INVALID_EMAIL_OR_PASSWORD',
    invalidCaptcha: "INVALID_CAPTCHA"
  };

  constructor(
    private configService: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string, recaptchaToken: string): Promise<SignInResponse> {
    const isHuman = await this.validateHuman(recaptchaToken);
    if(!isHuman){
      throw new BadRequestException(
        'Captcha validation failed',
        this.errorCodes.invalidCaptcha,
      );
    }
    const user = await this.usersService.authenticateUser(email, pass);
    if (!user) {
      throw new BadRequestException(
        'Invalid email or password',
        this.errorCodes.invalidEmailOrPassword,
      );
    }
    const { userId, ...result } = user;
    const payload = { sub: userId, email: result.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId,
      ...result,
      accessToken,
    };
  }

  async registerUser(registerDto: registerRequest): Promise<SignInResponse> {
    const isHuman = await this.validateHuman(registerDto.recaptchaToken);
    if(!isHuman){
      throw new BadRequestException(
        'Captcha validation failed',
        this.errorCodes.invalidCaptcha,
      );
    }
    const registeredUser =  await this.usersService.createUser(registerDto);
    const { userId, ...result } = registeredUser;
    const payload = { sub: userId, email: result.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId,
      ...result,
      accessToken,
    };

  }

  async getLoggedInUser(email: string): Promise<User> {
    return await this.usersService.getUserByEmail(email);
  }

  private async validateHuman(token: string): Promise<Boolean>{
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    if(!secretKey) return true;
    const recaptchaBody = {
      secret: secretKey,
        response: token
    }
    try{
      const res = await axios.post('https://www.google.com/recaptcha/api/siteverify?' + new URLSearchParams(recaptchaBody));
      if(res.data?.success && res.data?.score >= 0.5) return true;
      return false;
    }catch(err){
      return false;
    }
  }

}
