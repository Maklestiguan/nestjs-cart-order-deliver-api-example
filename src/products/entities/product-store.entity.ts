import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm'
import { StoreEntity } from '../../stores/entities/store.entity'
import { ProductEntity } from './product.entity'

@Entity('products__stores')
export class ProductStoreEntity {
    @ManyToOne(() => ProductEntity, (product) => product.productStores, {
        primary: true,
        eager: true,
    })
    product: ProductEntity

    @ManyToOne(() => StoreEntity, (store) => store.storeProducts, {
        primary: true,
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
