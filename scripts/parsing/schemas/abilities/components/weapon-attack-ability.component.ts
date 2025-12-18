import z from 'zod';
import { AbilityWeaponType } from '../../../../../src/types/enums/ability-weapon-type.ts';
import { AttackRangeCategory } from '../../../../../src/types/enums/attack-range-category.ts';
import { DefenseType } from '../../../../../src/types/enums/defense-type.ts';

export const weaponAttackAbilityComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.WeaponAttackAbilityComponent'),
  Type: z.enum(AbilityWeaponType),
  Range: z.enum(AttackRangeCategory),
  BonusDamageMultiplier: z.number(),
  BonusAccuracy: z.number(),
  BonusPenetration: z.number(),
  DefendedBy: z.enum(DefenseType),
});

export type WeaponAttackAbilityComponent = z.infer<
  typeof weaponAttackAbilityComponentSchema
>;
