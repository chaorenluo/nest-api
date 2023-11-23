import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configYml } from 'commons/public-tool';

// export interface LoggerModuleAsyncOptions {
//   useFactory: (
//     ...args: any[]
//   ) => Promise<LoggerServiceOptions> | LoggerServiceOptions;
//   inject?: any[];
// }

@Module({})
export class MySqlModule {
    static forRootAsync(): DynamicModule {
        const { host, port, username, password, database, logging } =
            configYml.datasource;
        const typeOrmModule = TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                type: 'mysql',
                host: String(host),
                port: Number.parseInt(port || 3306),
                username: String(username),
                password: String(password),
                database: String(database),
                logging: logging,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                timezone: '+08:00', // 东八区
                cache: {
                    duration: 60000, // 1分钟的缓存
                },
                waitForConnections: true,
                connectionLimit: 10,
                maxIdle: 10,
                idleTimeout: 60000,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            }),
        });
        return {
            module: MySqlModule,
            imports: [typeOrmModule],
        };
    }
}
