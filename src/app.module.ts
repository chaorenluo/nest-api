import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DomeModule } from './dome/dome.module';
import { GlobalModule } from 'commons/public-module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'public/upload'),
            serveRoot: '/static',
        }),
        GlobalModule.forRoot({}),
        DomeModule,
        AuthModule,
        CategoryModule,
        UploadModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
