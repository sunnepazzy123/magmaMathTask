import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: { name: string }): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => {
              console.log(`${name} queue registered`);
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get<string>('RABBIT_MQ_URI')],
                  queue: name,
                  durable: true,
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
