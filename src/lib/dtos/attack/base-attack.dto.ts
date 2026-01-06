import type { DamageType } from '../../../types/enums/damage-type.js';
import type { TargetType } from '../../../types/enums/target-type.js';
import type { CastSpeedDto } from './cast-speed.dto.js';
import type { RecoveryTimeDto } from './recovery-time.dto.js';

export interface BaseAttackDto {
  id: string;
  keywords: string[];
  attackDistance: number;
  minAttackDistance: number;
  castSpeed: CastSpeedDto;
  recoveryTime: RecoveryTimeDto;
  impactDelay: number;
  affectedTargetType: TargetType;
  affectedTargets: string[];
  pushDistance: number;
  accuracyBonus: number;
  penetrationRating: number;
  damageData: {
    type: DamageType;
    alternateDamageType: DamageType;
    minimum: number;
    maximum: number;
  };
  damageProcs: {
    type: DamageType;
    percentOfBaseDamage: number;
  }[];
}

export type GenericAttackDto = BaseAttackDto;
