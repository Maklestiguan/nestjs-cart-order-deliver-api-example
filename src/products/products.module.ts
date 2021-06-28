import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresModule } from '../stores/stores.module'
import { ProductStoreEntity } from './entities/product-store.entity'
import { ProductEntity } from './entities/product.entity'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity, ProductStoreEntity]),
        StoresModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
