import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterCompanyDto } from '../../shared/dto/register-company/register-company.dto';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Request } from 'express';
import { AdminOnly } from 'src/common/decorators/admin-only.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    email: string;
    iat?: number;
    exp?: number;
  };
}

@Controller('api')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register-company')
  async registerCompany(
    @Body() body: RegisterCompanyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.companyService.registerCompany(
      userId,
      body.subdomain,
      body.token,
    );
  }

  @Delete('delete-company/:id')
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  async deleteCompany(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.companyService.deleteCompany(id, userId);
  }
}
