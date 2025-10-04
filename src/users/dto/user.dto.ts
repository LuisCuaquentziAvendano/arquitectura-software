import { Types } from 'mongoose';

export class UserDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
}
