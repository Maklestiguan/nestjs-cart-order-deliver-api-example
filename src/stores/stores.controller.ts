import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { StocksByStoresDto } from '../products/dtos/stocks-by-store.dto'
import { FilterDto } from '../shared/dtos/filter.dto'
import { ConciseStoreDto, CreateStoreDto, StoreDto } from './dtos/store.dto'
import { StoreEntity } from './entities/store.entity'
import { StoresService } from './stores.service'

@Controller('stores')
export class StoresController {
    constructor(private readonly _storesService: StoresService) {}

    @Get()
    async get(@Query('filter') filter: FilterDto): Promise<ConciseStoreDto[]> {
        const stores = await this._storesService.stores(filter)

        return stores.map((store) => {
            return {
                // TODO: Serialization works when entities returned from controller
                // which imo looks not as good as separating return types between layers
                ...plainToClass(ConciseStoreDto, store, {
                    excludePrefixes: ['_'],
                }),
            }
        })
    }

    @Get('/:storeId')
    async getById(@Param('storeId') storeId: number): Promise<StoreEntity> {
        const [result] = await this._storesService.stores({
            ids: [storeId],
        })

        // XXX: This way we'll get auto-mapped object without database specific fields
        // Bu we'll lose explicit return type difference for controller-service pair
        return result
    }

    @Get('/:storeId/stock')
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
