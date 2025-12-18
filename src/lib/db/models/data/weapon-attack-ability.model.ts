import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import type { AbilityWeaponType } from '../../../../types/enums/ability-weapon-type.js';
import type { AttackRangeCategory } from '../../../../types/enums/attack-range-category.js';
import type { DefenseType } from '../../../../types/enums/defense-type.js';

export class WeaponAttackAbilityModel extends Model<
  InferAttributes<WeaponAttackAbilityModel>,
  InferCreationAttributes<WeaponAttackAbilityModel>
> {
  declare id: string;
  declare type: AbilityWeaponType;
  declare range: AttackRangeCategory;
  declare damageMultiplier: number;
  declare accuracy: number;
  declare penetration: number;
  declare defendedBy: DefenseType;
}
