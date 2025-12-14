import { Module } from '@nestjs/common';



import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plan/plan.module';
import { UsersModule } from './users/users.module';

























@Module({
    imports: [AuthModule, UsersModule, PlanModule, PaymentModule]
})
export class ApiModule {}
