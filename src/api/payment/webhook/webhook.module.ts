import { Module } from '@nestjs/common';



import { PaymentHandler } from '../payment.handler';
import { CryptoModule } from '../providers/crypto/crypto.module';
import { StripeModule } from '../providers/stripe/stripe.module';
import { YoomoneyModule } from '../providers/yoomoney/yoomoney.module';



import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';



















































@Module({
    imports: [YoomoneyModule, StripeModule, CryptoModule],
    controllers: [WebhookController],
    providers: [WebhookService, PaymentHandler]
})
export class WebhookModule {}