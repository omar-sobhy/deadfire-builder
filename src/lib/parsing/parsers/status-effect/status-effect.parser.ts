import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import {
  statusEffectGameDataSchema,
  type StatusEffectComponent,
  type StatusEffectGameData,
} from '$lib/parsing/schemas/index.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class StatusEffectParser extends Parser<StatusEffectGameData> {
  public override readonly parser = statusEffectGameDataSchema;

  public static statusEffectToPartialDto(
    statusEffect: StatusEffectComponent,
  ): Omit<StatusEffectDto, 'description' | 'id' | 'debugName'> {
    return {
      icon: '',
      baseValue: statusEffect.BaseValue,
      damageTypeValue: statusEffect.DamageTypeValue,
      duration: statusEffect.Duration,
      durationType: statusEffect.DurationType,
      type: statusEffect.StatusEffectType,
      childStatusEffectIds: statusEffect.StatusEffectsValueIDs,
      overridePenetration: statusEffect.OverridePenetration,
      keywords: statusEffect.KeywordsIDs,
      dynamicClassId: statusEffect.DynamicValue.ClassID,
      dynamicSkillId: statusEffect.DynamicValue.SkillDataID,
      dynamicStat: statusEffect.DynamicValue.Stat,
      extraValue: statusEffect.ExtraValue,
      intervalRateId: statusEffect.IntervalRateID,
      afflictionTypeValueId: statusEffect.AfflictionTypeValueID,
      attackHitType: statusEffect.AttackHitType,
      classValueId: statusEffect.ClassValueID,
      raceName: statusEffect.RaceValue,
      statusEffectTypeValue: statusEffect.StatusEffectTypeValue,
      weaponTypeValue: statusEffect.WeaponTypeValue,
    };
  }

  public override async toDto() {
    const statusEffects = this.transaction.objectStore('statusEffects');
    const statusEffectStrings = this.transaction.objectStore('statusEffectStrings');

    for (const data of Object.values(this.parsed)) {
      const statusEffect = data.Components.find((c) => c.$type === 'StatusEffectComponent');
      if (!statusEffect) {
        Logger.getInstance().warn(
          `[StatusEffect] ${data.DebugName} (${data.ID}) has no StatusEffectComponent`,
        );
        continue;
      }

      const descriptionId = statusEffect.OverrideDescriptionString;

      const description =
        descriptionId !== 0 ? await statusEffectStrings.get(descriptionId) : undefined;

      const partialDto = StatusEffectParser.statusEffectToPartialDto(statusEffect);

      const statusEffectDto: StatusEffectDto = {
        ...partialDto,
        id: data.ID,
        debugName: data.DebugName,
        description: description?.defaultText,
      };

      statusEffects.put(
        {
          type: 'generic',
          data: statusEffectDto,
        },
        data.ID,
      );
    }
  }
}
