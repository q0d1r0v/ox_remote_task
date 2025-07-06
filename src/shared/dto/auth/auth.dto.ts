import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email maydoni majburiy' })
  @IsEmail({}, { message: 'Email noto‘g‘ri formatda kiritilgan' })
  email: string;
}
export class VerifyDto {
  @IsNotEmpty({ message: 'Email maydoni majburiy' })
  @IsEmail({}, { message: 'Email noto‘g‘ri formatda kiritilgan' })
  email: string;

  @IsNotEmpty({ message: 'OTP majburiy' })
  otp: string;
}
