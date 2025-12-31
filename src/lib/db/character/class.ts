import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import { Model } from '../model.js';

export class Class extends Model<ClassDto> {
  public readonly tableName = 'classes';
}
