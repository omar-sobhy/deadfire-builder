import z from 'zod';

export const characterSubclassComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.CharacterSubClassComponent'),
  DisplayName: z.number(),
  SummaryText: z.number(),
  DescriptionText: z.number(),
  ForClassID: z.string(),
});

export type CharacterSubclassComponent = z.infer<
  typeof characterSubclassComponentSchema
>;
