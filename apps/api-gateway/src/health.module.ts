import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { RmqModule } from '@app/common';
import { APP } from '@app/common/constants/events';

@Module({
  imports: [
    RmqModule.register({
      name: APP.AUTH_SERVICE,
    }),
    RmqModule.register({
      name: APP.NOTIFICATION_SERVICE,
    })
  ], // Add HttpModule to imports
  controllers: [HealthController],
})
export class HealthModule { }
