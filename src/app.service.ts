import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  heath() {
    return {
      status: 'ok',
    };
  }
}
