import { Module } from '@nestjs/common'

import { StripeModule } from '../providers/stripe/stripe.module'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
    imports: [StripeModule],
    controllers: [WebhookController],
    providers: [WebhookService]
})
export class WebhookModule {}
