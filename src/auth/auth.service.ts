import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signup(userData: SignupDto): void {
    console.log(userData);
  }

  login(userData: LoginDto): JwtTokenDto {
    const payload = { sub: userData.email };
    return { authorization: this.jwtService.sign(payload) };
  }
}
