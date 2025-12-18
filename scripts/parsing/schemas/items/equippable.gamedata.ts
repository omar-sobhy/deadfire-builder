import z from 'zod';
import { itemComponentSchema } from './components/item-component.js';
import { equippableComponentSchema } from './components/equippable.component.js';
import { armorComponentSchema } from './components/armor.component.js';
import { grimoireComponentSchema } from './components/grimoire.component.js';
import { shieldComponentSchema } from './components/shield.component.js';
import { soulbindComponentSchema } from './components/soulbind.component.js';
import { talkingItemComponentSchema } from './components/talking-item.component.js';
import { dataScriptEventComponentSchema } from './components/data-script-event.component.js';

export const equippableGameDataSchema = z.object({
  $type: z.string().startsWith('Game.GameData.EquippableGameData'),
  DebugName: z.string(),
  ID: z.string(),
  Components: z
    .tuple([itemComponentSchema, equippableComponentSchema])
    .rest(
      z
        .union([
          armorComponentSchema,
          grimoireComponentSchema,
          shieldComponentSchema,
          soulbindComponentSchema,
          talkingItemComponentSchema,
          dataScriptEventComponentSchema,
        ])
        .optional(),
    ),
});

export type EquippableGameData = z.infer<typeof equippableGameDataSchema>;
