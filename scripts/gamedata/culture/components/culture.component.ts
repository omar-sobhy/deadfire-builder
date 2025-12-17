import z from 'zod';

export const cultureComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.CultureComponent'),
  DisplayName: z.number(),
  SummaryText: z.number(),
  DescriptionText: z.number(),
  Icon: z.string(),
  Resolve: z.number(),
  Might: z.number(),
  Dexterity: z.number(),
  Intellect: z.number(),
  Constitution: z.number(),
  Perception: z.number(),
});

export type CultureComponent = z.infer<typeof cultureComponentSchema>;
