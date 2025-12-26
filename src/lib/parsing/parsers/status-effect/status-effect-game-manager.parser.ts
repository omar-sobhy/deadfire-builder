import {
  statusEffectManagerGameDataSchema,
  type StatusEffectManagerGameData,
} from '$lib/parsing/schemas/status-effect/gamedata/status-effect-manager.gamedata.js';
import { Parser } from '../parser.js';

export class StatusEffectManagerParser extends Parser<StatusEffectManagerGameData> {
  public override readonly parser = statusEffectManagerGameDataSchema;

  public async toDto(): Promise<void> {
    const store = this.transaction.objectStore('statusEffectStringMap');
    const guiStrings = this.transaction.objectStore('guiStrings');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      for (const e of component.StatusEffectTypeData) {
        const display = await guiStrings.get(e.DisplayString);
        const wildcard = await guiStrings.get(e.WildcardString);

        await store.put(
          {
            display: display?.defaultText,
            wildcard: wildcard?.defaultText,
            dataType: e.DataType,
            attackFilterDisplayStyleId: e.AttackFilterDisplayStyleID,
            attackTargetFilterDisplayStyleId: e.AttackTargetFilterDisplayStyleID,
            OperatorType: e.OperatorType,
            statusEffectType: e.StatusEffectType,
          },
          e.StatusEffectType,
        );
      }
    }
  }
  //
}
