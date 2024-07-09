import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  if (process.env.STAGE === 'dev') {
    app.enableCors();
  }
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
