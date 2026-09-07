import { BadRequestException } from '@nestjs/common';

export function assertGowsGroupTextIsNotEmpty(
  value: string,
  field: 'description' | 'subject',
): void {
  if (typeof value === 'string' && value.trim().length > 0) {
    return;
  }

  throw new BadRequestException(
    `GOWS does not support empty group ${field}.`,
  );
}
