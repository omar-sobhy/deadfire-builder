export interface BaseStatsDto {
  readonly id: string;
  readonly debugName: string;
  readonly isPlayerClass: boolean;
  readonly deflection: number;
  readonly fortitude: number;
  readonly reflex: number;
  readonly will: number;
  readonly meleeAccuracyBonus: number;
  readonly rangedAccuracyBonus: number;
  readonly health: number;
  readonly healthPerLevel: number;
}
