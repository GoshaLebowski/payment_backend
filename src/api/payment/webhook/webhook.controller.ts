import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    type RawBodyRequest,
    Req
} from '@nestjs/common'
import type { Request } from 'express'

import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
    public constructor(private readonly webhookService: WebhookService) {}

    @Post('yookassa')
    @HttpCode(HttpStatus.OK)
    public async handleYookassa(@Body() dto: any) {
        console.log('YOOKASSA WEBHOOK: ', dto)

        return dto
    }

    @Post('stripe')
    @HttpCode(HttpStatus.OK)
    public async handleStripe(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') sig: string
    ) {
        return await this.webhookService.handleStripe(req.rawBody, sig)
    }
}
