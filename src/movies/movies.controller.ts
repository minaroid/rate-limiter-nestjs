import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
  constructor(private readonly service: MoviesService) {}

  @Get('list')
  movies(): string {
    return this.service.getHello();
  }
}
