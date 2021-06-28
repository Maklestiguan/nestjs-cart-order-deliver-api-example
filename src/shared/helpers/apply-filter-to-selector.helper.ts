import { BaseEntity } from '../entities/base.entity'
import { FindConditions, FindManyOptions, In } from 'typeorm'
import { FilterDto } from '../dtos/filter.dto'

/**
 *
 * @param entityFieldsSelector optional object with entity related fields to filter by
 * @param filter objects with `ids`, `take` and `limit`
 * @returns mix of given object, new selector which can be applied to `.find()` method of typeorm repository
 */
export function applyFilterToSelector<T extends BaseEntity>(
    entityFieldsSelector: FindConditions<T> = {},
    filter: FilterDto,
): FindManyOptions<T> {
    const { ids, skip, take } = filter

    const filterFieldsSelector: FindConditions<BaseEntity> = {}
    if (ids?.length) {
        filterFieldsSelector.id = In(ids)
    }

    return {
        where: { ...entityFieldsSelector, ...filterFieldsSelector },
        take,
        skip,
    }
}
