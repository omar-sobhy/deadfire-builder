import type { ConditionalOperator } from '../../../types/enums/conditional-operator.js';

export type ConditionalType = 'class' | 'race' | 'subclass' | 'subrace';

export function isRegularConditional(
  conditional: ConditionalDto,
): conditional is RegularConditionalDto {
  const all = ['class', 'race', 'subclass', 'subrace'];
  return all.includes(conditional.type);
}

export interface RegularConditionalDto {
  type: ConditionalType;
  parameter: string;
  not?: boolean;
  operator: ConditionalOperator;
}

export interface WeirdConditionalDto {
  type: 'always-false' | 'is-party-member';
  not?: boolean;
}

export type ConditionalDto = RegularConditionalDto | WeirdConditionalDto;
