import type { IntervalRateDto } from '$lib/dtos/status-effect/interval-rate.dto.js';
import { CouchdbModel } from '../model.js';

export class Interval extends CouchdbModel<IntervalRateDto> {
  public override readonly dbName = 'intervals';
}
