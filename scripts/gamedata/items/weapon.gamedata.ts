import z from 'zod';
import { itemComponentSchema } from './components/item-component.js';
import { equippableComponentSchema } from './components/equippable.component.js';
import { weaponComponentSchema } from './components/weapon.component.js';

export const weaponGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.WeaponGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z
    .tuple([
      itemComponentSchema,
      equippableComponentSchema,
      weaponComponentSchema,
    ])
    .rest(z.unknown()),
});

export type WeaponGameData = z.infer<typeof weaponGameDataSchema>;
