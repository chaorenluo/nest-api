import { ApiProperty, ApiPropertyEnum } from 'commons/public-decorator';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * 状态
 */
export const ACCOUNT_ROLE = ['USER', 'ADMIN', 'SYSTEM'];

export class CategoryCreateDto {
    @ApiProperty('类别名称')
    @IsNotEmpty({ message: '类别名称不能为空' })
    @IsString({ message: '类别名称必须为字符串' })
    name: string;

    @ApiProperty('类别描述')
    @IsNotEmpty({ message: '类别描述不能为空' })
    @IsString({ message: '类别描述必须为字符串' })
    description: string;

    @ApiProperty('类别封面')
    @IsNotEmpty({ message: '类别封面不能为空' })
    @IsString({ message: '封面必须为字符串' })
    cover: string;
}

export class CategoryCreateResponse {
    @ApiProperty('状态编码')
    code!: number;

    @ApiProperty('返回信息')
    data!: CategoryCreateDto;
}

export class CategoryDelDto {
    @ApiProperty('分类id')
    @IsNotEmpty({ message: '分类id不能为空' })
    @IsNumber({}, { message: '分类id必须为数字' })
    id: number;
}
