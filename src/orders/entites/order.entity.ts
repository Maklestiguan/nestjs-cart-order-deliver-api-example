import BigNumber from 'bignumber.js'
import { Column, JoinColumn, OneToMany } from 'typeorm'
import { ReservationEntity } from '../../reservations/entites/reservation.entity'
import { BaseEntity } from '../../shared/entities/base.entity'
import { BigNumberFieldTransformer } from '../../shared/transformers/bignumber-field.transformer'

export class OrderEntity extends BaseEntity {
    @Column()
    orderNumber: string

    @Column({
        type: 'decimal',
        transformer: new BigNumberFieldTransformer(),
    })
    price: BigNumber

    @Column()
    deliveryAddress: string

    @Column()
    deliveryDate: Date

    @OneToMany(() => ReservationEntity, (reservation) => reservation.order, {
        eager: true,
    })
    @JoinColumn()
    positions: ReservationEntity[]
}
