import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { prisma } from 'commons/public-tool';
import { redisClient } from 'commons/public-tool';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * 生成 token
     */
    genToken(accountAdmin): Record<string, unknown> {
        const { id, username } = accountAdmin;
        const accessToken = this.jwtService.sign(
            {
                [`secret-${this.configService.get('jwt.secret')}`]: id,
                username,
            },
            {
                expiresIn: this.configService.get('jwt.expiresIn'),
            },
        );
        const refreshToken = this.jwtService.sign(
            {
                [`secret-${this.configService.get('jwt.secret')}`]: id,
                username,
            },
            {
                expiresIn: this.configService.get('jwt.refreshExpiresIn'),
            },
        );
        return { accessToken, refreshToken };
    }

    // 刷新 token
    refreshToken(accountAdmin): string {
        const { id, username } = accountAdmin;
        return this.jwtService.sign({
            [`secret-${this.configService.get('jwt.secret')}`]: id,
            username,
        });
    }

    /**
     * 校验 token
     */
    async verifyToken(token: string, type: string): Promise<any> {
        try {
            if (!token) return 0;
            const tokenInfo = await this.jwtService.verify(
                token.replace('Bearer ', ''),
                this.configService.get('jwt.secret'),
            );
            const getToken = await redisClient.get(
                `${type}-${tokenInfo.username}`,
            );
            if (!getToken) {
                return 0;
            }
            return tokenInfo;
        } catch (error) {
            return 0;
        }
    }

    /**
     * 根据JWT解析的ID校验用户
     */
    async validateUserByJwt(id: string) {
        const user = prisma.user.findUnique({ where: { id } });
        return user;
    }

    /**
     * 校验用户名密码
     * @param username 用户名
     * @param pass 密码
     * @returns 返回
     */
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: { username: username },
        });
        console.log('********************1');
        if (!user) return null;
        const isMatch = await bcrypt.compare(pass, user.password);
        if (user && isMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        console.log('********************2');
        return null;
    }

    /**
     * 获取账号信息
     */
    async getInfo(id: string) {
        const user = await prisma.user.findUnique({ where: { id: id } });
        return user;
    }

    /**
     * 登录
     */
    async login(req: any) {
        const { user } = req;
        // 获取鉴权 token
        const access_token: any = this.genToken(user);
        // 写入Redis中
        await redisClient.set(
            `accessToken-${user.username}`,
            access_token.accessToken,
            'EX',
            parseInt(this.configService.get('jwt.expiresIn')),
        );
        await redisClient.set(
            `refreshToken-${user.username}`,
            access_token.refreshToken,
            'EX',
            parseInt(this.configService.get('jwt.refreshExpiresIn')),
        );
        return { ...user, ...access_token };
    }
}
