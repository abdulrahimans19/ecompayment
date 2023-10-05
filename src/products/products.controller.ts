import {
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { addProductDto } from './dto/create';
import { updateProductDto } from './dto/update';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Products } from './schema/product.schema';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { multerConfig } from 'src/multer/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  @HttpCode(201)
  async getAllBooks(@Query() query: ExpressQuery): Promise<Products[]> {
    return this.productService.findAll(query);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image_url', multerConfig))
  async create(@UploadedFile() file: any, @Body() addProduct: addProductDto) {
    return await this.productService.createProduct(addProduct, file);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  @HttpCode(201)
  async getProduct(@Param('id') id: string): Promise<Products> {
    return this.productService.getProductById(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  @HttpCode(201)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProduct: updateProductDto,
  ): Promise<{ message: string; result: Products; success: boolean }> {
    return await this.productService.updateById(id, updateProduct);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  @HttpCode(201)
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<{ message: string; success: boolean }> {
    return this.productService.deleteProductById(id);
  }
}
