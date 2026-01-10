import {
  characterClassGameDataSchema,
  type CharacterClassGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class ClassParser extends Parser<CharacterClassGameData> {
  public override parser = characterClassGameDataSchema;

  public override async parseDtos(): Promise<void> {
    const { classes, classUnlocks, guiStrings, cyclopediaStrings } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) => c.$type === 'CharacterClassComponent');

      if (!component) {
        Logger.getInstance().warn(`[Class] ${data.ID} has no CharacterClassComponent`);
        continue;
      }

      const abilities = classUnlocks[data.ID];

      if (!abilities) {
        Logger.getInstance().warn(
          `[Class] ${data.DebugName} (${data.ID}) has no unlocked abilities`,
        );
      }

      const description = guiStrings[component.DescriptionText];
      const displayName = guiStrings[component.DisplayName];
      const summary = cyclopediaStrings[component.SummaryText];

      classes[data.ID] = {
        id: data.ID,
        icon: component.Icon,
        abilities: abilities ?? [],
        description: description?.defaultText,
        displayName: displayName?.defaultText,
        summary: summary?.defaultText,
        requiresSubclass: component.RequireSubclass,
      };
    }
  }
}
