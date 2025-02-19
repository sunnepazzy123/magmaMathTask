import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
      }),
      envFilePath: `./apps/notification/.env.${getEnvironment()}`,
    }),
    RmqModule.register({
      name: APP.NOTIFICATION_SERVICE,
    }),
    LoggerModule
  ],
  controllers: [NotificationController],
  providers: [NotificationService, ConfigService, HealthCheckService],
})
export class NotificationModule { 
}
