import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import { Model } from '../model.js';

export class Race extends Model<RaceDto> {
  public readonly tableName = 'races';
}
