import {
  genericAbilityGameDataSchema,
  type GenericAbilityGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class GenericAbilityParser extends Parser<GenericAbilityGameData> {
  public override readonly parser = genericAbilityGameDataSchema;

  public override async parseDtos() {
    const { abilities, abilityStrings, statusEffects } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components.find((c) => c.$type === 'GenericAbilityComponent');

      if (!component) {
        Logger.getInstance().warn(
          `[Ability] ${data.DebugName} (${data.ID}) has no GenericAbilityComponent`,
        );
        continue;
      }

      const statusEffectsForAbility = component.StatusEffectsIDs.map((s) => statusEffects[s]);

      const description = abilityStrings[component.Description];
      const displayName = abilityStrings[component.DisplayName];

      const upgradeDescriptions = component.UpgradeDescriptions.map(
        (s) => abilityStrings[s.String]?.defaultText ?? 'Unknown description',
      );

      abilities[data.ID] = {
        id: data.ID,
        debugName: data.DebugName,
        icon: component.Icon,
        statusEffects: statusEffectsForAbility,
        isPassive: component.IsPassive,
        description: description?.defaultText,
        displayName: displayName?.defaultText,
        upgradeDescriptions,
      };
    }
  }
}
