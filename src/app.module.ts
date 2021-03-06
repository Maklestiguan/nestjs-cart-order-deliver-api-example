import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config/config'
import { throttlerConfig } from './config/throttler.config'
import { typeormConfig } from './config/typeorm.config'
import { AllExceptionsFilter } from './shared/exception-filters/all-exceptions.filter'
import { StoresModule } from './stores/stores.module'
import { ProductsModule } from './products/products.module'
import { ReservationsModule } from './reservations/reservations.module'
import { OrdersModule } from './orders/orders.module'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { eventEmitterConfig } from './config/event-emitter.config'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        TypeOrmModule.forRootAsync(typeormConfig),
        ThrottlerModule.forRootAsync(throttlerConfig),
        EventEmitterModule.forRoot(eventEmitterConfig),
        ScheduleModule.forRoot(),
        StoresModule,
        ProductsModule,
        ReservationsModule,
        OrdersModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
