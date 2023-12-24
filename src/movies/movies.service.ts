import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesService {
  list(): any[] {
    return [{ title: 'movie 1' }, { title: 'movie 2' }];
  }
}
