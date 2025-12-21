import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import { SubraceModel } from '../character/subrace.model.js';
import { AbilityUnlockModel } from './ability-unlock.model.js';

export class AbilityUnlockSubraceModel extends Model<
  InferAttributes<AbilityUnlockSubraceModel>,
  InferCreationAttributes<AbilityUnlockSubraceModel>
> {
  declare id: CreationOptional<number>;

  declare abilityUnlock?: NonAttribute<AbilityUnlockModel>;
  declare subrace?: NonAttribute<SubraceModel>;

  declare getAbilityUnlock: BelongsToGetAssociationMixin<AbilityUnlockModel>;
  declare setAbilityUnlock: BelongsToSetAssociationMixin<
    AbilityUnlockModel,
    number
  >;

  declare getSubrace: BelongsToGetAssociationMixin<SubraceModel>;
  declare setSubrace: BelongsToSetAssociationMixin<SubraceModel, string>;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', autoIncrement: true, primaryKey: true },
      },
      { sequelize, underscored: true, tableName: 'ability_unlock_subrace' },
    );
  }

  public static setAssociations() {
    this.belongsTo(AbilityUnlockModel, {
      as: 'abilityUnlock',
    });

    this.belongsTo(SubraceModel, {
      as: 'subrace',
    });
  }
}
