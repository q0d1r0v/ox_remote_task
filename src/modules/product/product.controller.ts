import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ManagerOnly } from '../../common/decorators/manager-only.decorator';
import { ProductService } from './product.service';
import { ProductQueryDto } from '../../shared/dto/products/product.dto';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';

@Controller('api')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  @ManagerOnly()
  @UseGuards(JwtAuthGuard)
  async getProducts(
    @Query() query: ProductQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ReturnType<typeof this.productService.getProducts>> {
    const { page, size } = query;
    const userId = req.user.sub;
    return this.productService.getProducts(userId, page, size);
  }
}
