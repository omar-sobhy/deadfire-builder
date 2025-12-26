import type { EffectAttachMode } from '../../../types/enums/effect-attach-mode.js';
import type { EffectAttachPoint } from '../../../types/enums/effect-attach-point.js';
import type { BaseAttackDto } from './base-attack.dto.js';

export interface AttackAuraDto extends BaseAttackDto {
  type: 'aura';
  duration: number;
  effectAttachMode: EffectAttachMode;
  effectAttachPoint: EffectAttachPoint;
}
