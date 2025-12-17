import z from 'zod';

export const genericAbilityComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.GenericAbilityComponent'),

  DebugName: z.string(),

  ID: z.string(),

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
  UpgradedFromId: z.string(),

  /**
   * CharacterClassGameData reference
   */
  AbilityClassID: z.string(),

  AbilityLevel: z.number(),

  IsPassive: z.boolean(),

  /**
   * AbilityUniqueSetType reference
   */
  UniqueSet: z.string(),
});

export type GenericAbilityComponent = z.infer<
  typeof genericAbilityComponentSchema
>;
