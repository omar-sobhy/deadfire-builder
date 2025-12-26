import type { StatusEffectDto } from '../status-effect/status-effect.dto.js';

export interface AbilityDto {
  readonly id: string;
  readonly debugName: string;
  readonly icon: string;
  readonly statusEffects: StatusEffectDto[];
  readonly displayName?: string;
  readonly description?: string;
}
