import z from 'zod';
import { StatusEffectType } from '../../../../../types/enums/status-effect-type.js';
import { StatusEffectOperator } from '../../../../../types/enums/status-effect-operator.js';

export const statusEffectManagerComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.StatusEffectManagerComponent')
    .transform(() => 'StatusEffectManagerComponent' as const),
  StatusEffectTypeData: z.array(
    z.object({
      StatusEffectType: z.enum(StatusEffectType),
      DataType: z
        .string()
        .transform((s) => Number.parseInt(s))
        .optional(),
      OperatorType: z.enum(StatusEffectOperator),
      DisplayString: z.number(),
      WildcardString: z.number(),
      AttackFilterDisplayStyleID: z.string(),
      AttackTargetFilterDisplayStyleID: z.string(),
    }),
  ),
});

export type StatusEffectManagerComponent = z.infer<typeof statusEffectManagerComponentSchema>;
