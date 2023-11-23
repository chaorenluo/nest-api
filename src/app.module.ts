import { Module } from '@nestjs/common';
import { DomeModule } from './dome/dome.module';
import { GlobalModule } from 'commons/public-module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [GlobalModule.forRoot({}), DomeModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
