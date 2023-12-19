import { Module } from '@nestjs/common';
import { LoggerService } from 'commons/public-module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
    controllers: [CategoryController],
    providers: [CategoryService, LoggerService],
})
export class CategoryModule {}
