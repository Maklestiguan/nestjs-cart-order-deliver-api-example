import { Column, JoinColumn, OneToOne } from 'typeorm'
import { ProductEntity } from '../../products/entities/product.entity'
import { BaseEntity } from '../../shared/entities/base.entity'
import { StoreEntity } from '../../stores/entities/store.entity'

export class ReservationEntity extends BaseEntity {
    @OneToOne(() => StoreEntity, { eager: true })
    @JoinColumn()
    store: StoreEntity

    @OneToOne(() => ProductEntity, { eager: true })
    @JoinColumn()
    product: ProductEntity

    @Column()
    quantity: number
}
