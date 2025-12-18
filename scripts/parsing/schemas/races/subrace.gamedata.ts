import z from 'zod';
import { subraceComponentSchema } from './components/subrace.component.js';

export const subraceGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.SubraceGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(subraceComponentSchema),
});

export type SubraceGameData = z.infer<typeof subraceGameDataSchema>;
