import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import type { AbilityWeaponType } from '../../../../../types/enums/ability-weapon-type.js';
import type { AttackRangeCategory } from '../../../../../types/enums/attack-range-category.js';
import type { DefenseType } from '../../../../../types/enums/defense-type.js';

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

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        type: { type: 'string', allowNull: false },
        range: { type: 'string', allowNull: false },
        damageMultiplier: { type: 'number', allowNull: false },
        accuracy: { type: 'number', allowNull: false },
        penetration: { type: 'number', allowNull: false },
        defendedBy: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'weapon_attack_ability' },
    );
  }
}
