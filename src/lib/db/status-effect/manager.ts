import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import { Model } from '../model.js';

export class StatusEffectManager extends Model<StatusEffectManagerEntryDto> {
  public readonly tableName = 'status_effect_manager';
}
