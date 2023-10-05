import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/order.dto';
import Stripe from 'stripe';
import { OrderHistoryDto } from './dto/history.dto';

@Injectable()
export class OrderService {
  private readonly stripe;

  constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) {
    this.stripe = new Stripe(process.env.SECRET_kEY, {
      apiVersion: '2023-08-16',
    });
    
  }
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { totalAmount, user_id, product_id } = createOrderDto;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'usd',
        description: 'Payment for Order',
      });
      if (paymentIntent.status === 'succeeded') {
        const createdOrder = new this.orderModel({
          user_id,
          product_id,
          totalAmount,
          payment_status: 'succeeded',
        });
        await createdOrder.save();
        return createdOrder;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOrderHistory(orderHistoryDto: OrderHistoryDto): Promise<Order[]> {
    const { user_id } = orderHistoryDto;
    return this.orderModel.find({ user_id }).exec();
  }
}
