import { IsPositive, Min, ValidateNested } from 'class-validator'

export class GetStocksDto {
    @IsPositive()
    readonly storeId: number

    @IsPositive({ each: true })
    readonly productIds: number[]
}

export class StoreStocksDto {
    @IsPositive()
    storeId: number

    @ValidateNested()
    stocks: StocksDto[]
}

class StocksDto {
    @IsPositive()
    productId: number

    @Min(0)
    quantity: number
}
