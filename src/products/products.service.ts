import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { Products } from './schema/product.schema';
import { addProductDto } from './dto/create';
import { updateProductDto } from './dto/update';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name)
    private productModel: mongoose.Model<Products>,
  ) {}

  async findAll(query: Query): Promise<Products[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const products = await this.productModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return products;
  }

  async createProduct(addProduct: addProductDto, file: any): Promise<Products> {
    try {
      const { title, description, price, count } = addProduct;
      const createdProductInDB = new this.productModel({
        title,
        description,
        count,
        price,
        image_url: file.originalname,
      }); 
      return await createdProductInDB.save();
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string): Promise<Products> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    id: string,
    updateProduct: updateProductDto,
  ): Promise<{ message: string; result: Products; success: boolean }> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProduct, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }

      return {
        message: 'Product updated successfully',
        result: updatedProduct,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update product');
    }
  }

  async deleteProductById(
    id: string,
  ): Promise<{ message: string; success: boolean }> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'Product deleted successfully',
      success: true,
    };
  }
}
