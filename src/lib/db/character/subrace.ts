import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import { Model } from '../model.js';

export class Subrace extends Model<SubraceDto> {
  public readonly tableName = 'subraces';
}
