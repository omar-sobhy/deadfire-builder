import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import { CouchdbModel } from '../model.js';

export class Culture extends CouchdbModel<CultureDto> {
  public readonly dbName = 'cultures';
}
