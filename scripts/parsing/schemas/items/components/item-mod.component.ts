import z from 'zod';

export const itemModComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ItemModComponent')
    .pipe(z.transform(() => 'ItemModComponent' as const)),
  DisplayName: z.number(),
});
