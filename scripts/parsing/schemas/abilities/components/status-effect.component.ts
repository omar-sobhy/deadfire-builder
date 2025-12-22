import z from 'zod';
import { StatusEffectType } from '../../../../../src/types/enums/status-effect-type.ts';
import { DurationType } from '../../../../../src/types/enums/duration-type.ts';
import { StatusEffectValueType } from '../../../../../src/types/enums/status-effect-value-type.ts';
import { StatusEffectOperator } from '../../../../../src/types/enums/status-effect-operator.ts';
import { DamageType } from '../../../../../src/types/enums/damage-type.ts';

export const statusEffectComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.StatusEffectComponent')
    .transform(() => 'StatusEffectComponent' as const),
  StatusEffectType: z.enum(StatusEffectType),
  OverrideDescriptionString: z.number(),
  BaseValue: z.number(),
  KeywordsIDs: z.array(z.string()),
  DurationType: z.enum(DurationType),
  Duration: z.number(),
  StatusEffectsValueIDs: z.array(z.string()),
  DynamicValue: z.object({
    Stat: z.enum(StatusEffectValueType),
    SkillDataID: z.string(),
    ClassID: z.string(),
    MultiplyBy: z.number(),
    Operator: z.enum(StatusEffectOperator),
  }),
  IntervalRateID: z.string(),
  ExtraValue: z.number(),
  OverridePenetration: z.number(),
  DamageTypeValue: z.enum(DamageType),
});

export type StatusEffectComponent = z.infer<typeof statusEffectComponentSchema>;
