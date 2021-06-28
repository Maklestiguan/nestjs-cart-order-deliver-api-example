import { AfterUpdate, Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../shared/entities/base.entity'
import { StoreEntity } from './store.entity'

@Entity('store_slots')
export class StoreSlotsEntity extends BaseEntity {
    @ManyToOne(() => StoreEntity)
    store: StoreEntity

    @Column({ type: 'date' })
    deliveryDate: Date

    // TODO: add database locks on possible concurrent requests ?
    @Column()
    available: number

    @AfterUpdate()
    hideFromAvailable(): void {
        if (this.available === 0) {
            this._deletedAt = new Date()
        }
    }
}
