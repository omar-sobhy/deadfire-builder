import type { PermittedEquipmentSlot } from '../../../types/enums/permitted-equipment-slot.js';
import type { WeaponType } from '../../../types/enums/weapon-type.js';
import type { ClassDto } from '../character/class.dto.js';
import type { ItemModDto } from './item-mod.dto.js';

export type ItemDto = {
  readonly id: string;
  readonly type: 'armor' | 'shield' | 'grimoire' | 'soulbind' | 'equippable' | 'weapon';
  readonly debugName: string;
  readonly icon: string;
  readonly equipmentType: WeaponType;
  readonly equipmentSlot: PermittedEquipmentSlot;
  readonly itemMods: ItemModDto[];
  readonly classRestrictions: ClassDto[];
};
