import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../helpers/logger.service'; // Adjust path if needed

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const elapsedTime = Date.now() - startTime;
      this.loggerService.log(
        `${method} ${originalUrl} ${statusCode} - ${elapsedTime}ms`
      );
    });

    next();
  }
}
