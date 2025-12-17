import z from 'zod';
import { raceComponentSchema } from './components/race.component.js';

export const raceGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.RaceGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(raceComponentSchema),
});

export type RaceGameData = z.infer<typeof raceGameDataSchema>;
