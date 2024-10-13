import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder().setTitle('Url Shortener').setDescription('Api for URL Shortener Application').setVersion('0.5.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);
  console.log('Testing github actions (SHOULD FAIL)');
  await app.listen(3000);
}
bootstrap();
