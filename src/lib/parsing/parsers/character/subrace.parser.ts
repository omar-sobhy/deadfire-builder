import { subraceGameDataSchema, type SubraceGameData } from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class SubraceParser extends Parser<SubraceGameData> {
  public override readonly parser = subraceGameDataSchema;

  public override async toDto() {
    const subraces = this.transaction.objectStore('subraces');
    const subraceUnlocks = this.transaction.objectStore('subraceUnlocks');
    const guiStrings = this.transaction.objectStore('guiStrings');
    const cyclopediaStrings = this.transaction.objectStore('cyclopediaStrings');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      const displayName = await guiStrings.get(component.DisplayName);
      const description = await guiStrings.get(component.DescriptionText);
      const summary = await cyclopediaStrings.get(component.SummaryText);

      const abilities = await subraceUnlocks.get(component.Type);

      if (!abilities) {
        Logger.getInstance().warn(
          `[Subrace] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      subraces.put(
        {
          id: data.ID,
          raceId: component.RaceID,
          abilities: abilities ?? [],
          displayName: displayName?.defaultText,
          description: description?.defaultText,
          summary: summary?.defaultText,
        },
        data.ID,
      );
    }
  }
}
