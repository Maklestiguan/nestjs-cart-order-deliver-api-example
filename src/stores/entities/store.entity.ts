import { BaseEntity } from '../../shared/entities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { ProductStoreEntity } from '../../products/entities/product-store.entity'

@Entity('stores')
export class StoreEntity extends BaseEntity {
    @Column()
    name: string

    @Column({ default: 'Common description for ordinary store' })
    description: string

    @Column({ default: 'Unknown address' })
    address: string

    @OneToMany(() => ProductStoreEntity, (productStore) => productStore.store)
    storeProducts: ProductStoreEntity[]
}
