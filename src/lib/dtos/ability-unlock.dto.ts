import type { ProgressionCategory } from '../../types/enums/progression-category.js';
import type { UnlockStyle } from '../../types/enums/unlock-style.js';
import type { AbilityDto } from './ability.dto.js';

export type ProgressionDetails =
  | { type: 'class'; id: string }
  | { type: 'subclass'; id: string }
  | { type: 'race'; id: string }
  | { type: 'subrace'; id: string }
  | { type: 'unknown' };

export class AbilityUnlockDto {
  public constructor(
    public readonly id: number,
    public readonly note: string,
    public readonly icon: string,
    public readonly category: ProgressionCategory,
    public readonly style: UnlockStyle,
    public readonly minimumCharacterLevel: number | null,
    public readonly mutuallyExclusive: boolean,
    public readonly minimumPowerLevel: number,
    public readonly progressionDetails: ProgressionDetails,
    public readonly requiredAbility?: AbilityDto,
    public readonly addedAbility?: AbilityDto,
    public readonly removedAbility?: AbilityDto,
  ) {}
}
