import type {
  SignalDataSet,
  SignalDataTypeMap,
  SignalKeyStore,
} from '@adiwajshing/baileys';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import { Subject } from 'rxjs';

// Baileys storeLIDPNMappings (src/Signal/lid-mapping.ts) writes
// <pnUser> => <lidUser> and <lidUser>_reverse => <pnUser>
const LID_MAPPING: keyof SignalDataTypeMap = 'lid-mapping';
const REVERSE_SUFFIX = '_reverse';
const DIGITS = /^\d+$/;

/**
 * SignalKeyStore wrapper that emits LID-PN pairs Baileys writes without an event (usync on send, history sync)
 */
export class LidMappingKeyStore implements SignalKeyStore {
  readonly lids$ = new Subject<LidToPhoneNumber>();

  constructor(private keys: SignalKeyStore) {}

  get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]) {
    return this.keys.get(type, ids);
  }

  async set(data: SignalDataSet) {
    await this.keys.set(data);
    const mappings = data[LID_MAPPING];
    if (!mappings) {
      return;
    }
    for (const [pnUser, value] of Object.entries(mappings)) {
      // null removes the key
      if (value == null || pnUser.endsWith(REVERSE_SUFFIX)) {
        continue;
      }
      // fails the build if Baileys changes the value type
      const lidUser: string = value;
      if (!DIGITS.test(pnUser) || !DIGITS.test(lidUser)) {
        continue;
      }
      this.lids$.next({
        lid: `${lidUser}@lid`,
        pn: `${pnUser}@s.whatsapp.net`,
      });
    }
  }

  clear() {
    return this.keys.clear?.();
  }
}
