import { PhoneNumbersCacheRepository } from '@waha/apps/phone-numbers/storage/PhoneNumbersCacheRepository';

export class BrazilianPhoneNumbersCacheRepository extends PhoneNumbersCacheRepository {
  static tableName = 'app_brazilian_phone_numbers_cache';
}
