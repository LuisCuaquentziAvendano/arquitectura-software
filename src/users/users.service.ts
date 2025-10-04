import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/repositories/user.repository';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly ENCRYPTION_ROUNDS = 10;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
  ) {}

  async signup(userData: SignupDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ email: userData.email });
    if (user) throw new BadRequestException('Email already registered');
    const hashedPassword = await hash(
      userData.password,
      this.ENCRYPTION_ROUNDS,
    );
    const createdUser = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
    return this.userModelToDto(createdUser);
  }

  async login(userData: LoginDto): Promise<JwtTokenDto> {
    const user = await this.userRepository.findOne({ email: userData.email });
    if (!user) throw new UnauthorizedException('Email not registered');
    const validPassword = await compare(userData.password, user.password!);
    if (!validPassword) throw new UnauthorizedException('Invalid password');
    const payload: JwtPayloadDto = { userId: user.id as string };
    return { authorization: this.jwtService.sign(payload) };
  }

  private userModelToDto(userModel: User): UserDto {
    return {
      _id: userModel._id!,
      name: userModel.name,
      email: userModel.email,
    };
  }
}
