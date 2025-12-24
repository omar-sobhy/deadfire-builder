import type { RaceType } from '$lib/parsing/schemas/index.js';
import type { DamageType } from '../../../types/enums/damage-type.js';
import type { DurationType } from '../../../types/enums/duration-type.js';
import type { HitType } from '../../../types/enums/hit-type.js';
import type { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import type { StatusEffectValueType } from '../../../types/enums/status-effect-value-type.js';
import type { WeaponType } from '../../../types/enums/weapon-type.js';

export interface StatusEffectDto {
  readonly id: string;
  readonly debugName: string;
  readonly icon: string;
  readonly baseValue: number;
  readonly keywords: string[];
  readonly type: StatusEffectType;
  readonly durationType: DurationType;
  readonly duration: number;
  readonly childStatusEffectIds: string[];
  readonly dynamicStat: StatusEffectValueType;
  readonly dynamicSkillId: string;
  readonly dynamicClassId: string;
  readonly intervalRateId: string;
  readonly overridePenetration: number;
  readonly damageTypeValue: DamageType;
  readonly description?: string;
  readonly attackHitType: HitType;

  /**
   * An extra value used by some status effect types
   */
  readonly extraValue: number;

  /**
   * An extra value used by some status effect types
   */
  readonly raceName: RaceType;

  /**
   * An extra value used by some status effect types
   */
  readonly statusEffectTypeValue: StatusEffectType;

  /**
   * An extra value used by some status effect types
   */
  readonly classValueId: string;

  /**
   * An extra value used by some status effect types
   */
  readonly weaponTypeValue: WeaponType;

  /**
   * An extra value used by some status effect types
   */
  readonly afflictionTypeValueId: string;
}
