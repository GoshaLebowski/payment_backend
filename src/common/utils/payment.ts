import { PaymentProvider } from '@prisma/client'
import { format } from 'date-fns'

export function formatTransactionDate(date: string | Date): string {
    return format(new Date(date), 'dd.MM.yyyy')
}

export function getProviderName(provider: PaymentProvider): string {
    switch (provider) {
        case PaymentProvider.YOOKASSA:
            return 'Юкасса'
        case PaymentProvider.STRIPE:
            return 'Stripe'
        case PaymentProvider.CRYPTOPAY:
            return 'Crypto Pay'
        default:
            return provider
    }
}
