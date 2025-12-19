import type { Plan } from '@prisma/client';


























export const plans: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        title: 'Базовый',
        description:
            'Идеально подходит для малых проектов и индивидуальных предпринимателей.',
        features: [
            '5 проектов',
            '10ГБ хранилища',
            'Базовая поддержка',
            'Доступ к основным функциям'
        ],
        isFeatured: false,
        monthlyPrice: 850,
        yearlyPrice: 8160,
        stripeMonthlyPriceId: 'price_1SfztXLnzYjnxdE4o9ZkjABX',
        stripeYearlyPriceId: 'price_1SfztXLnzYjnxdE48mfJqWKN'
    },
    {
        title: 'Профессиональный',
        description: 'Отлично подходит для развивающихся компаний и команд.',
        features: [
            'Неограниченное количество проектов',
            '100ГБ хранилища',
            'Приоритетная поддержка',
            'Продвинутая аналитика',
            'Функции для команд'
        ],
        isFeatured: true,
        monthlyPrice: 2499,
        yearlyPrice: 23990,
        stripeMonthlyPriceId: 'price_1Sg00mLnzYjnxdE4kKf61VIR',
        stripeYearlyPriceId: 'price_1Sg00mLnzYjnxdE4JYMZ5frI'
    },
    {
        title: 'Бизнес',
        description: 'Для крупных предприятий с высокими требованиями.',
        features: [
            'Неограниченное количество проектов',
            '1ТБ хранилища',
            'Круглосуточная премиум поддержка',
            'Продвинутая безопасность',
            'Пользовательские интеграции',
            'Выделенный менеджер аккаунта'
        ],
        isFeatured: false,
        monthlyPrice: 4999,
        yearlyPrice: 47990,
        stripeMonthlyPriceId: 'price_1SfzzQLnzYjnxdE4iVcKrN2N',
        stripeYearlyPriceId: 'price_1SfzzQLnzYjnxdE4V75Z24g1'
    }
]