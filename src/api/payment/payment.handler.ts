import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import {
    BillingPeriod,
    SubscriptionStatus,
    TransactionStatus
} from '@prisma/client'

import { PrismaService } from '../../infra/prisma/prisma.service'

import { PaymentWebhookResult } from './interfaces'

@Injectable()
export class PaymentHandler {
    private readonly logger = new Logger(PaymentHandler.name)

    public constructor(private readonly prismaService: PrismaService) {}

    public async processResult(result: PaymentWebhookResult) {
        const { transactionId, planId, paymentId, status, raw } = result

        const transaction = await this.prismaService.transaction.findUnique({
            where: {
                id: transactionId
            },
            include: {
                subscription: {
                    include: {
                        user: true,
                        plan: true
                    }
                }
            }
        })

        if (!transaction) throw new NotFoundException('Транзакция не найдена')

        await this.prismaService.transaction.update({
            where: {
                id: transaction.id
            },
            data: {
                status,
                externalId: paymentId,
                providerMeta: raw
            }
        })

        const subscription = transaction.subscription

        if (
            status === TransactionStatus.SUCCEEDED &&
            transaction.subscription
        ) {
            const now = new Date()
            const isPlanChanged = subscription.plan.id !== planId

            let baseDate: Date

            if (
                !subscription.endDate ||
                subscription.endDate < now ||
                isPlanChanged
            ) {
                baseDate = new Date(now)
            } else {
                baseDate = new Date(subscription.endDate)
            }

            let newEndDate = new Date(baseDate)

            if (transaction.billingPeriod === BillingPeriod.YEARLY)
                newEndDate.setFullYear(newEndDate.getFullYear() + 1)
            else {
                const currentDay = newEndDate.getDate()
                newEndDate.setMonth(newEndDate.getMonth() + 1)

                if (newEndDate.getDate() !== currentDay) newEndDate.setDate(0)
            }

            await this.prismaService.userSubscription.update({
                where: {
                    id: subscription.id
                },
                data: {
                    status: SubscriptionStatus.ACTIVE,
                    startDate: now,
                    endDate: newEndDate,
                    plan: {
                        connect: {
                            id: planId
                        }
                    }
                }
            })

            this.logger.log(`Payment succeeded: ${subscription.user.email}`)
        } else if (status === TransactionStatus.FAILED) {
            await this.prismaService.userSubscription.update({
                where: {
                    id: subscription.id
                },
                data: {
                    status: SubscriptionStatus.EXPIRED
                }
            })

            this.logger.error(`Payment failed: ${subscription.user.email}`)
        }

        return { ok: true }
    }
}
