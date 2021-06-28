import { Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { OrderEntity } from '../../orders/entites/order.entity'
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

    @ManyToOne(() => OrderEntity, {
        nullable: true,
    })
    order?: OrderEntity
}
