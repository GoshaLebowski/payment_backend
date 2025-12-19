import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type Plan, type Transaction } from '@prisma/client'
import { firstValueFrom } from 'rxjs'

import { CRYPTOPAY_API_URL } from '../../constants'

import {
    CreateInvoiceRequest,
    CryptoResponse,
    FiatCurrency
} from './interfaces'

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
            currency_type: 'fiat',
            fiat: FiatCurrency.RUB,
            description: `Оплата подписки на тарифный план "${plan.title}"`,
            hidden_message: 'Спасибо за оплату! Подписка активирована',
            paid_btn_url: 'http://localhost:3000'
        }

        const response = await this.makeRequest(
            'POST',
            'createInvoice',
            payload
        )

        return response.result
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
