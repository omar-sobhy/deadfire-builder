import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import { CouchdbModel } from '../model.js';

export class SubclassUnlock extends CouchdbModel<AbilityUnlockDto[]> {
  public override readonly dbName = 'subclass_unlocks';
}
