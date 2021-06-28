import { PickType } from '@nestjs/graphql'
import BigNumber from 'bignumber.js'
import {
    IsDateString,
    IsNotEmpty,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator'
import {
    CreateReservationDto,
    CreateReservationResponseDto,
} from '../../reservations/dtos/reservation.dto'
import { MinBigNumber } from '../../shared/validators/min-bignumber.validator'

export class CreateOrderDto {
    @IsPositive()
    clientId: number

    @IsDateString()
    deliveryDate: string

    @ValidateNested({ each: true })
    reservations: CreateReservationResponseDto[]
}

export class OrderDto {
    @IsPositive()
    orderId: number

    @IsString()
    @IsNotEmpty()
    orderNumber: string

    @MinBigNumber(0)
    price: BigNumber

    @IsDateString()
    deliveryAddress: string

    @ValidateNested({ each: true })
    positions: OrderReservationsDto[]
}

export class CreateOrderResponseDto extends PickType(OrderDto, [
    'orderId',
] as const) {}

class OrderReservationsDto extends CreateReservationDto {
    @IsDateString()
    deliveryDate: string
}
