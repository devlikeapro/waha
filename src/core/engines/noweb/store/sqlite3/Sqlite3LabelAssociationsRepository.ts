import {
  LabelAssociation,
  LabelAssociationType,
} from '@adiwajshing/baileys/lib/Types/LabelAssociation';
import { ILabelAssociationRepository } from '@waha/core/engines/noweb/store/ILabelAssociationsRepository';

import { NOWEBSqlite3KVRepository } from './NOWEBSqlite3KVRepository';

export class Sqlite3LabelAssociationsRepository
  extends NOWEBSqlite3KVRepository<LabelAssociation>
  implements ILabelAssociationRepository
{
  async deleteOne(association: LabelAssociation): Promise<void> {
    await this.deleteBy({
      type: association.type,
      chatId: association.chatId,
      labelId: association.labelId,
      // @ts-ignore: messageId doesn't existing in ChatLabelAssociation
      messageId: association.messageId || null,
    });
  }

  async deleteByLabelId(labelId: string): Promise<void> {
    await this.deleteBy({ labelId: labelId });
  }

  getAssociationsByLabelId(
    labelId: string,
    type: LabelAssociationType,
  ): Promise<LabelAssociation[]> {
    return this.getAllBy({
      type: type,
      labelId: labelId,
    });
  }

  getAssociationsByChatId(chatId: string): Promise<LabelAssociation[]> {
    return this.getAllBy({ chatId: chatId, type: LabelAssociationType.Chat });
  }
}
