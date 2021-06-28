/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

// XXX: Above is intended since it's a decorator

import BigNumber from 'bignumber.js'
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator'
const name = 'MinBigNumber'

@ValidatorConstraint({ name, async: false })
export class MinBigNumberConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const {
            constraints: [minValue],
        } = args
        return (
            BigNumber.isBigNumber(value) &&
            value.isGreaterThanOrEqualTo(minValue)
        ) // for async validations you must return a Promise<boolean> here
    }

    defaultMessage(args: ValidationArguments): string {
        const {
            constraints: [minValue],
            property,
        } = args
        return `${property} must not be less than ${minValue}`
    }
}

export function MinBigNumber(
    property: number,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            name,
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: MinBigNumberConstraint,
        })
    }
}
