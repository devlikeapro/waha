import {
  LabelAssociation,
  LabelAssociationType,
} from '@adiwajshing/baileys/lib/Types/LabelAssociation';

export interface ILabelAssociationRepository {
  deleteOne(association: LabelAssociation): Promise<void>;

  save(association: LabelAssociation): Promise<void>;

  deleteByLabelId(labelId: string): Promise<void>;

  getAssociationsByLabelId(
    labelId: string,
    type: LabelAssociationType,
  ): Promise<LabelAssociation[]>;

  getAssociationsByChatId(chatId: string): Promise<LabelAssociation[]>;
}
