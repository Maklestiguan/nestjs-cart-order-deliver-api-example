import { Module } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { ReservationsController } from './reservations.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReservationEntity } from './entites/reservation.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ReservationEntity])],
    providers: [ReservationsService],
    controllers: [ReservationsController],
    exports: [ReservationsService],
})
export class ReservationsModule {}
