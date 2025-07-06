import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [ProductController],
  providers: [ProductService, JwtAuthGuard, RolesGuard],
})
export class ProductModule {}
