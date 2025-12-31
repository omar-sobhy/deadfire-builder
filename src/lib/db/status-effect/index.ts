import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { Model } from '../model.js';

export class StatusEffect extends Model<StatusEffectDto> {
  public readonly tableName = 'status_effects';
}
