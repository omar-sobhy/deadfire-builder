import type { StringTableEntry } from '../../../../types/gamedata/stringtable.js';
import { CouchdbModel } from '../model.js';
import type { CreateOpts } from '../index.js';

export class GenericStringTable extends CouchdbModel<StringTableEntry> {
  public constructor(
    opts: CreateOpts,
    public readonly dbName: string,
  ) {
    super(opts);
  }
}
