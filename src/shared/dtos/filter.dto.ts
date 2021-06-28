import { IsPositive, Min } from 'class-validator'

const DEFAULT_TAKE = 20

export class FilterDto {
    @IsPositive({ each: true })
    ids?: number[]

    @Min(1)
    take?: number = DEFAULT_TAKE

    @Min(0)
    skip?: number = 0
}
