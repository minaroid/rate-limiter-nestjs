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
    const apiKeyData = await this.service.isValidApiKey(apiKey);
    if (!apiKeyData) {
      throw new UnauthorizedException('Invalid api key.');
    }
    const hasTokens = await this.service.take(apiKey, apiKeyData);
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
