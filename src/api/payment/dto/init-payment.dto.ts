import { BillingPeriod, PaymentProvider } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class InitPaymentRequest {
    @IsString()
    @IsNotEmpty()
    planId: string

    @IsEnum(BillingPeriod)
    billingPeriod: BillingPeriod

    @IsEnum(PaymentProvider)
    provider: PaymentProvider
}
