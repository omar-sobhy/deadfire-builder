import type { ProgressionCategory } from '../../../types/enums/progression-category.js';
import type { UnlockStyle } from '../../../types/enums/unlock-style.js';
import type { AbilityDto } from '../ability/ability.dto.js';
import type { ConditionalDto } from './conditional.dto.js';

export type ProgressionDetails =
  | { type: 'class'; id: string }
  | { type: 'subclass'; id: string }
  | { type: 'race'; id: string }
  | { type: 'subrace'; id: string }
  | { type: 'unknown' };

export interface AbilityUnlockDto {
  readonly note: string;
  readonly icon: string;
  readonly category: ProgressionCategory;
  readonly style: UnlockStyle;
  readonly minimumCharacterLevel: number | null;
  readonly mutuallyExclusive: boolean;
  readonly minimumPowerLevel: number;
  readonly baseClassId: string;
  readonly requiredAbility?: AbilityDto;
  readonly addedAbility?: AbilityDto;
  readonly removedAbility?: AbilityDto;
  readonly conditionals: ConditionalDto[];
  readonly visibilityConditionals: ConditionalDto[];
}
