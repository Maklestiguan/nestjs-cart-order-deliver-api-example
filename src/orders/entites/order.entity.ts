import BigNumber from 'bignumber.js'
import { AfterInsert, Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { ReservationEntity } from '../../reservations/entites/reservation.entity'
import { BaseEntity } from '../../shared/entities/base.entity'
import { BigNumberFieldTransformer } from '../../shared/transformers/bignumber-field.transformer'

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @Column()
    clientId: number

    @Column({ unique: true })
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
        cascade: true,
    })
    @JoinColumn()
    positions: ReservationEntity[]

    @AfterInsert()
    calculatePrice(): void {
        this.price = this.positions.reduce(
            (acc, { product: { price }, quantity }) => {
                return acc.plus(price.multipliedBy(quantity))
            },
            new BigNumber(0),
        )
    }
}
