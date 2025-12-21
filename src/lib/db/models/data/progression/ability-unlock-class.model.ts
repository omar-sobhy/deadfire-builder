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
import { ClassModel } from '../character/class.model.js';
import { AbilityUnlockModel } from './ability-unlock.model.js';

export class AbilityUnlockClassModel extends Model<
  InferAttributes<AbilityUnlockClassModel>,
  InferCreationAttributes<AbilityUnlockClassModel>
> {
  declare id: CreationOptional<number>;

  declare abilityUnlock?: NonAttribute<AbilityUnlockModel>;
  declare class?: NonAttribute<ClassModel>;

  declare getAbilityUnlock: BelongsToGetAssociationMixin<AbilityUnlockModel>;
  declare setAbilityUnlock: BelongsToSetAssociationMixin<
    AbilityUnlockModel,
    number
  >;

  declare getClass: BelongsToGetAssociationMixin<ClassModel>;
  declare setClass: BelongsToSetAssociationMixin<ClassModel, string>;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', autoIncrement: true, primaryKey: true },
      },
      { sequelize, underscored: true, tableName: 'ability_unlock_class' },
    );
  }

  public static setAssociations() {
    this.belongsTo(AbilityUnlockModel, {
      as: 'abilityUnlock',
    });

    this.belongsTo(ClassModel, {
      as: 'class',
    });
  }
}
