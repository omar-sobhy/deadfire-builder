import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import { CouchdbModel } from '../model.js';

export class Race extends CouchdbModel<RaceDto> {
  public readonly dbName = 'races';
}
