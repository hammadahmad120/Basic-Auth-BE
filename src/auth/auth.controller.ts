import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequest } from './dto/signInRequest.dto';
import { SignInResponse } from './dto/signInResponse.dto';
import { AuthGuard } from 'helpers/auth.guard';
import { User } from 'src/user/dto/user.dto';
import { registerRequest } from './dto/registerRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInRequest): Promise<SignInResponse> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  async registerUser(@Body() registerDto: registerRequest): Promise<User> {
    return await this.authService.registerUser(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getLoggedInUser(@Request() req): Promise<User> {
    return await this.authService.getLoggedInUser(req.user.email);
  }
}
