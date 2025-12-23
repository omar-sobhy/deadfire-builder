import {
  cultureGameDataSchema,
  type CultureGameData,
} from '$lib/parsing/schemas/culture/culture.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class CultureParser extends Parser<CultureGameData> {
  public override parser = cultureGameDataSchema;

  public override async toDto() {
    const cultures = this.transaction.objectStore('cultures');
    const guiStrings = this.transaction.objectStore('guiStrings');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      const displayName = await guiStrings.get(component.DisplayName);

      if (!displayName) {
        Logger.getInstance().warn(`[Culture] ${data.ID} has no display name`);
      }

      cultures.put(
        {
          id: data.ID,
          resolve: component.Resolve,
          might: component.Might,
          constitution: component.Constitution,
          dexterity: component.Dexterity,
          intellect: component.Intellect,
          perception: component.Perception,
          displayName: displayName?.defaultText,
        },
        data.ID,
      );
    }

  }
}
