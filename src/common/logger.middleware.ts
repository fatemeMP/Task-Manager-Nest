import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    this.logger.log(`➡️  ${method} ${originalUrl} — شروع شد`);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const message = `⬅️  ${method} ${originalUrl} → ${statusCode} (${duration}ms)`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}