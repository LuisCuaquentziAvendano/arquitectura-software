import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(1024)
  email: string;

  @IsStrongPassword()
  @MaxLength(1024)
  password: string;
}
