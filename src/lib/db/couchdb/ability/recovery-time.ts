import type { RecoveryTimeDto } from '$lib/dtos/attack/recovery-time.dto.js';
import { CouchdbModel } from '../model.js';

export class RecoveryTime extends CouchdbModel<RecoveryTimeDto> {
  public override readonly dbName = 'recovery_times';
}
