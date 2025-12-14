import { Module } from '@nestjs/common'

import { YoomoneyService } from './yoomoney.service'

@Module({
    providers: [YoomoneyService]
})
export class YoomoneyModule {}
