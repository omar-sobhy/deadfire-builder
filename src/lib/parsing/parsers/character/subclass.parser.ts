import type { CharacterSubclassComponent } from '$lib/parsing/schemas/classes/components/character-subclass.component.js';
import {
  characterSubclassGameDataSchema,
  type CharacterSubclassGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class SubclassParser extends Parser<CharacterSubclassGameData> {
  public override parser = characterSubclassGameDataSchema;

  public override async parseDtos() {
    const { subclasses, subclassUnlocks, guiStrings } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) =>
        c.$type.includes('CharacterSubClassComponent'),
      ) as CharacterSubclassComponent | undefined;

      if (!component) {
        Logger.getInstance().warn(
          `[Subclass] ${data.DebugName} (${data.ID}) has no CharacterSubClassComponent`,
        );
        continue;
      }

      const abilities = subclassUnlocks[data.ID];
      if (!abilities) {
        Logger.getInstance().warn(
          `[Subclass] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      const displayName = guiStrings[component.DisplayName];

      subclasses[data.ID] = {
        id: data.ID,
        abilities: abilities ?? [],
        classId: component.ForClassID,
        displayName: displayName?.defaultText,
      };
    }
  }
}
