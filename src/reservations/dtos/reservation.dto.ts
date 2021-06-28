import { PickType } from '@nestjs/graphql'
import { IsPositive } from 'class-validator'

export class CreateReservationDto {
    @IsPositive()
    storeId: number

    @IsPositive()
    productId: number

    @IsPositive()
    quantity: number
}

export class ReservationDto extends CreateReservationDto {
    @IsPositive()
    reservationId: number
}

export class CreateReservationResponseDto extends PickType(ReservationDto, [
    'reservationId',
] as const) {}
