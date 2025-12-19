import z from 'zod';

export const progressionTableManagerComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ProgressionTableManagerComponent')
    .transform(() => 'ProgressionTableManagerComponent' as const),

  RacialProgressionTableID: z.string(),
  ProficienciesProgressionTableID: z.string(),
  ClassTables: z.array(
    z.object({
      CharacterClassID: z.string(),
      TableID: z.string(),
    }),
  ),
  CharacterCreationAttributePoints: z.number(),
  CharacterCreationMaxAttributeGulf: z.number(),
  CharacterCreationAttributeMinimum: z.number(),
  CharacterCreationAttributeMaximum: z.number(),
  CharacterCreationBaseStat: z.number(),
});

export type ProgressionTableManagerComponentSchema = z.infer<
  typeof progressionTableManagerComponentSchema
>;
