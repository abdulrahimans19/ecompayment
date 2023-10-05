import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Products } from 'src/products/schema/product.schema';

@Schema({
  timestamps: true,
})
export class Cart extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop([
    {
      count: { type: Number },
      product_id: { type: SchemaTypes.ObjectId, ref: Products.name },
    },
  ])
  items: Array<{
    count: number;
    product_id: Types.ObjectId;
  }>;
}

export const CartSchmea = SchemaFactory.createForClass(Cart);
