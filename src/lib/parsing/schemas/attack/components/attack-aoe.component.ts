import z from 'zod';
import { BlastSize } from '../../../../../types/enums/blast-size.js';

export const attackAoeComponentSchema = z.object({
  BlastSize: z.enum(BlastSize),
  BlastRadiusOverride: z.number(),
  DamageAngle: z.number(),
  ExcludePrimaryTarget: z.string().transform((s) => s === 'true'),
  IgnoreParentTarget: z.string().transform((s) => s === 'true'),
  ExcludeSelf: z.string().transform((s) => s === 'true'),
  PushFromCaster: z.string().transform((s) => s === 'true'),
});
