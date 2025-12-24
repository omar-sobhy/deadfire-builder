import z from 'zod';

export const intervalRateComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.IntervalRateComponent')
    .transform(() => 'IntervalRateComponent' as const),
  Interval: z.number(),
  OnlyWhileMoving: z.string().transform((s) => s === 'true'),
});
