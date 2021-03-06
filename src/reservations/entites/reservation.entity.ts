import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { OrderEntity } from '../../orders/entites/order.entity'
import { ProductEntity } from '../../products/entities/product.entity'
import { BaseEntity } from '../../shared/entities/base.entity'
import { StoreEntity } from '../../stores/entities/store.entity'

@Entity('reservations')
export class ReservationEntity extends BaseEntity {
    @ManyToOne(() => StoreEntity, { eager: true })
    @JoinColumn()
    store: StoreEntity

    @ManyToOne(() => ProductEntity, { eager: true })
    @JoinColumn()
    product: ProductEntity

    @Column()
    quantity: number

    @ManyToOne(() => OrderEntity, {
        // XXX: afaik relations are nullable by default, but let's not think too much about it rn...
        nullable: true,
        cascade: ['update', 'soft-remove', 'recover'],
    })
    order?: OrderEntity
}
