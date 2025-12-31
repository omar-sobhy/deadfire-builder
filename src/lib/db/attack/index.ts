import type { GenericAttackDto } from '$lib/dtos/attack/base-attack.dto.js';
import { Model } from '../model.js';

export class Attack extends Model<GenericAttackDto> {
  public readonly tableName = 'attacks';
}
