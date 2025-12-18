import z from 'zod';
import { ShieldType } from '../enums/shield-type.js';

export const shieldComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ShieldComponent')
    .pipe(z.transform(() => 'ShieldComponent' as const)),

  ShieldType: z.enum(ShieldType),
  BaseDeflectBonus: z.number(),
  BaseReflexBonus: z.number(),
  BaseAccuracyBonus: z.number(),
});

export type ShieldComponent = z.infer<typeof shieldComponentSchema>;
