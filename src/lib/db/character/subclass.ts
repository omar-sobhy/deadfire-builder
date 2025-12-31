import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import { Model } from '../model.js';

export class Subclass extends Model<SubclassDto> {
  public readonly tableName = 'subclasses';
}
