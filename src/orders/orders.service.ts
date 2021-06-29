import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EventEmitter2 } from 'eventemitter2'
import { Repository } from 'typeorm'
import { ReservationsService } from '../reservations/reservations.service'
import {
    ORDER_NUMBER_POSTFIX_LENGTH,
    ORDER_NUMBER_PREFIX_LENGTH,
} from '../shared/constants/common.constants'
import { randomString } from '../shared/helpers/random-string'
import { CreateOrderDto } from './dtos/order.dto'
import { OrderEntity } from './entites/order.entity'

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly _ordersRepository: Repository<OrderEntity>,
        private readonly _reservationsService: ReservationsService,
        private readonly _eventEmitter: EventEmitter2,
    ) {}

    async getById(id: number): Promise<OrderEntity> {
        const document = await this._ordersRepository.findOne(id)

        if (!document) {
            throw new NotFoundException('Order not found')
        }

        return document
    }

    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const { positionIds, deliveryDate, ...rest } = createOrderDto

        const reservations = await this._reservationsService.getAll({
            ids: positionIds.map(({ reservationId }) => reservationId),
        })

        if (reservations.length < positionIds.length) {
            throw new BadRequestException('Incorrect reservation ids provided') // TODO: Do we need to silently ignore non found reservations ?
        }

        // TODO: go for a negative check via `some` ?
        const everyStoreHasAvailableSlotForDate = reservations.every(
            (reservation) => {
                const {
                    store: { slots },
                } = reservation

                return slots?.find((slot) => {
                    return slot.deliveryDate
                })
            },
        )

        if (!everyStoreHasAvailableSlotForDate) {
            throw new BadRequestException(
                'Some stores have no available slots for given date',
            )
        }

        const orderNumber = `${randomString(
            ORDER_NUMBER_PREFIX_LENGTH,
        )}-${randomString(ORDER_NUMBER_POSTFIX_LENGTH, true)}`

        const newOrder = this._ordersRepository.create({
            ...rest,
            orderNumber,
            positions: reservations,
            deliveryDate,
        })
        const document = await this._ordersRepository.save(newOrder)

        this._eventEmitter.emit('order.created', document)

        return document
    }

    async deleteById(id: number): Promise<void> {
        const { affected } = await this._ordersRepository.softDelete(id)

        if (!affected) {
            throw new NotFoundException('Reservation not found')
        }
    }
}
