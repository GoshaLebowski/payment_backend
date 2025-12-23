import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingPeriod, type Plan, Transaction, TransactionStatus, User } from '@prisma/client';
import Stripe from 'stripe';



import { PaymentWebhookResult } from '../../interfaces';














@Injectable()
export class StripeService {
    private readonly stripe: Stripe

    private readonly WEBHOOK_SECRET: string

    public constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(
            this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
            {
                apiVersion: '2025-12-15.clover'
            }
        )

        this.WEBHOOK_SECRET = this.configService.getOrThrow<string>(
            'STRIPE_WEBHOOK_SECRET'
        )
    }

    public async create(
        plan: Plan,
        transaction: Transaction,
        billingPeriod: BillingPeriod,
        user: User
    ) {
        const priceId =
            billingPeriod === BillingPeriod.MONTHLY
                ? plan.stripeMonthlyPriceId
                : plan.stripeYearlyPriceId

        if (!priceId)
            throw new BadRequestException(
                'Stripe priceId is messing for this plan'
            )

        const successUrl = 'http://localhost:3000/'
        const cancelUrl = this.configService.getOrThrow<string>('APP_URL')

        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                transactionId: transaction.id,
                planId: plan.id
            }
        })
    }

    public async handleWebhook(
        event: Stripe.Event
    ): Promise<PaymentWebhookResult | null> {
        switch (event.type) {
            case 'checkout.session.completed': {
                const payment = event.data.object as Stripe.Checkout.Session

                const transactionId = payment.metadata?.transactionId
                const planId = payment.metadata?.planId
                const paymentId = payment.id

                if (!transactionId || !planId) return null

                return {
                    transactionId,
                    planId,
                    paymentId,
                    status: TransactionStatus.SUCCEEDED,
                    raw: event
                }
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice

                const transactionId = invoice.metadata?.transactionId
                const planId = invoice.metadata?.planId
                const paymentId = invoice.id

                if (!transactionId || !planId || !paymentId) return null

                return {
                    transactionId,
                    planId,
                    paymentId,
                    status: TransactionStatus.FAILED,
                    raw: event
                }
            }

            default:
                return null
        }
    }

    public async parseEvent(
        rawBody: Buffer,
        signature: string
    ): Promise<Stripe.Event> {
        try {
            return this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                this.WEBHOOK_SECRET
            )
        } catch (error) {
            throw new BadRequestException(
                `Webhook signature verification failed: ${error.message}`
            )
        }
    }
}
