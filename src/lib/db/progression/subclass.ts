import { GenericUnlock } from './generic.js';

export class SubclassUnlock extends GenericUnlock {
  public readonly tableName = 'subclass_unlocks';
}
