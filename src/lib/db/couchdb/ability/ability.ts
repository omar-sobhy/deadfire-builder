import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import { CouchdbModel } from '../model.js';

export class Ability extends CouchdbModel<AbilityDto> {
  public override readonly dbName = 'abilities';
}
