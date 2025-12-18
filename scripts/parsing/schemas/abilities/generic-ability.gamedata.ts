import z from 'zod';
import { genericAbilityComponentSchema } from './components/generic-ability.component.js';
import { progressionUnlockableComponentSchema } from './components/progression-unlockable.component.js';
import { dataScriptEventComponentSchema } from '../items/components/data-script-event.component.js';
import { weaponAttackAbilityComponentSchema } from './components/weapon-attack-ability.component.js';

export const genericAbilityGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.GenericAbilityGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(
    z.union([
      progressionUnlockableComponentSchema,
      genericAbilityComponentSchema,
      dataScriptEventComponentSchema,
      weaponAttackAbilityComponentSchema,
    ]),
  ),
});

export type GenericAbilityGameData = z.infer<
  typeof genericAbilityGameDataSchema
>;
