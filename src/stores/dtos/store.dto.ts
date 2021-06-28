import { OmitType, PickType } from '@nestjs/graphql'
import { IsNotEmpty, IsPositive } from 'class-validator'

export class StoreDto {
    @IsPositive()
    readonly id: number

    @IsNotEmpty()
    readonly name: string

    @IsNotEmpty()
    readonly description: string

    @IsNotEmpty()
    readonly address: string
}

export class ConciseStoreDto extends PickType(StoreDto, [
    'id',
    'name',
] as const) {}
export class CreateStoreDto extends OmitType(StoreDto, ['id'] as const) {}
