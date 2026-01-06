import z from 'zod';
import { recoveryTimeComponentSchema } from '../components/recovery-time.component.js';

export const recoveryTimeGameDataSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.RecoveryTimeGameData')
    .transform(() => 'RecoveryTimeGameData' as const),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(recoveryTimeComponentSchema),
});

export type RecoveryTimeGameData = z.infer<typeof recoveryTimeGameDataSchema>;
