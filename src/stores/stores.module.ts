import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductStoreEntity } from '../products/entities/product-store.entity'
import { StoreSlotsEntity } from './entities/store-slots.entity'
import { StoreEntity } from './entities/store.entity'
import { StoresController } from './stores.controller'
import { StoresService } from './stores.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            StoreEntity,
            ProductStoreEntity,
            StoreSlotsEntity,
        ]),
    ],
    controllers: [StoresController],
    providers: [StoresService],
    exports: [StoresService],
})
export class StoresModule {}
