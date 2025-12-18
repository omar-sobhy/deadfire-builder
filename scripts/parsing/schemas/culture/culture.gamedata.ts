import z from 'zod';
import { cultureComponentSchema } from './components/culture.component.ts';

export const cultureGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.CultureGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(cultureComponentSchema),
});

export type CultureGameData = z.infer<typeof cultureGameDataSchema>;
