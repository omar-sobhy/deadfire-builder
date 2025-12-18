import { ItemModModel } from '../../../../src/lib/db/index.ts';
import {
  itemModGameDataSchema,
  type ItemModGameData,
} from '../../schemas/items/item-mod.gamedata.ts';
import { Parser } from '../parser.ts';

export class ItemModParser extends Parser<
  ItemModGameData,
  ItemModModel,
  typeof ItemModModel
> {
  public readonly type = 'Game.GameData.ItemModGameData';

  public readonly model = ItemModModel;

  public parse(o: unknown) {
    const data = itemModGameDataSchema.parse(o);

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
      },
    };
  }

  public async bulkCreate() {
    return ItemModModel.bulkCreate(this.parsed);
  }
}
