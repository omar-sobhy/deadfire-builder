import type { StatusEffectDto } from './status-effect.dto.js';

export interface AfflictionDto extends StatusEffectDto {
  readonly afflictionTypeId: string;
}
