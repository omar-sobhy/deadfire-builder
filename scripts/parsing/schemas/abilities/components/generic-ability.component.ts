import z from 'zod';

export const genericAbilityComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.GenericAbilityComponent')
    .transform(() => 'GenericAbilityComponent' as const),

  /**
   * KeywordGameData reference
   */
  KeywordsIDs: z.array(z.string()),

  /**
   * ID in the abilities string table
   */
  DisplayName: z.number(),

  /**
   * ID in the abilities string table
   */
  Description: z.number(),

  UpgradeDescriptions: z.array(
    z.object({
      /**
       * ID in the abilities string table
       */
      String: z.number(),
    }),
  ),

  /**
   * GenericAbilityGameData reference
   */
  UpgradedFromID: z.string(),

  /**
   * CharacterClassGameData reference
   */
  AbilityClassID: z.string(),

  AbilityLevel: z.number(),

  IsPassive: z.string().transform((s) => s === 'true'),

  /**
   * AbilityUniqueSetType reference
   */
  UniqueSet: z.string(),
});

export type GenericAbilityComponent = z.infer<
  typeof genericAbilityComponentSchema
>;
