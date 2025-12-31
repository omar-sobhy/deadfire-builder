import type { AfflictionDto } from '$lib/dtos/status-effect/affliction.dto.js';
import {
  afflictionGameDataSchema,
  type AfflictionGameData,
} from '$lib/parsing/schemas/status-effect/gamedata/affliction.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';
import { StatusEffectParser } from './status-effect.parser.js';

export class AfflictionParser extends Parser<AfflictionGameData> {
  public override readonly parser = afflictionGameDataSchema;

  public override async parseDtos() {
    const { statusEffectStrings, statusEffects, guiStrings } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const affliction = data.Components.find((c) => c.$type === 'AfflictionComponent');
      if (!affliction) {
        Logger.getInstance().warn(
          `[Affliction] ${data.DebugName} (${data.ID}) has no AfflictionComponent`,
        );
        continue;
      }

      const statusEffect = data.Components.find((c) => c.$type === 'StatusEffectComponent');
      if (!statusEffect) {
        Logger.getInstance().warn(
          `[Affliction] ${data.DebugName} (${data.ID}) has no StatusEffectComponent`,
        );
        continue;
      }

      const displayName = guiStrings[affliction.DisplayName];

      const descriptionId = statusEffect.OverrideDescriptionString;
      const description = descriptionId === -1 ? statusEffectStrings[descriptionId] : undefined;

      const partialDto = StatusEffectParser.statusEffectToPartialDto(statusEffect);

      const afflictionDto: AfflictionDto = {
        ...partialDto,
        icon: affliction.Icon,
        id: data.ID,
        debugName: data.DebugName,
        displayName: displayName?.defaultText ?? 'Unknown affliction name',
        afflictionTypeId: affliction.AfflictionTypeID,
        description: description?.defaultText,
      };

      statusEffects[data.ID] = afflictionDto;
    }
  }
}
