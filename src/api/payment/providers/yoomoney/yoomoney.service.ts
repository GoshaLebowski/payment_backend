import { Injectable } from '@nestjs/common';
import { BillingPeriod, Plan, Transaction } from '@prisma/client';
import { ConfirmationEnum, CurrencyEnum, PaymentMethodsEnum, YookassaService } from 'nestjs-yookassa';









@Injectable()
export class YoomoneyService {
    public constructor(private readonly yookassaService: YookassaService) {}

    public async create(
        plan: Plan,
        transaction: Transaction,
        billingPeriod: BillingPeriod
    ) {
        const amount =
            billingPeriod === BillingPeriod.MONTHLY
                ? plan.monthlyPrice
                : plan.yearlyPrice

        return this.yookassaService.payments.create({
            amount: {
                value: amount,
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
            save_payment_method: true
        })
    }
}
