import { AfterUpdate, Column, Entity } from 'typeorm'
import { BaseEntity } from '../../shared/entities/base.entity'

@Entity('store_slots')
export class StoreSlotsEntity extends BaseEntity {
    @Column()
    deliveryDate: Date

    // TODO: add database locks on possible concurrent requests
    @Column()
    slots: number

    @AfterUpdate()
    hideFromAvailable(): void {
        if (this.slots === 0) {
            this._deletedAt = new Date()
        }
    }
}
