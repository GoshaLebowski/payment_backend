import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';



import { ApiModule } from './api/api.module';
import { InfraModule } from './infra/infra.module';























@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        InfraModule,
        ApiModule
    ]
})
export class AppModule {}
