import type { BaseStatsDto } from '$lib/dtos/character/base-stats.dto.js';
import { CouchdbModel } from '../model.js';

export class BaseStats extends CouchdbModel<BaseStatsDto> {
  public readonly dbName = 'base_stats';
}
