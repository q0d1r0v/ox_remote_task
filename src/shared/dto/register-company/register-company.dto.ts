import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  subdomain: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
