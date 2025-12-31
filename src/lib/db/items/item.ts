import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import { Model } from '../model.js';

export class Item extends Model<ItemDto> {
  public readonly tableName = 'items';
}
