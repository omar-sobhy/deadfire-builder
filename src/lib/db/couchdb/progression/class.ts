import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import { CouchdbModel } from '../model.js';

export class ClassUnlock extends CouchdbModel<AbilityUnlockDto[]> {
  public override readonly dbName = 'class_unlocks';
}
