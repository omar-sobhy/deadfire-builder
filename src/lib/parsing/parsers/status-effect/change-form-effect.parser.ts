import type { ChangeFormEffectDto } from '$lib/dtos/status-effect/change-form-effect.dto.js';
import {
  changeFormEffectGameDataSchema,
  type ChangeFormEffectGameData,
} from '$lib/parsing/schemas/status-effect/gamedata/change-form-effect.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';
import { StatusEffectParser } from './status-effect.parser.js';

export class ChangeFormEffectParser extends Parser<ChangeFormEffectGameData> {
  public override readonly parser = changeFormEffectGameDataSchema;

  public override async parseDtos() {
    const { statusEffects } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const changeFormEffect = data.Components.find((c) => c.$type === 'ChangeFormEffectComponent');
      if (!changeFormEffect) {
        Logger.getInstance().warn(
          `[ChangeFormEffect] ${data.DebugName} (${data.ID}) has no ChangeFormEffectComponent`,
        );
        continue;
      }

      const statusEffect = data.Components.find((c) => c.$type === 'StatusEffectComponent');
      if (!statusEffect) {
        Logger.getInstance().warn(
          `[ChangeFormEffect] ${data.DebugName} (${data.ID}) has no StatusEffectComponent`,
        );
        continue;
      }

      const partialDto = StatusEffectParser.statusEffectToPartialDto(statusEffect);

      const changeFormDto: ChangeFormEffectDto = {
        ...partialDto,
        id: data.ID,
        debugName: data.DebugName,
        removeEquipment: changeFormEffect.RemoveEquipment,
        tempAbilityIds: changeFormEffect.TempAbilitiesIDs,
        tempEquipmentIds: changeFormEffect.TempEquipmentIDs,
      };

      statusEffects[data.ID] = changeFormDto;
    }
  }
}
