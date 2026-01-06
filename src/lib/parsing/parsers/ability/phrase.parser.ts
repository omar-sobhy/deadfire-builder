import {
  phraseGameDataSchema,
  type PhraseGameData,
} from '$lib/parsing/schemas/abilities/gamedata/phrase.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class PhraseParser extends Parser<PhraseGameData> {
  public override readonly parser = phraseGameDataSchema;

  public override async parseDtos() {
    const { abilities, abilityStrings, statusEffects } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) => c.$type === 'PhraseComponent');

      if (!component) {
        Logger.getInstance().warn(
          `[Ability] ${data.DebugName} (${data.ID}) has no PhraseComponent`,
        );
        continue;
      }

      const description = abilityStrings[component.Description];
      const displayName = abilityStrings[component.DisplayName];

      const mapped = component.StatusEffectsIDs.map((s) => statusEffects[s]);

      abilities[data.ID] = {
        id: data.ID,
        debugName: data.DebugName,
        icon: component.Icon,
        statusEffects: mapped,
        description: description?.defaultText,
        displayName: displayName?.defaultText,
      };
    }
  }
}
