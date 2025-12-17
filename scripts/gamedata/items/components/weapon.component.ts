import z from 'zod';

export const weaponComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.WeaponComponent')
    .pipe(z.transform(() => 'WeaponComponent' as const)),
});

export type WeaponComponent = z.infer<typeof weaponComponentSchema>;
