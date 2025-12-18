import z from 'zod';

export const talkingItemComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.TalkingItemComponent')
    .transform(() => 'TalkingItemComponent' as const),

  ItemGuidString: z.string(),
});
