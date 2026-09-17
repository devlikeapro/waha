import { PhoneNumbersCacheRepository } from '@waha/apps/phone-numbers/storage/PhoneNumbersCacheRepository';

export class MexicanPhoneNumbersCacheRepository extends PhoneNumbersCacheRepository {
  static tableName = 'app_mexican_phone_numbers_cache';
}
