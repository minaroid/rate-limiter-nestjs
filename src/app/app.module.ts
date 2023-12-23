import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from 'src/movies/movies.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/movies',
        module: MoviesModule,
      },
    ]),
    forwardRef(() => MoviesModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
