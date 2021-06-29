import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common'
import { DEFAULT_DELETE_HTTP_CODE } from '../shared/constants/common.constants'
import {
    CreateOrderDto,
    CreateOrderResponseDto,
    OrderDto,
} from './dtos/order.dto'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
    constructor(private readonly _ordersService: OrdersService) {}

    @Get('/:orderId')
    async getById(
        @Param('orderId', new ParseIntPipe()) orderId: number,
    ): Promise<OrderDto> {
        const {
            id,
            deliveryAddress,
            deliveryDate,
            orderNumber,
            price,
            positions,
        } = await this._ordersService.getById(orderId)

        return {
            orderId: id,
            orderNumber,
            price,
            deliveryAddress,
            positions: positions.map((position) => {
                const {
                    store: { id: storeId },
                    product: { id: productId },
                    quantity,
                } = position

                return {
                    productId,
                    storeId,
                    quantity,
                    deliveryDate,
                }
            }),
        }
    }

    @Post()
    async create(
        @Body() createOrderDto: CreateOrderDto,
    ): Promise<CreateOrderResponseDto> {
        const { id: orderId } = await this._ordersService.create(createOrderDto)

        return { orderId }
    }

    @Delete('/:orderId')
    @HttpCode(DEFAULT_DELETE_HTTP_CODE)
    async delete(
        @Param('orderId', new ParseIntPipe()) orderId: number,
    ): Promise<void> {
        await this._ordersService.deleteById(orderId)
    }
}
