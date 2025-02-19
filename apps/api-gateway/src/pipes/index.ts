import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<string, Types.ObjectId>
{
  transform(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    const parseValue = new mongoose.Types.ObjectId(value);
    return parseValue;
  }
}
