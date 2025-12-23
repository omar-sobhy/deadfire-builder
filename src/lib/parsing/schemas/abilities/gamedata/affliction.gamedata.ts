import z from 'zod';
import { afflictionComponentSchema } from '../components/affliction.component.js';
import { statusEffectComponentSchema } from '../components/status-effect.component.js';

export const afflictionGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AfflictionGameData')
    .transform(() => 'AfflictionGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(
    z.union([afflictionComponentSchema, statusEffectComponentSchema]),
  ),
});

export type AfflictionGameData = z.infer<typeof afflictionGameDataSchema>;
