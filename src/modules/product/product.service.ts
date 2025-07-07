import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { PrismaClient } from '@prisma/client';

interface ProductResponse {
  data: any[];
  total_count: number;
  page: number;
}

@Injectable()
export class ProductService {
  private readonly prisma = new PrismaClient();

  async getProducts(
    userId: number,
    page: number,
    size: number,
  ): Promise<ProductResponse> {
    if (size > 20) {
      throw new BadRequestException('size 20 dan katta bo‘lmasligi kerak');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { companies: true },
    });

    if (!user || !user.companies.length) {
      throw new UnauthorizedException(
        'Foydalanuvchi kompaniyaga biriktirilmagan',
      );
    }

    const company = user.companies[0];

    if (!company.subdomain || !company.token) {
      throw new UnauthorizedException('OX token yoki subdomain topilmadi');
    }

    const { subdomain, token } = company;

    let response: AxiosResponse<ProductResponse>;
    try {
      response = await axios.get<ProductResponse>(
        `https://${subdomain}.ox-sys.com/variations`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: String(token),
          },
          params: { page, size },
        },
      );
    } catch {
      throw new UnauthorizedException('OX API bilan ulanishda xatolik');
    }

    return response.data;
  }
}
