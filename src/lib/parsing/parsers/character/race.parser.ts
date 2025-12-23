import { raceGameDataSchema, type RaceGameData } from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class RaceParser extends Parser<RaceGameData> {
  public override parser = raceGameDataSchema;

  public override async toDto() {
    const guiStrings = this.transaction.objectStore('guiStrings');
    const races = this.transaction.objectStore('races');
    const raceUnlocks = this.transaction.objectStore('raceUnlocks');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      const displayName = await guiStrings.get(component.DisplayName);

      const abilities = await raceUnlocks.get(data.ID);

      if (!abilities) {
        Logger.getInstance().warn(
          `[Race] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      await races.put(
        {
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
        },
        data.ID,
      );
    }
  }
}
