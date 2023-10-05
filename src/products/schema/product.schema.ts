import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Products {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ default: 10 })
  count: number;

  @Prop()
  image_url: string;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
