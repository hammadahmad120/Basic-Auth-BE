import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    private errorCodes = {
        invalidJwt: "INVALID_JWT"
    }
    constructor(private jwtService: JwtService, private configService: ConfigService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException("Invalid or expired token",this.errorCodes.invalidJwt);
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET')
          }
        );
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException("Invalid or expired token",this.errorCodes.invalidJwt);
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }