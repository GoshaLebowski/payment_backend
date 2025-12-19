import { Injectable } from '@nestjs/common'

import { StripeService } from '../providers/stripe/stripe.service'

@Injectable()
export class WebhookService {
    public constructor(private readonly stripeService: StripeService) {}

    public async handleStripe(dto: any, sig: string) {
        const event = await this.stripeService.parseEvent(dto, sig)

        console.log('STRIPE WEBHOOK: ', event)
    }
}
