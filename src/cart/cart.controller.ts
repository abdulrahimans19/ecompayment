import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';
import { UpdateCart } from './interface/updateCart';
import { UpdateCartDto } from './dto/update';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Roles('user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  create(@Request() req, @Body() productDetails: CartDto) {
    const user_id = req.user.userId;

    return this.cartService.create(user_id, productDetails);
  }

  @Get('')
  @Roles('user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  viewCart(@Request() req) {
    const user_id = req.user.userId;
    return this.cartService.viewCart(user_id);
  }

  @Put(':id')
  @Roles('user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  update(
    @Request() req,
    @Param('id') cart_id,
    @Body() updateData: UpdateCartDto,
  ): Promise<UpdateCart> {
    const current_user_id = req.user.userId;
    return this.cartService.updateCart(current_user_id, cart_id, updateData);
  }

  @Delete(':id')
  @Roles('user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  delete(@Request() req, @Param('id') id, @Body() body) {
    const current_user_id = req.user.userId;
    return this.cartService.deleteCart(current_user_id, id, body);
  }

  @Get('totalamount/:id')
  @Roles('user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  totalAmount(@Request() req, @Param('id') id) {
    const current_user_id = req.user.userId;
    return this.cartService.calculateTotalAmount(current_user_id, id);
  }
}
