import type { BlastSize } from '../../../types/enums/blast-size.js';
import type { BaseAttackDto } from './base-attack.dto.js';

export interface AttackAoeDto extends BaseAttackDto {
  type: 'attack';
  blastSize: BlastSize;
  blastRadiusOverride: number;
  damageAngle: number;
  excludePrimaryTarget: boolean;
  ignoreParentTarget: boolean;
  excludeSelf: boolean;
  pushFromCaster: boolean;
}
