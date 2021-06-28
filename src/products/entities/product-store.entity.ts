import {
    Column,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm'
import { StoreEntity } from '../../stores/entities/store.entity'
import { ProductEntity } from './product.entity'

export class ProductStoreEntity {
    @ManyToOne(() => ProductEntity, (product) => product.productStores, {
        eager: true,
    })
    product: ProductEntity

    @ManyToOne(() => StoreEntity, (store) => store.storeProducts, {
        eager: true,
    })
    store: StoreEntity

    @Column()
    quantity: number

    @CreateDateColumn()
    _createdAt: Date

    @UpdateDateColumn()
    _updatedAt: Date

    @VersionColumn({ default: 1 })
    _version: number
}
