import z from 'zod';

export const phraseComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.PhraseComponent')
    .transform(() => 'PhraseComponent' as const),
  Icon: z.string(),
  DisplayName: z.number(),
  Level: z.number(),
  AbilityClassID: z.string(),
  Description: z.number(),
  StatusEffectsIDs: z.array(z.string()),
});
