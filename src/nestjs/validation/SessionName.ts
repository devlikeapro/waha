import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength } from 'class-validator';

// Affect almost all Databases - Sqlite, MongoDB, Postgres.
const DB_NAME_LIMIT = 64;
const DB_NAME_MAX_PREFIX_LEN = 'waha_noweb'.length;

export function SessionName() {
  return applyDecorators(
    IsString(),
    MaxLength(DB_NAME_LIMIT - DB_NAME_MAX_PREFIX_LEN),
    Matches(/^[a-zA-Z0-9_-]*$/, {
      message:
        'Session name can only contain alphanumeric characters, hyphens, and underscores (a-z, A-Z, 0-9, -, _) or be empty',
    }),
  );
}
