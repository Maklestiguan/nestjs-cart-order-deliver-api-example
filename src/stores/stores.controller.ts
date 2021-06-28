import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common'
import { StocksByStoresDto } from '../products/dtos/stocks-by-store.dto'
import { FilterDto } from '../shared/dtos/filter.dto'
import { ConciseStoreDto, CreateStoreDto, StoreDto } from './dtos/store.dto'
import { StoresService } from './stores.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('stores')
export class StoresController {
    constructor(private readonly _storesService: StoresService) {}

    @Get()
    async get(@Query() filter: FilterDto): Promise<ConciseStoreDto[]> {
        const stores = await this._storesService.stores(filter)

        return stores.map((store) => {
            return {
                storeId: store.id,
                ...store,
            }
        })
    }

    @Get(':storeId')
    async getById(@Param('storeId') storeId: number): Promise<StoreDto> {
        const [result] = await this._storesService.stores({
            ids: [storeId],
        })

        return {
            storeId: result.id,
            ...result,
        }
    }

    @Get(':storeId/stock')
    async getStockByStoreAndProductId(
        @Param('storeId') storeId: number,
        @Query('productIds') productIds: number[],
    ): Promise<StocksByStoresDto | Partial<StocksByStoresDto>> {
        const result = await this._storesService.stockByStoreAndProductIds({
            storeId,
            productIds,
        })

        return result
    }

    @Post()
    async create(@Body() createStoreDto: CreateStoreDto): Promise<StoreDto> {
        const store = await this._storesService.create(createStoreDto)

        return {
            storeId: store.id,
            ...store,
        }
    }
}
