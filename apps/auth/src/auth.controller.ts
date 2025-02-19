import { APP, AUTH_REQUESTS } from '@app/common/constants/events';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
} from '@app/common/dto/create-user.dto';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { HealthCheckService } from './health/health-check.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly healthCheckService: HealthCheckService,

  ) {}

  @MessagePattern(AUTH_REQUESTS.GET_USERS)
  async getUsers(@Payload() query: PaginationDto) {
    const users = this.authService.getUsers(query);
    return users;
  }

  @MessagePattern(AUTH_REQUESTS.GET_USER_BY_ID)
  async getUser(@Payload() id: Types.ObjectId) {
    const user = this.authService.getUser(id);
    return user;
  }

  @MessagePattern(AUTH_REQUESTS.POST_USERS)
  async createUser(@Payload() data: CreateUserDto) {
    const user = this.authService.createUser(data);
    return user;
  }

  @MessagePattern(AUTH_REQUESTS.PUT_USER_BY_ID)
  async updateUser(@Payload() data: UpdateUserDto) {
    const user = this.authService.updateUserById(data);
    return user;
  }

  @MessagePattern(AUTH_REQUESTS.DELETE_USER_BY_ID)
  async deleteUser(@Payload() id: Types.ObjectId) {
    const user = this.authService.deleteUserById(id);
    return user;
  }


  @MessagePattern(APP.AUTH_SERVICE)
  async checkHealth() {
    const databaseHealthy = this.healthCheckService.checkDatabaseHealth();
    const queueHealthy = this.healthCheckService.checkQueueHealth();

    if (databaseHealthy && queueHealthy) {
      return { status: 'ok', message: 'All services are healthy!' };
    } else {
      return { status: 'error', message: 'One or more services are down' };
    }
  }

}
