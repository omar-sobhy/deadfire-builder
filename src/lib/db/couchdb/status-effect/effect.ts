import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { CouchdbModel } from '../model.js';

export class StatusEffect extends CouchdbModel<StatusEffectDto> {
  public override readonly dbName = 'status_effects';
}
