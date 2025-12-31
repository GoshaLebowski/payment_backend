import * as React from 'react'

import type { Transaction } from '@prisma/client'
import { Body, Container, Font, Head, Heading, Html, Preview, Tailwind, Text } from '@react-email/components'
import { formatTransactionDate, getProviderName } from '../../../common/utils'

interface PaymentSuccessTemplateProps {
    transaction: Transaction
}

export function PaymentSuccessTemplate({ transaction }: PaymentSuccessTemplateProps) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Geist"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
                        format: 'woff2'
                    }}
                />
            </Head>
            <Tailwind>
                <Preview>Платеж успешно обработан</Preview>
                <Body className={'bg-gray-50 font-sans text-gray-700'}>
                    <Container className={'max-w-2xl mx-auto bg-white rounded-md shadow-md'}>
                        <div className={'relative px-8 py-16 overflow-hidden'}>
                            <div className={'relative text-center'}>
                                <Heading className={'mb-2 text-2xl font-bold text-slate-900'}>
                                    Платеж успешно обработан!
                                </Heading>
                                <Text className={'text base text-slate-500'}>
                                    Спасибо за оплату. Ваша подписка активирована
                                </Text>
                            </div>

                            <div className={'p-8 mt-8 bg-gray-100 rounded-xl'}>
                                <Heading className={'mb-6 text-xl font-semibold text-slate-900'}>
                                    Детали платежа
                                </Heading>
                                <div className={'mb-3 flex justify-between text-sm text-slate-500'}>
                                    <span>ID транзакции:</span>
                                    <span className={'font-mono text-slate-900'}>{transaction.id}</span>
                                </div>

                                <div className={'mb-3 flex justify-between text-sm text-slate-500'}>
                                    <span>Дата:</span>
                                    <span className={'text-slate-900'}>
                                        {formatTransactionDate(transaction.createdAt)}
                                    </span>
                                </div>

                                <div className={'mb-3 flex justify-between text-sm text-slate-500'}>
                                    <span>Способ оплаты:</span>
                                    <span className={'text-slate-900'}>
                                        {getProviderName(transaction.provider)}
                                    </span>
                                </div>

                                <div className={'mb-3 flex justify-between pt-3 border-t border-gray-300'}>
                                    <span className={'text-lg font-semibold text-slate-900'}>Итог: </span>
                                    <span className={'font-bold text-lg text-slate-900'}>
                                        {transaction.amount} ₽
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
