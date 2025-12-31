import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import {
  equippableGameDataSchema,
  type EquippableGameData,
} from '$lib/parsing/schemas/items/equippable.gamedata.js';
import { Logger } from '$lib/utils.js';
import { Parser } from '../parser.js';

export class EquippableParser extends Parser<EquippableGameData> {
  public override readonly parser = equippableGameDataSchema;

  public override async parseDtos() {
    const { items } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const equippable = data.Components.find((c) => c!.$type === 'EquippableComponent');
      if (!equippable) {
        Logger.getInstance().warn(
          `[Equippable] ${data.DebugName} (${data.ID}) has no EquippableComponent`,
        );
        continue;
      }

      const item = data.Components.find((c) => c!.$type === 'ItemComponent');
      if (!item) {
        Logger.getInstance().warn(
          `[Equippable] ${data.DebugName} (${data.ID}) has no ItemComponent`,
        );
        continue;
      }

      let type: ItemDto['type'] | undefined;

      for (const c of data.Components) {
        switch (c!.$type) {
          case 'ArmorComponent':
            type = 'armor';
            break;
          case 'EquippableComponent':
            type = 'equippable';
            break;
          case 'GrimoireComponent':
            type = 'grimoire';
            break;
          case 'ShieldComponent':
            type = 'shield';
            break;
          case 'SoulbindComponent':
            type = 'soulbind';
            break;
        }
      }

      if (!type) {
        Logger.getInstance().warn(
          `[Equippable] ${data.DebugName} (${data.ID}) has unknown equippable type`,
        );
        continue;
      }

      const classRestrictions = equippable.RestrictedToClassIDs.map(
        (c) => Parser.context.classes[c],
      );

      const itemMods = equippable.ItemModsIDs.map((id) => Parser.context.itemMods[id]);

      const itemDto: ItemDto = {
        id: data.ID,
        debugName: data.DebugName,
        icon: item.IconTextureLarge,
        classRestrictions,
        equipmentSlot: equippable.EquipmentSlot,
        equipmentType: equippable.EquipmentType,
        itemMods,
        type,
      };

      items[data.ID] = itemDto;
    }
  }
}
