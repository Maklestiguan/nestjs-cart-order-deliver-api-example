import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
        const newOrder = this._ordersRepository.create(createOrderDto)
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
