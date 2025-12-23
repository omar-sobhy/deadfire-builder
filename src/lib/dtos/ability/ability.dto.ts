import type { StatusEffectDto } from '../status-effect/status-effect.dto.js';

export class AbilityDto {
  public constructor(
    public readonly id: string,
    public readonly debugName: string,
    public readonly icon: string,
    public readonly statusEffects: StatusEffectDto[],
    public readonly displayName?: string,
    public readonly description?: string,
  ) {}
}
