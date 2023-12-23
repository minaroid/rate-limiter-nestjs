import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { RateLimiterMiddleware } from 'src/rate-limit/rate-limiter.middleware';
import { RateLimiterService } from 'src/rate-limit/rate-limiter.service';

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [MoviesService, RateLimiterService],
})
export class MoviesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/');
  }
}
