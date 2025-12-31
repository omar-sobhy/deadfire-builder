import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import { Model } from '../model.js';

export class Ability extends Model<AbilityDto> {
  public readonly tableName = 'abilities';
}
