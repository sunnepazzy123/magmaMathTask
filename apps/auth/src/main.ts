import { NestFactory } from '@nestjs/core';
import { connectMicroservicesQueues } from '@app/common/utils';
import { AuthModule } from './auth.module';
import { Queues } from './constants';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  connectMicroservicesQueues(app, Queues);
}
bootstrap();
