import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { setup } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setup(app);
  await app.listen(config.port, config.host);
}
void bootstrap();
