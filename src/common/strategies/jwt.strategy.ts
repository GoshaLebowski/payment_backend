import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from '../../api/auth/interfaces'
import { PrismaService } from '../../infra/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
            algorithms: ['HS256']
        })
    }

    public async validate(payload: JwtPayload) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.id
            }
        })

        if (!user) throw new NotFoundException('Пользователь не найден')

        return user
    }
}
