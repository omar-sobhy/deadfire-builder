import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import { Model } from '../model.js';

export class Culture extends Model<CultureDto> {
  public readonly tableName = 'cultures';
}
