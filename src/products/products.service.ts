import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { StoresService } from '../stores/stores.service'
import { GetProductQuantityDto, ProductQuantityDto } from './dtos/product.dto'
import { ProductStoreEntity } from './entities/product-store.entity'
import { ProductEntity } from './entities/product.entity'
import _ from 'lodash'

@Injectable()
export class ProductsService {
    private readonly _logger = new Logger(ProductsService.name)

    constructor(
        @InjectRepository(ProductEntity)
        private readonly _productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductStoreEntity)
        private readonly _productStoreRepository: Repository<ProductStoreEntity>,
        private readonly _storesService: StoresService,
    ) {}

    async getOneById(id: number): Promise<ProductEntity> {
        const document = await this._productRepository.findOne(id)

        if (!document) {
            throw new NotFoundException('Product not found')
        }

        return document
    }

    async getProductQuantity(
        getProductQuantityDto: GetProductQuantityDto,
    ): Promise<ProductQuantityDto | Partial<ProductQuantityDto>> {
        const { productId, storeIds } = getProductQuantityDto

        const documents = await this._productStoreRepository.find({
            where: {
                product: { productId },
                store: { storeId: In(storeIds) },
                order: { _updatedAt: 'DESC' },
            },
        })

        if (!documents?.length) {
            return {}
        }

        const mapped: ProductQuantityDto = {
            productId,
            totalQuantity: _.sumBy(documents, (document) => document.quantity),
            stocksByStores: documents.map((document) => {
                const {
                    store: { id: storeId },
                    quantity,
                } = document

                return {
                    storeId,
                    quantity,
                }
            }),
        }

        return mapped
    }
}
