import z from 'zod';

export const changeFormEffectComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ChangeFormEffectComponent')
    .transform(() => 'ChangeFormEffectComponent' as const),
  TempAbilitiesIDs: z.array(z.string()),
  RemoveEquipment: z.string().transform((s) => s === 'true'),
});

export type ChangeFormEffect = z.infer<typeof changeFormEffectComponentSchema>;
