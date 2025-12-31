import {
  weaponGameDataSchema,
  type WeaponGameData,
} from '$lib/parsing/schemas/items/weapon.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class WeaponParser extends Parser<WeaponGameData> {
  public override readonly parser = weaponGameDataSchema;

  public override async parseDtos() {
    const { items } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const [item, equippable] = data.Components;

      if (!item) {
        Logger.getInstance().warn(`[Weapon] ${data.DebugName} (${data.ID}) has no ItemComponent`);
        continue;
      }

      if (!equippable) {
        Logger.getInstance().warn(
          `[Weapon] ${data.DebugName} (${data.ID}) has no EquippableComponent`,
        );
        continue;
      }

      const classRestrictions = equippable.RestrictedToClassIDs.map(
        (c) => Parser.context.classes[c],
      );

      const itemMods = equippable.ItemModsIDs.map((id) => Parser.context.itemMods[id]);

      items[data.ID] = {
        id: data.ID,
        debugName: data.DebugName,
        icon: item.IconTextureLarge,
        type: 'weapon',
        equipmentType: equippable.EquipmentType,
        classRestrictions,
        itemMods,
        equipmentSlot: equippable.EquipmentSlot,
      };
    }
  }
}
