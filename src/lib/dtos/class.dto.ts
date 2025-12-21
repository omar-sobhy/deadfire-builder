import type { AbilityUnlockDto } from './ability-unlock.dto.js';

export class ClassDto {
  public constructor(
    public readonly id: string,
    public readonly abilities: AbilityUnlockDto[],
    public readonly displayName?: string,
    public readonly description?: string,
  ) {}
}
