import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  picture?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(32)
  displayName?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
