import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FilterDto } from '../shared/dtos/filter.dto'
import { applyFilterToSelector } from '../shared/helpers/apply-filter-to-selector.helper'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateStoreDto } from './dtos/store.dto'
import { StoreEntity } from './entities/store.entity'

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(StoreEntity)
        private readonly _storesRepository: Repository<StoreEntity>,
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

    async create(createDto: CreateStoreDto): Promise<StoreEntity> {
        const newStore = this._storesRepository.create(createDto)
        const document = await this._storesRepository.save(newStore)

        return document
    }
}
