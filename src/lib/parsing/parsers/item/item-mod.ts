import {
  itemModGameDataSchema,
  type ItemModGameData,
} from '$lib/parsing/schemas/items/item-mod.gamedata.js';
import { Parser } from '../parser.js';

export class ItemModParser extends Parser<ItemModGameData> {
  public override readonly parser = itemModGameDataSchema;

  public override async parseDtos() {
    const { itemMods, guiStrings } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      const displayName = guiStrings[component.DisplayName];

      itemMods[data.ID] = {
        id: data.ID,
        debugName: data.DebugName,
        displayName: displayName?.defaultText,
      };
    }
  }
}
