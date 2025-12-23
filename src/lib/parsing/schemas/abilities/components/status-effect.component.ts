import z from 'zod';
import { StatusEffectType } from '../../../../../types/enums/status-effect-type.js';
import { DurationType } from '../../../../../types/enums/duration-type.js';
import { StatusEffectValueType } from '../../../../../types/enums/status-effect-value-type.js';
import { StatusEffectOperator } from '../../../../../types/enums/status-effect-operator.js';
import { DamageType } from '../../../../../types/enums/damage-type.js';

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
