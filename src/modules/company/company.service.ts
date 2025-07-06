import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaClient, Role } from '@prisma/client';

@Injectable()
export class CompanyService {
  private prisma = new PrismaClient();

  async registerCompany(userId: number, subdomain: string, oxToken: string) {
    try {
      // OX API bilan tekshirish
      const res = await axios.get(`https://${subdomain}.ox-sys.com/profile`, {
        headers: {
          Accept: 'application/json',
          Authorization: oxToken,
        },
      });

      if (!res.data) throw new UnauthorizedException('Token noto‘g‘ri');

      // Kompaniya mavjudmi?
      const existing = await this.prisma.company.findUnique({
        where: { subdomain },
      });

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');

      if (!existing) {
        await this.prisma.company.create({
          data: {
            subdomain,
            users: {
              connect: { id: userId },
            },
          },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            role: Role.ADMIN,
          },
        });

        return { message: 'Yangi kompaniya yaratildi va siz admin bo‘ldingiz' };
      } else {
        await this.prisma.company.update({
          where: { subdomain },
          data: {
            users: {
              connect: { id: userId },
            },
          },
        });

        return { message: 'Siz kompaniyaga manager sifatida biriktirildingiz' };
      }
    } catch {
      throw new UnauthorizedException(
        'OX token valid emas yoki subdomain xato',
      );
    }
  }

  async deleteCompany(companyId: number, userId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Kompaniya topilmadi');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Faqat adminlar o‘chira oladi');
    }

    const isLinked = company.users.some((u) => u.id === userId);
    if (!isLinked) {
      throw new ForbiddenException('Bu kompaniyani siz qo‘shmagansiz');
    }

    await this.prisma.company.delete({
      where: { id: companyId },
    });

    return { message: 'Kompaniya o‘chirildi' };
  }
}
