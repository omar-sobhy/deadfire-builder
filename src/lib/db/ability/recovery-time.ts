import type { RecoveryTimeDto } from '$lib/dtos/attack/recovery-time.dto.js';
import { Model } from '../model.js';

export class RecoveryTime extends Model<RecoveryTimeDto> {
  public readonly tableName = 'recovery_times';
}
