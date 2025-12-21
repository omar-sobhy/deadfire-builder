import type { AbilityUnlockDto } from './ability-unlock.dto.js';

export class SubclassDto {
  public constructor(
    public readonly id: string,
    public readonly abilities: AbilityUnlockDto[],
    public readonly classId: string,
    public readonly displayName?: string,
  ) {}
}
