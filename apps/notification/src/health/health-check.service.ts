import { APP } from '@app/common/constants/events';
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class HealthCheckService {

  private readonly rabbitMQUrl = process.env.RABBIT_MQ_URI;
  private readonly queueName = APP.NOTIFICATION_SERVICE

  async checkQueueHealth(): Promise<boolean> {
    try {
      const connection = await amqp.connect(this.rabbitMQUrl);
      const channel = await connection.createChannel();

      // Check if the queue exists
      const queueInfo = await channel.checkQueue(this.queueName);
      await channel.close();
      await connection.close();

      return queueInfo ? true : false;
    } catch (error) {
      console.error('RabbitMQ Health Check Failed:', error);
      return false;
    }
  }

}
