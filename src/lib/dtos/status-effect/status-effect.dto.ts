import type { DamageType } from '../../../types/enums/damage-type.js';
import type { DurationType } from '../../../types/enums/duration-type.js';
import type { StatusEffectValueType } from '../../../types/enums/status-effect-value-type.js';

export interface StatusEffectDto {
  readonly id: string;
  readonly debugName: string;
  readonly icon: string;
  readonly baseValue: number;
  readonly keywords: string[];
  readonly durationType: DurationType;
  readonly duration: number;
  readonly childStatusEffectIds: string[];
  readonly dynamicStat: StatusEffectValueType;
  readonly dynamicSkillId: string;
  readonly dynamicClassId: string;
  readonly intervalRateId: string;
  readonly extraValue: number;
  readonly overridePenetration: number;
  readonly damageTypeValue: DamageType;
}
