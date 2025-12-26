import z from 'zod';

export const afflictionComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AfflictionComponent')
    .transform(() => 'AfflictionComponent' as const),
  DisplayName: z.number(),
  Icon: z.string(),
  AfflictionTypeID: z.string(),
});

export type AfflictionComponent = z.infer<typeof afflictionComponentSchema>;
