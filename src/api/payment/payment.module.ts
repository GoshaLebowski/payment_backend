import { Module } from '@nestjs/common'

import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { YoomoneyModule } from './providers/yoomoney/yoomoney.module'

@Module({
    imports: [YoomoneyModule],
    controllers: [PaymentController],
    providers: [PaymentService]
})
export class PaymentModule {}
