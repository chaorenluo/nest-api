import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseFilters,
    HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AllExceptionFilter, TransformInterceptor } from 'commons/public-tool';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
@UseInterceptors(TransformInterceptor)
@UseFilters(AllExceptionFilter)
export class UploadController {
    @Post()
    @HttpCode(200)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/upload',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const fileExtension = extname(file.originalname);
                    cb(
                        null,
                        `${file.fieldname}-${uniqueSuffix}${fileExtension}`,
                    );
                },
            }),
        }),
    )
    uploadFile(@UploadedFile() file: any) {
        // 处理上传文件
        return {
            url: file.path,
        };
    }
}
