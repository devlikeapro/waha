export class GroupMemberTag {
  id: string;
  groupId: string;
  memberId: string;
  // empty when the tag was removed, kept for the last-write-wins check
  tag: string;
  timestamp: number;
}

export function GroupMemberTagId(groupId: string, memberId: string): string {
  return `${groupId}_${memberId}`;
}

export interface INowebGroupMemberTagsRepository {
  getById(id: string): Promise<GroupMemberTag | null>;

  getAllByGroup(groupId: string): Promise<GroupMemberTag[]>;

  upsertOne(tag: GroupMemberTag): Promise<void>;

  upsertMany(tags: GroupMemberTag[]): Promise<void>;

  deleteById(id: string): Promise<void>;

  deleteByGroup(groupId: string): Promise<void>;
}
