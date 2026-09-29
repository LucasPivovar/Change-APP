import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { config } from './config';

export function setup(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use((_req: unknown, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.enableCors({ origin: config.corsOrigin, methods: ['GET', 'POST', 'DELETE'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableShutdownHooks();
}
