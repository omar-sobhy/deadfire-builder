import type { StatusEffectDto } from './status-effect.dto.js';

export interface ChangeFormEffectDto extends StatusEffectDto {
  removeEquipment: boolean;
  tempEquipmentIds: string[];
  tempAbilityIds: string[];
}
