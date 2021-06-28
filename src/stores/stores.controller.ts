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
import { FilterDto } from 'src/shared/dtos/filter.dto'
import { ConciseStoreDto, CreateStoreDto, StoreDto } from './dtos/store.dto'
import { StoresService } from './stores.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('stores')
export class StoresController {
    constructor(private readonly _storesService: StoresService) {}

    @Get()
    async get(@Query() filter: FilterDto): Promise<ConciseStoreDto[]> {
        return await this._storesService.stores(filter)
    }

    @Get(':id')
    async getById(@Param('id') id: number): Promise<StoreDto> {
        const [result] = await this._storesService.stores({
            ids: [id],
        })

        return result
    }

    @Post()
    async create(@Body() createStoreDto: CreateStoreDto): Promise<StoreDto> {
        return await this._storesService.create(createStoreDto)
    }
}
