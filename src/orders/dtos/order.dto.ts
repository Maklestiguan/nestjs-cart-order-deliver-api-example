import { PickType } from '@nestjs/swagger'
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

    @IsString()
    @IsNotEmpty()
    deliveryAddress: string

    @ValidateNested({ each: true })
    positionIds: CreateReservationResponseDto[] // TODO: replace with more appropriate class?
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
