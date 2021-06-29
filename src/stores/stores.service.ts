import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FilterDto } from '../shared/dtos/filter.dto'
import { applyFilterToSelector } from '../shared/helpers/apply-filter-to-selector.helper'
import { FindManyOptions, In, Repository } from 'typeorm'
import { CreateStoreDto } from './dtos/store.dto'
import { StoreEntity } from './entities/store.entity'
import { GetStocksDto, StoreStocksDto } from './dtos/stocks.dto'
import { ProductStoreEntity } from '../products/entities/product-store.entity'
import { StocksByStoresDto } from '../products/dtos/stocks-by-store.dto'
import { Cron, CronExpression } from '@nestjs/schedule'
import { StoreSlotsEntity } from './entities/store-slots.entity'
import {
    DAYS_IN_WEEK,
    ONE_DAY,
    SMALL_CHUNK_SIZE,
} from '../shared/constants/common.constants'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderEntity } from '../orders/entites/order.entity'

@Injectable()
export class StoresService implements OnModuleInit {
    private readonly _logger = new Logger(StoresService.name)

    constructor(
        @InjectRepository(StoreEntity)
        private readonly _storesRepository: Repository<StoreEntity>,
        @InjectRepository(ProductStoreEntity)
        private readonly _productStoreRepository: Repository<ProductStoreEntity>,
        @InjectRepository(StoreSlotsEntity)
        private readonly _storeSlotsRepository: Repository<StoreSlotsEntity>,
    ) {}

    async onModuleInit(): Promise<void> {
        await this._generateNextWeekStoreSlots()
    }

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
                product: { id: In(productIds) },
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

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    private async _removeStaleStoreSlots(): Promise<void> {
        try {
            const yesterday = new Date(Date.now() - ONE_DAY)

            const { affected } = await this._storeSlotsRepository.softDelete({
                deliveryDate: yesterday,
            })

            this._logger.debug(
                `Removed total of ${affected} store slots with delivery date ${yesterday}`,
            )
        } catch (error) {
            this._logger.error({
                error,
                message: error?.message ?? 'Unexpected error',
            })
        }
    }

    @Cron(CronExpression.EVERY_WEEK)
    private async _generateNextWeekStoreSlots(): Promise<void> {
        try {
            const today = new Date()
            const stores = await this._storesRepository.find()
            const storeSlotsToSave: StoreSlotsEntity[] = []

            for (let i = 0; i < DAYS_IN_WEEK; i++) {
                const newStoreSlots = stores.map((store) => {
                    const { id } = store

                    return this._storeSlotsRepository.create({
                        store: { id },
                        available: 60,
                        deliveryDate: new Date(Date.now() + ONE_DAY * i),
                    })
                })

                storeSlotsToSave.push(...newStoreSlots)
            }

            const documents = await this._storeSlotsRepository.save(
                storeSlotsToSave,
                {
                    chunk: SMALL_CHUNK_SIZE,
                },
            )

            this._logger.debug(
                `Generated total of ${documents.length} store slots for the week starting at ${today}`,
            )
        } catch (error) {
            this._logger.error({
                // XXX: error is quite verbose, uncomment if more context required
                // error,
                message: error?.message ?? 'Unexpected error',
            })
        }
    }

    @OnEvent('order.created', { async: true })
    private async _handleOrderCreatedEvent(
        payload: OrderEntity,
    ): Promise<void> {
        try {
            const { positions, deliveryDate } = payload
            const storeIds = positions.map((position) => position.store.id)

            const storeSlots = await this._storeSlotsRepository.find({
                where: {
                    store: { id: In(storeIds) },
                    deliveryDate,
                },
            })

            const updatedStoreSlots = storeSlots.map((slot) => {
                return {
                    ...slot,
                    available: slot.available--,
                }
            })

            await this._storeSlotsRepository.save(updatedStoreSlots)
        } catch (error) {
            this._logger.error({
                error,
                message: error?.message ?? 'Unexpected error',
            })
        }
    }
}
