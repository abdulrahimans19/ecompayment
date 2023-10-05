import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Roles('user')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('payment')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const createdOrder = await this.orderService.createOrder(createOrderDto);
      return createdOrder;
    } catch (error) {
      return { error: error.message };
    }
  }
  @Get('history/:user_id')
  getOrderHistory(@Param('user_id') user_id: string) {
    return this.orderService.getOrderHistory({ user_id });
  }
}
