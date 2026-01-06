import z from 'zod';
import { phraseComponentSchema } from '../components/phrase.component.js';

export const phraseGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.PhraseGameData')
    .transform(() => 'PhraseGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(phraseComponentSchema.or(z.object())),
});

export type PhraseGameData = z.infer<typeof phraseGameDataSchema>;
