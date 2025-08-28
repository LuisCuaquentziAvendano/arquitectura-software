import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { UserDto } from './dto/user-dto';
import { UsersService } from './users.service';

@Controller('api/v1/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body() userData: SignupDto): Promise<UserDto> {
    return this.usersService.signup(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userData: LoginDto): Promise<JwtTokenDto> {
    return this.usersService.login(userData);
  }
}
