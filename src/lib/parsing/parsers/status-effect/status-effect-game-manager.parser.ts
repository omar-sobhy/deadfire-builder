import {
  statusEffectManagerGameDataSchema,
  type StatusEffectManagerGameData,
} from '$lib/parsing/schemas/status-effect/gamedata/status-effect-manager.gamedata.js';
import { Parser } from '../parser.js';

export class StatusEffectManagerParser extends Parser<StatusEffectManagerGameData> {
  public override readonly parser = statusEffectManagerGameDataSchema;

  public async parseDtos(): Promise<void> {
    const { guiStrings, statusEffectManager } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      for (const e of component.StatusEffectTypeData) {
        const display = guiStrings[e.DisplayString];
        const wildcard = guiStrings[e.WildcardString];

        statusEffectManager[e.StatusEffectType] = {
          display: display?.defaultText,
          wildcard: wildcard?.defaultText,
          dataType: e.DataType ?? 0,
          attackFilterDisplayStyleId: e.AttackFilterDisplayStyleID,
          attackTargetFilterDisplayStyleId: e.AttackTargetFilterDisplayStyleID,
          OperatorType: e.OperatorType,
          statusEffectType: e.StatusEffectType,
        };
      }
    }
  }
  //
}
