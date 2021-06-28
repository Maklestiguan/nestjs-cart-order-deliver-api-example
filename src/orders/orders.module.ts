import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReservationsModule } from '../reservations/reservations.module'
import { OrderEntity } from './entites/order.entity'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity]), ReservationsModule],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
