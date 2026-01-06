import z from 'zod';
import { statusEffectManagerComponentSchema } from '../components/status-effect-manager.component.js';

export const statusEffectManagerGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.StatusEffectManagerGameData')
    .transform(() => 'StatusEffectManagerGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(statusEffectManagerComponentSchema),
});

export type StatusEffectManagerGameData = z.infer<typeof statusEffectManagerGameDataSchema>;
