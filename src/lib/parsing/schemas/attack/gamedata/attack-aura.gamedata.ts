import z from 'zod';
import { attackBaseComponent } from '../components/attack-base.component.js';
import { attackAoeComponentSchema } from '../components/attack-aoe.component.js';
import { attackAuraComponentSchema } from '../components/attack-aura.component.js';
import { attackRangedComponentSchema } from '../components/attack-ranged.component.js';

export const attackAuraGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AttackAuraComponent')
    .transform(() => 'AttackAuraComponent' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(
    z.union([
      attackBaseComponent,
      attackAuraComponentSchema,
      attackAoeComponentSchema,
      attackRangedComponentSchema,
    ]),
  ),
});
