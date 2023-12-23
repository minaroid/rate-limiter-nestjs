import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from './rate-limiter.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(private readonly service: RateLimiterService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.query['apiKey'] as string;
    const isValidApiKey = await this.service.isValidApiKey(apiKey);
    if (!isValidApiKey) {
      throw new UnauthorizedException('Invalid api key.');
    }
    const hasTokens = await this.service.take(apiKey);
    if (hasTokens) {
      next();
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded.',
        },
        429,
      );
    }
  }
}
