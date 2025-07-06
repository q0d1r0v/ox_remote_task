import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [PrismaModule, AuthModule, CompanyModule, ProductModule],
})
export class AppModule {}
