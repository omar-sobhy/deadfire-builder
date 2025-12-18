import z from 'zod';

export const baseStatsComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.BaseStatsComponent'),
  IsPlayerClass: z.string().pipe(z.transform((s) => s === 'true')),
  BaseDeflection: z.number(),
  BaseFortitude: z.number(),
  BaseReflexes: z.number(),
  BaseWill: z.number(),
  MeleeAccuracyBonus: z.number(),
  RangedAccuracyBonus: z.number(),
  MaxHealth: z.number(),
  HealthPerLevel: z.number(),
});

export type BaseStatsComponent = z.infer<typeof baseStatsComponentSchema>;
