import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import { CouchdbModel } from '../model.js';

export class Item extends CouchdbModel<ItemDto> {
  public override readonly dbName = 'items';
}
