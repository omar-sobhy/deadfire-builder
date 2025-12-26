import z from 'zod';
import { statusEffectComponentSchema } from '../components/status-effect.component.js';
import { changeFormEffectComponentSchema } from '../components/change-form-effect.component.js';

export const changeFormEffectGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ChangeFormEffectGameData')
    .transform(() => 'ChangeFormEffectGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(z.union([statusEffectComponentSchema, changeFormEffectComponentSchema])),
});

export type ChangeFormEffectGameData = z.infer<typeof changeFormEffectGameDataSchema>;
