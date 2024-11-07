import { IsNotEmpty, IsString } from 'class-validator';

export class VerificatonDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
