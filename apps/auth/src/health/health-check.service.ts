import { APP } from '@app/common/constants/events';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as amqp from 'amqplib';

@Injectable()
export class HealthCheckService {

  private readonly rabbitMQUrl = process.env.RABBIT_MQ_URI;
  private readonly queueName = APP.AUTH_SERVICE

  constructor(
    @InjectConnection() private readonly connection: Connection) { 
    }

  checkDatabaseHealth(): boolean {
    // Check the readyState of the MongoDB connection
    const isDatabaseHealthy = this.connection.readyState === 1; // 1 means 'connected'
    return isDatabaseHealthy;
  }


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
