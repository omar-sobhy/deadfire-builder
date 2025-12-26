import type { StatusEffectOperator } from '../../../types/enums/status-effect-operator.js';
import type { StatusEffectType } from '../../../types/enums/status-effect-type.js';

export interface StatusEffectManagerEntryDto {
  statusEffectType: StatusEffectType;

  /**
   * Bit mask indicating which values are used
   */
  dataType: number;

  OperatorType: StatusEffectOperator;

  display?: string;

  wildcard?: string;

  attackFilterDisplayStyleId: string;

  attackTargetFilterDisplayStyleId: string;
}
