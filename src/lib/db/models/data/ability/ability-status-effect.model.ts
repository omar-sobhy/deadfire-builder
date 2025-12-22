import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { AbilityModel } from './ability.model.js';
import { StatusEffectModel } from './status-effect.model.js';

export class AbilityStatusEffectModel extends Model<
  InferAttributes<AbilityStatusEffectModel>,
  InferCreationAttributes<AbilityStatusEffectModel>
> {
  declare id: number;
  declare abilityId: ForeignKey<string>;
  declare statusEffectId: ForeignKey<string>;

  declare getAbility: BelongsToGetAssociationMixin<AbilityModel>;
  declare setAbility: BelongsToSetAssociationMixin<AbilityModel, string>;

  declare getStatusEffect: BelongsToGetAssociationMixin<StatusEffectModel>;
  declare setStatusEffect: BelongsToSetAssociationMixin<
    StatusEffectModel,
    string
  >;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', primaryKey: true, autoIncrement: true },
      },
      { sequelize, underscored: true, tableName: 'ability_status_effect' },
    );
  }

  public static setAssociations() {
    this.belongsTo(AbilityModel, {
      as: 'ability',
      foreignKey: 'ability_id',
    });

    this.belongsTo(StatusEffectModel, {
      as: 'statusEffect',
      foreignKey: 'status_effect_id',
    });
  }
}
