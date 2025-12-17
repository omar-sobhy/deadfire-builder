import z from 'zod';
import { WeaponType } from '../enums/weapon-type.js';
import { PermittedEquipmentSlot } from '../enums/permitted-equipment-slot.js';

export const equippableComponentSchema = z.object({
  EquipmentType: z.enum(WeaponType),
  EquipmentSlot: z.enum(PermittedEquipmentSlot),

  /**
   * ItemModGameData reference
   */
  ItemModsIDs: z.array(z.string()),

  /**
   * CharacterClassGameData reference
   */
  RestrictedToClassIDs: z.array(z.string())
});

export type EquippableComponent = z.infer<typeof equippableComponentSchema>;
