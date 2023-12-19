import {
    Controller,
    Get,
    Query,
    UseInterceptors,
    UseFilters,
} from '@nestjs/common';
import { ApiOperation } from 'commons/public-decorator';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import {
    CategoryCreateDto,
    CategoryCreateResponse,
    CategoryDelDto,
} from './category.entity';
import { AllExceptionFilter, TransformInterceptor } from 'commons/public-tool';
import { CategoryService } from './category.service';

@ApiTags('作品')
@Controller('category')
@UseInterceptors(TransformInterceptor)
@UseFilters(AllExceptionFilter)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('list')
    @ApiOperation('获取类别列表')
    async getCategoryList() {
        return this.categoryService.getCategoryList();
    }

    @Get('create')
    @ApiOperation('创建类别')
    @ApiBody({ type: CategoryCreateDto })
    @ApiResponse({ status: 200, type: CategoryCreateResponse })
    async createCategory(@Query() query: CategoryCreateDto) {
        return this.categoryService.createCategory(query);
    }

    @Get('delete')
    @ApiOperation('删除类别')
    async delCategory(@Query() query: CategoryDelDto) {
        return this.categoryService.delCategory(query);
    }
}
