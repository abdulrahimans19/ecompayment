// order/schemas/order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  payment_status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
