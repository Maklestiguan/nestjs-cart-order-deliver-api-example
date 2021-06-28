import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateReservationDto } from './dtos/reservation.dto'
import { ReservationEntity } from './entites/reservation.entity'

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(ReservationEntity)
        private readonly _reservationRepository: Repository<ReservationEntity>,
    ) {}

    async getById(id: number): Promise<ReservationEntity> {
        const document = await this._reservationRepository.findOne(id)

        if (!document) {
            throw new NotFoundException('Reservation not found')
        }

        return document
    }

    async create(
        createReservationDto: CreateReservationDto,
    ): Promise<ReservationEntity> {
        const newReservation = this._reservationRepository.create(
            createReservationDto,
        )
        const document = await this._reservationRepository.save(newReservation)

        return document
    }

    async deleteById(id: number): Promise<void> {
        const { affected } = await this._reservationRepository.softDelete(id)

        if (!affected) {
            throw new NotFoundException('Reservation not found')
        }
    }
}
