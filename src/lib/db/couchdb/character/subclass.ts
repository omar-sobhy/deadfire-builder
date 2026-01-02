import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import { CouchdbModel } from '../model.js';

export class Subclass extends CouchdbModel<SubclassDto> {
  public readonly dbName = 'subclasses';
}
