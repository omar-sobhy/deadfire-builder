import type { AbilityUnlockDto } from '../progression/ability-unlock.dto.js';

export class RaceDto {
  public constructor(
    public readonly id: string,
    public readonly subRaceIds: string[],
    public readonly resolve: number,
    public readonly might: number,
    public readonly dexterity: number,
    public readonly constitution: number,
    public readonly intellect: number,
    public readonly perception: number,
    public readonly isKith: boolean,
    public readonly abilities: AbilityUnlockDto[],
    public readonly displayName?: string,
  ) {}
}
