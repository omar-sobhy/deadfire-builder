import type { ConditionalOperator } from "../../../types/enums/conditional-operator.js";

export type ConditionalType = 'class' | 'race' | 'subclass' | 'subrace';

export interface ConditionalDto {
  type: ConditionalType;
  parameter: string;
  not?: boolean;
  operator: ConditionalOperator;
}
