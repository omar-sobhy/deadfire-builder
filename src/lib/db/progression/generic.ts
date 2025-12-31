import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import { Model } from '../model.js';

export abstract class GenericUnlock extends Model<AbilityUnlockDto[]> {
  public abstract readonly tableName:
    | 'class_unlocks'
    | 'subclass_unlocks'
    | 'race_unlocks'
    | 'subrace_unlocks';
}
