import z from 'zod';
import { EffectAttachMode } from '../../../../../types/enums/effect-attach-mode.js';
import { EffectAttachPoint } from '../../../../../types/enums/effect-attach-point.js';

export const attackAuraComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AttackAuraComponent')
    .transform(() => 'AttackAuraComponent' as const),
  Duration: z.number(),
  EffectAttachMode: z.enum(EffectAttachMode),
  EffectAttachPoint: z.enum(EffectAttachPoint),
});
