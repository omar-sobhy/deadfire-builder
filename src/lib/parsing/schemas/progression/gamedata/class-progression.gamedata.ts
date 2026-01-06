import z from 'zod';
import { baseProgressionComponentSchema } from '../components/base-progression.component.js';
import { classProgressionComponentSchema } from '../components/class-progression.compoment.js';

export const classProgressionGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.ClassProgressionTableGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(
    z.union([baseProgressionComponentSchema, classProgressionComponentSchema]),
  ),
});

export type ClassProgressionGameData = z.infer<
  typeof classProgressionGameDataSchema
>;
