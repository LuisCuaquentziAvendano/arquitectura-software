import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const PORT = process.env.PORT!;
  await app.listen(PORT);
  console.log(`Running app in ${PORT}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
