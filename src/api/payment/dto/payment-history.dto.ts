import { ApiProperty } from '@nestjs/swagger'
import { PaymentProvider, TransactionStatus } from '@prisma/client'

export class PaymentHistoryResponse {
    @ApiProperty({
        description: 'Unique transaction identifier',
        example: 'alsloX3rsmcHHOnykK-e6'
    })
    id: string

    @ApiProperty({
        description: 'Transaction created at',
        example: '2025-12-12T12:03:29.961Z'
    })
    createdAt: Date

    @ApiProperty({
        description: 'Subscription plan name',
        example: 'Premium'
    })
    plan: string

    @ApiProperty({
        description: 'Amount of the transaction',
        example: '2499'
    })
    amount: number

    @ApiProperty({
        description: 'Payment provider used for the transaction',
        example: PaymentProvider.YOOKASSA,
        enum: PaymentProvider
    })
    provider: PaymentProvider

    @ApiProperty({
        description: 'Transaction status',
        example: TransactionStatus.SUCCEEDED,
        enum: TransactionStatus
    })
    status: TransactionStatus
}
