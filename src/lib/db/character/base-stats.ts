import type { BaseStatsDto } from '$lib/dtos/character/base-stats.dto.js';
import { Model } from '../model.js';

export class BaseStats extends Model<BaseStatsDto> {
  public readonly tableName = 'baseStats';
}
