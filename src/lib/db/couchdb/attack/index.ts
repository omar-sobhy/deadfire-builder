import type { GenericAttackDto } from '$lib/dtos/attack/base-attack.dto.js';
import { CouchdbModel } from '../model.js';

export class Attack extends CouchdbModel<GenericAttackDto> {
  public override readonly dbName = 'attacks';
}
