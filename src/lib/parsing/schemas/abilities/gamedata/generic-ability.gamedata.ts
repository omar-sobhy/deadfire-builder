import z from 'zod';
import { genericAbilityComponentSchema } from '../components/generic-ability.component.js';
import { AbilityType } from '../../../../../types/enums/ability-type.js';

export const genericAbilityGameDataSchema = z.object({
  $type: z.string(),
  DebugName: z.string(),
  ID: z.string(),
  Components: z.array(
    z.union([
      genericAbilityComponentSchema,
      z.object({
        $type: z
          .string()
          .startsWith('Game.GameData.ProgressionUnlockableComponent')
          .transform(() => 'ProgressionUnlockableComponent' as const)
          .or(
            z.preprocess((val) => {
              if (typeof val === 'string') {
                // for some reason one of the components has a typo in the name
                // (WoundsTraitAbilityCompoent should be WoundsTraitAbilityComponent)
                const index = val.lastIndexOf('Comp');
                const first = val.substring(0, index);

                const parts = first.split('.');
                const componentName = parts[parts.length - 1];

                return componentName
                  .replaceAll(/Ability/g, '')
                  .replaceAll(/GameData/g, '');
              }

              return val;
            }, z.enum(AbilityType)),
          ),
        Icon: z.string().optional(),
        StatusEffectsIDs: z.array(z.string()).optional(),
      }),
    ]),
  ),
});

export type GenericAbilityGameData = z.infer<
  typeof genericAbilityGameDataSchema
>;
