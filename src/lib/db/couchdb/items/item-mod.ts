import type { ItemModDto } from '$lib/dtos/items/item-mod.dto.js';
import { CouchdbModel } from '../model.js';

export class ItemMod extends CouchdbModel<ItemModDto> {
  public override readonly dbName = 'item_mods';
}
