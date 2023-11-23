import {
    Controller,
    UseGuards,
    Post,
    Get,
    Req,
    UseInterceptors,
    UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from 'commons/public-decorator';
import {
    ApiTags,
    ApiBody,
    ApiBearerAuth,
    ApiResponse,
    ApiHeaders,
} from '@nestjs/swagger';
import {
    LoginInfoResponse,
    UserInfoResponse,
    LoginDto,
    RegisternInfoDto,
} from './auth.entity';
import { AllExceptionFilter, TransformInterceptor } from 'commons/public-tool';
import { JwtAuthGuard, LocalAuthGuard } from 'commons/public-module';

@ApiTags('登录')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
@UseFilters(AllExceptionFilter)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('auth')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 201, type: LoginInfoResponse })
    @ApiOperation('登录')
    async login(@Req() req) {
        return this.authService.login(req.user);
    }

    @Get('s1')
    async deom() {
        return {
            name: '123',
        };
    }
}
