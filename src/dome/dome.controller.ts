import { Controller, Get } from '@nestjs/common';
import { DomeService } from './dome.service';

@Controller()
export class DomeController {
    constructor(private readonly domeService: DomeService) {}

    @Get()
    getHello(): string {
        return this.domeService.getHello();
    }
}
