import {
  GroupMemberTag,
  INowebGroupMemberTagsRepository,
} from '@waha/core/engines/noweb/store/INowebGroupMemberTagsRepository';

import { MongoRepository } from './MongoRepository';

export class MongoGroupMemberTagsRepository
  extends MongoRepository<GroupMemberTag>
  implements INowebGroupMemberTagsRepository
{
  getAllByGroup(groupId: string): Promise<GroupMemberTag[]> {
    return this.getAllBy({ groupId: groupId });
  }

  deleteByGroup(groupId: string): Promise<void> {
    return this.deleteBy({ groupId: groupId });
  }
}
