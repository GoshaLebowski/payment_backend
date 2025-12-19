import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { CryptoService } from './crypto.service'

@Module({
    imports: [HttpModule.register({})],
    providers: [CryptoService],
    exports: [CryptoService]
})
export class CryptoModule {}
