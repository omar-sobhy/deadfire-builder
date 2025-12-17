import z from 'zod';

export const soulbindComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.SoulbindComponent')
    .pipe(z.transform(() => 'SoulbindComponent' as const)),

  ProhibitUnbind: z.string().pipe(z.transform((s) => s === 'true')),
  BindableClassesIDs: z.array(z.string()),
  UnlockStages: z.array(
    z.object({
      Note: z.string(),
      LoreToAdd: z.number(),
      ItemModsToAddIDs: z.array(z.string()),
      ItemModsToRemoveIDs: z.array(z.string()),
      EligibleClassesIDs: z.array(z.string()),
    }),
  ),
});
