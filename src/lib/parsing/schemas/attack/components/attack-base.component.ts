import z from 'zod';
import { TargetType } from '../../../../../types/enums/target-type.js';
import { conditionalExpressionSchema } from '../../progression/components/base-progression.component.js';
import { DamageType } from '../../../../../types/enums/damage-type.js';

export const attackBaseComponent = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AttackBaseComponent')
    .transform(() => 'AttackBaseComponent' as const),
  KeywordsIDs: z.array(z.string()),
  AttackDistance: z.number(),
  MinAttackDistance: z.number(),
  UseParentEquippableHand: z.string().transform((s) => s === 'true'),
  CastSpeedID: z.string(),
  RecoveryTimeID: z.string(),
  ImpactDelay: z.number(),
  AffectedTargetType: z.enum(TargetType),
  AffectedTargetConditional: z.object({
    Conditional: conditionalExpressionSchema,
  }),
  PushDistance: z.number(),
  AccuracyBonus: z.number(),
  PenetrationRating: z.number(),
  DamageData: z.object({
    DamageType: z.enum(DamageType),
    AlternateDamageType: z.enum(DamageType),
    Minimum: z.number(),
    Maximum: z.number(),
  }),
  DamageProcs: z.array(
    z.object({
      DamageType: z.enum(DamageType),
      PercentOfBaseDamage: z.number(),
    }),
  ),
});
