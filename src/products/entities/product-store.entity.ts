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

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    _createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    _updatedAt: Date

    @VersionColumn({ default: 1, name: 'version' })
    _version: number
}
