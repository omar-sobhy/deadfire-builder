import z from 'zod';
import { statusEffectComponentSchema } from './components/status-effect.component.ts';

export const statusEffectGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.StatusEffectGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.tuple([statusEffectComponentSchema]),
});

export type StatusEffectGameData = z.infer<typeof statusEffectGameDataSchema>;
