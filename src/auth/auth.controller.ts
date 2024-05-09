import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequest } from './dto/signInRequest.dto';
import { SignInResponse } from './dto/signInResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInRequest): Promise<SignInResponse> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }
}
