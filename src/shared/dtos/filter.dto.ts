import { IsOptional, IsPositive, Min } from 'class-validator'

const DEFAULT_TAKE = 20

export class FilterDto {
    @IsPositive({ each: true })
    @IsOptional()
    ids?: number[]

    @Min(1)
    @IsOptional()
    take?: number = DEFAULT_TAKE

    @Min(0)
    @IsOptional()
    skip?: number = 0
}
