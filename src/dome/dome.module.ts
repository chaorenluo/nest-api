import { Module } from '@nestjs/common';
import { DomeController } from './dome.controller';
import { DomeService } from './dome.service';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [ConfigModule],
    controllers: [DomeController],
    providers: [DomeService],
})
export class DomeModule {}
