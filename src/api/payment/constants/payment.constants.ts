import { IS_DEV_ENV } from '../../../common/utils'

export const CRYPTOPAY_API_URL = IS_DEV_ENV
    ? 'https://testnet-pay.crypt.bot/api/'
    : 'https://pay.crypt.bot/api'
