import { IsPositive, Min } from 'class-validator'

export class StocksByStoresDto {
    @IsPositive()
    storeId: number

    @Min(0)
    quantity: number
}
