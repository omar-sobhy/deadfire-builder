import z from 'zod';
import { progressionTableManagerComponentSchema } from '../components/progession-table-manager.component.ts';

export const progressionTableManagerGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ProgressionTableManagerGameData')
    .transform(() => 'ProgressionTableManagerGameData' as const),
  ID: z.string(),
  Components: z.array(progressionTableManagerComponentSchema),
});

export type ProgressionTableManagerGameData = z.infer<
  typeof progressionTableManagerGameDataSchema
>;
