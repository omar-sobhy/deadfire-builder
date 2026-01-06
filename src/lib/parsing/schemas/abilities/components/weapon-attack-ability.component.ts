import z from 'zod';
import { AbilityWeaponType } from '../../../../../types/enums/ability-weapon-type.js';
import { AttackRangeCategory } from '../../../../../types/enums/attack-range-category.js';
import { DefenseType } from '../../../../../types/enums/defense-type.js';

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
