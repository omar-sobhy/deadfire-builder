import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import { CouchdbModel } from '../model.js';

export class Subrace extends CouchdbModel<SubraceDto> {
  public readonly dbName = 'subraces';
}
