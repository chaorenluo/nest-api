import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { prisma } from 'commons/public-tool';
import { CategoryCreateDto, CategoryDelDto } from './category.entity';
@Injectable()
export class CategoryService {
    constructor(private readonly configService: ConfigService) {}

    async getCategoryList() {
        // 查询所有类别
        const data = await prisma.category.findMany();
        return data;
    }

    async createCategory(category: CategoryCreateDto) {
        // 创建类别
        const res = await prisma.category.create({
            data: category,
        });
        return res;
    }

    async delCategory(category: CategoryDelDto) {
        // 删除类别
        const res = await prisma.category.delete({
            where: {
                id: category.id,
            },
        });
        return res;
    }
}
