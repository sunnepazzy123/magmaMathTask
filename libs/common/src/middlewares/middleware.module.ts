import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpLoggerMiddleware } from '@app/common/middlewares/httpLogger.middleware';
import { LoggerModule } from '../helpers/logger.module';

@Module({
    imports: [LoggerModule],
    providers: [HttpLoggerMiddleware],
    exports: [HttpLoggerMiddleware],
})
export class MiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    }
}
