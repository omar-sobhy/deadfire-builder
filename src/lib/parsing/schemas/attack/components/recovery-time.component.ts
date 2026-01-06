import z from 'zod';

export const recoveryTimeComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.RecoveryTimeComponent')
    .transform(() => 'RecoveryTimeComponent' as const),
    DisplayName: z.number(),
    Duration: z.number()
});
