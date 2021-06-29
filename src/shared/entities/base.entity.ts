import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm'

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    _createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    _updatedAt: Date

    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at' })
    _deletedAt?: Date

    @VersionColumn({ default: 1, name: 'version' })
    _version: number

    /**
     * If you want to delete entity - use softDelete/softRemove
     * https://typeorm.io/#/repository-api
     */
    get isDeleted(): boolean {
        return this._deletedAt != undefined
    }

    constructor(partial: Partial<BaseEntity>) {
        Object.assign(this, partial)
    }
}
