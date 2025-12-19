import z from 'zod';
import { baseProgressionComponentSchema } from '../components/base-progression.component.ts';
import { classProgressionComponentSchema } from '../components/class-progression.compoment.ts';

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
