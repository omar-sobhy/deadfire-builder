import z from 'zod';

export const characterClassComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.CharacterClassComponent')
    .transform(() => 'CharacterClassComponent' as const),

  /**
   * ID in gui string table
   */
  DisplayName: z.number(),

  /**
   * ID in cyclopedia string table
   */
  SummaryText: z.number(),

  /**
   * ID in gui string table
   */
  DescriptionText: z.number(),

  RequireSubclass: z.string().pipe(z.transform((s) => s === 'true')),

  Icon: z.string(),

  SkillsList: z.array(
    z.object({
      /**
       * SkillGameData reference
       */
      SkillID: z.string(),

      /**
       * Skill modifier
       */
      Value: z.number(),
    }),
  ),

  /**
   * BaseStatsGameData reference
   */
  BaseStatsID: z.string(),

  IsSpellcaster: z.string().pipe(z.transform((s) => s === 'true')),

  /**
   * ID in gui string table
   */
  SpellIdentifierString: z.number(),

  HybridClassTitles: z.array(
    z.object({
      /**
       * CharacterClassGameData reference
       */
      OtherClassID: z.string(),

      /**
       * ID in gui string table
       */
      Title: z.number(),
    }),
  ),
});

export type CharacterClassComponent = z.infer<
  typeof characterClassComponentSchema
>;
