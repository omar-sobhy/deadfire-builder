import z from 'zod';
import { StatusEffectType } from '../../../../../src/types/enums/status-effect-type.ts';
import { DurationType } from '../../../../../src/types/enums/duration-type.ts';

export const statusEffectComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.StatusEffectComponent'),
  StatusEffectType: z.enum(StatusEffectType),
  OverrideDescriptionString: z.number(),
  BaseValue: z.number(),
  KeywordsIDs: z.array(z.string()),
  DurationType: z.enum(DurationType),
  Duration: z.number(),
});

export type StatusEffectComponent = z.infer<typeof statusEffectComponentSchema>;
