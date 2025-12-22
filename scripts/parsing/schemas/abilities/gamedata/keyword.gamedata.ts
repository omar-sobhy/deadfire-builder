import z from 'zod';
import { keywordComponentSchema } from '../components/keyword.component.ts';

export const keywordGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.KeywordGameData'),
  ID: z.string(),
  Components: z.tuple([keywordComponentSchema]),
});

export type KeywordGameData = z.infer<typeof keywordGameDataSchema>;
