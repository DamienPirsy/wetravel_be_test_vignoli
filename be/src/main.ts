import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger); 
  app.enableCors({
    origin: `${process.env.FE_URL}`
  });
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
