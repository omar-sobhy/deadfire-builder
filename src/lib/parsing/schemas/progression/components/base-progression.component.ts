import z from 'zod';
import { UnlockStyle } from '../../../../../types/enums/unlock-style.js';
import { ProgressionCategory } from '../../../../../types/enums/progression-category.js';
import { ConditionalOperator } from '../../../../../types/enums/conditional-operator.js';

export const conditionalCallSchema = z.object({
  $type: z
    .string()
    .startsWith('OEIFormats.FlowCharts.ConditionalCall')
    .transform(() => 'ConditionalCall' as const),
  Data: z.object({
    FullName: z.string(),
    Parameters: z.array(z.string()),
  }),
  Not: z.boolean(),
  Operator: z.enum(ConditionalOperator),
});

export const conditionalExpressionSchema = z.object({
  $type: z
    .string()
    .startsWith('OEIFormats.FlowCharts.ConditionalExpression')
    .transform(() => 'ConditionalExpression' as const),
  Operator: z.enum(ConditionalOperator),
  Components: z.array(conditionalCallSchema),
});

export const baseProgressionComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.BaseProgressionTableComponent')
    .transform(() => 'BaseProgressionTableComponent' as const),
  AbilityUnlocks: z.array(
    z.object({
      Note: z.string(),
      Category: z.enum(ProgressionCategory),
      UnlockStyle: z.enum(UnlockStyle),
      ActivationObject: z.string(),
      AddAbilityID: z.string(),
      RemoveAbilityID: z.string(),
      Prerequisites: z.object({
        MinimumCharacterLevel: z.number(),
        PowerLevelRequirement: z.object({
          ClassID: z.string(),
          MinimumPowerLevel: z.number(),
        }),
        RequiresAbilityID: z.string(),
        IsMutuallyExclusiveUpgrade: z.string().transform((z) => z === 'true'),
        Conditional: z.object({
          Operator: z.enum(ConditionalOperator),
          Components: z.array(
            conditionalCallSchema.or(conditionalExpressionSchema),
          ),
        }),
      }),
    }),
  ),
});

export type BaseProgressionComponent = z.infer<
  typeof baseProgressionComponentSchema
>;
