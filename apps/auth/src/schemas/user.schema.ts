import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const UserSchemaClass = SchemaFactory.createForClass(User);

export const UserSchema = UserSchemaClass.set('toJSON', {
  versionKey: false, // Exclude the __v field when converting to JSON
  transform: (doc, ret) => {
    delete ret.password;  // Remove the password field
    return ret;
  }
});
