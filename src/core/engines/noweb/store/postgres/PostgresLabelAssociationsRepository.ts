import {
    LabelAssociation,
    LabelAssociationType,
} from '@adiwajshing/baileys/lib/Types/LabelAssociation';
import { ILabelAssociationRepository } from '@waha/core/engines/noweb/store/ILabelAssociationsRepository';
import { NowebLabelAssociationsMetadata } from '@waha/core/engines/noweb/store/metadata';
import { NowebLabelAssociationsSchema } from '@waha/core/engines/noweb/store/schemas';
import { SqlLabelAssociationsMethods } from '@waha/core/engines/noweb/store/sql/SqlLabelAssociationsMethods';

import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

export class PostgresLabelAssociationsRepository
    extends NOWEBPostgresKVRepository<LabelAssociation>
    implements ILabelAssociationRepository {
    get schema() {
        return NowebLabelAssociationsSchema;
    }

    get metadata() {
        return NowebLabelAssociationsMetadata;
    }

    get methods() {
        return new SqlLabelAssociationsMethods(this);
    }

    async deleteOne(association: LabelAssociation): Promise<void> {
        return this.methods.deleteOne(association);
    }

    async deleteByLabelId(labelId: string): Promise<void> {
        return this.methods.deleteByLabelId(labelId);
    }

    getAssociationsByLabelId(
        labelId: string,
        type: LabelAssociationType,
    ): Promise<LabelAssociation[]> {
        return this.methods.getAssociationsByLabelId(labelId, type);
    }

    getAssociationsByChatId(chatId: string): Promise<LabelAssociation[]> {
        return this.methods.getAssociationsByChatId(chatId);
    }
}
