import z from 'zod';
import { characterSubclassComponentSchema } from './components/character-subclass.component.js';

export const characterSubclassGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.CharacterSubClassGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(characterSubclassComponentSchema),
});

export type CharacterSubclass = z.infer<typeof characterSubclassGameDataSchema>;
