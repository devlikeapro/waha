import { PhoneNumbersCorePlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersCorePlugin';

/**
 * GOWS local tier: the PN<->LID map (whatsmeow's 'whatsmeow_lid_map'), which is
 * populated from contact sync and received messages and persisted in the gows
 * store. A PN that has a LID mapping is a number this session already knows in
 * its canonical form, so the correct form is picked with zero
 * network calls. Only genuinely cold numbers fall through to the WhatsApp
 * lookup tier.
 */
export class PhoneNumbersGowsPlugin extends PhoneNumbersCorePlugin {
  protected async lookupKnownChatId(
    candidates: string[],
  ): Promise<string | null> {
    for (const candidate of candidates) {
      try {
        const { lid, pn } = await this.session.findLIDByPhoneNumber(candidate);
        // A non-empty LID user part means this exact PN is known locally.
        if (lid && lid.split('@')[0]) {
          return pn;
        }
      } catch (error) {
        this.logger.debug(
          `LID map lookup failed for candidate '${candidate}': ${error}`,
        );
      }
    }
    return null;
  }
}
