import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: `./apps/auth/.env.${getEnvironment()}`,
    }),
    DatabaseModule,
    LoggerModule,
    RmqModule.register({
      name: APP.AUTH_SERVICE,
    }),
    RmqModule.register({
      name: APP.NOTIFICATION_SERVICE,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, HealthCheckService],
})
export class AuthModule {
}
