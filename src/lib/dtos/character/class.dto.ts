import type { AbilityUnlockDto } from '../progression/ability-unlock.dto.js';

export interface ClassDto {
  readonly id: string;
  readonly abilities: AbilityUnlockDto[];
  readonly displayName?: string;
  readonly description?: string;
  readonly summary?: string;
}
