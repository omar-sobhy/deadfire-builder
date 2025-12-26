import z from 'zod';
import { EffectAttachObject } from '../../../../../types/enums/effect-attach-object.js';

export const attackRangedComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.AttackRangedComponent')
    .transform(() => 'AttackRangedComponent' as const),
  ProjectileCount: z.number(),
  IgnoreMagicDefense: z.string().transform((s) => s === 'false'),
  ProjectileConeAngle: z.number(),
  IsMultiHit: z.string().transform((s) => s === 'false'),
  MultiHitTravelDist: z.number(),
  MultiHitMaxHits: z.number(),
  LaunchSource: z.enum(EffectAttachObject),
});
