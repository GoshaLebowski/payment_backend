import { Injectable, UnauthorizedException } from '@nestjs/common';



import { PaymentHandler } from '../payment.handler';
import { CryptoService } from '../providers/crypto/crypto.service';
import { StripeService } from '../providers/stripe/stripe.service';
import { YoomoneyService } from '../providers/yoomoney/yoomoney.service';



import { CryptoWebhookDto, YookassaWebhookDto } from './dto';
















































@Injectable()
export class WebhookService {
    public constructor(
        private readonly paymentHandler: PaymentHandler,
        private readonly yoomoneyService: YoomoneyService,
        private readonly stripeService: StripeService,
        private readonly cryptoService: CryptoService
    ) {}

    public async handleYookassa(dto: YookassaWebhookDto, ip: string) {
        this.yoomoneyService.verifyWebhook(ip)

        console.log(dto)

        const result = await this.yoomoneyService.handleWebhook(dto)

        return await this.paymentHandler.processResult(result)
    }

    public async handleStripe(rawBody: Buffer, sig: string) {
        const event = await this.stripeService.parseEvent(rawBody, sig)

        const result = await this.stripeService.handleWebhook(event)

        if (!result) return { ok: true }

        return await this.paymentHandler.processResult(result)
    }

    public async handleCrypto(rawBody: Buffer, sig: string) {
        this.cryptoService.verifyWebhook(rawBody, sig)

        const body: CryptoWebhookDto = JSON.parse(rawBody.toString())

        if (!this.cryptoService.isFreshRequest(body))
            throw new UnauthorizedException('Request too old')

        const result = await this.cryptoService.handleWebhook(body)

        return await this.paymentHandler.processResult(result)
    }
}
