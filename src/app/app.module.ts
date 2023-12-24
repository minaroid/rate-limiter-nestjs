import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from 'src/movies/movies.module';
import { RouterModule } from '@nestjs/core';
import { RedisModule } from 'src/redis/redis.module';
import { RateLimiterMiddleware } from 'src/rate-limit/rate-limiter.middleware';
import { RateLimiterService } from 'src/rate-limit/rate-limiter.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/movies',
        module: MoviesModule,
      },
    ]),
    forwardRef(() => MoviesModule),
    forwardRef(() => RedisModule),
  ],
  controllers: [AppController],
  providers: [AppService, RateLimiterService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('/movies');
  }
}
