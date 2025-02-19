import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';

@Injectable()
export class LoggerService {
    private logger: winston.Logger;

    constructor() {
        const transport = new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        });

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json() // Logs in JSON format for structured analysis
            ),
            transports: [
                transport, // Rotated log files
                new winston.transports.Console(), // Console logs for development
                new LokiTransport({
                    host: 'http://localhost:3100', // Loki endpoint
                    labels: { app: 'nestjs-app', environment: 'development' }, // Queryable labels
                    json: true,
                    batching: true,
                }),
            ],
        });
    }

    log(message: string, meta?: Record<string, unknown>) {
        this.logger.info(message, { meta });
    }

    error(message: string, meta?: Record<string, unknown>) {
        // this.logger.error(message, { meta });
    }

    warn(message: string, meta?: Record<string, unknown>) {
        // this.logger.warn(message, { meta });
    }
}
