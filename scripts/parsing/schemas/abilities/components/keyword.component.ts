import z from 'zod';

export const keywordComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.KeywordComponent'),
  GuiDisplayString: z.number(),
  AbilitiesDisplayString: z.number(),
  Description: z.number(),
  Icon: z.string(),
});

export type KeywordComponent = z.infer<typeof keywordComponentSchema>;
