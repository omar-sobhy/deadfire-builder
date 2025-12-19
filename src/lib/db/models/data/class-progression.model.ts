import {
  Model,
  type HasManyAddAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { AbilityUnlockModel } from './ability-unlock.model.js';

export class ClassProgressionModel extends Model<
  InferAttributes<ClassProgressionModel>,
  InferCreationAttributes<ClassProgressionModel>
> {
  declare id: string;
  declare debugName: string;

  declare getAbilityUnlocks: HasManyGetAssociationsMixin<AbilityUnlockModel>;
  declare addAbilityUnlock: HasManyAddAssociationMixin<
    AbilityUnlockModel,
    number
  >;
  declare setAbilityUnlocks: HasManySetAssociationsMixin<
    AbilityUnlockModel,
    number
  >;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'class_progression' },
    );
  }

  public static setAssociations() {
    this.hasMany(AbilityUnlockModel, {
      as: 'abilityUnlocks',
      foreignKey: 'class_progression_id',
      sourceKey: 'id',
    });
  }
}
