import { Injectable, NotFoundException } from '@nestjs/common';
import { BillingPeriod, PaymentProvider, User } from '@prisma/client';



import { PrismaService } from '../../infra/prisma/prisma.service';



import { InitPaymentRequest } from './dto/init-payment.dto';
import { StripeService } from './providers/stripe/stripe.service';
import { YoomoneyService } from './providers/yoomoney/yoomoney.service';














































@Injectable()
export class PaymentService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly yoomoneyService: YoomoneyService,
        private readonly stripeService: StripeService
    ) {}

    public async getHistory(user: User) {
        const payments = await this.prismaService.transaction.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subscription: {
                    include: {
                        plan: true
                    }
                }
            }
        })

        return payments.map(payment => ({
            id: payment.id,
            createdAt: payment.createdAt,
            plan: payment.subscription!.plan.title,
            amount: payment.amount,
            provider: payment.provider,
            status: payment.status
        }))
    }

    public async init(dto: InitPaymentRequest, user: User) {
        const { planId, billingPeriod, provider } = dto

        const plan = await this.prismaService.plan.findUnique({
            where: {
                id: planId
            }
        })

        if (!plan) throw new NotFoundException('План не найден')

        const amount =
            billingPeriod === BillingPeriod.MONTHLY
                ? plan.yearlyPrice
                : plan.monthlyPrice

        const transaction = await this.prismaService.transaction.create({
            data: {
                amount,
                provider,
                billingPeriod,
                user: {
                    connect: {
                        id: user.id
                    }
                },
                subscription: {
                    connectOrCreate: {
                        where: {
                            userId: user.id
                        },
                        create: {
                            user: {
                                connect: {
                                    id: user.id
                                }
                            },
                            plan: {
                                connect: {
                                    id: planId
                                }
                            }
                        }
                    }
                }
            }
        })

        let payment

        switch (provider) {
            case PaymentProvider.YOOKASSA:
                payment = await this.yoomoneyService.create(
                    plan,
                    transaction,
                    billingPeriod
                )
                break
            case PaymentProvider.STRIPE:
                payment = await this.stripeService.create(
                    plan,
                    transaction,
                    user,
                    billingPeriod
                )
                break
        }

        await this.prismaService.transaction.update({
            where: {
                id: transaction.id
            },
            data: {
                providerMeta: payment
            }
        })

        return payment
    }
}
