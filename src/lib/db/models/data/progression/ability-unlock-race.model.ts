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
import { RaceModel } from '../character/race.model.js';
import { AbilityUnlockModel } from './ability-unlock.model.js';

export class AbilityUnlockRaceModel extends Model<
  InferAttributes<AbilityUnlockRaceModel>,
  InferCreationAttributes<AbilityUnlockRaceModel>
> {
  declare id: CreationOptional<number>;

  declare abilityUnlock?: NonAttribute<AbilityUnlockModel>;
  declare race?: NonAttribute<RaceModel>;

  declare getAbilityUnlock: BelongsToGetAssociationMixin<AbilityUnlockModel>;
  declare setAbilityUnlock: BelongsToSetAssociationMixin<
    AbilityUnlockModel,
    number
  >;

  declare getRace: BelongsToGetAssociationMixin<RaceModel>;
  declare setRace: BelongsToSetAssociationMixin<RaceModel, string>;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', autoIncrement: true, primaryKey: true },
      },
      { sequelize, underscored: true, tableName: 'ability_unlock_race' },
    );
  }

  public static setAssociations() {
    this.belongsTo(AbilityUnlockModel, {
      as: 'abilityUnlock',
    });

    this.belongsTo(RaceModel, {
      as: 'race',
    });
  }
}
