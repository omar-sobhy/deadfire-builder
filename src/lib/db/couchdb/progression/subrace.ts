import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import { CouchdbModel } from '../model.js';

export class SubraceUnlock extends CouchdbModel<AbilityUnlockDto[]> {
  public override readonly dbName = 'subrace_unlocks';
}
