import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesService {
  getHello(): string {
    return 'Hello Movies!';
  }
}
