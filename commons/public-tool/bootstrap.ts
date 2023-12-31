import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
// import { format, join } from 'path';
import { mw } from 'request-ip';
// import * as express from 'express';
import { LoggerService, limiterMiddleware } from '../public-module';
import { connectLogger } from 'log4js';
import { toIp, getIPAdress } from './data';

type BootstrapOptions = NestApplicationOptions & {
    // 在服务启动之前执行
    before?: (app: INestApplication) => void;
};

/**
 * 服务启动引导程序
 */

export async function bootstrap(
    module: any,
    bootstrapOptions?: BootstrapOptions,
) {
    const { before, ...options } = bootstrapOptions || {};
    const app = await NestFactory.create<NestExpressApplication>(
        module,
        options,
    );
    before?.(app);
    // 获取客户真实IP
    app.use(mw());
    // 限流中间件
    app.use(limiterMiddleware);
    // 获取配置服务
    const configService = app.get<ConfigService>(ConfigService);

    // 服务配置
    const serve = configService.get('serve');
    // 注入日志
    const loggerService = new LoggerService();
    // 链路追踪
    app.use((req: any, res: any, next: any) => loggerService.run(req, next));
    app.use(
        connectLogger(loggerService.log4js, {
            level: 'info',
            format: (req, res, format) => {
                const traceId = req.headers.requestId
                    ? '[' + req.headers.requestId + ']'
                    : '';
                const logInfoJson = {
                    IP: toIp(req.clientIp),
                    Method: req.method,
                    URL: req.url,
                    Body: req.body,
                    ResponseTime: res.responseTime + ' - ms' || '-- ms',
                    Referer: req.headers.referer,
                };
                const logInfo = traceId + JSON.stringify(logInfoJson);
                return format(logInfo);
            },
        }),
    );
    // swagger 接口文档
    const swagger = configService.get('swagger');
    if (process.env.NODE_ENV !== 'production') {
        const documentBuilder = new DocumentBuilder()
            .setTitle(swagger.title)
            .setDescription(swagger.description)
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            })
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, documentBuilder, {
            ignoreGlobalPrefix: true,
        });
        SwaggerModule.setup(swagger.path, app, document);
    }
    // 启动HTTP服务
    await app.listen(serve.port);
    // 捕获进程错误
    process.on('uncaughtException', (err) => {
        loggerService.error(err.message, err.stack);
    });
    loggerService.log(`http://localhost:${serve.port}/dev`, '本地服务地址');
    loggerService.log(
        `http://localhost:${serve.port}/${swagger.path}`,
        '本地Swagger' + swagger.title,
    );
    loggerService.log(`http://${getIPAdress()}:${serve.port}/dev`, '服务地址');
    loggerService.log(
        `http://${getIPAdress()}:${serve.port}/${swagger.path}`,
        swagger.title,
    );
}
