import z from 'zod';

export const classProgressionComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ClassProgressionTableComponent')
    .transform(() => 'ClassProgressionTableComponent' as const),
});
