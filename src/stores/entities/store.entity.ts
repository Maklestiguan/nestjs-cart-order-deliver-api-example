import { BaseEntity } from '../../shared/entities/base.entity'
import { Column } from 'typeorm'

export class StoreEntity extends BaseEntity {
    @Column()
    name: string

    @Column({ default: 'Common description for ordinary store' })
    description: string

    @Column({ default: 'Unknown address' })
    address: string
}
