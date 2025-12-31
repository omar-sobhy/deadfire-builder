import type { ItemModDto } from '$lib/dtos/items/item-mod.dto.js';
import { Model } from '../model.js';

export class ItemMod extends Model<ItemModDto> {
  public readonly tableName = 'item_mods';
}
