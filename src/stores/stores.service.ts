import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FilterDto } from '../shared/dtos/filter.dto'
import { applyFilterToSelector } from '../shared/helpers/apply-filter-to-selector.helper'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateStoreDto } from './dtos/store.dto'
import { StoreEntity } from './entities/store.entity'

@Injectable()
export class StoresService {
    private readonly _logger = new Logger(StoresService.name)

    constructor(
        @InjectRepository(StoreEntity)
        private readonly _storesRepository: Repository<StoreEntity>,
    ) {}

    async stores(filter: FilterDto): Promise<StoreEntity[]> {
        try {
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
        } catch (error) {
            this._logger.error({ error })
            throw new InternalServerErrorException(error)
        }
    }

    async create(createDto: CreateStoreDto): Promise<StoreEntity> {
        try {
            const newStore = this._storesRepository.create(createDto)
            const document = await this._storesRepository.save(newStore)

            return document
        } catch (error) {
            this._logger.error({ error })
            throw new InternalServerErrorException(error)
        }
    }
}
