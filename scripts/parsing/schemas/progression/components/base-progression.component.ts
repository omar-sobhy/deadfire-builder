import z from 'zod';
import { UnlockStyle } from '../../../../../src/types/enums/unlock-style.ts';
import { ProgressionCategory } from '../../../../../src/types/enums/progression-category.ts';

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
      }),
    }),
  ),
});

export type BaseProgressionComponent = z.infer<
  typeof baseProgressionComponentSchema
>;
