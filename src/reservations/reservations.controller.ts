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
    CreateReservationDto,
    CreateReservationResponseDto,
    ReservationDto,
} from './dtos/reservation.dto'
import { ReservationsService } from './reservations.service'

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly _reservationsService: ReservationsService) {}

    @Get('/:reservationId')
    async reservationById(
        @Param('reservationId', new ParseIntPipe()) reservationId: number,
    ): Promise<ReservationDto> {
        const {
            id,
            store: { id: storeId },
            product: { id: productId },
            quantity,
        } = await this._reservationsService.getById(reservationId)

        return {
            reservationId: id,
            storeId,
            productId,
            quantity,
        }
    }

    @Post()
    async create(
        @Body() createReservationDto: CreateReservationDto,
    ): Promise<CreateReservationResponseDto> {
        const { id: reservationId } = await this._reservationsService.create(
            createReservationDto,
        )

        return { reservationId }
    }

    @Delete('/:reservationId')
    @HttpCode(DEFAULT_DELETE_HTTP_CODE)
    async delete(
        @Param('reservationId', new ParseIntPipe()) reservationId: number,
    ): Promise<void> {
        await this._reservationsService.deleteById(reservationId)
    }
}
