import type { Knex } from 'knex';
import { Model } from '../model.js';
import type { StringTableEntry } from '../../../types/gamedata/stringtable.js';
import type { Tables } from 'knex/types/tables.js';

export class GenericStringTable extends Model<StringTableEntry> {
  public constructor(
    public readonly db: Knex,
    public readonly tableName: keyof Tables,
  ) {
    super(db);
  }
}
