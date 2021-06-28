import BigNumber from 'bignumber.js'
import { BigNumberFieldTransformer } from 'src/shared/transformers/bignumber-field.transformer'
import { Column, OneToMany } from 'typeorm'
import { BaseEntity } from '../../shared/entities/base.entity'
import { ProductStoreEntity } from './product-store.entity'

export class ProductEntity extends BaseEntity {
    @Column()
    name: string

    @Column({
        type: 'decimal',
        transformer: new BigNumberFieldTransformer(),
    })
    price: BigNumber

    @Column({ nullable: true })
    imageUrl?: string

    @OneToMany(() => ProductStoreEntity, (productStore) => productStore.product)
    productStores: ProductStoreEntity[]
}
