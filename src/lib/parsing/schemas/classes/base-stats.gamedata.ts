import z from 'zod';
import { baseStatsComponentSchema } from './components/base-stats.component.js';

export const baseStatsGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.BaseStatsGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(baseStatsComponentSchema),
});

export type BaseStatsGameData = z.infer<typeof baseStatsGameDataSchema>;
