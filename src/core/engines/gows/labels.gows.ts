import { Label, LabelChatAssociation } from '@waha/structures/labels.dto';

import * as gows from './types';
import { toCusFormat } from '@waha/core/utils/jids';

/**
 * Converts a GOWS LabelEdit event to a Label DTO
 */
export function eventToLabelDTO(labelEdit: gows.LabelEdit): Label {
  return {
    id: labelEdit.LabelID,
    name: labelEdit.Action.name,
    color: labelEdit.Action.color,
    colorHex: Label.toHex(labelEdit.Action.color),
    type: labelEdit.Action.type,
    isActive: labelEdit.Action.isActive,
  } as Label;
}

/**
 * Converts a GOWS LabelAssociationChat event to a LabelChatAssociation DTO
 */
export function eventToLabelChatAssociationDTO(
  labelAssoc: gows.LabelAssociationChat,
): LabelChatAssociation {
  return {
    labelId: labelAssoc.LabelID,
    label: null, // We don't have the label info here
    chatId: toCusFormat(labelAssoc.JID),
  };
}

/**
 * Checks if a LabelEdit event is for a label creation or update (not deletion)
 */
export function isLabelUpsertEvent(labelEdit: gows.LabelEdit): boolean {
  return !labelEdit.Action.deleted;
}

/**
 * Checks if a LabelAssociationChat event is for adding a label to a chat
 */
export function isLabelChatAddedEvent(
  labelAssoc: gows.LabelAssociationChat,
): boolean {
  return labelAssoc.Action.labeled === true;
}
