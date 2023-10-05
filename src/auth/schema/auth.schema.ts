import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum userRoles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;
  @Prop({ unique: [true, 'Duplicate email'] })
  email: string;
  @Prop()
  password: string;
  @Prop({
    type: String,
    required: true,
    default: userRoles.USER,
    enum: [userRoles.ADMIN, userRoles.USER],
  })
  roles: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
