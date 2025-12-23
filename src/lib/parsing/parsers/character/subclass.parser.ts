import type { CharacterSubclassComponent } from '$lib/parsing/schemas/classes/components/character-subclass.component.js';
import {
  characterSubclassGameDataSchema,
  type CharacterSubclassGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class SubclassParser extends Parser<CharacterSubclassGameData> {
  public override parser = characterSubclassGameDataSchema;

  public override async toDto() {
    const subclassUnlocks = this.transaction.objectStore('subclassUnlocks');
    const subclasses = this.transaction.objectStore('subclasses');
    const guiStrings = this.transaction.objectStore('guiStrings');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) =>
        c.$type.includes('CharacterSubClassComponent'),
      ) as CharacterSubclassComponent | undefined;

      if (!component) {
        Logger.getInstance().warn(`[Subclass] ${data.ID} has no CharacterSubClassComponent`);
        continue;
      }

      const abilities = await subclassUnlocks.get(data.ID);
      if (!abilities) {
        Logger.getInstance().warn(`[Subclass] ${data.ID} has no unlocked abilities`);
      }

      const displayName = await guiStrings.get(component.DisplayName);

      await subclasses.put(
        {
          id: data.ID,
          abilities: abilities ?? [],
          classId: component.ForClassID,
          displayName: displayName?.defaultText,
        },
        data.ID,
      );
    }

  }
}
