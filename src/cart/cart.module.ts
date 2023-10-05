import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchmea } from './schema/cart.schema';
import { CartService } from './cart.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchmea }
    ])
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}