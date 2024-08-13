import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsDynamicObject(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsDynamicObject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object') {
            return false;
          }

          for (const key in value) {
            if (typeof key !== 'string' || typeof value[key] !== 'string') {
              return false;
            }
          }

          return true;
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments.property} accepts string key-value pairs only`;
        },
      },
    });
  };
}
