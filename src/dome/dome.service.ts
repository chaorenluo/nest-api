import { Injectable } from '@nestjs/common';

@Injectable()
export class DomeService {
    getHello(): string {
        return 'Hello World!';
    }
}
