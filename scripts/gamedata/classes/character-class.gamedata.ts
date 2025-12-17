import z from 'zod';
import { characterClassComponentSchema } from './components/character-class.component.js';

export const characterClassGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.CharacterClassGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(characterClassComponentSchema),
});

export type CharacterClass = z.infer<typeof characterClassGameDataSchema>;
