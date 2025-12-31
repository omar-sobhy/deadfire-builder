import type { IntervalRateDto } from '$lib/dtos/status-effect/interval-rate.dto.js';
import { Model } from '../model.js';

export class Interval extends Model<IntervalRateDto> {
  public readonly tableName = 'intervals';
}
