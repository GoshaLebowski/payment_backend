import { Injectable, UnauthorizedException } from '@nestjs/common';
import { type Plan, type Transaction, TransactionStatus } from '@prisma/client';
import CIDR from 'ip-cidr';
import { ConfirmationEnum, CurrencyEnum, PaymentMethodsEnum, YookassaService } from 'nestjs-yookassa';



import type { PaymentWebhookResult } from '../../interfaces'
import { YookassaWebhookDto } from '../../webhook/dto'













@Injectable()
export class YoomoneyService {
    private readonly ALLOWED_IPS: string[]

    public constructor(private readonly yookassaService: YookassaService) {
        this.ALLOWED_IPS = [
            '185.71.76.0/27',
            '185.71.77.0/27',
            '77.75.153.0/25',
            '77.75.156.11',
            '77.75.156.35',
            '77.75.154.128/25',
            '2a02:5180::/32'
        ]
    }

    public async create(plan: Plan, transaction: Transaction) {
        return this.yookassaService.payments.create({
            amount: {
                value: transaction.amount,
                currency: CurrencyEnum.RUB
            },
            description: `Оплата подписки на тарифный план "${plan.title}"`,
            payment_method_data: {
                type: PaymentMethodsEnum.BANK_CARD
            },
            confirmation: {
                type: ConfirmationEnum.REDIRECT,
                return_url: 'http://localhost:3000/'
            },
            save_payment_method: true,
            metadata: {
                transactionId: transaction.id,
                planId: plan.id
            }
        })
    }

    public async handleWebhook(
        dto: YookassaWebhookDto
    ): Promise<PaymentWebhookResult> {
        const transactionId = dto.object.metadata?.transactionId
        const planId = dto.object.metadata?.planId
        const paymentId = dto.object.id

        let status: TransactionStatus = TransactionStatus.PENDING

        switch (dto.event) {
            case 'payment.waiting_for_capture':
                await this.yookassaService.payments.capture(paymentId)
                break
            case 'payment.succeeded':
                status = TransactionStatus.SUCCEEDED
                break
            case 'payment.canceled':
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

    public verifyWebhook(ip: string) {
        for (const range of this.ALLOWED_IPS) {
            if (range.includes('/')) {
                const cidr = new CIDR(range)

                if (cidr.contains(ip)) return
            } else if (ip === range) return
        }

        throw new UnauthorizedException(`Invalid IP: ${ip}`)
    }
}
