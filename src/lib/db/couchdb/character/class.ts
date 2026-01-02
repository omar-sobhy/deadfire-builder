import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import { CouchdbModel } from '../model.js';

export class Class extends CouchdbModel<ClassDto> {
  public override readonly dbName = 'classes';
}
