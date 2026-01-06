import { subraceGameDataSchema, type SubraceGameData } from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class SubraceParser extends Parser<SubraceGameData> {
  public override readonly parser = subraceGameDataSchema;

  public override async parseDtos() {
    const { guiStrings, cyclopediaStrings, subraceUnlocks, subraces } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      const displayName = guiStrings[component.DisplayName];
      const description = guiStrings[component.DescriptionText];
      const summary = cyclopediaStrings[component.SummaryText];

      const abilities = subraceUnlocks[component.Type];
      if (!abilities) {
        Logger.getInstance().warn(
          `[Subrace] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      subraces[data.ID] = {
        id: data.ID,
        raceId: component.RaceID,
        abilities: abilities ?? [],
        displayName: displayName?.defaultText,
        description: description?.defaultText,
        summary: summary?.defaultText,
      };
    }
  }
}
