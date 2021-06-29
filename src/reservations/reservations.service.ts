import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, FindOneOptions, Repository } from 'typeorm'
import { FilterDto } from '../shared/dtos/filter.dto'
import { applyFilterToSelector } from '../shared/helpers/apply-filter-to-selector.helper'
import { CreateReservationDto } from './dtos/reservation.dto'
import { ReservationEntity } from './entites/reservation.entity'

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(ReservationEntity)
        private readonly _reservationRepository: Repository<ReservationEntity>,
    ) {}

    async getById(id: number): Promise<ReservationEntity> {
        const selector: FindOneOptions<ReservationEntity> = {
            where: {
                id,
                order: { id: undefined },
            },
        }

        const document = await this._reservationRepository.findOne(selector)

        if (!document) {
            throw new NotFoundException('Reservation not found')
        }

        return document
    }

    async getAll(filter: FilterDto): Promise<ReservationEntity[]> {
        // XXX: fetch records where no order is set yet as alternative to deleting them
        const baseSelector: FindConditions<ReservationEntity> = {
            order: { id: undefined },
        }

        const selector = applyFilterToSelector(baseSelector, filter)
        const documents = await this._reservationRepository.find(selector)

        return documents
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
