import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { APP, AUTH_REQUESTS } from '@app/common/constants/events';
import { LoggerService } from '@app/common/helpers/logger.service';
import { HealthCheckService } from './health/health-check.service';

@Controller()
export class NotificationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly healthCheckService: HealthCheckService
  ) {}

  @EventPattern(AUTH_REQUESTS.POST_USERS) // Listen for the 'user.created' event
  async handleUserCreated(@Payload() user: any, @Ctx() context: any) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      channel.ack(originalMsg);
      this.logger.log("message is ack and user is created", user)
    } catch (error) {
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern(AUTH_REQUESTS.DELETE_USER_BY_ID) // Listen for the 'user.deleted' event
  async handleUserDeleted(@Payload() user: any, @Ctx() context: any) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      channel.ack(originalMsg);
      this.logger.log("message is ack and user is deleted", user)
    } catch (error) {
      channel.nack(originalMsg, false, true);
    }
  }

    @MessagePattern(APP.NOTIFICATION_SERVICE)
    async checkHealth() {
      const queueHealthy = this.healthCheckService.checkQueueHealth();
  
      if (queueHealthy) {
        return { status: 'ok', message: 'notification queue services are healthy!' };
      } else {
        return { status: 'error', message: 'notification queue services are down' };
      }
    }
}
