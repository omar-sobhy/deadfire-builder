import {
  phraseGameDataSchema,
  type PhraseGameData,
} from '$lib/parsing/schemas/abilities/gamedata/phrase.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class PhraseParser extends Parser<PhraseGameData> {
  public override readonly parser = phraseGameDataSchema;

  public override async toDto() {
    const abilities = this.transaction.objectStore('abilities');
    const abilityStrings = this.transaction.objectStore('abilityStrings');
    const statusEffects = this.transaction.objectStore('statusEffects');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) => c.$type === 'PhraseComponent');

      if (!component) {
        Logger.getInstance().warn(
          `[Ability] ${data.DebugName} (${data.ID}) has no PhraseComponent`,
        );
        continue;
      }

      const description = await abilityStrings.get(component.Description);
      const displayName = await abilityStrings.get(component.DisplayName);
      const statusEffectsForAbility = await statusEffects.getAll(data.ID);
      const filtered = statusEffectsForAbility.filter((s) => s.type === 'generic');
      const mapped = filtered.map((s) => s.data);

      abilities.put(
        {
          id: data.ID,
          debugName: data.DebugName,
          icon: component.Icon,
          statusEffects: mapped,
          description: description?.defaultText,
          displayName: displayName?.defaultText,
        },
        data.ID,
      );
    }
  }
}
