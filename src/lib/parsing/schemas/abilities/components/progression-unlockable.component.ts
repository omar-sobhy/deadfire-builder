import z from 'zod';

export const progressionUnlockableComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ProgressionUnlockableComponent' as const),
});

export type ProgressionUnlockableComponent = z.infer<
  typeof progressionUnlockableComponentSchema
>;
