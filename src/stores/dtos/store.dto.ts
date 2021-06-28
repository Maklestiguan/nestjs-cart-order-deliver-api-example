import { OmitType, PickType } from '@nestjs/graphql'
import { IsNotEmpty, IsPositive } from 'class-validator'

export class StoreDto {
    @IsPositive()
    readonly storeId: number

    @IsNotEmpty()
    readonly name: string

    @IsNotEmpty()
    readonly description: string

    @IsNotEmpty()
    readonly address: string
}

export class ConciseStoreDto extends PickType(StoreDto, [
    'storeId',
    'name',
] as const) {}
export class CreateStoreDto extends OmitType(StoreDto, ['storeId'] as const) {}
