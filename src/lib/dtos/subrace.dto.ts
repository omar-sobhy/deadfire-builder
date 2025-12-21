import type { AbilityUnlockDto } from './ability-unlock.dto.js';

export class SubraceDto {
  public constructor(
    public readonly id: string,
    public readonly raceId: string,
    public readonly abilities: AbilityUnlockDto[],
    public readonly displayName?: string,
    public readonly summary?: string,
    public readonly description?: string,
  ) {}
}
