import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(private readonly jwtService: JwtService) {}

  async login(email: string) {
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          role: Role.MANAGER,
        },
      });
    }

    const otp = this.generateOtp();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minute

    await this.prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry: expiry,
      },
    });

    return { otp, message: 'for test with otp code' };
  }

  async verify(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isExpired = !user.otpExpiry || user.otpExpiry < new Date();

    if (user.otp !== otp || isExpired) {
      throw new UnauthorizedException('OTP noto‘g‘ri yoki eskirgan');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    return { access_token: token };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali OTP
  }
}
