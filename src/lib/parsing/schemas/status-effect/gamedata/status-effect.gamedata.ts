import z from 'zod';
import { statusEffectComponentSchema } from '../components/status-effect.component.js';

export const statusEffectGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.StatusEffectGameData')
    .transform(() => 'StatusEffectGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.tuple([statusEffectComponentSchema]),
});

export type StatusEffectGameData = z.infer<typeof statusEffectGameDataSchema>;
