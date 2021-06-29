import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, FindOneOptions, IsNull, Repository } from 'typeorm'
import { OrderEntity } from '../orders/entites/order.entity'
import { FilterDto } from '../shared/dtos/filter.dto'
import { applyFilterToSelector } from '../shared/helpers/apply-filter-to-selector.helper'
import { CreateReservationDto } from './dtos/reservation.dto'
import { ReservationEntity } from './entites/reservation.entity'

@Injectable()
export class ReservationsService {
    private _logger = new Logger(ReservationsService.name)

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
            order: IsNull(),
        }
        const selector = applyFilterToSelector(baseSelector, filter)

        const documents = await this._reservationRepository.find({
            relations: ['order'],
            ...selector,
        })

        return documents
    }

    async create(
        createReservationDto: CreateReservationDto,
    ): Promise<ReservationEntity> {
        const { productId, storeId, quantity } = createReservationDto

        const newReservation = this._reservationRepository.create({
            product: { id: productId },
            store: { id: storeId },
            quantity,
        })
        const document = await this._reservationRepository.save(newReservation)

        return document
    }

    async deleteById(id: number): Promise<void> {
        const { affected } = await this._reservationRepository.softDelete(id)

        if (!affected) {
            throw new NotFoundException('Reservation not found')
        }
    }

    @OnEvent('order.created')
    private async _handleOrderCreatedEvent(
        payload: OrderEntity,
    ): Promise<void> {
        try {
            const { id, positions } = payload
            const updatedReservations = positions.map((position) => {
                return {
                    ...position,
                    order: { id },
                }
            })

            await this._reservationRepository.save(updatedReservations)

            this._logger.log(
                `${updatedReservations.length} reservations assigned to order ${id}`,
            )
        } catch (error) {
            this._logger.error({
                error,
                message: error?.message ?? 'Unexpected error',
            })
        }
    }
}
