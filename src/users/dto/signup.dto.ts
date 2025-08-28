import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  name: string;

  @IsEmail()
  @MaxLength(1024)
  email: string;

  @IsStrongPassword()
  @MaxLength(1024)
  password: string;
}
