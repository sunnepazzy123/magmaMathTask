import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { connectMicroservicesQueues } from '@app/common/utils';
import { Queues } from './constants';


async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  connectMicroservicesQueues(app, Queues);
}
bootstrap();
