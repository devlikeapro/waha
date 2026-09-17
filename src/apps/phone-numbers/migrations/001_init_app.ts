import { migrations_001_init_cache } from '@waha/apps/phone-numbers/storage/migrations_001_init_cache';

const migration = migrations_001_init_cache({
  table: 'app_phone_numbers_cache',
  index: 'phone',
});

exports.up = migration.up;
exports.down = migration.down;
