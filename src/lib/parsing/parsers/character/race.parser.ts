import { raceGameDataSchema, type RaceGameData } from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class RaceParser extends Parser<RaceGameData> {
  public override parser = raceGameDataSchema;

  public override async parseDtos() {
    const { guiStrings, raceUnlocks, races } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      const displayName = guiStrings[component.DisplayName];

      const abilities = raceUnlocks[data.ID];

      if (!abilities) {
        Logger.getInstance().warn(
          `[Race] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      races[data.ID] = {
        id: data.ID,
        resolve: component.Resolve,
        might: component.Might,
        constitution: component.Constitution,
        dexterity: component.Dexterity,
        intellect: component.Intellect,
        perception: component.Perception,
        isKith: component.IsKith,
        abilities: abilities ?? [],
        subRaceIds: component.CharacterCreationSubracesIDs,
        displayName: displayName?.defaultText,
      };
    }
  }
}
