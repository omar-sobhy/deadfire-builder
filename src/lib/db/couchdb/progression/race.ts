import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import { CouchdbModel } from '../model.js';

export class RaceUnlock extends CouchdbModel<AbilityUnlockDto[]> {
  public override readonly dbName = 'race_unlocks';
}
