import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FilterDto } from '../shared/dtos/filter.dto'
import { applyFilterToSelector } from '../shared/helpers/apply-filter-to-selector.helper'
import { FindManyOptions, In, Repository } from 'typeorm'
import { CreateStoreDto } from './dtos/store.dto'
import { StoreEntity } from './entities/store.entity'
import { GetStocksDto, StoreStocksDto } from './dtos/stocks.dto'
import { ProductStoreEntity } from '../products/entities/product-store.entity'
import { StocksByStoresDto } from '../products/dtos/stocks-by-store.dto'

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(StoreEntity)
        private readonly _storesRepository: Repository<StoreEntity>,
        @InjectRepository(ProductStoreEntity)
        private readonly _productStoreRepository: Repository<ProductStoreEntity>,
    ) {}

    async stores(filter: FilterDto): Promise<StoreEntity[]> {
        const selector: FindManyOptions<StoreEntity> = applyFilterToSelector(
            {},
            filter,
        )

        const documents = await this._storesRepository.find({
            ...selector,
            order: {
                _createdAt: 'DESC',
            },
        })

        return documents
    }

    async stockByStoreAndProductIds(
        getStocksDto: GetStocksDto,
    ): Promise<StoreStocksDto | Partial<StocksByStoresDto>> {
        const { storeId, productIds } = getStocksDto

        const documents = await this._productStoreRepository.find({
            where: {
                store: { id: storeId },
                product: { productId: In(productIds) },
                order: { _updatedAt: 'DESC' },
            },
        })

        if (!documents?.length) {
            return {}
        }

        const mapped: StoreStocksDto = {
            storeId,
            stocks: documents.map((document) => {
                return {
                    productId: document.product.id,
                    quantity: document.quantity,
                }
            }),
        }

        return mapped
    }

    async create(createDto: CreateStoreDto): Promise<StoreEntity> {
        const newStore = this._storesRepository.create(createDto)
        const document = await this._storesRepository.save(newStore)

        return document
    }
}
