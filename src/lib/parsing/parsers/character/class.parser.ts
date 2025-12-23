import {
  characterClassGameDataSchema,
  type CharacterClassGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class ClassParser extends Parser<CharacterClassGameData> {
  public override parser = characterClassGameDataSchema;

  public override async toDto(): Promise<void> {
    const classes = this.transaction.objectStore('classes');
    const classUnlocks = this.transaction.objectStore('classUnlocks');
    const guiStrings = this.transaction.objectStore('guiStrings');
    const cyclopediaStrings = this.transaction.objectStore('cyclopediaStrings');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) => c.$type === 'CharacterClassComponent');

      if (!component) {
        Logger.getInstance().warn(`[Class] ${data.ID} has no CharacterClassComponent`);
        continue;
      }

      const abilities = await classUnlocks.get(data.ID);

      if (!abilities) {
        Logger.getInstance().warn(
          `[Class] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      const description = await guiStrings.get(component.DescriptionText);
      const displayName = await guiStrings.get(component.DisplayName);
      const summary = await cyclopediaStrings.get(component.SummaryText);

      await classes.put(
        {
          id: data.ID,
          abilities: abilities ?? [],
          description: description?.defaultText,
          displayName: displayName?.defaultText,
          summary: summary?.defaultText,
        },
        data.ID,
      );
    }
  }
}
