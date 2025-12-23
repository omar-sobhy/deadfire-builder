import {
  genericAbilityGameDataSchema,
  type GenericAbilityGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class GenericAbilityParser extends Parser<GenericAbilityGameData> {
  public override readonly parser = genericAbilityGameDataSchema;

  public override async toDto() {
    const abilities = this.transaction.objectStore('abilities');
    const abilityStrings = this.transaction.objectStore('abilityStrings');
    const statusEffects = this.transaction.objectStore('statusEffects');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) => c.$type === 'GenericAbilityComponent');

      if (!component) {
        Logger.getInstance().warn(
          `[Ability] ${data.DebugName} (${data.ID}) has no GenericAbilityComponent`,
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
