import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import type { SuccessResponseDto } from 'src/types/http-ok-response';
import { OK_MESSAGE } from 'src/types/http-ok-response';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() userData: SignupDto): SuccessResponseDto {
    this.authService.signup(userData);
    return OK_MESSAGE;
  }

  @Post('login')
  login(@Body() userData: LoginDto): JwtTokenDto {
    return this.authService.login(userData);
  }
}
