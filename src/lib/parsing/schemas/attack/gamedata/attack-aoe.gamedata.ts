import z from 'zod';
import { attackAoeComponentSchema } from '../components/attack-aoe.component.js';
import { attackBaseComponent } from '../components/attack-base.component.js';

export const attackAoeGameData = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AttackAOEGameData')
    .transform(() => 'AttackAOEGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(attackAoeComponentSchema.or(attackBaseComponent)),
});
