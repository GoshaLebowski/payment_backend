import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Plan, type Transaction, TransactionStatus } from '@prisma/client';
import { createHash, createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';



import { CRYPTOPAY_API_URL } from '../../constants';
import type { PaymentWebhookResult } from '../../interfaces';
import { CryptoWebhookDto } from '../../webhook/dto';



import { CreateInvoiceRequest, CryptoResponse, Currency, FiatCurrency, InvoiceStatus } from './interfaces';
























































@Injectable()
export class CryptoService {
    private readonly TOKEN: string

    public constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.TOKEN = this.configService.getOrThrow<string>('CRYPTO_PAY_TOKEN')
    }

    public async create(plan: Plan, transaction: Transaction) {
        const payload: CreateInvoiceRequest = {
            amount: transaction.amount,
            currency_type: Currency.FIAT,
            fiat: FiatCurrency.RUB,
            description: `Оплата подписки на тарифный план "${plan.title}"`,
            hidden_message: 'Спасибо за оплату! Подписка активирована',
            paid_btn_url: 'http://localhost:3000',
            payload: Buffer.from(
                JSON.stringify({
                    transactionId: transaction.id,
                    planId: plan.id
                })
            ).toString('base64url')
        }

        const response = await this.makeRequest(
            'POST',
            'createInvoice',
            payload
        )

        return response.result
    }

    public async handleWebhook(
        dto: CryptoWebhookDto
    ): Promise<PaymentWebhookResult> {
        const payload = JSON.parse(
            Buffer.from(dto.payload.payload ?? '', 'base64').toString('utf-8')
        )

        const transactionId = payload?.transactionId
        const planId = payload?.planId
        const paymentId = dto.payload.invoice_id.toString()

        let status: TransactionStatus = TransactionStatus.PENDING

        switch (dto.payload.status) {
            case InvoiceStatus.PAID:
                status = TransactionStatus.SUCCEEDED
                break
            case InvoiceStatus.EXPIRED:
                status = TransactionStatus.FAILED
                break
        }

        return {
            transactionId,
            planId,
            paymentId,
            status,
            raw: dto
        }
    }

    public verifyWebhook(rawBody: Buffer, sig: string) {
        const secret = createHash('sha256').update(this.TOKEN).digest()

        const hmac = createHmac('sha256', secret).update(rawBody).digest('hex')

        if (hmac !== sig) throw new UnauthorizedException('Invalid signature')

        return true
    }

    public isFreshRequest(body: any, maxAgeSeconds: number = 300) {
        const requestDate = new Date(body.request_date).getTime()

        const now = Date.now()

        return now - requestDate <= maxAgeSeconds * 1000
    }

    private async makeRequest<T>(
        method: 'GET' | 'POST',
        endpoint: string,
        data?: any
    ) {
        const headers = {
            'Crypto-Pay-API-Token': this.TOKEN
        }

        const observable = this.httpService.request<CryptoResponse<T>>({
            baseURL: CRYPTOPAY_API_URL,
            url: endpoint,
            method,
            data,
            headers
        })

        const { data: response } = await firstValueFrom(observable)

        return response
    }
}
