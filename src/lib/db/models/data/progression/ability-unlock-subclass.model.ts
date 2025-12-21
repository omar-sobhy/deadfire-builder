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
import { SubclassModel } from '../character/subclass.model.js';
import { AbilityUnlockModel } from './ability-unlock.model.js';

export class AbilityUnlockSubclassModel extends Model<
  InferAttributes<AbilityUnlockSubclassModel>,
  InferCreationAttributes<AbilityUnlockSubclassModel>
> {
  declare id: CreationOptional<number>;

  declare abilityUnlock?: NonAttribute<AbilityUnlockModel>;
  declare subclass?: NonAttribute<SubclassModel>;

  declare getAbilityUnlock: BelongsToGetAssociationMixin<AbilityUnlockModel>;
  declare setAbilityUnlock: BelongsToSetAssociationMixin<
    AbilityUnlockModel,
    number
  >;

  declare getSubclass: BelongsToGetAssociationMixin<SubclassModel>;
  declare setSubclass: BelongsToSetAssociationMixin<SubclassModel, string>;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', autoIncrement: true, primaryKey: true },
      },
      { sequelize, underscored: true, tableName: 'ability_unlock_subclass' },
    );
  }

  public static setAssociations() {
    this.belongsTo(AbilityUnlockModel, {
      as: 'abilityUnlock',
    });

    this.belongsTo(SubclassModel, {
      as: 'subclass',
    });
  }
}
