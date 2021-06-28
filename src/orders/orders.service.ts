import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
    ) {}

    async getById(id: number): Promise<OrderEntity> {
        const document = await this._ordersRepository.findOne(id)

        if (!document) {
            throw new NotFoundException('Order not found')
        }

        return document
    }

    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const { positionIds, ...rest } = createOrderDto

        const newOrder = this._ordersRepository.create({
            ...rest,
            orderNumber: `${randomString(
                ORDER_NUMBER_PREFIX_LENGTH,
            )}-${randomString(ORDER_NUMBER_POSTFIX_LENGTH, true)}`,
            positions: positionIds.map(({ reservationId }) => {
                return { id: reservationId }
            }),
        })
        const document = await this._ordersRepository.save(newOrder)

        return document
    }

    async deleteById(id: number): Promise<void> {
        const { affected } = await this._ordersRepository.softDelete(id)

        if (!affected) {
            throw new NotFoundException('Reservation not found')
        }
    }
}
