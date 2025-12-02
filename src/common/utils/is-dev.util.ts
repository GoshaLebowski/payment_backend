import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config'

dotenv.config()

export function isDev(configService: ConfigService) {
    return configService.getOrThrow<string>('NODE_ENV')
}

export const IS_DEV_ENV = process.env['NODE_ENV'] === 'development'
