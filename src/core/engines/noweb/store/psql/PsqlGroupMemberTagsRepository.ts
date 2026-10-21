import {
  GroupMemberTag,
  INowebGroupMemberTagsRepository,
} from '@waha/core/engines/noweb/store/INowebGroupMemberTagsRepository';
import { NowebGroupMemberTagsSchema } from '@waha/core/engines/noweb/store/schemas';

import { NOWEBPsqlKVRepository } from './NOWEBPsqlKVRepository';

export class PsqlGroupMemberTagsRepository
  extends NOWEBPsqlKVRepository<GroupMemberTag>
  implements INowebGroupMemberTagsRepository
{
  get schema() {
    return NowebGroupMemberTagsSchema;
  }

  getAllByGroup(groupId: string): Promise<GroupMemberTag[]> {
    return this.getAllBy({ groupId: groupId });
  }

  deleteByGroup(groupId: string): Promise<void> {
    return this.deleteBy({ groupId: groupId });
  }
}
