import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './interface/cartInterface';
import { Model } from 'mongoose';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CartDto } from './dto/cart.dto';
import { UpdateCart } from './interface/updateCart';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async create(id: string, productDetails: CartDto): Promise<Cart> {
    const newCart = new this.cartModel({
      user_id: id,
      items: productDetails.items,
    });

    await newCart.save();

    for (const item of newCart.items) {
      await this.cartModel.populate(item, {
        path: 'product_id',
        select: 'title price',
      });
    }

    return newCart;
  }

  async viewCart(id: string): Promise<Cart[]> {
    return await this.cartModel.find({ user_id: id });
  }

  async updateCart(
    curent_user_id: string,
    cartId: string,
    updateData: UpdateCart,
  ): Promise<any> {
    const cart = await this.cartModel.findById(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    if (cart.user_id.toString() !== curent_user_id.toString()) {
      throw new ForbiddenException(
        "You don't have permission to access this cart",
      );
    }

    const { itemIndex, newCount } = updateData;

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      throw new HttpException('Invalid item index', HttpStatus.BAD_REQUEST);
    }

    cart.items[itemIndex].count = newCount;

    const updatedCart = await cart.save();

    return updatedCart;
  }

  async deleteCart(current_user_id: string, cartId: string, itemIndex: number) {
    const cart = await this.cartModel.findById(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    if (cart.user_id.toString() !== current_user_id.toString()) {
      throw new ForbiddenException(
        "You don't have permission to access this cart",
      );
    }
 
    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      throw new HttpException('Invalid item index', HttpStatus.BAD_REQUEST);
    }

    cart.items.splice(itemIndex, 1);

    const result = await cart.save();

    return cart;
  }

  async calculateTotalAmount(
    current_user_id: string,
    cartId: string,
  ): Promise<any> {
    const cart = await this.cartModel
      .findOne({ _id: cartId })
      .populate('items.product_id', 'title price');

    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found.`);
    }

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    if (cart.user_id.toString() !== current_user_id.toString()) {
      throw new ForbiddenException(
        "You don't have permission to access this cart",
      );
    }
console.log(cart);


    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product_id.price;
    }, 0);

    return {
      current_user_id,
      totalAmount,
    };
  }
}
