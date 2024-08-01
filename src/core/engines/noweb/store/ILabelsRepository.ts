import { Contact } from '@adiwajshing/baileys';
import { Label } from '@adiwajshing/baileys/lib/Types/Label';

export interface ILabelsRepository {
  getById(id: string): Promise<Label | null>;

  getAll(): Promise<Label[]>;

  getAllByIds(ids: string[]): Promise<Label[]>;

  deleteById(id: string): Promise<void>;

  save(label: Label): Promise<void>;
}
