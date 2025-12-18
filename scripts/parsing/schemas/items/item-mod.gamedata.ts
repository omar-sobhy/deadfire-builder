import z from 'zod';
import { itemModComponentSchema } from './components/item-mod.component.ts';

export const itemModGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.ItemModGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(itemModComponentSchema),
});

export type ItemModGameData = z.infer<typeof itemModGameDataSchema>;
