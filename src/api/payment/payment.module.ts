import { Module } from '@nestjs/common';



import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from './providers/stripe/stripe.module';
import { YoomoneyModule } from './providers/yoomoney/yoomoney.module';
import { WebhookModule } from './webhook/webhook.module';
import { CryptoModule } from './providers/crypto/crypto.module';









































@Module({
    imports: [WebhookModule, YoomoneyModule, StripeModule, CryptoModule],
    controllers: [PaymentController],
    providers: [PaymentService]
})
export class PaymentModule {}
