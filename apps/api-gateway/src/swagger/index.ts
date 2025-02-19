import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export const swaggerDoc = (app: NestExpressApplication) => {
  const TITLE = process.env.SWAGGER_DOC_TITLE || 'Ecommerce Management System (Microservice) Magmamath Task';

  const userConfig = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription('The Application API description')
    .setVersion('2.0')
    .addTag('Documentation')
    .setContact(
      'Sunday Odibo',
      'http://wiredevteam.com',
      'sunnepazzy123@gmail.com',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, userConfig);
  SwaggerModule.setup('api/docs', app, document);
};
