import z from 'zod';
import { intervalRateComponentSchema } from '../components/interval-rate.component.js';

export const intervalRateGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.IntervalRateGameData')
    .transform(() => 'IntervalRateGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(intervalRateComponentSchema),
});

export type IntervalRateGameData = z.infer<typeof intervalRateGameDataSchema>;
