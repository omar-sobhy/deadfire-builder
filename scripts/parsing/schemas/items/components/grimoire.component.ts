import z from 'zod';

export const grimoireComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.GrimoireComponent')
    .pipe(z.transform(() => 'GrimoireComponent' as const)),
});
