import type { PermittedEquipmentSlot } from '../../../types/enums/permitted-equipment-slot.js';
import type { WeaponType } from '../../../types/enums/weapon-type.js';
import type { ClassDto } from '../character/class.dto.js';
import type { ItemModDto } from './item-mod.dto.js';

export type ItemDto = {
  readonly type: 'armor' | 'shield' | 'grimoire' | 'soulbind' | 'equippable' | 'weapon';
  readonly equipmentType: WeaponType;
  readonly equipmentSlot: PermittedEquipmentSlot;
  readonly itemMods: ItemModDto[];
  readonly classRestrictions: ClassDto[];
};
