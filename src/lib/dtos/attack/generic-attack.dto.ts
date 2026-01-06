import type { AttackAoeDto } from './attack-aoe.dto.js';
import type { AttackAuraDto } from './attack-aura.dto.js';

export type GenericAttackDto = AttackAoeDto | AttackAuraDto;
