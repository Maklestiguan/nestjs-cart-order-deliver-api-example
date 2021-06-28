import BigNumber from 'bignumber.js'
import {
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Min,
    ValidateNested,
} from 'class-validator'
import { MinBigNumber } from '../../shared/validators/min-bignumber.validator'
import { StocksByStoresDto } from './stocks-by-store.dto'

export class ProductDto {
    @IsPositive()
    productId: number

    @IsNotEmpty()
    @IsString()
    name: string

    @MinBigNumber(0)
    price: BigNumber

    @IsUrl()
    @IsOptional()
    string?: string
}

export class ProductQuantityDto {
    @IsPositive()
    productId: number

    @Min(0)
    totalQuantity: number

    @ValidateNested()
    stocksByStores: StocksByStoresDto[]
}

export class GetProductQuantityDto {
    @IsPositive()
    readonly productId: number

    @IsPositive({ each: true })
    readonly storeIds: number[]
}
