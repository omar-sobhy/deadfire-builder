import z from 'zod';
import { genericAbilityComponentSchema } from './components/generic-ability.component.js';
import { progressionUnlockableComponentSchema } from './components/progression-unlockable.component.js';

export const genericAbilityGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.GenericAbilityGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(
    z.tuple([
      genericAbilityComponentSchema,
      progressionUnlockableComponentSchema,
    ]),
  ),
});

export type GenericAbilityGameData = z.infer<
  typeof genericAbilityGameDataSchema
>;
