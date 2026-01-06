import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import { CouchdbModel } from '../model.js';

export class StatusEffectManager extends CouchdbModel<StatusEffectManagerEntryDto> {
  public override readonly dbName = 'status_effect_manager';
}
