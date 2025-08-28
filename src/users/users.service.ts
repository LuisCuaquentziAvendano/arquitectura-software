import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/repositories/user.repository';
import { Model } from 'mongoose';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
  ) {}

  async signup(userData: SignupDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (user) throw new BadRequestException('Email already registered');
    const createdUser = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return this.userModelToDto(createdUser);
  }

  login(userData: LoginDto): JwtTokenDto {
    const payload = { sub: userData.email };
    return { authorization: this.jwtService.sign(payload) };
  }

  private userModelToDto(userModel: User): UserDto {
    return {
      name: userModel.name,
      email: userModel.email,
    };
  }
}
