import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
} from '@app/common/dto/create-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { APP, AUTH_REQUESTS, } from '@app/common/constants/events';
import { randomBytes } from 'crypto';
import { hashPassword } from '@app/common/utils';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(APP.NOTIFICATION_SERVICE) private readonly authClient: ClientProxy, // Inject RMQ Client
  ) {}


  async getUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const users = await this.userModel.find().skip(skip).limit(limit);
      const total = await this.userModel.countDocuments();
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: users,
      };
    } catch(error) {
      if (error instanceof RpcException) {
        throw error; // Re-throw existing RpcException
      }

      throw new RpcException({
        status: 500,
        message: 'An unexpected error occurred while fetching the users',
      });
    }
  }


  async getUser(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new RpcException({
          status: 404,
          message: `User with ID ${id} not found`,
        });
      }

      return user;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error; // Re-throw existing RpcException
      }

      throw new RpcException({
        status: 500,
        message: 'An unexpected error occurred while fetching the user',
      });
    }
  }

  async createUser(payload: CreateUserDto) {
    try {
      let customer = await this.userModel.findOne({ email: payload.email });
      if (customer) {
        throw new RpcException({
          status: 404,
          message: 'Customer already exist',
        });
      }
      //generate a salt and hash
      const salt = randomBytes(8).toString('hex');
      const { saltHash } = await hashPassword(payload.password, salt);
      payload.password = saltHash;
      customer = await this.userModel.create(payload);
      customer = await customer.save();
      this.authClient.emit(AUTH_REQUESTS.POST_USERS, customer);
      return customer;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: 'An unexpected error occurred while creating the user',
      });
    }
  }

  async updateUserById(user: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user.id,
        { $set: user }, // Update only the provided fields
        { new: true }, // Return the updated document
      );
  
      if (!updatedUser) {
        throw new RpcException({
          status: 404,
          message: 'user not found',
        });
      }
  
      return updatedUser;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: `An unexpected error occurred while updating the user ${user.id}`,
      });
    }
  }

  async deleteUserById(id: Types.ObjectId) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new RpcException({
          status: 404,
          message: `User with ID ${id} not found`,
        });
      }
      this.authClient.emit(AUTH_REQUESTS.DELETE_USER_BY_ID, deletedUser);
      return `User with ID ${deletedUser._id} deleted successfully`;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: `An unexpected error occurred while deleting the user ${id}`,
      });
    }
  }
}
